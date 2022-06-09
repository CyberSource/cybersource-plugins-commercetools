/* eslint-disable no-var */
import creditCard from '../../JSON/creditCard.json';
export var payment = {
  id: 'a29b662f-49a8-49e7-a391-3d51bcb9fb26',
  version: 13,
  lastMessageSequenceNumber: 2,
  createdAt: '2021-12-06T10:19:24.257Z',
  lastModifiedAt: '2021-12-06T10:19:53.227Z',
  lastModifiedBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'de2127f2-1e51-429e-90fd-47521b95108c',
    },
  },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'de2127f2-1e51-429e-90fd-47521b95108c',
    },
  },
  customer: {
    typeId: 'customer',
    id: 'de2127f2-1e51-429e-90fd-47521b95108c',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'creditCard',
    name: {
      en: 'Credit Card',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '87b9d9db-74a3-45d7-8e60-dde669866808',
    },
    fields: {
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJxUC9kSU5ZcFozTmIzcjhnNlgzckpSQUFFTHY4VHRrTC9xdzE1RC9jcktJOWIzdERGbnpnZ01yMEk5OTJrUVdnSWFRU0VKTzRpQ0JiZERBN1RNMmd2VHZnUGgwdW80Q2dETG5xU25qQmYxTzh5cVltQXI2VGFTR2VxR1NickdHRXpaZ0IiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJnNmZyWlZSTHJ2bnNsdm9SX2ktM2FadThkWGM1UEhZZU5iN3J0aC1UQW11d2pLVWl4cnBfdkloSGs2VTRGREpWY0xIc2k2ZlNYT1VQeno5SzY1WnRqWGlnd3hDeTVQelBBRVFKNzRxZllKeG1qalhWUXVWdmthZUpiRDdVSU0xWXc5OGl2Y3Y0c09KRnpvS2Zvc00ySFdJVjJjbkVpaGJVbmVtekJwSDNsRXh1UFU1S0R5LXVyZzJzeWpLRjQ4aExXcGpxYnRHemVkV1VfWnp1QW9EU3pqcUtaTHoxb2RUdnoyNFVWcW1NMVZjLWhBcEIyWXdUam1vVE9MdnVPVkdrelY0cXRIUi1ULXFOLVRwRVRKLTJJbDJoU1Y0OHJkSjRiM1FWU0VHTzJzUm5nLWpHQmtlX2dMbmVNNjAxR1ZHVHZYc2lJZnN2V2xXZ1piUFowSnRZT3ciLCJraWQiOiIwODhlczJHVVpRN1I4WkU0WlBESDJoZnRCMFQwekM0UyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzcyMzUwNzgsImlhdCI6MTYzNzIzNDE3OCwianRpIjoiOGRVbk1lNTNndUVlZXRPMSJ9.SHGohwgLRbk3AiRLSKQz0-NOLBwheay1Y9nSc7K-IctK6AHbTbTSG1d0yFa_PNUo_bLawyvwpvnJgFlccI1rgJR9VoBJhL8BZmwK2nBIrQyoKJyuAuIet0BZjzJ_0PWu9fr7mDdAJ5OAqtvw6AW4pFIri_1mV4AhAwBYSThlQOFFcGuRAsSFdK29TRMsqa31lkQ9tTUsXEteEHhHFGATXgTHqv3_wwWYoPx1IF--BpiCFE_tbkEldaQt6shemv69Y2mdGjskdm_KR1zKk0B7pwchZlzl4y5DhgVHxHcd1W1ej8flFuVvEI8EhVQ8zuOVE4zabUXGS6mdTv_8Pwp0gA',
      isv_deviceFingerprintId: 'ecdce16c-7eee-45bc-8809-978623fb1272',
      isv_cardExpiryYear: '2030',
      isv_token: creditCard.isv_token,
      isv_customerIpAddress: '171.76.13.221',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJxUC9kSU5ZcFozTmIzcjhnNlgzckpSQUFFTHY4VHRrTC9xdzE1RC9jcktJOWIzdERGbnpnZ01yMEk5OTJrUVdnSWFRU0VKTzRpQ0JiZERBN1RNMmd2VHZnUGgwdW80Q2dETG5xU25qQmYxTzh5cVltQXI2VGFTR2VxR1NickdHRXpaZ0IiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJnNmZyWlZSTHJ2bnNsdm9SX2ktM2FadThkWGM1UEhZZU5iN3J0aC1UQW11d2pLVWl4cnBfdkloSGs2VTRGREpWY0xIc2k2ZlNYT1VQeno5SzY1WnRqWGlnd3hDeTVQelBBRVFKNzRxZllKeG1qalhWUXVWdmthZUpiRDdVSU0xWXc5OGl2Y3Y0c09KRnpvS2Zvc00ySFdJVjJjbkVpaGJVbmVtekJwSDNsRXh1UFU1S0R5LXVyZzJzeWpLRjQ4aExXcGpxYnRHemVkV1VfWnp1QW9EU3pqcUtaTHoxb2RUdnoyNFVWcW1NMVZjLWhBcEIyWXdUam1vVE9MdnVPVkdrelY0cXRIUi1ULXFOLVRwRVRKLTJJbDJoU1Y0OHJkSjRiM1FWU0VHTzJzUm5nLWpHQmtlX2dMbmVNNjAxR1ZHVHZYc2lJZnN2V2xXZ1piUFowSnRZT3ciLCJraWQiOiIwODhlczJHVVpRN1I4WkU0WlBESDJoZnRCMFQwekM0UyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzcyMzUwNzgsImlhdCI6MTYzNzIzNDE3OCwianRpIjoiOGRVbk1lNTNndUVlZXRPMSJ9.ldSihdIQRJf7ukEacugVNiNWdOvV4o17MPU8S26J0A8',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};

export var payments = {
  id: 'a29b662f-49a8-49e7-a391-3d51bcb9fb26',
  version: 13,
  lastMessageSequenceNumber: 2,
  createdAt: '2021-12-06T10:19:24.257Z',
  lastModifiedAt: '2021-12-06T10:19:53.227Z',
  lastModifiedBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'de2127f2-1e51-429e-90fd-47521b95108c',
    },
  },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'de2127f2-1e51-429e-90fd-47521b95108c',
    },
  },
  customer: {
    typeId: 'customer',
    id: 'de2127f2-1e51-429e-90fd-47521b95108c',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'creditCard',
    name: {
      en: 'Credit Card',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '87b9d9db-74a3-45d7-8e60-dde669866808',
    },
    fields: {
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJxUC9kSU5ZcFozTmIzcjhnNlgzckpSQUFFTHY4VHRrTC9xdzE1RC9jcktJOWIzdERGbnpnZ01yMEk5OTJrUVdnSWFRU0VKTzRpQ0JiZERBN1RNMmd2VHZnUGgwdW80Q2dETG5xU25qQmYxTzh5cVltQXI2VGFTR2VxR1NickdHRXpaZ0IiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJnNmZyWlZSTHJ2bnNsdm9SX2ktM2FadThkWGM1UEhZZU5iN3J0aC1UQW11d2pLVWl4cnBfdkloSGs2VTRGREpWY0xIc2k2ZlNYT1VQeno5SzY1WnRqWGlnd3hDeTVQelBBRVFKNzRxZllKeG1qalhWUXVWdmthZUpiRDdVSU0xWXc5OGl2Y3Y0c09KRnpvS2Zvc00ySFdJVjJjbkVpaGJVbmVtekJwSDNsRXh1UFU1S0R5LXVyZzJzeWpLRjQ4aExXcGpxYnRHemVkV1VfWnp1QW9EU3pqcUtaTHoxb2RUdnoyNFVWcW1NMVZjLWhBcEIyWXdUam1vVE9MdnVPVkdrelY0cXRIUi1ULXFOLVRwRVRKLTJJbDJoU1Y0OHJkSjRiM1FWU0VHTzJzUm5nLWpHQmtlX2dMbmVNNjAxR1ZHVHZYc2lJZnN2V2xXZ1piUFowSnRZT3ciLCJraWQiOiIwODhlczJHVVpRN1I4WkU0WlBESDJoZnRCMFQwekM0UyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzcyMzUwNzgsImlhdCI6MTYzNzIzNDE3OCwianRpIjoiOGRVbk1lNTNndUVlZXRPMSJ9.SHGohwgLRbk3AiRLSKQz0-NOLBwheay1Y9nSc7K-IctK6AHbTbTSG1d0yFa_PNUo_bLawyvwpvnJgFlccI1rgJR9VoBJhL8BZmwK2nBIrQyoKJyuAuIet0BZjzJ_0PWu9fr7mDdAJ5OAqtvw6AW4pFIri_1mV4AhAwBYSThlQOFFcGuRAsSFdK29TRMsqa31lkQ9tTUsXEteEHhHFGATXgTHqv3_wwWYoPx1IF--BpiCFE_tbkEldaQt6shemv69Y2mdGjskdm_KR1zKk0B7pwchZlzl4y5DhgVHxHcd1W1ej8flFuVvEI8EhVQ8zuOVE4zabUXGS6mdTv_8Pwp0gA',
      isv_deviceFingerprintId: 'ecdce16c-7eee-45bc-8809-978623fb1272',
      isv_cardExpiryYear: '2030',
      isv_tokenAlias: creditCard.tokenAlias,
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_savedToken: creditCard.savedToken,
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJxUC9kSU5ZcFozTmIzcjhnNlgzckpSQUFFTHY4VHRrTC9xdzE1RC9jcktJOWIzdERGbnpnZ01yMEk5OTJrUVdnSWFRU0VKTzRpQ0JiZERBN1RNMmd2VHZnUGgwdW80Q2dETG5xU25qQmYxTzh5cVltQXI2VGFTR2VxR1NickdHRXpaZ0IiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJnNmZyWlZSTHJ2bnNsdm9SX2ktM2FadThkWGM1UEhZZU5iN3J0aC1UQW11d2pLVWl4cnBfdkloSGs2VTRGREpWY0xIc2k2ZlNYT1VQeno5SzY1WnRqWGlnd3hDeTVQelBBRVFKNzRxZllKeG1qalhWUXVWdmthZUpiRDdVSU0xWXc5OGl2Y3Y0c09KRnpvS2Zvc00ySFdJVjJjbkVpaGJVbmVtekJwSDNsRXh1UFU1S0R5LXVyZzJzeWpLRjQ4aExXcGpxYnRHemVkV1VfWnp1QW9EU3pqcUtaTHoxb2RUdnoyNFVWcW1NMVZjLWhBcEIyWXdUam1vVE9MdnVPVkdrelY0cXRIUi1ULXFOLVRwRVRKLTJJbDJoU1Y0OHJkSjRiM1FWU0VHTzJzUm5nLWpHQmtlX2dMbmVNNjAxR1ZHVHZYc2lJZnN2V2xXZ1piUFowSnRZT3ciLCJraWQiOiIwODhlczJHVVpRN1I4WkU0WlBESDJoZnRCMFQwekM0UyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzcyMzUwNzgsImlhdCI6MTYzNzIzNDE3OCwianRpIjoiOGRVbk1lNTNndUVlZXRPMSJ9.ldSihdIQRJf7ukEacugVNiNWdOvV4o17MPU8S26J0A8',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};

export var cart = {
  "type": "Cart",
  "id": "3d09ed42-1b1b-450a-b670-269437683939",
  "version": 10,
  "lastMessageSequenceNumber": 1,
  "createdAt": "2022-04-11T09:08:17.675Z",
  "lastModifiedAt": "2022-04-11T09:10:51.071Z",
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
              "centAmount": 15845,
              "fractionDigits": 2
            },
            "country": "US"
          },
          {
            "id": "68018b50-2c8a-4304-b67a-ae15389be32d",
            "value": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 5980,
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
          "centAmount": 5980,
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
        "centAmount": 5980,
        "fractionDigits": 2
      },
      "taxedPrice": {
        "totalNet": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 4983,
          "fractionDigits": 2
        },
        "totalGross": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 5980,
          "fractionDigits": 2
        },
        "totalTax": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 997,
          "fractionDigits": 2
        }
      },
      "lineItemMode": "Standard"
    }
  ],
  "cartState": "Active",
  "totalPrice": {
    "type": "centPrecision",
    "currencyCode": "USD",
    "centAmount": 5980,
    "fractionDigits": 2
  },
  "taxedPrice": {
    "totalNet": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 4983,
      "fractionDigits": 2
    },
    "totalGross": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 5980,
      "fractionDigits": 2
    },
    "taxPortions": [
      {
        "rate": 0.2,
        "amount": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 997,
          "fractionDigits": 2
        },
        "name": "test-tax-category"
      }
    ],
    "totalTax": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 997,
      "fractionDigits": 2
    }
  },
  "country": "US",
  "customLineItems": [],
  "discountCodes": [],
  "directDiscounts": [],
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
export const cardTokens = {
  customerTokenId: creditCard.savedToken,
  paymentInstrumentId: creditCard.savedTokenId,
};

