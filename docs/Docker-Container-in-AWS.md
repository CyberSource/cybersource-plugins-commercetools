# Deploying Docker Containers on AWS Elastic Container Service(ECS)
The Docker Compose CLI enables developers to use native Docker commands to run applications in Amazon Elastic Container Service (ECS) when building cloud-native applications. Using docker compose, the Commercetools-Cybersource-Plugin can be deployed into the AWS easily. For this, the docker image of the plugin has to be built and the same needs to be pushed into the AWS Elastic Container Registry.


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

    AWS Access Key ID : <Access key Id>
    AWS Secret Access Key : <Secret Key>
    Default region name : <region>
    Default output format : text

### Create AWS Context

Run the below command to create an Amazon ECS Docker context 
   
      docker context create ecs <contextName>

where `contextName` is the name of your context

- After running the above command, it will give some options, select '<B>An existing AWS profile</B>' option since we already configured AWS in the above step


### Run a Compose application
   
You can deploy and manage multi-container applications defined in the Compose files to Amazon ECS using the docker compose command. To do this:

- Create a docker-compose.yml(case-sensitive) file in any folder of your choice and populate the following fields :
    
    
      x-aws-loadbalancer : ARN of the LoadBalancer
      services:
        <service-name>:
          image: Specify the image to start the container from. Can either be a repository/tag or a partial image ID.
          ports: 
            - containerport
          environment:
            set all the required environment variables
   
   Example:
      
      x-aws-loadbalancer : arn:aws:elasticloadbalancing:<region>:<accountId>:loadbalancer/net/<LoadBalancername>/<randomly-generated-Id-by-AWS>
      services:
        webapp:
          image: xxx
          ports:
            - xxx
          environment:
            - CONFIG_PORT=xxx
            - CT_PROJECT_KEY=xxx
    
    **_NOTE:_** Make sure to have correct indentation for each line in docker-compose.yml file and give same port number under `ports` and `CONFIG_PORT` under environment in docker-compose.yml file
     
    
    - To set environment variables, Refer [API-Extension-Setup](API-Extension-Setup.md#a-name"environmentproperties"aenvironment-properties)
    - To create a LoadBalancer in AWS, Refer [Creation-of-LoadBalancer](#creation-of-loadbalancer)
    - To get image name, Refer [Pushing-image-into-AWS-ECR](#pushing-the-docker-image-into-aws-elastic-container-registryecr)


- Ensure that you are using your ECS context. You can do this either by specifying the --context contextname flag with your command or by setting the current context using the below command 

       docker context use <contextName>

  where `contextName` is the name of your context which is created in the previous step
- Navigate to the folder where the docker-compose.yml file is present and run the below   command to start a full compose application
     
       docker compose up

## Pushing the docker image into AWS Elastic Container Registry(ECR)

Follow the below steps to deploy the docker image into AWS ECR by using AWS CLI

  ### Step 1: Build a Docker image
   To build a Docker image, Refer [Building-the Docker-image](Docker.md#building-the-docker-image)
  
  ### Step 2: Authenticate the Docker CLI to your default registry
   By doing Authentication, the docker command can push and pull images with Amazon ECR. The AWS CLI provides a get-login-password command to simplify the authentication process. To authenticate the Docker CLI to default registry, use the following command:

     aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com

   **_NOTE:_** Please confirm that Docker is running before executing the above command

 ### Step 3: Create a Repository
  
  To create a Repository in AWS ECR, use the following command:
    
     aws ecr create-repository --repository-name <repositoryName> --region <region>

   where `repositoryName` is the name of your choice and it should start with a letter and can only contain lowercase letters, numbers, hyphens, underscores, and forward slashes. Using a double hyphen, underscore, or forward slash isn't supported.

 ### Step 4: Push an image to Amazon ECR
  To push the image into ECR, first tag the image to push into your repository by using the following command:

    docker tag <imageName>:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repositoryName>
    
 Once the image is tagged, push the image using the following command:
  
    docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repositoryName>

 After the image is pushed successfully, copy the  respective image URI present in AWS console under ECR service and use the same URI in docker-compose.yml file for image field.


## Creation of LoadBalancer
LoadBalancer is used to assign the custom DNS name for application, which will be helpful for creating commercetools API extensions.
You can also access the application using the same DNS name followed by port number(Example: DNSname:portnumber/xxx)
    
To create the LoadBalancer, follow the below steps :
     
- Retrieve the default VPC ID and attached subnets using the following commands:

           aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId'

    The above command will give the default VPC ID, use the VPC ID to retrieve the attached subnets for it by using the following command:

         aws ec2 describe-subnets --filters Name=vpc-id,Values=<VPC ID> --query 'Subnets[*].SubnetId'

    The above command will give all the attached subnets, use the subnet Id to create a LoadBalancer using the following command:

        aws elbv2 create-load-balancer --name <LoadBalancerName> --type network --subnets "<subnet-Id>" "<subnet-Id>"

    you can specify the number of subnets based on your choice.

        


Once the application is deployed, if you want to update any env settings for plugin, just change the docker-compose.yml file and again run docker compose up command.

**_NOTE:_**  During updation, don't interrupt in between untill the status is updated as 'UPDATE_COMPLETE'. You can check the status of application under CloudFormation service in AWS console.

To access an application, use LoadBalancer DNS name followed by port number specified in docker-compose.yml file

    Example: <DNSname>:<port number>/xxx


DNS name will available in AWS console under respective LoadBalancer details in LoadBalancer service and it will be in the following format
    
     <LoadBalancerName>-<Some-randomly-generated-Id>.elb.<region>.amazonaws.com

## Loggers in AWS Cloudwatch

You can see all your logs in AWS Cloudwatch, for that you need to perform below steps.

- Provide your AWS Access Key ID ,Secret Key and AWS Region Name in .env file. (Refer [API-Extension-Setup](API-Extension-Setup.md))
- Pass the value as `true` for the ENV variable `PAYMENT_GATEWAY_ENABLE_CLOUD_LOGS` in .env file.(Refer [API-Extension-Setup](API-Extension-Setup.md))

## Troubleshoot
 - When using `docker compose up` command, if you get the following error "`pulling from host <accountId>.dkr.ecr.<region>.amazonaws.com failed with status code [manifests latest]: 403 Forbidden`", it means that authentication is expired. Refer [Authenticate-to-default-registry](#step-2-authenticate-the-docker-cli-to-your-default-registry) to authenticate again.

 - It's better to use `PowerShell` if any of the above commands are not working or not retrieving the data in cmd terminal.

 - If you get "`This error may indicate that the docker daemon is not running.: The system cannot find the file specified.error during connect: This error may indicate that the docker daemon is not running.: Post http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.24/auth: open //./pipe/docker_engine: The system cannot find the file specified`", it means that Docker is not running, ensure to start Docker to resolve the error.

    
    
    

  

    

   
