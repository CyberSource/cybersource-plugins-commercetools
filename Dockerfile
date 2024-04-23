FROM --platform=linux/amd64 node:18

WORKDIR /app
COPY . /app

RUN npm install

RUN npm run build

CMD ["node","build/main/index.js"]