FROM node:20

WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Copia la carpeta prisma primero para poder generar el cliente
COPY prisma ./prisma

# Instala dependencias
RUN npm install

# Genera el cliente de Prisma
RUN npx prisma generate

# Copia el resto del proyecto
COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]

