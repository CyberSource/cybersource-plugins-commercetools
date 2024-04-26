# API Extension Setup

- [Configuration](#configuration)
  - [Environment Properties](#environment-properties)
- [Deployment](#deployment)

# Configuration

There are number of configuration variables that need to be defined before running the extension. These can be set as environment variables inside the .env file present in the root directory of the extension.

## Environment Properties

Variables that begin with 'CT' prefix are Commercetools project specific properties.

| Environment variable                       | Value                                                                                 | Notes                                                                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| CONFIG_PORT                                | Port to listen on for HTTP requests                                                   | Port on which you want the extension to run                                                                               |
| PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL  | URL where your extension is hosted                                                       | Recommended https.  Required to create the extensions which will process payments and manage customer saved card tokens|
| PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE     | Your Commercetools username:password base64 encoded value                             | Required to extend payment and customer API to process payments                                                        |
| PAYMENT_GATEWAY_RUN_ENVIRONMENT            | TEST or PRODUCTION                                                                    | Property for running the project in TEST or PRODUCTION environment                                                     |
| PAYMENT_GATEWAY_ENABLE_DEBUG             | Boolean value - true or false      | Flag for enabling or disabling logging of requests that is sent to Cybersource. Case sensitive                                |
| PAYMENT_GATEWAY_MERCHANT_ID                | Your Cybersource merchant Id                                                          | Provided by Cybersource                                                                                                |
| PAYMENT_GATEWAY_MERCHANT_KEY_ID            | Id of a Cybersource shared secret key to be used for HTTP Signature authentication    | Created in [key-Creation\#Cybersource](Key-Creation.md#Cybersource).                                                                   |
| PAYMENT_GATEWAY_MERCHANT_SECRET_KEY        | Value of a Cybersource shared secret key to be used for HTTP Signature authentication | Created in [key-Creation\#Cybersource](key-Creation.md#Cybersource).                                                                  |
| PAYMENT_GATEWAY_TARGET_ORIGINS              | Base URLs where your frontend will be accessible                                       |     Used for Card payment method. Comma separated value without any spaces                                                                                                               |
| PAYMENT_GATEWAY_VERIFICATION_KEY           | Used to check Flex tokens for tampering                                               | Use <b>Openssl -rand64 32 </b>command to generate verification key                                                             |
| PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS                | csv(comma separated value) of the card networks                                                           | If not specified extension will support all the card networks(VISA, MASTERCARD, AMEX, DISCOVER, MAESTRO, CUP, JCB, CARTESBANCAIRES & DINERSCLUB) by default. Case sensitive. Accepts block letters only without any spaces – eg: VISA,AMEX                                                                                     |
| PAYMENT_GATEWAY_3DS_RETURN_URL             | URL that the issuing bank will redirect to the customer for Payer Authentication      | Required if payment.paymentMethodInfo.method is creditCardWithPayerAuthentication                                     |
| PAYMENT_GATEWAY_SCA_CHALLENGE              | Boolean value - true or false                                                         | Flag to force Strong consumer authentication challenge while saving a card using Payer Authentication. Case sensitive |
| PAYMENT_GATEWAY_ORDER_RECONCILIATION       | Boolean value - true or false                                                          | Flag for enabling or disabling Order reconciliation to indicate whether reconciliation Id to be passed in sale, capture and refund transactions. Case sensitive. The Cybersource-Commercetools Extension will consider order number as the reconciliation id if available. The order number from Commercetools should be numeric/alpha-numeric string to reflect in Cybersource |
| PAYMENT_GATEWAY_WHITELIST_URLS                                | URLs which needs to be whitelisted to skip the authentication                                                           |       Comma separated value without any spaces  eg - orders,configureExtension                                            |
| PAYMENT_GATEWAY_APPLE_PAY_MERCHANT_ID      | Your Apple Pay merchant Id                                                            | Provided by Apple                                                                                                      |
| PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH | Path where the Apple Pay certificate is stored                                     | Required if payment.paymentMethodInfo.method is applePay. Ensure that the path given is globally accessible if extension is hosted using any serverless methods. Otherwise, should provide local path of the certificate.                                                         |
| PAYMENT_GATEWAY_APPLE_PAY_KEY_PATH         | Path where the Apple Pay key certificate is stored                   | Required if payment.paymentMethodInfo.method is applePay. Ensure that the path given is globally accessible if extension is hosted using any serverless methods. Otherwise, should provide local path of the certificate.                                         |
| PAYMENT_GATEWAY_APPLE_PAY_DOMAIN_NAME         | Domain name of the applePay                                                | Required if payment.paymentMethodInfo.method is applePay                                                              |
| PAYMENT_GATEWAY_ENABLE_RATE_LIMITER        | Boolean value - true or false                                                         | Required for tokenization. Enable to restrict the number of cards a customer can save within the given time limit. Case sensitive                                  |
| PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE      | Numeric value                                                                         | Provide the number of attempts in below specified time period(this time frame includes Success & Failures) |
| PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME     | Numeric value between 1-24                                                            | Provide the number of hours that saved card attempts are counted(Max of 24 hours)                   |
| PAYMENT_GATEWAY_DECISION_SYNC              | Boolean value - true or false                                                         | Flag for enabling or disabling Decision sync. Case sensitive                                                         |
| PAYMENT_GATEWAY_DECISION_MANAGER           | Boolean value - true or false                                                         | Flag for enabling or disabling Decision Manager for Authorization. Case sensitive                                    |
| PAYMENT_GATEWAY_RUN_SYNC                   | Boolean value - true or false                                                         | Flag for enabling or disabling Run sync. Case sensitive                                                              |
| PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID                   | csv(comma separated value) of merchant Ids.                                                          | Merchant Ids in which Decision sync should be enabled. Provide the exact merchant Id as it is without any spaces                                                           |
| PAYMENT_GATEWAY_NETWORK_TOKEN_MULTI_MID                   | csv(comma separated value) of merchant Ids.                                                          | Merchant Ids in which Webhook Subscription to be created. Provide the exact merchant Id as it is without any spaces                                                           |
| PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT | aws or azure | Provide `aws` or `azure` to support serverless deployment. If the value is `aws`, it will consider AWS deployment. If the value is `azure`, it will consider Azure deployment. Case sensitive.                                |
| FUNCTIONS_HTTPWORKER_PORT                                | Port to listen on for HTTPS requests                                                   | Required when extension is hosted on Azure function                                                                               |
| CT_PROJECT_KEY                             | Project key for your Commercetools project                                            | Created in [key-Creation#Commercetools](key-Creation#commercetools)                                                               |
| CT_CLIENT_ID                               | Client Id of your Commercetools Payment API key                                       | Created in [key-Creation#Commercetools](key-Creation#Commercetools)                                                                  |
| CT_CLIENT_SECRET                           | Client secret of your Commercetools Payment API key                                   | Created in [key-Creation#Commercetools](key-Creation#Commercetools)                                                              |
| CT_AUTH_HOST                               | Commercetools auth server URL                                                         | Created in [key-Creation#Commercetools](key-Creation#Commercetools)                                                                  |
| CT_API_HOST                                | Commercetools API server URL                                                          | Created in [key-Creation#Commercetools](key-Creation#Commercetools)                                                                 |

## Support for Multi-Mid

In this section, mid refers to Cybersource Merchant Id. 

The new mid configurations should be added in the .env file of the extension in the following format

      XXXX_KEY_ID = <Id of a Cybersource shared secret key>
      XXXX_SECRET_KEY = <Value of a Cybersource shared secret key>

Likewise you can configure, as many mids you want to support.

The mid added for `PAYMENT_GATEWAY_MERCHANT_ID` should be the default mid in which transactions will be processed when Multi-Mid is not enabled.

 Following are the constraints to be followed when you want to support multiple mids in your extension instance.

      1. It is mandatory to provide the env variables for Multi-Mid in recommended format only.
      2. All env variables should be in block letters
      3. First part of the variable (XXXX) should be your Cybersource merchant Id in block letters
      4. Second part of the variable to store key Id should be _KEY_ID
      5. Second part of the variable to store secret key should be _SECRET_KEY

Example :
  
Below is the env variables for the mid which has merchant Id as `merchantid123` 
      
      MERCHANTID123_KEY_ID = <Id of a Cybersource shared secret key>
      MERCHANTID123_SECRET_KEY = <Value of a Cybersource shared secret key>

Below is an example to set the value for PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID variable.

      PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID = merchantId1,merchantId2,merchantId3,...

> **_NOTE:_** For tokenization service i.e., adding, updating and deleting a card data in my account section, extension will always consider default mid. So, its mandatory to use default mid in this case.

# Deployment

The Cybersource-Commercetools Extension is a typescript project which is built using cybersource-rest-client npm package and other several node packages.

> **_NOTE:_** You can view the loggers in src/loggers folder of the extension if there are any information or errors found while processing the payments or configuring the extension.

To deploy your extension on any of the below serverless environment, refer the below files

- AWS Lambda - [AWS-Serverless-Deployment\#AWSDeploymentSteps](AWS-Serverless-Deployment.md#steps-to-deploy-extension-on-aws-lambda)
- Azure function - [Azure-Serverless-Deployment\#AzureDeploymentSteps](Azure-Serverless-Deployment.md#azure-deployment-steps)
- Docker in AWS - [Docker-Container-in-AWS\#DockerDeploymentSteps](Docker-Container-in-AWS.md#deploying-docker-containers-on-aws-elastic-container-serviceecs)
- Docker in Azure - [Docker-Container-in-Azure\#DockerDeploymentSteps](Docker-Container-in-Azure.md#steps-for-running-the-docker-image-of-extension-in-azure)

## Example deployment steps

The steps involved in deploying the Cybersource-Commercetools Extension in development environment are the following:

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