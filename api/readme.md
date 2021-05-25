# Deploying service
kubectl create -f deployment.yml --save-config

kubectl expose deployment node-app --type="LoadBalancer"