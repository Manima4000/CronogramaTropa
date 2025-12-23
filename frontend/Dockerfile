FROM node:24

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Usando --host para o Vite permitir conexões externas ao container
CMD ["npm", "run", "dev", "--", "--host"]