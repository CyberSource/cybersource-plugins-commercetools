const paymentObject = {
    "id": "8b1bef8a-3043-445a-a3a0-035bdf909dc5",
    "version": 14,
    "versionModifiedAt": "2025-03-17T19:17:35.332Z",
    "lastMessageSequenceNumber": 3,
    "createdAt": "2025-03-17T19:17:08.786Z",
    "lastModifiedAt": "2025-03-17T19:17:35.332Z",
    "lastModifiedBy": {
        "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
        "isPlatformClient": false,
        "anonymousId": "94159245-77fc-4b78-90b5-6a0ba6733dab"
    },
    "createdBy": {
        "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
        "isPlatformClient": false,
        "anonymousId": "94159245-77fc-4b78-90b5-6a0ba6733dab"
    },
    "amountPlanned": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 501900,
        "fractionDigits": 2
    },
    "paymentMethodInfo": {
        "paymentInterface": "cybersource",
        "method": "payPal",
        "name": {
            "en": "PayPal"
        }
    },
    "custom": {
        "type": {
            "typeId": "type",
            "id": "28bba466-fc03-4801-a823-6c7e6e3586b0"
        },
        "fields": {
            "isv_deviceFingerprintId": "d754771a-66ed-44fa-9e65-afa3d6fcfe73",
            "isv_merchantId": "",
            "isv_saleEnabled": false,
            "isv_shippingMethod": "SINGLE",
            "isv_customerIpAddress": "192.168.1.1",
            "isv_payPalUrl": "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-56R90591FY652315U",
            "isv_payPalRequestId": "7422390296726979304805",
            "isv_authorizationStatus": "AUTHORIZED",
            "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
            "isv_responseDateAndTime": "2025-03-17T19:17:35Z"
        }
    },
    "paymentStatus": {},
    "transactions": [
        {
            "id": "5c8799cb-3c59-4550-8892-f8a777b101d8",
            "timestamp": "2025-03-17T19:17:30.501Z",
            "type": "Authorization",
            "amount": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 501900,
                "fractionDigits": 2
            },
            "interactionId": "7422390531546980704805",
            "state": "Success"
        }
    ],
    "interfaceInteractions": [],
    "anonymousId": "94159245-77fc-4b78-90b5-6a0ba6733dab",
    "consolidatedTime": 79
}

