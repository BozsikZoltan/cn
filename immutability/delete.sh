#!/bin/bash

kubectl delete deployment immutability-bad
kubectl delete deployment immutability-good  
kubectl delete deployment immutability-bad-multi
kubectl delete deployment immutability-good-multi
kubectl delete deployment redis
kubectl delete service immutability-bad
kubectl delete service immutability-good
kubectl delete service immutability-bad-multi
kubectl delete service immutability-good-multi
kubectl delete service redis
