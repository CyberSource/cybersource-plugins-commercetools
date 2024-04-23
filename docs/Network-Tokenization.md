# Network Tokenization

Network token is a security technique that involves replacing sensitive information such as customer's actual PAN with a non-sensitive place holder token.

Before a MID can be enabled for Network Tokenization, it has to be provisioned with a Token Requestor ID (TRID) for each card scheme. A TRID is a unique identifier that links a MID to a record at the card scheme and is used to identify which entity is using a Network Token.

Cybersource-Commercetools Extension only supports the event `tms.networktoken.updated` from Webhooks currently

# Creation of a Webhook Subscription:

Webhook subscription can be created by running the following npm script command to the root directory of extension

     npm run create-subscription  
    
Following env variables are mandatory for creation of subscription

 - PAYMENT_GATEWAY_NETWORK_TOKEN_MULTI_MID
 - PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL

    PAYMENT_GATEWAY_NETWORK_TOKEN_MULTI_MID - (csv of merchant ids if webhooks subscription needs to be created in multiple mids). For default mid to be considered, populate this variable with default Mid

Once the subscription is created successfully, the merchant id, webhook id, key id, key and key expiration details will be stored in a Custom Object created in Commercetools.

> **_NOTE:_** The command `npm run create-subscription` also can be used, if already a subscription exists for the product id, but the data is not found updated in Commercetools or the base url of Webhook is found different from the one available in PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL. In this case, the command will delete the existing subscription and create new.

 > If same card is used by different customers in Commercetools, the extension will support network tokenization only for one customer, which is present in the incoming notification. The card info will remain same for all other customers.
# Subscription Details in Commercetools:

Once the subscription is created, the details will be stored in Commercetools custom object which has key and container name of `webHookSubscription` and `ctWebHookSubscription` respectively. Each array in the array of objects represents the webhook details of the particular merchant id. Below given details can be retrieved from the Custom Object.
1. MerchantId
2. Key
3. KeyId
4. KeyExpiration
5. SubscriptionId

When an update notification is received at the webhook endpoint, the stored subscription details are used to validate the notification details.

Eg: Custom Object in Commercetools for storing Webhook information

    {
            "id": "203c47be-7151-**************",
            "version": 1,
            "versionModifiedAt": "2024-02-20T14****************",
            "createdAt": "2024-02-20T14***********",
            "lastModifiedAt": "2024-02-20T14**********",
            "lastModifiedBy": {
                "clientId": "IAnbNpgsQD**************",
                "isPlatformClient": false
            },
            "createdBy": {
                "clientId": "IAnbNpgsQ************",
                "isPlatformClient": false
            },
            "container": "ctWebHookSubscription",
            "key": "webHookSubscription",
            "value": [
                {
                    "merchantId": "xxxxx",
                    "key": "wdXJppHGu**************************",
                    "keyId": "11d1bc95****************",
                    "keyExpiration": "2027-02-********",
                    "subscriptionId": "11d1bca6*********************"
                },
                {
                    "merchantId": "xxxxx",
                    "key": "B1J8NwMUyEPcFo83I**********************",
                    "keyId": "11d1bc95-d14*********************",
                    "keyExpiration": "2027-02************",
                    "subscriptionId": "11d1bca6-133f********************"
                }
            ]
        }

# Receiving Webhook Notifications

Following are the endpoints related to Webhook in Extension. ${baseUrl} is the endpoint in which the extension is hosted.


 Endpoint Type                       | Endpoint                                                                                 | Http Method                                                                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Health Check URL                                | ${baseUrl}/netTokenNotification                                                    | GET                                                                          |
| Webhook URL                                | ${baseUrl}/netTokenNotification                                                    | POST                                                                          |

 - Extension will return http status code 200 when the Health check url is invoked
 - Extension will perform the following when a notification is pushed into webhook endpoint
    - Validate the notification signature  
    - Retrieve the updated card details from payment gateway using the Instrument id from payload
    - Update the card details in Commercetools 
    - Respond with http status code 200 
    
> **_NOTE:_** If the extension is failing to authenticate the notification or to update the Card in Commercetools, it will respond with a http status code 400

Based on the response form Cybersource, the following details of a card will be updated
- Expiry Month
- Expiry Year
- Card Suffix