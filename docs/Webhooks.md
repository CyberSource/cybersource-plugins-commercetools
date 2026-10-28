# Webhooks

Webhooks are automated notifications that are generated and sent to you when specific system events occur. By using the Webhooks REST API, one can subscribe to these notifications for events of your choice and designate a URL in your system to receive them. This is helpful for events that are not a part of an API request and response, or that are not available through the Reporting API.

The Webhooks REST API enables you to:

- Create webhook subscriptions to receive automatic system notifications
- Update and delete existing webhook subscriptions
- Check the status of a webhook notification
- Retrieve webhook notification history and details

## Creation of a Webhook Subscription:

Webhook subscription can be created by running the following npm script command to the root directory of extension

     npm run create-subscription

Following env variables are mandatory for creation of subscription

- PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL

- PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID - (csv of merchant ids if webhooks subscription needs to be created in multiple mids). For default mid to be considered, populate this variable with default Mid

- PAYMENT_GATEWAY_UNIFIED_CHECKOUT_MULTI_MID - (csv of merchant ids if webhooks subscription needs to be created in multiple mids). For default mid to be considered, populate this variable with default Mid

Once the subscription is created successfully, the merchant id, webhook id, key id, key and key expiration details will be stored in a Custom Object created in Commercetools.

> **_NOTE:_** The `npm run create-subscription` command can be executed even when a subscription already exists for a product ID, but the data is not found updated in Commercetools or the base url of Webhook is found different from the one available in PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL. In this case, the command will delete the existing subscription and create new.

The following webhooks will be created:

- Decision Manager or Fraud Management Essentials depending on the availability
- Unified Checkout

## Subscription Details in Commercetools:

Once the subscription is created, the details will be stored in Commercetools custom object which has key and container name of `webHookSubscription` and `ctWebHookSubscription` respectively. Each array in the array of objects represents the webhook details of the particular merchant id. Below given details can be retrieved from the Custom Object.

1. MerchantId
2. Key
3. KeyId
4. KeyExpiration
5. SubscriptionId
6. WebhookType

When an update notification is received at the webhook endpoint, the stored subscription details are used to validate the notification details.

Eg: Custom Object in Commercetools for storing Webhook information

            "id": "003e4124-1fc6-4e61-**************",
            "version": 1,
            "versionModifiedAt": "2026-09-08T07****************",
            "createdAt": "2026-09-07T14***********",
            "lastModifiedAt": "2026-09-08T07**********",
            "lastModifiedBy": {
                "clientId": "aVkF-wd2mLv**************",
                "isPlatformClient": false
            },
            "createdBy": {
                "clientId": "aVkF-wd2mLv**************",
                "isPlatformClient": false
            },
            "container": "ctWebHookSubscription",
            "key": "webHookSubscription",
            "value": [
                {
                    "merchantId": "xxxx",
                    "decisionManager": {
                        "merchantId": "xxxx",
                        "key": "Dq7sdpIXPpkFnyVomVMUU6nDC8QVn***************",
                        "keyId": "1103ada4-b307-4d06-821c-f83ec83*****",
                        "keyExpiration": "2029-09-07T*********",
                        "webhookId": "5af4935a-6516-d50c-e063-a2588e******",
                        "webhookType": "decisionManager"
                    },
                    "unifiedCheckout": {
                        "merchantId": "xxxx",
                        "key": "Dq7sdpIXPpkFnyVomVMUU6nDC8QVn***************",
                        "keyId": "1103ada4-b307-4d06-821c-f83ec83*****",
                        "keyExpiration": "2029-09-07T*********",
                        "webhookId": "5af4935a-651d-d50c-e063-a2588e******",
                        "webhookType": "unifiedCheckout"
                    }
                },
                {
                    "merchantId": "xxxx",
                    "decisionManager": {
                        "merchantId": "xxxx",
                        "key": "Qp1kVBPKxfSEUR9M7Y5xo01K2y0PW***************",
                        "keyId": "ffb54b58-046b-4734-bc2e-97dee02*****",
                        "keyExpiration": "2029-09-07T*********",
                        "webhookId": "5af4935a-6524-d50c-e063-a2588e******",
                        "webhookType": "decisionManager"
                    },
                    "unifiedCheckout": {
                        "merchantId": "xxxx",
                        "key": "Qp1kVBPKxfSEUR9M7Y5xo01K2y0PW***************",
                        "keyId": "ffb54b58-046b-4734-bc2e-97dee02*****",
                        "keyExpiration": "2029-09-07T*********",
                        "webhookId": "5af4939e-fa36-fa17-e063-9c588e******",
                        "webhookType": "unifiedCheckout"
                    }
                }
            ]

## Receiving Webhook Notifications

Following are the endpoints related to Webhook in Extension. ${baseUrl} is the endpoint in which the extension is hosted.

| Endpoint Type    | Endpoint                     | Http Method |
| ---------------- | ---------------------------- | ----------- |
| Health Check URL | ${baseUrl}/fraudNotification | GET         |
| Webhook URL      | ${baseUrl}/fraudNotification | POST        |

- Extension will return http status code 200 when the Health check url is invoked
- Extension will perform the following when a notification is pushed into webhook endpoint
- Validate the notification signature
- Retrieve the updated card details from payment gateway using the Instrument id from payload
- Update the card details in Commercetools
- Respond with http status code 200

> **_NOTE:_** If the extension fails to authenticate the notification or to update the Card in Commercetools, it will respond with a http status code 400

Based on the response form Visa Acceptance Solutions, the transaction status will be updated

## Decision Manager Webhook

- Required to update the state of a payment that is in `Pending` state due to Decision Manager flagging a payment for review. Once a payment in Review state has been approved or rejected,the transaction in Commercetools will move from Pending to Success or Failure.

Visa Acceptance Solutions-Commercetools Extension only supports the event `risk.profile.decision.reject, risk.casemanagement.addnote, risk.casemanagement.decision.accept, risk.casemanagement.decision.reject` from Webhooks currently.

## Fraud Management Essentials Webhook

- Required to update the state of a payment that is in `Pending` state due to Fraud Management Essentials flagging a payment for review. Once a payment in Review state has been approved or rejected,the transaction in Commercetools will move from Pending to Success or Failure.

Visa Acceptance Solutions-Commercetools Extension only supports the event
`risk.profile.decision.review, risk.profile.decision.reject", risk.profile.decision.monitor, risk.casemanagement.addnote", risk.casemanagement.decision.accept", risk.casemanagement.decision.reject` from Webhooks currently.

## Unified Checkout Webhook

- Required to set the transaction details of a payment Unified checkout webhook is used

Visa Acceptance Solutions-Commercetools Extension only supports the event `uc.orders.transactionresults` from Webhooks currently

Unified Checkout webhook notifications are encrypted. To decrypt them, set the following environment variables:

PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE=your-private-key.p12
PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD=your-password
