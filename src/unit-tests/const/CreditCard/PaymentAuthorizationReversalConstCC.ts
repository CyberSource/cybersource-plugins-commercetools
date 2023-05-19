/* eslint-disable no-var */
import creditCard from '../../JSON/creditCard.json';
export var payment = {
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
    centAmount: creditCard.centAmount,
    fractionDigits: 2,
  },
  paymentMethodInfo: { paymentInterface: 'cybersource', method: 'creditCard' },
  custom: {
    type: { typeId: 'type', id: '28701886-4e26-4cab-924e-9b0da3829f88' },
    fields: {
      isv_deviceFingerprintId: '1ccd2043-4c08-4419-a629-bc32dc5f91eb',
      isv_cardExpiryYear: '2030',
      isv_token:'eyJraWQiOiIwOG5aU1BESXFHRnZpaElMWEVxcEdkUG5lbUVUZXkySCIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAzMCIsIm51bWJlciI6IjQxMTExMVhYWFhYWDExMTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wOCIsImV4cCI6MTYzNTIzMTM5NCwidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTYzNTIzMDQ5NCwianRpIjoiMUU2NTZWNThZVjVUS0hQUU1aTFdaMVlPWU1NNjhWWFNSOEpQTllGOFVFSTAzWFlYTTNCRDYxNzdBNkEyMEU5MiIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDMwIn0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDExMTEiLCJiaW4iOiI0MTExMTEifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.U-4A01seF4P9kXQLcNTivdWgYokoRUkjus9pujmNjVx4UOWSxRdp_FnCnt93H7_cEH7eZ46grEiYwyDwbCLYmar4zvzadhaMw0LG3L2_nchCO8GDUoroqpChMdgJ269iKg5EsFTQffMYGCc4FfNkHPn1E1_s_n47VDcqKvidAhryQvb16EsOVoheREE_d8fh8ltad32zwSnXcAyXKu_Zj2XFdhzIyq9Yf_ZTN1vlkMCyDEqpGZ-IX-sWdNFrsoU8L7RDeCNnknzl7JUy4usLo6lIf4vq-BgFrHc3b2W_q2CBqMvylixNlblDGChkB743TXXKR9iFrs3ajYXjHdZztA',
      isv_customerIpAddress: '106.202.150.94',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      isv_tokenVerificationContext:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI3cUE5TzduOU81YjEremZ5c2VyWUloQUFFQ0hDMFhiaVZDY3o2a0plQ0VxMjdMNHZFbnV5MHdGclFyTkhGTkVYRWdGcE1sak43MG8rNy9KNjkvdWhTK3gyTFB2a0FvKzZRdUxja1JhM01nbmRNN0FQb3VSV1BqWkEzaG9yeWJ6MGNlWFAiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJrYlU5MXBmTVR0U1htUDBlMjN4dnFtaDdmdFZyS3Q4WEFHaEhIX3pYbGFqSnBxbG1sTklYUHJOaTA1Q0FSS1hiSVc5cHNaU2xPUEUwMGNlSEtsVXhWWkVnbVVxZHZtczItbk5wZzgxeE1XLTU2Q2tHaG53N281Vk9RdllVakhCcDl5MzFPNjMzaHRqeFZkMGEyRG9WX3kyNHIxNFZzcTFVaFVzX0VEdUY2U0pLQ0pnODlKVzhXcW1SblB0VTVDb2hHRUNqWm5NSVYtM3ByUkNUY3U5VTZtWko5SlhQYktjeUZvZ3NRakozeWs4OVRQOTE4bm5Mc3ozbzRXZTNnWFpvOWFScXBPem5EWlRTbkJ3akNneUNfSUtqNm5XV2Vvc0VHc21NZ3B1VnUwbVJzSDNhdG01OGo5SW5qN2dmcVc5MXdYenZWVElpWjU4aW4wSW9MU3BOSXciLCJraWQiOiIwODV3dGJMZXN5dlJFMVc2QllTV3BISERtQk9LMTVReCJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzQxMDk3MzksImlhdCI6MTYzNDEwODgzOSwianRpIjoiM2pTZVZLR3R2UGZ5QU1DaSJ9.A9Ek14fsuCEr63DRuihOx6nVUTb4I5PF91Jcnfbn5YI',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '176a50bb-3e71-4e4b-98a1-2c17e804ef00',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 6970,
        fractionDigits: 2,
      },
      interactionId: creditCard.authReversalId,
      state: 'Success',
    },
  ],
  interfaceInteractions: [],
};

