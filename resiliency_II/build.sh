#!/bin/bash

eval $(minikube docker-env)
docker build -t resiliency2-key-store key-store/.
docker build -t resiliency2-server server/.
docker build -t resiliency2-server-all server-all/.
