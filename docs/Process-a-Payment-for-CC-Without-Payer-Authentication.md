# Process a Payment for CC (Without Payer Authentication)

Processing of a payment is triggered by adding an initial transaction to a Commercetools payment resource. Before this can be done, the payment must be populated with the amount, a token representing the payment card and the billing address associated with the card.

## Credit Card without Payer Authentication Sequence Diagram

![Payment Flow](images/Flow-Diagram-CreditCard.svg)

## Details

1.  Prepare your cart

    a. Ensure your cart locale is set

    b. Ensure the cart billing and shipping addresses are set. The default mapping of Commercetools address fields to Cybersource fields is as follows
    
    > **_NOTE:_** : If the cart has multiple shipping methods, the shipping address of the first available shipping method applied to the cart will be used to process the payment

    | Commercetools address       | Cybersource shipping fields | Cybersource billing fields | Notes                                                                                                                |
    | --------------------------- | --------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
    | firstName                   | shipTo_firstName            | billTo_firstName           |                                                                                                                      |
    | lastName                    | shipTo_lastName             | billTo_lastName            |                                                                                                                      |
    | streetNumber and streetName | shipTo_address1             | billTo_address1            | If both values populated they are concatenated together with a space between. Otherwise streetName is used by itself |
    | city                        | shipTo_city                 | billTo_city                |                                                                                                                      |
    | postalCode                  | shipTo_postalCode           | billTo_postalCode          |                                                                                                                      |
    | region                      | shipTo_state                | billTo_state               |                                                                                                                      |
    | country                     | shipTo_country              | billTo_country             |                                                                                                                      |
    | email                       | shipTo_email                | billTo_email               |                                                                                                                      |

