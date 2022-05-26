# Refund a Payment

## Refund Service Sequence Diagram

![Refund service flow](images/Flow-Diagram-Refund-a-Payment.svg)

## Process

To refund a payment, a Capture must have been completed. When the Payment Update API Extension receives a payment that contains an INITIAL REFUND transaction, it will attempt to refund the requested amount on the transaction using the `interactionId` of the existing SUCCESS CHARGE transaction on the payment. You can perform multiple refunds but the total of all previous successful refunds and the current refund must be no more than the amount captured.

## Steps

To refund a payment:

- If Sale flag not enabled,complete an authorization and capture, ensuring that the state for both is `Success`
- If Sale flag enabled,complete a sale transaction, ensuring that the state for CHARGE is `Success`
- Update the payment, adding an INITIAL REFUND transaction onto the payment with an amount to be refunded

A successful refund will change the INITIAL REFUND to a SUCCESS REFUND transaction, adding the Credit Request ID onto the transaction as an `interactionId`.
