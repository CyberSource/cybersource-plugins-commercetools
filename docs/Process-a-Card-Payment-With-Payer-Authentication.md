# Process a Card Payment (With Payer Authentication)

To process a payment with 3DS functionality, a payment should be created with the amount to be processed, a token representing the payment card and the billing address associated with the card.

A check will be made during payment updation to see if the card is enrolled in 3DS and if authentication is required. If authentication is required, the created payment will contain data required to continue the authentication process.

After authentication is complete, authorization of the payment can then be triggered by adding an initial transaction to the payment.

## Card Payment with Payer Auth Sequence Diagram

![Payment flow with Payer Authentication](images/Flow-Diagram-PayerAuthentication.svg)

## Details

1.  Prepare your cart

    a. Ensure the cart locale is set

    b. Ensure the cart billing and shipping addresses are set. The default mapping of Commercetools address fields to Cybersource fields is as follows

    > **_NOTE:_** : If the cart has multiple shipping methods, the shipping address of the first available shipping method applied to the cart will be used to process the payment

    | Commercetools address       | Cybersource shipping fields | Cybersource billing fields | Notes                                                                                                                |
    | --------------------------- | --------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
    | firstName                   | shipTo_firstName            | billTo_firstName           |                                                                                                                      |
    | lastName                    | shipTo_lastName             | billTo_lastName            |                                                                                                                      |
    | streetNumber and streetName | shipTo_address1             | billTo_address1            | If both values populated they are concatenated together with a space between. Otherwise streetName is used by itself |
    | city                        | shipTo_city                 | billTo_city                |                                                                                                                      |
    | postalCode                  | shipTo_postalCode           | billTo_postalCode          |                                                                                                                      |
    | region                      | shipTo_state                | billTo_state               |                                                                                                                      |
    | country                     | shipTo_country              | billTo_country             |                                                                                                                      |
    | email                       | shipTo_email                | billTo_email               |                                                                                                                      |
    | phone                       | shipTo_phone                | billTo_phone               |                                                                                                                      |

