# API Extension Endpoints Authentication

All the endpoints in the plugin are protected by Bearer authentication to ensure the requests are coming from a valid source.

The headerValue used at the time of creation of API extensions are used as a token for Bearer authentication and is validated against the value stored in the PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE of .env file. If the headerValue is not available at the time of validation or if the headerValue does't match the value stored in the PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE of  .env file, the requests are rejected with `401` error code. The headerValue will be the Base 64 encode value of the pair username:password of your choice or Comercetools credentails. See [Commercetools Setup](Commercetools-Setup.md) for more details.

All the UI pages of the plugin asks for username and password from a client on accessing. On submitting username and passowrd, the authentication information is passed to the plugin in an Authorization header.