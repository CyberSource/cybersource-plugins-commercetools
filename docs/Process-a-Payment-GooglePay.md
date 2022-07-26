# Process a Payment (Google Pay)

## Google Pay Processing Sequence Diagram

![Google Pay Processing flow](images/Flow-Diagram-GooglePay.svg)

## Details

1.  Create / prepare your cart

    a. Ensure your cart locale is set

2.  Create a Commercetools payment
    (https://docs.commercetools.com/http-api-projects-payments) and
    populate the following

    | Property                              | Value                               | Required  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
    | ------------------------------------- | ----------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | customer                              | Reference to Commercetools customer | See notes | Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | anonymousId                           | Id for tracking guest checkout      | See notes | Required for guest checkout. If using MyPayments API this will automatically be set. One of customer or anonymousId must be populated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
    | paymentMethodInfo.paymentInterface    | cybersource                         | Yes       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | paymentMethodInfo.method              | googlePay                           | Yes       |                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | amountPlanned                         | Amount to be processed                | Yes       | Should match cart gross total, unless split payments are being used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | custom.type.key                    | isv_payment_data                    | Yes       |                                                                                                                                                                     |
    | custom.fields.isv_token               | Google Pay payment data             | Yes       | Obtain the base64 encoded value of 'token' field from google Pay paymentData                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint Id      | Yes       | It must be unique for each merchant Id. You can use any string that you are already generating, such as an order number or web session Id. However, do not use the same uppercase and lowercase letters to indicate different session Ids. Replace sessionId with the unique Id generated in the URL given. Include the script "https://h.online-metrix.net/fp/tags.js?org_id={{org Id}}&session_id={{merchant Id}}{{session Id}}". Replace the below data {{org Id}} - To obtain this value, contact your Cybersource representative and specify to them whether it is for testing or production. {{merchant Id}} - Your unique Cybersource merchant Id. {{session Id}} - Value of unique Id generated above|
    | custom.fields.isv_customerIpAddress | Customer IP address | Yes | Populated from client-side libraries |
    | custom.fields.isv_saleEnabled               | false             | Yes       | Set the value to true if sale is enabled           |
    | custom.fields.isv_walletType                | Wallet type | No  |   This value is required if walletType is to be passed in authorization. Refer [Cybersource Processing a Payment](https://developer.cybersource.com/api-reference-assets/index.html#payments_payments_process-a-payment) for more information about the wallet type value to be passed. It is supported only for ApplePay, ClicktoPay and GooglePay payment methods|  
    

3.  Add the payment to the cart

4.  Add a transaction to the payment 

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

5.  Verify the payment state and convey the payment result to the customer

    a. If the transaction was successful the transaction state is updated to **Success**, display the order confirmation page 

    b. If the state of the transaction is updated to **Pending** which is due to Fraud Check, display the order confirmation page 

    c. If the state of the transaction is updated to **Failure**, display the error page and See [Overview\#Errorhandling](Overview.md#Errorhandling) for handling errors or failures
