FROM node:18-alpine

WORKDIR /usr/app
COPY package*.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
COPY . .
EXPOSE 8000
CMD ["node", "server.js"]