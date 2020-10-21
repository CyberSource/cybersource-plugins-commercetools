# Setup

# Getting Started With The Reference Application

The following section contains steps to get started with an generic
integration between commercetools and CyberSource using the provided
Spring Boot reference implementation.

## 0. Prerequisites

  - An installation of a Java Development Kit (JDK) version 11 (currently tested against the Zulu Community builds of OpenJDK: https://www.azul.com/downloads/zulu-community)

## 1. Create Access Keys

To allow access to both commercetools and CyberSource authorisation is
enabled via access keys supplied by the associative provider.

  - Commercetools API Keys can be created from within the commercetools
    Merchant Center. See [Key Creation](Key-Creation.md) for
    more details.
  - The ISV payments integration contains 3 touchpoints to support 3D
    Secure, Card Tokenisation and Payment processing. For more detail
    about how to setup these see [Key
    Creation](Key-Creation.md) for more details.
      - 3D Secure: Cardinal
      - Card Tokenisation: Shared Secret
      - Payment Process: Simple Order API Keys

## 2\. Extend Commercetools

Commercetools needs to be extended to support the interactions between
commercetools and CyberSource. The customisations are as follows:

  - API Extensions:
      - Create Payment Event
      - Update Payment Event
  - Data Model Changes:
      - Payment
      - Payment Interactions

The details of the specific customisations listed above is documented
here: [Commercetools Setup](Commercetools-Setup.md).

## 3\. Application Setup

Configuration of the application allows you to set the propertires
required for access to both commercetools and CyberSource. This includes
properties such as the commercetools project key and the CyberSource
merchant ID. For more information about what properties need to be set
and how they can be configure, please see [API Extension
Setup](API-Extension-Setup.md) for more details.

## 4\. Front-end Setup

The bulk of the integration work when using the ISV payments
commercetools extension is within the user-interface. This is because
commercetools does not come with a user-interface and therefore all
implementations will be different.

  - For setting up the client-side application to work with 3D Secure,
    use the following guide: [3D Secure
    Setup](3D-Secure-Setup.md)
  - For setting up the client-side application to work with Visa
    Checkout, use the following guide: [Visa Checkout
    Setup](Visa-Checkout-Setup.md)
