import creditCard from '../../JSON/creditCard.json';
let payment ={
  "id": "8432cc4b-5595-4760-98a0-5092afbbd463",
  "version": 26,
  "versionModifiedAt": "2025-03-12T09:22:32.872Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-12T09:22:18.695Z",
  "lastModifiedAt": "2025-03-12T09:22:32.872Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "e741823b-f169-4c4e-811c-a87aefb58ad6"
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "e741823b-f169-4c4e-811c-a87aefb58ad6"
  },
  "amountPlanned": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 504580,
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
          "isv_deviceFingerprintId": "329b4580-0e41-498f-992d-abaa45efb968",
          "isv_token": "eyJraWQiOiIwOHN0bzdXSDU0UnQzNjlTNk8wWjdraWF4OUc1U1diRSIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA3IiwiZXhwIjoxNzQxNzcyMjQ4LCJ0eXBlIjoibWYtMi4xLjAiLCJpYXQiOjE3NDE3NzEzNDksImp0aSI6IjFFMUtKVUZRRThVRkdaVk5MRlVZUkxYVUg1RlFDTEIyNFo2MUJGQkYzOVk5TFJaWUEyRlo2N0QxNTVEODQ3OTkiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAyOSJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTExMSIsImJpbiI6IjQxMTExMSJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwMSJ9fX19fQ.W-CSGXonNN0SNXTLrlFEwCDM2dTt3rYX1w1wyY3ciffue4v_bdUvO_JRqp4Oqd-0wxCBKCd09czK2XDrAjrSWI9_oh8TrseJzGZEKBDUJ83R1pSf7f0c_XMcnruoRlN5C1T3pUTJbLIXaXc4i9UJLiYmJ-QBARY4S11vMRo5tkSaGg4nwxqI8s6QlNMXKuksDuIHLy83vvwdmuepjBw6Pcj_dgQNLU0ZAWueBzQNKeNube8x2UzN8uKG0404sunwJ6dOSsLMCWNzt8RLNW2yXsxY_HIPQbXfCaKSi_vGF85ni2grH_PcoRELxPANUYZqjcDaksYNq-5r6OrzmyqYxA",
          "isv_saleEnabled": false,
          "isv_shippingMethod": "",
          "isv_cardType": "001",
          "isv_customerIpAddress": "192.168.1.1",
          "isv_CVVResponse": "3",
          "isv_maskedPan": "411111XXXXXXXXXXXX1111",
          "isv_AVSResponse": "1",
          "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
          "isv_responseCode": "00",
          "isv_responseDateAndTime": "2025-03-12T09:22:32Z",
          "isv_tokenVerificationContext": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJEZ2I4WGNnaXgvT0Z6VEZiVUNLMzhCQUFFTjJ0ZVZ3KytzdXRSUUx0clpWM04yeDdydmwwd1BiQlVCaTA5WURBeml0cWFqQXA1N2cvQnE2VWUzUTlUenAvak5HYmNqbXdRa0pKL0RoSXdwQkFrK1RWaitwbjVXVW1wQnh1YWdVRVB2aHYiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJ2UkJMbkpYRVhiellNWVVjNHh4aE1aRnVaYUlpR3pmM0hXR3BfWlh5U0ZDWi12SzN0c0YxMmlRYXp1ZDFzak1VX3EwOWItMjVCRlp6b0o1Ykl2Uk1uVTNXXy1ESUhsV2N1QXZXaDkyeWlLRDJrbW52M0xZVEJEaDlSb0dXZ2x4cnBodXVEbm9PT3BuYmhUcXEzUzZ6S1RybHY2MXhoWGpvb3pzSDVDSExDTFNfS2hDVjgxaFpHMHJOcTRJa3FJVWY1TFZ4WW0zNWtfd3RVMWZPU1dQZUNGcXR0MEYtcjJYN3hhMnR3UmgtZG5nbUhTZmlGWG9yc1VfNnFzeThCcThmaDZJTmlNUEMxN1BBclY1eTZTZVdZNVBrYzRIUnFXMnJLQ1JmM0dxa054OEFBYmJQQms4RklRQjVDWGl3NmE4cFpyVWp1dWhHTG81TlRwb3VNMlJhRXciLCJraWQiOiIwOHN0bzdXSDU0UnQzNjlTNk8wWjdraWF4OUc1U1diRSJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnlJbnRlZ3JpdHkiOiJzaGEyNTYtM0ZxOVJxQlVDaW1DanRNNGNpZDlia0EyVEJWRUZpWkwvbzZjRzIzVnJHbz0iLCJjbGllbnRMaWJyYXJ5IjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20vbWljcm9mb3JtL2J1bmRsZS92Mi41LjIvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCJdLCJ0YXJnZXRPcmlnaW5zIjpbImh0dHBzOi8vbG9jYWxob3N0OjgwODAiLCJodHRwczovL2xvY2FsaG9zdDo4MDg0IiwiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4NSJdLCJtZk9yaWdpbiI6Imh0dHBzOi8vdGVzdGZsZXguY3liZXJzb3VyY2UuY29tIiwiYWxsb3dlZFBheW1lbnRUeXBlcyI6WyJDQVJEIl19LCJ0eXBlIjoibWYtMi4xLjAifV0sImlzcyI6IkZsZXggQVBJIiwiZXhwIjoxNzQxNzcyMjM4LCJpYXQiOjE3NDE3NzEzMzgsImp0aSI6Ilh0ZVo4MEJqY2ZtS0tveVAifQ.0CT01BR5J793BTj2bXIdBjAbFIKK5UxNVeAxD6L9Fbs",
          "isv_cardExpiryYear": "2029",
          "isv_merchantId": "",
          "isv_authorizationStatus": "AUTHORIZED",
          "isv_cardExpiryMonth": "01"
      }
  },
  "paymentStatus": {},
  "transactions": [
      {
          "id": "842da45b-940d-44c8-be1e-2caa5bc9c32b",
          "timestamp": "2025-03-12T09:22:31.464Z",
          "type": "Authorization",
          "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": creditCard.centAmount,
              "fractionDigits": 2
          },
          "interactionId": "7417713525626563504805",
          "state": "Success"
      }
  ],
  "interfaceInteractions": [],
  "anonymousId": "e741823b-f169-4c4e-811c-a87aefb58ad6"
}
let payments = {
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
      isv_token:
        'eyJraWQiOiIwOG5aU1BESXFHRnZpaElMWEVxcEdkUG5lbUVUZXkySCIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAzMCIsIm51bWJlciI6IjQxMTExMVhYWFhYWDExMTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wOCIsImV4cCI6MTYzNTIzMTM5NCwidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTYzNTIzMDQ5NCwianRpIjoiMUU2NTZWNThZVjVUS0hQUU1aTFdaMVlPWU1NNjhWWFNSOEpQTllGOFVFSTAzWFlYTTNCRDYxNzdBNkEyMEU5MiIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDMwIn0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDExMTEiLCJiaW4iOiI0MTExMTEifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.U-4A01seF4P9kXQLcNTivdWgYokoRUkjus9pujmNjVx4UOWSxRdp_FnCnt93H7_cEH7eZ46grEiYwyDwbCLYmar4zvzadhaMw0LG3L2_nchCO8GDUoroqpChMdgJ269iKg5EsFTQffMYGCc4FfNkHPn1E1_s_n47VDcqKvidAhryQvb16EsOVoheREE_d8fh8ltad32zwSnXcAyXKu_Zj2XFdhzIyq9Yf_ZTN1vlkMCyDEqpGZ-IX-sWdNFrsoU8L7RDeCNnknzl7JUy4usLo6lIf4vq-BgFrHc3b2W_q2CBqMvylixNlblDGChkB743TXXKR9iFrs3ajYXjHdZztA',
      isv_customerIpAddress: '106.202.150.94',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI3cUE5TzduOU81YjEremZ5c2VyWUloQUFFQ0hDMFhiaVZDY3o2a0plQ0VxMjdMNHZFbnV5MHdGclFyTkhGTkVYRWdGcE1sak43MG8rNy9KNjkvdWhTK3gyTFB2a0FvKzZRdUxja1JhM01nbmRNN0FQb3VSV1BqWkEzaG9yeWJ6MGNlWFAiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJrYlU5MXBmTVR0U1htUDBlMjN4dnFtaDdmdFZyS3Q4WEFHaEhIX3pYbGFqSnBxbG1sTklYUHJOaTA1Q0FSS1hiSVc5cHNaU2xPUEUwMGNlSEtsVXhWWkVnbVVxZHZtczItbk5wZzgxeE1XLTU2Q2tHaG53N281Vk9RdllVakhCcDl5MzFPNjMzaHRqeFZkMGEyRG9WX3kyNHIxNFZzcTFVaFVzX0VEdUY2U0pLQ0pnODlKVzhXcW1SblB0VTVDb2hHRUNqWm5NSVYtM3ByUkNUY3U5VTZtWko5SlhQYktjeUZvZ3NRakozeWs4OVRQOTE4bm5Mc3ozbzRXZTNnWFpvOWFScXBPem5EWlRTbkJ3akNneUNfSUtqNm5XV2Vvc0VHc21NZ3B1VnUwbVJzSDNhdG01OGo5SW5qN2dmcVc5MXdYenZWVElpWjU4aW4wSW9MU3BOSXciLCJraWQiOiIwODV3dGJMZXN5dlJFMVc2QllTV3BISERtQk9LMTVReCJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzQxMDk3MzksImlhdCI6MTYzNDEwODgzOSwianRpIjoiM2pTZVZLR3R2UGZ5QU1DaSJ9.A9Ek14fsuCEr63DRuihOx6nVUTb4I5PF91Jcnfbn5YI',
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

const authId = creditCard.authReversalId;

const authID = '639636095168688700';

const carts = 
    {
      type: "Cart",
      id: "1e7e71ad-842f-4193-a98b-be557f2568f2",
      version: 16,
      versionModifiedAt: "2025-03-11T12:33:59.174Z",
      lastMessageSequenceNumber: 1,
      createdAt: "2025-03-11T12:33:27.660Z",
      lastModifiedAt: "2025-03-11T12:33:59.169Z",
      lastModifiedBy: {
        clientId: "xxSiPKLouCf3CRkqu20Byd0N",
        isPlatformClient: false,
        anonymousId: "7949569b-7281-46d0-a079-cc071c3a15ca"
      },
      createdBy: {
        clientId: "xxSiPKLouCf3CRkqu20Byd0N",
        isPlatformClient: false,
        anonymousId: "7949569b-7281-46d0-a079-cc071c3a15ca"
      },
      anonymousId: "7949569b-7281-46d0-a079-cc071c3a15ca",
      locale: "en",
      lineItems: [
        {
          id: "e4ad6dff-7e1a-4b4b-9956-1b670bcf0c83",
          productId: "c93d1d93-79bc-4bfd-ad62-706ce06e2b90",
          name: {
            en: "Mexicon-Hat",
            enUS: "Hat"
          },
          productType: {
            typeId: "product-type",
            id: "20efa170-91df-4d8a-bbd0-610e6a532773",
            version: 1
          },
          productSlug: {
            en: "Mexicon-Hat"
          },
          variant: {
            id: 1,
            sku: "SKU-1",
            prices: [
              {
                id: "6c414313-280a-4d57-bc61-96d212aa7b9b",
                value: {
                  type: "centPrecision",
                  currencyCode: "EUR",
                  centAmount: 4200,
                  fractionDigits: 2
                },
                validFrom: "2025-03-02T18:30:00.000Z",
                validUntil: "2026-03-18T18:30:00.000Z"
              },
              {
                id: "b1feaabf-a309-4805-bf44-f42e1c59760a",
                value: {
                  type: "centPrecision",
                  currencyCode: "USD",
                  centAmount: 501900,
                  fractionDigits: 2
                },
                key: "US",
                validFrom: "2025-03-02T18:30:00.000Z",
                validUntil: "2026-03-05T18:30:00.000Z"
              }
            ],
            images: [
              {
                url: "https://th.bing.com/th/id/OIP.SihGuijrQqicDgOjJIzg7gHaGD?w=207&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
                label: "Hat",
                dimensions: {
                  w: 414,
                  h: 360
                }
              }
            ],
            attributes: [],
            assets: []
          },
          price: {
            id: "b1feaabf-a309-4805-bf44-f42e1c59760a",
            value: {
              type: "centPrecision",
              currencyCode: "USD",
              centAmount: 501900,
              fractionDigits: 2
            },
            key: "US",
            validFrom: "2025-03-02T18:30:00.000Z",
            validUntil: "2026-03-05T18:30:00.000Z"
          },
          quantity: 2,
          discountedPricePerQuantity: [],
          taxRate: {
            name: "en",
            amount: 0.1,
            includedInPrice: false,
            country: "US",
            id: "sfOR5PDn",
            subRates: []
          },
          perMethodTaxRate: [],
          addedAt: "2025-03-11T12:33:27.996Z",
          lastModifiedAt: "2025-03-11T12:33:32.931Z",
          state: [
            {
              quantity: 2,
              state: {
                typeId: "state",
                id: "bbbd6d42-e1ed-47ba-98ee-8759da290bbe"
              }
            }
          ],
          priceMode: "Platform",
          lineItemMode: "Standard",
          totalPrice: {
            type: "centPrecision",
            currencyCode: "USD",
            centAmount: 1003800,
            fractionDigits: 2
          },
          taxedPrice: {
            totalNet: {
              type: "centPrecision",
              currencyCode: "USD",
              centAmount: 1003800,
              fractionDigits: 2
            },
            totalGross: {
              type: "centPrecision",
              currencyCode: "USD",
              centAmount: 1104180,
              fractionDigits: 2
            },
            taxPortions: [
              {
                rate: 0.1,
                amount: {
                  type: "centPrecision",
                  currencyCode: "USD",
                  centAmount: 100380,
                  fractionDigits: 2
                },
                name: "en"
              }
            ],
            totalTax: {
              type: "centPrecision",
              currencyCode: "USD",
              centAmount: 100380,
              fractionDigits: 2
            }
          },
          taxedPricePortions: []
        }
      ],
      cartState: "Ordered",
      totalPrice: {
        type: "centPrecision",
        currencyCode: "USD",
        centAmount: 1003800,
        fractionDigits: 2
      },
      taxedPrice: {
        totalNet: {
          type: "centPrecision",
          currencyCode: "USD",
          centAmount: 1003800,
          fractionDigits: 2
        },
        totalGross: {
          type: "centPrecision",
          currencyCode: "USD",
          centAmount: 1104180,
          fractionDigits: 2
        },
        taxPortions: [
          {
            rate: 0.1,
            amount: {
              type: "centPrecision",
              currencyCode: "USD",
              centAmount: 100380,
              fractionDigits: 2
            },
            name: "en"
          }
        ],
        totalTax: {
          type: "centPrecision",
          currencyCode: "USD",
          centAmount: 100380,
          fractionDigits: 2
        }
      },
      country: "US",
      shippingMode: "Single",
      shippingAddress: {
        firstName: "shipping",
        lastName: "s",
        streetName: "1295 charleston street",
        additionalStreetInfo: "",
        postalCode: "94043",
        city: "houston",
        region: "CA",
        country: "US",
        phone: "09999999999",
        email: "test05@email.com"
      },
      shipping: [],
      customLineItems: [],
      discountCodes: [],
      directDiscounts: [],
      paymentInfo: {
        payments: [
          {
            typeId: "payment",
            id: "2511580b-bb34-4e4c-93a5-ee6559e2ccaf"
          }
        ]
      },
      inventoryMode: "None",
      taxMode: "Platform",
      taxRoundingMode: "HalfEven",
      taxCalculationMode: "LineItemLevel",
      deleteDaysAfterLastModification: 90,
      refusedGifts: [],
      origin: "Customer",
      billingAddress: {
        firstName: "shipping",
        lastName: "s",
        streetName: "1295 charleston street",
        additionalStreetInfo: "",
        postalCode: "94043",
        city: "houston",
        region: "CA",
        country: "US",
        phone: "09999999999",
        email: "test05@email.com"
      },
      itemShippingAddresses: [],
      discountTypeCombination: {
        type: "Stacking"
      },
      totalLineItemQuantity: 2
};


const shippingCart ={
  "type": "Cart",
  "id": "1e7e71ad-842f-4193-a98b-be557f2568f2",
  "version": 16,
  "versionModifiedAt": "2025-03-11T12:33:59.174Z",
  "lastMessageSequenceNumber": 1,
  "createdAt": "2025-03-11T12:33:27.660Z",
  "lastModifiedAt": "2025-03-11T12:33:59.169Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "7949569b-7281-46d0-a079-cc071c3a15ca"
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "7949569b-7281-46d0-a079-cc071c3a15ca"
  },
  "anonymousId": "7949569b-7281-46d0-a079-cc071c3a15ca",
  "locale": "en",
  "lineItems": [
      {
          "id": "e4ad6dff-7e1a-4b4b-9956-1b670bcf0c83",
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
          "quantity": 2,
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
          "addedAt": "2025-03-11T12:33:27.996Z",
          "lastModifiedAt": "2025-03-11T12:33:32.931Z",
          "state": [
              {
                  "quantity": 2,
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
              "centAmount": 1003800,
              "fractionDigits": 2
          },
          "taxedPrice": {
              "totalNet": {
                  "type": "centPrecision",
                  "currencyCode": "USD",
                  "centAmount": 1003800,
                  "fractionDigits": 2
              },
              "totalGross": {
                  "type": "centPrecision",
                  "currencyCode": "USD",
                  "centAmount": 1104180,
                  "fractionDigits": 2
              },
              "taxPortions": [
                  {
                      "rate": 0.1,
                      "amount": {
                          "type": "centPrecision",
                          "currencyCode": "USD",
                          "centAmount": 100380,
                          "fractionDigits": 2
                      },
                      "name": "en"
                  }
              ],
              "totalTax": {
                  "type": "centPrecision",
                  "currencyCode": "USD",
                  "centAmount": 100380,
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
      "centAmount": 1003800,
      "fractionDigits": 2
  },
  "taxedPrice": {
      "totalNet": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 1003800,
          "fractionDigits": 2
      },
      "totalGross": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 1104180,
          "fractionDigits": 2
      },
      "taxPortions": [
          {
              "rate": 0.1,
              "amount": {
                  "type": "centPrecision",
                  "currencyCode": "USD",
                  "centAmount": 100380,
                  "fractionDigits": 2
              },
              "name": "en"
          }
      ],
      "totalTax": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 100380,
          "fractionDigits": 2
      }
  },
  "country": "US",
  "shippingMode": "Single",
  "shippingAddress": {
      "firstName": "shipping",
      "lastName": "s",
      "streetName": "1295 charleston street",
      "additionalStreetInfo": "",
      "postalCode": "94043",
      "city": "houston",
      "region": "CA",
      "country": "US",
      "phone": "09999999999",
      "email": "test05@email.com"
  },
  "shipping": [],
  "customLineItems": [],
  "discountCodes": [],
  "directDiscounts": [],
  "paymentInfo": {
      "payments": [
          {
              "typeId": "payment",
              "id": "2511580b-bb34-4e4c-93a5-ee6559e2ccaf"
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
      "firstName": "shipping",
      "lastName": "s",
      "streetName": "1295 charleston street",
      "additionalStreetInfo": "",
      "postalCode": "94043",
      "city": "houston",
      "region": "CA",
      "country": "US",
      "phone": "09999999999",
      "email": "test05@email.com"
  },
  "itemShippingAddresses": [],
  "discountTypeCombination": {
      "type": "Stacking"
  },
  "totalLineItemQuantity": 2
};

let multipleShippingPayment = {
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
      isv_token:
        'eyJraWQiOiIwOG5aU1BESXFHRnZpaElMWEVxcEdkUG5lbUVUZXkySCIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAzMCIsIm51bWJlciI6IjQxMTExMVhYWFhYWDExMTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wOCIsImV4cCI6MTYzNTIzMTM5NCwidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTYzNTIzMDQ5NCwianRpIjoiMUU2NTZWNThZVjVUS0hQUU1aTFdaMVlPWU1NNjhWWFNSOEpQTllGOFVFSTAzWFlYTTNCRDYxNzdBNkEyMEU5MiIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDMwIn0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDExMTEiLCJiaW4iOiI0MTExMTEifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.U-4A01seF4P9kXQLcNTivdWgYokoRUkjus9pujmNjVx4UOWSxRdp_FnCnt93H7_cEH7eZ46grEiYwyDwbCLYmar4zvzadhaMw0LG3L2_nchCO8GDUoroqpChMdgJ269iKg5EsFTQffMYGCc4FfNkHPn1E1_s_n47VDcqKvidAhryQvb16EsOVoheREE_d8fh8ltad32zwSnXcAyXKu_Zj2XFdhzIyq9Yf_ZTN1vlkMCyDEqpGZ-IX-sWdNFrsoU8L7RDeCNnknzl7JUy4usLo6lIf4vq-BgFrHc3b2W_q2CBqMvylixNlblDGChkB743TXXKR9iFrs3ajYXjHdZztA',
      isv_customerIpAddress: '106.202.150.94',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI3cUE5TzduOU81YjEremZ5c2VyWUloQUFFQ0hDMFhiaVZDY3o2a0plQ0VxMjdMNHZFbnV5MHdGclFyTkhGTkVYRWdGcE1sak43MG8rNy9KNjkvdWhTK3gyTFB2a0FvKzZRdUxja1JhM01nbmRNN0FQb3VSV1BqWkEzaG9yeWJ6MGNlWFAiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJrYlU5MXBmTVR0U1htUDBlMjN4dnFtaDdmdFZyS3Q4WEFHaEhIX3pYbGFqSnBxbG1sTklYUHJOaTA1Q0FSS1hiSVc5cHNaU2xPUEUwMGNlSEtsVXhWWkVnbVVxZHZtczItbk5wZzgxeE1XLTU2Q2tHaG53N281Vk9RdllVakhCcDl5MzFPNjMzaHRqeFZkMGEyRG9WX3kyNHIxNFZzcTFVaFVzX0VEdUY2U0pLQ0pnODlKVzhXcW1SblB0VTVDb2hHRUNqWm5NSVYtM3ByUkNUY3U5VTZtWko5SlhQYktjeUZvZ3NRakozeWs4OVRQOTE4bm5Mc3ozbzRXZTNnWFpvOWFScXBPem5EWlRTbkJ3akNneUNfSUtqNm5XV2Vvc0VHc21NZ3B1VnUwbVJzSDNhdG01OGo5SW5qN2dmcVc5MXdYenZWVElpWjU4aW4wSW9MU3BOSXciLCJraWQiOiIwODV3dGJMZXN5dlJFMVc2QllTV3BISERtQk9LMTVReCJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzQxMDk3MzksImlhdCI6MTYzNDEwODgzOSwianRpIjoiM2pTZVZLR3R2UGZ5QU1DaSJ9.A9Ek14fsuCEr63DRuihOx6nVUTb4I5PF91Jcnfbn5YI',
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

const multipleShippingReversalId = creditCard.multipleShippingAuthReversalId;

export default {
  payment,
  payments,
  authId,
  authID,
  carts,
  shippingCart,
  multipleShippingPayment,
  multipleShippingReversalId
}