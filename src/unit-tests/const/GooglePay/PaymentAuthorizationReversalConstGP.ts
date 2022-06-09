import googlePay from '../../JSON/googlePay.json'
export const payment = 
{
    "id":"6b3158a4-6c72-403e-bda1-48d95367cb02",
    "version":5,
    "lastMessageSequenceNumber":4,
    "createdAt":"2021-12-22T07:46:52.751Z",
    "lastModifiedAt":"2021-12-22T07:46:57.983Z",
    "lastModifiedBy":
    {
        "clientId":"iFOAd29Lew5ADrpakIhQkz_N",
        "isPlatformClient":false,
        "customer":
        {
            "typeId":"customer",
            "id":"88c278f9-82d9-427c-96df-f98a4f23e543"
        }
    },
    "createdBy":
    {
        "clientId":"iFOAd29Lew5ADrpakIhQkz_N",
        "isPlatformClient":false,
        "customer":
        {
            "typeId":"customer",
            "id":"88c278f9-82d9-427c-96df-f98a4f23e543"
        }
    },
    "customer":
    {
        "typeId":"customer",
        "id":"88c278f9-82d9-427c-96df-f98a4f23e543"
    },
    "amountPlanned":
    {
        "type":"centPrecision",
        "currencyCode":"USD",
        "centAmount":googlePay.centAmount,
        "fractionDigits":2
    },
    "paymentMethodInfo":
    {
        "paymentInterface":"cybersource",
        "method":"googlePay",
        "name":
        {
            "en":"Google Pay"
        }
    },
    "custom":
    {
        "type":
        {
            "typeId":"type",
            "id":"87b9d9db-74a3-45d7-8e60-dde669866808"
        },
        "fields":
        {
            "isv_deviceFingerprintId":"8a22fb00-dc63-496b-b0de-9f1d1fd36a50",
            "isv_cardExpiryYear":"2027",
            "isv_token":"eyJzaWduYXR1cmUiOiJNRVFDSURrbGkxSVQzTHpmOGlaVHJqRndyUERudy9PVzB0bzVhQ05MTnZyNFh1Z0NBaUFHMTJCeU1QNXhuTHhhVGErSzBDVFl6TGVycjQ4cmgwN3pFWmJvS3NRRTNnXHUwMDNkXHUwMDNkIiwicHJvdG9jb2xWZXJzaW9uIjoiRUN2MSIsInNpZ25lZE1lc3NhZ2UiOiJ7XCJlbmNyeXB0ZWRNZXNzYWdlXCI6XCJmdGhBZDBzeHg5TzBzWlpSSm5zeWdnTWlkK3E1dFFFZmhvT3kvSTFWUUxYcWRQTVVuN2NWbXR3S3hMU0FhQzVtMWpCbmVDbXNNVUdJbzBEU1VpRFV3cHh0MmE0czlIUFpacU93VE1QOFcrMTFjcy8rSzRXSVh2cEFSSis0RTRRa1pmcEdEYkRUL0N3Q2EyTkhnYnFjU0d3RjlOMkhVY0JJWm1qeGRONE4zeFRXUTYxVitSUnBSd2ZKTVlFZkZqemRSakJsNE1KWXFDbWVyMWh3eUZGemdabTQ5YWtYKzRiRHdzZWlCUWI2L2xIdWljNENlVUlqb296Yml3a092aTVvTkVBeDhWTXp1TURob3FHSnlhdVZDbEVaYjJBZnF4dXlaQk1ZaUFrQSt4SHRzTXdqdUR3bWZBd2NoZTMwSmRxd2V6cXpuNDQyS1didHZROVN4ZGk4U3ZWa1FraVVPVk01V1JTdnBDYW9LTTJMKzN5MyszamRxV0NDVFA1QTZZRWphSExpNHJaSEY2L3VWUVRWZGtEeS80d0lKdkx4KzdvYUJwMVVLTjRXbXNrVEM1MHNmKzFDaUhqSkUxWHZoMzdGODZHK1wiLFwiZXBoZW1lcmFsUHVibGljS2V5XCI6XCJCS3JRSXdQNHRoWkdpNGxoN01seU4xSXlPNTdNb3hoenRJdmU3b2tOd1FaQTB0dk5FZjdoclB1TDEyWGtnWitvc1FxRzJaK3VQNWQ2c3FMV1pVUExkS0VcXHUwMDNkXCIsXCJ0YWdcIjpcInpIUmdWOXVXZ0FkUlk3T1ZTQUpWQUt0b0pLSlZIa01CdGxDVTVJTWtLTW9cXHUwMDNkXCJ9In0=",
            "isv_customerIpAddress":"106.202.150.94",
            "isv_maskedPan":"411111XXXXXX1111",
            "isv_cardExpiryMonth":"12",
            "isv_userAgentHeader":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
            "isv_acceptHeader":"*/*",
            "isv_cardType":"001"
        }
    },
    "paymentStatus":{},
    "transactions":
    [
        {
            "id":"3b141bbf-574d-4c6a-80bd-4bf875762805",
            "timestamp":"2021-12-22T07:46:57.530Z",
            "type":"Authorization",
            "amount":
            {
                "type":"centPrecision",
                "currencyCode":"USD",
                "centAmount":5980,
                "fractionDigits":2
            },
            "interactionId":googlePay.authReversalId,
            "state":"Success"
        }
    ],
    "interfaceInteractions":[]
}

