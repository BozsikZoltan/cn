# Basic commands

## Start Minikube with virtual machine
minikube start --vm-driver="virtualbox"

## Exports to configure your local environment to re-use the Docker daemon inside the Minikube instance
eval $(minikube docker-env) 											# in the host if you use sudo with <docker_command>, it will use host's Docker daemon!

## Building and storing docker image to the Minikube's local repo (previuos step needed before this)
docker build -t <desired_image_name> <path_to_the_docker_file>  						# <desired_image_name> should match with the image in the corresponding manifest file!

## Remove image from docker
sudo docker image rm [options] <docker_image_name>						 		# [options] {-f (Force removal of the image); --no-prune (Do not delete untagged parents)}

## Getting Minikube's docker images
minikube ssh
sudo docker images

## Process manifest file (with .yaml extensions)
kubectl apply -f <path_to_file>/<file_name_with extension>

## List deployments
kubectl get deployments

## List services
kubectl get services

## List pods
kubectl get pods

## List everything
kubectl get all

## List enviromental variables
kubectl exec <pod_name> -- printenv

## Get descripion
kubectl describe <resource> [resouce_identifier]								# <resource> {all, services, deployments, pods,..}; [resouce_identifier] optional, for specific search

## Delete deployment
kubectl delete deployment <deployment_name>

## Delete service
kubectl delete service <service_name>

## Delete pod
kubectl delete pod <pod_name>

## Open service in browser
minikube service <service_name> [options]									# [options] {--url (only gives the access url)}

## Reset deployment
kubectl rollout restart deployment <deployment_name>

## Resize deploment's replicas
kubectl scale --replicas=0 deployment/<deployment_name>

## Get application logs from pod
kubectl logs [options] <pod_name>										# [options] {-f (stream)}

# Hints (from resiliency I directory)

## Run server
minikube start --vm-driver="virtualbox"

## Build images
eval $(minikube docker-env)
docker build -t key-store key-store/.
docker build -t resiliency_1-good good-approach/.
docker build -t resiliency_1-bad bad-approach/.

## Setup deployments for single-single test scenario
kubectl apply -f manifests/key-store.yaml
kubectl apply -f manifests/good-approach.yaml
kubectl apply -f manifests/bad-approach.yaml

## Open in browser
minikube service resiliency1-good
minikube service resiliency1-bad

## Test exponential backoff (after build & deploy)
minikube service resiliency1-good				# Open in browser
kubectl scale --replicas=0 deployment/key-store		# Close the key-store
give some input in the brower (for example: set key 'c' with value 5)
kubectl scale --replicas=1 deployment/key-store		# Reopen the key-store