2.  Tokenize Credit Card details using Cybersource Flex

        Skip this step when using a saved token and proceed to step 3

    a. Create a Commercetools payment (https://docs.commercetools.com/api/projects/payments) and populate the following

    | Property                           | Value                               | Required  | Notes                                                                                                                                                               |
    | ---------------------------------- | ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | customer                           | Reference to Commercetools customer | See notes | Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated |
    | anonymousId                        | Id for tracking guest checkout      | See notes | Required for guest checkout. If using MyPayments API this will automatically be set. One of customer or anonymousId must be populated                               |
    | amountPlanned                      | Amount to be processed                 | Yes       | Should match cart gross total, unless split payments are being used                                                                                                 |
    | paymentMethodInfo.paymentInterface | cybersource                         | Yes       |                                                                                                                                                                     |
    | paymentMethodInfo.method           | creditCard                          | Yes       |                                                                                                                                                                     |
    | custom.type.key                    | isv_payment_data                    | Yes       |                                                                                                                                                                     |
    | custom.fields.isv_merchantId                      | Merchant Id used for the transaction                               | No       |              Required when you want to support Multi-Mid functionality. Populate this field with the value of merchant Id in which the transaction should happen. When this field is empty, default mid configuration will be considered for the transaction. The same mid will be used for the follow-on transactions..                                                                                                                                                                                                                                                                                                       |

    b. The response should have the `isv_tokenCaptureContextSignature` and `isv_tokenVerificationContext` custom fields, set the `isv_tokenCaptureContextSignature` custom field value to the captureContext of flex object which will load Cybersource Microform

        flexInstance = new Flex(captureContext);

    c. Use the Microform Integration v2 to tokenize card details. See <https://github.com/CyberSource/cybersource-flex-samples-node> for an example of how to use the captureContext obtained above and the Microform JS to tokenize a Credit Card

3.  For saved token, create a Commercetools payment (https://docs.commercetools.com/api/projects/payments) and populate the following

    | Property                              | Value                               | Required  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | ------------------------------------- | ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | customer                              | Reference to Commercetools customer | See notes | Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | anonymousId                           | Id for tracking guest checkout      | See notes | Required for guest checkout. If using MyPayments API this will automatically be set. One of customer or anonymousId must be populated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | amountPlanned                         | Amount to be processed                | Yes       | Should match cart gross total, unless split payments are being used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | paymentMethodInfo.paymentInterface    | cybersource                         | Yes       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | paymentMethodInfo.method              | creditCard                          | Yes       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | custom.type.key                       | isv_payment_data                    | Yes       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | custom.fields.isv_savedToken          | Saved token value                   | Yes       | custom.fields.isv_tokens's "paymentToken" value from Customer object                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | custom.fields.isv_tokenAlias          | Alias for saved token               | No        | custom.fields.isv_tokens's "alias" value from Customer object                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
    | custom.fields.isv_maskedPan           | Masked Credit Card number           | No        | custom.fields.isv_tokens's "cardNumber" value from Customer object. <br>Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
    | custom.fields.isv_cardType            | Credit Card type                    | No        | custom.fields.isv_tokens's "cardType" value from Customer object. <br>Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | custom.fields.isv_cardExpiryMonth     | Card expiry month                   | No        | custom.fields.isv_tokens's "cardExpiryMonth" value from Customer object <br>Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | custom.fields.isv_cardExpiryYear      | Card expiry year                    | No        | custom.fields.isv_tokens's "cardExpiryYear" value from Customer object <br>Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint Id      | Yes       | Refer [Device Fingerprinting](./Decision-Manager.md#device-fingerprinting) to generate this value |
    | custom.fields.isv_saleEnabled         | false                         | Yes       | Set the value to true if sale is enabled                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | custom.fields.isv_merchantId                      | Merchant Id used for the transaction                               | No       |              Required when you want to support Multi-Mid functionality. Populate this field with the value of merchant Id in which the transaction should happen. When this field is empty, default mid configuration will be considered for the transaction.                                                                                                                                                                                                                                                                                                       |
    | custom.fields.isv_securityCode                      | Security code for Credit Card                               | No       |              Required when you want to send the Credit Card security code (CVV) during a saved card transaction                                                                                                                                                                                                                                                                                                       |

    Also see [Decision Manager](Decision-Manager.md) for additional fields to be populated if you are using Decision Manager

4.  Add the payment to the cart

5.  Update a Commercetools payment (<https://docs.commercetools.com/api/projects/payments>) and populate the following

    Skip this step for saved token

    | Property                              | Value                          | Required  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | ------------------------------------- | ------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | custom.fields.isv_token               | Cybersource flex token         | See notes | This is the token parameter passed into the callback for the microform.createToken call <br><br> Required when not using a saved token                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
    | custom.fields.isv_tokenAlias          | Alias for saved token          | No        | When this is specified the token will be saved as a subscription for later use. Merchant can either provide a input text field asking for the customer to provide value for this field or a checkbox to select if the token needs be saved as a subscription for later use. In the latter case, Merchant should provide a unique value upon selecting the checkbox                                                                                                                                                                                                                                                                                                                                            |
    | custom.fields.isv_maskedPan           | Masked Credit Card number      | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a `flexData.content.paymentInformation.card.number.bin + flexData.content.paymentInformation.card.number.maskedValue` field containing the masked card number <br><br> Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | custom.fields.isv_cardType            | Credit Card type               | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a `flexData.content.paymentInformation.card.number.detectedCardTypes[0]` field containing the card type <br><br> Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | custom.fields.isv_cardExpiryMonth     | Card expiry month              | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a `flexData.content.paymentInformation.card.expirationMonth.value` field containing the card type <br><br> Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | custom.fields.isv_cardExpiryYear      | Card expiry year               | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a `flexData.content.paymentInformation.card.expirationYear.value` field containing the card type <br><br> Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint Id | Yes       | Refer [Device Fingerprinting](./Decision-Manager.md#device-fingerprinting) to generate this value |
    | custom.fields.isv_customerIpAddress   | Customer IP address            | No        | Populated from client-side libraries                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | custom.fields.isv_saleEnabled         | false                         | Yes       | Set the value to true if sale is enabled                                                                                                                                                                                                                                                                                                                                                                                                                                           |

6.  Add a transaction to the payment with the following values populated

        If only Authorization is required, populate the following fields to the payment

    | Property | Value               | Notes                                 |
    | -------- | ------------------- | ------------------------------------- |
    | type     | Authorization       |                                       |
    | state    | Initial             |                                       |
    | amount   | Amount to be processed | Should match amountPlanned on payment |

        If Sale is enabled, populate the following fields to the payment

    | Property | Value               | Notes                                 |
    | -------- | ------------------- | ------------------------------------- |
    | type     | Charge              |                                       |
    | state    | Initial             |                                       |
    | amount   | Amount to be processed | Should match amountPlanned on payment |

7.  Verify the payment state and convey the payment result to the customer

    a. If the transaction is successful, transaction state will be updated to **Success**, display the order confirmation page

    b. If the state of transaction is updated to **Pending** which is due to Fraud, display the order confirmation page

    c. If the state of transaction is updated to **Failure**, display the error page and See [Overview\#Errorhandling](Overview.md#error-handling) for handling errors or failures

## Stored values

When a token is saved as a subscription the saved token value will be returned as a custom property on the payment called isv_savedToken.

See [Commercetools Setup](Commercetools-Setup.md) for more details on the individual fields.