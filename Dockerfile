FROM node:16-alpine3.14

WORKDIR /app
COPY . /app

RUN npm install

RUN npm run build

CMD ["node","build/main/index.js"]