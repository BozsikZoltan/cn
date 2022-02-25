#!/bin/bash

kubectl delete deployment resiliency1-bad
kubectl delete deployment resiliency1-good-cb
kubectl delete deployment resiliency1-good-eb
kubectl delete deployment resiliency1-good
kubectl delete deployment resiliency1-key-store
kubectl delete service resiliency1-bad
kubectl delete service resiliency1-good-cb
kubectl delete service resiliency1-good-eb
kubectl delete service resiliency1-good
kubectl delete service resiliency1-key-store
