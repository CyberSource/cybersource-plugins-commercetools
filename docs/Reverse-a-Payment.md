<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

# Reverse a Payment

</div>

<div id="content" class="view">

<div id="main-content" class="wiki-content group">

## Process

To reverse a payment, an Authorization must have been completed. When the Payment Update API Extension receives a payment that contains an INITIAL CANCEL\_AUTHORIZATION transaction, it will attempt to reverse the requested amount on the transaction using the `interactionId` of the existing SUCCESS AUTHORIZATION transaction on the payment. The requested amount must be equal to the amount original authorized

## Steps

To reverse a payment:
  - Complete an authorization, ensuring that the state is `Success`
  - Update the payment, adding an INITIAL CANCEL\_AUTHORIZATION transaction onto the payment with an amount matching the amount of the authorization being reversed

A successful reversal will change the INITIAL CANCEL\_AUTHORIZATION to a SUCCESS CANCEL\_AUTHORIZATION transaction, adding the Reversal Request ID onto the transaction as an `interactionId`

</div>

</div>

</div>

</div>