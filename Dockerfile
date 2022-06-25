FROM alpine

COPY ./dist/doumark /bin/doumark

ENTRYPOINT [ "doumark" ]