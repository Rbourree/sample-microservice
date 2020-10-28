#!/bin/bash

export $(cat .env | xargs)
docker run \
    --rm \
    -it --env-file .env \
    --name sample_api \
    --network sample \
    --link postgres \
    -v $PWD/server.js:/usr/src/app/server.js \
    -v $PWD/Configs:/usr/src/app/Configs \
    -v $PWD/Controllers:/usr/src/app/Controllers \
    -v $PWD/Libs:/usr/src/app/Libs \
    -v $PWD/Models:/usr/src/app/Models \
    -p $PORT:$PORT \
    sample_api