import clickToPay from '../../JSON/clickToPay.json';
import creditCard from '../../JSON/creditCard.json';

export const payment = {
  id: '779f9ebb-27f8-45af-b966-56fc7c54c340',
  version: 2,
  lastMessageSequenceNumber: 2,
  createdAt: '2021-11-10T06:15:42.254Z',
  lastModifiedAt: '2021-11-10T06:15:42.254Z',
  lastModifiedBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'de2127f2-1e51-429e-90fd-47521b95108c',
    },
  },
  createdBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'de2127f2-1e51-429e-90fd-47521b95108c',
    },
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 6970,
    fractionDigits: 2,
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
      isv_deviceFingerprintId: '1ccd2043-4c08-4419-a629-bc32dc5f91eb',
      isv_token: clickToPay.isv_token,
      isv_acceptHeader: '*/*',
      isv_customerIpAddress: '171.76.13.221',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};

export const guestPayment = {
  "id": "c91a109a-a766-4acf-8340-80b23340cd08",
  "version": 2,
  "lastMessageSequenceNumber": 2,
  "createdAt": "2022-06-23T06:20:37.060Z",
  "lastModifiedAt": "2022-06-23T06:20:37.060Z",
  "lastModifiedBy": {
    "clientId": "mSpmJgXkt_CadneUb0otjt98",
    "isPlatformClient": false,
    "anonymousId": "b7037191-ed8f-4518-a66a-5b1efda2a2de"
  },
  "createdBy": {
    "clientId": "mSpmJgXkt_CadneUb0otjt98",
    "isPlatformClient": false,
    "anonymousId": "b7037191-ed8f-4518-a66a-5b1efda2a2de"
  },
  "amountPlanned": {
    "type": "centPrecision",
    "currencyCode": "USD",
    "centAmount": 3500,
    "fractionDigits": 2
  },
  "paymentMethodInfo": {
    "paymentInterface": "cybersource",
    "method": "clickToPay",
    "name": {
      "en": "Click to Pay"
    }
  },
  "custom": {
    "type": {
      "typeId": "type",
      "id": "e2288aa6-6a13-49eb-8f79-f9cc73fd4dd0"
    },
    "fields": {
      "isv_deviceFingerprintId": "e161b9f0-f093-4708-9805-e2639ef586e7",
      "isv_token": clickToPay.isv_token,
      "isv_saleEnabled": false,
      "isv_acceptHeader": "*/*",
      "isv_customerIpAddress": "122.163.190.43",
      "isv_userAgentHeader": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
    }
  },
  "paymentStatus": {},
  "transactions": [],
  "interfaceInteractions": [],
  "anonymousId": "b7037191-ed8f-4518-a66a-5b1efda2a2de"
}

export const payments = {
  id: '779f9ebb-27f8-45af-b966-56fc7c54c340',
  version: 2,
  lastMessageSequenceNumber: 2,
  createdAt: '2021-11-10T06:15:42.254Z',
  lastModifiedAt: '2021-11-10T06:15:42.254Z',
  lastModifiedBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc',
  },
  createdBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 6970,
    fractionDigits: 2,
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
      isv_deviceFingerprintId: 'ac692e81-8ed7-4f85-b4c2-931057fb9b24',
      isv_token: '195403577059284',
      isv_acceptHeader: '*/*',
      isv_customerIpAddress: '171.76.13.221',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};

export const cart = {
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

export const service = 'visa';

export const cardTokens = {
  customerTokenId: creditCard.savedTokenId,
  paymentInstrumentId: creditCard.savedToken,
};

export const guestCardTokens = null

export const cardTokensObject = {
  customerTokenId: 'D605360941117CECE053AF598E0A6E',
  paymentInstrumentId: 'D7688E8C36CCE10FE053A2598D0AC0',
};

export const orderNo = null;

export const dontSaveTokenFlag = false;

export const payerAuthMandateFlag = false

export const orderNumber = '10';
