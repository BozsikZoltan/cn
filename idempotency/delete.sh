#!/bin/bash
                                          
kubectl delete deployment idempotency-bad
kubectl delete deployment idempotency-good 
kubectl delete service idempotency-bad
kubectl delete service idempotency-good
