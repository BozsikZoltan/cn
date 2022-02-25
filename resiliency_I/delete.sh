#!/bin/bash

kubectl delete deployment resiliency1-bad
kubectl delete deployment resiliency1-good-circuit-breaker
kubectl delete deployment resiliency1-good-exponential-backoff
kubectl delete deployment resiliency1-good
kubectl delete deployment resiliency1-key-store
kubectl delete service resiliency1-bad
kubectl delete service resiliency1-good-circuit-breaker
kubectl delete service resiliency1-good-exponential-backoff
kubectl delete service resiliency1-good
kubectl delete service resiliency1-key-store
