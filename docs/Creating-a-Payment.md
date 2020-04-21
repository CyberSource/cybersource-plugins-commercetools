<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

# Creating a Payment

</div>

<div id="content" class="view">

<div id="main-content" class="wiki-content group">

To create a payment, you must first decide which payment method you would like to use:

<div class="table-wrap">

| Payment Method                    | Explanation                                                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| creditCard                        | Processes credit cards without any 3DS checks.                                                                    |
| visaCheckout                      | Processes payments using information from Visa Checkout                                                           |
| creditCardWithPayerAuthentication | Processes credit cards with 3DS checks. This requires some extra values on Payment Create which are listed below. |

</div> 

When creating a payment, the following fields are validated

<div class="table-wrap">

| Field                                                 | Validation                                  | When                                                                    |
| ----------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| payment.paymentMethodInfo.method                      | Must be an acceptable value as listed above | Always                                                                  |
| payment.transactions                                  | Must be empty                               | Always                                                                  |
| payment.amountPlanned                                 | Must not be a negative value                | payment.paymentMethodInfo.method == 'creditCardWithPayerAuthentication' |
| payment.custom.cs\_token                              | Must exist                                  | payment.paymentMethodInfo.method == 'creditCardWithPayerAuthentication' |
| payment.custom.cs\_payerAuthenticationAcceptHeader    | Must exist                                  | payment.paymentMethodInfo.method == 'creditCardWithPayerAuthentication' |
| payment.custom.cs\_payerAuthenticationUserAgentHeader | Must exist                                  | payment.paymentMethodInfo.method == 'creditCardWithPayerAuthentication' |

</div>

Once a payment has been created, you can continue on to the Authorization steps.

</div>

</div>

</div>

</div>