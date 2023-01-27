# Tokenization

Commercetools provides the facility of customization of the `customer` resource. A token subscription can be created and saved when you use the Credit Card payment method (if provided).

The Customer update API extension will channel the request for Customer token creation, updation and deletion request coming from the front-end.

Use [API Extension Setup](API-Extension-Setup.md) guide for customizing the customer resource for saving tokens.

Merchant can display the customer tokens by querying the Customer using Customer Id. <b>custom.fields.isv_tokens</b> from Customer object will have the tokens saved for that Customer. custom.fields.isv_tokens data is a set of JSON object strings. Use these data and display it to the customer in My Account section.

The customer saved tokens can be viewed in:

Merchant Centre → Customers → Customer list → Select a Customer → Custom Fields

## Tokenize a card

1.  Tokenize credit card details using Cybersource Flex

    a. If there are no cards available, update the customer by creating a custom type with the following

    | Property                                       | Value                        | Required |
    | ---------------------------------------------- | ---------------------------- | -------- |
    | custom.type.key                                | isv_payments_customer_tokens | Yes      |
    | custom.fields.isv_tokenCaptureContextSignature | empty string                 | Yes      |

    b. If there are tokens available already, update the customer by setting the following custom field

    | Property                                       | Value        | Required |
    | ---------------------------------------------- | ------------ | -------- |
    | custom.fields.isv_tokenCaptureContextSignature | empty string | Yes      |

2.  The response should have the `isv_tokenCaptureContextSignature` and `isv_tokenVerificationContext` custom fields, set the `isv_tokenCaptureContextSignature` custom field value to the captureContext of flex object which will load Cybersource Flex Microform

        flexInstance = new Flex(captureContext);

3.  Use the Flex Microform 0.11 to tokenize card details. See <https://github.com/CyberSource/cybersource-flex-samples-node> for an example of how to use the captureContext obtained above and the Flex Microform JS to tokenize a credit card