export var payments = {
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
    centAmount: creditCard.centAmountValue,
    fractionDigits: 2,
  },
  paymentMethodInfo: { paymentInterface: 'cybersource', method: 'creditCard' },
  custom: {
    type: { typeId: 'type', id: '28701886-4e26-4cab-924e-9b0da3829f88' },
    fields: {
      isv_deviceFingerprintId: '1ccd2043-4c08-4419-a629-bc32dc5f91eb',
      isv_cardExpiryYear: '2030',
      isv_token:'eyJraWQiOiIwOG5aU1BESXFHRnZpaElMWEVxcEdkUG5lbUVUZXkySCIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAzMCIsIm51bWJlciI6IjQxMTExMVhYWFhYWDExMTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wOCIsImV4cCI6MTYzNTIzMTM5NCwidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTYzNTIzMDQ5NCwianRpIjoiMUU2NTZWNThZVjVUS0hQUU1aTFdaMVlPWU1NNjhWWFNSOEpQTllGOFVFSTAzWFlYTTNCRDYxNzdBNkEyMEU5MiIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDMwIn0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDExMTEiLCJiaW4iOiI0MTExMTEifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.U-4A01seF4P9kXQLcNTivdWgYokoRUkjus9pujmNjVx4UOWSxRdp_FnCnt93H7_cEH7eZ46grEiYwyDwbCLYmar4zvzadhaMw0LG3L2_nchCO8GDUoroqpChMdgJ269iKg5EsFTQffMYGCc4FfNkHPn1E1_s_n47VDcqKvidAhryQvb16EsOVoheREE_d8fh8ltad32zwSnXcAyXKu_Zj2XFdhzIyq9Yf_ZTN1vlkMCyDEqpGZ-IX-sWdNFrsoU8L7RDeCNnknzl7JUy4usLo6lIf4vq-BgFrHc3b2W_q2CBqMvylixNlblDGChkB743TXXKR9iFrs3ajYXjHdZztA',
      isv_customerIpAddress: '106.202.150.94',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      isv_tokenVerificationContext:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI3cUE5TzduOU81YjEremZ5c2VyWUloQUFFQ0hDMFhiaVZDY3o2a0plQ0VxMjdMNHZFbnV5MHdGclFyTkhGTkVYRWdGcE1sak43MG8rNy9KNjkvdWhTK3gyTFB2a0FvKzZRdUxja1JhM01nbmRNN0FQb3VSV1BqWkEzaG9yeWJ6MGNlWFAiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJrYlU5MXBmTVR0U1htUDBlMjN4dnFtaDdmdFZyS3Q4WEFHaEhIX3pYbGFqSnBxbG1sTklYUHJOaTA1Q0FSS1hiSVc5cHNaU2xPUEUwMGNlSEtsVXhWWkVnbVVxZHZtczItbk5wZzgxeE1XLTU2Q2tHaG53N281Vk9RdllVakhCcDl5MzFPNjMzaHRqeFZkMGEyRG9WX3kyNHIxNFZzcTFVaFVzX0VEdUY2U0pLQ0pnODlKVzhXcW1SblB0VTVDb2hHRUNqWm5NSVYtM3ByUkNUY3U5VTZtWko5SlhQYktjeUZvZ3NRakozeWs4OVRQOTE4bm5Mc3ozbzRXZTNnWFpvOWFScXBPem5EWlRTbkJ3akNneUNfSUtqNm5XV2Vvc0VHc21NZ3B1VnUwbVJzSDNhdG01OGo5SW5qN2dmcVc5MXdYenZWVElpWjU4aW4wSW9MU3BOSXciLCJraWQiOiIwODV3dGJMZXN5dlJFMVc2QllTV3BISERtQk9LMTVReCJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzQxMDk3MzksImlhdCI6MTYzNDEwODgzOSwianRpIjoiM2pTZVZLR3R2UGZ5QU1DaSJ9.A9Ek14fsuCEr63DRuihOx6nVUTb4I5PF91Jcnfbn5YI',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      interactionId: creditCard.authReversalId,
      id: '176a50bb-3e71-4e4b-98a1-2c17e804ef00',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 6970,
        fractionDigits: 2,
      },
      state: 'Success',
    },
    {
      id: 'ecfb96db-05bf-4ecd-b900-fb4501b3b3bd',
    },
  ],
  interfaceInteractions: [],
  anonymousId: '47d6586f-6c7a-4d0e-93bb-344b25600a8a',
};

