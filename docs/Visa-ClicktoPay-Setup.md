# Visa Click to Pay Setup

## Visa Click to Pay

If you would like to support Visa Click to Pay, use the Visa Click to Pay Javascript SDK to generate a `Visa Click to Pay Order Id` to provide it to Cybersource on a payment request.

### Visa Click to Pay API Key

For implementing Visa Click to Pay, you need to generate a Visa Click to Pay API Key.

In the Cybersource Merchant Center, go to the following:

Payment Configuration → Digital Payment Solutions

Select the `Visa Checkout` option and enable for your merchant account. Do not select to show PAN data in responses. Download the API key and store this value safely.

## Visa Click to Pay JS SDK Setup

Once you have the Visa Click to Pay API Key, setting up of Visa Click to Pay is quite simple:

See the [How To Use Visa Checkout](https://developer.visa.com/capabilities/visa_checkout/docs-how-to) document from the Visa Developer center.

Note that with Visa Checkout, you can optionally request shipping address information:

    V.init({
    	//...
    	settings: {
    	  shipping: {
    	    collectShipping: "true",
    	    acceptedRegions: ["GB"]
    	  }
    	}
    });

If you configure Visa Click to Pay to collect shipping addresses, then the shipping address will be saved onto the cart on a successful authorization. Otherwise, you need to collect the shipping address information manually and save it to the cart before processing a payment.

Once the SDK is configured and you are receiving a Visa Click to Pay order Id, you can continue to the [Process a Payment (Visa Click to Pay)](Process-a-Payment-ClicktoPay.md) process.