export const cardTokensObject = {
  customerTokenId: 'D605360941117CECE053AF598E0A6E',
  paymentInstrumentId: creditCard.savedToken,
};

export const cardTokenInvalidObject = {
  customerTokenId: creditCard.savedTokenId,
  paymentInstrumentId: 'D76C84878E06B607E053A2598D0AAC',
};

export const service = 'card';

export var paymentInvalidToken = {
  id: 'a29b662f-49a8-49e7-a391-3d51bcb9fb26',
  version: 13,
  lastMessageSequenceNumber: 2,
  createdAt: '2021-12-06T10:19:24.257Z',
  lastModifiedAt: '2021-12-06T10:19:53.227Z',
  lastModifiedBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'de2127f2-1e51-429e-90fd-47521b95108c',
    },
  },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'de2127f2-1e51-429e-90fd-47521b95108c',
    },
  },
  customer: {
    typeId: 'customer',
    id: 'de2127f2-1e51-429e-90fd-47521b95108c',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'creditCard',
    name: {
      en: 'Credit Card',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '87b9d9db-74a3-45d7-8e60-dde669866808',
    },
    fields: {
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJ6d3ZMZ1lDSXpXcjRscFBQWXhRcGRSQUFFQnUvbUluYWlLRTczSkE1RHR3elJHR2JGTDIzdmJVT2hNaVIrMjhDYjRsY1hFbWxqR3krQSsyYjFhYVRaZklDTEtEV1d6djhxSmZLN3RWNlVQbHN1NzZ0WjFWbEwzbDdjVUFQTy9FcDRKdVoiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJ1YXdYQjl6bGRfUmxqbUwyN0dTbWgzdGI5VnpkeFh0UGFVRE9UTlh0WDduaDZLX1ljOWdkOGdxcDVaV1ZQQzhVLWhtRjdlN3pkSXZnZlZwNzE5N25jcHdNdXZIV2tqRGhGRkJySGx0UmhNWjI5dTZ6VV9xT0NZMUprSk5aYS1XNDRYS2lpWkZXT2Z6RmJnNEZkVXdXYWhiRWtsT29VRW9VSlYyQ3dkUURuUnhpOG84Z0lhbjFBTl9hTjlLS0JYYUVpMlRQekxDcUh2SHBsZ2x2M0lGV09rOUpPenZjZ0VLMEFNUllEMm0wLWMtX3ZpcnhGLW0wQnpzVVUxR2pETFE5aW16al9jZkFGMF9VMFNRLUJxaWp2dlJrVWg1ZFlfMEdELTY1cGV3M2JyMld4Tmdvd2xPbzdhSEVNWWE4VjZBTkRDcjVyWmR1YkhEZU5OOEs2cEtrbVEiLCJraWQiOiIwOFF4cHlBbUJxR0Eyc3VwRFNST0E3d2FlQlhidmVpaSJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2Mzg3OTU3MjgsImlhdCI6MTYzODc5NDgyOCwianRpIjoiamhBQ0VuSVN4ajZWb29CSyJ9.C3kcQ2u2Uwmv1zDEU_jyYCNlTzj1B9siEhkB_qrmsxxGK6kn9AtQTGcZ2lz5E6e4lEFcTmb9IFYijXTCrWxAaRezUGcbc-rtZMmVBCzuqS2UDIqe7xtpTrbLUW5gjlOPXjujTdcQhCWHjf8ISRgiyh2nRu_MTAyvhtVCo5Z7-GZgK28xao_AcK8VDSwv1CofEJYav0EoFxrzT-rJ_Z6OMt25-DTxV5HmO9eR8wD4HP89TbFjpwDl6HI-dR9SgJvFtDwudUrwfeWIRUrKIXHHZC0TuWDUBBMGihuo5ZDuIaOOhH5opjM7g6HDU36DtHCILfxeJX1aEKNgManT0S9Vjw',
      isv_deviceFingerprintId: '5286820c-b9d2-4d08-8c1b-c871bfe16dcf',
      isv_cardExpiryYear: '2030',
      isv_tokenAlias: 'a12',
      isv_maskedPan: '411111XXXXXX1111',
      isv_savedToken: 'D76C84878E06B607E053A2598D0AA',
      isv_cardExpiryMonth: '01',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJ6d3ZMZ1lDSXpXcjRscFBQWXhRcGRSQUFFQnUvbUluYWlLRTczSkE1RHR3elJHR2JGTDIzdmJVT2hNaVIrMjhDYjRsY1hFbWxqR3krQSsyYjFhYVRaZklDTEtEV1d6djhxSmZLN3RWNlVQbHN1NzZ0WjFWbEwzbDdjVUFQTy9FcDRKdVoiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJ1YXdYQjl6bGRfUmxqbUwyN0dTbWgzdGI5VnpkeFh0UGFVRE9UTlh0WDduaDZLX1ljOWdkOGdxcDVaV1ZQQzhVLWhtRjdlN3pkSXZnZlZwNzE5N25jcHdNdXZIV2tqRGhGRkJySGx0UmhNWjI5dTZ6VV9xT0NZMUprSk5aYS1XNDRYS2lpWkZXT2Z6RmJnNEZkVXdXYWhiRWtsT29VRW9VSlYyQ3dkUURuUnhpOG84Z0lhbjFBTl9hTjlLS0JYYUVpMlRQekxDcUh2SHBsZ2x2M0lGV09rOUpPenZjZ0VLMEFNUllEMm0wLWMtX3ZpcnhGLW0wQnpzVVUxR2pETFE5aW16al9jZkFGMF9VMFNRLUJxaWp2dlJrVWg1ZFlfMEdELTY1cGV3M2JyMld4Tmdvd2xPbzdhSEVNWWE4VjZBTkRDcjVyWmR1YkhEZU5OOEs2cEtrbVEiLCJraWQiOiIwOFF4cHlBbUJxR0Eyc3VwRFNST0E3d2FlQlhidmVpaSJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2Mzg3OTU3MjgsImlhdCI6MTYzODc5NDgyOCwianRpIjoiamhBQ0VuSVN4ajZWb29CSyJ9.LljR5M8fitZEdD-H4jmdjNT1swwMjUI_ou5dIIXaXC8',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};

export const dontSaveTokenFlag = false;

export const payerAuthMandateFlag = false

export const orderNo = null;
