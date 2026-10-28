# Key Creation

- [Commercetools](#commercetools)
- [Visa Acceptance Solutions Extension API Keys](#visa-acceptance-solutions-extension-api-keys)
- [Frontend API Key](#frontend-api-key)
- [Visa Acceptance Solutions](#visa-acceptance-solutions)
- [REST Shared Secret](#rest-shared-secret)
- [Message-Level Encryption (MLE) Keys](#message-level-encryption-mle-keys)

# Commercetools

## Visa Acceptance Solutions Extension API Keys

The API Extension and the Synchronization Service requires an API key which will be used throughout the payments process. The scopes required for this API key are:

| Scope             | Reason                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| manage_payments   | Adding and updating transactions during synchronization process                                                                                   |
| manage_orders     | <ul> <li>Updating the cart with Billing and Shipping addresses while using Visa Click to Pay</li><li>Extracting line item data from the cart</ul> |
| manage_customers  | It is required for updating the customer for saved card tokens                                                                                    |
| manage_types      | Creating custom types required to process payments and saved card tokens                                                                          |
| manage_extensions | Extending payment create, update and customer update APIs                                                                                         |
| view_types        | To get the Id of the custom payment and payment interface interaction types on API Extension startup                                              |
| view_customer     | For viewing the customer created and dealing with their custom data                                                                               |

## Frontend API Key

To be used for frontend applications in order to create and manage payments and carts for customers. The scopes for the API key used here should be limited to the 'My' Commercetools APIs to limit access a client-side application has to the data in Commercetools.

| Scope                   | Reason                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| view_published_products | Adding items into the cart                                                                                   |
| view_orders             | To view orders                                                                                               |
| view_categories         | To view product categories                                                                                   |
| manage_customers        | To update or delete saved cards                                                                              |
| manage_my_payments      | To allow payments to be created in Commercetools to initiate the payment flow with Visa Acceptance Solutions |
| manage_my_orders        | Adding Payments to the Order                                                                                 |
| manage_my_profile       | Access to the current customers profile so it can be associated with the Payment and Order                   |
| create_anonymous_token  | (optional) If you are using the key to control the customers session                                         |

# Visa Acceptance Solutions

## REST Shared Secret

Flex token generation uses a shared secret to generate one-time keys to encrypt the user's Card details on the client side and JWT with SHARED SECRET authentication for Visa Acceptance Solutions REST API services. Set up a Shared Secret as per [this guide](https://developer.visaacceptance.com/docs/vas/en-us/platform/developer/all/rest/rest-getting-started/restgs-jwt-shared-secret-intro/restgs-shared-secret-create-intro.html)<span> </span>and store the values safely. These should be provided in the API Extension's .env file as described in the [API Extension Setup](API-Extension-Setup.md#configuration) page.

## Message-Level Encryption (MLE) Keys

Message-Level Encryption uses a `.p12` certificate to encrypt requests and decrypt responses. Refer to [Message-Level Encryption](Message-Level-Encryption.md) to create the `.p12` file and configure the required environment variables.
