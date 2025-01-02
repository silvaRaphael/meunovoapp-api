FROM node:lts-alpine as builder

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:lts-alpine as production

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma 
COPY --from=builder /app/.env ./
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

CMD ["npm", "start"]

FROM builder as dev

EXPOSE 3333

CMD ["npm", "run", "dev"]
