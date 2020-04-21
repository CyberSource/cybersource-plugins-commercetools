<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

# Authorize a Payment (With Payer Authentication)

</div>

<div id="content" class="view">

<div id="main-content" class="wiki-content group">

To authorize a payment with 3DS functionality, a payment should be created with the amount to authorise, a token representing the payment card and the billing address associated with the card.

A check will be made during payment creation to see if the card is enrolled in 3DS and if authentication is required. If authentication is required, the created payment will contain data required to continue the authentication process.

After authentication is complete, authorisation of the payment can then be triggered by adding an initial transaction to the payment.

![Authorisation flow with payer authentication](images/Auth_flow_with_payer_auth.svg)  

## Details

1.  Prepare your cart
    
    1.  Ensure the cart locale is set
    
    2.  Ensure the cart billing and shipping addresses are set. The
        default mapping of commercetools address fields to Cybersource
        fields is as follows. If you require a different mapping this
        can be [customised](Customisation.md)
        
        <div class="table-wrap">
        
        <table>
        <thead>
        <tr class="header">
        <th>Commercetools address</th>
        <th>Cybersource shipping fields</th>
        <th>Cybersource billing fields</th>
        <th>Notes</th>
        </tr>
        </thead>
        <tbody>
        <tr class="odd">
        <td>firstName</td>
        <td>shipTo_firstName</td>
        <td>billTo_firstName</td>
        <td><br />
        </td>
        </tr>
        <tr class="even">
        <td>lastName</td>
        <td>shipTo_lastName</td>
        <td>billTo_lastName</td>
        <td><p><br />
        </p></td>
        </tr>
        <tr class="odd">
        <td>streetNumber and streetName</td>
        <td>shipTo_street1</td>
        <td>billTo_street1</td>
        <td>If both values populated they are concatenated together with a space between. Otherwise streetName is used by itself</td>
        </tr>
        <tr class="even">
        <td>city</td>
        <td>shipTo_city</td>
        <td>billTo_city</td>
        <td><br />
        </td>
        </tr>
        <tr class="odd">
        <td>postalCode</td>
        <td>shipTo_postalCode</td>
        <td>billTo_postalCode</td>
        <td><br />
        </td>
        </tr>
        <tr class="even">
        <td>region</td>
        <td>shipTo_state</td>
        <td>billTo_state</td>
        <td><br />
        </td>
        </tr>
        <tr class="odd">
        <td>country</td>
        <td>shipTo_country</td>
        <td>billTo_country</td>
        <td><br />
        </td>
        </tr>
        <tr class="even">
        <td>email</td>
        <td>Not used</td>
        <td>billTo_email</td>
        <td><br />
        </td>
        </tr>
        </tbody>
        </table>
        
        </div>

2.  Retrieve a request JWT for Cardinal
    
    1.  Make a POST request to http://{host}:{port}/jwt. The response is
        a JSON Web Token to be sent to Cardinal

3.  Initialise Cardinal with the request JWT
    
    ```javascript
      Cardinal.setup("init", {
        // cardinalRequestJwt is value retrieved in above step
         jwt: cardinalRequestJwt
      });
    ```

4.  Wait for Cardinal payments.setupComplete complete event. See [3D
    Secure Setup](3D-Secure-Setup.md) for details of the
    one-time setup for this

5.  Tokenise credit card details using Cybersource Flex (this step may
    be performed in advance and the token saved for later re-use)
    
    1.  Retrieve one time key
        
        Make a POST request to http://{host}:{port}/keys. The response
        will be a JSON Web Token containing your one time key
    
    2.  Use Flex SDK to tokenise card details  
        See <https://github.com/CyberSource/cybersource-flex-samples-java/blob/master/jsp-flexjs/src/main/webapp/index.jsp> for
        an example of how to use the key obtained above and the Flex JS
        SDK to tokenise a credit card. Note that the line beginning
        with **`var jwk =`** needs to be replaced with code that will
        populate the one time key

