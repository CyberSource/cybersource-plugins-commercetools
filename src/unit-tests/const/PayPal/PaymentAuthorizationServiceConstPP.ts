const payment = {
  "id": "2f34cf69-a1db-4ba8-ad08-c977476560a6",
  "version": 20,
  "versionModifiedAt": "2025-03-17T17:07:38.237Z",
  "lastMessageSequenceNumber": 7,
  "createdAt": "2025-03-17T17:06:43.954Z",
  "lastModifiedAt": "2025-03-17T17:07:38.237Z",
  "lastModifiedBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false
  },
  "createdBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "customer": {
      "typeId": "customer",
      "id": "ba03b41a-5c8f-42ce-be17-d83c5fbfede6"
    }
  },
  "customer": {
    "typeId": "customer",
    "id": "ba03b41a-5c8f-42ce-be17-d83c5fbfede6"
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
      "isv_deviceFingerprintId": "c4ebb8bd-9b22-47d4-adc3-5c79dd06f276",
      "isv_merchantId": "",
      "isv_saleEnabled": false,
      "isv_shippingMethod": "SINGLE",
      "isv_customerIpAddress": "192.168.1.1",
      "isv_payPalUrl": "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-12T5428125494052B",
      "isv_payPalRequestId": "7422312049446026804807",
      "isv_authorizationStatus": "AUTHORIZED",
      "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
      "isv_responseDateAndTime": "2025-03-17T17:07:04Z"
    }
  },
  transactions: [
    {
      "id": "19aaac6e-2aa1-4d49-b44b-6022fa100a80",
      "timestamp": "2025-03-17T16:32:20.845Z",
      "type": "Authorization",
      "amount": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 1505700,
        "fractionDigits": 2
      },
      "interactionId": "7422291437386587904806",
      "state": "Success"
    }
  ]
};

const payments = {
  "id": "894515ff-a97b-4b9c-a7a7-b88dbafad781",
  "version": 17,
  "versionModifiedAt": "2025-03-17T17:05:28.176Z",
  "lastMessageSequenceNumber": 5,
  "createdAt": "2025-03-17T17:02:43.038Z",
  "lastModifiedAt": "2025-03-17T17:05:28.176Z",
  "lastModifiedBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false
  },
  "createdBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "customer": {
      "typeId": "customer",
      "id": "ba03b41a-5c8f-42ce-be17-d83c5fbfede6"
    }
  },
  "customer": {
    "typeId": "customer",
    "id": "ba03b41a-5c8f-42ce-be17-d83c5fbfede6"
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
      "isv_deviceFingerprintId": "c4ebb8bd-9b22-47d4-adc3-5c79dd06f276",
      "isv_merchantId": "",
      "isv_saleEnabled": false,
      "isv_shippingMethod": "SINGLE",
      "isv_customerIpAddress": "192.168.1.1",
      "isv_payPalUrl": "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-07T70146AU3926337",
      "isv_payPalRequestId": "7422309640116241304806",
      "isv_authorizationStatus": "AUTHORIZED",
      "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
      "isv_responseDateAndTime": "2025-03-17T17:03:04Z"
    }
  },
  "paymentStatus": {},
  "transactions": [
    {
      "id": "098aae9d-c43e-4844-8e95-fca055d626d8",
      "timestamp": "2025-03-17T17:02:58.431Z",
      "type": "Authorization",
      "amount": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 501900,
        "fractionDigits": 2
      },
      "interactionId": "7422309820496462104805",
      "state": "Success"
    },
    {
      "id": "b84ea47a-91a6-4ba6-908b-bdf9ae33c1a8",
      "timestamp": "2025-03-17T17:05:25.678Z",
      "type": "Charge",
      "amount": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 1200,
        "fractionDigits": 2
      },
      "interactionId": "7422311261806374104806",
      "state": "Success"
    }
  ],
  "interfaceInteractions": [],
  "consolidatedTime": 77
}
const guestPayment = {
  "id": "bd29b4d4-ca01-41a9-9202-55eca32ce1c8",
  "version": 14,
  "versionModifiedAt": "2025-03-17T16:07:55.180Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-17T16:07:33.920Z",
  "lastModifiedAt": "2025-03-17T16:07:55.180Z",
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
      "isv_payPalUrl": "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-9C603659HL095012S",
      "isv_payPalRequestId": "7422276548206625304805",
      "isv_authorizationStatus": "AUTHORIZED",
      "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
      "isv_responseDateAndTime": "2025-03-17T16:07:55Z"
    }
  },
  "transactions": [
    {
      "id": "7c792442-fd62-4564-b67f-c54e8c94b587",
      "timestamp": "2025-03-17T18:30:58.963Z",
      "type": "Authorization",
      "amount": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 1003800,
        "fractionDigits": 2
      },
      "interactionId": "7422362616826812904806",
      "state": "Success"
    }
  ],
};

