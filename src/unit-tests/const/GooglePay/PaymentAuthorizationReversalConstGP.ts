import googlePay from '../../JSON/googlePay.json';
const payment = {
  "id": "4ee29ff0-a37d-47c2-95c1-5fff829e4310",
  "version": 12,
  "versionModifiedAt": "2025-03-13T07:08:43.128Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-13T07:08:38.576Z",
  "lastModifiedAt": "2025-03-13T07:08:43.128Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "7e97baa2-a5bc-4a46-90ec-ecb3c02d8075"
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "7e97baa2-a5bc-4a46-90ec-ecb3c02d8075"
  },
  "amountPlanned": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 501900,
      "fractionDigits": 2
  },
  "paymentMethodInfo": {
      "paymentInterface": "cybersource",
      "method": "googlePay",
      "name": {
          "en": "Google Pay"
      }
  },
  "custom": {
      "type": {
          "typeId": "type",
          "id": "28bba466-fc03-4801-a823-6c7e6e3586b0"
      },
      "fields": {
          "isv_deviceFingerprintId": "6e94aa2c-3289-48c5-9256-3212f9a597af",
          "isv_token": "eyJzaWduYXR1cmUiOiJNRVVDSVFESmgzRGl3NXJxemt6OUcwTjhjM3U1MDNhZkhNK0dOVFMvR0pJMHhGeGxhUUlnTWpvKzZqZVFnL29QSTllbTgvNkl6ZnJXcTBrTXkrZUVZclJhUDE5RXZqZ1x1MDAzZCIsInByb3RvY29sVmVyc2lvbiI6IkVDdjEiLCJzaWduZWRNZXNzYWdlIjoie1wiZW5jcnlwdGVkTWVzc2FnZVwiOlwidGNoMW9DTVFlZ1JpdC96dmJyR1M3Qk5NSm1YMjZ2dGM0MHhIM2lBUkpYb1RWL2pWUVBIV016MWFsaVl2blZPeVhpaXJrK2Zkb2UzMGxidWliSkRScktFTTc2amdpYWN3enpob09Jcytxc2EyMGN6OTZBMUlmNk9pcUFEY2xBMTBDQW05MlRMQU9oS3dIOW1ucmEyb3FORE54dWNzYWxiNUMxeHdvUlNtZUExSFNTM1ozOFRJL2Z3NktYc0RxOUN0TGU2cWl4dk1NVXlqV0NJTjZhYld0ZDZhbzVkZG9lMU9DeEkvT0JRRmp3QnNlQ1A0STJrR3lLSmx4a0Raa2w5cm5uSjl5YjRsVXI4a1FaVGRrQnJOVXVmbUE5YUxqK2w5aUlvUTJmdXdlbWJpdTluTHZRenZHY2ZObWprRkl1d0xyTno0ZjVRdUFqU2Z5WVFiaDRqbjUrN3V2QnBwUXpSWlVxbDlZOWpBdTduZDUvbGdoa0pwRlh5Rlg4N1Q3SDh2aXNIUnpGUGlhajNUVm5nQnVQRU9tbzAwRkhXVVQvMHN5ZEJZL3E4XFx1MDAzZFwiLFwiZXBoZW1lcmFsUHVibGljS2V5XCI6XCJCRXJjWkJJSEZBQll6cktaQWh5Y3Z2YmF3MWhSTjF3cDdhQWp2N3E2bEdFYUVaRmNsSDRIWk1iNm5zNytNQXdRS0FHMmNXN2ppY0dHbVhiTWszV25yVFFcXHUwMDNkXCIsXCJ0YWdcIjpcIjRRdkxKVDZtUkEyR04wb3ZVTGkwUUJnUmtmR3BjditBcmlMN0VKVEVmTVlcXHUwMDNkXCJ9In0=",
          "isv_saleEnabled": false,
          "isv_shippingMethod": "SINGLE",
          "isv_customerIpAddress": "192.168.1.1",
          "isv_maskedPan": "400000XXXXXX1000",
          "isv_AVSResponse": "1",
          "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
          "isv_responseCode": "00",
          "isv_responseDateAndTime": "2025-03-13T07:08:42Z",
          "isv_userAgentHeader": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
          "isv_cardExpiryYear": "2027",
          "isv_merchantId": "",
          "isv_acceptHeader": "*/*",
          "isv_cardType": "001",
          "isv_authorizationStatus": "AUTHORIZED",
          "isv_cardExpiryMonth": "01"
      }
  },
  "paymentStatus": {},
  "transactions": [
      {
          "id": "ef010891-90a1-43b6-8cf9-6fc4f290e278",
          "timestamp": "2025-03-13T07:08:41.897Z",
          "type": "Authorization",
          "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 501900,
              "fractionDigits": 2
          },
          "interactionId": googlePay.authReversalId,
          "state": "Success"
      }
  ],
  "interfaceInteractions": [],
  "anonymousId": "7e97baa2-a5bc-4a46-90ec-ecb3c02d8075"
};

