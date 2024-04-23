##	Creation of the MDD field definition

Below is an example of field definitions for the custom fields merchantDefinedFiled_data1 and merchantDefinedFiled_data2

    {
        "version": {{type-version}},
        "actions": [
            {
                "action": "addFieldDefinition",
                "fieldDefinition": {
                    "name": "merchantDefinedField_data1",
                    "label": {
                        "en": "please provide a value"
                    },
                    "type": {
                        "name": "value" // type of the value to be accepted (String,Number..)
                    },
                    "required": false,
                    "inputHint": "SingleLine"
                }
            },
            {
                "action": "addFieldDefinition",
                "fieldDefinition": {
                    "name": "merchantDefinedField_data2",
                    "label": {
                        "en": "please provide a value"
                    },
                    "type": {
                        "name": "value" // type of the value to be accepted (String,Number..)
                    },
                    "required": false,
                    "inputHint": "SingleLine"
                }
            }
        ]
    }

##	Set the values for MDD

Below is an example of setting up the value for merchantDefinedFiled_data1 and merchantDefinedFiled_data2

    {
        "version": {{payment-version}},
        "actions": [
            {
                "action": "setCustomField",
                "name": "merchantDefinedFiled_data1",
                "value": "value"
            },
            {
                "action": "setCustomField",
                "name": "merchantDefinedFiled_data2",
                "value": "value"
            }
        ]
    }

##	Set the value for MDD while creating a payment:

Below is an example of setting the value for merchantDefinedFiled_data1 and merchantDefinedFiled_data2 while creating a payment

    {
        "amountPlanned": {
            "currencyCode": "value",
            "centAmount": value
        },
        "paymentMethodInfo": {
            "paymentInterface": "value",
            "method": "value",
            "name": {
                "en": "value"
            }
        },
        "custom": {
            "type": {
                "key": "isv_payment_data"
            },
            "fields": {
                "merchantDefinedFiled_data1": "value",
                "merchantDefinedFiled_data2": "value"
            }
        },
        "paymentStatus": {}
    }