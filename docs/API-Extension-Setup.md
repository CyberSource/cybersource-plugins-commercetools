# API Extension Setup

- [Configuration](#Configuration)
  - [Environment Properties](#EnvironmentProperties)
- [Deployment](#Deployment)

# <a name="Configuration"></a>Configuration

There are a number of configuration variables that need to be defined before running the plugin. These can be set as environment variables inside the .env file present in the root directory of the plugin.

For multiple environments you should use unique values per environment.

## <a name="EnvironmentProperties"></a>Environment Properties

Variables that begin with 'CT' prefix are Commercetools project specific properties.

| Environment variable                       | Value                                                                                 | Notes                                                                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| CONFIG_PORT                                | Port to listen on for HTTP requests                                                   | Port on which you want the plugin to run                                                                               |
| PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL  | URL where your plugin is hosted                                                       | Recommended https. Required to create custom types to process payments                                                 |
| PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE     | Your Commercetools username:password base64 encoded value                             | Required to extend payment and customer API to process payments                                                        |
| PAYMENT_GATEWAY_MERCHANT_ID                | Your Cybersource merchant id                                                          | Provided by Cybersource                                                                                                |
| PAYMENT_GATEWAY_MERCHANT_KEY_ID            | Id of a Cybersource shared secret key to be used for HTTP Signature authentication    | Created in <a href="Key-Creation.md">Key Creation</a>                                                                  |
| PAYMENT_GATEWAY_MERCHANT_SECRET_KEY        | Value of a Cybersource shared secret key to be used for HTTP Signature authentication | Created in <a href="Key-Creation.md">Key Creation</a>                                                                  |
| PAYMENT_GATEWAY_RUN_ENVIRONMENT            | TEST or PRODUCTION                                                                    | Property for running the project in TEST or PRODUCTION environment                                                     |
| PAYMENT_GATEWAY_DECISION_MANAGER           | Boolean value - true or false                                                         | Flag for enabling and disabling Decision Manager for Authorization. Case sensitive.                                    |
| PAYMENT_GATEWAY_SCA_CHALLENGE              | Boolean value - true or false                                                         | Flag to force Strong consumer authentication challenge while saving a card using Payer Authentication. Case sensitive. |
| PAYMENT_GATEWAY_TARGET_ORIGIN              | Base URL where your frontend will be accessible                                       |                                                                                                                        |
| PAYMENT_GATEWAY_VERIFICATION_KEY           | Used to check Flex tokens for tampering                                               | Use <b>Openssl -rand64 32</b> to generate verification key                                                             |
| PAYMENT_GATEWAY_3DS_RETURN_URL             | URL that the issuing bank will redirect to the customer for payer Authentication      | Used only if payment.paymentMethodInfo.method == creditCardWithPayerAuthentication                                     |
| PAYMENT_GATEWAY_APPLE_PAY_MERCHANT_ID      | Your Apple Pay merchant id                                                            | Provided by Apple                                                                                                      |
| PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH | Path where the Apple Pay certificate is stored                                        | Used only if payment.paymentMethodInfo.method == applePay                                                              |
| PAYMENT_GATEWAY_APPLE_PAY_KEY_PATH         | Path where the Apple Pay key is stored                                                | Used only if payment.paymentMethodInfo.method == applePay                                                              |
| PAYMENT_GATEWAY_ENABLE_RATE_LIMITER        | Boolean value - true or false                                                         | Enable to restrict the number of cards a customer can save within the give time limit                                  |
| PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE      | Numeric value                                                                         | Provide the number of attempts in below specified time period (this time frame includes Success & Failures). By default this value is set to 10, applicable only if rate limiter is enabled |
| PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME     | Numeric value between 1-24                                                            | Provide the number of hours that saved card attempts are counted (Max of 24 hours). By default this value is set to 1, applicable only if rate limiter is enabled                           |
| PAYMENT_GATEWAY_DECISION_SYNC              | Boolean value - true or false                                                         | Flag for enabling and disabling Decision sync. Case sensitive.                                                         |
| PAYMENT_GATEWAY_RUN_SYNC                   | Boolean value - true or false                                                         | Flag for enabling and disabling Run sync. Case sensitive.                                                              |
| CT_PROJECT_KEY                             | Project key for your Commercetools project                                            | Created in <a href="Key-Creation.md">Key Creation</a>                                                                  |
| CT_CLIENT_ID                               | Client id of your Commercetools Payment API key                                       | Created in <a href="Key-Creation.md">Key Creation</a>                                                                  |
| CT_CLIENT_SECRET                           | Client secret of your Commercetools Payment API key                                   | Created in <a href="Key-Creation.md">Key Creation</a>                                                                  |
| CT_AUTH_HOST                               | Commercetools auth server URL                                                         | Created in <a href="Key-Creation.md">Key Creation</a>                                                                  |
| CT_API_HOST                                | Commercetools API server URL                                                          | Created in <a href="Key-Creation.md">Key Creation</a>                                                                  |

# <a name="Deployment"></a>Deployment

The Commercetools - Cybersource plugin is a typescript project which is built using cybersource-rest-client npm package and other several node packages.

## Example deployment steps

The steps involved in deploying the Commercetools - Cybersource plugin in development environment are the following:

- Populate the .env file with the required data by referring to the values in above given table
- Navigate to the root directory and run the following command to include the npm dependencies

      npm install

> **_NOTE:_** This is not necessary if the dependencies are already availabe in <b>node_modules</b> repository

- Run the following script to build the changes & running the plugin

      npm run start

> **_NOTE:_** It is necessary to build the entire plugin. Whenever there is a change and that need to be reflected, run the following script for building the application

    npm run build
