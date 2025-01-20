# Microform Integration

Microform Integration replaces the primary account number (PAN) or card verification number (CVN) field or both in your payment input form.

## Setting Up the Client Side

- Add the Microform Integration JavaScript library to your page by loading it directly using the clientLibrary and clientLibraryIntegrity values provided in the isv_clientLibrary and isv_clientLibraryIntegrity custom fields from the Payment Create call.

        <script src="[INSERT isv_clientLibrary VALUE HERE]" integrity="[INSERT isv_clientLibraryIntegrity VALUE HERE]" crossorigin="anonymous"></script>

- Create the HTML placeholder objects to attach to the microforms.

        <div id="number-container" class="form-control"></div>

- Invoke the Flex SDK by passing the Capture Context from isv_tokenCaptureContextSignature custom field from the Payment create call.

        var flex = new Flex(isv_tokenCaptureContextSignature);

- Initiate the microform object with styling to match your web page.

        var microform = flex.microform({ styles: myStyles });

- Create and attach the microform fields to the HTML objects through the Microform Integration JavaScript library.

  Example:

        var number = microform.createField('number', { placeholder: 'Enter card number' });
        var securityCode = microform.createField('securityCode', { placeholder: '•••' });
        number.load('#number-container');
        securityCode.load('#securityCode-container');

- Create a function for the customer to submit their payment information and invoke the
  tokenization request to Microform Integration for the transient token

Once the microform integration v2 is setup, you can continue to the [Process a Card Payment Without Payer Authentication](Process-a-Card-Payment-Without-Payer-Authentication.md) or [Process a Payment a Card Payment With Payer Authentication](Process-a-Card-Payment-With-Payer-Authentication.md) process.

**_NOTE:_** For more details, refer [Microform Integration v2 Cybersource Documentation](https://developer.cybersource.com/docs/cybs/en-us/digital-accept-flex/developer/all/rest/digital-accept-flex/microform-integ-v2.html).