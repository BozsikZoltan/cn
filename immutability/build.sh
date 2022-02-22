#!/bin/bash

eval $(minikube docker-env)
kubectl apply -f manifests/redis.yaml
docker build -t immutability-good good-approach/.
docker build -t immutability-bad bad-approach/.
