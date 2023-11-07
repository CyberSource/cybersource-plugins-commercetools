# Flex Microform Integration

Microform Integration replaces the primary account number (PAN) or card verification number (CVN) field or both in your payment input form.

## Setting Up the Client Side

- Add the Microform Integration JavaScript library to your page by loading it directly from Cybersource and this can be achieved dynamically per environment by using the asset path returned in the JWT (JSON Web Token).

        ctx": [
            {
            "data": {
            "clientLibrary": https://testflex.cybersource.com/microform/bundle/v2/flex-microform.min.js
            ...

  a. For Test Environment:

        <script src="https://testflex.cybersource.com/microform/bundle/v2/flex-microform.min.js"></script>

  b. For Production Environment:

        <script src="https://flex.cybersource.com/microform/bundle/v2/flex-microform.min.js"></script>

- Create the HTML placeholder objects to attach to the microforms.

        <div id="numbercontainer" class="form-control"></div>

- Invoke the Flex SDK by passing the Capture Context that was generated in the Payment create call.

        var flex = new Flex(captureContext);

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

Once the microform integration v2 is setup, you can continue to the [Process a Payment with CC(Without Payer Authentication)](Process-a-Payment-for-CC-Without-Payer-Authentication.md) or [Process a Payment with CC(With Payer Authentication)](Process-a-Payment-for-CC-With-Payer-Authentication.md) process.

**_NOTE:_** For more details, refer [Microform Integration v2 Cybersource Documentation](https://developer.cybersource.com/content/dam/docs/cybs/en-us/digital-accept-flex/developer/all/rest/digital-accept-flex.pdf).