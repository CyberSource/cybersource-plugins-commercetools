# Decision Manager

## Field mapping

Fields which are used by Decision Manager are mapped from Commercetools fields as follows

<table>
<thead>
<tr class="header">
<th>Resource</th>
<th>Field name</th>
<th>Cybersource field</th>
<th>Notes</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>cart.shippingAddress</td>
<td>firstName</td>
<td>shipTo_firstName</td>
<td><br />
</td>
</tr>
<tr class="even">
<td>cart.shippingAddress</td>
<td>lastName</td>
<td>shipTo_lastName</td>
<td><br />
</td>
</tr>
<tr class="odd">
<td>cart.shippingAddress</td>
<td>streetNumber and streetName</td>
<td>shipTo_address1</td>
<td>If both fields have values they are concatenated with a space. Otherwise the value of the defined field is used</td>
</tr>
<tr class="even">
<td>cart.shippingAddress</td>
<td>city</td>
<td>shipTo_city</td>
<td><br />
</td>
</tr>
<tr class="odd">
<td>cart.shippingAddress</td>
<td>postalCode</td>
<td>shipTo_postalCode</td>
<td><br />
</td>
</tr>
<tr class="even">
<td>cart.shippingAddress</td>
<td>region</td>
<td>shipTo_state</td>
<td><br />
</td>
</tr>
<tr class="odd">
<td>cart.shippingAddress</td>
<td>country</td>
<td>shipTo_country</td>
<td>2 letter ISO code</td>
</tr>
<tr class="even">
<td>cart.lineItem[#]</td>
<td>quantity</td>
<td>item_#_quantity</td>
<td>Each line item in the cart is mapped</td>
</tr>
<tr class="odd">
<td>cart.lineItem[#]</td>
<td>totalPrice</td>
<td>item_#_unitPrice</td>
<td><br />
</td>
</tr>
<tr class="even">
<td>cart.lineItem[#]</td>
<td>name</td>
<td>item_#_productName</td>
<td>Name is a localise string property. We use the cart locale to decide which value to extract</td>
</tr>
<tr class="odd">
<td>cart.lineItem[#]</td>
<td>variant.sku</td>
<td>item_#_productSKU</td>
<td><br />
</td>
</tr>
<tr class="even">
<td>payment</td>
<td>isv_deviceFingerprintId</td>
<td>deviceInformation_fingerprintSessionId</td>
<td><br />
</td>
</tr>
</tbody>
</table>

### Device fingerprinting

Follow the appropriate Cybersource guide for device fingerprinting and add the session id used for this to the Commercetools payment as a custom field called `isv_deviceFingerprintId`. Refer process a payment document for respective payment method to know more.


### Enabling/disabling decision manager for specific payments

The Cybersource Plugin has environment variable for decision manager as PAYMENT_GATEWAY_DECISION_MANAGER, you can set the values to true or false to enable or disable decision manager

> **_NOTE:_** This field is case sensitive

## Optional fields

To pass additional data to Decision Manager it is possible to customize your Commercetools resources to add extra fields. If these fields exist and there are values present for these then the plugin will pass the values on to Cybersource in the appropriate request

<table>
<thead>
<tr class="header">
<th>Resource</th>
<th>Field name</th>
<th>Cybersource field</th>
<th>Notes</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>payment</td>
<td>isv_customerIpAddress</td>
<td>deviceInformation_ipAddress</td>
<td><br />
</td>
</tbody>
</table>

### Sample definitions

#### Payment

The following is an example of field definitions for the customer IP address and a single merchant defined field. They would need to be added to the base field definitions and any other payment customizations you may already have

    {
      "fieldDefinitions": [
        {
          "type": {
            "name": "String"
          },
          "name": "isv_customerIpAddress",
          "label": {
            "en": "Customer IP address"
          },
          "required": false
        }
      ],
      "key": "isv_payment_data",
      "name": {
        "en": "ISV payment service custom payment fields"
      },
      "resourceTypeIds": [
        "payment"
      ]
    }

## Test settings

To support testing Decision Manager responses it is necessary to configure Decision Manager in EBC. This allows triggering of particular responses by matching line 1 of the billing address

- In Decision Manager → Configuration → Extended Settings enable
  Decision Manager for Authorization
  - Also ensure the reply flags are set to DREVIEW and DREJECT
  - If you need EBC to trigger Authorization Reversal automatically during Reject After Auth cases, make sure that you check the checkbox under Decision Manager->Configuration->Extended Settings to enable it. Otherwise, plugin will automatically trigger Authorization Reversal
  - When Sale transaction is in review state, before reviewing it navigate to Decision Manager->Configuration->Extended Settings and make sure to select the "Enable Settlement With Selected" for payment processing. And while accepting the order, always make sure that settle checkbox is checked and the amount being settled matches with the total authorization amount, as the plugin will not support the partial settlement


- In Decision Manager → Configuration → Profiles create a new profile
  and set it as default
  - Disable the Threshold Rule Generator
  - Add an Accept rule with the condition 'Billing Street Address 1 is equal to "1 London Bridge"'
  - Add a Review rule with the condition 'Billing Street Address 1 is equal to "2 London Bridge"'
  - Add a Reject rule with the condition 'Billing Street Address 1 is equal to "3 London Bridge"'

See also the following
screenshots

### Extended Settings

![](images/966623909.png)

![](images/966688917.png)

![](images/Enable-Auth-Reverse.png)

![](images/Enable-Settlement.png)

### Profiles

![](images/966688922.png)

### Profile

![](images/966558360.png)

### Rule example

![](images/966819993.png)
