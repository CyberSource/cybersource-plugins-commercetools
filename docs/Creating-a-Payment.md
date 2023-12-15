# Creating a Payment

To create a payment, you must first decide which payment method you would like to use:

| Payment Method                    | Explanation                                                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| creditCard                        | Processes credit cards without any 3DS checks                                                                       |
| clickToPay                      | Processes payment using payment network tokenization to make Web payments and mobile payments on Android devices using Visa Click to Pay                                                          |
| creditCardWithPayerAuthentication | Processes credit cards with 3DS checks. This requires some extra values on Payment Create which are listed below    |
| googlePay                         | Processes the payment using payment network tokenization to make Web payments and mobile payments on Android devices using Google Pay |
| applePay                          | Processes the payment using payment network tokenization to make Web payments and mobile payments on Apple devices using Apple Pay   |
| eCheck                            | Processes the payment using appropriate check processors. This requires some extra values on Payment Create which are listed below |



When creating a payment, the following fields are validated

| Field                                      | Validation                                  | When   |
| ------------------------------------------ | ------------------------------------------- | ------ |
| payment.paymentMethodInfo.method           | Must be an acceptable value as listed above | Always |
| payment.paymentMethodInfo.name.locale_name             | Here the locale_name refers to en or de or the locale your project is configured. Must be an acceptable value as listed above | Always |
| payment.paymentMethodInfo.paymentInterface | Cybersource                                 | Always |
| payment.transactions                       | Must be empty                               | Always |
| payment.amountPlanned                      | Must not be a negative value                | Always |
| payment.custom.type.key                    | isv_payment_data                            | Always |
| payment.custom.isv_token                   | Must exist                                  | Always |
| payment.custom.isv_accountNumber           | Must exist                                  | If payment.paymentMethodInfo.method is eCheck                            |
| payment.custom.isv_accountType             | Must exist                                  | If payment.paymentMethodInfo.method is eCheck                            |
| payment.custom.isv_routingNumber           | Must exist                                  | If payment.paymentMethodInfo.method is eCheck                            |
| payment.custom.isv_acceptHeader            | Must exist                                  | If payment.paymentMethodInfo.method is creditCardWithPayerAuthentication |
| payment.custom.isv_userAgentHeader         | Must exist                                  | If payment.paymentMethodInfo.method is creditCardWithPayerAuthentication |