const cart = {
  "type": "Cart",
  "id": "23ea2a8e-0588-4be6-8bec-65efd3d611dc",
  "version": 16,
  "versionModifiedAt": "2025-03-13T07:08:43.794Z",
  "lastMessageSequenceNumber": 1,
  "createdAt": "2025-03-13T07:08:18.907Z",
  "lastModifiedAt": "2025-03-13T07:08:43.790Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "7e97baa2-a5bc-4a46-90ec-ecb3c02d8075"
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "7e97baa2-a5bc-4a46-90ec-ecb3c02d8075"
  },
  "anonymousId": "7e97baa2-a5bc-4a46-90ec-ecb3c02d8075",
  "locale": "en",
  "lineItems": [
      {
          "id": "02f99105-a118-4239-bb90-14f5a39a39c5",
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
          "addedAt": "2025-03-13T07:08:19.234Z",
          "lastModifiedAt": "2025-03-13T07:08:19.234Z",
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
              "id": "4ee29ff0-a37d-47c2-95c1-5fff829e4310"
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

const authReversalId = googlePay.authReversalId;

const authReversalID = '640159216998640950395';

const payments = {
  id: '6b3158a4-6c72-403e-bda1-48d95367cb02',
  version: 5,
  lastMessageSequenceNumber: 4,
  createdAt: '2021-12-22T07:46:52.751Z',
  lastModifiedAt: '2021-12-22T07:46:57.983Z',
  lastModifiedBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: '88c278f9-82d9-427c-96df-f98a4f23e543',
    },
  },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: '88c278f9-82d9-427c-96df-f98a4f23e543',
    },
  },
  customer: {
    typeId: 'customer',
    id: '88c278f9-82d9-427c-96df-f98a4f23e543',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: googlePay.centAmountValue,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'googlePay',
    name: {
      en: 'Google Pay',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '87b9d9db-74a3-45d7-8e60-dde669866808',
    },
    fields: {
      isv_deviceFingerprintId: '8a22fb00-dc63-496b-b0de-9f1d1fd36a50',
      isv_cardExpiryYear: '2027',
      isv_token:
        'eyJzaWduYXR1cmUiOiJNRVFDSURrbGkxSVQzTHpmOGlaVHJqRndyUERudy9PVzB0bzVhQ05MTnZyNFh1Z0NBaUFHMTJCeU1QNXhuTHhhVGErSzBDVFl6TGVycjQ4cmgwN3pFWmJvS3NRRTNnXHUwMDNkXHUwMDNkIiwicHJvdG9jb2xWZXJzaW9uIjoiRUN2MSIsInNpZ25lZE1lc3NhZ2UiOiJ7XCJlbmNyeXB0ZWRNZXNzYWdlXCI6XCJmdGhBZDBzeHg5TzBzWlpSSm5zeWdnTWlkK3E1dFFFZmhvT3kvSTFWUUxYcWRQTVVuN2NWbXR3S3hMU0FhQzVtMWpCbmVDbXNNVUdJbzBEU1VpRFV3cHh0MmE0czlIUFpacU93VE1QOFcrMTFjcy8rSzRXSVh2cEFSSis0RTRRa1pmcEdEYkRUL0N3Q2EyTkhnYnFjU0d3RjlOMkhVY0JJWm1qeGRONE4zeFRXUTYxVitSUnBSd2ZKTVlFZkZqemRSakJsNE1KWXFDbWVyMWh3eUZGemdabTQ5YWtYKzRiRHdzZWlCUWI2L2xIdWljNENlVUlqb296Yml3a092aTVvTkVBeDhWTXp1TURob3FHSnlhdVZDbEVaYjJBZnF4dXlaQk1ZaUFrQSt4SHRzTXdqdUR3bWZBd2NoZTMwSmRxd2V6cXpuNDQyS1didHZROVN4ZGk4U3ZWa1FraVVPVk01V1JTdnBDYW9LTTJMKzN5MyszamRxV0NDVFA1QTZZRWphSExpNHJaSEY2L3VWUVRWZGtEeS80d0lKdkx4KzdvYUJwMVVLTjRXbXNrVEM1MHNmKzFDaUhqSkUxWHZoMzdGODZHK1wiLFwiZXBoZW1lcmFsUHVibGljS2V5XCI6XCJCS3JRSXdQNHRoWkdpNGxoN01seU4xSXlPNTdNb3hoenRJdmU3b2tOd1FaQTB0dk5FZjdoclB1TDEyWGtnWitvc1FxRzJaK3VQNWQ2c3FMV1pVUExkS0VcXHUwMDNkXCIsXCJ0YWdcIjpcInpIUmdWOXVXZ0FkUlk3T1ZTQUpWQUt0b0pLSlZIa01CdGxDVTVJTWtLTW9cXHUwMDNkXCJ9In0=',
      isv_customerIpAddress: '106.202.150.94',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '12',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '3b141bbf-574d-4c6a-80bd-4bf875762805',
      timestamp: '2021-12-22T07:46:57.530Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 5980,
        fractionDigits: 2,
      },
      interactionId: '6401782510106885503955',
      state: 'Success',
    },
  ],
  interfaceInteractions: [],
};

