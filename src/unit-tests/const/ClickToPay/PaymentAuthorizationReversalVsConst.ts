import clickToPay from '../../JSON/clickToPay.json';
export const payment =  {
    id: 'efee6eb7-2400-4731-89ad-9ef1e5361ea4',
    version: 9,
    lastMessageSequenceNumber: 4,
    createdAt: '2021-11-10T11:28:43.582Z',
    lastModifiedAt: '2021-11-10T11:28:53.502Z',
    lastModifiedBy: {
      clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
      isPlatformClient: false,
      anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc'
    },
    createdBy: {
      clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
      isPlatformClient: false,
      anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc'
    },
    amountPlanned: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: clickToPay.centAmount,
      fractionDigits: 2
    },
    paymentMethodInfo: {
      paymentInterface: "cybersource",
      method: "clickToPay",
      name: {
        "en": "Click to Pay"
      }
    },
    custom: {
      type: { typeId: 'type', id: '28701886-4e26-4cab-924e-9b0da3829f88' },
      fields: {
        isv_deviceFingerprintId:"8a22fb00-dc63-496b-b0de-9f1d1fd36a50",
        isv_cardExpiryYear: '25  ',
        isv_token: clickToPay.isv_token,
        isv_customerIpAddress:"106.202.150.94",
        isv_maskedPan: '411111XXXXXX1111',
        isv_cardExpiryMonth: '05',
        isv_userAgentHeader:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
        isv_cardType: '001',
       }
    },
    paymentStatus: {},
    transactions: [
      {
        id: '1b3c1147-7ceb-43ec-96cf-af12f2b7e828',
        type: 'Authorization',
        amount: [Object],
        interactionId: clickToPay.authReversalId,
        state: 'Success'
      }
    ],
    interfaceInteractions: [],
  }

  export const payments =  {
    id: 'efee6eb7-2400-4731-89ad-9ef1e5361ea4',
    version: 9,
    lastMessageSequenceNumber: 4,
    createdAt: '2021-11-10T11:28:43.582Z',
    lastModifiedAt: '2021-11-10T11:28:53.502Z',
    lastModifiedBy: {
      clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
      isPlatformClient: false,
      anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc'
    },
    createdBy: {
      clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
      isPlatformClient: false,
      anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc'
    },
    amountPlanned: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: clickToPay.centAmountValue,
      fractionDigits: 2
    },
    paymentMethodInfo: {
      paymentInterface: "cybersource",
      method: "clickToPay",
      name: {
        "en": "Click to Pay"
      }
    },
    custom: {
      type: { typeId: 'type', id: '28701886-4e26-4cab-924e-9b0da3829f88' },
      fields: {
        isv_deviceFingerprintId:"8a22fb00-dc63-496b-b0de-9f1d1fd36a50",
        isv_cardExpiryYear: '25  ',
        isv_token: clickToPay.isv_token,
        isv_customerIpAddress:"106.202.150.94",
        isv_maskedPan: '411111XXXXXX1111',
        isv_cardExpiryMonth: '05',
        isv_userAgentHeader:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
        isv_cardType: '001',
      }
    },
    paymentStatus: {},
    transactions: [
      {
        id: '1b3c1147-7ceb-43ec-96cf-af12f2b7e828',
        type: 'Authorization',
        amount: [Object],
        interactionId: clickToPay.authReversalId,
        state: 'Success'
      }
    ],
    interfaceInteractions: [],
    anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc'
  }

  export  const cart = {
    "limit": 20,
    "offset": 0,
    "count": 1,
    "total": 1,
    "results": [
      {
        "type": "Cart",
        "id": "ecddb55a-646d-4120-a8b8-9f900476dfe5",
        "version": 20,
        "lastMessageSequenceNumber": 1,
        "createdAt": "2022-04-11T08:33:23.168Z",
        "lastModifiedAt": "2022-04-11T08:34:17.468Z",
        "lastModifiedBy": {
          "clientId": "0GrQ8c2D9t1iSjzJF8E3Ygu3",
          "isPlatformClient": false,
          "customer": {
            "typeId": "customer",
            "id": "def6c669-eed5-4c57-ba2e-5fb04bfed1fa"
          }
        },
        "createdBy": {
          "clientId": "0GrQ8c2D9t1iSjzJF8E3Ygu3",
          "isPlatformClient": false,
          "customer": {
            "typeId": "customer",
            "id": "def6c669-eed5-4c57-ba2e-5fb04bfed1fa"
          }
        },
        "customerId": "def6c669-eed5-4c57-ba2e-5fb04bfed1fa",
        "locale": "en-US",
        "lineItems": [
          {
            "id": "72dd04a7-918e-40d8-be33-1c4de9bfcdbd",
            "productId": "7e3ccfc6-36ee-4995-ab1d-bb5095b08bbe",
            "name": {
              "en": "Sherwani"
            },
            "productType": {
              "typeId": "product-type",
              "id": "31d56c4e-d578-4dab-a313-780b5f1e7556",
              "version": 1
            },
            "productSlug": {
              "en": "a1"
            },
            "variant": {
              "id": 1,
              "sku": "SKU-1",
              "prices": [
                {
                  "id": "1fbaed84-99cc-4922-9776-c1ea3cd553e6",
                  "value": {
                    "type": "centPrecision",
                    "currencyCode": "EUR",
                    "centAmount": 15845,
                    "fractionDigits": 2
                  },
                  "country": "US",
                  "discounted": {
                    "value": {
                      "type": "centPrecision",
                      "currencyCode": "EUR",
                      "centAmount": 7922,
                      "fractionDigits": 2
                    },
                    "discount": {
                      "typeId": "product-discount",
                      "id": "9360ab21-ba82-4dca-8c39-ae0577547c8e"
                    }
                  }
                },
                {
                  "id": "68018b50-2c8a-4304-b67a-ae15389be32d",
                  "value": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 5980,
                    "fractionDigits": 2
                  },
                  "country": "US",
                  "discounted": {
                    "value": {
                      "type": "centPrecision",
                      "currencyCode": "USD",
                      "centAmount": 2990,
                      "fractionDigits": 2
                    },
                    "discount": {
                      "typeId": "product-discount",
                      "id": "9360ab21-ba82-4dca-8c39-ae0577547c8e"
                    }
                  }
                }
              ],
              "images": [
                {
                  "url": "https://ik.imagekit.io/ldqsn9vvwgg/images/505833.jpg",
                  "dimensions": {
                    "w": 300,
                    "h": 375
                  }
                }
              ],
              "attributes": [],
              "assets": []
            },
            "price": {
              "id": "68018b50-2c8a-4304-b67a-ae15389be32d",
              "value": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 5980,
                "fractionDigits": 2
              },
              "country": "US",
              "discounted": {
                "value": {
                  "type": "centPrecision",
                  "currencyCode": "USD",
                  "centAmount": 2990,
                  "fractionDigits": 2
                },
                "discount": {
                  "typeId": "product-discount",
                  "id": "9360ab21-ba82-4dca-8c39-ae0577547c8e"
                }
              }
            },
            "quantity": 1,
            "discountedPricePerQuantity": [],
            "taxRate": {
              "name": "test-tax-category",
              "amount": 0.2,
              "includedInPrice": true,
              "country": "US",
              "id": "HxMyojUT",
              "subRates": []
            },
            "addedAt": "2022-04-11T08:33:23.498Z",
            "lastModifiedAt": "2022-04-11T08:33:23.498Z",
            "state": [
              {
                "quantity": 1,
                "state": {
                  "typeId": "state",
                  "id": "438c0901-36c4-41ec-9a86-2853d6c73d0d"
                }
              }
            ],
            "priceMode": "Platform",
            "totalPrice": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 2990,
              "fractionDigits": 2
            },
            "taxedPrice": {
              "totalNet": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 2492,
                "fractionDigits": 2
              },
              "totalGross": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 2990,
                "fractionDigits": 2
              },
              "totalTax": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 498,
                "fractionDigits": 2
              }
            },
            "lineItemMode": "Standard"
          }
        ],
        "cartState": "Ordered",
        "totalPrice": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 3980,
          "fractionDigits": 2
        },
        "taxedPrice": {
          "totalNet": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 3317,
            "fractionDigits": 2
          },
          "totalGross": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 3980,
            "fractionDigits": 2
          },
          "taxPortions": [
            {
              "rate": 0.2,
              "amount": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 663,
                "fractionDigits": 2
              },
              "name": "test-tax-category"
            }
          ],
          "totalTax": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 663,
            "fractionDigits": 2
          }
        },
        "country": "US",
        "shippingInfo": {
          "shippingMethodName": "UHL",
          "price": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 990,
            "fractionDigits": 2
          },
          "shippingRate": {
            "price": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 990,
              "fractionDigits": 2
            },
            "tiers": []
          },
          "taxRate": {
            "name": "test-tax-category",
            "amount": 0.2,
            "includedInPrice": true,
            "country": "US",
            "id": "HxMyojUT",
            "subRates": []
          },
          "taxCategory": {
            "typeId": "tax-category",
            "id": "44e3081f-e822-44cc-918a-e79240a7284f"
          },
          "deliveries": [],
          "shippingMethod": {
            "typeId": "shipping-method",
            "id": "d7a87341-36bb-4fe2-96a9-5d5d1eada503"
          },
          "taxedPrice": {
            "totalNet": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 825,
              "fractionDigits": 2
            },
            "totalGross": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 990,
              "fractionDigits": 2
            },
            "totalTax": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 165,
              "fractionDigits": 2
            }
          },
          "shippingMethodState": "MatchesCart"
        },
        "customLineItems": [],
        "discountCodes": [],
        "directDiscounts": [],
        "paymentInfo": {
          "payments": [
            {
              "typeId": "payment",
              "id": "029bd8ed-ea47-480f-8bd0-959c1805604d"
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
        "shippingAddress": {
          "firstName": "shakshi",
          "lastName": "poddar",
          "streetName": "1295 Charleston Road",
          "additionalStreetInfo": "5th lane",
          "postalCode": "94043",
          "city": "Mountain View",
          "region": "CA",
          "country": "US",
          "phone": "9876543210",
          "email": "shakshi.poddar@wipro.com"
        },
        "billingAddress": {
          "firstName": "shakshi",
          "lastName": "poddar",
          "streetName": "1295 Charleston Road",
          "additionalStreetInfo": "5th lane",
          "postalCode": "94043",
          "city": "Mountain View",
          "region": "CA",
          "country": "US",
          "phone": "9876543210",
          "email": "shakshi.poddar@wipro.com"
        },
        "itemShippingAddresses": [],
        "totalLineItemQuantity": 1
      }
    ]
  }

  export const  authReversalId = clickToPay.authReversalId

  export const authReversalID = '639721595636641210'

  