const cartObject = {
    "type": "Cart",
    "id": "9507be7c-722b-48aa-8944-ece7752c9069",
    "version": 23,
    "versionModifiedAt": "2025-03-17T19:17:35.949Z",
    "lastMessageSequenceNumber": 1,
    "createdAt": "2025-03-17T19:16:09.594Z",
    "lastModifiedAt": "2025-03-17T19:17:35.945Z",
    "lastModifiedBy": {
        "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
        "isPlatformClient": false,
        "anonymousId": "94159245-77fc-4b78-90b5-6a0ba6733dab"
    },
    "createdBy": {
        "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
        "isPlatformClient": false,
        "anonymousId": "94159245-77fc-4b78-90b5-6a0ba6733dab"
    },
    "anonymousId": "94159245-77fc-4b78-90b5-6a0ba6733dab",
    "locale": "en",
    "lineItems": [
        {
            "id": "ce4f8893-6037-4769-a7e5-08a80a8112c0",
            "productId": "c93d1d93-79bc-4bfd-ad62-706ce06e2b90",
            "name": {
                "en": "Mexicon-Hat",
                "en-US": "Hat"
            },
            "productType": {
                "typeId": "product-type",
                "id": "20efa170-91df-4d8a-bbd0-610e6a532773",
                "version": 1
            },
            "productSlug": {
                "en": "Mexicon-Hat"
            },
            "variant": {
                "id": 1,
                "sku": "SKU-1",
                "prices": [
                    {
                        "id": "6c414313-280a-4d57-bc61-96d212aa7b9b",
                        "value": {
                            "type": "centPrecision",
                            "currencyCode": "EUR",
                            "centAmount": 4200,
                            "fractionDigits": 2
                        },
                        "validFrom": "2025-03-02T18:30:00.000Z",
                        "validUntil": "2026-03-18T18:30:00.000Z"
                    },
                    {
                        "id": "b1feaabf-a309-4805-bf44-f42e1c59760a",
                        "value": {
                            "type": "centPrecision",
                            "currencyCode": "USD",
                            "centAmount": 501900,
                            "fractionDigits": 2
                        },
                        "key": "US",
                        "validFrom": "2025-03-02T18:30:00.000Z",
                        "validUntil": "2026-03-05T18:30:00.000Z"
                    }
                ],
                "images": [
                    {
                        "url": "https://th.bing.com/th/id/OIP.SihGuijrQqicDgOjJIzg7gHaGD?w=207&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
                        "label": "Hat",
                        "dimensions": {
                            "w": 414,
                            "h": 360
                        }
                    }
                ],
                "attributes": [],
                "assets": []
            },
            "price": {
                "id": "b1feaabf-a309-4805-bf44-f42e1c59760a",
                "value": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 501900,
                    "fractionDigits": 2
                },
                "key": "US",
                "validFrom": "2025-03-02T18:30:00.000Z",
                "validUntil": "2026-03-05T18:30:00.000Z"
            },
            "quantity": 1,
            "discountedPricePerQuantity": [],
            "taxRate": {
                "name": "en",
                "amount": 0.1,
                "includedInPrice": false,
                "country": "US",
                "id": "sfOR5PDn",
                "subRates": []
            },
            "perMethodTaxRate": [],
            "addedAt": "2025-03-17T19:16:09.949Z",
            "lastModifiedAt": "2025-03-17T19:16:09.949Z",
            "state": [
                {
                    "quantity": 1,
                    "state": {
                        "typeId": "state",
                        "id": "bbbd6d42-e1ed-47ba-98ee-8759da290bbe"
                    }
                }
            ],
            "priceMode": "Platform",
            "lineItemMode": "Standard",
            "totalPrice": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 501900,
                "fractionDigits": 2
            },
            "taxedPrice": {
                "totalNet": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 501900,
                    "fractionDigits": 2
                },
                "totalGross": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 552090,
                    "fractionDigits": 2
                },
                "taxPortions": [
                    {
                        "rate": 0.1,
                        "amount": {
                            "type": "centPrecision",
                            "currencyCode": "USD",
                            "centAmount": 50190,
                            "fractionDigits": 2
                        },
                        "name": "en"
                    }
                ],
                "totalTax": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 50190,
                    "fractionDigits": 2
                }
            },
            "taxedPricePortions": []
        }
    ],
    "cartState": "Ordered",
    "totalPrice": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 501900,
        "fractionDigits": 2
    },
    "taxedPrice": {
        "totalNet": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 501900,
            "fractionDigits": 2
        },
        "totalGross": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 552090,
            "fractionDigits": 2
        },
        "taxPortions": [
            {
                "rate": 0.1,
                "amount": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 50190,
                    "fractionDigits": 2
                },
                "name": "en"
            }
        ],
        "totalTax": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 50190,
            "fractionDigits": 2
        }
    },
    "country": "US",
    "taxedShippingPrice": {
        "totalNet": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 0,
            "fractionDigits": 2
        },
        "totalGross": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 0,
            "fractionDigits": 2
        },
        "taxPortions": [
            {
                "rate": 0.1,
                "amount": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 0,
                    "fractionDigits": 2
                },
                "name": "en"
            }
        ],
        "totalTax": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 0,
            "fractionDigits": 2
        }
    },
    "shippingMode": "Single",
    "shippingInfo": {
        "shippingMethodName": "DHL",
        "price": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 0,
            "fractionDigits": 2
        },
        "shippingRate": {
            "price": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 0,
                "fractionDigits": 2
            },
            "tiers": []
        },
        "taxRate": {
            "name": "en",
            "amount": 0.1,
            "includedInPrice": false,
            "country": "US",
            "id": "sfOR5PDn",
            "subRates": []
        },
        "taxCategory": {
            "typeId": "tax-category",
            "id": "5a01f7c3-73fd-44e3-8c7f-c89a62bbc7bc"
        },
        "deliveries": [],
        "shippingMethod": {
            "typeId": "shipping-method",
            "id": "3d2780f9-f22b-4710-bb5c-b14dd6a27a2c"
        },
        "taxedPrice": {
            "totalNet": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 0,
                "fractionDigits": 2
            },
            "totalGross": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 0,
                "fractionDigits": 2
            },
            "taxPortions": [
                {
                    "rate": 0.1,
                    "amount": {
                        "type": "centPrecision",
                        "currencyCode": "USD",
                        "centAmount": 0,
                        "fractionDigits": 2
                    },
                    "name": "en"
                }
            ],
            "totalTax": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 0,
                "fractionDigits": 2
            }
        },
        "shippingMethodState": "MatchesCart"
    },
    "shippingAddress": {
        "firstName": "John",
        "lastName": "Smith",
        "streetName": "1295 Charleston road",
        "streetNumber": "5th Lane",
        "postalCode": "94043",
        "city": "Mountain View",
        "region": "CA",
        "country": "US"
    },
    "shipping": [],
    "customLineItems": [],
    "discountCodes": [],
    "directDiscounts": [],
    "paymentInfo": {
        "payments": [
            {
                "typeId": "payment",
                "id": "8b1bef8a-3043-445a-a3a0-035bdf909dc5"
            }
        ]
    },
    "inventoryMode": "None",
    "taxMode": "Platform",
    "taxRoundingMode": "HalfEven",
    "taxCalculationMode": "LineItemLevel",
    "deleteDaysAfterLastModification": 90,
    "refusedGifts": [],
    "origin": "Customer",
    "billingAddress": {
        "firstName": "John",
        "lastName": "Doe",
        "streetName": "1 Main St",
        "postalCode": "95131",
        "city": "San Jose",
        "region": "CA",
        "country": "US",
        "phone": "408-698-9539",
        "email": "kevle@visa.com"
    },
    "itemShippingAddresses": [],
    "discountTypeCombination": {
        "type": "Stacking"
    },
    "totalLineItemQuantity": 1
}

export default { paymentObject, cartObject };