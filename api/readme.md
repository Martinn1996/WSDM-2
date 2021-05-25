# Deploying service
`cd api`
`kubectl create -f deployment.yml --save-config`
`kubectl expose deployment cloudstate-api --type="LoadBalancer"`