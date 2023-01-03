# Serverless Deployment

Serverless deployment is one of the latest trends in cloud technologies. It is a development model built for creating and running applications without the need for server management. They are provisioned, maintained, and scaled by a third-party cloud provider, while the developers just write and deploy the code.

## AWS Lambda

AWS Lambda is a serverless, event-driven compute service that lets you run virtually. You can run any type of application or backend service without provisioning or managing servers.

## Pre-Requisites

Here is a list of pre-requisites that you need to have before proceeding with deployment:

- NodeJS and NPM
- Active AWS account
- Active AWS subscription
- AWS credentials

## <a name="AWSSecurityCredentials"></a>AWS Security Credentials

To connect the application to AWS account, you need to generate AWS Security Credentials. Follow below steps to generate security credentials

1. Login to your AWS account.

2. Go to your profile

   Security Credentials -> Access keys (access key ID and secret access key) -> Create New Access Key -> Download Key File

> **_NOTE:_** Download the credentials and keep it safe, since you won't be able to retrieve it again

3. The downloaded file contains `AWSAccessKeyId` and `AWSSecretKey`, use these credentials whenever required.

## <a name="ServerlessFrameworkServices"></a>Serverless Framework Services

The Serverless Framework is a command-line tool that uses easy and approachable YAML syntax to deploy your code. A service is configured via `serverless.yml` file where you define your functions, the events that trigger them, and the AWS resources to deploy. Each service configuration is managed in the serverless.yml file.

The main responsibilities of this file are:

- Declare a serverless service
- Define the cloud provider where the service will be deployed
- Define one or more functions
- Define the events that trigger each function (e.g. HTTP requests)
- Define a set of AWS resources to create
- Allow events listed in the events section to automatically create the resources required for the event upon deployment
- Allow flexible configuration using variables

Any service configuration will be done in `serverless.yml` file. You can see the name of the service, here you can provide your service name. The function inside the functions definition, it should point to `build/main/index.handler` since in index file we are wrapping our API for serverless use.

Specify the event along with the path which will trigger the handler function.

    functions:
    HandlerFunction:
        handler: build/main/index.handler
        events:
        - httpApi:
            path: /
            method: ANY
        - httpApi:
            path: /{proxy+}
            method: ANY

In order to get logs in AWS Cloudwatch, you need to provide following permissions inside provider

    iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - lambda:InvokeFunction
            - logs:CreateLogGroup
            - logs:CreateLogStream
            - logs:PutLogEvents
            - logs:DescribeLogStreams
          Resource:
              - arn:aws:logs:*:*:*

> **_NOTE:_** Make sure to have correct indentation for each line in `serverless.yml` file. (Refer [Serverless.yml Reference](https://www.serverless.com/framework/docs/providers/aws/guide/serverless.yml))

## Loggers in AWS Cloudwatch

You can see all your logs in AWS Cloudwatch, for that you need to perform below steps.

- Provide your AWS Access Key ID ,Secret Key and AWS Region Name in .env file. (Refer [API-Extension-Setup](API-Extension-Setup.md))
- Pass the value as `true` for the ENV variable `PAYMENT_GATEWAY_ENABLE_CLOUD_LOGS` in .env file.(Refer [API-Extension-Setup](API-Extension-Setup.md))

## <a name="AWSDeploymentSteps"></a>Steps to Deploy Plugin on AWS Lambda

1.  Navigate to the root directory and run the following command to include the npm dependencies

         npm install

> **_NOTE:_** This is not necessary if the dependencies are already available in <b>node_modules</b> repository

2.  Populate AWS security credentials (Refer [AWS Security Credentials](#AWSSecurityCredentials)) and run the following command

         serverless config credentials --provider aws --key <your_aws_access_key_id> --secret <your_aws_access_key_secret>

3.  Remove .gitignore file and and run the following command

         Serverless create -t aws-nodejs

4.  Above command will add one file in the root directory i.e. serverless.yml . Populate the required values in this file. (Refer [Serverless Framework Services](#ServerlessFrameworkServices))

5.  To deploy a service, run the below command in the same directory as serverless.yml i.e. root directory

         npm run deploy

6.  Once the deployment is done, to set/modify the ENV variables you have to login to your AWS account.
- Navigate to the lambda and click on the lambda function that has been created after successful deployment.
- Navigate to Configuration -> Environment variables and click on Add environment variable.
- Enter key and value for your ENV variable and click on save. (Refer [API-Extension-Setup](API-Extension-Setup.md))
   
    **_NOTE:_** AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and AWS_REGION can't be modified since they are AWS reserved keywords. 

## Custom Domain Name for Lambda

With Serverless, it's easier than ever to deploy production-ready API endpoints. However, using AWS API Gateway results in odd hostnames for your endpoints. Further, these hostnames will change if you remove and redeploy your service. To map a custom domain name to your endpoints, Refer [Serverless-Api-Gateway-Domain](https://www.serverless.com/blog/serverless-api-gateway-domain/)

You need to have custom domain for your application since your application will be hosted on that URL and that URL will be used to create API extensions.

## Troubleshoot

1.  While deploying the application, if deployment is failed with error messsage "Cannot read file due to EMFILE: too many open files" then this error you may have received because your system has certain limit to open files and when that limit is reached this error is thrown. After sometime, try to deploy your application again after closing opened files.

2.  While configuring serverless with your AWS security credentials, sometimes you may get error message as ' The term 'serverless' is not recognized as the name of a cmdlet, function, script file, or operable program' so another way for configuration is to open the credentials file. This file is usually found at ~/.aws/credentials . You may need to show hidden files in your file browser.

    Your file may be empty or may not even exist. If it doesn’t exist create an empty file. In that file you can paste your credentials in this format.

          [default]
          aws_access_key_id=${Your access key ID}
          aws_secret_access_key=${Your secret access key}
