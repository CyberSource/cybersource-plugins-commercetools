# Release notes

## 1.5.1

### Configuration properties

The following configuration properties and corresponding environment variables have been renamed


| Old property                             | Old environment variable                    | New property                              | New environment variable                      |
| ---------------------------------------- |-------------------------------------------- | ----------------------------------------- | --------------------------------------------- |
| env.cybersource.merchantID               | env\_cybersource\_merchantID                | env.isv.payments.merchantID               | env\_isv\_payments\_merchantID                |
| env.cybersource.sharedSecret.id          | env\_cybersource\_sharedSecret\_id          | env.isv.payments.sharedSecret.id          | env\_isv\_payments\_sharedSecret\_id>         |
| env.cybersource.keysDirectory            | env\_cybersource\_keysDirectory             | env.isv.payments.keysDirectory            | env\_isv\_payments\_keysDirectory             |
| env.cybersource.service.keyGenerationUrl | env\_cybersource\_service\_keygenerationurl | env.isv.payments.service.keyGenerationUrl | env\_isv\_payments\_service\_keygenerationurl |
| env.cybersource.service.jwtCreationUrl   | env\_cybersource\_service\_jwtcreationurl   | env.isv.payments.service.jwtCreationUrl   | env\_isv\_payments\_service\_jwtcreationurl   |
| env.cybersource.flex.targetOrigins       | env\_cybersource\_flex\_targetOrigins       | env.isv.payments.flex.targetOrigins       | env\_isv\_payments\_flex\_targetOrigins       |
| env.cybersource.flex.verificationKey     | env\_cybersource\_flex\_verificationKey     | env.isv.payments.flex.verificationKey     | env\_isv\_payments\_flex\_verificationKey     |
| secrets.cybersource.sharedSecret.value   | secrets\_cybersource\_sharedSecret\_value   | secrets.isv.payments.sharedSecret.value   | secrets\_isv\_payments\_sharedSecret\_value   |
| secrets.cybersource.keyPassword          | secrets\_cybersource\_keyPassword           | secrets.isv.payments.keyPassword          | secrets\_isv\_payments\_keyPassword           |
| secrets.cybersource.visaCheckout.apiKey  | secrets\_cybersource\_visaCheckout\_apiKey  | secrets.isv.payments.visaCheckout.apiKey  | secrets\_isv\_payments\_visaCheckout\_apiKey  |


### Commercetools

The value to be set for the paymentInterface field on the paymentMethodInfo resource has changed from **cybersource** to **isv_payments**

The following customisations have changed. The old customisations should be removed and the new ones loaded

#### Custom payment fields

The key for the payment custom fields type has changed from **cybersource\_payment\_data** to **isv\_payment\_data**

Fields have been renamed as follows

| Old field                                      | New field                              |
| ---------------------------------------------- | -------------------------------------- |
| cybersource_token                              | isv_token                              |
| cybersource_tokenAlias                         | isv_tokenAlias                         |
| cybersource_savedToken                         | isv_savedToken                         |
| cybersource_tokenVerificationContext           | isv_tokenVerificationContext           |
| cybersource_tokenCaptureContextSignature       | isv_tokenCaptureContextSignature       |
| cybersource_cardType                           | isv_cardType                           |
| cybersource_maskedPan                          | isv_maskedPan                          |
| cybersource_cardExpiryMonth                    | isv_cardExpiryMonth                    |
| cybersource_cardExpiryYear                     | isv_cardExpiryYear                     |
| cybersource_requestJwt                         | isv_requestJwt                         |
| cybersource_responseJwt                        | isv_responseJwt                        |
| cybersource_payerAuthenticationRequired        | isv_payerAuthenticationRequired        |
| cybersource_payerAuthenticationTransactionId   | isv_payerAuthenticationTransactionId   |
| cybersource_payerAuthenticationAcsUrl          | isv_payerAuthenticationAcsUrl          |
| cybersource_payerAuthenticationPaReq           | isv_payerAuthenticationPaReq           |
| cybersource_acceptHeader                       | isv_acceptHeader                       |
| cybersource_userAgentHeader                    | isv_userAgentHeader                    |
| cybersource_deviceFingerprintId                | isv_deviceFingerprintId                |
| cybersource_customerIpAddress                  | isv_customerIpAddress                  |
| cybersource\_merchantDefinedData\_mddField\_1* | isv\_merchantDefinedData\_mddField\_1* |
| cybersource_tokens                             | isv_tokens                             |
| cybersource_productCode                        | isv_productCode                        |
| cybersource_productRisk                        | isv_productRisk                        |

\* also fields ending in 2-100

#### Types

In addition to the above the following types have changed keys

| Old key                                              | New key                                                |
| ---------------------------------------------------- | ------------------------------------------------------ |
| cybersource\_payment\_failure                        | isv\_payment\_failure                                  |
| cybersource\_payer\_authentication\_enrolment\_check | isv\_payments\_payer\_authentication\_enrolment\_check |
| cybersource\_payer\_authentication\_validate\_result | isv\_payments\_payer\_authentication\_validate\_result |
| cybersource\_line\_item\_data                        | isv\_payments\_line\_item\_data                        |
| cybersource\_payment\_error                          | isv_payments\_payment\_error                           |


#### Extensions

The following extensions have been renamed, but no changes have been made to their content

**cybersource\_payment\_create\_extension** has been renamed to **isv\_payment\_create\_extension**

**cybersource\_payment\_update\_extension** has been renamed to **isv\_payment\_update\_extension**

### Library

#### Modules

Modules have been renamed as follows

| Old module name | New module name |
| --------------- | --------------- |
| cs-payments     | isv-payments    |
| cs-ct-mapping   | isv-ct-mapping  |
| cs-3ds          | isv-3ds         |
| cs-ct-sync      | isv-ct-sync     |

#### Classes

Classes have been renamed as follows

| Old name                                   | New name                                      |
| ------------------------------------------ | --------------------------------------------- |
| CybersourceClient                          | PaymentServiceClient                          |
| CybersourceRequest                         | PaymentServiceRequest                         |
| CybersourceIds                             | PaymentServiceIds                             |
| DefaultCybersourceResponseAddressMapper    | DefaultPaymentServiceResponseAddressMapper    |
| CybersourceResponseAddressMapper           | PaymentServiceResponseAddressMapper           |
| CybersourceResponseToFieldGroupTransformer | PaymentServiceResponseToFieldGroupTransformer |
| CsTransactionSearch                        | IsvTransactionSearch                          |
| CsTransactionSearchPagination              | IsvTransactionSearchPagination                |
| CsTransactionApplicationConstants          | IsvTransactionApplicationConstants            |
| CsTransactionSearchService                 | IsvTransactionSearchService                   |
| CsTransactionSearchImpl                    | IsvTransactionSearchImpl                      |


#### KeyService

isv.flex.service.KeyService has a changed constructor

_Old constructor_

```java
public KeyService(ApiClient apiClient, String targetOrigins)
```

_New constructor_

```java
public KeyService(Properties paymentServiceProperties, String targetOrigins, int connectTimeout)
```

Previously is was necessary to configure an APIClient using the paymentServiceProperties and connectTimeout, and then pass that to the constructor. To reduce exposed dependencies the paymentServiceProperties and connectTimeout are now passed to the consructor

#### Definitions

The definition file in ct-definition have been updated in accordance with the Commercetools field/type renamings above