# Setup

# Getting Started With The Commercetools Cybersource Plugin

The following section contains steps to get started with a generic integration between Commercetools and Cybersource using the typescript plugin.

## Prerequisites

- An installation of node JS is required before running the application.

## 1. Create Access Keys

To allow access to both Commercetools and Cybersource authorization is
enabled via access keys supplied by the associative provider.

- Commercetools API Keys can be created from within the Commercetools
  Merchant Center. See [Key Creation](Key-Creation.md) for
  more details
- The Cybersource integration supports Card Tokenization and Payment processing. For more detail about how to setup these see [REST Shared Secret](Key-Creation.md#a-namerestsharedsecretarest-shared-secret) for more details.


## 2. Application Setup

Configuration of the Plugin allows you to set the properties required for access to both Commercetools and Cybersource. This includes properties such as the Commercetools project key and the Cybersource merchant Id. For more information about what properties need to be set and how they can be configured, see [API Extension Setup](API-Extension-Setup.md).
## 3. Extend Commercetools

Commercetools needs to be extended to support the interactions between
Commercetools and Cybersource. The customizations are as follows:

- API Extensions:
  - Create Payment Event
  - Update Payment Event
  - Update Customer Event
- Data Model Changes:
  - Payment Interactions

The details of the specific customizations listed above is documented in [Commercetools Setup](Commercetools-Setup.md). This step should be completed by referring [Creating API Extensions and Customizations](./Commercetools-Setup.md#a-nameapiextensionsacreating-api-extensions-and-customizations). 



## 4. Front-end Setup

The bulk of the integration work when using the Commercetools Cybersource plugin
is within the user-interface. This is because
Commercetools does not come with a user-interface and therefore all
implementations will be different.

- For setting up the client-side application to work with Visa
  Click to Pay, use the following guide: [Visa Click to Pay Setup](Visa-ClicktoPay-Setup.md)
- For setting up the client-side application to work with Google
  Pay, use the following guide: [Google Pay Setup](GooglePay-Setup.md)
- For setting up the client-side application to work with Apple
  Pay, use the following guide: [Apple Pay Setup](ApplePay-Setup.md)
