# Usa la imagen oficial de Node.js
FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del proyecto
COPY . .

# Expone el puerto que usa la app
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "src/server.js"]

