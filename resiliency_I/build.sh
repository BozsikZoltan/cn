#!/bin/bash

pwd
eval $(minikube docker-env)
docker build -t key-store key-store/.
docker build -t resiliency_1-good-eb good-approach-eb/.
docker build -t resiliency_1-good-cb good-approach-cb/.
docker build -t resiliency_1-bad bad-approach/.
