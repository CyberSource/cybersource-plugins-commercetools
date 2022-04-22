# Authorize a Payment (With Payer Authentication)

To authorize a payment with 3DS functionality, a payment should be created with the amount to authorize, a token representing the payment card and the billing address associated with the card.

A check will be made during payment updation to see if the card is enrolled in 3DS and if authentication is required. If authentication is required, the created payment will contain data required to continue the authentication process.

After authentication is complete, authorization of the payment can then be triggered by adding an initial transaction to the payment.

## Credit Card Authorization Sequence Diagram

![Authorization flow with payer authentication](images/Authorization-Flow-3ds.svg)

## Details

1.  Prepare your cart

    a. Ensure the cart locale is set

    b. Ensure the cart billing and shipping addresses are set. The
    default mapping of Commercetools address fields to Cybersource
    fields is as follows. If you require a different mapping this
    can be customized

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

2.  Tokenise credit card details using Cybersource Flex

    a. Create a Commercetools payment (https://docs.commercetools.com/http-api-projects-payments) and populate the following

    | Property                           | Value                               | Required  | Notes                                                                                                                                                               |
    | ---------------------------------- | ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | customer                           | Reference to Commercetools customer | See notes | Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated |
    | anonymousId                        | Id for tracking guest checkout      | See notes | Required for guest checkout. If using MyPayments API this will automatically be set. One of customer or anonymousId must be populated                               |
    | paymentMethodInfo.paymentInterface | cybersource                         | Yes       |                                                                                                                                                                     |
    | paymentMethodInfo.method           | creditCardWithPayerAuthentication   | Yes       |                                                                                                                                                                     |

    b. The response should have the `isv_tokenCaptureContextSignature` and `isv_tokenVerificationContext` custom fields, set the `isv_tokenCaptureContextSignature` custom field value to the captureContext of flex object which will load Cybersource Flex Microform

        flexInstance = new Flex(captureContext);

    This step can be skipped when using a saved token

3.  Add the payment to the cart

4.  Use the Flex Microform 0.11 to tokenize card details. See <https://github.com/CyberSource/cybersource-flex-samples-node> for an example of how to use the captureContext obtained above and the Flex Microform JS to tokenize a credit card

    This step can be skipped when using a saved token

5.  Update the Commercetools payment (<https://docs.commercetools.com/http-api-projects-payments>) and populate the following

    Skip this step for saved token

    a. Also see [Decision Manager](Decision-Manager.md) for additional fields to populate if you are using Decision Manager

    b. When updating the payment, the extension will do a Payer Setup call to get reference_id for Digital Wallets to use in place of BIN number in Cardinal

    | Property                              | Value                          | Required  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | ------------------------------------- | ------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | custom.fields.isv_token               | Cybersource flex token         | See notes | This is the token parameter passed into the callback for the microform.createToken call <br><br> Required when not using a saved token                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
    | custom.fields.isv_tokenAlias          | Alias for saved token          | No        | When this is specified the token will be saved as a subscription for later use. Merchant can either provide a input text field asking for the customer to provide value for this field or a checkbox to select if the token needs be saved as a subscription for later use. In the latter case, Merchant should provide a unique value upon selecting the checkbox                                                                                                                                                                                                                                                                                                                                            |
    | custom.fields.isv_maskedPan           | Masked credit card number      | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a data.number field containing the masked card number <br><br> Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | custom.fields.isv_cardType            | Credit card type               | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a data.type field containing the card type <br><br> Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | custom.fields.isv_cardExpiryMonth     | Card expiry month              | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a data.expirationMonth field containing the card type <br><br> Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | custom.fields.isv_cardExpiryYear      | Card expiry year               | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a data.expirationYear field containing the card type <br><br> Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint id | Yes       | It must be unique for each merchant Id. You can use any string that you are already generating, such as an order number or web session Id. However, do not use the same uppercase and lowercase letters to indicate different session Ids. Replace sessionId with the unique Id generated in the URL given. Include the script "https://h.online-metrix.net/fp/tags.js?org_id={{org Id}}&session_id={{merchant Id}}{{session Id}}". Replace the below data {{org Id}} - To obtain this value, contact your CyberSource representative and specify to them whether it is for testing or production. {{merchant Id}} - Your unique CyberSource merchant Id. {{session Id}} - Value of unique Id generated above |

6.  For saved token, update the Commercetools payment (<https://docs.commercetools.com/http-api-projects-payments>) and populate the following

    a. Also see [Decision Manager](Decision-Manager.md) for additional fields to populate if you are using Decision Manager

    b. When updating the payment, the extension will do a Payer Setup call to get reference_id for Digital Wallets to use in place of BIN number in Cardinal

    | Property                              | Value                          | Required | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | ------------------------------------- | ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | custom.fields.isv_savedToken          | Saved token value              | Yes      | custom.fields.isv_tokens's "paymentToken" value from Customer object                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | custom.fields.isv_tokenAlias          | Alias for saved token          | No       | custom.fields.isv_tokens's "alias" value from Customer object                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
    | custom.fields.isv_maskedPan           | Masked credit card number      | No       | custom.fields.isv_tokens's "cardNumber" value from Customer object <br>Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | custom.fields.isv_cardType            | Credit card type               | No       | custom.fields.isv_tokens's "cardType" value from Customer object <br>Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | custom.fields.isv_cardExpiryMonth     | Card expiry month              | No       | custom.fields.isv_tokens's "cardExpiryMonth" value from Customer object <br>Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | custom.fields.isv_cardExpiryYear      | Card expiry year               | No       | custom.fields.isv_tokens's "cardExpiryYear" value from Customer object <br>Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint id | Yes      | It must be unique for each merchant Id. You can use any string that you are already generating, such as an order number or web session Id. However, do not use the same uppercase and lowercase letters to indicate different session Ids. Replace sessionId with the unique Id generated in the URL given. Include the script "https://h.online-metrix.net/fp/tags.js?org_id={{org Id}}&session_id={{merchant Id}}{{session Id}}". Replace the below data {{org Id}} - To obtain this value, contact your CyberSource representative and specify to them whether it is for testing or production. {{merchant Id}} - Your unique CyberSource merchant Id. {{session Id}} - Value of unique Id generated above |

7.  Wait for the event to return back the following fields, verify the following fields from update response. If the data exists for below fields, submit the device data collection form using below data, else throw error to the user. See [Device Data Collection Iframe](https://docs.cybersource.com/content/dam/new-documentation/documentation/en/fraud-management/payer-auth/rest/payer-auth-rest.pdf) to get more details about device data collection Iframe

        accessToken
        referenceId
        deviceDataCollectionURL

8.  After completing the Setup event, initialize the Enrolment Check by updating the payment with the following

    | Property                            | Value                                   | Required | Notes                                                     |
    | ----------------------------------- | --------------------------------------- | -------- | --------------------------------------------------------- |
    | custom.fields.isv_acceptHeader      | Accept header from Customer browser     | Yes      | Used by 3DS process, populated from client-side libraries |
    | custom.fields.isv_userAgentHeader   | User agent header from Customer browser | Yes      | Used by 3DS process, populated from client-side libraries |
    | custom.fields.isv_customerIpAddress | Customer IP address                     | Yes      | Populated from client-side libraries                      |

9.  Wait for the event to return back the following fields, verify the following fields from update response

        authenticationTransactionId
        stepUpURL
        accessToken

10. Check the value of the isv_payerAuthenticationRequired field on the
    updated payment. If the value is true, perform the following steps

    submit the stepup form by using the `stepUpURL` & `accessToken`. See [Step-Up IFrame](https://docs.cybersource.com/content/dam/new-documentation/documentation/en/fraud-management/payer-auth/rest/payer-auth-rest.pdf) to get more details about step up Iframe

    a. The payer authentication window will be displayed and when the user completes the process, the user is redirected back to the consumerAuthenticationInformation.returnUrl within the iframe

    b. The response sent back to the return URL contains the following

         - Transaction ID: (consumerAuthenticationInformation.authenticationTransactionId response field)

        - MD: merchant data returned if present in the POST to step-up URL; otherwise, null

    c. Update the commerce tools payment to set the value of custom.fields.isv_payerAuthenticationTransactionId to the value extracted from the return URL's Transaction ID

11. Add a transaction to the payment with the following values populated

    | Property | Value               | Notes                                 |
    | -------- | ------------------- | ------------------------------------- |
    | type     | Authorization       |                                       |
    | state    | Initial             |                                       |
    | amount   | Amount to authorize | Should match amountPlanned on payment |

12. Verify the payment state and convey the payment result to the customer


    a. If the authorization was successful the transaction state is updated to **Success**, display the order confirmation page

    b. If the state of the authorization transaction is updated to **Pending** which is due Fraud Check, display the order confirmation page

    C. If the state of the authorization transaction is updated to **Failure**, display the error page and See [Overview\#Errorhandling](Overview.md#Errorhandling) for handling errors or failures

## Stored values

The following values are stored within Commercetools to allow later
verification that the payer was authenticated correctly

- Responses to the enrolment check are stored on a payment interface interaction with a type key of `isv_payments_payer_authentication_enrolment_check`

- Responses to the authentication validation are stored on a payment interface interaction with a type key of `isv_payments_payer_authentication_validate_result`

- The request and response Cardinal JWTs are stored as custom properties on the payment

- The paReq and acsUrl values are stored as custom properties on the payment

When a token is saved as a subscription the saved token value will be returned as a custom property on the payment called isv_savedToken.

See [Commercetools Setup](Commercetools-Setup.md) for more details on the individual fields.

## Further reading

- [Cybersource Payer Authentication documentation](https://docs.cybersource.com/content/dam/new-documentation/documentation/en/fraud-management/payer-auth/rest/payer-auth-rest.pdf)
