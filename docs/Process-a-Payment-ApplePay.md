# Process a Payment (Apple Pay)

## Apple Pay Processing Sequence Diagram

![Apple Pay Processing flow](images/Flow-Diagram-ApplePay.svg)

## Details

1.  Create / prepare your cart

    a. Ensure your cart locale is set

    > **_NOTE:_** : If the cart has multiple shipping methods, the shipping address of the first available shipping method applied to the cart will be used to process the payment

2.  Create a Commercetools payment (<https://docs.commercetools.com/api/projects/payments>) and
    populate the following

    | Property                              | Value                               | Required  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | ------------------------------------- | ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | customer                              | Reference to Commercetools customer | See notes | Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | anonymousId                           | Id for tracking guest checkout      | See notes | Required for guest checkout. If using MyPayments API this will automatically be set. One of customer or anonymousId must be populated                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | amountPlanned                         | Amount to be processed                 | Yes       | Should match cart gross total, unless split payments are being used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | paymentMethodInfo.paymentInterface    | Cybersource                         | Yes       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | paymentMethodInfo.method              | applePay                            | Yes       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | custom.type.key                       | isv_payment_data                    | Yes       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | custom.fields.isv_token               | Apple Pay payment data              | Yes       | Obtain the base64encode value for payment token field on a successful payment authorized event for Apple Pay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint Id      | No        | Refer [Device Fingerprinting](./Decision-Manager.md#device-fingerprinting) to generate this value |
    | custom.fields.isv_customerIpAddress   | Customer IP address                 | Yes       | Populated from client-side libraries                                                                                          |
    | custom.fields.isv_merchantId   | Merchant Id used for the transaction                 | No       | Required when you want to support Multi-Mid functionality. Populate this field with the value of merchant Id in which the transaction should happen. When this field is empty, default mid configuration will be considered for the transaction. The same mid will be used for the follow-on transactions.                                                                                         |
3.  You can optionally obtain the session data for <b>Web integration</b> to pass the merchant session object to your Apple Pay session’s completeMerchantValidation method by creating a payment with the following

    Note that you can skip this step for Native App integration

    a. Create a Commercetools payment
        (https://docs.commercetools.com/api/projects/payments) and
        populate the following

    | Property                                | Value                                           | Required  | Notes                                                                                                                                                                                                                                                                          |
    | --------------------------------------- | ----------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | customer                                | Reference to Commercetools customer             | See notes | Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated                                                                                                            |
    | anonymousId                             | Id for tracking guest checkout                  | See notes | Required for guest checkout. If using MyPayments API this will automatically be set. One of customer or anonymousId must be populated                                                                                                                                          |
    | paymentMethodInfo.paymentInterface      | Cybersource                                     | Yes       |                                                                                            |
    | paymentMethodInfo.method                | applePay                                        | Yes       |  |
    | amountPlanned                           | Amount to be processed                             | Yes       | Should match cart gross total, unless split payments are being used                                                                                                                                                                                                            |
    | custom.type.key          | isv_payment_data                            | Yes       | 
    | custom.fields.isv_applePayValidationUrl | Apple Pay validation URL                        | Yes       | Pass the URL obtained from the event’s validationURL property of onvalidatemerchant function. See [Providing Merchant Validation](https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/providing_merchant_validation) for information.              |
    | custom.fields.isv_applePayDisplayName   | Name to be displayed on Apple Pay payment sheet | Yes       |                                                                                   |
    | custom.fields.isv_merchantId   | Merchant Id used for the transaction                 | No       | Required when you want to support Multi-Mid functionality. Populate this field with the value of merchant Id in which the transaction should happen. When this field is empty, default mid configuration will be considered for the transaction. The same mid will be used for the follow-on transactions.                                                                                         | 

    b. Verify the `custom.fields.isv_applePaySessionData` has data from the update response. If the data exists, pass the merchant session object to your Apple Pay session’s completeMerchantValidation method. You can use the merchant session object a single time. It expires five minutes after it is created, see [Providing Merchant Validation](https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/providing_merchant_validation), else throw error to the customer.

    c. Update the Commercetools payment (<https://docs.commercetools.com/api/projects/payments>) and populate the following

    | Property                              | Value                          | Required | Notes                                                                                                                                                                                                                                                                                                                                  |
    | ------------------------------------- | ------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | custom.fields.isv_token               | Apple Pay payment data         | Yes      | Obtain the base64encode value of payment token field on a successful payment processing event for Apple Pay                                                                                                                                                                                                                  |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint Id | No      | Refer [Device Fingerprinting](./Decision-Manager.md#device-fingerprinting) to generate this value |
    | custom.fields.isv_customerIpAddress   | Customer IP address            | Yes      | Populated from client-side libraries                                                                                                                                                                                                                                                                                                   |
    | custom.fields.isv_saleEnabled               | false             | Yes       | Set the value to true if sale is enabled                                                                                                                                                                                                    |
    | custom.fields.isv_walletType                | Wallet type | No  |   This value is required if walletType is to be passed in authorization. Refer [Cybersource Processing a Payment](https://developer.cybersource.com/api-reference-assets/index.html#payments_payments_process-a-payment) for more information about the wallet type value to be passed. It is supported only for ApplePay, ClicktoPay and GooglePay payment methods|
    |custom.fields.isv_shippingMethod | Shipping method for the order                                                                                         | No    | Possible values: <ul> <li> `lowcost`: Lowest-cost service  </li> <li>`sameday`: Courier or same-day service </li> <li>`oneday`: Next-day or overnight service </li> <li>`twoday`: Two-day service </li> <li>`threeday`: Three-day service.</li> <li> `pickup`: Store pick-up </li> <li> `other`: Other shipping method </li> <li> `none`: No shipping method because product is a service or subscription </li>  |

4.  Add the payment to the cart

5.  Add a transaction to the payment 

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
    

6.  Verify the payment state and convey the payment result to the customer

    a. If the transaction is successful, transaction state will be updated to **Success**, display the order confirmation page 

    b. If the state of transaction is updated to **Pending** which is due to Fraud Check, display the order confirmation page 

    c. If the state of transaction is updated to **Failure**, display the error page and See [Overview\#Errorhandling](Overview.md#error-handling) for handling errors or failures
