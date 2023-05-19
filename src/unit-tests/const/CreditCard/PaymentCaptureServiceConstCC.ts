import * as creditCard from '../../JSON/creditCard.json';

export const payment = {
  id: 'd5c67aab-2880-4cba-8431-4cb90f9c6fd9',
  version: 2,
  lastMessageSequenceNumber: 2,
  createdAt: '2021-10-13T07:07:39.945Z',
  lastModifiedAt: '2021-10-13T07:07:39.945Z',
  lastModifiedBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '47d6586f-6c7a-4d0e-93bb-344b25600a8a',
  },
  createdBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '47d6586f-6c7a-4d0e-93bb-344b25600a8a',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 100,
    fractionDigits: 2,
  },
  paymentMethodInfo: { paymentInterface: 'cybersource', method: 'creditCard' },
  custom: {
    type: { typeId: 'type', id: '28701886-4e26-4cab-924e-9b0da3829f88' },
    fields: {
      isv_deviceFingerprintId: '1ccd2043-4c08-4419-a629-bc32dc5f91eb',
      isv_cardExpiryYear: '2025',
      isv_token: 'eyJraWQiOiIwOG5aU1BESXFHRnZpaElMWEVxcEdkUG5lbUVUZXkySCIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAzMCIsIm51bWJlciI6IjQxMTExMVhYWFhYWDExMTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wOCIsImV4cCI6MTYzNTIzMTM5NCwidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTYzNTIzMDQ5NCwianRpIjoiMUU2NTZWNThZVjVUS0hQUU1aTFdaMVlPWU1NNjhWWFNSOEpQTllGOFVFSTAzWFlYTTNCRDYxNzdBNkEyMEU5MiIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDMwIn0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDExMTEiLCJiaW4iOiI0MTExMTEifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.U-4A01seF4P9kXQLcNTivdWgYokoRUkjus9pujmNjVx4UOWSxRdp_FnCnt93H7_cEH7eZ46grEiYwyDwbCLYmar4zvzadhaMw0LG3L2_nchCO8GDUoroqpChMdgJ269iKg5EsFTQffMYGCc4FfNkHPn1E1_s_n47VDcqKvidAhryQvb16EsOVoheREE_d8fh8ltad32zwSnXcAyXKu_Zj2XFdhzIyq9Yf_ZTN1vlkMCyDEqpGZ-IX-sWdNFrsoU8L7RDeCNnknzl7JUy4usLo6lIf4vq-BgFrHc3b2W_q2CBqMvylixNlblDGChkB743TXXKR9iFrs3ajYXjHdZztA',
      isv_customerIpAddress: '106.202.150.94',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      isv_tokenVerificationContext: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI3cUE5TzduOU81YjEremZ5c2VyWUloQUFFQ0hDMFhiaVZDY3o2a0plQ0VxMjdMNHZFbnV5MHdGclFyTkhGTkVYRWdGcE1sak43MG8rNy9KNjkvdWhTK3gyTFB2a0FvKzZRdUxja1JhM01nbmRNN0FQb3VSV1BqWkEzaG9yeWJ6MGNlWFAiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJrYlU5MXBmTVR0U1htUDBlMjN4dnFtaDdmdFZyS3Q4WEFHaEhIX3pYbGFqSnBxbG1sTklYUHJOaTA1Q0FSS1hiSVc5cHNaU2xPUEUwMGNlSEtsVXhWWkVnbVVxZHZtczItbk5wZzgxeE1XLTU2Q2tHaG53N281Vk9RdllVakhCcDl5MzFPNjMzaHRqeFZkMGEyRG9WX3kyNHIxNFZzcTFVaFVzX0VEdUY2U0pLQ0pnODlKVzhXcW1SblB0VTVDb2hHRUNqWm5NSVYtM3ByUkNUY3U5VTZtWko5SlhQYktjeUZvZ3NRakozeWs4OVRQOTE4bm5Mc3ozbzRXZTNnWFpvOWFScXBPem5EWlRTbkJ3akNneUNfSUtqNm5XV2Vvc0VHc21NZ3B1VnUwbVJzSDNhdG01OGo5SW5qN2dmcVc5MXdYenZWVElpWjU4aW4wSW9MU3BOSXciLCJraWQiOiIwODV3dGJMZXN5dlJFMVc2QllTV3BISERtQk9LMTVReCJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzQxMDk3MzksImlhdCI6MTYzNDEwODgzOSwianRpIjoiM2pTZVZLR3R2UGZ5QU1DaSJ9.A9Ek14fsuCEr63DRuihOx6nVUTb4I5PF91Jcnfbn5YI',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      interactionId: creditCard.authId,
      id: '176a50bb-3e71-4e4b-98a1-2c17e804ef00',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 100,
        fractionDigits: 2,
      },
      state: 'Initial',
    },
    {
      id: 'ecfb96db-05bf-4ecd-b900-fb4501b3b3bd',
    },
  ],
  interfaceInteractions: [],
};

