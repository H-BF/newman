FROM node:18-alpine as builder
WORKDIR /usr/src/app
COPY *.json .
RUN npm ci
ADD . .
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build ./build
ADD  ./gRPC/control.proto ./gRPC/control.proto
ADD *.json .
RUN npm ci --only=production
CMD ["node", "./build/index.js"]