const shippingCart = {
  type: 'Cart',
  id: '26e44ca8-794f-4bc5-84db-4b476eb4fed1',
  version: 16,
  versionModifiedAt: '2023-04-21T07:15:39.775Z',
  lastMessageSequenceNumber: 1,
  createdAt: '2023-04-21T07:13:31.827Z',
  lastModifiedAt: '2023-04-21T07:15:39.775Z',
  lastModifiedBy: {
    clientId: 'C0f71msxpiTpAB0OiOaItOs8',
    isPlatformClient: false,
    anonymousId: '475f215e-9a1e-49f1-8756-8fadac9a5623',
  },
  createdBy: {
    clientId: 'C0f71msxpiTpAB0OiOaItOs8',
    isPlatformClient: false,
    anonymousId: '475f215e-9a1e-49f1-8756-8fadac9a5623',
  },
  anonymousId: '475f215e-9a1e-49f1-8756-8fadac9a5623',
  locale: 'en-US',
  lineItems: [
    {
      id: '77197bf1-a747-499b-88e4-df16ff235f9f',
      productId: 'c28cfa09-801e-4309-8e2e-edf39f85ddf2',
      name: {
        en: 'sandalen Aubrey Michael Kors brown',
        de: 'sandalen Aubrey Michael Kors brown',
        'en-US': 'sandalen Aubrey Michael Kors brown',
        'de-DE': 'sandalen Aubrey Michael Kors brown',
      },
      productType: {
        typeId: 'product-type',
        id: '404a5e8f-70a7-41a3-9b39-0b02b1b90b83',
        version: 1,
      },
      productSlug: {
        en: 'a5',
        de: 'a5',
        'en-US': 'a5',
        'de-DE': 'a5',
      },
      variant: {
        id: 1,
        sku: 'sku-5',
        prices: [
          {
            id: '4306d10f-8582-44f5-9cce-201be3066555',
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 8000,
              fractionDigits: 2,
            },
            country: 'DE',
          },
          {
            id: '99663748-061c-46f1-b6ad-13cd7872b817',
            value: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 8000,
              fractionDigits: 2,
            },
            country: 'US',
          },
        ],
        images: [
          {
            url: 'https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/082405_1_medium.jpg',
            dimensions: {
              w: 300,
              h: 375,
            },
          },
        ],
        attributes: [],
        assets: [],
      },
      price: {
        id: '99663748-061c-46f1-b6ad-13cd7872b817',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 8000,
          fractionDigits: 2,
        },
        country: 'US',
      },
      quantity: 1,
      discountedPricePerQuantity: [],
      perMethodTaxRate: [],
      addedAt: '2023-04-21T07:13:32.176Z',
      lastModifiedAt: '2023-04-21T07:13:32.176Z',
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: '8e52f9e7-5650-4d0f-a4bf-7d6ba7c2f98f',
          },
        },
      ],
      priceMode: 'Platform',
      lineItemMode: 'Standard',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 8000,
        fractionDigits: 2,
      },
      taxedPricePortions: [],
    },
  ],
  cartState: 'Active',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 10180,
    fractionDigits: 2,
  },
  country: 'US',
  shippingMode: 'Multiple',
  shipping: [
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
  customLineItems: [],
  discountCodes: [],
  directDiscounts: [],
  paymentInfo: {
    payments: [
      {
        typeId: 'payment',
        id: '8bac631c-8d54-4c80-95fb-aac3f7b294cf',
      },
    ],
  },
  inventoryMode: 'None',
  taxMode: 'Platform',
  taxRoundingMode: 'HalfEven',
  taxCalculationMode: 'LineItemLevel',
  deleteDaysAfterLastModification: 90,
  refusedGifts: [],
  origin: 'Customer',
  billingAddress: {
    firstName: 'john',
    lastName: 'doe',
    streetName: '1295 Charleston Road',
    postalCode: '94043',
    city: 'Mountain View',
    region: 'CA',
    country: 'US',
    phone: '9876543210',
    email: 'john.doe@wipro.com',
  },
  itemShippingAddresses: [],
  totalLineItemQuantity: 1,
};

