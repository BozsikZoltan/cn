#!/bin/bash

eval $(minikube docker-env)
docker build -t resiliency1-key-store key-store/.
docker build -t resiliency1-good good-approach/.
docker build -t resiliency1-good-exponential-backoff good-approach-exponential-backoff/.
docker build -t resiliency1-good-circuit-breaker good-approach-circuit-breaker/.
docker build -t resiliency1-bad bad-approach/.
