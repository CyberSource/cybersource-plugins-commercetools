# Google Pay Setup

## Google Pay

If you would like to support Google Pay, you will need to have a Google Pay merchant Id and use the Google Pay Javascript to generate a Google Pay Payment Token to provide to Cybersource on a payment request.

### Google Pay Merchant Id

If you would like to implement Google Pay, you will need to create a Google Pay merchant Id.

Before creating a Google Pay Merchant Id, you need to register with Google Pay API.

Registration with the Google Pay API requires that your email address must be associated with a Google account, and preferably a business email associated with your business domain, such as "admin@myownpersonaldomain.com". Select Use my current email address instead in the Google account creation flow to associate your email with a Google account.

    Use the data received from the Google Pay API only to process transactions. All other use cases require a separate, express consent from the user.
    Confirm the card networks and card authentication methods that are accepted by your payment processor in your country.

After your website is approved, you receive a Google Pay merchant Id that must be included with each Google Pay API request.

## Google Pay API Setup

Once you have the merchant Id, setup of Google Pay is quite simple:

See the [Overview, Setup & Tutorial](https://developers.google.com/pay/api/web/overview) document from the Google Pay Developer center.

You can also refer to [this guide](https://docs.cybersource.com/content/dam/new-documentation/documentation/en/google-pay/smartpay/rest/googlepay-rest-smartpay.pdf) for more details of integrating Google Pay

Once the API is setup and you are recieving a Google Pay Payment Token, you can continue to the [Process a Payment (GooglePay)](Process-a-Payment-GooglePay.md) process.