export const authId = creditCard.authId;

export const authID = '6396510479606597503';

export const cart = {
  limit: 20,
  offset: 0,
  count: 1,
  total: 1,
  results: [
    {
      type: 'Cart',
      id: '3d09ed42-1b1b-450a-b670-269437683939',
      version: 17,
      lastMessageSequenceNumber: 1,
      createdAt: '2022-04-11T09:08:17.675Z',
      lastModifiedAt: '2022-04-11T09:11:01.390Z',
      lastModifiedBy: {
        clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
        isPlatformClient: false,
        customer: {
          typeId: 'customer',
          id: 'def6c669-eed5-4c57-ba2e-5fb04bfed1fa',
        },
      },
      createdBy: {
        clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
        isPlatformClient: false,
        customer: {
          typeId: 'customer',
          id: 'def6c669-eed5-4c57-ba2e-5fb04bfed1fa',
        },
      },
      customerId: 'def6c669-eed5-4c57-ba2e-5fb04bfed1fa',
      locale: 'en-US',
      lineItems: [
        {
          id: '321ea068-968a-431c-a7a5-98615b74cda3',
          productId: '7e3ccfc6-36ee-4995-ab1d-bb5095b08bbe',
          name: {
            en: 'Sherwani',
          },
          productType: {
            typeId: 'product-type',
            id: '31d56c4e-d578-4dab-a313-780b5f1e7556',
            version: 1,
          },
          productSlug: {
            en: 'a1',
          },
          variant: {
            id: 1,
            sku: 'SKU-1',
            prices: [
              {
                id: '1fbaed84-99cc-4922-9776-c1ea3cd553e6',
                value: {
                  type: 'centPrecision',
                  currencyCode: 'EUR',
                  centAmount: 10000,
                  fractionDigits: 2,
                },
                country: 'US',
              },
              {
                id: '68018b50-2c8a-4304-b67a-ae15389be32d',
                value: {
                  type: 'centPrecision',
                  currencyCode: 'USD',
                  centAmount: 100,
                  fractionDigits: 2,
                },
                country: 'US',
              },
            ],
            images: [
              {
                url: 'https://ik.imagekit.io/ldqsn9vvwgg/images/505833.jpg',
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
            id: '68018b50-2c8a-4304-b67a-ae15389be32d',
            value: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 100,
              fractionDigits: 2,
            },
            country: 'US',
          },
          quantity: 1,
          discountedPricePerQuantity: [],
          taxRate: {
            name: 'test-tax-category',
            amount: 0.2,
            includedInPrice: true,
            country: 'US',
            id: 'HxMyojUT',
            subRates: [],
          },
          addedAt: '2022-04-11T09:08:17.982Z',
          lastModifiedAt: '2022-04-11T09:08:17.982Z',
          state: [
            {
              quantity: 1,
              state: {
                typeId: 'state',
                id: '438c0901-36c4-41ec-9a86-2853d6c73d0d',
              },
            },
          ],
          priceMode: 'Platform',
          totalPrice: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 100,
            fractionDigits: 2,
          },
          taxedPrice: {
            totalNet: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 49,
              fractionDigits: 2,
            },
            totalGross: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 100,
              fractionDigits: 2,
            },
            totalTax: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 99,
              fractionDigits: 2,
            },
          },
          lineItemMode: 'Standard',
        },
      ],
      cartState: 'Ordered',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 100,
        fractionDigits: 2,
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 49,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 100,
          fractionDigits: 2,
        },
        taxPortions: [
          {
            rate: 0.2,
            amount: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 99,
              fractionDigits: 2,
            },
            name: 'test-tax-category',
          },
        ],
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 99,
          fractionDigits: 2,
        },
      },
      country: 'US',
      customLineItems: [],
      discountCodes: [],
      directDiscounts: [],
      paymentInfo: {
        payments: [
          {
            typeId: 'payment',
            id: '65e14caa-8250-4f49-9807-f248d08e5c78',
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
      shippingAddress: {
        firstName: 'shakshi',
        lastName: 'poddar',
        streetName: '1295 Charleston Road',
        additionalStreetInfo: '5th lane',
        postalCode: '94043',
        city: 'Mountain View',
        region: 'CA',
        country: 'US',
        phone: '9876543210',
        email: 'shakshi.poddar@wipro.com',
      },
      billingAddress: {
        firstName: 'shakshi',
        lastName: 'poddar',
        streetName: '1295 Charleston Road',
        additionalStreetInfo: '5th lane',
        postalCode: '94043',
        city: 'Mountain View',
        region: 'CA',
        country: 'US',
        phone: '9876543210',
        email: 'shakshi.poddar@wipro.com',
      },
      itemShippingAddresses: [],
      totalLineItemQuantity: 1,
    },
  ],
};

export const orderNo = null;

export const orderNumber = '10';

export const updateTransactions = {
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
