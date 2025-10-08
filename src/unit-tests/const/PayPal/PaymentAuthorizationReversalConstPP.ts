import payPal from '../../JSON/payPal.json';
const payment = {
  "id": "0c95b145-688c-4e12-b804-ba95705023a8",
  "version": 14,
  "versionModifiedAt": "2025-03-17T13:45:50.465Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-17T13:45:30.371Z",
  "lastModifiedAt": "2025-03-17T13:45:50.465Z",
  "lastModifiedBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308"
  },
  "createdBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308"
  },
  "amountPlanned": {
    "type": "centPrecision",
    "currencyCode": "USD",
    "centAmount": 1003800,
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
      "isv_deviceFingerprintId": "8a66f7a9-9585-4072-bb06-31b5c94c9e81",
      "isv_merchantId": "",
      "isv_saleEnabled": false,
      "isv_shippingMethod": "SINGLE",
      "isv_customerIpAddress": "192.168.1.1",
      "isv_payPalUrl": "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-53A71649DB102064E",
      "isv_payPalRequestId": "7422191314306016804805",
      "isv_authorizationStatus": "AUTHORIZED",
      "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
      "isv_responseDateAndTime": "2025-03-17T13:45:50Z"
    }
  },
  "paymentStatus": {},
  "transactions": [
    {
      "id": "449572af-30cc-436a-87aa-5e45a9482590",
      "timestamp": "2025-03-17T13:45:45.943Z",
      "type": "Authorization",
      "amount": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 1003800,
        "fractionDigits": 2
      },
      "interactionId": "7422191482786809204806",
      "state": "Success"
    }
  ],
  "interfaceInteractions": [],
  "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308",
  "consolidatedTime": 74
}

const cart = {
  "type": "Cart",
  "id": "8feff38d-6903-4d53-b316-54ca73496291",
  "version": 26,
  "versionModifiedAt": "2025-03-17T13:45:51.185Z",
  "lastMessageSequenceNumber": 1,
  "createdAt": "2025-03-17T13:45:19.491Z",
  "lastModifiedAt": "2025-03-17T13:45:51.182Z",
  "lastModifiedBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308"
  },
  "createdBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308"
  },
  "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308",
  "locale": "en",
  "lineItems": [
    {
      "id": "8a2e0f98-f21f-4aed-8913-7688705cee70",
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
      "quantity": 2,
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
      "addedAt": "2025-03-17T13:45:19.834Z",
      "lastModifiedAt": "2025-03-17T13:45:23.117Z",
      "state": [
        {
          "quantity": 2,
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
        "centAmount": 1003800,
        "fractionDigits": 2
      },
      "taxedPrice": {
        "totalNet": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 1003800,
          "fractionDigits": 2
        },
        "totalGross": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 1104180,
          "fractionDigits": 2
        },
        "taxPortions": [
          {
            "rate": 0.1,
            "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 100380,
              "fractionDigits": 2
            },
            "name": "en"
          }
        ],
        "totalTax": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 100380,
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
    "centAmount": 1003800,
    "fractionDigits": 2
  },
  "taxedPrice": {
    "totalNet": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 1003800,
      "fractionDigits": 2
    },
    "totalGross": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 1104180,
      "fractionDigits": 2
    },
    "taxPortions": [
      {
        "rate": 0.1,
        "amount": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 100380,
          "fractionDigits": 2
        },
        "name": "en"
      }
    ],
    "totalTax": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 100380,
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
        "id": "0c95b145-688c-4e12-b804-ba95705023a8"
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
  "totalLineItemQuantity": 2
}

const authReversalId = payPal.authReversalId;

const authReversalID = '7422262803916445904805';

const payments = {
  "id": "8695305a-6c9e-46ec-956d-569c04fa3c4a",
  "version": 14,
  "versionModifiedAt": "2025-03-17T15:44:42.758Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-17T15:44:13.002Z",
  "lastModifiedAt": "2025-03-17T15:44:42.758Z",
  "lastModifiedBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308"
  },
  "createdBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308"
  },
  "amountPlanned": {
    "type": "centPrecision",
    "currencyCode": "USD",
    "centAmount": 501900000,
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
      "isv_deviceFingerprintId": "8a66f7a9-9585-4072-bb06-31b5c94c9e81",
      "isv_merchantId": "",
      "isv_saleEnabled": false,
      "isv_shippingMethod": "SINGLE",
      "isv_customerIpAddress": "192.168.1.1",
      "isv_payPalUrl": "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-67P85457B6239082G",
      "isv_payPalRequestId": "7422262541426831504801",
      "isv_authorizationStatus": "AUTHORIZED",
      "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
      "isv_responseDateAndTime": "2025-03-17T15:44:42Z"
    }
  },
  "paymentStatus": {},
  "transactions": [
    {
      "id": "04abf3a6-aaf9-4e6c-a8ad-88d48bf29050",
      "timestamp": "2025-03-17T15:44:37.625Z",
      "type": "Authorization",
      "amount": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 501900,
        "fractionDigits": 2
      },
      "interactionId": "7422262803916445904805",
      "state": "Success"
    }
  ],
  "interfaceInteractions": [],
  "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308",
  "consolidatedTime": 77
}

