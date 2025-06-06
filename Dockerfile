FROM node:latest

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "npm install ; npm run dev"]