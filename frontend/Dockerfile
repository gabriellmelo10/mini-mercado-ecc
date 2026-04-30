# Estágio de Build
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de Produção (Nginx para servir os arquivos estáticos)
FROM nginx:stable-alpine
# Copia o build do Vite para a pasta padrão do Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copia uma configuração customizada para o Nginx lidar com rotas SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
