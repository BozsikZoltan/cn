#!/bin/bash

# Running from the cn directory!

eval $(minikube docker-env)
cd immutability
./build.sh
cd ../idempotency
./build.sh
cd ../resiliency_I
./build.sh
cd ../resiliency_II
./build.sh
cd ../architectural
./build.sh