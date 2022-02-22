#!/bin/bash

kubectl delete deployment resiliency1-bad    
kubectl delete deployment resiliency1-good
kubectl delete deployment key-store 
kubectl delete service resiliency1-bad 
kubectl delete service resiliency1-good
kubectl delete service key-store
