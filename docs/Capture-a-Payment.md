# Capture a Payment

## Capture Service Sequence Diagram

![Capture service flow](images/Flow-Diagram-Capture-a-Payment.svg)

## Process

To capture a payment, an Authorization must have been completed. When the Payment Update API extension receives a payment that contains an INITIAL CHARGE transaction, it will attempt to capture the requested amount on the transaction using the `interactionId` of the existing SUCCESS AUTHORIZATION transaction on the payment. You can perform multiple captures but the total of all previous successful captures and the current capture must be not more than the authorized amount.

## Steps

To capture a payment:

- Complete an authorization, ensuring that the state is `Success`
- Update the payment by adding an INITIAL CHARGE transaction onto the payment with a value to be captured

Capture Response Handling

- A successful capture will change the INITIAL CHARGE to a SUCCESS CHARGE transaction, adding the Capture Request Id onto the transaction as an `interactionId`

- If the settlement is not successful, the extension will change the INITIAL CHARGE to FAILURE CHARGE transaction, adding the Capture Request Id onto the transaction as an `interactionId`. One can request a capture again if it is failed