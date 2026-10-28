# API Extension Setup

- [Configuration](#configuration)
- [Environment Properties](#environment-properties)
- [Deployment](#deployment)

# Configuration

There are number of configuration variables that need to be defined before running the extension. These can be set as environment variables inside the .env file present in the root directory of the extension.

## Environment Properties

Variables that begin with 'CT' prefix are Commercetools project specific properties.

| Environment variable                              | Value                                                                                               | Notes                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CONFIG_PORT                                       | Port to listen on for HTTP requests                                                                 | Port on which you want the extension to run                                                                                                                                                                                                                                                                                                                                                                 |
| PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL         | URL where your extension is hosted                                                                  | Recommended https. Required to create the extensions which will process payments and manage customer saved card tokens                                                                                                                                                                                                                                                                                      |
| PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE            | Your Commercetools username:password base64 encoded value                                           | Required to extend payment and customer API to process payments                                                                                                                                                                                                                                                                                                                                             |
| PAYMENT_GATEWAY_RUN_ENVIRONMENT                   | TEST or PRODUCTION                                                                                  | Property for running the project in TEST or PRODUCTION environment                                                                                                                                                                                                                                                                                                                                          |
| PAYMENT_GATEWAY_ENABLE_DEBUG                      | Boolean value - true or false                                                                       | Flag for enabling or disabling logging of requests that is sent to Visa Acceptance Solutions. Case sensitive                                                                                                                                                                                                                                                                                                |
| PAYMENT_GATEWAY_MERCHANT_ID                       | Your Visa Acceptance Solutions merchant Id                                                          | Provided by Visa Acceptance Solutions                                                                                                                                                                                                                                                                                                                                                                       |
| PAYMENT_GATEWAY_MERCHANT_KEY_ID                   | Id of a Visa Acceptance Solutions shared secret key to be used for HTTP Signature authentication    | Created in [Key Creation](Key-Creation.md#visa-acceptance-solutions).                                                                                                                                                                                                                                                                                                                                       |
| PAYMENT_GATEWAY_MERCHANT_SECRET_KEY               | Value of a Visa Acceptance Solutions shared secret key to be used for HTTP Signature authentication | Created in [Key Creation](Key-Creation.md#visa-acceptance-solutions).                                                                                                                                                                                                                                                                                                                                       |
| PAYMENT_GATEWAY_VERIFICATION_KEY                  | Used to check Flex tokens for tampering                                                             | Use <b>Openssl -rand64 32 </b>command to generate verification key                                                                                                                                                                                                                                                                                                                                       |
| PAYMENT_GATEWAY_ORDER_RECONCILIATION              | Boolean value - true or false                                                                       | Flag for enabling or disabling Order reconciliation to indicate whether reconciliation Id to be passed in sale, capture and refund transactions. Case sensitive. The Visa Acceptance Solutions-Commercetools Extension will consider order number as the reconciliation id if available. The order number from Commercetools should be numeric/alpha-numeric string to reflect in Visa Acceptance Solutions                                                                                                                                                                                                                                                                                                                                      |
| PAYMENT_GATEWAY_WHITELIST_URLS                    | URLs which needs to be whitelisted to skip the authentication                                       | Comma separated value without any spaces eg - orders,configureExtension                                                                                                                                                                                                                                                                                                                                       |
| PAYMENT_GATEWAY_REQUEST_MLE_P12_PASSWORD          | Password of the request MLE `.p12` file                                                             | Required for request MLE                                                                                                                                                                                                                                                                                                                                                                                    |
| PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_FILE      | Name of the request MLE `.p12` file                                                                 | Required when hosting the certificate locally                                                                                                                                                                                                                                                                                                                                                               |
| PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_URL       | Path to the request MLE `.p12` certificate                                                          | Required when hosting the certificate in the cloud                                                                                                                                                                                                                                                                                                                                                          |
| PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED                              | Boolean value - true or false                                                                       | Enables or disables response MLE                                                                                                                                                                                                                                                                                                                                                                            |
| PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE     | Name of the response MLE `.p12` file                                                                | Required when hosting the certificate locally                                                                                                                                                                                                                                                                                                                                                               |
| PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD | Password of the response MLE `.p12` file                                                            | Required for response MLE                                                                                                                                                                                                                                                                                                                                                                                   | 
| PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_URL      | Path to the response MLE `.p12` certificate                                                         | Required when hosting the certificate in the cloud                                                                                                                                                                                                                                                                                                                                                          |           
| PAYMENT_GATEWAY_DECISION_SYNC                     | Boolean value - true or false                                                                       | Flag for enabling or disabling Decision sync. Case sensitive.                                                                                                                                                                                                                                                                                                                                                |                                                                                  
| PAYMENT_GATEWAY_RUN_SYNC                          | Boolean value - true or false                                                                       | Flag for enabling or disabling Run sync. Case sensitive                                                                                                                                                                                                                                                                                                                                                     |
| PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID           | csv(comma separated value) of merchant Ids.                                                         | Merchant Ids in which Decision sync should be enabled. Provide the exact merchant Id as it is without any spaces                                                                                                                                                                                                                                                                                            |
| PAYMENT_GATEWAY_DECISION_MANAGER_MULTI_MID        | csv(comma separated value) of merchant Ids.                                                         | Merchant Ids in which decision manager Webhook Subscription to be created. Provide the exact merchant Id as it is without any spaces                                                                                                                                                                                                                                                                        |
| PAYMENT_GATEWAY_UNIFIED_CHECKOUT_MULTI_MID        | csv(comma separated value) of merchant Ids.                                                         | Merchant Ids in which unified checkout Webhook Subscription to be created. Provide the exact merchant Id as it is without any spaces                                                                                                                                                                                                                                                                        |
| PAYMENT_GATEWAY_UC_CLIENT_VERSION                 | String value                                                                                        | Optional. Unified Checkout client version to use when generating capture contexts.                                                                                                                                                                                                                                                                                                                           |
| PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT             | aws, azure or gcp                                                                                   | Provide `aws` ,`azure` or `gcp` to support serverless deployment. If the value is `aws`, it will consider AWS deployment. If the value is `azure`, it will consider Azure deployment.If the value is `gcp` it will consider GCP deployment. Case sensitive.                                                                                                                                                 |
| PAYMENT_GATEWAY_GCP_FUNCTION_NAME                 | String value                                                                                        | Provide the name of your GCP Function specified during serverless deployment.                                                                                                                                                                                                                                                                                                                               |
| FUNCTIONS_HTTPWORKER_PORT                         | Port to listen on for HTTPS requests                                                                | Required when extension is hosted on Azure function                                                                                                                                                                                                                                                                                                                                                         |
| CT_PROJECT_KEY                                    | Project key for your Commercetools project                                                          | Created in [key-Creation#Commercetools](key-Creation#commercetools)                                                                                                                                                                                                                                                                                                                                         |
| CT_CLIENT_ID                                      | Client Id of your Commercetools Payment API key                                                     | Created in [key-Creation#Commercetools](key-Creation#Commercetools)                                                                                                                                                                                                                                                                                                                                         |
| CT_CLIENT_SECRET                                  | Client secret of your Commercetools Payment API key                                                 | Created in [key-Creation#Commercetools](key-Creation#Commercetools)                                                                                                                                                                                                                                                                                                                                         |
| CT_AUTH_HOST                                      | Commercetools auth server URL                                                                       | Created in [key-Creation#Commercetools](key-Creation#Commercetools)                                                                                                                                                                                                                                                                                                                                         |
| CT_API_HOST                                       | Commercetools API server URL                                                                        | Created in [key-Creation#Commercetools](key-Creation#Commercetools)                                                                                                                                                                                                                                                                                                                                         |

## Support for Multi-Mid

In this section, mid refers to Visa Acceptance Solutions Merchant Id.

The new mid configurations should be added in the .env file of the extension in the following format

      XXXX_KEY_ID = <Id of a Visa Acceptance Solutions shared secret key>
      XXXX_SECRET_KEY = <Value of a Visa Acceptance Solutions shared secret key>

Likewise you can configure, as many mids you want to support.

The mid added for `PAYMENT_GATEWAY_MERCHANT_ID` should be the default mid in which transactions will be processed when Multi-Mid is not enabled.

Following are the constraints to be followed when you want to support multiple mids in your extension instance.

      1. It is mandatory to provide the env variables for Multi-Mid in recommended format only.
      2. All env variables should be in block letters
      3. First part of the variable (XXXX) should be your Visa Acceptance Solutions merchant Id in block letters
      4. Second part of the variable to store key Id should be _KEY_ID
      5. Second part of the variable to store secret key should be _SECRET_KEY

Example :

Below is the env variables for the mid which has merchant Id as `merchantid123`

      MERCHANTID123_KEY_ID = <Id of a Visa Acceptance Solutions shared secret key>
      MERCHANTID123_SECRET_KEY = <Value of a Visa Acceptance Solutions shared secret key>

Below is an example to set the value for PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID variable.

      PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID = merchantId1,merchantId2,merchantId3,...

> **_NOTE:_** For tokenization service i.e., adding, updating and deleting a card data in my account section, extension will always consider default mid. So, its mandatory to use default mid in this case.

# Deployment

The Visa Acceptance Solutions-Commercetools Extension is a typescript project which is built using Visa Acceptance Solutions-rest-client npm package and other several node packages.

> **_NOTE:_** You can view the loggers in src/loggers folder of the extension if there are any information or errors found while processing the payments or configuring the extension.

To deploy your extension on any of the below serverless environment, refer the below files

- AWS Lambda - [AWS-Serverless-Deployment\#AWSDeploymentSteps](AWS-Serverless-Deployment.md#steps-to-deploy-extension-on-aws-lambda)
- Azure function - [Azure-Serverless-Deployment\#AzureDeploymentSteps](Azure-Serverless-Deployment.md#azure-deployment-steps)
- Docker in AWS - [Docker-Container-in-AWS\#DockerDeploymentSteps](Docker-Container-in-AWS.md#deploying-docker-containers-on-aws-elastic-container-serviceecs)
- Docker in Azure - [Docker-Container-in-Azure\#DockerDeploymentSteps](Docker-Container-in-Azure.md#steps-for-running-the-docker-image-of-extension-in-azure)

## Example deployment steps

The steps involved in deploying the Visa Acceptance Solutions-Commercetools Extension in development environment are the following:

- Populate the .env file with the required data by referring to the values in the above given table
- Navigate to the root directory and run the following command to include the npm dependencies

      npm install

> **_NOTE:_** This is not necessary if the dependencies are already availabe in <b>node_modules</b> repository

- Run the following script to create the Commercetools extensions and custom fields

      npm run setup-resources

> **_NOTE:_** This can also be done by using `{baseUrl}/configureExtension` endpoint once the server is started

- Run the following script to build the changes & running the extension

      npm run start

> **_NOTE:_** It is necessary to rebuild the entire extension whenever there is a change that needs to be reflected. Run the following script to build the application.

      npm run build

### Run Unit Tests

Unit tests can be executed with the following command

    npm run cov