const cart = {
  "type": "Cart",
  "id": "4072fceb-66a7-470d-8c5b-f4b68e8a36d6",
  "version": 28,
  "versionModifiedAt": "2025-03-17T16:07:55.757Z",
  "lastMessageSequenceNumber": 1,
  "createdAt": "2025-03-17T16:07:15.665Z",
  "lastModifiedAt": "2025-03-17T16:07:55.754Z",
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
      "id": "7e5a7545-6fd0-44fe-bbd4-c565fbfc5bd4",
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
      "quantity": 3,
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
      "addedAt": "2025-03-17T16:07:15.964Z",
      "lastModifiedAt": "2025-03-17T16:07:25.374Z",
      "state": [
        {
          "quantity": 3,
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
        "centAmount": 1505700,
        "fractionDigits": 2
      },
      "taxedPrice": {
        "totalNet": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 1505700,
          "fractionDigits": 2
        },
        "totalGross": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 1656270,
          "fractionDigits": 2
        },
        "taxPortions": [
          {
            "rate": 0.1,
            "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 150570,
              "fractionDigits": 2
            },
            "name": "en"
          }
        ],
        "totalTax": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 150570,
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
    "centAmount": 1505700,
    "fractionDigits": 2
  },
  "taxedPrice": {
    "totalNet": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 1505700,
      "fractionDigits": 2
    },
    "totalGross": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 1656270,
      "fractionDigits": 2
    },
    "taxPortions": [
      {
        "rate": 0.1,
        "amount": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 150570,
          "fractionDigits": 2
        },
        "name": "en"
      }
    ],
    "totalTax": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 150570,
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
        "id": "bd29b4d4-ca01-41a9-9202-55eca32ce1c8"
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
  "totalLineItemQuantity": 3
}

const service = 'payPal';
const notSaveToken = false;

const payerAuthMandateFlag = false;

const orderNo = '';

const orderNumber = '10';
const cardTokens = {
  intentsId: "7422312200576427804806"
}
const shippingCart = {
  "type": "Cart",
  "id": "1fbea7da-7be5-4b8f-9c28-56bf6fd0f39d",
  "version": 23,
  "versionModifiedAt": "2025-03-17T16:13:16.742Z",
  "lastMessageSequenceNumber": 1,
  "createdAt": "2025-03-17T16:12:46.229Z",
  "lastModifiedAt": "2025-03-17T16:13:16.739Z",
  "lastModifiedBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "customer": {
      "typeId": "customer",
      "id": "ba03b41a-5c8f-42ce-be17-d83c5fbfede6"
    }
  },
  "createdBy": {
    "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
    "isPlatformClient": false,
    "customer": {
      "typeId": "customer",
      "id": "ba03b41a-5c8f-42ce-be17-d83c5fbfede6"
    }
  },
  "customerId": "ba03b41a-5c8f-42ce-be17-d83c5fbfede6",
  "locale": "en",
  "lineItems": [
    {
      "id": "241e2d4f-329e-43b5-a630-b3dbc051597b",
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
      "addedAt": "2025-03-17T16:12:46.520Z",
      "lastModifiedAt": "2025-03-17T16:12:46.520Z",
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
        "id": "29c7c9d5-946d-4fa8-af4d-a37ebc58b8a0"
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

export default {
  payment,
  payments,
  guestPayment,
  cart,
  service,
  notSaveToken,
  payerAuthMandateFlag,
  orderNo,
  orderNumber,
  shippingCart,
  cardTokens
};
