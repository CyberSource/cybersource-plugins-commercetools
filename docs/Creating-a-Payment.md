# Creating a Payment

To create a payment, you must first decide which payment method you would like to use:

| Payment Method                    | Explanation                                                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| creditCard                        | Processes credit cards without any 3DS checks                                                                       |
| clickToPay                      | Processes payment using payment network tokenization to make Web payments and mobile payments on Android devices using Visa Click to Pay                                                          |
| creditCardWithPayerAuthentication | Processes credit cards with 3DS checks. This requires some extra values on Payment Create which are listed below    |
| googlePay                         | Processes the payment using payment network tokenization to make Web payments and mobile payments on Android devices using Google Pay |
| applePay                          | Processes the payment using payment network tokenization to make Web payments and mobile payments on Apple devices using Apple Pay   |



When creating a payment, the following fields are validated

| Field                                      | Validation                                  | When   |
| ------------------------------------------ | ------------------------------------------- | ------ |
| payment.paymentMethodInfo.method           | Must be an acceptable value as listed above | Always |
| payment.paymentMethodInfo.name             | Must be an acceptable value as listed above | Always |
| payment.paymentMethodInfo.paymentInterface | Cybersource                                 | Always |
| payment.transactions                       | Must be empty                               | Always |
| payment.amountPlanned                      | Must not be a negative value                | Always |
| payment.custom.type.key                    | isv_payment_data                            | Always |
| payment.custom.isv_token                   | Must exist                                  | Always |
| payment.custom.isv_accountNumber           | Must exist                                  | payment.paymentMethodInfo.method == eCheck                            |
| payment.custom.isv_accountType             | Must exist                                  | payment.paymentMethodInfo.method == eCheck                            |
| payment.custom.isv_routingNumber           | Must exist                                  | payment.paymentMethodInfo.method == eCheck                            |
| payment.custom.isv_acceptHeader            | Must exist                                  | payment.paymentMethodInfo.method == creditCardWithPayerAuthentication |
| payment.custom.isv_userAgentHeader         | Must exist                                  | payment.paymentMethodInfo.method == creditCardWithPayerAuthentication |

