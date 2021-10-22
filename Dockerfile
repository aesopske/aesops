# build environment
FROM node:12-alpine as builder

RUN apk add --no-cache --virtual \
      .build-deps \
      bash \
      gcc \
      g++ \
      ca-certificates \
      lz4-dev \
      musl-dev \
      cyrus-sasl-dev \
      openssl \
      openssl-dev \
      zlib-dev \
      libc-dev \
      bsd-compat-headers \
      make \
      python \
      py-setuptools


RUN mkdir -p /home/aesops
WORKDIR /home/aesops

COPY . /home/aesops
RUN yarn run install:all
RUN yarn run build
RUN yarn i -g pm2

EXPOSE 5000
CMD [ "pm2","start 'yarn run start:prod'","--name app" ]

