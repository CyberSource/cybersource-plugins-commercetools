import * as creditCard from '../../JSON/creditCard.json';

const payment = {
  "id": "391ecb29-75d4-40a4-8f42-40e11d7c3b64",
  "version": 26,
  "versionModifiedAt": "2025-03-12T12:26:45.334Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-12T12:26:26.438Z",
  "lastModifiedAt": "2025-03-12T12:26:45.334Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "e918d04f-e9cb-4b33-8d67-b3971f48eeb6"
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "e918d04f-e9cb-4b33-8d67-b3971f48eeb6"
  },
  "amountPlanned": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 502800,
      "fractionDigits": 2
  },
  "paymentMethodInfo": {
      "paymentInterface": "cybersource",
      "method": "creditCard",
      "name": {
          "en": "Credit Card"
      }
  },
  "custom": {
      "type": {
          "typeId": "type",
          "id": "28bba466-fc03-4801-a823-6c7e6e3586b0"
      },
      "fields": {
          "isv_deviceFingerprintId": "a1cc1516-02f1-4757-bed2-9cbb96e00b0f",
          "isv_token": "eyJraWQiOiIwOGVPREtiRHg3M3ZabkZpQ3ZTZk96WG1jSDVITmJwNCIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA3IiwiZXhwIjoxNzQxNzgzMzAxLCJ0eXBlIjoibWYtMi4xLjAiLCJpYXQiOjE3NDE3ODI0MDEsImp0aSI6IjFFMVlZNVZONzlBSExOWlU3NTlVOTNMRjlBU0dTS0ZITTVZVVAxNElGU05TQTVTT1ExUFQ2N0QxODEwNTdCMzEiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAyOSJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTExMSIsImJpbiI6IjQxMTExMSJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwMSJ9fX19fQ.okEtmQPQ-WcKSoAzAKgTop9opY1ykgx8fvOdfrzCZ_1fNThsufjcqrGOFMpt2e2dW-q6z-sBKgiaJK0-D1gdUKdlJ1SccZVn7pykjlrih_UsDaQQvPB9e67oqV44XwWfRWfrFZSlQJtPhPcQVCM13JkAfgKnY4HR4x3vCuZ4JuSd_0lI27oRaeiPu1ONCsM2twi2QODmO8lfzHiEzI4mGqwA_QX1pqhntrXNvH-vCEM6i3EZkrc2plNnQvmLGgecKP9-cIC5y_3b1m0i_3N1S-vuMAues8rsVnJwAik8BXHQt9vmQShIv-Ccy5uQEMKSwnSoYnF6XR2ARFor7ARoSQ",
          "isv_saleEnabled": false,
          "isv_shippingMethod": "SINGLE",
          "isv_cardType": "001",
          "isv_customerIpAddress": "192.168.1.1",
          "isv_CVVResponse": "3",
          "isv_maskedPan": "411111XXXXXXXXXXXX1111",
          "isv_AVSResponse": "1",
          "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
          "isv_responseCode": "00",
          "isv_responseDateAndTime": "2025-03-12T12:26:45Z",
          "isv_tokenVerificationContext": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJLM25ucTllbGRhVGh0bXdpamd0QjF4QUFFTHZNbFFrOWVXUHo3QlVndWxOc2l4dnNwek9NNXhrVkQ2Q21kRWZRSUNtak9UMEwrZmRZMGZ0SEpESHJSSTlXbHZaVzIxMTdLeEhURDlNS2cxdzA3QU1QdzVjd29RRy9nOFFJVkhQYlI2ZkkiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJzdkc4ZXlUdGlpVUVXRF9sdFJJa0c5eTY2Y1pWTjV2dVM2Vl9pVEREa0s1elUwSVFUR1lPT0p4Sk1tek9kQnh4MHcwbVR3cjFYYkFiWWRvZ29QQ284aXQxTWxBV3JiaG5mY1ctZUxfSlRESGZfQUt0TjN0UHplay0zaEl1eTg1VEJ0d1N0Y2M0NF8zQlJPQk5qUG1ZMXVxLWszTTNVb2VVdHYzMHJoaW9sMldTWlkySUFNOGxkRFdrcnFOUkFMZmppNDJlTVA3ZUx6Z05vTTBwV2ZlRkl6Q1oxcVV2U0tSRTBYUXZORTMwRzFFLWpRU1RqcDJob25tNm00Qml6cXl2V2QyOC1EVG9qMmtkREIwbnpOWktPQlJtMVAtZDJrWEd3MzRHM1ZZdGNzR1ItT3JkNUFaUHd1SUtFTUpqRmtFZHllZVN5dVJGRUlUck5qVU1VWGxrQlEiLCJraWQiOiIwOGVPREtiRHg3M3ZabkZpQ3ZTZk96WG1jSDVITmJwNCJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnlJbnRlZ3JpdHkiOiJzaGEyNTYtM0ZxOVJxQlVDaW1DanRNNGNpZDlia0EyVEJWRUZpWkwvbzZjRzIzVnJHbz0iLCJjbGllbnRMaWJyYXJ5IjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20vbWljcm9mb3JtL2J1bmRsZS92Mi41LjIvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCJdLCJ0YXJnZXRPcmlnaW5zIjpbImh0dHBzOi8vbG9jYWxob3N0OjgwODAiLCJodHRwczovL2xvY2FsaG9zdDo4MDg0IiwiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4NSJdLCJtZk9yaWdpbiI6Imh0dHBzOi8vdGVzdGZsZXguY3liZXJzb3VyY2UuY29tIiwiYWxsb3dlZFBheW1lbnRUeXBlcyI6WyJDQVJEIl19LCJ0eXBlIjoibWYtMi4xLjAifV0sImlzcyI6IkZsZXggQVBJIiwiZXhwIjoxNzQxNzgzMjg2LCJpYXQiOjE3NDE3ODIzODYsImp0aSI6IlQzVWxhaEVMWnZZR3hsNTcifQ.O2gjECUbToZBfATr-OJZzRAsKwROE0NUoemM3hwfFdI",
          "isv_cardExpiryYear": "2029",
          "isv_merchantId": "",
          "isv_authorizationStatus": "AUTHORIZED",
          "isv_cardExpiryMonth": "01"
      }
  },
  "paymentStatus": {},
  "transactions": [
      {
          "id": "60f6cc04-21c0-4125-9946-07126ab38534",
          "timestamp": "2025-03-12T12:26:44.393Z",
          "type": "Authorization",
          "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 502800,
              "fractionDigits": 2
          },
          "interactionId": "7417824049026054204807",
          "state": "Success"
      }
  ],
  "interfaceInteractions": [],
  "anonymousId": "e918d04f-e9cb-4b33-8d67-b3971f48eeb6"
};  

