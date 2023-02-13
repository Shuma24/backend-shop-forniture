FROM node:latest

WORKDIR /app

EXPOSE 5222

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]