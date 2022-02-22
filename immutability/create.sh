#!/bin/bash

kubectl apply -f manifests/redis.yaml
kubectl apply -f manifests/single-good-approach.yaml
kubectl apply -f manifests/single-bad-approach.yaml
kubectl apply -f manifests/multi-good-approach.yaml
kubectl apply -f manifests/multi-bad-approach.yaml
