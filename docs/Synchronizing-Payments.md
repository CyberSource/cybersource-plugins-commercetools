# Synchronizing Payments

## Overview

Synchronizing payments uses the [Cybersource Transaction Search API](https://developer.cybersource.com/docs/cybs/en-us/txn-search/developer/all/rest/txn-search/txn-search-intro.html) and the [Conversion Detail API](https://developer.cybersource.com/docs/cybs/en-us/reporting/developer/all/rest/reporting/reporting_api/reporting-ondemand-detail-download.html) to search for transactions that contains a possible Commercetools Payment Id and then compares the transaction against the Commercetools payment, if found create or update transactions on the Commercetools payment.

This process is required for a few reasons:

- To update the state of a payment that is in `Pending` state due to Decision Manager flagging a payment for review. Once a payment in Review state has been approved or rejected,the transaction in Commercetools will move from Pending to Success or Failure. Next time the payment is processed by the synchronization service.
- To ensure eventual consistency in Commercetools in the scenario where a payment has been processed by Cybersource but there was an issue saving the reference to the payment in Commercetools(such as a network failure or an exception in the payments service).

## Implementation

For using Synchronizing services, it should be enabled from the configuration file. See the [API Extension Setup](API-Extension-Setup.md#configuration) for more details.

> **_NOTE:_** These fields are case sensitive

The `run sync` button in extension UI (<https://{domain_where_extension_is_hosted}/orders>) will synchronize every payment found for the current day i.e., 50 payments at a time across all the mids configured in the .env file. `Decision sync` also works in the similar way such that, it will update the state of payment that is in `Pending` to either `Success` or `Failure` based on the Decision taken by the merchant.

Alternatively, Scheduler can be used to run the sync periodically. Below are the endpoints for synchronization:

| Sync service  | Endpoint               | Note                                                                                            |
| ------------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| Decision sync | {baseUrl}/decisionSync | The baseUrl will be defined by where you deploy the extension. HTTPS should be used for production |
| Run sync      | {baseUrl}/sync         | The baseUrl will be defined by where you deploy the extension. HTTPS should be used for production |

> **_NOTE:_** In the order or execution, Decision Sync should have the higher priority than Run Sync. Eg: If an authorization is pending for review, and is rejected from EBC along with auth reversal, the Decision status should be synced first and later comes the Run Sync. If a scheduler is configured, always Decision Sync Scheduler should execute before Run Sync scheduler.

## Process

### Updating Pending Transactions

#### Sequence Diagram  (Synchronizing Decisions)

![Synchronizing Decisions](images/Synchronizing-Decisions.svg)
### Synchronizing Missing Transactions

**_NOTE:_** On running Run Sync, if you see any payment status in pending, running a Decision sync will change the status based on response.

#### Sequence Diagram (Synchronizing Missing Transaction)

![Synchronizing Missing Transactions](images/Synchronizing-Missing-Transactions.svg)

#### Before and After Examples States

##### CT Payment

    {
      "id": "123",
      ...
      "transactions": []
    }

##### CS Transaction

    {
      "searchId":"xyz",
      "_embedded": {
        "transactionSummaries":[
          {
            "id": "6445658584406673603955",
            "applicationInformation": {
              "applications": [
                {
                  "name": "ics_auth",
                  "reasonCode": "100",
                  "rMessage": "Request was processed successfully.",
                }
              ]
            },
            "clientReferenceInformation": {
              "code": "5051668f-a147-4afb-8b69-6309e460de9a",
              "applicationName": "REST API"
            }
          }
        ]
      }
    }

##### CT Payment After Synchronization

    {
      "id": "5051668f-a147-4afb-8b69-6309e460de9a",
      ...
      "transactions": [
        {
          "state": "Success",
          "type": "Authorization",
          "interactionId": "6445658584406673603955"
        }
      ]
    }
