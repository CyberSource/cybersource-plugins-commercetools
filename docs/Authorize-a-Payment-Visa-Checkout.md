<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

# Authorize a Payment (Visa Checkout)

</div>

<div id="content" class="view">

<div id="main-content" class="wiki-content group">

## Visa Checkout Authorisation Sequence Diagram

![Visa Checkout Authorisation flow](images/Authorisation-flow-vc.svg)

## Process

⚠️ **3D Secure
Visa Checkout implementation does not currently support 3DS. See 'Using 3D Secure with Visa Checkout' section of the 'Visa Checkout - Using the Simple Order API' if you are looking to implement this.**

⚠️ **Shipping Address
The shipping address should be acquired from Visa Checkout. This can be set via the `init` javascript:**
```javascript
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
```
**If this method of collecting the shipping address is not used, a shipping address should be set on the cart before authorizing payment.**  

1.  Create / prepare your cart
    
    a.  Ensure your cart locale is set.

2.  Create a commercetools payment
    (<https://docs.commercetools.com/http-api-projects-payments>) and
    populate the following
    
    <div class="table-wrap">
    
    <div class="table-wrap">
    
    <table>
    <thead>
    <tr class="header">
    <th style="text-align: left;"><div class="tablesorter-header-inner">
    Property
    </div></th>
    <th style="text-align: left;"><div class="tablesorter-header-inner">
    Value
    </div></th>
    <th style="text-align: left;"><div class="tablesorter-header-inner">
    Required
    </div></th>
    <th style="text-align: left;"><div class="tablesorter-header-inner">
    Notes
    </div></th>
    </tr>
    </thead>
    <tbody>
    <tr class="odd">
    <td style="text-align: left;">customer</td>
    <td style="text-align: left;">Reference to commercetools customer</td>
    <td style="text-align: left;">See notes</td>
    <td style="text-align: left;">Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated</td>
    </tr>
    <tr class="even">
    <td style="text-align: left;">anonymousId</td>
    <td style="text-align: left;">Id for tracking guest checkout</td>
    <td style="text-align: left;">See notes</td>
    <td style="text-align: left;">Required for guest checkout. If using MyPayments API this will automatically be set. One of customer or anonymousId must be populated</td>
    </tr>
    <tr class="odd">
    <td style="text-align: left;">paymentMethodInfo.paymentInterface</td>
    <td style="text-align: left;">cybersource</td>
    <td style="text-align: left;">Yes</td>
    <td style="text-align: left;">Required for guest checkout. If using MyPayments API this will automatically be set to the session id of the anonymous oauth token. One of customer or anonymousId must be populated</td>
    </tr>
    <tr class="even">
    <td style="text-align: left;">paymentMethodInfo.method</td>
    <td style="text-align: left;">visaCheckout</td>
    <td style="text-align: left;">Yes</td>
    <td style="text-align: left;"><p>The reference application is set up to support payments with and without payer authentication and the method is used to determine which is being used</p>
    <p>Typically an implementation would choose one or the other and the method name may be different to this</p></td>
    </tr>
    <tr class="odd">
    <td style="text-align: left;">amountPlanned</td>
    <td style="text-align: left;">Amount to authorise</td>
    <td style="text-align: left;">Yes</td>
    <td style="text-align: left;">Should match cart gross total, unless split payments are being used</td>
    </tr>
    <tr class="even">
    <td style="text-align: left;">custom.fields.cs_token</td>
    <td style="text-align: left;">Visa Checkout callid</td>
    <td style="text-align: left;">Yes</td>
    <td style="text-align: left;">Obtain from the 'callid' field on a successful Visa Checkout response</td>
    </tr>
    </tbody>
    </table>
    
    </div>
    
    </div>

3.  Add the payment to the cart

4.  Add a transaction to the payment with the following values populated
    
    <div class="table-wrap">
    
    <div class="table-wrap">
    
    <table>
    <thead>
    <tr class="header">
    <th style="text-align: left;"><div class="tablesorter-header-inner">
    Property
    </div></th>
    <th style="text-align: left;"><div class="tablesorter-header-inner">
    Value
    </div></th>
    <th style="text-align: left;"><div class="tablesorter-header-inner">
    Notes
    </div></th>
    </tr>
    </thead>
    <tbody>
    <tr class="odd">
    <td style="text-align: left;">type</td>
    <td style="text-align: left;">Authorization</td>
    <td style="text-align: left;"><br />
    </td>
    </tr>
    <tr class="even">
    <td style="text-align: left;">state</td>
    <td style="text-align: left;">Initial</td>
    <td style="text-align: left;"><br />
    </td>
    </tr>
    <tr class="odd">
    <td style="text-align: left;">amount</td>
    <td style="text-align: left;">Amount to authorise</td>
    <td style="text-align: left;">Should match amountPlanned on payment</td>
    </tr>
    </tbody>
    </table>
    
    </div>
    
    </div>

5.  Verify the payment state
    
    a.  If the authorisation was successful the transaction state will have been updated to **Success**
    
    b.  See [Overview\#Errorhandling](Overview.md#Errorhandling) for handling errors or failures

6.  Convey the payment result to the customer. If this is the only/final payment for this order you can transition your commercetools cart to an order at this point

</div>

</div>

</div>

</div>