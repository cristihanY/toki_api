const WebSocket = require("ws");

class WsService {
  constructor(server, { channelMemberService, userService }) {
    this.wss = new WebSocket.Server({ server });
    this.userService = userService;
    this.channelMemberService = channelMemberService;
    this.clients = new Map(); // ws -> { userId, channels: Set }

    this.wss.on("connection", (ws) => this.onConnection(ws));
    console.log("🚀 WebSocket Service inicializado");
  }

  async onConnection(ws) {
    console.log("🔌 Nuevo cliente conectado...");

    ws.on("message", async (data, isBinary) => {
      if (!isBinary) {
        // 📩 Mensaje de control JSON
        try {
          const msg = JSON.parse(data.toString());
          await this.handleControlMessage(ws, msg);
        } catch (err) {
          console.error("⚠️ Error al parsear mensaje JSON:", err);
        }
        return;
      }

      // 🎧 Procesar mensaje binario (audio)
      const buffer = Buffer.from(data);
      if (buffer.length < 16) {
        console.warn("⚠️ Paquete inválido (demasiado corto)");
        return;
      }

      const { userId, channelId, audioChunk } = this.decodePacket(buffer);

      // 🔎 Si no está registrado, cargar canales del usuario
      if (!this.clients.has(ws)) {
        const userChannels = await this.channelMemberService.getUserChannels(userId);
        console.log("USER CHANNEL ", userChannels)
        this.clients.set(ws, { userId, channels: new Set(userChannels) });
        console.log(`👤 Usuario ${userId} registrado automáticamente. Canales: ${[...userChannels].join(", ")}`);
        this.printActiveClients();
        this.broadcastUserCount(channelId);
      }

      // 🎵 Procesar audio
      if (audioChunk.length > 0) {
        const toc = audioChunk[0];
        const isOpusSize = audioChunk.length >= 20 && audioChunk.length <= 400;

        console.log(
          `🎵 Chunk recibido: userId=${userId}, channelId=${channelId}, tamaño=${audioChunk.length}, TOC=0x${toc.toString(16)}, esOpus=${isOpusSize}`
        );

        this.broadcastToChannel(ws, buffer, channelId);
      }
    });

    ws.on("close", () => {
      const meta = this.clients.get(ws);
      this.clients.delete(ws);
      console.log(`❌ Cliente desconectado (userId=${meta?.userId})`);
      if (meta?.channels) {
        for (const channelId of meta.channels) {
          this.broadcastUserCount(channelId);
        }
      }
      this.printActiveClients();
    });
  }

  // 🧩 Decodifica un paquete binario
  decodePacket(buffer) {
    const userIdBigInt = buffer.readBigUInt64BE(0);
    const channelIdBigInt = buffer.readBigUInt64BE(8);
    const userId = Number(userIdBigInt);
    const channelId = Number(channelIdBigInt);
    const audioChunk = buffer.slice(16);
    return { userId, channelId, audioChunk };
  }

  // 📡 Retransmite audio dentro del canal
  broadcastToChannel(sender, buffer, channelId) {
    const senderMeta = this.clients.get(sender);
    for (const [client, meta] of this.clients.entries()) {
      if (
        client !== sender &&
        client.readyState === WebSocket.OPEN &&
        meta.channels.has(channelId)
      ) {
        client.send(buffer);
        console.log(
          `📡 Retransmitido de userId=${senderMeta?.userId} → userId=${meta.userId} en channelId=${channelId}`
        );
      }
    }
  }

  // 🧠 Mensajes JSON de control
  async handleControlMessage(ws, msg) {
    console.log("MSG", msg)
    switch (msg.type) {
      case "REGISTER": {
        const { userId } = msg;
        const user = await this.userService.getUserByIdLite(userId);
        console.log("USER ", user)
        const userChannels = await this.channelMemberService.getUserChannels(userId);
        console.log("USER CHANNEL ", userChannels)
        this.clients.set(ws, { userId, userName: user.displayName, channels: new Set(userChannels) });
        console.log(`👤 Usuario ${userId} registrado vía REGISTER. Canales: ${[...userChannels].join(", ")}`);

        this.printActiveClients();

        for (const ch of userChannels) {
          this.broadcastUserCount(ch);
        }

        ws.send(JSON.stringify({ type: "WELCOME", userId }));
        break;
      }

      case "ACTIVATE_CHANNEL": {
        const { userId, channelId } = msg;
        const meta = this.clients.get(ws);
        if (!meta) return;

        meta.channels.add(channelId);
        console.log(`✅ Usuario ${userId} ACTIVADO en canal ${channelId}`);

        this.broadcastUserCount(channelId);
        this.printActiveClients();
        break;
      }

      case "DEACTIVATE_CHANNEL": {
        const { userId, channelId } = msg;
        const meta = this.clients.get(ws);
        if (!meta) return;

        meta.channels.delete(channelId);
        console.log(`🚫 Usuario ${userId} DESACTIVADO del canal ${channelId}`);

        this.broadcastUserCount(channelId);
        this.printActiveClients();
        break;
      }

      case "PING":
        ws.send(JSON.stringify({ type: "PONG", time: Date.now() }));
        break;

      default:
        console.warn("⚠️ Tipo de mensaje desconocido:", msg);
    }
  }

  // 👥 Envía a todos los miembros del canal cuántos usuarios hay conectados
  broadcastUserCount(channelId) {
    const users = [];

    for (const meta of this.clients.values()) {
      if (meta.channels.has(channelId)) {
        users.push({
          userId: meta.userId,
          userName: meta.userName,
        });
      }
    }

    const message = JSON.stringify({
      type: "USER_COUNT",
      channelId,
      count: users.length,
      users, // lista de objetos userId + userName
    });

    for (const [client, meta] of this.clients.entries()) {
      if (meta.channels.has(channelId) && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }

    console.log(`📊 Canal ${channelId} tiene ${users.length} usuarios conectados`);
    console.log("👥 Usuarios en el canal:", users);
  }

  // 🧾 Muestra lista de usuarios conectados
  printActiveClients() {
    const list = Array.from(this.clients.values()).map((c) => ({
      userId: c.userId,
      userName: c.userName,
      channels: [...c.channels],
    }));
    console.log("📋 Usuarios conectados actualmente:", list);
  }
}

module.exports = WsService;
