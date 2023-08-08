FROM node:18 as BUILDER
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18
WORKDIR /usr/src/hbf_api_tests
COPY --from=BUILDER /usr/src/app/build .
COPY --from=BUILDER /usr/src/app/node_modules ./node_modules
COPY ./swarm.json .
COPY ./testdata.sql .
CMD ["node", "index.js"]