4.  After the card details are entered by the customer, ask the customer to add billing address for the card and update the customer by populating the following

    | Property                              | Value                                            | Required | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | ------------------------------------- | ------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | custom.fields.isv_token               | Cybersource flex token                           | Yes      | This is the token parameter passed into the callback for the microform.createToken call                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | custom.fields.isv_tokenAlias          | Alias for saved token                            | Yes      | When this is specified the token will be saved as a subscription for later use. Merchant can either provide a input text field asking for the customer to provide value for this field or a checkbox to select if the token needs be saved as a subscription for later use. In the latter case, Merchant should provide a unique value upon selecting the checkbox                                                                                                                                                                                                                                                                                                                                            |
    | custom.fields.isv_maskedPan           | Masked credit card number                        | No       | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a data.number field containing the masked card number <br><br> Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | custom.fields.isv_cardType            | Credit card type                                 | No       | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a data.type field containing the card type <br><br> Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | custom.fields.isv_cardExpiryMonth     | Card expiry month                                | No       | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a data.expirationMonth field containing the card type <br><br> Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | custom.fields.isv_cardExpiryYear      | Card expiry year                                 | No       | Can be obtained from the token parameter passed into the callback for the microform.createToken call. The token is a JWT which when decoded has a data.expirationYear field containing the card type <br><br> Not required by extension but can be used for display                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | custom.fields.isv_addressId           | Id of the address added by customer for the card | Yes      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | custom.fields.isv_currencyCode        | Currency code of the store                       | Yes      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint Id                   | Yes      | Refer [Device Fingerprinting](Decision-Manager.md#device-fingerprinting) to generate this value |

5.  Wait for the updated response and verify the custom.fields.isv_tokens field

6.  If token is created successfully, custom.fields.isv_tokens field will contain updated tokens

7.  If there was an error, custom.fields.isv_tokens field either be empty if there were no tokens available or will have the old tokens which were available before adding the new token. Also custom.fields.isv_failedTokens field will have all the failed card records if there was error while adding the token

## Update Card Details

1.  Update the customer with the new valid expiry date, month or an address for the card by populating the following

    Note that isv_tokens data is a set of JSON object strings and update the required data for the intended token while the other tokens remain untouched.

    A sample custom fields will look like this:

        "custom": {
            "type": {
                "typeId": "type",
                "id": "e1a79a4a-49d6-4153-a0e7-d434712c4448"
            },
            "fields": {
                "isv_tokens": [
                    "{\"alias\":\"Card 4111\",\"value\":\"******************\",\"paymentToken\":\"******************\",\"instrumentIdentifier\":\"******************\",\"cardType\":\"001\",\"cardName\":\"001\",\"cardNumber\":\"411111XXXXXX1111\",\"cardExpiryMonth\":\"01\",\"cardExpiryYear\":\"2025\"}",
                    "{\"alias\":\"Card 5444\",\"value\":\"******************\",\"paymentToken\":\"******************\",\"instrumentIdentifier\":\"******************\",\"cardType\":\"002\",\"cardName\":\"002\",\"cardNumber\":\"555555XXXXXX4444\",\"cardExpiryMonth\":\"03\",\"cardExpiryYear\":\"2025\"}"
                ]
            }
        }

    | Property                                         | Value                              | Required  | Notes                                                                                                     |
    | ------------------------------------------------ | ---------------------------------- | --------- | --------------------------------------------------------------------------------------------------------- |
    | custom.fields.isv_tokens[#].alias                | Customer token alias               | See notes | Alias of the token to be updated                                                                          |
    | custom.fields.isv_tokens[#].value                | Customer token value               | See notes | Customer token of the token to be updated which was returned by Cybersource while creating a token        |
    | custom.fields.isv_tokens[#].paymentToken         | Customer payment token             | See notes | Payment token of the token to updated which was returned by Cybersource while creating a token            |
    | custom.fields.isv_tokens[#].instrumentIdentifier | Instrument identifier for customer | See notes | Instrument identifier of the token to be updated which was returned by Cybersource while creating a token |
    | custom.fields.isv_tokens[#].cardType             | Card type                          | See notes | Card type of the token to be updated which was returned by Cybersource                                    |
    | custom.fields.isv_tokens[#].cardName             | Card alias                         |           |                                                                                                           |
    | custom.fields.isv_tokens[#].cardNumber           | Card number                        | See notes | Masked Pan of the token to be updated which was returned by Cybersource                                   |
    | custom.fields.isv_tokens[#].cardExpiryMonth      | Card expiry month                  | See notes | Existing expiry month of the token to be updated                                                          |
    | custom.fields.isv_tokens[#].cardExpiryYear       | Card expiry year                   | See notes | Existing expiry of the token to be updated                                                                |
    | custom.fields.isv_tokens[#].addressId            |                    | See notes | Existing addressId of the token to be updated or the new address Id if address needs to be changed        |
    | custom.fields.isv_cardNewExpiryMonth             | Card expiry month                  | See notes | New expiry month value that needs to be updated for the token                                             |
    | custom.fields.isv_cardNewExpiryYear              | Card expiry year                   | See notes | New expiry year value that needs to be updated for the token                                              |
    | custom.fields.isv_tokenAction                    | update                             | Yes       | Case sensitive                                                                                            |

2.  If the token is updated successfully, the field custom.fields.isv_tokenUpdated will have the value true, else false

## Delete Card

1.  Update the customer by populating the following data

    Note that isv_tokens data is a set of JSON object strings and delete the required data for the desired token while the other tokens remain untouched.

    A sample custom fields will look like this:

        "custom": {
            "type": {
                "typeId": "type",
                "id": "e1a79a4a-49d6-4153-a0e7-d434712c4448"
            },
            "fields": {
                "isv_tokens": [
                    "{\"alias\":\"Card 4111\",\"value\":\"******************\",\"paymentToken\":\"******************\",\"instrumentIdentifier\":\"******************\",\"cardType\":\"001\",\"cardName\":\"001\",\"cardNumber\":\"411111XXXXXX1111\",\"cardExpiryMonth\":\"01\",\"cardExpiryYear\":\"2025\"}",
                    "{\"alias\":\"Card 5444\",\"value\":\"******************\",\"paymentToken\":\"******************\",\"instrumentIdentifier\":\"******************\",\"cardType\":\"002\",\"cardName\":\"002\",\"cardNumber\":\"555555XXXXXX4444\",\"cardExpiryMonth\":\"03\",\"cardExpiryYear\":\"2025\"}"
                ]
            }
        }

    | Property                                         | Value                              | Required  | Notes                                                                                                               |
    | ------------------------------------------------ | ---------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
    | custom.fields.isv_tokens[#].alias                | Customer token alias               | See notes | Value of the token to be deleted which will represent a particular token data in general                            |
    | custom.fields.isv_tokens[#].value                | Customer token value               | See notes | Customer token of the token to be deleted which was returned by Cybersource while creating a token for the customer |
    | custom.fields.isv_tokens[#].paymentToken         | Customer payment token             | See notes | Payment token of the token to be deleted which was returned by Cybersource while creating a token                   |
    | custom.fields.isv_tokens[#].instrumentIdentifier | Instrument identifier for customer | See notes | Instrument identifier of the token to be deleted which was returned by Cybersource while creating a token           |
    | custom.fields.isv_tokens[#].cardType             | Card type                          | See notes | Card type of the token to be deleted returned by Cybersource                                                        |
    | custom.fields.isv_tokens[#].cardName             | Card alias                         |           |                                                                                                                     |
    | custom.fields.isv_tokens[#].cardNumber           | Card number                        | See notes | Masked Pan of the token to be deleted which was returned by Cybersource                                             |
    | custom.fields.isv_tokens[#].cardExpiryMonth      | Card expiry month                  | See notes | Expiry month of the token to be deleted                                                                             |
    | custom.fields.isv_tokens[#].cardExpiryYear       | Card expiry year                   | See notes | Expiry expiry year of the token to be updated                                                                       |
    | custom.fields.isv_tokens[#].addressId            |                   | See notes | Existing addressId of the token to be deleted                                                                       |
    | custom.fields.isv_tokenAction                    | delete                             | Yes       | Case sensitive                                                                                                      |

2.  The response will have the updated data by removing the particular token that you intended to delete if the token is deleted sucessfullly, else the tokens will remain untouched in the updated response.
