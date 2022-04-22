# Visa Click to Pay Setup

## Visa Click to Pay

If you would like to support Visa Click to Pay, you will need to create a
Visa Click to Pay API Key and use the Visa Click to Pay Javascript SDK to
generate a "Visa Click to Pay Order Id" to provide it to Cybersource on a payment
request.

### Visa Click to Pay API Key

If you would like to implement Visa Click to Pay, you will need to generate a Visa Click to Pay API Key.

In the Cybersource Merchant Center, go to the following:

Payment Configuration → Digital Payment Solutions

Select the 'Visa Checkout' option, and enable this for your merchant account. Do not select to show PAN data in responses. Download the API key and store this value safely.

## Visa Click to Pay JS SDK Setup

Once you have the Visa Click to Pay API Key, setup of Visa Click to Pay is quite simple:

See the [How To Use Visa Checkout](https://developer.visa.com/capabilities/visa_checkout/docs-how-to) document from the Visa Developer center.

Note that with Visa Checkout you can optionally request shipping address information:

    V.init({
    	//...
    	settings: {
    	  shipping: {
    	    collectShipping: "true",
    	    acceptedRegions: ["GB"]
    	  }
    	}
    });

If you configure Visa Click to Pay to collect shipping addresses, then the shipping address will be saved onto the cart on a successful authorization. Otherwise, you will need to manually collect the shipping address information and save it onto the cart before processing a payment.

Once the SDK is configured and you are recieving a Visa Click to Pay order Id, you can continue to the [Authorize a Payment (Visa Click to Pay)](Authorize-a-Payment-Visa-Checkout.md) process.
