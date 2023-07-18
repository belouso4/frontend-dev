FROM node:14-alpine

RUN mkdir -p /app
COPY . /app
WORKDIR /app

RUN apk update && apk upgrade && apk add git

COPY package.json /app

#RUN npm rebuild

RUN rm -rf node_modules & rm -f package-lock.json & rm -f yarn.lock

RUN npm install && npm cache clean --force

COPY . /app
RUN npm run build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
#
#ENV NODE_ENV=production

#CMD [ "npm", "start" ]





