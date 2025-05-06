# Deploying Extension as a Docker Image on Azure Container Instance(ACI)

The Docker Azure Integration enables developers to use native Docker commands to run applications in Azure Container Instances (ACI) when building cloud-native applications. Using docker compose, the Cybersource-Commercetools Extension can be deployed into the Azure Container Instance easily. For this, the docker image of the extension has to built and the same has to be pushed into the Azure Container registry.

## Pre-Requisites

1. Download and install the latest version of Docker Desktop.

2. Ensure you have an active Azure subscription.

3. Download and install Azure CLI.

## Steps for running the docker image of extension in Azure

### Step 1. Build the docker image using the following command

Leave the docker desktop as open/connected and navigate to the root directory of extension and run the following command to create docker image

        docker build -t <imageName> .

### Step 2. Push the image in azure container registry

Run the following commands in your command prompt

-  To login into your azure account, enter below command     
        
        az login

This will redirect you to Azure portal in web. Login to your active azure account with your credentials

- In order to create a container registry, first you need to create a resource group. Use the following command to create a resource group.

    	az group create --name <name of resource group> --location <any valid location>

e.g: az group create --name myResourceGroup --location eastus

- Once the resource group is created, you need to create the Azure Container Registry using the resource group, created in above step.

        az acr create --resource-group <name of resource group>  --name <name of ACR> --sku Basic

eg: az acr create --resource-group myResourceGroup --name myContainerRegistry --sku Basic

- Use the following command to login once the ACR is created successfully, use name of ACR created in above step

        az acr login --name <name of ACR>

- After this step, you need to do docker login for the registry server. The ACR Login Server url can be found in the azure portal, under `Container Registries` --> `Your ACR` --> `Overview` --> `Login server`

        docker login <ACR Login Server>

This will ask you to authenticate with the username and password. If admin access is not enabled for this registry, login to your azure account, navigate to your ACR(to the section Access Keys) to enable it and use the username and password displayed there.

- Once your access is authenticated successfully, you can push the image to the registry. Tag the image with the name of the registry server as follows

        docker tag <imageID> <imageTagName>

in which the `imageTagName` is <acr_login_server>/any_unique_name

- After tagging the image, push the tagged image into the container registry using the following command

        docker push <imageTagName>

The images pushed can be found under `Container Registry` --> `Repositories`

### Step 3. Create an azure container instance

- Sign in to the Azure portal.

- On the Azure portal homepage, select Create a resource.

- Select Containers > Container Instances.

- On the Basics tab, choose a subscription and enter the following values for `Resource group`, `Container name` and `Image source`.

Resource group: select existing resource group which was created in above step

Container name: enter container name, name must be unique in the current resource group.

Region : enter location which was used in above step

Image source: Choose Azure Container Registry and choose Registry, image and image tag, choose those values which were created in above steps

- On the Networking tab, specify a DNS name label for your container. The name must be unique within the Azure region where you create the container instance. DNS name label be part of FQDN which can be used to access the container.

- Choose Resource Group for DNS name label scope reuse field. This prevents malicious subdomain takeover and ensures that the FQDN can only be reused within the selected scope.

- On Advanced tab, under Environment variables, provide key and value of your environment variables.

- Leave all other settings as their defaults, then select `Review + create`. Once validation is successful , select `Create` to submit your container deployment request.

- Once "Your deployment is complete" message is displayed, click on `Go to resource`.

- Once status of container instance is Running, navigate to the container's FQDN in your browser. 

- Alternatively, you can access your container instance by navigating to, login to `azure portal` --> `Container Instances` --> `Your Instance` and see the details about the container in which you extension is hosted.

- FQDN of container instance will be used as destination URL for extension.

- In order to change anything from the configuration, you need to do it by using `deploy-aci.yaml` file by following  [Modification of Environment Variable](#modification-of-environment-variable)

## Modification of Environment Variable

In order to modify your containers, you need to create `deploy-aci.yaml` having format as specified in [sample-docker-aci.yaml](./serverless-sample-yml/docker-aci-deployment-sample.yaml) file.

Replace value of the following

- location-of-container-instance with region/location used for creation of all resources

- name-of-container-instance with name which was created in above step

- name-of-container with the container name for which updation will be done

**_NOTE:_** Container name should be different than the existing container's name(modification will be done for the newly created container). If you are modifying any env variables, make sure that the FDQN name is not changed (usually it will happen if the container name is modified). In such case, perform another deployment without modifying container name. This will keep the FDQN same as the previous one and you can proceed with further steps

- image-tag-name with acr_login_server/image_name:image_tag

- login-server-of-container-registry with Login server specified in Azure Portal --> Container registries --> Your registry --> Overview

- username-of-container-registry and username-of-container-registry with username and password specified in Azure Portal --> Container registries --> Your registry --> Access keys

- dsm-name-of-container with DNS name label used for container creation in earlier step.

**_NOTE:_** Make sure to have correct indentation for each line in `deploy-aci.yaml` file

Once `deploy-aci.yaml` is ready with all the values, navigate to the directory where file is present and run the following command 

        az container create --resource-group <name of resource group> --file deploy-aci.yaml

**_NOTE:_** In `deploy-aci.yaml` file, make sure to mention all the existing variables since modification with yaml file will override all the existing variables.

**_NOTE:_** For docker in azure, value for `CONFIG_PORT` and `FUNCTIONS_HTTPWORKER_PORT` should always be 80.

## Loggers

- In order to see the extension logs, add a console.log statement inside the `logData` function in PaymentUtils.ts file before you could create the image. Logs generated by extension can be found under Monitoring --> Logs

## Troubleshooting

1.  If getting no subscriptions found while logging in to azure from cmd, make sure that you are having an active subscription and sign in using the following command with tenant id.

        az login --tenant <tenantId>

2.  If getting unauthorized message for pushing docker image, login to docker using the tenant id.

        docker login azure --tenant-id <tenant_Id>

3.  While modifying container instance, if you are getting "internal server error", it means value provided in deploy-aci.yaml is incorrect, make sure to provide correct values for all the fields.

4. If you are getting "Gateway Timeout" after hitting container's FQDN, it might be possible that incorrect value is being passed for DNS name label scope reuse field or value for CONFIG_PORT environment variable is not provided. If PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT environment variable is set to 'azure', then providing value for FUNCTIONS_HTTPWORKER_PORT is must. 
