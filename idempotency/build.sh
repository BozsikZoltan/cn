#!/bin/bash

eval $(minikube docker-env)

docker build -t idempotecy-good good-approach/.
docker build -t idempotecy-bad bad-approach/.
