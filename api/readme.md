# Deploying service
To deploy the API, run the following commands.

`kubectl create -f deployment.yml --save-config`

`kubectl expose deployment cloudstate-api --type="LoadBalancer"`

To change the amount of API nodes we want to run, you can change the replicas field in `deployment.yml`