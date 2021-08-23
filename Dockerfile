FROM node:14-alpine

WORKDIR /app
ADD fs .
RUN npm ci

ENTRYPOINT [ "node", "app.js" ]
