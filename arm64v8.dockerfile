FROM alpine AS builder

# Download QEMU, see https://github.com/docker/hub-feedback/issues/1261
ENV QEMU_URL https://github.com/balena-io/qemu/releases/download/v3.0.0%2Bresin/qemu-3.0.0+resin-aarch64.tar.gz
RUN apk add curl && curl -L ${QEMU_URL} | tar zxvf - -C . --strip-components 1


FROM node@sha256:4ca3af6bd9e78186e223038c4eb45ce5f71ec01fe81e4012c4dabd9bc224ed2a AS node-12.12.0-alpine

COPY --from=builder qemu-aarch64-static /usr/bin

RUN mkdir -p /app

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install --production && npm cache clean --force

COPY . .

CMD ["node", "index.js"]
