# Commercetools Cybersource Plugin

Commercetools Cybersource plugin provides payment services based integration between the Commercetools and Cybersource PSP.

- [Supported features](#supported-features)
- [Overview](#overview)
  - [Plugin](#plugin)


## Supported features
- Cybersource based payment methods like Credit Card, 3D Secure, Visa Click to Pay, Google Pay & Apple Pay.
- [Tokenization](./docs/Tokenization.md) to create, update and delete a card token.
- [Refunding](./docs/Refund-a-Payment.md) a payment back to the merchant.
- Authorization [Cancellation](./docs/Reverse-a-Payment.md) on a payment that has not yet been captured.
- [Manual capture](./docs/Capture-a-Payment.md) of a payment.
- [Synchronize payments](./docs/Synchronizing-Payments.md) for synchronizing the missing transactions and fraud transactions based on the decision taken by the merchant.

## Overview
This repository contains one standalone module that interact with Commercetools and Cybersource.
 

![Architecture](./docs/images/High-Level-Architecture.svg)

1. Front end can be any module which is supported by Commercetools. Refer [create payment](./docs/Creating-a-Payment.md) to know more about the fields that needs to be passed when a payment is created for each of the payment method.
2. With help of the [Commercetools HTTP API Extensions](https://docs.commercetools.com/http-api-projects-api-extensions), provided payment data is sent to the plugin.
3. The plugin authenticates and  processes provided payload passed by the front end, exchanges it with Cybersource API, and provides **Synchronous** response back to the Commercetools caller. Based on the result, front end either creates an order or continues with further payment steps. 
Note that order creations or modifications should be part of the front end business logic.

Please see the [Overview](./docs/Overview.md) for a high-level overview of the plugin.

## Plugin 

The plugin is a publicly exposed service that acts as a middleware between the Commercetools platform and Cybersource. Once [Commercetools HTTP API Extensions](https://docs.commercetools.com/http-api-projects-api-extensions) is [configured](./docs/API-Extension-Setup.md#a-namerunningscriptarunning-extension-setup-script) to call Cybersource plugin, for every payment create or update request and customer update request, a Cybersource plugin will be remotely called by the Commercetools platform. 

- Follow [Setup Guide](./docs/Setup.md) for getting started with the integration of Commercetools with the plugin.
- Follow [Usage Guide](./docs/Usage.md) to see more information about the payment services.
