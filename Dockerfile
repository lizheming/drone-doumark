FROM node:alpine as build

WORKDIR /opt/douban

COPY . .

RUN npm install && npm run build

FROM alpine

COPY --from=build /opt/douban/dist/doumark /bin/doumark

ENTRYPOINT [ "doumark" ]