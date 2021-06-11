kubectl create namespace cloudstate

kubectl apply -n cloudstate -f https://raw.githubusercontent.com/cloudstateio/cloudstate/v0.6.0/operator/cloudstate.yaml

kubectl create -n cloudstate -f api/deployment.yml --save-config
kubectl create -n cloudstate -f order_service/deployment.yml --save-config
kubectl create -n cloudstate -f payment_service/deployment.yml --save-config
kubectl create -n cloudstate -f stock_service/deployment.yml --save-config
kubectl expose deployment cloudstate-api --type="LoadBalancer"

