<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

# Capture a Payment

</div>

<div id="content" class="view">

<div id="main-content" class="wiki-content group">

## Process

To capture a payment, an Authorization must have been completed. When the Payment Update API Extension receives a payment that contains an INITIAL CHARGE transaction, it will attempt to capture the requested amount on the transaction using the `interactionId` of the existing SUCCESS AUTHORIZATION transaction on the payment.

## Steps

To capture a payment:
  - Complete an authorization, ensuring that the state is `Success`
  - Update the payment, adding an INITIAL CHARGE transaction onto the payment with a value to be captured

A successful capture will change the INITIAL CHARGE to a SUCCESS CHARGE transaction, adding the Capture Request ID onto the transaction as an `interactionId`

</div>

</div>

</div>

</div>