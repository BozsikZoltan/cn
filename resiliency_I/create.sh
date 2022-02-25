#!/bin/bash

kubectl apply -f manifests/key-store.yaml
kubectl apply -f manifests/good-approach.yaml
kubectl apply -f manifests/good-approach-exponential-backoff.yaml
kubectl apply -f manifests/good-approach-circuit-breaker.yaml
kubectl apply -f manifests/bad-approach.yaml
