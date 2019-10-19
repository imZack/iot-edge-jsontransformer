FROM node:12.12.0-alpine

RUN mkdir -p /app

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install --production && npm cache clean --force

COPY . .

CMD ["node", "index.js"]
