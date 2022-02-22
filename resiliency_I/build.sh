#!/bin/bash

pwd
eval $(minikube docker-env)
docker build -t key-store key-store/.
docker build -t resiliency_1-good good-approach/.
docker build -t resiliency_1-bad bad-approach/.
