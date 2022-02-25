#!/bin/bash

kubectl apply -f manifests/key-store.yaml
kubectl apply -f manifests/key-store-debounce.yaml
kubectl apply -f manifests/key-store-throttle.yaml
