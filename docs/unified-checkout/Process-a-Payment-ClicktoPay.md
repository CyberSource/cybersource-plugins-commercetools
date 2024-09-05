# Process a Payment (Visa Click to Pay)

## Visa Click to Pay Processing Sequence Diagram

![Visa Click to Pay Processing flow](images/Flow-Diagram-ClicktoPay.svg)

## Process

⚠️ **Shipping Address** :
The shipping address should be acquired from Visa Click to Pay. This can be set via the `init` javascript:

    V.init({
      apikey: "...",
      paymentRequest: {
        currencyCode: "GBP",
        subtotal: "..."
      },
      settings: {
        shipping: {
          collectShipping: "true",
          acceptedRegions: ["GB"]
        }
      }
    });

**If this method of collecting the shipping address is not used,a shipping address should be set on the cart before payment processing.**

1.  Create / prepare your cart

    a. Ensure your cart locale is set

    > **_NOTE:_** : If the cart has multiple shipping methods, the shipping address of the first available shipping method applied to the cart will be used to process the payment

2.  Create a Commercetools payment (https://docs.commercetools.com/api/projects/payments) and
    populate the following

    | Property                              | Value                               | Required  | Notes                                                                                                                                                                                                                                                                                                                                  |
    | ------------------------------------- | ----------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | customer                              | Reference to Commercetools customer | See notes | Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated                                                                                                                                                                    |
    | anonymousId                           | Id for tracking guest checkout      | See notes | Required for guest checkout. If using MyPayments API this will automatically be set. One of customer or anonymousId must be populated                                                                                                                                                                                                  |
    | paymentMethodInfo.paymentInterface    | Cybersource                         | Yes       |                                                                                                                                                    |
    | paymentMethodInfo.method              | visaCheckout                        | Yes       |                         For Unified Checkout, refer [UnifiedCheckout-Setup\#Decoding transient token](UnifiedCheckout-Setup.md#Decoding-transient-token) to get the value for this field                                                                                                                                      |
    | amountPlanned                         | Amount to be processed                 | Yes       | Should match cart gross total, unless split payments are being used                                                                                                                                                                                                                                                                    |
    | custom.type.key                    | isv_payment_data                    | Yes       |                                                                                                                                                                     |
    | custom.fields.isv_token               | Visa Click to Pay call Id           | Yes       | Obtain from the `callid` field on a successful Visa Click to Pay response <br><br> Required for stand-alone Click to Pay transaction        |
    | custom.fields.isv_transientToken               | Cybersource transient token         | See notes | Can be obtained from the token parameter passed into the callback for the unified checkout invoke call <br><br> Required for Unified Checkout transaction        |
    | custom.fields.isv_deviceFingerprintId | Customer device fingerprint Id      | Yes       | Refer [Device Fingerprinting](./Decision-Manager.md#device-fingerprinting) to generate this value |
    | custom.fields.isv_customerIpAddress   | Customer IP address                 | Yes       | Populated from client-side libraries                                                                                                                                                                                                                                                                                                   |
    | custom.fields.isv_saleEnabled               | false             | Yes       | Set the value to true if sale is enabled                                                                                                           |
    | custom.fields.isv_walletType                | Wallet type | No  |   This value is required if walletType is to be passed in authorization. Refer [Cybersource Processing a Payment](https://developer.cybersource.com/api-reference-assets/index.html#payments_payments_process-a-payment) for more information about the wallet type value to be passed. It is supported only for ApplePay, ClicktoPay and GooglePay payment methods|
    | custom.fields.isv_merchantId   | Merchant Id used for the transaction                 | No       | Required when you want to support Multi-Mid functionality. Populate this field with the value of merchant Id in which the transaction should happen. When this field is empty, default mid configuration will be considered for the transaction. The same mid will be used for the follow-on transactions.                                                                                         |
    | custom.fields.isv_shippingMethod | Shipping method for the order                                                                                         | No    | Possible values: <ul> <li> `lowcost`: Lowest-cost service  </li> <li>`sameday`: Courier or same-day service </li> <li>`oneday`: Next-day or overnight service </li> <li>`twoday`: Two-day service </li> <li>`threeday`: Three-day service.</li> <li> `pickup`: Store pick-up </li> <li> `other`: Other shipping method </li> <li> `none`: No shipping method because product is a service or subscription </li>   |
    
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

    a. If the transaction is successful, transaction state will be updated to **Success**, display the order confirmation page 

    b. If the state of transaction is updated to **Pending** which is due to Fraud Check, display the order confirmation page 

    c. If the state of transaction is updated to **Failure**, display the error page and See [Overview\#Errorhandling](Overview.md#error-handling) for handling errors or failures
