FROM node:alpine as build

RUN npm ci && npm run build

FROM alpine

COPY --from=build ./dist/doumark /bin/doumark 

ENTRYPOINT [ "doumark" ]