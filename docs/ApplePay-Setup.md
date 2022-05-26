# Apple Pay Setup

## Apple Pay

If you would like to support Apple Pay, you will need to have an Apple Pay merchant id and Apple Pay JS to request the encrypted payment data from Apple to Cybersource on a payment request.

## Requirements for Using Apple Pay

In order to use the Cybersource platform to process Apple Pay transactions, one must have:

    1. A Cybersource account (If you do not already have a Cybersource account, contact your local Cybersource sales
    representative)

    2. A merchant account with a supported processor

    3. An Admin or Team Agent user of the Apple Pay Developer account

### Enrolling in Apple Pay

See [Enrolling in Apple Pay](https://docs.cybersource.com/content/dam/new-documentation/documentation/en/apple-pay/smartpay/rest/applepay-rest-smartpay.pdf) to register Apple Pay merchant id and generate CSR in Cybersource merchant center.

## Apple Pay Setup

If you would like to implement Apple Pay, you will need to first create a merchant identifier, then enable Apple Pay and create a payment processing certificate. See [Configuring Your Environment](https://developer.apple.com/documentation/apple_pay_on_the_web/configuring_your_environment) to configure merchant id and certificates, register and verify your domain.

See the [Apple Pay JS API](https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api) document from the Apple Pay developer center to setup Apple Pay on your browser.

See the [PassKit (Apple Pay and Wallet)](https://developer.apple.com/documentation/passkit) document from the Apple Pay developer center to setup Apple Pay in your App.

Once the Apple Pay is setup and you are receiving an Apple Pay Payment Token, you can continue to the [Process a Payment (Apple Pay)](Process-a-Payment-ApplePay.md) process.
