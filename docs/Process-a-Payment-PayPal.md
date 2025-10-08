# Process a Payment (PayPal)

## PayPal Processing Sequence Diagram

![PayPal Pay Processing flow](images/Flow-Diagram-PayPal.svg)

## Details

1.  Create / prepare your cart

    a. Ensure your cart locale is set

    > **_NOTE:_** : If the cart has multiple shipping methods, the shipping address of the first available shipping method applied to the cart will be used to process the payment

2.  Create a Commercetools payment
    (https://docs.commercetools.com/api/projects/payments) and
    populate the following

    | Property                              | Value                               | Required  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
    | ------------------------------------- | ----------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | customer                              | Reference to Commercetools customer | See notes | Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | anonymousId                           | Id for tracking guest checkout      | See notes | Required for guest checkout. If using MyPayments API this will automatically be set. One of customer or anonymousId must be populated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
    | paymentMethodInfo.paymentInterface    | Cybersource                         | Yes       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | paymentMethodInfo.method              | payPal                           | Yes       |                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | amountPlanned                         | Amount to be processed                | Yes       | Should match cart gross total, unless split payments are being used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | custom.type.key                    | isv_payment_data                    | Yes       |                                                                                                        

3. Add the payment to the cart

4. Update the Commercetools payment (<https://docs.commercetools.com/api/projects/payments>) and populate the following

    a. Also see [Decision Manager](Decision-Manager.md) for additional fields to populate if you are using Decision Manager

    b. When the payment is being updated, the extension will make a Create Session call to obtain the redirection URL.

    | Property                              | Value                               | Required  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
    | ------------------------------------- | ----------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |                                                                   
   | custom.fields.isv_deviceFingerprintId | Customer device fingerprint Id      | Yes       | Refer [Device Fingerprinting](./Decision-Manager.md#device-fingerprinting) to generate this value |
    | custom.fields.isv_customerIpAddress | Customer IP address | Yes | Populated from client-side libraries |
    | custom.fields.isv_saleEnabled               | false             | Yes       | Set the value to true if sale is enabled           |
    | custom.fields.isv_merchantId   | Merchant Id used for the transaction                 | No       | Required when you want to support Multi-Mid functionality. Populate this field with the value of merchant Id in which the transaction should happen. When this field is empty, default mid configuration will be considered for the transaction. The same mid will be used for the follow-on transactions.                                                                                         |
    | custom.fields.isv_shippingMethod | Shipping method for the order                                                                                         | No    | Possible values: <ul> <li> `lowcost`: Lowest-cost service  </li> <li>`sameday`: Courier or same-day service </li> <li>`oneday`: Next-day or overnight service </li> <li>`twoday`: Two-day service </li> <li>`threeday`: Three-day service.</li> <li> `pickup`: Store pick-up </li> <li> `other`: Other shipping method </li> <li> `none`: No shipping method because product is a service or subscription </li>  |
    | custom.fields.isv_metadata | Metadata for the order                                                                                         | No    | This field can be used to send additional custom data as part of the authorization/sale request. The data should be serialized into a string format (e.g., JSON string) before passing it in the request.<br>**Example:**"isv_metadata": "{\"1\":\"value1\", \"2\":\"value2\"}"   |

5.  Wait for the event to return the following fields from the update response: **isv_payPalUrl** and **isv_payPalRequestId**. If the data exists for these fields, use the redirect URL(isv_payPalUrl) to send the customer to the PayPal website, where they can log into their PayPal account and complete the payment. Otherwise, throw an error to the user

6.  After the customer completes the payment, they’ll be redirected to the returnUrl specified in the environment configuration of the plugin. If the payment is canceled, they’ll be redirected to the cancelUrl. In case of a payment failure, they’ll be redirected to the failureUrl. 

7.  Add a transaction to the payment 

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

8.  Verify the payment state and convey the payment result to the customer

    a. If the transaction is successful, transaction state will be updated to **Success**, display the order confirmation page 

    b. If the state of transaction is updated to **Pending** which is due to Fraud Check, display the order confirmation page 

    c. If the state of transaction is updated to **Failure**, display the error page and See [Overview\#Errorhandling](Overview.md#error-handling) for handling errors or failures
