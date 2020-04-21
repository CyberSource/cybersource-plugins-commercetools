<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

# Visa Checkout Setup

</div>

<div id="content" class="view">

<div id="main-content" class="wiki-content group">

## Visa Checkout

If you would like to support VISA Checkout, you will need to create a
Visa Checkout API Key and use the Visa Checkout Javascript SDK to
generate a Visa Checkout Order ID to provide to Cybersource on a payment
request.

### Visa Checkout API Key

If you would like to implement Visa Checkout, you will need to generate a Visa Checkout API Key.

In the Cybersource Merchant Center, go to the following:

Payment Configuration → Digital Payment Solutions

Select the 'Visa Checkout' option, and enable this for your merchant account. Do not select to show PAN data in responses. Download the API key and store this value safely. 

## Visa Checkout JS SDK Setup

Once you have the Visa Checkout API Key, setup of Visa Checkout is quite simple:

See the [How To Use Visa Checkout](https://developer.visa.com/capabilities/visa_checkout/docs-how-to) document from the Visa Developer center.

Note that with Visa Checkout you can optionally request shipping address information:

```javascript
V.init({
	//...
	settings: {
	  shipping: {
	    collectShipping: "true",
	    acceptedRegions: ["GB"]
	  }
	}
});
```

If you configure Visa Checkout to collect shipping addresses, then the shipping address will be saved onto the cart on a successful authorization. Otherwise, you will need to manually collect the shipping address information and save it onto the cart before processing a payment.

Once the SDK is configured and you are recieving a Visa Checkout order ID, you can continue to the [Authorize a Payment (Visa Checkout)](Authorize-a-Payment-Visa-Checkout.md) process.

</div>

</div>

</div>

</div>