export const cart = {
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

export const authReversalId= googlePay.authReversalId

export const authReversalID = '640159216998640950395';


    export const payments = 
    {
        "id":"6b3158a4-6c72-403e-bda1-48d95367cb02",
        "version":5,
        "lastMessageSequenceNumber":4,
        "createdAt":"2021-12-22T07:46:52.751Z",
        "lastModifiedAt":"2021-12-22T07:46:57.983Z",
        "lastModifiedBy":
        {
            "clientId":"iFOAd29Lew5ADrpakIhQkz_N",
            "isPlatformClient":false,
            "customer":
            {
                "typeId":"customer",
                "id":"88c278f9-82d9-427c-96df-f98a4f23e543"
            }
        },
        "createdBy":
        {
            "clientId":"iFOAd29Lew5ADrpakIhQkz_N",
            "isPlatformClient":false,
            "customer":
            {
                "typeId":"customer",
                "id":"88c278f9-82d9-427c-96df-f98a4f23e543"
            }
        },
        "customer":
        {
            "typeId":"customer",
            "id":"88c278f9-82d9-427c-96df-f98a4f23e543"
        },
        "amountPlanned":
        {
            "type":"centPrecision",
            "currencyCode":"USD",
            "centAmount":googlePay.centAmountValue,
            "fractionDigits":2
        },
        "paymentMethodInfo":
        {
            "paymentInterface":"cybersource",
            "method":"googlePay",
            "name":
            {
                "en":"Google Pay"
            }
        },
        "custom":
        {
            "type":
            {
                "typeId":"type",
                "id":"87b9d9db-74a3-45d7-8e60-dde669866808"
            },
            "fields":
            {
                "isv_deviceFingerprintId":"8a22fb00-dc63-496b-b0de-9f1d1fd36a50",
                "isv_cardExpiryYear":"2027",
                "isv_token":"eyJzaWduYXR1cmUiOiJNRVFDSURrbGkxSVQzTHpmOGlaVHJqRndyUERudy9PVzB0bzVhQ05MTnZyNFh1Z0NBaUFHMTJCeU1QNXhuTHhhVGErSzBDVFl6TGVycjQ4cmgwN3pFWmJvS3NRRTNnXHUwMDNkXHUwMDNkIiwicHJvdG9jb2xWZXJzaW9uIjoiRUN2MSIsInNpZ25lZE1lc3NhZ2UiOiJ7XCJlbmNyeXB0ZWRNZXNzYWdlXCI6XCJmdGhBZDBzeHg5TzBzWlpSSm5zeWdnTWlkK3E1dFFFZmhvT3kvSTFWUUxYcWRQTVVuN2NWbXR3S3hMU0FhQzVtMWpCbmVDbXNNVUdJbzBEU1VpRFV3cHh0MmE0czlIUFpacU93VE1QOFcrMTFjcy8rSzRXSVh2cEFSSis0RTRRa1pmcEdEYkRUL0N3Q2EyTkhnYnFjU0d3RjlOMkhVY0JJWm1qeGRONE4zeFRXUTYxVitSUnBSd2ZKTVlFZkZqemRSakJsNE1KWXFDbWVyMWh3eUZGemdabTQ5YWtYKzRiRHdzZWlCUWI2L2xIdWljNENlVUlqb296Yml3a092aTVvTkVBeDhWTXp1TURob3FHSnlhdVZDbEVaYjJBZnF4dXlaQk1ZaUFrQSt4SHRzTXdqdUR3bWZBd2NoZTMwSmRxd2V6cXpuNDQyS1didHZROVN4ZGk4U3ZWa1FraVVPVk01V1JTdnBDYW9LTTJMKzN5MyszamRxV0NDVFA1QTZZRWphSExpNHJaSEY2L3VWUVRWZGtEeS80d0lKdkx4KzdvYUJwMVVLTjRXbXNrVEM1MHNmKzFDaUhqSkUxWHZoMzdGODZHK1wiLFwiZXBoZW1lcmFsUHVibGljS2V5XCI6XCJCS3JRSXdQNHRoWkdpNGxoN01seU4xSXlPNTdNb3hoenRJdmU3b2tOd1FaQTB0dk5FZjdoclB1TDEyWGtnWitvc1FxRzJaK3VQNWQ2c3FMV1pVUExkS0VcXHUwMDNkXCIsXCJ0YWdcIjpcInpIUmdWOXVXZ0FkUlk3T1ZTQUpWQUt0b0pLSlZIa01CdGxDVTVJTWtLTW9cXHUwMDNkXCJ9In0=",
                "isv_customerIpAddress":"106.202.150.94",
                "isv_maskedPan":"411111XXXXXX1111",
                "isv_cardExpiryMonth":"12",
                "isv_userAgentHeader":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
                "isv_acceptHeader":"*/*",
                "isv_cardType":"001"
            }
        },
        "paymentStatus":{},
        "transactions":
        [
            {
                "id":"3b141bbf-574d-4c6a-80bd-4bf875762805",
                "timestamp":"2021-12-22T07:46:57.530Z",
                "type":"Authorization",
                "amount":
                {
                    "type":"centPrecision",
                    "currencyCode":"USD",
                    "centAmount":5980,
                    "fractionDigits":2
                },
                "interactionId":"6401782510106885503955",
                "state":"Success"
            }
        ],
        "interfaceInteractions":[]
    }