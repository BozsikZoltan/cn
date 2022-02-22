#!/bin/bash

kubectl apply -f manifests/key-store.yaml
kubectl apply -f manifests/good-approach.yaml
kubectl apply -f manifests/bad-approach.yaml
