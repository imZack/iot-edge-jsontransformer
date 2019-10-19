FROM alpine AS builder

# Download QEMU, see https://github.com/docker/hub-feedback/issues/1261
ENV QEMU_URL https://github.com/balena-io/qemu/releases/download/v3.0.0%2Bresin/qemu-3.0.0+resin-arm.tar.gz
RUN apk add curl && curl -L ${QEMU_URL} | tar zxvf - -C . --strip-components 1


FROM node@sha256:4bfcec4c7170f2b296ad1668cdbd88851b7e198736a01c8178cc2bae3b75367f AS node-12.12.0-alpine

COPY --from=builder qemu-arm-static /usr/bin

RUN mkdir -p /app

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install --production && npm cache clean --force

COPY . .

CMD ["node", "index.js"]
