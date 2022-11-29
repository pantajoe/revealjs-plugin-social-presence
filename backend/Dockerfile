FROM node:16.15.1-alpine

WORKDIR /usr/src/app

RUN apk add --update bash curl tar xz ca-certificates

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

# Compile project
RUN yarn build

CMD ["yarn", "start:prod"]
