# Decision Manager


## Field mapping

Fields which are used by Decision Manager are mapped from commercetools fields as follows

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
<td>shipTo_street1</td>
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
<td>cs_deviceFingerprintId</td>
<td>deviceFingerprintID</td>
<td><br />
</td>
</tr>
</tbody>
</table>

### Customising shipping address mapping

See [Customisation](Customisation.md)

### Device fingerprinting

Follow the appropriate Cybersource guide for device fingerprinting and add the session id used for this to the commercetools payment as a custom field called cs\_deviceFingerprintId

### Enabling/disabling decision manager for specific payments

The PaymentDetails class has a PaymentOverrides property which contains an optional flag to override the EBC settings and enable or disable decision manager for specific payments.

The reference app uses a PaymentDetailsFactory to create PaymentDetails objects and provides an implementation FeatureFlagPaymentDetailsFactory which sets the decision manager override based on a configuration flag. To enable/disable based on other criteria you can implement the PaymentDetailsFactory interface where you will have access to the commercetools payment and cart

## Optional fields

To pass additional data to Decision Manager it is possible to customise your commercetools resources to add extra fields. If these fields exist and there are values present for these then the extension will pass the values on to Cybersource in the appropriate request

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
<td>cs_customerIpAddress</td>
<td>billTo_ipAddress</td>
<td><br />
</td>
</tr>
<tr class="even">
<td>payment</td>
<td>cs_merchantDefinedData_*</td>
<td>merchantDefinedData_*</td>
<td><p>Any field matching the commercetools prefix will be passed to Cybersource using the Cybersource prefix</p>
<p>Cybersource recognises merchantDefinedData_ mddField_1 to merchantDefinedData_ mddField_100</p>
<p>(alternatively <span>merchantDefinedData_ field1 to <span>merchantDefinedData_ field20 for legacy)</span></span></p></td>
</tr>
<tr class="odd">
<td>line-item</td>
<td>cs_productCode</td>
<td>item_#_productCode</td>
<td><p>Needs to be populated on the cart line items as the extension has no access to the product</p></td>
</tr>
<tr class="even">
<td>line-item</td>
<td>cs_productRisk</td>
<td>item_#_productRisk</td>
<td><p>Needs to be populated on the cart line items as the extension has no access to the product</p></td>
</tr>
</tbody>
</table>

### Sample definitions

#### Payment

The following is an example of field definitions for the customer IP address and a single merchant defined field. They would need to be added to the base field definitions and any other payment customisations you may already have

	{
	  "fieldDefinitions": [
	    {
	      "type": {
	        "name": "String"
	      },
	      "name": "cs_customerIpAddress",
	      "label": {
	        "en": "Customer IP address"
	      },
	      "required": false
	    },
	    {
	      "type": {
	        "name": "String"
	      },
	      "name": "cs_merchantDefinedData_mddField_1",
	      "label": {
	        "en": "cs_merchantDefinedData_mddField_1"
	      },
	      "required": false
	    }
	  ],
	  "key": "cybersource_payment_data",
	  "name": {
	    "en": "Cybersource custom payment fields"
	  },
	  "resourceTypeIds": [
	    "payment"
	  ]
	}

#### Line Item

The following fields are defined as enums with all the values supported by Cybersource for the product code and risk. However you could use plain String fields instead. If you have already customised the line-item resource you should add the fields to that definition

	{
	  "fieldDefinitions": [
	    {
	      "type" : {
	        "name" : "Enum",
	        "values" : [ {
	          "key" : "adult_content",
	          "label" : "Adult content."
	        }, {
	          "key" : "coupon",
	          "label" : "Coupon applied to the entire order."
	        }, {
	          "key" : "default",
	          "label" : "Default value for the product code."
	        }, {
	          "key" : "electronic_good",
	          "label" : "Electronic product other than software."
	        }, {
	          "key" : "electronic_software",
	          "label" : "Software distributed electronically rather than on disks or other media."
	        }, {
	          "key" : "gift_certificate",
	          "label" : "Gift certificate."
	        }, {
	          "key" : "handling_only",
	          "label" : "Fee that you charge your customer to cover your administrative selling costs."
	        }, {
	          "key" : "service",
	          "label" : "Service that you perform for your customer."
	        }, {
	          "key" : "shipping_and_handling",
	          "label" : "The shipping portion is the charge for shipping the product to your customer."
	        }, {
	          "key" : "shipping_only",
	          "label" : "Charge for transporting tangible personal property from your location to your customer."
	        }, {
	          "key" : "subscription",
	          "label" : "Subscription to a web site or other content."
	        } ]
	      },
	      "name" : "cs_productCode",
	      "label" : {
	        "en" : "Cybersource product code"
	      },
	      "required" : false
	    },
	    {
	      "type" : {
	        "name" : "Enum",
	        "values" : [ {
	          "key" : "low",
	          "label" : "The product is associated with few chargebacks."
	        }, {
	          "key" : "normal",
	          "label" : "The product is associated with a normal number of chargebacks."
	        }, {
	          "key" : "high",
	          "label" : "The product is associated with many chargebacks."
	        } ]
	      },
	      "name" : "cs_productRisk",
	      "label" : {
	        "en" : "Cybersource product risk"
	      },
	      "required" : false
	    }
	
	  ],
	  "key": "cybersource_line_item_data",
	  "name": {
	    "en": "Cybersource custom line item fields"
	  },
	  "resourceTypeIds": [
	    "line-item"
	  ]
	}

## Integration tests

To run the integration tests successfully it is necessary to configure Decision Manager in EBC

  - In Decision Manager → Configuration → Extended Settings enable
    Decision Manager for Authorization
      - Also ensure the reply flags are set to DREVIEW and DREJECT
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

### Profiles

![](images/966688922.png)

### Profile

![](images/966558360.png)

### Rule example

![](images/966819993.png)
