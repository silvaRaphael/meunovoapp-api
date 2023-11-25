FROM node:lts-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:lts-alpine as production

WORKDIR /app

COPY --from=builder /app/build ./build
COPY package*.json ./
COPY prisma ./
COPY .env ./

RUN npm install --omit=dev

CMD ["npm", "start"]

FROM builder as dev

EXPOSE 3333

CMD ["npm", "run", "dev"]