6.  Call [Cardinal BIN detection](https://cardinaldocs.atlassian.net/wiki/spaces/CC/pages/311984510/BIN+Detection)
    
    ```javascript
      Cardinal.trigger("bin.process", cardNumber).then(function(results){
        // create commerce tools payment as per next step
      });
    ```
    
    ⚠️ **There are other ways to call BIN detection as documented at <https://cardinaldocs.atlassian.net/wiki/spaces/CC/pages/311984510/BIN+Detection>**
    
    ⚠️ **cardNumber should be at least the first 6 digits of the card number but may be anything up to the full card number if available**

7.  Create a commercetools payment
    (<https://docs.commercetools.com/http-api-projects-payments>) and
    populate the following
    
    <div class="table-wrap">
    
    <table>
    <thead>
    <tr class="header">
    <th>Property</th>
    <th>Value</th>
    <th>Required</th>
    <th>Notes</th>
    </tr>
    </thead>
    <tbody>
    <tr class="odd">
    <td>customer</td>
    <td>Reference to commercetools customer</td>
    <td>See notes</td>
    <td>Required for non-guest checkout. If using MyPayments API this will automatically be set to the logged in customer. One of customer or anonymousId must be populated</td>
    </tr>
    <tr class="even">
    <td>anonymousId</td>
    <td>Id for tracking guest checkout</td>
    <td>See notes</td>
    <td>Required for guest checkout. If using MyPayments API this will automatically be set to the session id of the anonymous oauth token. One of customer or anonymousId must be populated</td>
    </tr>
    <tr class="odd">
    <td>paymentMethodInfo.paymentInterface</td>
    <td>cybersource</td>
    <td>Yes</td>
    <td><br />
    </td>
    </tr>
    <tr class="even">
    <td>paymentMethodInfo.method</td>
    <td>creditCardWithPayerAuthentication</td>
    <td>Yes</td>
    <td><p>The reference application is set up to support payments with and without payer authentication and the method is used to determine which is being used</p>
    <p>Typically an implementation would choose one or the other and the method name may be different to this</p></td>
    </tr>
    <tr class="odd">
    <td>amountPlanned</td>
    <td>Amount to authorise</td>
    <td>Yes</td>
    <td>Should match cart gross total, unless split payments are being used</td>
    </tr>
    <tr class="even">
    <td>custom.fields.cs_token</td>
    <td>Cybersource flex token</td>
    <td>Yes</td>
    <td>Obtain from the token field from the response to the FLEX.createToken call</td>
    </tr>
    <tr class="odd">
    <td>custom.fields.cs_maskedPan</td>
    <td>Masked credit card number</td>
    <td>No</td>
    <td>Obtain from the maskedPan field from the response to the FLEX.createToken call. Not required by extension but can be used for display</td>
    </tr>
    <tr class="even">
    <td>custom.fields.cs_cardType</td>
    <td>Credit card type</td>
    <td>No</td>
    <td>For display only</td>
    </tr>
    <tr class="odd">
    <td>custom.fields.cs_cardExpiryMonth</td>
    <td>Card expiry month</td>
    <td>No</td>
    <td>For display only</td>
    </tr>
    <tr class="even">
    <td>custom.fields.cs_cardExpiryYear</td>
    <td>Card expiry year</td>
    <td>No</td>
    <td>For display only</td>
    </tr>
    <tr class="odd">
    <td><span class="inline-comment-marker" data-ref="5915c34c-0410-4fbe-a729-0d0ea407cb9d">custom.fields.cs_acceptHeader</span></td>
    <td>Value of Accept header from user's browser</td>
    <td>Yes</td>
    <td>Used by 3DS process, populated from client-side libraries</td>
    </tr>
    <tr class="even">
    <td>custom.fields.cs_userAgentHeader</td>
    <td>Value of UserAgent header from user's browser</td>
    <td>Yes</td>
    <td>Used by 3DS process, populated from client-side libraries</td>
    </tr>
    </tbody>
    </table>
    
    </div>
    
    a.  Also see [Decision Manager](Decision-Manager.md) for additional fields to populate if you are using Decision Manager
    
    b.  When processing the payment creation the extension will do an enrolment check to see if the card is enrolled in 3D Secure

8.  Add the payment to the cart

9.  Check the value of the cs\_payerAuthenticationRequired field on the
    created payment. If the value is true, perform the following steps
    
    a.  Call Cardinal.continue with
        
    ```javascript
      Cardinal.continue('cca',
        {
          "AcsUrl": <value of cs_payerAuthenticationAcsUrl from created payment>,
          "Payload": <value of cs_payerAuthenticationPaReq from created payment>
        },
        {
          "OrderDetails": {
            "TransactionId": <value of cs_payerAuthenticationTransactionId from created payment>
          }
        }
      );
    ```
    
    b.  The payer authentication window will be displayed and when the user completes the process you will receive a payments.validated event. Inspect the response to determine if the validation was successful and extract the response JWT
    
    c.  Update the commerce tools payment to set the value of custom.fields.cs\_responseJwt to the value extracted from the Cardinal response

10. Add a transaction to the payment with the following values populated
    
    <div class="table-wrap">
    
    <table>
    <thead>
    <tr class="header">
    <th>Property</th>
    <th>Value</th>
    <th>Notes</th>
    </tr>
    </thead>
    <tbody>
    <tr class="odd">
    <td>type</td>
    <td>Authorization</td>
    <td><br />
    </td>
    </tr>
    <tr class="even">
    <td>state</td>
    <td>Initial</td>
    <td><br />
    </td>
    </tr>
    <tr class="odd">
    <td>amount</td>
    <td>Amount to authorise</td>
    <td>Should match amountPlanned on payment</td>
    </tr>
    </tbody>
    </table>
    
    </div>

11. Verify the payment state
    
    a. If the authorisation was successful the transaction state will have been updated to **Success**
    b. See [Overview\#Errorhandling](Overview.md#Errorhandling) for handling errors or failures

12. Convey the payment result to the customer. If this is the only/final payment for this order you can transition your commercetools cart to an order at this point

## Stored values

The following values are stored within commerce tools to allow later
verification that the payer was authenticated correctly

  - Responses to the enrolment check are stored on a payment interface interaction with a type key of `cybersource_payer_authentication_enrolment_check`

  - Responses to the authentication validation are stored on a payment interface interaction with a type key of `cybersource_payer_authentication_validate_result`

  - The request and response Cardinal JWTs are stored a custom properties on the payment

  - The paReq and acsUrl values are stored a custom properties on the payment
    
    ⚠️ **V1 paReq values can be decoded by Base64 decoding the string and then inflating the resulting bytes**
    
    ⚠️ **V2 paReq values can be decoded by Base64 decoding the string**

See [Commercetools Setup](Commercetools-Setup.md) for more details on the individual fields.

## Further reading

* [Cybersource Payer Authentication documentation](http://apps.cybersource.com/library/documentation/dev_guides/Payer_Authentication_SO_API/Payer_Authentication_SO_API.pdf)
* [Cardinal Cruise Hybrid Integration documentation](https://cardinaldocs.atlassian.net/wiki/spaces/CC/pages/360668/Cardinal+Cruise+Hybrid)

</div>

</div>

</div>

</div>