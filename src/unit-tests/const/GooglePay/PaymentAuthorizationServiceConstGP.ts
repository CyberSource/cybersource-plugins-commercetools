import creditCard from '../../JSON/creditCard.json';
import googlePay from '../../JSON/googlePay.json';

const payment = {
  "id": "019b8cc9-b4bf-4823-b0d6-7445e3c85f7a",
  "version": 12,
  "versionModifiedAt": "2025-03-13T09:28:27.684Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-13T09:28:23.196Z",
  "lastModifiedAt": "2025-03-13T09:28:27.684Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "customer": {
          "typeId": "customer",
          "id": "5917bbf8-2b3a-4934-9dcc-cbda0778719f"
      }
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "customer": {
          "typeId": "customer",
          "id": "5917bbf8-2b3a-4934-9dcc-cbda0778719f"
      }
  },
  "customer": {
      "typeId": "customer",
      "id": "5917bbf8-2b3a-4934-9dcc-cbda0778719f"
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
          "isv_deviceFingerprintId": "ac132a38-bfc1-41d9-835d-e57439a841d8",
          "isv_token": "eyJzaWduYXR1cmUiOiJNRVlDSVFEUzJ5ZkRSL2tIL1VHc2ZlMDBsc005aVNaUGNiK3VIM3dWVlZQVTlVcVRmQUloQUw0RXNrY0xBWU8vcEZyY0FuNnhtRmU0WWZVSlNGSlBua1N3WTlESy9hQ1EiLCJwcm90b2NvbFZlcnNpb24iOiJFQ3YxIiwic2lnbmVkTWVzc2FnZSI6IntcImVuY3J5cHRlZE1lc3NhZ2VcIjpcIlBYaWJaRnExT3NYZ1puTnJzOFl2clVEaFQvK01vbDdEcWQ1REF1UFJ0amFTNk5RYzRkZlM5Y2JGQ2JhYS8xQ2JxZVdBYmJ1Q2xGdmJGRjFhTXRGSHBhQk9vU2JpSWN1YUdmQjJneFI4RFNsaVNjeFY3SGIvS2RjY0hxL0NlaStjRGNrMWxENlFUZlhrK3U5ZzloRVJ3QUswWVVpbllEWDFIU1NEaTBlbWE1bkZwL1Jmck1QSWFNU0RtUFZOa0lLUEFLUzlpUHdxcVIvM1hPWWtxYy9oUUZSaTJQYWdwa09jNVdRRzdYai8vSnpNU3hXNTJHS1hIbGVoN1d3U01xZW9rcExOU2kwWC96RzZoc0krQ0xRd0xkWkMzYmVETXFabHJkK3p4YkNXS0tLaURRYWd6SjBpT3hGamRDKzNveGo4c1kxQXhSZm5zdmZyYzZIdW9YVU5Tay95V0hhajNJdnFBcDc3M3NwVFJqZ3R2R0c4SisrR1hVOHJCcEp3QWdiUkV3cVo3UGtETzhWdmFJZkkzbHdFd3lONHJST0JDU243Wm4wOHhSa1xcdTAwM2RcIixcImVwaGVtZXJhbFB1YmxpY0tleVwiOlwiQkNwR29ZU2thZjhEVi9PWkx5VEhOb2hFUFB4SXJNT1BUZ2ZiMzlxS0V4OEo2Z1hQWG1YU2EwcFRSWDA0c0JSL2lXa3REaERrOUtvOTBuTzIrb2pPN2RRXFx1MDAzZFwiLFwidGFnXCI6XCJWS2tIbG81amJSbU5HTjZKYUR3NHZMMlVua29oR3p2aGI2dkRkOEdlR2FJXFx1MDAzZFwifSJ9",
          "isv_saleEnabled": false,
          "isv_shippingMethod": "SINGLE",
          "isv_customerIpAddress": "192.168.1.1",
          "isv_maskedPan": "400000XXXXXX1000",
          "isv_AVSResponse": "1",
          "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
          "isv_responseCode": "00",
          "isv_responseDateAndTime": "2025-03-13T09:28:27Z",
          "isv_userAgentHeader": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
          "isv_cardExpiryYear": "2027",
          "isv_merchantId": "wiproltd",
          "isv_acceptHeader": "*/*",
          "isv_cardType": "001",
          "isv_authorizationStatus": "AUTHORIZED",
          "isv_cardExpiryMonth": "01"
      }
  },
  "paymentStatus": {},
  "transactions": [
      {
          "id": "8d888b32-e208-485e-9931-9d95045cec06",
          "timestamp": "2025-03-13T09:28:26.267Z",
          "type": "Authorization",
          "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 501900,
              "fractionDigits": 2
          },
          "interactionId": "7418581072276038304806",
          "state": "Success"
      }
  ],
  "interfaceInteractions": []
};
const guestPayment =  {
  "id": "f8f82fb1-814a-4049-a604-81d8d0fa8925",
  "version": 12,
  "versionModifiedAt": "2025-03-13T09:30:20.435Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-13T09:30:16.045Z",
  "lastModifiedAt": "2025-03-13T09:30:20.435Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "1b9d7415-173c-414f-a96f-2829b59e04f8"
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "1b9d7415-173c-414f-a96f-2829b59e04f8"
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
          "isv_deviceFingerprintId": "05eb3fbf-2036-48cd-a2b6-bc00e5676927",
          "isv_token": "eyJzaWduYXR1cmUiOiJNRVlDSVFEWWR1NnFZZ2VNRVFPbUdRdHdKZXhMWnhKVS8zR2IrUUZQaitzcnVDQ2pEQUloQUlJZWtzYUxOWkZyNVRYYzlDRUg2QVIwa0JiV1JWcmVOVW9scGtOVmxaTzEiLCJwcm90b2NvbFZlcnNpb24iOiJFQ3YxIiwic2lnbmVkTWVzc2FnZSI6IntcImVuY3J5cHRlZE1lc3NhZ2VcIjpcInJqWHJPVGNLVC9RS0JYRlRqcHF1ZDFLWElRKy84dU1ueDgzSUhaUEtnN1hHVG5uMEpDWVoxaGVLNjlwWHFJTmlhUHRvTldIREhteEpFcGhpTzFaU0tKalNETnFKL0NFUTJ6US81REpCVUlVc2xTUURYREs2KzJ3a1FRVmg0bGN1ZW5uWHU3cU9lNFl4NnpGeWRpS1JmcFRIMTdncklteURXaUUvQ2I5K1A1ay9kUnBVSmp4eXRLV2I1d3ZVTFRSaHRuWUl4bWZlM3Y0b1MvTDhqVXoyVU03Sk9wOWpwSG9yVUJvQ0FEVW0xZ0dubzNrOTNjQ2dNY3VZcGhoNW9WMTVwenRkZUV3ZkNlREkxckpxTVhxR04ybXhJa09kWXdFakxGdC9jN3loM2V4UDc3aFRFQmdZZVlyZkVKbFFZUERoTlZhQXpZRkJSeVFrMlNITnpLd2YvYmxUSFg1aXlRb3lSaXpzdjMyUGpEcjJpTHN3eXBJZkdIeVNkcmRHeEtGamVGOTFid240WW5TZFpYMFc3elNhZ3F0dmRzWVdJNFVVNDB6WTF2QVxcdTAwM2RcIixcImVwaGVtZXJhbFB1YmxpY0tleVwiOlwiQk5pREJmYmVCdHJpZldUemxDdGNVT2dWMjMvWnBzZjUrVG8wTEdGMjQraSs5M0krb1l2Q1YraTRwZlQ3TWJxeFB0QUhFdjVuOHBaOFI1Y1paQmVUVjFvXFx1MDAzZFwiLFwidGFnXCI6XCJWVmRtMlZHZ3dCZU5vTnd5b21ZR1hEU1hyeUZiWlpqN1VQT3FoRDJGSk93XFx1MDAzZFwifSJ9",
          "isv_saleEnabled": false,
          "isv_shippingMethod": "SINGLE",
          "isv_customerIpAddress": "192.168.1.1",
          "isv_maskedPan": "400000XXXXXX1000",
          "isv_AVSResponse": "1",
          "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
          "isv_responseCode": "00",
          "isv_responseDateAndTime": "2025-03-13T09:30:20Z",
          "isv_userAgentHeader": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
          "isv_cardExpiryYear": "2027",
          "isv_merchantId": "wiproltd",
          "isv_acceptHeader": "*/*",
          "isv_cardType": "001",
          "isv_authorizationStatus": "AUTHORIZED",
          "isv_cardExpiryMonth": "01"
      }
  },
  "paymentStatus": {},
  "transactions": [
      {
          "id": "524a8d8a-1ba4-4fe7-aecc-8425871b3905",
          "timestamp": "2025-03-13T09:30:19.191Z",
          "type": "Authorization",
          "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 501900,
              "fractionDigits": 2
          },
          "interactionId": "7418582197256291104806",
          "state": "Success"
      }
  ],
  "interfaceInteractions": [],
  "anonymousId": "1b9d7415-173c-414f-a96f-2829b59e04f8"
};

