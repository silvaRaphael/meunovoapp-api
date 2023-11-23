FROM 21-alpine3.17 as builder

WORKDIR /usr/src/app

COPY package.*json ./

RUN npm install

COPY . .

RUN npm run build

FROM 21-alpine3.17

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

RUN npm install --production

EXPOSE 3000

CMD [ "npm", "start" ]