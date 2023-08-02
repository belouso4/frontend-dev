FROM node:14-alpine

WORKDIR /src

COPY . .

RUN apk update && apk upgrade && apk add git

COPY package.json .

RUN rm -rf node_modules & rm -f package-lock.json & rm -f yarn.lock

RUN npm install && npm cache clean --force

RUN npm run build -prod

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
#
ENV NODE_ENV=production

CMD [ "npm", "run", "start" ]
