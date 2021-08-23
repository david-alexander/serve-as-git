FROM node:14-alpine

RUN apk add git

WORKDIR /app
ADD fs .
RUN npm ci

ENTRYPOINT [ "node", "app.js" ]
