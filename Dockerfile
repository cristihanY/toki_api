# Usa la imagen oficial de Node.js
FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Genera el cliente de Prisma
RUN npx prisma generate

# (Opcional) Ejecuta migraciones al iniciar el contenedor
# Esto creará las tablas en PostgreSQL según tu esquema
# RUN npx prisma migrate deploy

# Copia el resto del proyecto
COPY . .

# Expone el puerto que usa la app
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "src/server.js"]

