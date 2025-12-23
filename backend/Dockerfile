FROM node:24

# Instala openssl para o Prisma funcionar no ambiente Linux do Docker
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# O Prisma precisa gerar o client baseado no schema
RUN npx prisma generate

EXPOSE 3333

CMD ["npm", "run", "dev"]