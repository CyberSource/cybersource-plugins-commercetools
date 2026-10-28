# Setup

# Getting Started With The Visa Acceptance Solutions-Commercetools Extension

The following section contains steps to get started with a generic integration between Commercetools and Visa Acceptance Solutions using the typescript extension.

## Extension Upgrade

If you are using old version of extension, replace your module with the latest version.

## Prerequisites

- An installation of node JS is required before running the application.

## 1. Create Access Keys

To allow access to both Commercetools and Visa Acceptance Solutions, authorization is enabled via access keys supplied by the associative provider.

- Commercetools API Keys can be created from within the Commercetools
  Merchant Center. See [Key Creation](Key-Creation.md#commercetools) for
  more details
- The Visa Acceptance Solutions integration supports Card Tokenization and Payment processing. For more detail
  about how to setup these, see [Key Creation](Key-Creation.md#Visa Acceptance Solutions) for more details.
  - Card Tokenization & Payment Process: REST Shared Secret

## 2. Application Setup

Configuration of the Extension allows you to set the properties required for access to both Commercetools and Visa Acceptance Solutions. This includes properties such as the Commercetools project key and the Visa Acceptance Solutions merchant Id. For more information about what properties need to be set and how they can be configured, see [API Extension Setup](API-Extension-Setup.md#configuration) for more details.

## 3. Extend Commercetools

Commercetools needs to be extended to support the interactions between
Commercetools and Visa Acceptance Solutions. The customizations are as follows:

- API Extensions:
  - Create Payment Event
  - Update Payment Event
  - Update Customer Event
- Data Model Changes:
  - Payment Interactions

The details of the specific customizations listed above is documented here: [Commercetools Setup](Commercetools-Setup.md#api-extension-setup).

## 4. Front-end Setup

The bulk of integration works when using the Visa Acceptance Solutions-Commercetools Extension is within the user-interface. This is because Commercetools does not come with a user-interface and therefore all implementations will be different.