const authId = creditCard.authId;

const authID = '6396510479606597503';

const cart = {
  "type": "Cart",
  "id": "0bd44b78-5ece-4257-baa3-dfd18f2ca70e",
  "version": 16,
  "versionModifiedAt": "2025-03-12T12:26:45.941Z",
  "lastMessageSequenceNumber": 1,
  "createdAt": "2025-03-12T12:26:17.091Z",
  "lastModifiedAt": "2025-03-12T12:26:45.939Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "e918d04f-e9cb-4b33-8d67-b3971f48eeb6"
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "e918d04f-e9cb-4b33-8d67-b3971f48eeb6"
  },
  "anonymousId": "e918d04f-e9cb-4b33-8d67-b3971f48eeb6",
  "locale": "en",
  "lineItems": [
      {
          "id": "2c668a73-aa70-40c2-a980-f056cedd78e3",
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
          "addedAt": "2025-03-12T12:26:17.370Z",
          "lastModifiedAt": "2025-03-12T12:26:17.370Z",
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
      "centAmount": 502800,
      "fractionDigits": 2
  },
  "taxedPrice": {
      "totalNet": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 502800,
          "fractionDigits": 2
      },
      "totalGross": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 553080,
          "fractionDigits": 2
      },
      "taxPortions": [
          {
              "rate": 0.1,
              "amount": {
                  "type": "centPrecision",
                  "currencyCode": "USD",
                  "centAmount": 50280,
                  "fractionDigits": 2
              },
              "name": "en"
          }
      ],
      "totalTax": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 50280,
          "fractionDigits": 2
      }
  },
  "country": "US",
  "taxedShippingPrice": {
      "totalNet": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 900,
          "fractionDigits": 2
      },
      "totalGross": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 990,
          "fractionDigits": 2
      },
      "taxPortions": [
          {
              "rate": 0.1,
              "amount": {
                  "type": "centPrecision",
                  "currencyCode": "USD",
                  "centAmount": 90,
                  "fractionDigits": 2
              },
              "name": "en"
          }
      ],
      "totalTax": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 90,
          "fractionDigits": 2
      }
  },
  "shippingMode": "Single",
  "shippingInfo": {
      "shippingMethodName": "DHL",
      "price": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 900,
          "fractionDigits": 2
      },
      "shippingRate": {
          "price": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 900,
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
              "centAmount": 900,
              "fractionDigits": 2
          },
          "totalGross": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 990,
              "fractionDigits": 2
          },
          "taxPortions": [
              {
                  "rate": 0.1,
                  "amount": {
                      "type": "centPrecision",
                      "currencyCode": "USD",
                      "centAmount": 90,
                      "fractionDigits": 2
                  },
                  "name": "en"
              }
          ],
          "totalTax": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 90,
              "fractionDigits": 2
          }
      },
      "shippingMethodState": "MatchesCart"
  },
  "shippingAddress": {
      "firstName": "test",
      "lastName": "t",
      "streetName": "123 ch rd",
      "additionalStreetInfo": "",
      "postalCode": "94045",
      "city": "CA",
      "region": "AL",
      "country": "US",
      "phone": "9876543210",
      "email": "test@gmail.com"
  },
  "shipping": [],
  "customLineItems": [],
  "discountCodes": [],
  "directDiscounts": [],
  "paymentInfo": {
      "payments": [
          {
              "typeId": "payment",
              "id": "391ecb29-75d4-40a4-8f42-40e11d7c3b64"
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
      "firstName": "test",
      "lastName": "t",
      "streetName": "123 ch rd",
      "additionalStreetInfo": "",
      "postalCode": "94045",
      "city": "CA",
      "region": "AL",
      "country": "US",
      "phone": "9876543210",
      "email": "test@gmail.com"
  },
  "itemShippingAddresses": [],
  "discountTypeCombination": {
      "type": "Stacking"
  },
  "totalLineItemQuantity": 1
};

const orderNo = '';

const orderNumber = '10';

const updateTransactions = {
  id: '095def14-2513-4a80-8488-ea2d74c184c2',
  timestamp: '2023-03-31T11:22:27.157Z',
  type: 'Charge',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 100,
    fractionDigits: 2,
  },
  state: 'Initial',
};

export default {
  payment,
  authId,
  authID,
  cart,
  orderNo,
  orderNumber,
  updateTransactions
}