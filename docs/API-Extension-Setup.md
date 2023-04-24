# API Extension Setup

- [Configuration](#configuration)
  - [Environment Properties](#environment-properties)
- [Deployment](#deployment)

# Configuration

There are a number of configuration variables that need to be defined before running the plugin. These can be set as environment variables inside the .env file present in the root directory of the plugin.

For multiple environments you should use unique values per environment.

## Environment Properties

Variables that begin with 'CT' prefix are Commercetools project specific properties.

| Environment variable                       | Value                                                                                 | Notes                                                                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| CONFIG_PORT                                | Port to listen on for HTTP requests                                                   | Port on which you want the plugin to run                                                                               |
| PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL  | URL where your plugin is hosted                                                       | Recommended https. Required to create custom types to process payments                                                 |
| PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE     | Your Commercetools username:password base64 encoded value                             | Required to extend payment and customer API to process payments                                                        |
| PAYMENT_GATEWAY_MERCHANT_ID                | Your Cybersource merchant Id                                                          | Provided by Cybersource                                                                                                |
| PAYMENT_GATEWAY_MERCHANT_KEY_ID            | Id of a Cybersource shared secret key to be used for HTTP Signature authentication    | Created in <a href="Key-Creation.md">Key Creation</a>. This would be considered as the default mid credentials of the plugin.                                                                  |
| PAYMENT_GATEWAY_MERCHANT_KEY_ID            | Id of a Cybersource shared secret key to be used for HTTP Signature authentication    | Created in <a href="Key-Creation.md">Key Creation</a>. This would be considered as the default mid credentials of the plugin.                                                                  |
| PAYMENT_GATEWAY_MERCHANT_SECRET_KEY        | Value of a Cybersource shared secret key to be used for HTTP Signature authentication | Created in <a href="Key-Creation.md">Key Creation</a>.                                                                  |
| XXXX_KEY_ID        | Id of a Cybersource shared secret key to be used for HTTP Signature authentication | Created in <a href="Key-Creation.md">Key Creation</a> . Required only when you need to support Multi-Mid. XXXX should be your Cybersource merchant Id in block letters                                                                 |
| XXXX_SECRET_KEY       | Value of a Cybersource shared secret key to be used for HTTP Signature authentication | Created in <a href="Key-Creation.md">Key Creation</a> . Required only when you need to support Multi-Mid. XXXX should be your Cybersource merchant Id in block letters                                                                 |
| PAYMENT_GATEWAY_RUN_ENVIRONMENT            | TEST or PRODUCTION                                                                    | Property for running the project in TEST or PRODUCTION environment                                                     |
| PAYMENT_GATEWAY_DECISION_MANAGER           | Boolean value - true or false                                                         | Flag for enabling or disabling Decision Manager for Authorization. Case sensitive                                    |
| PAYMENT_GATEWAY_SCA_CHALLENGE              | Boolean value - true or false                                                         | Flag to force Strong consumer authentication challenge while saving a card using Payer Authentication. Case sensitive |
| PAYMENT_GATEWAY_ORDER_RECONCILIATION       | Boolean value - true or false                                                          | Flag for enabling or disabling Order reconciliation to indicate whether reconciliation Id to be passed in authorization, capture and refund transactions. Case sensitive
| PAYMENT_GATEWAY_TARGET_ORIGIN              | Base URL where your frontend will be accessible                                       |                                                                                                                        |
| PAYMENT_GATEWAY_VERIFICATION_KEY           | Used to check Flex tokens for tampering                                               | Use <b>Openssl -rand64 32</b> to generate verification key                                                             |
| PAYMENT_GATEWAY_3DS_RETURN_URL             | URL that the issuing bank will redirect to the customer for payer Authentication      | Used only if payment.paymentMethodInfo.method == creditCardWithPayerAuthentication                                     |
| PAYMENT_GATEWAY_ENABLE_DEBUG             | Boolean value - true or false      | Flag for enabling or disabling logging of requests that is send to Cybersource. Case sensitive                                |
| PAYMENT_GATEWAY_APPLE_PAY_MERCHANT_ID      | Your Apple Pay merchant Id                                                            | Provided by Apple                                                                                                      |
| PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH | Path where the Apple Pay certificate is stored                                        | Used only if payment.paymentMethodInfo.method == applePay. Ensure that the path given is globally accessible if plugin is hosted using any serverless deployments                                                          |
| PAYMENT_GATEWAY_APPLE_PAY_KEY_PATH         | Path where the Apple Pay key is stored                                                | Used only if payment.paymentMethodInfo.method == applePay                                                              |
| PAYMENT_GATEWAY_ENABLE_RATE_LIMITER        | Boolean value - true or false                                                         | Enable to restrict the number of cards a customer can save within the give time limit. Case sensitive                                  |
| PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE      | Numeric value                                                                         | Provide the number of attempts in below specified time period (this time frame includes Success & Failures). By default this value is set to 10, applicable only if rate limiter is enabled |
| PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME     | Numeric value between 1-24                                                            | Provide the number of hours that saved card attempts are counted (Max of 24 hours). By default this value is set to 1, applicable only if rate limiter is enabled                           |
| PAYMENT_GATEWAY_DECISION_SYNC              | Boolean value - true or false                                                         | Flag for enabling or disabling Decision sync. Case sensitive                                                         |
| PAYMENT_GATEWAY_RUN_SYNC                   | Boolean value - true or false                                                         | Flag for enabling or disabling Run sync. Case sensitive                                                              |
| PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID                   | Comma separated value of merchant Ids                                                         | Merchant Ids in which decision sync should be enabled. Provide the exact merchant id as it is.(Make sure there is no extra spaces in between)                                                             |
| AWS_ACCESS_KEY_ID                          | AWS Access Key ID                                                            | Provided by AWS in [AWS-Serverless-Deployment\#AWSSecurityCredentials](AWS-Serverless-Deployment.md#AWSSecurityCredentials). Required when running Docker container in AWS                                     |
| AWS_SECRET_ACCESS_KEY                            | AWS Secret Key                                                           | Provided by AWS in [AWS-Serverless-Deployment\#AWSSecurityCredentials](AWS-Serverless-Deployment.md#AWSSecurityCredentials). Required when running Docker container in AWS                                   |
| AWS_REGION                           | AWS Region Name                                                          | Provided by AWS. Required when running Docker container in AWS                                    |
| PAYMENT_GATEWAY_ENABLE_CLOUD_LOGS             | Boolean value - true or false                                                         | Set the value to true to get AWS Cloudwatch logs. Case sensitive.                                                         |
| PAYMENT_GATEWAY_ENABLE_SERVERLESS_DEPLOYMENT | Boolean value - true or false | Set the value to true when the plugin is hosted using any serverless deployments.
| CT_PROJECT_KEY                             | Project key for your Commercetools project                                            | Created in <a href="Key-Creation.md">Key Creation</a>                                                                  |
| CT_CLIENT_ID                               | Client Id of your Commercetools Payment API key                                       | Created in <a href="Key-Creation.md">Key Creation</a>                                                                  |
| CT_CLIENT_SECRET                           | Client secret of your Commercetools Payment API key                                   | Created in <a href="Key-Creation.md">Key Creation</a>                                                                  |
| CT_AUTH_HOST                               | Commercetools auth server URL                                                         | Created in <a href="Key-Creation.md">Key Creation</a>                                                                  |
| CT_API_HOST                                | Commercetools API server URL                                                          | Created in <a href="Key-Creation.md">Key Creation</a>                                                                  |

## Support for Multi-Mid

In this section mid refers to Cybersource Merchant Id. 

The new mid configurations should be added in the .env file of the plugin in the following format

      XXXX_KEY_ID = <Id of a Cybersource shared secret key>
      XXXX_SECRET_KEY = <Value of a Cybersource shared secret key>

Likewise you can configure, as many mids you want to support.

The mid added for `PAYMENT_GATEWAY_MERCHANT_ID` should be the default mid in which transactions will be processed when Multi-Mid is not enabled.

 Following are the constraints to be followed when you want to support multiple mids in your plugin instance.

      1. It is mandatory to provide the env variables for multi-mid in recommended format only.
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

For tokenization service i.e adding a card, updating a card and deleting a card in my account section, plugin will always consider default mid.
# Deployment

The Commercetools - Cybersource plugin is a typescript project which is built using cybersource-rest-client npm package and other several node packages.

> **_NOTE:_** You can view the loggers in src/loggers folder of the plugin if there are any information or errors found while processing the payments or configuring the plugin.

If you want serverless deployment of the plugin on AWS Lambda, refer [AWS-Serverless-Deployment\#AWSDeploymentSteps](AWS-Serverless-Deployment.md#AWSDeploymentSteps)

## Example deployment steps

The steps involved in deploying the Commercetools - Cybersource plugin in development environment are the following:

- Populate the .env file with the required data by referring to the values in the above given table
- Navigate to the root directory and run the following command to include the npm dependencies

      npm install

> **_NOTE:_** This is not necessary if the dependencies are already availabe in <b>node_modules</b> repository

- Run the following script to create the Commercetools extensions and custom fields

      npm run setup-resources

> **_NOTE:_** This can also be done by using `{baseUrl}/configurePlugin` endpoint once the server is started

- Run the following script to build the changes & running the plugin

      npm run start

> **_NOTE:_** It is necessary to build the entire plugin. Whenever there is a change and that need to be reflected, run the following script for building the application

      npm run build

### Run Unit Tests

Unit tests can be executed with the following command

	npm run cov