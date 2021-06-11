# WSDM-2
## Deploying with our Docker Images
To deploy the full architecture, you can simple run the `deploy.sh` script, which will make the API accessible at localhost:3000.

To deploy each service separately, you can take a look in the `README.md` of each service.

If you create your own `.yml` files to, make sure to update the url of the service in `api/urls.js`

## Creating your own Docker Images
To create your own Docker Image, go to the service you want to create a Docker Image for and execute the following command: `docker build . -t YOUR_IMAGE_NAME && docker push YOUR_IMAGE_NAME`. Next update the image name in the `deployment.yml` file. 