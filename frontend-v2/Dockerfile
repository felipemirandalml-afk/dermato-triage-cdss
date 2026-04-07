# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY frontend-v2/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código (asumiendo que el contexto es la raíz o frontend-v2)
# Ajustamos para que funcione si se buildea desde frontend-v2
COPY frontend-v2/ .

# Construir la aplicación
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

# Copiar los archivos construidos al directorio de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