export const authId = creditCard.authReversalId;

export const authID = '639636095168688700';

export const carts = {
  limit: 20,
  offset: 0,
  count: 1,
  total: 1,
  results: [
    {
      type: 'Cart',
      id: 'ecddb55a-646d-4120-a8b8-9f900476dfe5',
      version: 20,
      lastMessageSequenceNumber: 1,
      createdAt: '2022-04-11T08:33:23.168Z',
      lastModifiedAt: '2022-04-11T08:34:17.468Z',
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
          id: '72dd04a7-918e-40d8-be33-1c4de9bfcdbd',
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
                  centAmount: 15845,
                  fractionDigits: 2,
                },
                country: 'US',
                discounted: {
                  value: {
                    type: 'centPrecision',
                    currencyCode: 'EUR',
                    centAmount: 7922,
                    fractionDigits: 2,
                  },
                  discount: {
                    typeId: 'product-discount',
                    id: '9360ab21-ba82-4dca-8c39-ae0577547c8e',
                  },
                },
              },
              {
                id: '68018b50-2c8a-4304-b67a-ae15389be32d',
                value: {
                  type: 'centPrecision',
                  currencyCode: 'USD',
                  centAmount: 5980,
                  fractionDigits: 2,
                },
                country: 'US',
                discounted: {
                  value: {
                    type: 'centPrecision',
                    currencyCode: 'USD',
                    centAmount: 2990,
                    fractionDigits: 2,
                  },
                  discount: {
                    typeId: 'product-discount',
                    id: '9360ab21-ba82-4dca-8c39-ae0577547c8e',
                  },
                },
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
              centAmount: 5980,
              fractionDigits: 2,
            },
            country: 'US',
            discounted: {
              value: {
                type: 'centPrecision',
                currencyCode: 'USD',
                centAmount: 2990,
                fractionDigits: 2,
              },
              discount: {
                typeId: 'product-discount',
                id: '9360ab21-ba82-4dca-8c39-ae0577547c8e',
              },
            },
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
          addedAt: '2022-04-11T08:33:23.498Z',
          lastModifiedAt: '2022-04-11T08:33:23.498Z',
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
            centAmount: 2990,
            fractionDigits: 2,
          },
          taxedPrice: {
            totalNet: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 2492,
              fractionDigits: 2,
            },
            totalGross: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 2990,
              fractionDigits: 2,
            },
            totalTax: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 498,
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
        centAmount: 3980,
        fractionDigits: 2,
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 3317,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 3980,
          fractionDigits: 2,
        },
        taxPortions: [
          {
            rate: 0.2,
            amount: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 663,
              fractionDigits: 2,
            },
            name: 'test-tax-category',
          },
        ],
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 663,
          fractionDigits: 2,
        },
      },
      country: 'US',
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
          name: 'test-tax-category',
          amount: 0.2,
          includedInPrice: true,
          country: 'US',
          id: 'HxMyojUT',
          subRates: [],
        },
        taxCategory: {
          typeId: 'tax-category',
          id: '44e3081f-e822-44cc-918a-e79240a7284f',
        },
        deliveries: [],
        shippingMethod: {
          typeId: 'shipping-method',
          id: 'd7a87341-36bb-4fe2-96a9-5d5d1eada503',
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
      customLineItems: [],
      discountCodes: [],
      directDiscounts: [],
      paymentInfo: {
        payments: [
          {
            typeId: 'payment',
            id: '029bd8ed-ea47-480f-8bd0-959c1805604d',
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

export const shippingCart = {
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
      "name": {
        "en": "sandalen “Aubrey” Michael Kors brown",
        "de": "sandalen “Aubrey” Michael Kors brown",
        "en-US": "sandalen “Aubrey” Michael Kors brown",
        "de-DE": "sandalen “Aubrey” Michael Kors brown"
      },
      productType: {
        typeId: 'product-type',
        id: '404a5e8f-70a7-41a3-9b39-0b02b1b90b83',
        version: 1,
      },
      productSlug: {
        'en': 'a5',
        'de': 'a5',
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
    firstName: 'Shakshi',
    lastName: 'Poddar',
    streetName: '1295 Charleston Road',
    postalCode: '94043',
    city: 'Mountain View',
    region: 'CA',
    country: 'US',
    phone: '9876543210',
    email: 'shakshi.poddar@wipro.com',
  },
  itemShippingAddresses: [],
  totalLineItemQuantity: 1,
};

export var multipleShippingPayment = {
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
    centAmount: creditCard.centAmount,
    fractionDigits: 2,
  },
  paymentMethodInfo: { paymentInterface: 'cybersource', method: 'creditCard' },
  custom: {
    type: { typeId: 'type', id: '28701886-4e26-4cab-924e-9b0da3829f88' },
    fields: {
      isv_deviceFingerprintId: '1ccd2043-4c08-4419-a629-bc32dc5f91eb',
      isv_cardExpiryYear: '2030',
      isv_token: 'eyJraWQiOiIwOG5aU1BESXFHRnZpaElMWEVxcEdkUG5lbUVUZXkySCIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAzMCIsIm51bWJlciI6IjQxMTExMVhYWFhYWDExMTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wOCIsImV4cCI6MTYzNTIzMTM5NCwidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTYzNTIzMDQ5NCwianRpIjoiMUU2NTZWNThZVjVUS0hQUU1aTFdaMVlPWU1NNjhWWFNSOEpQTllGOFVFSTAzWFlYTTNCRDYxNzdBNkEyMEU5MiIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDMwIn0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDExMTEiLCJiaW4iOiI0MTExMTEifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.U-4A01seF4P9kXQLcNTivdWgYokoRUkjus9pujmNjVx4UOWSxRdp_FnCnt93H7_cEH7eZ46grEiYwyDwbCLYmar4zvzadhaMw0LG3L2_nchCO8GDUoroqpChMdgJ269iKg5EsFTQffMYGCc4FfNkHPn1E1_s_n47VDcqKvidAhryQvb16EsOVoheREE_d8fh8ltad32zwSnXcAyXKu_Zj2XFdhzIyq9Yf_ZTN1vlkMCyDEqpGZ-IX-sWdNFrsoU8L7RDeCNnknzl7JUy4usLo6lIf4vq-BgFrHc3b2W_q2CBqMvylixNlblDGChkB743TXXKR9iFrs3ajYXjHdZztA',
      isv_customerIpAddress: '106.202.150.94',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      isv_tokenVerificationContext:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI3cUE5TzduOU81YjEremZ5c2VyWUloQUFFQ0hDMFhiaVZDY3o2a0plQ0VxMjdMNHZFbnV5MHdGclFyTkhGTkVYRWdGcE1sak43MG8rNy9KNjkvdWhTK3gyTFB2a0FvKzZRdUxja1JhM01nbmRNN0FQb3VSV1BqWkEzaG9yeWJ6MGNlWFAiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJrYlU5MXBmTVR0U1htUDBlMjN4dnFtaDdmdFZyS3Q4WEFHaEhIX3pYbGFqSnBxbG1sTklYUHJOaTA1Q0FSS1hiSVc5cHNaU2xPUEUwMGNlSEtsVXhWWkVnbVVxZHZtczItbk5wZzgxeE1XLTU2Q2tHaG53N281Vk9RdllVakhCcDl5MzFPNjMzaHRqeFZkMGEyRG9WX3kyNHIxNFZzcTFVaFVzX0VEdUY2U0pLQ0pnODlKVzhXcW1SblB0VTVDb2hHRUNqWm5NSVYtM3ByUkNUY3U5VTZtWko5SlhQYktjeUZvZ3NRakozeWs4OVRQOTE4bm5Mc3ozbzRXZTNnWFpvOWFScXBPem5EWlRTbkJ3akNneUNfSUtqNm5XV2Vvc0VHc21NZ3B1VnUwbVJzSDNhdG01OGo5SW5qN2dmcVc5MXdYenZWVElpWjU4aW4wSW9MU3BOSXciLCJraWQiOiIwODV3dGJMZXN5dlJFMVc2QllTV3BISERtQk9LMTVReCJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzQxMDk3MzksImlhdCI6MTYzNDEwODgzOSwianRpIjoiM2pTZVZLR3R2UGZ5QU1DaSJ9.A9Ek14fsuCEr63DRuihOx6nVUTb4I5PF91Jcnfbn5YI',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '176a50bb-3e71-4e4b-98a1-2c17e804ef00',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 6970,
        fractionDigits: 2,
      },
      interactionId: creditCard.multipleShippingAuthReversalId,
      state: 'Success',
    },
  ],
  interfaceInteractions: [],
};

export const multipleShippingReversalId = creditCard.multipleShippingAuthReversalId;
