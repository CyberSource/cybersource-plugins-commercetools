# Message Level Encryption

## Overview

Message Level Encryption (MLE) allows you to store information or to communicate with other parties while helping to prevent uninvolved parties from understanding the stored information or understanding the communication. MLE can help address the threat of relying on TLS for message security. SSL is designed to provide point-to-point security, which falls short for web/restful services because of a need for end-to-end security. Where multiple intermediary nodes could exist between the two endpoints, MLE would provide that the message remains encrypted, even during these intermediate "hops" where the traffic itself is decrypted before it arrives at Visa servers. Both processes involve a mathematical formula (algorithm) and secret data (key).

MLE is required for APIs that primarily deal with sensitive transaction data (financial/non-financial) which could fall into one or several of the following categories:

- PII (Personal Identification Information)
- PAN (Personal Account Number)
- PAI (Personal Account Information)

## Implementation

### Step 1: Generate a .p12 File

Go to the Business Center and generate a .p12 file. Follow the provided link to [Create a p12 File](https://developer.cybersource.com/docs/cybs/en-us/security-keys/user/all/ada/security-keys/keys-manage/keys-rest-mle-intro/keys-mle-response-task.html).

### Step 2: File Location

If you're storing the `.p12` file locally , make sure it's placed in the `src/certificates` folder within your project directory, so the plugin can access it. If the certificate is hosted in cloud, provide its URL using the `PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_URL` environment variable to allow the plugin to download it.

### Step 3: Enable MLE in Your Configuration

a. Set the following environment variables for Request Message-Level Encryption (MLE):

- `PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_FILE` - The name of your .p12 file (required if you are hosting the certificate locally).
- `PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_URL` - The path to where the .p12 certificate is stored (required if you are hosting in the cloud).
- `PAYMENT_GATEWAY_REQUEST_MLE_P12_PASSWORD` - Password of the `.p12` file

b. Set the following environment variables for Response Message-Level Encryption (MLE):

- `PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED` - To enable response MLE
- `PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE` - The name of your .p12 file (required if you are hosting the certificate locally).
- `PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_URL` - The path to where the .p12 certificate is stored (required if you are hosting in the cloud).
- `PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD` - Password of the `.p12` file

## Step 4: Support for Multi-Mid

In this section, mid refers to Visa Acceptance Solutions Merchant Id.

a. For Request Message-Level Encryption (MLE) the new mid configurations should be added in the .env file of the extension in the following format

      XXXX_REQUEST_MLE_PUBLIC_CERT_FILE = <The name of your .p12 file>
      XXXX_REQUEST_MLE_PUBLIC_CERT_URL = <The path to where the .p12 certificate is stored>
      XXXX_REQUEST_MLE_P12_PASSWORD = <Password of your `.p12` file>

b. For Response Message-Level Encryption (MLE) the new mid configurations should be added in the .env file of the extension in the following format

      XXXX_RESPONSE_MLE_PRIVATE_KEY_FILE = <The name of your .p12 file>
      XXXX_RESPONSE_MLE_PRIVATE_KEY_URL = <The path to where the .p12 certificate is stored>
      XXXX_RESPONSE_MLE_PRIVATE_KEY_PASSWORD = <Password of your `.p12` file>

Likewise you can configure, as many mids you want to support.

The value added for `PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_FILE` and respective fields should be the default value in which transactions will be processed when Multi-Mid is not enabled.

Following are the constraints to be followed when you want to support multiple mids in your extension instance.

      1. It is mandatory to provide the env variables for Multi-Mid in recommended format only.
      2. All env variables should be in block letters
      3. First part of the variable (XXXX) should be your Visa Acceptance Solutions merchant Id in block letters
      4. Second part of the variable to store key file name should be _REQUEST_MLE_PUBLIC_CERT_FILE
      5. Second part of the variable to store key file url should be _RESPONSE_MLE_PRIVATE_KEY_URL
      6. Second part of the variable to store key file password should be _RESPONSE_MLE_PRIVATE_KEY_PASSWORD

Example :

Below is the env variables for the mid which has merchant Id as `merchantid123`

      MERCHANTID123_REQUEST_MLE_PUBLIC_CERT_FILE = <The name of your .p12 file>
      MERCHANTID123_RESPONSE_MLE_PRIVATE_KEY_URL = <The path to where the .p12 certificate is stored>
      MERCHANTID123_RESPONSE_MLE_PRIVATE_KEY_PASSWORD = <Password of your `.p12` file>
      MERCHANTID123_RESPONSE_MLE_PRIVATE_KEY_FILE = <The name of your .p12 file>
      MERCHANTID123_RESPONSE_MLE_PRIVATE_KEY_URL = <The path to where the .p12 certificate is stored>
      MERCHANTID123_RESPONSE_MLE_PRIVATE_KEY_PASSWORD = <Password of your `.p12` file>
