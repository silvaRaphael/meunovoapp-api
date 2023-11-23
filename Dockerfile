FROM node:lts-alpine as builder

WORKDIR /usr/src/app

COPY package.*json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:lts-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build ./build
COPY package*.json ./
COPY prisma ./

RUN npm install --production

EXPOSE 3000

CMD [ "npm", "start" ]