# Deploying service
To deploy the service internally, run the following command.

`kubectl create -f deployment.yml --save-config`

To expose the GRPC service at `localhost:2001`, uncomment the bottom part of the `deployment.yml` file