#!/bin/bash

eval $(minikube docker-env)
docker build -t resiliency1-key-store key-store/.
docker build -t resiliency1-good good-approach/.
docker build -t resiliency1-good-eb good-approach-eb/.
docker build -t resiliency1-good-cb good-approach-cb/.
docker build -t resiliency1-bad bad-approach/.
