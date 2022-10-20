# Commercetools Setup

- [API Extension Setup](#APIExtensionSetup)
  - [Payment Create](#PaymentCreate)
  - [Payment Update](#PaymentUpdate)
  - [Customer Update](#CustomerUpdate)
- [Resource Customizations](#ResourceCustomizations)
  - [Payment Interactions](#PaymentInteractions)
    - [Customer tokens](#CustomerTokens)
    - [Payment data](#PaymentData)
    - [Payer authentication enrolment check](#PayerAuthenticationEnrolmentCheck)
    - [Payer authentication validate result](#PayerAuthenticationValidation)
    - [Payment error](#PaymentError)
    - [Payment failure](#PaymentFailure)
- [Creating API Extensions and Customizations](#ApiExtensions)

The customizations below are required for the API Extension to work correctly. JSON versions of these definitions are available in src/resources folder of the plugin and can be run as an endpoint to load them into Commercetools.

> **_NOTE:_** <ul><li>The extension timeout of 10000ms is required for Payment create and update API</li><li>Commercetools by default will have 2000ms for Customer update API, contact Commercetools support team to increase the timeout to 3000ms</li></ul>

# <a name="APIExtensionSetup"></a>API Extension Setup

## <a name="PaymentCreate"></a>Payment Create

An extension triggered by payment create is required to process any
actions on a payment resource.

| Property                   | Value                                  | Note                                                                                               |
| -------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| key                        | isv_payment_create_extension           |                                                                                                    |
| type                       | HTTP                                   | The plugin only supports HTTP Destinations                                                         |
| url                        | {baseUrl}/api/extension/payment/create | The baseUrl will be defined by where you deploy the plugin. HTTPS should be used for production    |
| authentication.type        | AuthorizationHeader                    |                                                                                                    |
| authentication.headerValue | Bearer {credentials}                   | {credentials} will be the encrypted Base 64 encode value of the pair username:password of Commercetools |
| timeoutInMs                | 10000                                  | You will need Commercetools support to increase the allowable maximum value                        |
| actions                    | Create                                 |                                                                                                    |
| resourceTypeId             | payment                                |                                                                                                    |

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
| isv_deviceFingerprintId          | String         | false    |
| isv_cardNewExpiryMonth           | String         | false    |
| isv_cardNewExpiryYear            | String         | false    |
| isv_tokenAction                  | String         | false    |
| isv_tokenUpdated                 | Boolean        | false    |
| isv_failedTokens                 | Set of Strings | false    |

### <a name="PaymentData"></a>Payment Data

| Type    | Key              | Purpose                                                                                            |
| ------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| payment | isv_payment_data | Custom Cybersource payment data such as tokens, card details used to trigger Cybersource services. |

An extension triggered by payment updates is required to process any update actions on a payment resource

| Property                   | Value                                  | Note                                                                                               |
| -------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| key                        | isv_payment_update_extension           |                                                                                                    |
| type                       | HTTP                                   | The plugin only supports HTTP Destinations                                                         |
| url                        | {baseUrl}/api/extension/payment/update | The baseUrl will be defined by where you deploy the plugin. HTTPS should be used for production    |
| authentication.type        | AuthorizationHeader                    |                                                                                                    |
| authentication.headerValue | Bearer {credentials}                   | {credentials} will be the encrypted Base 64 encode value of the pair username:password of Commercetools |
| timeoutInMs                | 10000                                  | You will need Commercetools support to increase the allowable maximum value                        |
| actions                    | Update                                 |                                                                                                    |
| resourceTypeId             | payment                                |                                                                                                    |

## <a name="CustomerUpdate"></a>Customer Update

An extension triggered by customer update is required to process any update actions on customer resource.

| Property                   | Value                                   | Note                                                                                               |
| -------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| key                        | isv_customer_update_extension           |                                                                                                    |
| type                       | HTTP                                    | The plugin only supports HTTP Destinations                                                         |
| url                        | {baseUrl}/api/extension/customer/update | The baseUrl will be defined by where you deploy the plugin. HTTPS should be used for production    |
| authentication.type        | AuthorizationHeader                     |                                                                                                    |
| authentication.headerValue | Bearer {credentials}                    | {credentials} will be the encrypted Base 64 encode value of the pair username:password of Commercetools |
| timeoutInMs                | 3000                                    | You will need Commercetools support to increase the allowable maximum value                        |
| actions                    | Update                                  |                                                                                                    |
| resourceTypeId             | customer                                |                                                                                                    |

# <a name="ResourceCustomizations"></a>Resource Customizations

## <a name="PaymentInteractions"></a>Payment Interactions

### <a name="CustomerTokens"></a>Customer Tokens

| Type     | Key                          | Purpose                                              |
| -------- | ---------------------------- | ---------------------------------------------------- |
| customer | isv_payments_customer_tokens | Custom data type to store Cybersource payment tokens |

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
| isv_deviceFingerprintId          | String         | false    |
| isv_cardNewExpiryMonth           | String         | false    |
| isv_cardNewExpiryYear            | String         | false    |
| isv_tokenAction                  | String         | false    |
| isv_tokenUpdated                 | Boolean        | false    |
| isv_failedTokens                 | Set of Strings | false    |

### <a name="PaymentData"></a>Payment Data

| Type    | Key              | Purpose                                                                                            |
| ------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| payment | isv_payment_data | Custom Cybersource payment data such as tokens, card details used to trigger Cybersource services. |

Fields

| Name                                 | Type    | Required | 
| ------------------------------------ | ------- | -------- |
| isv_token                            | String  | false    |
| isv_tokenAlias                       | String  | false    |
| isv_savedToken                       | String  | false    |
| isv_tokenVerificationContext         | String  | false    |
| isv_tokenCaptureContextSignature     | String  | false    |
| isv_cardType                         | String  | false    |
| isv_maskedPan                        | String  | false    |
| isv_cardExpiryMonth                  | String  | false    |
| isv_cardExpiryYear                   | String  | false    |
| isv_requestJwt                       | String  | false    |
| isv_responseJwt                      | String  | false    |
| isv_payerAuthenticationRequired      | Boolean | false    |
| isv_payerAuthenticationTransactionId | String  | false    |
| isv_payerAuthenticationAcsUrl        | String  | false    |
| isv_payerAuthenticationPaReq         | String  | false    |
| isv_acceptHeader                     | String  | false    |
| isv_userAgentHeader                  | String  | false    |
| isv_deviceFingerprintId              | String  | false    |
| isv_customerIpAddress                | String  | false    |
| isv_cardinalReferenceId              | String  | false    |
| isv_deviceDataCollectionUrl          | String  | false    |
| isv_stepUpUrl                        | String  | false    |
| isv_applePayValidationUrl            | String  | false    |
| isv_applePayDisplayName              | String  | false    |
| isv_applePaySessionData              | String  | false    |
| isv_payerEnrollTransactionId         | String  | false    |
| isv_payerEnrollStatus                | String  | false    |
| isv_payerEnrollHttpCode              | Number  | false    |
| isv_saleEnabled                      | Boolean | false    |
| isv_enabledMoto                      | Boolean | false    |
| isv_walletType                       | String  | false    |
| isv_accountNumber                    | String  | false    |
| isv_accountType                      | String  | false    |
| isv_routingNumber                    | String  | false    |
### <a name="PayerAuthenticationEnrolmentCheck"></a>Payer authentication enrolment check

| Type                          | Key                                               | Purpose                                                                  |
| ----------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------ |
| payment-interface-interaction | isv_payments_payer_authentication_enrolment_check | ISV payment service interaction for payer authentication enrolment check |

Fields

| Name                         | Type    | Required | Source                                                   | Notes                                                                                                                                                                                             |
| ---------------------------- | ------- | -------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cardinalReferenceId          | String  | true     | Payer Authentication setup call                          | Reference Id of payer authentication setup is sent for enrolment check                                                                                                                            |
| authenticationRequired       | Boolean | true     | Enrolment check response                                 | Indicates that the authentication window needs to be displayed. Set to true when the Cybersource Authorization httpCode is 201 and status is 'PENDING_AUTHENTICATION'                             |
| authorizationAllowed         | Boolean | true     | Enrolment check response                                 | Indicates that an attempt to authorize the payment may be made. Set to true when the Cybersource httpCode is 201 and status is 'PENDING_AUTHENTICATION' for enrolment check                       |
| authenticationTransactionId  | String  | false    | Enrolment check response                                 | Value passed in Cardinal continue call to link back to Cybersource. Also passed back to Cybersource to validate authentication <br><br> Should always be present unless enrolment check times out |
| paReq                        | String  | false    | Enrolment check response                                 | Passed to Authentication validation call when the Cybersource httpCode is 201 and status is 'PENDING_AUTHENTICATION' for enrolment check                                                          |
| acsUrl                       | String  | false    | Enrolment check response                                 | Passed to Authentication validation call when the Cybersource httpCode is 201 and status is 'PENDING_AUTHENTICATION' for enrolment check                                                          |
| xid                          | String  | false    | Enrolment check response                                 | Stored to verify enrolment check was made in case payment is challenged                                                                                                                           |
| proofXml                     | String  | false    | Enrolment check response                                 | Stored to verify enrolment check was made in case payment is challenged. 3D Secure 1.x only                                                                                                       |
| specificationVersion         | String  | false    | enrolment check response                                 | Stored to verify enrolment check was made in case payment is challenged                                                                                                                           |
| directoryServerTransactionId | String  | false    | Enrolment check response                                 | Stored to verify enrolment check was made in case payment is challenged. 3D Secure 2.x only                                                                                                       |
| veresEnrolled                | String  | false    | Enrolment check response                                 | Stored to verify enrolment check was made in case payment is challenged                                                                                                                           |
| commerceIndicator            | String  | false    | Enrolment check response                                 | Stored to verify enrolment check was made in case payment is challenged                                                                                                                           |
| eci                          | String  | false    | Payer auth validation result or enrolment check response | Stored to verify enrolment check was made in case payment is challenged                                                                                                                           |

### <a name="PayerAuthenticationValidation"></a>Payer authentication validation

| Type                          | Key                                               | Purpose                                                                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| payment-interface-interaction | isv_payments_payer_authentication_validate_result | Stores values from response of payer authentication validation. These values can also be returned from the enrolment check for 3D Secure 2.x frictionless payments. These values are saved for record keeping purposes only. |

Fields

| Name                         | Type   | Required | Source                                                   |
| ---------------------------- | ------ | -------- | -------------------------------------------------------- |
| authenticationResult         | String | false    | Payer auth validation result or enrolment check response |
| authenticationStatusMessage  | String | false    | Payer auth validation result or enrolment check response |
| cavv                         | String | false    | Payer auth validation result or enrolment check response |
| cavvAlgorithm                | String | false    | Payer auth validation result or enrolment check response |
| xid                          | String | false    | Payer auth validation result or enrolment check response |
| specificationVersion         | String | false    | Payer auth validation result or enrolment check response |
| directoryServerTransactionId | String | false    | Payer auth validation result or enrolment check response |
| commerceIndicator            | String | false    | Payer auth validation result or enrolment check response |
| eci                          | String | false    | Payer auth validation result or enrolment check response |
| eciRaw                       | String | false    | Payer auth validation result or enrolment check response |
| paresStatus                  | String | false    | Payer auth validation result or enrolment check response |
| ucafCollectionIndicator      | String | false    | Payer auth validation result or enrolment check response |
| ucafAuthenticationData       | String | false    | Payer auth validation result or enrolment check response |

### <a name="PaymentError"></a>Payment Error

| Type                          | Key               | Purpose                                                                     |
| ----------------------------- | ----------------- | --------------------------------------------------------------------------- |
| payment-interface-interaction | isv_payment_error | Custom data to handle the exception thrown from Cybersource payment service |

Fields

| Name          | Type   | Required |
| ------------- | ------ | -------- |
| reason        | String | true     |
| transactionId | String | false    |

### <a name="PaymentFailure"></a>Payment Failure

| Type                          | Key                 | Purpose                                                                  |
| ----------------------------- | ------------------- | ------------------------------------------------------------------------ |
| payment-interface-interaction | isv_payment_failure | Custom data to handle the failed or rejected Cybersource payment service |

Fields

| Name          | Type   | Required |
| ------------- | ------ | -------- |
| reasonCode    | String | true     |
| transactionId | String | true     |

# <a name="ApiExtensions"></a>Creating API Extensions and Customizations

Once the environment properties are set and the plugin is deployed successfully, the next step is about setting up the plugin to receive requests from Commercetools.

Below is the Endpoint to create the extensions and the custom fields for the payment and customer resources accordingly to support the Cybersource services. Before running the endpoint, Cybersource Plugin API Key must be created with the required scope, see Cybersource Plugin API Key in [Key Creation](Key-Creation.md)

| Endpoint                  | Note                                                                                                                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| {baseUrl}/configurePlugin | The baseUrl will be defined by where you deploy the plugin. HTTPS should be used for production. See [API Extension Setup](API-Extension-Setup.md) to know the values to be passed for the fields required before running the script |

Alternatively, navigate to the `{baseUrl}/orders` endpoint and click on **Run Script** button in the UI page. This will invoke the `{baseUrl}/configurePlugin` endpoint to handle the same. Ensure to create the extensions using the plugin endpoint provided in order to avoid authentication overheads later.

> **_NOTE:_** Authentication is required for accessing any endpoint in the plugin, hence ensure to provide the valid values for the same. Refer [Authentication](./Authentication.md) for more information.
