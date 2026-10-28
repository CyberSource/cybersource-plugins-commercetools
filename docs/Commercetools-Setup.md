# Commercetools Setup

- [API Extension Setup](#api-extension-setup)
- [Payment Create](#payment-create)
- [Payment Update](#payment-update)
- [Customer Update](#customer-update)
- [Resource Customizations](#resource-customizations)
- [Payment Interactions](#payment-interactions)
- [Customer tokens](#customer-tokens)
- [Payment data](#payment-data)
- [Payment error](#payment-error)
- [Payment failure](#payment-failure)
- [Transaction Data](#transaction-data)
- [Creating API Extensions and Customizations](#creating-api-extensions-and-customizations)

The customizations below are required for the API Extension to work correctly. JSON versions of these definitions are available in src/resources folder of the extension and can be run as an endpoint to load them into Commercetools.

> **_NOTE:_** <ul><li>The extension timeout of 10000ms is required for Payment create and update API</li><li>Commercetools by default will have 2000ms for Customer update API, contact Commercetools support team to increase the timeout to 10000ms. Once approved by Commercetools support team, if the timeout is 2000 ms, change the timeout to 10000 in src --> resources --> customer_update_extension.json before creating the extensions. Otherwise, the customer update extension will have a timeout of 2000ms</li></ul>

# API Extension Setup

> **_NOTE:_** It is always recommented to use HTTPS endpoints for the extension. In case, if the extension is hosted in VM, leverage the reverse proxy to use HTTPS protocol.

## Payment Create

An extension triggered by payment create is required to process any
actions on a payment resource.

| Property                   | Value                                  | Note                                                                                                    |
| -------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| key                        | isv_payment_create_extension           |                                                                                                         |
| type                       | HTTP                                   | The extension only supports HTTP Destinations                                                           |
| url                        | {baseUrl}/api/extension/payment/create | The baseUrl will be defined by where you deploy the extension. HTTPS should be used for production      |
| authentication.type        | AuthorizationHeader                    |                                                                                                         |
| authentication.headerValue | Bearer {credentials}                   | {credentials} will be the encrypted Base 64 encode value of the pair username:password of Commercetools |
| timeoutInMs                | 10000                                  | You will need Commercetools support help to increase the allowable maximum value                        |
| actions                    | Create                                 |                                                                                                         |
| resourceTypeId             | payment                                |                                                                                                         |

## Payment Update

An extension triggered by payment updates is required to process any update actions on a payment resource

| Property                   | Value                                  | Note                                                                                                    |
| -------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| key                        | isv_payment_update_extension           |                                                                                                         |
| type                       | HTTP                                   | The extension only supports HTTP Destinations                                                           |
| url                        | {baseUrl}/api/extension/payment/update | The baseUrl will be defined by where you deploy the extension. HTTPS should be used for production      |
| authentication.type        | AuthorizationHeader                    |                                                                                                         |
| authentication.headerValue | Bearer {credentials}                   | {credentials} will be the encrypted Base 64 encode value of the pair username:password of Commercetools |
| timeoutInMs                | 10000                                  | You will need Commercetools support help to increase the allowable maximum value                        |
| actions                    | Update                                 |                                                                                                         |
| resourceTypeId             | payment                                |                                                                                                         |

## Customer Update

An extension triggered by customer update is required to process any update actions on customer resource.

| Property                   | Value                                   | Note                                                                                                    |
| -------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| key                        | isv_customer_update_extension           |                                                                                                         |
| type                       | HTTP                                    | The extension only supports HTTP Destinations                                                           |
| url                        | {baseUrl}/api/extension/customer/update | The baseUrl will be defined by where you deploy the extension. HTTPS should be used for production      |
| authentication.type        | AuthorizationHeader                     |                                                                                                         |
| authentication.headerValue | Bearer {credentials}                    | {credentials} will be the encrypted Base 64 encode value of the pair username:password of Commercetools |
| timeoutInMs                | 3000 or 4000                            | You will need Commercetools support help to increase the allowable maximum value                        |
| actions                    | Update                                  |                                                                                                         |
| resourceTypeId             | customer                                |                                                                                                         |

# Resource Customizations

## Payment Interactions

### Customer Tokens

| Type     | Key                          | Purpose                                                            |
| -------- | ---------------------------- | ------------------------------------------------------------------ |
| customer | isv_payments_customer_tokens | Custom data type to store Visa Acceptance Solutions payment tokens |

Fields

| Name                             | Type           | Required |
| -------------------------------- | -------------- | -------- |
| isv_tokens                       | Set of Strings | false    |
| isv_token                        | String         | false    |
| isv_tokenAlias                   | String         | false    |
| isv_savedToken                   | String         | false    |
| isv_tokenVerificationContext     | String         | false    |
| isv_tokenCaptureContextSignature | String         | false    |
| isv_cardType                     | String         | false    |
| isv_maskedPan                    | String         | false    |
| isv_cardExpiryMonth              | String         | false    |
| isv_cardExpiryYear               | String         | false    |
| isv_addressId                    | String         | false    |
| isv_currencyCode                 | String         | false    |
| isv_cardNewExpiryMonth           | String         | false    |
| isv_cardNewExpiryYear            | String         | false    |
| isv_tokenAction                  | String         | false    |
| isv_tokenUpdated                 | Boolean        | false    |
| isv_failedTokens                 | Set of Strings | false    |
| is_customerId                    | String         | false    |

### Payment Data

| Type    | Key              | Purpose                                                                                                                        |
| ------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| payment | isv_payment_data | Custom Visa Acceptance Solutions payment data such as tokens, card details used to trigger Visa Acceptance Solutions services. |

Fields

| Name                                 | Type    | Required | Notes                                                                                                                                                                                              |
| ------------------------------------ | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isv_token                            | String  | false    |                                                                                                                                                                                                    |
| isv_tokenAlias                       | String  | false    |                                                                                                                                                                                                    |
| isv_savedToken                       | String  | false    |                                                                                                                                                                                                    |
| isv_tokenVerificationContext         | String  | false    |                                                                                                                                                                                                    |
| isv_tokenCaptureContextSignature     | String  | false    |                                                                                                                                                                                                    |
| isv_cardType                         | String  | false    |                                                                                                                                                                                                    |
| isv_maskedPan                        | String  | false    |                                                                                                                                                                                                    |
| isv_cardExpiryMonth                  | String  | false    |                                                                                                                                                                                                    |
| isv_cardExpiryYear                   | String  | false    |                                                                                                                                                                                                    |
| isv_requestJwt                       | String  | false    |                                                                                                                                                                                                    |
| isv_responseJwt                      | String  | false    |                                                                                                                                                                                                    |
| isv_payerAuthenticationRequired      | Boolean | false    |                                                                                                                                                                                                    |
| isv_payerAuthenticationTransactionId | String  | false    |                                                                                                                                                                                                    |
| isv_payerAuthenticationAcsUrl        | String  | false    |                                                                                                                                                                                                    |
| isv_payerAuthenticationPaReq         | String  | false    |                                                                                                                                                                                                    |
| isv_acceptHeader                     | String  | false    |                                                                                                                                                                                                    |
| isv_userAgentHeader                  | String  | false    |                                                                                                                                                                                                    |                                                                                                                                                                                                   |
| isv_customerIpAddress                | String  | false    |                                                                                                                                                                                                    |
| isv_cardinalReferenceId              | String  | false    |                                                                                                                                                                                                    |
| isv_deviceDataCollectionUrl          | String  | false    |                                                                                                                                                                                                    |
| isv_stepUpUrl                        | String  | false    |                                                                                                                                                                                                    |
| isv_applePayValidationUrl            | String  | false    |                                                                                                                                                                                                    |
| isv_applePayDisplayName              | String  | false    |                                                                                                                                                                                                    |
| isv_applePaySessionData              | String  | false    |                                                                                                                                                                                                    |
| isv_payerEnrollTransactionId         | String  | false    |                                                                                                                                                                                                    |
| isv_payerEnrollStatus                | String  | false    |                                                                                                                                                                                                    |
| isv_payerEnrollHttpCode              | Number  | false    |                                                                                                                                                                                                    |
| isv_saleEnabled                      | Boolean | false    |                                                                                                                                                                                                    |
| isv_enabledMoto                      | Boolean | false    |                                                                                                                                                                                                    |
| isv_walletType                       | String  | false    |                                                                                                                                                                                                    |
| isv_accountNumber                    | String  | false    |                                                                                                                                                                                                    |
| isv_accountType                      | String  | false    |                                                                                                                                                                                                    |
| isv_routingNumber                    | String  | false    |                                                                                                                                                                                                    |
| isv_merchantId                       | String  | false    |                                                                                                                                                                                                    |
| isv_screenWidth                      | String  | false    |                                                                                                                                                                                                    |
| isv_screenHeight                     | String  | false    |                                                                                                                                                                                                    |
| isv_responseDateAndTime              | String  | false    |                                                                                                                                                                                                    |
| isv_authorizationStatus              | String  | false    | This field will be updated with the initial authorization or sale status from the payment gateway. If Visa Acceptance Solutions response doesn't reach the extension, this field will remain empty |
| isv_authorizationReasonCode          | Number  | false    |                                                                                                                                                                                                    |
| isv_ECI                              | String  | false    |                                                                                                                                                                                                    |
| isv_AVSResponse                      | String  | false    |                                                                                                                                                                                                    |
| isv_CVVResponse                      | String  | false    |                                                                                                                                                                                                    |
| isv_responseCode                     | String  | false    |                                                                                                                                                                                                    |
| isv_dmpaFlag                         | Boolean | false    |                                                                                                                                                                                                    |
| isv_shippingMethod                   | String  | false    |                                                                                                                                                                                                    |
| isv_metadata                         | String  | false    |                                                                                                                                                                                                    |
| isv_accountPurchaseCount             | Number  | false    |                                                                                                                                                                                                    |
| isv_payPalUrl                        | String  | false    |                                                                                                                                                                                                    |
| isv_payPalRequestId                  | String  | false    |                                                                                                                                                                                                    |

### Payment Error

| Type                          | Key               | Purpose                                                                                   |
| ----------------------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| payment-interface-interaction | isv_payment_error | Custom data to handle the exception thrown from Visa Acceptance Solutions payment service |

Fields

| Name          | Type   | Required |
| ------------- | ------ | -------- |
| reason        | String | true     |
| transactionId | String | false    |

### Payment Failure

| Type                          | Key                 | Purpose                                                                                |
| ----------------------------- | ------------------- | -------------------------------------------------------------------------------------- |
| payment-interface-interaction | isv_payment_failure | Custom data to handle the failed or rejected Visa Acceptance Solutions payment service |

Fields

| Name          | Type   | Required |
| ------------- | ------ | -------- |
| reasonCode    | String | true     |
| transactionId | String | true     |

### Transaction Data

| Type        | Key                  | Purpose                                       |
| ----------- | -------------------- | --------------------------------------------- |
| transaction | isv_transaction_data | Custom transaction fields for payment service |

Fields

| Name                       | Type   | Required |
| -------------------------- | ------ | -------- |
| isv_availableCaptureAmount | Number | true     |

# Creating API Extensions and Customizations

Once the environment properties are set and the extension is deployed successfully, the next step is about setting up the extension to receive requests from Commercetools.

Below is the Endpoint to create the extensions and the custom fields for the payment and customer resources accordingly to support the Visa Acceptance Solutions services.
| Endpoint | Note |
|---------------------|--------------|
| {baseUrl}/configureExtension | The baseUrl will be defined by where you deploy the Extension. HTTPS should be used for production. See [API Extension Setup](API-Extension-Setup.md#configuration) to know the values to be passed for the fields required before running the script |

This can be done by following any of the steps:

- By clicking the button in main page of the extension

  You can navigate to the `{baseUrl}/orders` endpoint and click on Run Script button in the UI page. This will invoke the `{baseUrl}/configureExtension` endpoint to handle the same.

> **_NOTE:_** Ensure to create the extensions using the extension endpoint provided in order to avoid authentication overheads later.

- By executing the following script command.

      npm run setup-resources

Following env variables are mandatory for Creating API Extensions and Customizations:

- PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL
- PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE
- CT_PROJECT_KEY
- CT_CLIENT_ID
- CT_CLIENT_SECRET
- CT_AUTH_HOST
- CT_API_HOST

Refer [API Extension Setup](./API-Extension-Setup.md#configuration) to know more about the value to be populated to each of the variable.

> **_NOTE:_** For all kind of deployments including local, AWS, Azure and for Docker image, the extension creation and customization using the npm command `npm run setup-resources` will be possible only if the system supports `npm`

> **_NOTE:_** Authentication is required for accessing any endpoint in the Extension, hence ensure to provide the valid values for the same. Refer [Authentication](./Authentication.md) for more information.

An example of custom field creation and setting data to the created custom field can be found in [Example-Custom-Field](./Example-Custom-Field.md)
