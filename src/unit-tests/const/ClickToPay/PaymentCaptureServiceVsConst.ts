import clickToPay from '../../JSON/clickToPay.json';
export const payment = {
    id: '779f9ebb-27f8-45af-b966-56fc7c54c340',
    version: 9,
    lastMessageSequenceNumber: 4,
    createdAt: '2021-11-10T06:15:42.254Z',
    lastModifiedAt: '2021-11-10T06:15:51.960Z',
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
      centAmount: 100,
      fractionDigits: 2
    },
    "paymentMethodInfo": {
      "paymentInterface": "cybersource",
      "method": "clickToPay",
      "name": {
        "en": "Click to Pay"
      }
    },
    custom: {
      type: { typeId: 'type', id: '28701886-4e26-4cab-924e-9b0da3829f88' },
      fields: {
        isv_deviceFingerprintId:"8a22fb00-dc63-496b-b0de-9f1d1fd36a50",
        isv_cardExpiryYear: '25  ',
        isv_token: '4304492039459355101',
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
        id: '598400c2-794b-4d01-aa56-85b546faec20',
        type: 'Authorization',
        amount: [Object],
        interactionId: clickToPay.authId,
        state: 'Success'
      }
    ],
    interfaceInteractions: []
  }

  export const cart = {
    "limit": 20,
    "offset": 0,
    "count": 1,
    "total": 1,
    "results": [
      {
        "type": "Cart",
        "id": "3d09ed42-1b1b-450a-b670-269437683939",
        "version": 17,
        "lastMessageSequenceNumber": 1,
        "createdAt": "2022-04-11T09:08:17.675Z",
        "lastModifiedAt": "2022-04-11T09:11:01.390Z",
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
            "id": "321ea068-968a-431c-a7a5-98615b74cda3",
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
                    "centAmount": 10000,
                    "fractionDigits": 2
                  },
                  "country": "US"
                },
                {
                  "id": "68018b50-2c8a-4304-b67a-ae15389be32d",
                  "value": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 100,
                    "fractionDigits": 2
                  },
                  "country": "US"
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
                "centAmount": 100,
                "fractionDigits": 2
              },
              "country": "US"
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
            "addedAt": "2022-04-11T09:08:17.982Z",
            "lastModifiedAt": "2022-04-11T09:08:17.982Z",
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
              "centAmount": 100,
              "fractionDigits": 2
            },
            "taxedPrice": {
              "totalNet": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 49,
                "fractionDigits": 2
              },
              "totalGross": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 100,
                "fractionDigits": 2
              },
              "totalTax": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 99,
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
          "centAmount": 100,
          "fractionDigits": 2
        },
        "taxedPrice": {
          "totalNet": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 49,
            "fractionDigits": 2
          },
          "totalGross": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 100,
            "fractionDigits": 2
          },
          "taxPortions": [
            {
              "rate": 0.2,
              "amount": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 99,
                "fractionDigits": 2
              },
              "name": "test-tax-category"
            }
          ],
          "totalTax": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 99,
            "fractionDigits": 2
          }
        },
        "country": "US",
        "customLineItems": [],
        "discountCodes": [],
        "directDiscounts": [],
        "paymentInfo": {
          "payments": [
            {
              "typeId": "payment",
              "id": "65e14caa-8250-4f49-9807-f248d08e5c78"
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

  export const authId = clickToPay.authId;

  export const authID = '63972485384166953039';

  export const orderNo = null;

  
  