const multipleShippingPayment = {
  "id": "4146a797-2136-42c5-bd52-dde2cb71a138",
  "version": 12,
  "versionModifiedAt": "2025-03-13T06:38:28.778Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-13T06:38:24.526Z",
  "lastModifiedAt": "2025-03-13T06:38:28.778Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "7e97baa2-a5bc-4a46-90ec-ecb3c02d8075"
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "7e97baa2-a5bc-4a46-90ec-ecb3c02d8075"
  },
  "amountPlanned": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 501900,
      "fractionDigits": 2
  },
  "paymentMethodInfo": {
      "paymentInterface": "cybersource",
      "method": "googlePay",
      "name": {
          "en": "Google Pay"
      }
  },
  "custom": {
      "type": {
          "typeId": "type",
          "id": "28bba466-fc03-4801-a823-6c7e6e3586b0"
      },
      "fields": {
          "isv_deviceFingerprintId": "a2b9b7b2-a26b-4910-977b-d1a1c4c39fb7",
          "isv_token": "eyJzaWduYXR1cmUiOiJNRVVDSUZRaWZQRWtKMUxxdkRVQm45cTByZVpwOTlYV2VDQStITEIvdmhoalNVMU9BaUVBdms3Y3Rick9PUlF3ejV3SXJNS25oMzFvdmgyUnQxdWJGOW9tWElXalpLZ1x1MDAzZCIsInByb3RvY29sVmVyc2lvbiI6IkVDdjEiLCJzaWduZWRNZXNzYWdlIjoie1wiZW5jcnlwdGVkTWVzc2FnZVwiOlwiUUFTbGNad3JHR2loOEJPT1E5WjhJNFhGVWp3Qk01aTA5VWpvUzd6aU81bC90TFRRWkx5OVVWRlNpMVhsUmpSaWd3d3lHSHJFYWlqN0RnSGtiVGptZmxkS3EyR2o1TXkyS0xpWUFoNVNTZ0QvWGhWNmVlSmNEVWJhcEcrRmhmQmd4d2lIQ2d4cE9BWG5MRXdTeEc2SGluL3NqVGNVUFFDL0J5Ny9WWFlzdVBSSjh5NDcvdDdSMzhSdFd5RnhLS1ZvQTBzK1UwU2s2OVlpSUlNT3lrMkV2anVRZzFRVTlxcGo3QklPWkRRL3BZMmNWbmNUbUUrWnBlSjFlb3ZiVEVrZVUwVnRxSU41aytkVjhkYndZa3VOZ1FJMGNxcWpqUUFmQ3FqVUpsNlE3QncxRjNBK1hXcW9VOWxRdVNwTEVFNml3M1N2Q00zbDFwMU5kaHA0a0YxQUtnNkExV1lYcm1XeXNZMTlhZ2hNUnRVVzFCNld5aFNFMGtHQ05SenRXRU1CRklKZkhiWmhTY09YYStmQUdWSU5DWHR4Q3VnWktIQ0JaQ1UrMHFFXFx1MDAzZFwiLFwiZXBoZW1lcmFsUHVibGljS2V5XCI6XCJCRHh5YzRkeTBSaE1qU1V2WkJpRDFzczlxaVQxd3BkaGFwMkQ2NTdlMTV3Q1JZOGsrN3NxMndKMGlRVHZFeld1OWNhN1BoaHpzak5iekZqU0JWUG5DcXdcXHUwMDNkXCIsXCJ0YWdcIjpcIlk5WExxd3pSbitsNStLSnAzYnZOL2huMkNEMzZ1QURUZ2hWVHhleGFxcUFcXHUwMDNkXCJ9In0=",
          "isv_saleEnabled": false,
          "isv_shippingMethod": "SINGLE",
          "isv_customerIpAddress": "192.168.1.1",
          "isv_maskedPan": "400000XXXXXX1000",
          "isv_AVSResponse": "1",
          "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
          "isv_responseCode": "00",
          "isv_responseDateAndTime": "2025-03-13T06:38:28Z",
          "isv_userAgentHeader": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
          "isv_cardExpiryYear": "2027",
          "isv_merchantId": "",
          "isv_acceptHeader": "*/*",
          "isv_cardType": "001",
          "isv_authorizationStatus": "AUTHORIZED",
          "isv_cardExpiryMonth": "01"
      }
  },
  "paymentStatus": {},
  "transactions": [
      {
          "id": "c9efa9e9-b7da-495c-bfe7-4667e3b5a5cf",
          "timestamp": "2025-03-13T06:38:27.533Z",
          "type": "Authorization",
          "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 501900,
              "fractionDigits": 2
          },
          "interactionId": googlePay.multipleShippingAuthReversalId,
          "state": "Success"
      }
  ],
  "interfaceInteractions": [],
  "anonymousId": "7e97baa2-a5bc-4a46-90ec-ecb3c02d8075"
};

const multipleShippingReversalId = googlePay.multipleShippingAuthReversalId;

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