#!/bin/bash

kubectl delete deployment architectural-bad
kubectl delete deployment architectural-key-store
kubectl delete deployment architectural-loose-coupled
kubectl delete deployment architectural-key-store-loose-coupled
kubectl delete deployment architectural-queue-loose-coupled
kubectl delete deployment architectural-hexagonal
kubectl delete deployment architectural-key-store-hexagonal
kubectl delete deployment architectural-logger-hexagonal
kubectl delete service architectural-bad
kubectl delete service architectural-key-store
kubectl delete service architectural-loose-coupled
kubectl delete service architectural-key-store-loose-coupled
kubectl delete service architectural-queue-loose-coupled
kubectl delete service architectural-hexagonal
kubectl delete service architectural-key-store-hexagonal
kubectl delete service architectural-logger-hexagonal