# Unified Checkout

Unified Checkout provides a single interface with which you can accept numerous types of digital payments.

## Unified Checkout Processing Sequence Diagram

![Unified Checkout Processing flow](./Flow-Diagram-UnifiedCheckout.svg)


## Setting Up the Client Side

- To obtain the `captureContextData`, `clientLibrary`, and `clientLibraryIntegrity`, you must first generate an authentication header. This is accomplished by sending a `GET` request to `{baseUrl}/generateHeader` and using the response to include the required authentication header for subsequent requests.

- Once the header is generated, send a `GET` request to `{baseUrl}/captureContext`, ensuring that the request includes the previously generated authentication header. The response will contain the `captureContextData` provided by CyberSource.

- The `captureContextData` is decoded to extract the `clientLibrary` and `clientLibraryIntegrity` fields.

- A sample response typically contains the `captureContextData`, `clientLibrary`, and `clientLibraryIntegrity` fields in JSON format, as shown below.

    Example Response:

        {
          "captureContextData": "xxxx",
          "clientLibrary": "xxxx",
          "clientLibraryIntegrity": "xxxx"
        }

- Use the `clientLibrary` and `clientLibraryIntegrity` values from the capture context response to invoke Unified Checkout on your page.

    When you load the library, use the capture context obtained from the GET request to `{baseUrl}/captureContext` as a parameter for invoking the accept function.

    Example: Initializing the SDK

        <script src="[INSERT clientLibrary VALUE HERE]" integrity="[INSERT clientLibraryIntegrity VALUE HERE]" crossorigin="anonymous"></script>
        <script>
        Accept('header.payload.signature').then(function(accept) {
        // use accept object
        });
        </script>

    header.payload.signature refers to the `captureContextData`.


- Adding the Payment Application and Payment Acceptance

    After you initialize the Unified Checkout object, you can add the payment application and payment acceptance pages to your webpage. You can attach the Unified Checkout embedded tool and payment acceptance pages to any named element within your HTML. Typically, they are attached to explicit named `<div>` components that are replaced with Unified Checkout’s iframes.

  Example Setting Up with Full Sidebar:

        var authForm = document.getElementById("authForm");
        var transientToken = document.getElementById("transientToken");
        var showArgs = {
         containers: {
          paymentSelection: "#buttonPaymentListContainer"
        }
        };
        Accept(captureContextData)
         .then(function(accept) {
         return accept.unifiedPayments();
         })
         .then(function(up) {
         return up.show(showArgs);
         })
         .then(function(tt) {
         transientToken.value = tt;
         authForm.submit();
         });

  Example Setting Up with the Embedded Component:
    
    The main difference between using an embedded component and the sidebar is that the accept.unifiedPayments object is set to false, and the location of the payment screen is passed in the containers argument.

        var authForm = document.getElementById("authForm");
        var transientToken = document.getElementById("transientToken");
        var showArgs = {
         containers: {
          paymentSelection: "#buttonPaymentListContainer",
          paymentScreen: "#embeddedPaymentContainer"
         }
        };
        Accept(captureContextData)
         .then(function(accept) {
         // Gets the UC instance (e.g. what card brands I requested, any address information I pre-filled etc.)
         return accept.unifiedPayments(false);
         })
         .then(function(up) {
         // Display the UC instance
         return up.show(showArgs);
         })
        .then(function(tt) {
        // Return transient token from UC's UI to our app
        transientToken.value = tt;
        authForm.submit();
        }).catch(function(error) {
        //merchant logic for handling issues
        alert("something went wrong");
        });

## Decoding transient token

The response to a successful customer interaction with Unified Checkout is a transient token. The transient token is a reference to the payment data collected on your behalf. Tokens allow secure card payments to occur without risk of exposure to sensitive payment information. The transient token is issued as a JSON Web Token (JWT).When decoded, you can obtain the payment solution value from transientToken.content.processingInformation.paymentSolution.value. The payment solution values correspond to the following payment methods:

| Payment Solution value | Payment Method     
| -------- | ------------------- | 
| 012     | googlePay              |                                       
| 027    |  clickToPay            |                                       
| Default   | creditCard or creditCardWithPayerAuthentication (depending on the payerAuth flag) | 


**_NOTE:_** For more details, refer [Unified Checkout Cybersource Documentation](https://developer.cybersource.com/docs/cybs/en-us/digital-accept-flex/developer/all/rest/digital-accept-flex/uc-intro.html).
