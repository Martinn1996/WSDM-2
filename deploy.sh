kubectl create namespace cloudstate

kubectl apply -f https://raw.githubusercontent.com/cloudstateio/cloudstate/v0.6.0/operator/cloudstate.yaml

kubectl create -f api/deployment.yml --save-config
kubectl create -f order_service/deployment.yml --save-config
kubectl create -f payment_service/deployment.yml --save-config
kubectl create -f stock_service/deployment.yml --save-config
kubectl expose deployment cloudstate-api --type="LoadBalancer"

