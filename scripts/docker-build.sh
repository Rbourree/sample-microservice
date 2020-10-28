#!/bin/bash
export $(cat .env | xargs)
docker build -t sample_api .