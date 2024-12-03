# API Extension Endpoints Authentication

All the endpoints in the extension are protected by Bearer or Basic authentication to ensure the requests are coming from a valid source.

The headerValue used at the time of creation of API extensions are used as a token for Bearer or Basic authentication and is validated against the value stored in the `PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE` of .env file. If the headerValue is not available at the time of validation or if the headerValue does't match the value stored in the `PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE` of .env file, the requests are rejected with `401` error code. The headerValue will be in encrypted form of Base 64 encode value of the pair username:password of your choice or Commercetools credentials. See [Commercetools Setup](Commercetools-Setup.md) for more details.

  `{baseUrl}`, `{baseUrl}/orders`, `{baseUrl}/decisionSync`, `{baseUrl}/sync` and `{baseUrl}/configureExtension` endpoints of the extension asks for username and password from a client on accessing for the first time. On submitting username and password, the authentication information is passed to the extension in an Authorization header. If correct value is provided, extension will not will not ask to authenticate furthermore for all the endpoints.

## Whitelisting Extension Endpoints

  The extension provides a feature of whitelisting endpoints to bypass an authentication on accessing the endpoints. In order to use this feature, the `PAYMENT_GATEWAY_WHITELIST_URLS` should be populated with a csv(comma separated value) of endpoints that required to be whitelisted. 

> **_NOTE:_** The network token endpoint cannot be whitelisted.