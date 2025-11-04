'use strict';

require('dotenv').config();
const http = require('http');
const app = require('./app');
require('./utils/auth/index');
const channelMemberService = require('./services/channelMembers.service')
const userService = require('./services/users.service')
const WsService = require("./services/ws.service");
const PORT = Number(process.env.PORT) || 3000;
const server = http.createServer(app);

// montar ws service
new WsService(server, { channelMemberService, userService });

server.listen(PORT, "0.0.0.0", () => {
  console.log(`YonkiToki API en http://0.0.0.0:${PORT}`);
  console.log(`YonkiToki API DOC en http://0.0.0.0:${PORT}/docs/#/`);
});
