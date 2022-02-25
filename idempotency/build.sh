#!/bin/bash

eval $(minikube docker-env)

docker build -t idempotency-good good-approach/.
docker build -t idempotency-bad bad-approach/.
