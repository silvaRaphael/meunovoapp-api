FROM node:lts-alpine as builder

WORKDIR /usr/src/app

COPY package.*json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build ./build
COPY package*.json ./

RUN npm install --production

EXPOSE 3000

CMD ["sh", "-c", "npm run migrate && npm start"]