const cart = {
  "type": "Cart",
  "id": "b834268b-81a9-4e79-b15e-1b5507ca98ab",
  "version": 16,
  "versionModifiedAt": "2025-03-13T09:30:21.129Z",
  "lastMessageSequenceNumber": 1,
  "createdAt": "2025-03-13T09:29:48.423Z",
  "lastModifiedAt": "2025-03-13T09:30:21.125Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "1b9d7415-173c-414f-a96f-2829b59e04f8"
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "1b9d7415-173c-414f-a96f-2829b59e04f8"
  },
  "anonymousId": "1b9d7415-173c-414f-a96f-2829b59e04f8",
  "locale": "en",
  "lineItems": [
      {
          "id": "62408a71-a735-4557-af90-e8e0401013b3",
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
          "addedAt": "2025-03-13T09:29:48.792Z",
          "lastModifiedAt": "2025-03-13T09:29:48.792Z",
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
              "id": "f8f82fb1-814a-4049-a604-81d8d0fa8925"
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

const service = 'google';

const payments = {
  id: '33e68f3d-8143-4d07-ac13-2314c7039251',
  version: 2,
  lastMessageSequenceNumber: 2,
  createdAt: '2021-12-21T10:19:02.132Z',
  lastModifiedAt: '2021-12-21T10:19:02.132Z',
  lastModifiedBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: 'ad175f34-543f-4a33-956a-39c30cd0aa61',
  },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: 'ad175f34-543f-4a33-956a-39c30cd0aa61',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
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
      isv_token:
        'eyJzaWduYXR1cmUiOiJNRVFDSUQ0RmI3YTJNUndKMjJGL3BCRVBZaFA2ZHdtN2R6VWt4bVQ2MGVKMEpPOHRBaUJyOFNvZVd5TTRxTmt5N3ltbDZOektqMjlFSzNoZlk2SGs4bURTbm1YRmF3XHUwMDNkXHUwMDNkIiwicHJvdG9jb2xWZXJzaW9uIjoiRUN2MSIsInNpZ25lZE1lc3NhZ2UiOiJ7XCJlbmNyeXB0ZWRNZXNzYWdlXCI6XCJYNFluRmpqeFMzRk92Z2NxYkh5OGFpdC93N2UvMmZJcG5kWlVXZ3pmR2FiUE9kbHhKRWFKK3JnL2xCWWU4dVh6RkZEb2loQWU1bnJlSFN0RUVVR2dBcEVZMW1uWkxmWkplZTB0WXNLOWVZeTVBYVkvNEdQR2s3ZVZ3TlllTWhCY01ZeWUwMjN5bUZOL1VzMmtNeUFqRFlGNkFPQkRRK0tUNTQrbzMwNGptdFkzdzV0R1NYOWtPZnFuU3V0aFFYMFlXVVVHUU0wSmdQL2duMW5WSDFJeFNyTmpmbHFtY1k5MWlWSk5ZTXB1a1E1WmFieEhlaTQvcDFYVXppNUcyVEZSN1RhaEM3UTJGRWpqeGs2d3o3cWJkMUhBNlg0RUE3TnEzMjFHTm1LaFAyQVZPVmtqRy9ZVW5VSWNJQlNMb3BmZVhPYWxMVFVsdnR2ZDN1QkUzTDhRcTFyVHIxSnE2UCtVaFJSY1doRXlsVVNvbkxURGlqM0cxVFNCSTJ1UVZUd2U4RXVjbThaNDYzZnJUOVNpQjlCc0NGeVZzM25mNC9aa0pIckNmemVvSFVzdTVkYklrNFMzNDRqRG1iZVhSM3hVSjVlNVwiLFwiZXBoZW1lcmFsUHVibGljS2V5XCI6XCJCQ3hCRk5LV3NBZUwyQ0NGR2hVRWptOFBVbmxVZWdmYlFYNWRQdy9KSGIvUGVPL3QxZ3FuYlpoYlRrU2tlOE93akU5UUwraFBiNzNEN0llQlNKMDNkN0FcXHUwMDNkXCIsXCJ0YWdcIjpcIkYvMzJpb2o4blNtdU5ZU3JIYUdTeEkzYWR5a3pSSVNQUmMvQVlHSldoREVcXHUwMDNkXCJ9In0',
      isv_acceptHeader: '*/*',
      isv_customerIpAddress: '106.202.150.94',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};

const cardTokens = {
  customerTokenId: creditCard.savedTokenId,
  paymentInstrumentId: creditCard.savedToken,
};

const guestCardTokens = {
  customerTokenId: '',
  paymentInstrumentId: '',
};

const notSaveToken = false;

const payerAuthMandateFlag = false;

const orderNo = '';

const orderNumber = '10';

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

const ucPayment = {
  id: '1fa9dc70-4007-4520-9268-a90992285a5c',
  version: 2,
  versionModifiedAt: '2023-08-10T07:52:49.107Z',
  lastMessageSequenceNumber: 2,
  createdAt: '2023-08-10T07:52:49.107Z',
  lastModifiedAt: '2023-08-10T07:52:49.107Z',
  lastModifiedBy: {
    clientId: 'vjOtikmRR04ldgMx3H3Dgc63',
    isPlatformClient: false,
    anonymousId: '9f414dca-2701-400f-86ad-f1af98d6a81a',
  },
  createdBy: {
    clientId: 'vjOtikmRR04ldgMx3H3Dgc63',
    isPlatformClient: false,
    anonymousId: '9f414dca-2701-400f-86ad-f1af98d6a81a',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5000,
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
      id: '919acdd9-f671-4a83-ad81-2b01caa72250',
    },
    fields: {
      isv_transientToken: googlePay.isv_transientToken,
      isv_deviceFingerprintId: 'a82beccd-0fc0-48f8-a84e-0151709df8c8',
      isv_saleEnabled: false,
      isv_acceptHeader: '*/*',
      isv_customerIpAddress: '192.140.152.21',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: 'acc4bb4a-880d-49cb-8880-b1dc456e0a20',
      timestamp: '2023-08-10T07:52:51.661Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 5000,
        fractionDigits: 2,
      },
      state: 'Initial',
    },
  ],
  interfaceInteractions: [],
  anonymousId: '9f414dca-2701-400f-86ad-f1af98d6a81a',
};

export default {
  payment,
  guestPayment,
  cart,
  service,
  payments,
  cardTokens,
  guestCardTokens,
  notSaveToken,
  payerAuthMandateFlag,
  orderNo,
  orderNumber,
  shippingCart,
  ucPayment,
};
