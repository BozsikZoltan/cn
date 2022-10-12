#!/bin/bash

eval $(minikube docker-env)         
docker build -t architectural-logger-hexagonal logger/.
docker build -t architectural-key-store-hexagonal key-store-hexagonal/.
docker build -t architectural-hexagonal good-approach-hexagonal/.
docker build -t architectural-queue-loose-coupled queue/.     
docker build -t architectural-key-store-loose-coupled key-store-loose-coupling/.
docker build -t architectural-loose-coupled good-approach-loose-coupling/.
docker build -t architectural-key-store key-store/.  
docker build -t architectural-bad bad-approach/.

