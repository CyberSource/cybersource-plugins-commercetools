# Deploying Docker Containers on AWS Elastic Container Service(ECS)
The Docker Compose CLI enables developers to use native Docker commands to run applications in Amazon Elastic Container Service (ECS) when building cloud-native applications. Using docker compose, the Cybersource-Commercetools Extension can be deployed into the AWS easily. For this, docker image of the extension has to be built and same needs to be pushed into the AWS Elastic Container Registry.

## Pre-Requisites

To deploy Docker containers on ECS, you must meet the following requirements:

1. Download and install the latest version of Docker Desktop

2. Ensure you have an AWS account with active subscription

3. Download and install the latest version of AWS CLI

4. AWS Security Credentials 

## Creation of AWS Security Credentials
 
  To generate AWS Security Credentials, Refer [AWS-Security-Credentials](AWS-Serverless-Deployment.md#aws-security-credentials)

## Run an application on ECS

If you have created AWS Security Credentials by referring [AWS-Security-Credentials](AWS-Serverless-Deployment.md#aws-security-credentials), then by default it will have all the permissions to run Compose application since it is a root user. 
If you are using IAM user, ensure that the user has all the required permissions. Refer [docker-ecs-integration](https://docs.docker.com/cloud/ecs-integration/#run-an-application-on-ecs) to check the list of permissions to be granted.

### Configure AWS CLI
 
 To configure AWS CLI, use the following command
     
    aws configure
   
  The above command will give you options like:

    AWS Access Key ID : <Access Key Id>
    AWS Secret Access Key : <Secret Key>
    Default region name : <region>
    Default output format : text

  For `Access Key Id` and `Secret Key`, use value returned by [AWS-Security-Credentials](AWS-Serverless-Deployment.md#aws-security-credentials), for `region`, use aws region which is convenient.

### Create AWS Context

Run the below command to create an Amazon ECS Docker context 
   
      docker context create ecs <contextName>

where `contextName` is the name of your context

- After running the above command, select `An existing AWS profile` option on listing of the options prompted since we already configured AWS in the above step

## Pushing the docker image into AWS Elastic Container Registry(ECR)

Follow the below steps to deploy docker image into AWS ECR by using AWS CLI

   **_NOTE:_** Make sure to use same region for following steps

  ### Step 1: Build a Docker image
   To build a Docker image, Refer [Building-the Docker-image](Docker.md#building-the-docker-image)
  
  ### Step 2: Authenticate the Docker CLI to your default registry
   By doing Authentication, the docker command can push and pull images with Amazon ECR. The AWS CLI provides a get-login-password command to simplify the authentication process. To authenticate the Docker CLI to default registry, use the following command:

     aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com

   **_NOTE:_** Make sure Docker is running before executing the above command

 ### Step 3: Create a Repository
  
  To create a Repository in AWS ECR, use the following command:
    
     aws ecr create-repository --repository-name <repositoryName> --region <region>

   where `repositoryName` is the name of your choice and it should start with a letter and can only contain lowercase letters, numbers, hyphens, underscores and forward slashes. Use of double hyphen, underscore or forward slash isn't supported.

 ### Step 4: Push an image to Amazon ECR

  To push the image into ECR, first tag the image to push into your repository by using the following command:

    docker tag <imageName>:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repositoryName>
    
 Once the image is tagged, push the image using the following command:
  
    docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repositoryName>

### Step 5: Creation of Task Definitions

Task Definition is a configuration that defines your containers and how to launch them. After you create a task definition for your application within Amazon ECS, you can specify the number of tasks to run on your cluster.

To create it, navigate to `ECS` -> `Task definitions` -> `Create new task definition`

Enter Task definition family name. Under `Container`, enter Container name and Image URI which you will get in [Docker Image in ECR](#step-4-push-an-image-to-amazon-ecr). Enter Container port where port number should be same port on which extension is running(as specified in `CONFIG_PORT` environment variable). You can also mention your .env variables under `Environment variables`. Leave all other settings as their defaults and click on `Create`.

### Step 6: Creation of Cluster

ECS clusters is used to run and maintain your desired number of tasks simultaneously. You can create it once task definition is created.

To create it, navigate to `ECS` -> `Cluster` -> `Create cluster`

Enter Cluster name and click on `Create`.

### Step 7: Creation of Services under Cluster

Services are higher-level abstractions that manage the desired state of your tasks, ensuring they are running and healthy.

To Create it, navigate to your cluster and click on `Create`

Under `Deployment configuration`, for `Family`, choose your task definition. For `Revision`, choose the latest revision  and enter `Service name`.

Under `Networking`, choose your VPC and add subnets. For `Security group`, use existing security groups or create a new one.

 **_NOTE:_** Make sure that security group has following inbound rules(rules can be added while creation or can be modified later by navigating to `EC2` -> `Security Groups` -> your securuty group -> `Edit inbound rules` -> `Add rule`)

    Rule 1 - choose `Type` as All traffic, `Source` as Custom and add security group Id

    Rule 2 - choose `Type` as Custom TCP, `Port range` as port no where extension is hosted, `Source` as Custom and add 0.0.0.0/0

    Rule 3 - choose `Type` as Custom TCP, `Port range` as port no where extension is hosted, `Source` as Custom and add ::/0

    and add `Save rules`

> **_NOTE:_** Always use port number 80 to use the extension image in AWS, otherwise network token service will not be available.

Under `Load balancing`, choose Application Load Balancer as Load balancer type, choose your container which was created while creating task definition. Create a new load balancer or use existing one. For `Listener`, create a new listener by providing port number as extensions's port number. For `Target group`, choose existing target group or create a new one by entering Target group name. Leave all other settings as their defaults, and click on `Create`.

Once the application is deployed, if you want to update any environment settings for extension, just update the value in docker-compose.yml file and run the docker compose up command again.

If you are usng port 80, to access the application use the following

    Example: <DNSname>/xxx 

Otherwise, use LoadBalancer DNS name followed by port number.

    Example: <DNSname>:<port number>/xxx  


DNS name will available in AWS console under respective LoadBalancer details in LoadBalancer service and it will be in the following format
    
     <LoadBalancerName>-<Some-randomly-generated-Id>.elb.<region>.amazonaws.com

## Loggers in AWS Cloudwatch

You can see all your logs in AWS Cloudwatch, for that you need to perform below steps.

- Before you could create the image of the extension, the  `logData` function in paymentUtils.ts file should be updated with console.log statements, which will log the extension logs properly

## Troubleshoot
 - When using `docker compose up` command, if you get the following error `pulling from host <accountId>.dkr.ecr.<region>.amazonaws.com failed with status code [manifests latest]: 403 Forbidden`, it means that authentication is expired. Refer [Authenticate-to-default-registry](#step-2-authenticate-the-docker-cli-to-your-default-registry) to authenticate again.

 - It's better to use `PowerShell` if any of the above commands are not working or not retrieving the data in cmd terminal.

 - If you get `This error may indicate that the docker daemon is not running.: The system cannot find the file specified.error during connect: This error may indicate that the docker daemon is not running.: Post http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.24/auth: open //./pipe/docker_engine: The system cannot find the file specified`, it means that Docker is not running, ensure to start Docker.