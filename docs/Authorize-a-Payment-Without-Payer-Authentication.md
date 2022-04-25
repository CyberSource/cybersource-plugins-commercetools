# Authorize a Payment (Without Payer Authentication)

Authorization of a payment is triggered by adding an initial transaction to a Commercetools payment resource. Before this can be done, the payment must be populated with the amount to authorize, a token representing the payment card and the billing address associated with the card.

## Credit Card without Payer Authentication Authorization Sequence Diagram

![Authorization Flow](images/Authorization-Flow-CreditCard.svg)

## Details

1.  Prepare your cart

    a. Ensure your cart locale is set

    b. Ensure the cart billing and shipping addresses are set. The default mapping of Commercetools address fields to Cybersource fields is as follows

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

2.  Tokenize credit card details using Cybersource Flex

    a. Create a Commercetools payment (https://docs.commercetools.com/http-api-projects-payments) and populate the following

    | Property                           | Value                               | Required  | Notes                                                                                                                                                                                                                                        |
    | ---------------------------------- | ----------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | customer                           | Reference to Commercetools customer | See notes | Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated                                                                          |
    | anonymousId                        | Id for tracking guest checkout      | See notes | Required for guest checkout. If using MyPayments API this will automatically be set. One of customer or anonymousId must be populated                                                                                                        |
    | paymentMethodInfo.paymentInterface | cybersource                         | Yes       |                                                          |
    | paymentMethodInfo.method           | creditCard                          | Yes       |  |


    b. The response should have the `isv_tokenCaptureContextSignature` and `isv_tokenVerificationContext` custom fields, set the `isv_tokenCaptureContextSignature` custom field value to the captureContext of flex object which will load Cybersource Flex Microform

        flexInstance = new Flex(captureContext);


    This step can be skipped when using a saved token
    
3. Add the payment to the cart
    
4. Use the Flex Microform 0.11 to tokenize card details. See <https://github.com/CyberSource/cybersource-flex-samples-node> for an example of how to use the captureContext obtained above and the Flex Microform JS to tokenize a credit card

    This step can be skipped when using a saved token
    
5. Update a Commercetools payment (<https://docs.commercetools.com/http-api-projects-payments>) and populate the following

    Skip this step for saved token 

    | Property                              | Value                          | Required  | Notes                                                                                                                                                                                                                                                                                                                                  |
    | ------------------------------------- | ------------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | custom.fields.isv_token               | Cybersource flex token         | See notes | This is the token parameter passed into the callback for the microform.createToken call <br><br> Required when not using a saved token                                                                                                                                                                                                 |
    | custom.fields.isv_tokenAlias          | Alias for saved token          | No        | When this is specified the token will be saved as a subscription for later use. Merchant can either provide a input text field asking for the customer to provide value for this field or a checkbox to select if the token needs be saved as a subscription for later use. In the latter case, Merchant should provide a unique value upon selecting the checkbox                                                                                                                                                                                                                                               |
    | custom.fields.isv_maskedPan           | Masked credit card number      | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a data.number field containing the masked card number <br><br> Not required by extension but can be used for display                                                                  |
    | custom.fields.isv_cardType            | Credit card type               | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a data.type field containing the card type <br><br> Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                       |
    | custom.fields.isv_cardExpiryMonth     | Card expiry month              | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a data.expirationMonth field containing the card type <br><br> Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                       |
    | custom.fields.isv_cardExpiryYear      | Card expiry year               | No        | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a data.expirationYear field containing the card type <br><br> Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                       |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint id | Yes       | It must be unique for each merchant Id. You can use any string that you are already generating, such as an order number or web session Id. However, do not use the same uppercase and lowercase letters to indicate different session Ids. Replace sessionId with the unique Id generated in the URL given. Include the script "https://h.online-metrix.net/fp/tags.js?org_id={{org Id}}&session_id={{merchant Id}}{{session Id}}". Replace the below data {{org Id}} - To obtain this value, contact your CyberSource representative and specify to them whether it is for testing or production. {{merchant Id}} - Your unique CyberSource merchant Id. {{session Id}} - Value of unique Id generated above |
    | custom.fields.isv_customerIpAddress   | Customer IP address            | No        | Populated from client-side libraries                                                                                                                                                                                                                                                                                                   |

6. For saved token, update the Commercetools payment (<https://docs.commercetools.com/http-api-projects-payments>) and populate the following

    | Property                           | Value                               | Required  | Notes                                                                                                                                                                                                                                        |
    | ---------------------------------- | ----------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | custom.fields.isv_savedToken          | Saved token value              | Yes        | custom.fields.isv_tokens's "paymentToken" value from Customer object                                                                                                                                                                                                                                                                                                |
    | custom.fields.isv_tokenAlias          | Alias for saved token          | No        | custom.fields.isv_tokens's "alias" value from Customer object                                                                                                                                                                                                                                                         |
    | custom.fields.isv_maskedPan           | Masked credit card number      | No        | custom.fields.isv_tokens's "cardNumber" value from Customer object. <br>Not required by extension but can be used for display                                                                  |
    | custom.fields.isv_cardType            | Credit card type               | No        | custom.fields.isv_tokens's "cardType" value from Customer object. <br>Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                       |
    | custom.fields.isv_cardExpiryMonth     | Card expiry month              | No        | custom.fields.isv_tokens's "cardExpiryMonth" value from Customer object <br>Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                       |
    | custom.fields.isv_cardExpiryYear      | Card expiry year               | No        | custom.fields.isv_tokens's "cardExpiryYear" value from Customer object <br>Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                       |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint id | Yes       | It must be unique for each merchant Id. You can use any string that you are already generating, such as an order number or web session Id. However, do not use the same uppercase and lowercase letters to indicate different session Ids. Replace sessionId with the unique Id generated in the URL given. Include the script "https://h.online-metrix.net/fp/tags.js?org_id={{org Id}}&session_id={{merchant Id}}{{session Id}}". Replace the below data {{org Id}} - To obtain this value, contact your CyberSource representative and specify to them whether it is for testing or production. {{merchant Id}} - Your unique CyberSource merchant Id. {{session Id}} - Value of unique Id generated above |


    Also see [Decision Manager](Decision-Manager.md) for additional fields to be populated if you are using Decision Manager

7.  Add a transaction to the payment with the following values populated

    | Property | Value               | Notes                                 |
    | -------- | ------------------- | ------------------------------------- |
    | type     | Authorization       |                                       |
    | state    | Initial             |                                       |
    | amount   | Amount to authorize | Should match amountPlanned on payment |

8.  Verify the payment state and convey the payment result to the customer

    a. If the authorization was successful the transaction state is updated to **Success**, display the order confirmation page 

    b. If the state of the authorization transaction is updated to **Pending** which is due Fraud Check, display the order confirmation page 

    C. If the state of the authorization transaction is updated to **Failure**, display the error page and See [Overview\#Errorhandling](Overview.md#Errorhandling) for handling errors or failures


## Stored values

When a token is saved as a subscription the saved token value will be returned as a custom property on the payment called isv_savedToken.

See [Commercetools Setup](Commercetools-Setup.md) for more details on the individual fields.
