FROM node:18 as builder
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18

WORKDIR /usr/src/hbf_api_tests
COPY --from=builder /usr/src/app/build .
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/gRPC/control.proto ../gRPC/
CMD ["node", "index.js"]