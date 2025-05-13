# Message Level Encryption

## Overview

Message Level Encryption (MLE) allows you to store information or to communicate with other parties while helping to prevent uninvolved parties from understanding the stored information or understanding the communication. MLE can help address the threat of relying on TLS for message security. SSL is designed to provide point-to-point security, which falls short for web/restful services because of a need for end-to-end security. Where multiple intermediary nodes could exist between the two endpoints, MLE would provide that the message remains encrypted, even during these intermediate "hops" where the traffic itself is decrypted before it arrives at Visa servers. Both processes involve a mathematical formula (algorithm) and secret data (key).

MLE is required for APIs that primarily deal with sensitive transaction data (financial/non-financial) which could fall into one or several of the following categories:

- PII (Personal Identification Information)
- PAN (Personal Account Number)
- PAI (Personal Account Information)

## Implementation

### Step 1: Generate a .p12 File

Go to the Business Center and generate a .p12 file. Follow the provided link to [Create a p12 File](https://developer.cybersource.com/docs/cybs/en-us/platform/developer/all/rest/rest-getting-started/restgs-jwt-message-intro/restgs-security-p12-intro/restgs-security-P12.html).

### Step 2: File Location

If you're storing the `.p12` file locally , make sure it's placed in the `src/certificates` folder within your project directory, so the plugin can access it.

### Step 3: Enable MLE in Your Configuration

Set the following environment variables to enable Message-Level Encryption (MLE):

- `PAYMENT_GATEWAY_USE_MLE` - Set to `True` to enable MLE.
- `PAYMENT_GATEWAY_KEY_FILE_NAME` - The name of your .p12 file (required if you are hosting the certificate locally).
- `PAYMENT_GATEWAY_KEY_FILE_URL` - The path to where the .p12 certificate is stored (required if you are hosting in the cloud).
- `PAYMENT_GATEWAY_KEY_PASS` - Password of the `.p12` file
- `PAYMENT_GATEWAY_KEY_ALIAS` -  Key alias (optional – use if overriding the default CyberSource alias).

## Step 4: Support for Multi-Mid

In this section, mid refers to Cybersource Merchant Id. 

The new mid configurations should be added in the .env file of the extension in the following format

      XXXX_KEY_FILE_NAME = <The name of your .p12 file>
      XXXX_KEY_FILE_URL = <The path to where the .p12 certificate is stored>
      XXXX_KEY_PASS = <Password of your `.p12` file>
      XXXX_KEY_ALIAS = <Value of a Overrided name>

Likewise you can configure, as many mids you want to support.

The value added for `PAYMENT_GATEWAY_KEY_FILE_NAME` and respective fields should be the default value in which transactions will be processed when Multi-Mid is not enabled.

 Following are the constraints to be followed when you want to support multiple mids in your extension instance.

      1. It is mandatory to provide the env variables for Multi-Mid in recommended format only.
      2. All env variables should be in block letters
      3. First part of the variable (XXXX) should be your Cybersource merchant Id in block letters
      4. Second part of the variable to store key file name should be _KEY_FILE_NAME
      5. Second part of the variable to store key file url should be _KEY_FILE_URL
      6. Second part of the variable to store key file password should be _KEY_PASS
      7. Second part of the variable to store key alias should be _KEY_ALIAS

Example :
  
Below is the env variables for the mid which has merchant Id as `merchantid123` 
      
      MERCHANTID123_KEY_FILE_NAME = <The name of your .p12 file>
      MERCHANTID123_KEY_FILE_URL = <The path to where the .p12 certificate is stored>
      MERCHANTID123_KEY_PASS = <Password of your `.p12` file>
      MERCHANTID123_KEY_ALIAS = <Value of a Overrided name>
