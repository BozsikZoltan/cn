#!/bin/bash
                                
kubectl apply -f manifests/good-approach-hexagonal.yaml   
kubectl apply -f manifests/good-approach-loose-coupled.yaml
kubectl apply -f manifests/bad-approach.yaml
