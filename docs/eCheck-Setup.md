# eCheck Setup

## eCheck

If you would like to support eCheck, you need to register with one of these processors.

- Chase Paymentech Solutions
- Cybersource ACH Service
- TeleCheck

## Legal Compliance Text

Once you have registered with any of the processors above, to proceed with eCheck you might display the legal compliance text for Internet Check Acceptance Authorization. See the [Electronic Check services](https://developer.cybersource.com/api/soap-developer-guides/dita-payments/intro.html) document from the Cybersource Developer center.

The FO checkout page has to be done with the setup to get the following information from the customer
| Field             | Notes                                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Account Number   | Valid customer account number with maximum possible length 17 and does not include any special characters and alphabets                                                                                                                             |
| Account Type     | Type of the account. Max length is 1 <ul> <li>C: Checking</li><li>S: Savings (U.S. dollars only)</li><li>X: Corporate checking (U.S. dollars only)</li></ul> |
| Routing Number         | Bank routing number. Also called the transit number. Maximum length is 9                                                                                            |



Once the front office setup is ready to pass the required information for eCheck processing, you can continue to [Process a Payment (eCheck)](Process-a-Payment-eCheck.md) process.
