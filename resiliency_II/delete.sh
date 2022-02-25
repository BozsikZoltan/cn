#!/bin/bash

kubectl delete deployment resiliency2-server-throttle
kubectl delete deployment resiliency2-key-store-throttle
kubectl delete deployment resiliency2-server-debounce
kubectl delete deployment resiliency2-key-store-debounce  
kubectl delete deployment resiliency2-server-all
kubectl delete deployment resiliency2-key-store
kubectl delete service resiliency2-server-throttle
kubectl delete service resiliency2-key-store-throttle
kubectl delete service resiliency2-server-debounce
kubectl delete service resiliency2-key-store-debounce
kubectl delete service resiliency2-server-all
kubectl delete service resiliency2-key-store
