# Tokenization

Commerectools provides the facility of customization of the `customer` resource. A customer subscription can be created and saved when you use the CreditCard payment method(if provided).

The Customer update API extension will channel the request for Customer token updation and deletion request coming from the front-end.

Use [API Extension Setup](API-Extension-Setup.md) guide for customizing the customer resource for saving tokens.

Merchant can display the customer tokens by querying the Customer using Customer Id. <b>custom.fields.isv_tokens</b> from Customer object will have the tokens saved for that Customer. Use these data and display it to the customer in My Account section.

The customer saved tokens can be viewed in:

Merchant Centre → Customers → Customer list → Custom Fields

## Update Card Details

1.  Update the customer with the new valid expiry date and month for the card by populating the following

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

    | Property             | Value                                                   | Required  | Notes                                                                              |
    | -------------------- | ------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------- |
    | custom.fields.isv_tokens[#].alias                | Customer token alias                                    | See notes | Value which will represent a particular token data in general          |
    | custom.fields.isv_tokens[#].value                | Customer token value                 | See notes | Customer token returned by Cybersource while creating a token for the customer                           |
    | custom.fields.isv_tokens[#].paymentToken         | Customer payment token                                  | See notes | Payment token returned by Cybersource while creating a token                            |
    | custom.fields.isv_tokens[#].instrumentIdentifier | Instrument identifier for customer          | See notes | Instrument identifier returned by Cybersource while creating a token |
    | custom.fields.isv_tokens[#].cardType             | Card type                                               | See notes | Card type of the token returned by Cybersource                |
    | custom.fields.isv_tokens[#].cardName             | Card alias                                              |  |                |
    | custom.fields.isv_tokens[#].cardNumber           | Card number                                             | See notes | Masked Pan returned by Cybersource                |
    | custom.fields.isv_tokens[#].cardExpiryMonth      | Card expiry month                                       | See notes | New expiry month value that needs to be updated for the token     |
    | custom.fields.isv_tokens[#].cardExpiryYear       | Card expiry year                                        | See notes | New expiry year value that needs to be updated for the token                               |
    | custom.fields.isv_tokens[#].oldExpiryMonth       | Existing expiry month for the card. On updating, this field will be deleted by plugin                                   |  |       |
    | custom.fields.isv_tokens[#].oldExpiryYear        | Existing expiry year for the card. On updating, this field will be deleted by plugin                                    |  |        |
    | custom.fields.isv_tokens[#].flag                 | String value which indicates the action to be performed | See notes | The value should be 'update'                                                        |

2. The response will have updated data with the following fields

    | Property        | Value                                                                                                                      |
    | --------------- | -------------------------------------------------------------------------------------------------------------------------- |
    | custom.fields.isv_tokens[#].value           | The updated token value from Cybersource updateToken response                                                              |
    | custom.fields.isv_tokens[#].paymentToken    | The updated token value from Cybersource updateToken response                                                              |
    | custom.fields.isv_tokens[#].cardExpiryMonth | The updated expiry month for token from Cybersource updateToken response                                                   |
    | custom.fields.isv_tokens[#].cardExpiryYear  | The updated expiry year for token from Cybersource updateToken response                                                    |
    | custom.fields.isv_tokens[#].flag            | Will be a string value :`updated` if the token is updated successfully and `update` if the token is not successfully updated |

## Delete Card

1.  Update the customer by populating the following data

    Note that isv_tokens data is a set of JSON object strings and update the required data for the desired token while the other tokens remain untouched.

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

    | Property             | Value                                                   | Required  | Notes                                                                              |
    | -------------------- | ------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------- |
    | custom.fields.isv_tokens[#].alias                | Customer token alias                                    | See notes | Value which will represent a particular token data in general          |
    | custom.fields.isv_tokens[#].value                | Customer token value                 | See notes | Customer token returned by Cybersource while creating a token for the customer                           |
    | custom.fields.isv_tokens[#].paymentToken         | Customer payment token                                  | See notes | Payment token returned by Cybersource while creating a token                            |
    | custom.fields.isv_tokens[#].instrumentIdentifier | Instrument identifier for customer          | See notes | Instrument identifier returned by Cybersource while creating a token |
    | custom.fields.isv_tokens[#].cardType             | Card type                                               | See notes | Card type of the token returned by Cybersource                |
    | custom.fields.isv_tokens[#].cardName             | Card alias                                              |  |                |
    | custom.fields.isv_tokens[#].cardNumber           | Card number                                             | See notes | Masked Pan returned by Cybersource                |
    | custom.fields.isv_tokens[#].cardExpiryMonth      | Card expiry month                                       | See notes | Expiry month value returned by Cybersource     |
    | custom.fields.isv_tokens[#].cardExpiryYear       | Card expiry year                                        | See notes | New expiry year returned by Cybersource                               |
    | custom.fields.isv_tokens[#].flag                 | String value which indicates the action to be performed | See notes | The value should be 'delete'                                                        |

2. The response will have the updated data by removing the particular token that you intended to delete if the token is deleted sucessfullly. Else the token will still be available in the updated response.