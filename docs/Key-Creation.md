<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

# Key Creation

</div>

<div id="content" class="view">

<div id="main-content" class="wiki-content group">

<div class="toc-macro rbtoc1581891563817">

  - [Commercetools](#Commercetools)
      - [Backend/Extension API
        Keys](#Backend/ExtensionAPIKeys)
      - [Frontend/UI API Key](#Frontend/UIAPIKey)
  - [Cybersource](#Cybersource)
      - [Cardinal](#Cardinal)
      - [Shared Secret](#SharedSecret)
      - [Simple Order API keys](#SimpleOrderAPIkeys)

</div>

# <a name="Commercetools"></a>Commercetools

## <a name="Backend/ExtensionAPIKeys"></a>Backend/Extension API Keys

The API Extension and the Synchronization Service require an API key
which will be used throughout the payments process. The scopes required
for this API key are:

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th>Scope</th>
<th>Reason</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>manage_payments</td>
<td><p>This is used for adding and updating transactions during synchronization process</p></td>
</tr>
<tr class="even">
<td>manage_orders</td>
<td><p>This is used for:</p>
<ul>
<li>Updating the cart with Billing and Shipping addresses while using Visa Checkout</li>
<li>Extracting Line Item data from the cart to send while using Decision Manager</li>
</ul></td>
</tr>
<tr class="odd">
<td>view_types</td>
<td>This is used to get the ID of the custom payment and payment interface interaction types on API Extension startup</td>
</tr>
</tbody>
</table>

</div>

## <a name="Frontend/UIAPIKey"></a>Frontend/UI API Key

To be used for frontend applications in order to create and manage
payments and carts for customers. The scopes for the API key used here
should be limited to the 'My' commercetools APIs to limit access a
client-side application has to the data in commercetools.

<div class="table-wrap">

| Scope                     | Reason                                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| view\_published\_products | Required to add items into the cart                                                            |
| manage\_my\_payments      | To allow payments to be created in commercetools to initiate the payment flow with CyberSource |
| manage\_my\_orders        | Adding Payments to an Order                                                                    |
| manage\_my\_profile       | Access to the current customers profile so it can be associated with the Payment and Order     |
| create\_anonymous\_token  | (optional) If you are using the key to control the customers session                           |

</div>

# <a name="Cybersource"></a>Cybersource

## <a name="Cardinal"></a>Cardinal

To enable payer authentication, you will need to store the credentials
supplied by Cybersource for Cardinal.

In the Cybersource Merchant Center, go to the following:

Payment Configuration → Payer Authentication Configuration

Store the values for "Org Unit ID", "API Identifier" and "API Key" as
described in the [API Extension
Setup](API-Extension-Setup.md) page.

## <a name="SharedSecret"></a>Shared Secret

Flex token generation uses a shared secret to generate one-time keys to
be used when encrypting the user's credit card details on the client
side. Set up a secret as per [this
guide](https://developer.cybersource.com/api/developer-guides/dita-flex/SAFlexibleToken/authentication/createSharedKey.html)<span> </span>and
store the values safely. These should be provided in the API Extension's
application.yaml as described in the [API Extension
Setup](API-Extension-Setup.md) page.

## <a name="SimpleOrderAPIkeys"></a>Simple Order API keys

Create a .p12 key by following chapter 1 of [this
guide](http://apps.cybersource.com/library/documentation/dev_guides/security_keys/creating_and_using_security_keys.pdfthis%20guide)<span> </span>and
download it to a directory accessible from where you deploy the
reference application. This file path should be provided in the API
Extension's application.yaml as described in the [API Extension
Setup](API-Extension-Setup.md) page.

</div>

</div>

</div>

</div>