const shippingCart = {
  "type": "Cart",
  "id": "6baa2f30-bfa4-46ac-bb75-534224a733e9",
  "version": 22,
  "versionModifiedAt": "2025-03-17T15:44:43.355Z",
  "lastMessageSequenceNumber": 1,
  "createdAt": "2025-03-17T15:44:02.828Z",
  "lastModifiedAt": "2025-03-17T15:44:43.352Z",
  "lastModifiedBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308"
  },
  "createdBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308"
  },
  "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308",
  "locale": "en",
  "lineItems": [
    {
      "id": "ae47643f-b9ad-41ae-bf4e-6f754953330f",
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
      "addedAt": "2025-03-17T15:44:03.170Z",
      "lastModifiedAt": "2025-03-17T15:44:03.170Z",
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
    "firstName": "POC",
    "lastName": "PLUGIN",
    "streetName": "Plug In Drive, Ridgeville, SC, USA",
    "additionalStreetInfo": "7th street",
    "postalCode": "29472",
    "city": "Mountain",
    "region": "SC",
    "country": "US",
    "phone": "09999999999",
    "email": "aswingpay304@gmail.com"
  },
  "shipping": [
    {
      shippingKey: 'shippingKey123',
      shippingInfo: {
        shippingMethodName: 'UHL',
        price: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 990,
          fractionDigits: 2,
        },
        shippingRate: {
          price: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 990,
            fractionDigits: 2,
          },
          tiers: [],
        },
        taxRate: {
          name: 'test-taxes-category',
          amount: 0.2,
          includedInPrice: true,
          country: 'US',
          id: 'yo5l4O7M',
          subRates: [],
        },
        taxCategory: {
          typeId: 'tax-category',
          id: '9ed4dda8-d050-4f6b-90a8-34901c33b6f8',
        },
        deliveries: [],
        shippingMethod: {
          typeId: 'shipping-method',
          id: '793cc3e5-20fa-4931-a22d-0bb7c9db8be3',
        },
        taxedPrice: {
          totalNet: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 825,
            fractionDigits: 2,
          },
          totalGross: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 990,
            fractionDigits: 2,
          },
          totalTax: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 165,
            fractionDigits: 2,
          },
        },
        shippingMethodState: 'MatchesCart',
      },
      shippingAddress: {
        streetName: 'ABC Street',
        streetNumber: '1234',
        postalCode: '94043',
        city: 'Mountain Views',
        region: 'CA',
        country: 'US',
        key: 'addressKeyOne',
      },
    },
    {
      shippingKey: 'myUniqueKey23455',
      shippingInfo: {
        shippingMethodName: 'DHL',
        price: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1190,
          fractionDigits: 2,
        },
        shippingRate: {
          price: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 1190,
            fractionDigits: 2,
          },
          tiers: [],
        },
        taxRate: {
          name: 'test-taxes-category',
          amount: 0.2,
          includedInPrice: true,
          country: 'US',
          id: 'yo5l4O7M',
          subRates: [],
        },
        taxCategory: {
          typeId: 'tax-category',
          id: '9ed4dda8-d050-4f6b-90a8-34901c33b6f8',
        },
        deliveries: [],
        shippingMethod: {
          typeId: 'shipping-method',
          id: 'c80f6822-8b9d-476e-b4ac-3125fa789af2',
        },
        taxedPrice: {
          totalNet: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 992,
            fractionDigits: 2,
          },
          totalGross: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 1190,
            fractionDigits: 2,
          },
          totalTax: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 198,
            fractionDigits: 2,
          },
        },
        shippingMethodState: 'MatchesCart',
      },
      shippingAddress: {
        streetName: 'PRB Nagar',
        streetNumber: '1234',
        postalCode: '94043',
        city: 'Mountain Views',
        region: 'CA',
        country: 'US',
        key: 'addressKeyTwo',
      },
    },
  ],
  "customLineItems": [],
  "discountCodes": [],
  "directDiscounts": [],
  "paymentInfo": {
    "payments": [
      {
        "typeId": "payment",
        "id": "8695305a-6c9e-46ec-956d-569c04fa3c4a"
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

const multipleShippingPayment = {
  "id": "d51e95a8-2ff3-4b68-8f11-b1bc92f85793",
  "version": 14,
  "versionModifiedAt": "2025-03-17T15:59:34.788Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-17T15:59:14.274Z",
  "lastModifiedAt": "2025-03-17T15:59:34.788Z",
  "lastModifiedBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308"
  },
  "createdBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308"
  },
  "amountPlanned": {
    "type": "centPrecision",
    "currencyCode": "USD",
    "centAmount": 1505700,
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
      "isv_deviceFingerprintId": "8a66f7a9-9585-4072-bb06-31b5c94c9e81",
      "isv_merchantId": "",
      "isv_saleEnabled": false,
      "isv_shippingMethod": "SINGLE",
      "isv_customerIpAddress": "192.168.1.1",
      "isv_payPalUrl": "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-9T3968339E904891J",
      "isv_payPalRequestId": "7422271554806357704806",
      "isv_authorizationStatus": "AUTHORIZED",
      "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
      "isv_responseDateAndTime": "2025-03-17T15:59:34Z"
    }
  },
  "paymentStatus": {},
  "transactions": [
    {
      "id": "eb676cce-36bf-4cfc-aac8-ed6ed56be36d",
      "timestamp": "2025-03-17T15:59:29.515Z",
      "type": "Authorization",
      "amount": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 1505700,
        "fractionDigits": 2
      },
      "interactionId": "7422271723196577804805",
      "state": "Success"
    }
  ],
  "interfaceInteractions": [],
  "anonymousId": "15553721-599c-4b46-b1e0-10f4b5086308",
  "consolidatedTime": 79
}

const multipleShippingReversalId = payPal.multipleShippingAuthReversalId;

export default {
  payment,
  cart,
  authReversalId,
  authReversalID,
  payments,
  shippingCart,
  multipleShippingPayment,
  multipleShippingReversalId
}