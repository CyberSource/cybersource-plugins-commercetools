# Commercetools Setup

  - [API Extension Setup](#APIExtensionSetup)
      - [Payment Create](#PaymentCreate)
      - [Payment Update](#PaymentUpdate)
  - [Resource
    Customisations](#ResourceCustomisations)
      - [Payment Interactions](#PaymentInteractions)
          - [Payment authorisation
            failed](#Paymentauthorisationfailed)
          - [Payer authentication enrolment
            check](#Payerauthenticationenrolmentcheck)
          - [Payer authentication
            validation](#Payerauthenticationvalidation)
      - [Payment](#Payment)


The customisations below are required for the API Extension to work
correctly. JSON versions of these definitions can be found in the
'ct-definitions' module of the library project.

# <a name="APIExtensionSetup"></a>API Extension Setup

## <a name="PaymentCreate"></a>Payment Create

An extension triggered by payment updates is required to process any
actions on a payment.


| Property                   | Value                                  | Note |
| -------------------------- | -------------------------------------- | ---- |
| key                        | isv\_payment\_create\_extension           | |
| type                       | HTTP                                   | The reference application only supports HTTP Destinations |
| url                        | {baseUrl}/api/extension/payment/create | The baseUrl will be defined by where you deploy the reference application. HTTPS should be used for production |
| authentication.type        | AuthorizationHeader                    | |
| authentication.headerValue | Basic {credentials}                    | Use the Basic authorization credentials from API Extension Setup → Application Configuration Properties |
| timeoutInMs                | 10000                                  | You will need commercetools support to increase the allowable maximum value |
| actions                    | Create                                 | |
| resourceTypeId             | payment                                | |


## <a name="PaymentUpdate"></a>Payment Update

An extension triggered by payment updates is required to process
authorisations


| Property                   | Value                                  | Note |
| -------------------------- | -------------------------------------- | ---- |
| key                        | isv\_payment\_update\_extension   |      |
| type                       | HTTP                                   | The reference application only supports HTTP Destinations |
| url                        | {baseUrl}/api/extension/payment/update | The baseUrl will be defined by where you deploy the reference application. HTTPS should be used for production |
| authentication.type        | AuthorizationHeader                    |      |
| authentication.headerValue | Basic {credentials}                    | Use the Basic authorization credentials from API Extension Setup → Application Configuration Properties |
| timeoutInMs                | 10000                                  | You will need commercetools support to increase the allowable maximum value |
| actions                    | Update                                 |      |
| resourceTypeId             | payment                                |      |


# <a name="ResourceCustomisations"></a>Resource Customisations

## <a name="PaymentInteractions"></a>Payment Interactions

### <a name="Paymentauthorisationfailed"></a>Payment authorisation failed


| Type                          | Key                         | Purpose |
| ----------------------------- | --------------------------- | ------- |
| payment-interface-interaction | isv\_payment\_failure | Used to save exception messages when there is a failure during payment |



Fields


| Name          | Type   | Required |
| ------------- | ------ | -------- |
| reason        | String | true     |
| transactionId | String | false    |


### <a name="Payerauthenticationenrolmentcheck"></a>Payer authentication enrolment check

| Type                          | Key                                              | Purpose |
| ----------------------------- | ------------------------------------------------ | ------- |
| payment-interface-interaction | isv\_payments\_payer\_authentication\_enrolment\_check | Stores values from request and response of payer authentication enrolment check. This is used in further Authorization calls. |


Fields


| Name                         | Type    | Required |Source                                             | Notes |
| ---------------------------- | ------- | -------- | ------------------------------------------------- | ----- |
| cardinalReferenceId          | String  | true     | Cardinal JWT                                      | Reference id of JWT sent to Cardinal as part of enrolment check |
| authenticationRequired       | Boolean | true     | payerAuthEnrollReply_reasonCode                   | Indicates that the authentication window needs to be displayed. Set to true when the Cybersource reason code is 475 |
| authorisationAllowed         | Boolean | true     | payerAuthEnrollReply_reasonCode                   | Indicates that an attempt to authorise the payment may be made. Set to true when Cybersource reason code is 100 or 475 |
| authenticationTransactionId  | String  | false    | payerAuthEnrollReply_authenticationTransactionID  | Value passed in Cardinal continue call to link back to Cybersource. Also passed back to Cybersource to validate authentication <br><br> Should always be present unless enrolment check times out |
| paReq                        | String  | false    | payerAuthEnrollReply_paReq                        | Passed in Cardinal continue call when authentication is required |
| acsUrl                       | String  | false    | payerAuthEnrollReply_acsURL                       | Passed in Cardinal continue call when authentication is required |
| xid                          | String  | false    | payerAuthEnrollReply_xid                          | Stored to verify enrolment check was made in case payment is challenged |
| proofXml                     | String  | false    | payerAuthEnrollReply_proofXML                     | Stored to verify enrolment check was made in case payment is challenged. 3D Secure 1.x only |
| specificationVersion         | String  | false    | payerAuthEnrollReply_specificationVersion         | Stored to verify enrolment check was made in case payment is challenged |
| directoryServerTransactionId | String  | false    | payerAuthEnrollReply_directoryServerTransactionID | Stored to verify enrolment check was made in case payment is challenged. 3D Secure 2.x only |
| veresEnrolled                | String  | false    | payerAuthEnrollReply_veresEnrolled                | Stored to verify enrolment check was made in case payment is challenged |
| commerceIndicator            | String  | false    | payerAuthEnrollReply_commerceIndicator            | Stored to verify enrolment check was made in case payment is challenged |
| eci                          | String  | false    | payerAuthEnrollReply_eci                          | Stored to verify enrolment check was made in case payment is challenged |


### <a name="Payerauthenticationvalidation"></a>Payer authentication validation

| Type                          | Key                                              | Purpose |
| ----------------------------- | ------------------------------------------------ | ------- |
| payment-interface-interaction | isv\_payments\_payer\_authentication\_validate\_result | Stores values from response of payer authentication validation. These values can also be returned from the enrolment check for 3D Secure 2.x frictionless payments. These values are saved for recordkeeping purposes only. |

Fields


| Name                         | Type   | Required | Source |
| ---------------------------- | ------ | -------- | ------ |
| authenticationResult         | String | false    | payerAuthValidateReply_authenticationResult or payerAuthEnrolReply_authenticationResult |
| authenticationStatusMessage  | String | false    | payerAuthEnrolReply_authenticationStatusMessage or payerAuthValidateReply_authenticationStatusMessage |
| ucafCollectionIndicator      | String | false    | payerAuthEnrolReply_ucafCollectionIndicator or payerAuthValidateReply_ucafCollectionIndicator |
| ucafAuthenticationData       | String | false    | payerAuthEnrolReply_ucafAuthenticationData or payerAuthValidateReply_ucafAuthenticationData |
| cavv                         | String | false    | payerAuthEnrolReply_cavv or payerAuthValidateReply_cavv |
| cavvAlgorithm                | String | false    | payerAuthEnrolReply_cavvAlgorithm or payerAuthValidateReply_cavvAlgorithm |
| xid                          | String | false    | payerAuthEnrollReply_xid or payerAuthValidateReply_xid |
| specificationVersion         | String | false    | payerAuthEnrolReply_specificationVersion or payerAuthValidateReply_specificationVersion |
| directoryServerTransactionId | String | false    | payerAuthEnrolReply_directoryServerTransactionID or payerAuthValidateReply_directoryServerTransactionID |
| commerceIndicator            | String | false    | payerAuthEnrolReply_commerceIndicator or payerAuthValidateReply_commerceIndicator |
| eci                          | String | false    | payerAuthEnrolReply_eci or payerAuthValidateReply_eci |
| eciRaw                       | String | false    | payerAuthEnrolReply_eciRaw or payerAuthValidateReply_eciRaw |
| paresStatus                  | String | false    | payerAuthEnrolReply_paresStatus or payerAuthValidateReply_paresStatus |

## <a name="Payment"></a>Payment

All fields are optional within commerce tools, but some fields are
contextually required - depending on the actions taken, the API
extension may reject a payment due to missing required fields.

| Type    | Key                      | Purpose                   |
| ------- | ------------------------ | ------------------------- |
| payment | isv\_payment\_data         | ISV custom payment fields |

Fields

| Field                               | Type    | Required/Optional/Not allowed (At Auth)                    | Source               | Notes |
| ----------------------------------- | ------- | ---------------------------------------------------------- | -------------------- | ----- |
| isv_token                            | String  | Paying with new token (R) <br> Paying with saved token (N) | Payment creation     | Tokenized card details |
| isv_tokenVerificationContext         | String  | Paying with new token (R) <br> Paying with saved token (N) | Payment creation     | Tokenized card details |
| isv_tokenAlias                       | String  | Paying with new token (O) <br> Paying with saved token (N) | Payment creation     | Tokenized card details |
| isv_savedToken                       | String  | Paying with new token (N) <br> Paying with saved token (R) | Payment creation     | Tokenized card details |
| isv_cardType                         | String  | R                                                          | Payment creation     | Visa, Mastercard, etc. |
| isv_maskedPan                        | String  | O                                                          | Payment creation     | Recommended to be set for display purposes |
| isv_cardExpiryMonth                  | String  | O                                                          | Payment creation     | Recommended to be set for display purposes |
| isv_cardExpiryYear                   | String  | O                                                          | Payment creation     | Recommended to be set for display purposes |
| isv_requestJwt                       | String  | Without payer auth (O) <br> With payer auth (R)            | Payment creation     | Retrieved from /jwt service. The same value is sent to Cardinal |
| isv_responseJwt                      | String  | Without payer auth (O) <br> With payer auth (see notes)    | Transaction addition | When authentication is required the value returned from Cardinal must be added to the payment |
| isv_payerAuthenticationRequired      | Boolean | Without payer auth (O) <br> With payer auth (see notes)    | Extension            | Populated when processing payment creation. If true Cardinal.continue must be called to authenticate payer |
| isv_payerAuthenticationTransactionId | String  | Without payer auth (O) <br> With payer auth (see notes)    | Extension            | Populated when processing payment creation. To be passed in Cardinal.continue call when required |
| isv_payerAuthenticationAcsUrl        | String  | Without payer auth (O) <br> With payer auth (see notes)    | Extension            | Populated when processing payment creation. To be passed in Cardinal.continue call when required |
| isv_payerAuthenticationPaReq         | String  | Without payer auth (O) <br> With payer auth (see notes)    | Extension            | Populated when processing payment creation. To be passed in Cardinal.continue call when required |
| isv_acceptHeader                     | String  | Without payer auth (O) <br> With payer auth (R)            | Payment creation     | Value of the Accept header from the user's browser |
| isv_userAgentHeader                  | String  | Without payer auth (O) <br> With payer auth (R)            | Payment creation     | Value of the UserAgent header from the user's browser |
| isv_deviceFingerprintId              | String  | O                                                          | Payment creation     | Value of session id used for device fingerprinting |