2.  Tokenize Card details using Cybersource Flex

        Skip this step when using a saved token and proceed to step 3

    a. Create a Commercetools payment (https://docs.commercetools.com/api/projects/payments) and populate the following

    | Property                           | Value                               | Required  | Notes                                                                                                                                                               |
    | ---------------------------------- | ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | customer                           | Reference to Commercetools customer | See notes | Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated |
    | anonymousId                        | Id for tracking guest checkout      | See notes | Required for guest checkout. If using MyPayments API this will automatically be set. One of customer or anonymousId must be populated                               |
    | amountPlanned                      | Amount to be processed                 | Yes       | Should match cart gross total, unless split payments are being used                                                                                                 |
    | paymentMethodInfo.paymentInterface | Cybersource                         | Yes       |                                                                                                                                                                     |
    | paymentMethodInfo.method           | creditCardWithPayerAuthentication   | Yes       |                                                                                                                                                                     |
    | custom.type.key                    | isv_payment_data                    | Yes       |                                                                                                                                                                     |
    | custom.fields.isv_merchantId                      | Merchant Id used for the transaction                               | No       |             Required when you want to support Multi-Mid functionality. Populate this field with the value of merchant Id in which the transaction should happen. When this field is empty, default mid configuration will be considered for the transaction. The same mid will be used for the follow-on transactions.                                                                                                                                                                                                                                                                                                     |

    b. The response should have the `isv_tokenCaptureContextSignature` and `isv_tokenVerificationContext` custom fields. Set the `isv_tokenCaptureContextSignature` custom field value to the captureContext of flex object which will load Cybersource Microform

        flexInstance = new Flex(captureContext);

    c. Use the Microform Integration v2 to tokenize card details. See <https://github.com/CyberSource/cybersource-flex-samples-node> for an example of how to use the captureContext obtained above and the Microform JS to tokenize a Card.

3.  For saved token, create a Commercetools payment (https://docs.commercetools.com/api/projects/payments) and populate the following

    | Property                           | Value                               | Required  | Notes                                                                                                                                                               |
    | ---------------------------------- | ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | customer                           | Reference to Commercetools customer | See notes | Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated |
    | anonymousId                        | Id for tracking guest checkout      | See notes | Required for guest checkout. If using MyPayments API this will automatically be set. One of customer or anonymousId must be populated                               |
    | amountPlanned                      | Amount to be processed                 | Yes       | Should match cart gross total, unless split payments are being used                                                                                                 |
    | paymentMethodInfo.paymentInterface | Cybersource                         | Yes       |                                                                                                                                                                     |
    | paymentMethodInfo.method           | creditCardWithPayerAuthentication   | Yes       |                                                                                                                                                                     |
    | custom.type.key                    | isv_payment_data                    | Yes       |                                                                                                                                                                     |
    | custom.fields.isv_savedToken       | Saved token value                   | Yes       | custom.fields.isv_tokens's "paymentToken" value from Customer object                                                                                                |
    | custom.fields.isv_tokenAlias       | Alias for saved token               | No        | custom.fields.isv_tokens's "alias" value from Customer object                                                                                                       |
    | custom.fields.isv_saleEnabled         | false                         | Yes       | Set the value to true if sale is enabled                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | custom.fields.isv_merchantId                      | Merchant Id used for the transaction                               | No       |              Required when you want to support Multi-Mid functionality. Populate this field with the value of Merchant Id in which the transaction should happen. When this field is empty, default mid configuration will be considered for the transaction.                                                                                                                                                                                                                                                                                                       |
  

4.  Add the payment to the cart

5.  Update the Commercetools payment (<https://docs.commercetools.com/api/projects/payments>) and populate the following

    a. Also see [Decision Manager](Decision-Manager.md) for additional fields to populate if you are using Decision Manager

    b. When the payment is being updated, the extension will do a Payer Auth Setup call to get reference_id for Digital Wallets to use in place of BIN number in Cardinal.

        Skip this step for saved token and proceed to step c

    | Property                              | Value                          | Required  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | ------------------------------------- | ------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | custom.fields.isv_token               | Cybersource flex token         | See notes | This is the token parameter passed into the callback for the microform.createToken call <br><br> Required when not using a saved token                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
    | custom.fields.isv_tokenAlias          | Alias for saved token          | No        | When this is specified the token will be saved as a subscription for later use. Merchant can either provide a input text field asking for the customer to provide value for this field or a checkbox to select if the token needs be saved as a subscription for later use. In the latter case, Merchant should provide a unique value  for `isv_tokenAlias` upon selecting the checkbox                                                                                                                                                                                                                                                                                                                                            |
    | custom.fields.isv_maskedPan           | Masked Card number      | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a `flexData.content.paymentInformation.card.number.bin + flexData.content.paymentInformation.card.number.maskedValue` field containing the masked card number <br><br> Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | custom.fields.isv_cardType            | Card type               | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a `flexData.content.paymentInformation.card.number.detectedCardTypes[0]` field containing the card type <br><br> Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | custom.fields.isv_cardExpiryMonth     | Card expiry month              | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a `flexData.content.paymentInformation.card.expirationMonth.value` field containing the card type <br><br> Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | custom.fields.isv_cardExpiryYear      | Card expiry year               | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a `flexData.content.paymentInformation.card.expirationYear.value` field containing the card type <br><br> Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint Id | Yes       | Refer [Device Fingerprinting](./Decision-Manager.md#device-fingerprinting) to generate this value |
    | custom.fields.isv_saleEnabled         | false                         | Yes       | Set the value to true if sale is enabled                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | custom.fields.isv_shippingMethod | Shipping method for the order                                                                                         | No    | Possible values: <ul> <li> `lowcost`: Lowest-cost service  </li> <li>`sameday`: Courier or same-day service </li> <li>`oneday`: Next-day or overnight service </li> <li>`twoday`: Two-day service </li> <li>`threeday`: Three-day service.</li> <li> `pickup`: Store pick-up </li> <li> `other`: Other shipping method </li> <li> `none`: No shipping method because product is a service or subscription </li>   |
    | custom.fields.isv_metadata | Metadata for the order                                                                                         | No    | This field can be used to send additional custom data as part of the authorization request. The data should be serialized into a string format (e.g., JSON string) before passing it in the request.<br>**Example:**"isv_metadata": "{\"1\":\"value1\", \"2\":\"value2\"}"   |
    | custom.fields.isv_accountPurchaseCount | Required to determine account creation history and purchase activity                             | No    | Provide the user's purchase count for the last six months. This value will be used to determine account creation history and populate the riskInformation section of the authorization request   |


    c. For saved token, when the payment is being updated, the extension will do a Payer Auth Setup call to get reference_id for Digital Wallets to use in place of BIN number in Cardinal.

    | Property                              | Value                          | Required | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | ------------------------------------- | ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | custom.fields.isv_maskedPan           | Masked Card number      | No       | custom.fields.isv_tokens's "cardNumber" value from Customer object <br>Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | custom.fields.isv_cardType            | Card type               | No       | custom.fields.isv_tokens's "cardType" value from Customer object <br>Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | custom.fields.isv_cardExpiryMonth     | Card expiry month              | No       | custom.fields.isv_tokens's "cardExpiryMonth" value from Customer object <br>Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | custom.fields.isv_cardExpiryYear      | Card expiry year               | No       | custom.fields.isv_tokens's "cardExpiryYear" value from Customer object <br>Not required by the extension but used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint Id | Yes      | Refer [Device Fingerprinting](./Decision-Manager.md#device-fingerprinting) to generate this value |
    | custom.fields.isv_shippingMethod | Shipping method for the order                                                                                         | No    | Possible values: <ul> <li> `lowcost`: Lowest-cost service  </li> <li>`sameday`: Courier or same-day service </li> <li>`oneday`: Next-day or overnight service </li> <li>`twoday`: Two-day service </li> <li>`threeday`: Three-day service.</li> <li> `pickup`: Store pick-up </li> <li> `other`: Other shipping method </li> <li> `none`: No shipping method because product is a service or subscription </li>  |
    | custom.fields.isv_metadata | Metadata for the order                                                                                         | No    | This field can be used to send additional custom data as part of the authorization request. The data should be serialized into a string format (e.g., JSON string) before passing it in the request.<br>**Example:**"isv_metadata": "{\"1\":\"value1\", \"2\":\"value2\"}"   |
    | custom.fields.isv_accountPurchaseCount | Required to determine account creation history and purchase activity                             | No    | Provide the user's purchase count for the last six months. This value will be used to determine account creation history and populate the riskInformation section of the authorization request   |


6.  Wait for the event to return back the following fields, verify them from update response. If the data exists for below fields, submit the device data collection form using below data, else throw error to the user. See [Device Data Collection](https://developer.cybersource.com/docs/cybs/en-us/payer-authentication/developer/all/rest/payer-auth/pa2-ccdc-ddc-intro.html) to get more details about device data collection Iframe

        accessToken
        referenceId
        deviceDataCollectionURL

7.  Wait for the successful response from the deviceDataCollection and then initialize the enrollment check by updating the payment with the following:

    | Property                            | Value                                   | Required | Notes                                                     |
    | ----------------------------------- | --------------------------------------- | -------- | --------------------------------------------------------- |
    | custom.fields.isv_acceptHeader      | Accept header from Customer browser     | Yes      | Used by 3DS process, populated from client-side libraries |
    | custom.fields.isv_userAgentHeader   | User agent header from Customer browser | Yes      | Used by 3DS process, populated from client-side libraries |
    | custom.fields.isv_customerIpAddress | Customer IP address                     | Yes      | Populated from client-side libraries                      |
    | custom.fields.isv_screenWidth      | Screen width of Customer browser     | Yes      | Used by 3DS process, populated from client-side libraries |
    | custom.fields.isv_screenHeight   | Screen height of Customer browser | Yes      | Used by 3DS process, populated from client-side libraries |


8.  wait for the response from ddc form and if successful, then proceed with enrolment, verify the following fields from update response

        authenticationTransactionId
        stepUpURL
        accessToken
        isv_payerEnrollHttpCode
        isv_payerEnrollStatus

9.  Check if the `isv_payerEnrollHttpCode` value is 201 and `isv_payerEnrollStatus` value "CUSTOMER_AUTHENTICATION_REQUIRED" from the updated response. If yes, repeat the steps from 5 else proceed to step 10. Refer the [DMPA](./Decision-Manager.md#payer-authentication-with-decision-manager) section to know more about the DMPA

10. Check the value of the isv_payerAuthenticationRequired field on the
    updated payment. If the value is true, perform the following steps

    a. Submit the stepup form by using the `stepUpURL` & `accessToken`. See [Step-Up IFrame](https://developer.cybersource.com/docs/cybs/en-us/payer-authentication/developer/all/rest/payer-auth/pa2-ccdc-stepup-frame-intro.html) to get more details about step up Iframe

    b. The Payer Authentication window will be displayed and when the user completes the process, the user is redirected back to the consumerAuthenticationInformation.returnUrl within the iframe

    c. The response sent back to the return URL contains the following

        - Transaction ID: (consumerAuthenticationInformation.authenticationTransactionId response field)

        - MD: merchant data returned if present in the POST to step-up URL; otherwise, null

    d. Update the Commercetools payment to set the value of custom.fields.isv_payerAuthenticationTransactionId to the value extracted from the return URL's Transaction ID

11. Wait for the event to return back the following fields, verify the following fields from update response

        isv_payerEnrollHttpCode
        isv_payerEnrollStatus

    Check if the isv_payerEnrollHttpCode value is 201 and isv_payerEnrollStatus value "CUSTOMER_AUTHENTICATION_REQUIRED" from the updated response. If yes, repeat the steps from 5 else proceed to step 12.

12. Add a transaction to the payment 

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


13. Verify the payment state and convey the payment result to the customer

    a. If the transaction is successful, transaction state will be updated to **Success**, display the order confirmation page

    b. If the state of transaction is updated to **Pending** which is due to Fraud, display the order confirmation page

    c. If the state of transaction is updated to **Failure**, display the error page and See [Overview\#Errorhandling](Overview.md#error-handling) for handling errors or failures

## Stored values

The following values are stored within Commercetools to allow later
verification that the payer was authenticated correctly

- Responses to the enrolment check are stored on a payment interface interaction with a type key of `isv_payments_payer_authentication_enrolment_check`

- Responses to the authentication validation are stored on a payment interface interaction with a type key of `isv_payments_payer_authentication_validate_result`

- The request and response Cardinal JWTs are stored as custom properties on the payment

- The paReq and acsUrl values are stored as custom properties on the payment

When a token is saved as a subscription, the saved token value will be returned as a custom property on the payment called `isv_savedToken`.

See [Commercetools Setup](Commercetools-Setup.md) for more details on the individual fields.

## Further reading

- [Cybersource Payer Authentication documentation](https://developer.cybersource.com/docs/cybs/en-us/payer-authentication/developer/all/rest/payer-auth/pa-revisions.html)
