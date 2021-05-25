# WSDM-2
To deploy the service

Add Cloudstate operatior
`kubectl create namespace cloudstate`
`kubectl apply -f https://raw.githubusercontent.com/cloudstateio/cloudstate/v0.6.0/operator/cloudstate.yaml`

Add stock service
`cd stock_service`
`kubectl create -f deployment.yml --save-config`

Add Api
`cd api`
`kubectl create -f deployment.yml --save-config`
`kubectl expose deployment cloudstate-api --type="LoadBalancer"`
