FROM alpine

COPY ./dist/drone-doumark /bin/doumark

ENTRYPOINT [ "doumark" ]