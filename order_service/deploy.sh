kubectl create namespace cloudstate
kubectl apply -n cloudstate -f https://raw.githubusercontent.com/cloudstateio/cloudstate/v0.6.0/operator/cloudstate.yaml
kubectl create -f deployment.yml --save-config