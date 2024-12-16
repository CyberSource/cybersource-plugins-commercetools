# Test Connection

## Overview

Test Connection uses the [Cybersource Transaction Search API](https://developer.cybersource.com/docs/cybs/en-us/txn-search/developer/all/rest/txn-search/txn-search-intro.html) to send request and verify configuration.

This process ensures that:

- The credentials configured in the environment file are correct before proceeding with other services.
- A success message is returned if the configuration is correct.


## Implementation

### To Test your connection

1. You can run the following npm script from the root directory of the extension:

       npm run test-connection

2. Alternatively, Send a `GET` request to `{baseUrl}/testConnection`. Ensure that your environment variables (env file) are correctly configured to receive a successful response.
    - The baseUrl will depend on where the extension is deployed.
    - Use HTTPS for production environments to ensure secure communication.


> **_NOTE:_** Test Connection endpoint can be called for maximum of 10 times per minute.



