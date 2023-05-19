import applePay from '../../JSON/applePay.json'
export const payment =
{
  id: '8efb864e-e0e9-4cd2-aebd-983ef3358633',
  version: 15,
  lastMessageSequenceNumber: 4,
  createdAt: '2022-01-25T09:34:33.160Z',
  lastModifiedAt: '2022-01-25T12:06:07.316Z',
  lastModifiedBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be'
  },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be'
  },
  customer: { typeId: 'customer', id: 'e6a74099-888c-4070-90bd-c920c3ba7804' },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
    fractionDigits: 2
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'applePay',
    name: { en: 'Apple Pay' }
  },
  custom: {
    type: { typeId: 'type', id: '87b9d9db-74a3-45d7-8e60-dde669866808' },
    fields: {
      isv_deviceFingerprintId: '5f39f56e-fb1f-4c29-80af-5168603ab5ce',
      isv_cardExpiryYear: '23  ',
      isv_token: 'eyJkYXRhIjoiTDVzMndKK1F1c3Roa3JNNXd2YmNoTjJjem16MVplZTE3TVhaajFxZFZLV0tpVlFtVGozb2pDM0Z3M2dFZWdXcVZuM1VqV0NhZkZjR3hRMURQYk4rZHBDWmFKeUEzVWJJZEFJRUVEZ3lCdjgzQ2FwaFVaRSsvQUl3NURBdFBIK3h4Z2k2S215MmlQYzlUeTlkdlJDNEJsdk5uMVJyM0RUc3FIMkNscXBuYXgvYkYzVzhQeTZKeVEvdzFrQXNtekVLeVBQODdjWjVZeWIrUEEvZTJ6SGhPLzNSN050SkEzakxYWlo4dXdwSk9JelpaSW5uYkh5SE51YWtCUDZxSU5ieG5XT1pqNzhtenFWcmtKUGpHaEp4TDQ3QS9RL2ZsYU9jTzUvSTlJU3crbndOZTkwbjZXWGxoQ0toRXJVVjdpMkNxNXFNLzA3OGk1cDRqRUsxQmhYc0ZrYVFHeGVBY1dRT01NT1A1OXhEKy9TbFFLMXJjK2hqQlVPcngvUHJscEp6RHg0ZkQ1TE5KektGbGtERmhTY1BpWkl4VlNwVHdRQm9SN1lRM2lYOUJDMD0iLCJzaWduYXR1cmUiOiJNSUFHQ1NxR1NJYjNEUUVIQXFDQU1JQUNBUUV4RHpBTkJnbGdoa2dCWlFNRUFnRUZBRENBQmdrcWhraUc5dzBCQndFQUFLQ0FNSUlENURDQ0E0dWdBd0lCQWdJSVdkaWh2S3IwNDgwd0NnWUlLb1pJemowRUF3SXdlakV1TUN3R0ExVUVBd3dsUVhCd2JHVWdRWEJ3YkdsallYUnBiMjRnU1c1MFpXZHlZWFJwYjI0Z1EwRWdMU0JITXpFbU1DUUdBMVVFQ3d3ZFFYQndiR1VnUTJWeWRHbG1hV05oZEdsdmJpQkJkWFJvYjNKcGRIa3hFekFSQmdOVkJBb01Da0Z3Y0d4bElFbHVZeTR4Q3pBSkJnTlZCQVlUQWxWVE1CNFhEVEl4TURReU1ERTVNemN3TUZvWERUSTJNRFF4T1RFNU16WTFPVm93WWpFb01DWUdBMVVFQXd3ZlpXTmpMWE50Y0MxaWNtOXJaWEl0YzJsbmJsOVZRelF0VTBGT1JFSlBXREVVTUJJR0ExVUVDd3dMYVU5VElGTjVjM1JsYlhNeEV6QVJCZ05WQkFvTUNrRndjR3hsSUVsdVl5NHhDekFKQmdOVkJBWVRBbFZUTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFZ2pEOXE4T2M5MTRnTEZEWm0wVVM1amZpcVFIZGJMUGdzYzFMVW1lWStNOU92ZWdhSmFqQ0hrd3ozYzZPS3BiQzlxK2hrd05GeE9oNlJDYk9sUnNTbGFPQ0FoRXdnZ0lOTUF3R0ExVWRFd0VCL3dRQ01BQXdId1lEVlIwakJCZ3dGb0FVSS9KSnhFK1Q1TzhuNXNUMktHdy9vcnY5TGtzd1JRWUlLd1lCQlFVSEFRRUVPVEEzTURVR0NDc0dBUVVGQnpBQmhpbG9kSFJ3T2k4dmIyTnpjQzVoY0hCc1pTNWpiMjB2YjJOemNEQTBMV0Z3Y0d4bFlXbGpZVE13TWpDQ0FSMEdBMVVkSUFTQ0FSUXdnZ0VRTUlJQkRBWUpLb1pJaHZkalpBVUJNSUgrTUlIREJnZ3JCZ0VGQlFjQ0FqQ0J0Z3lCczFKbGJHbGhibU5sSUc5dUlIUm9hWE1nWTJWeWRHbG1hV05oZEdVZ1lua2dZVzU1SUhCaGNuUjVJR0Z6YzNWdFpYTWdZV05qWlhCMFlXNWpaU0J2WmlCMGFHVWdkR2hsYmlCaGNIQnNhV05oWW14bElITjBZVzVrWVhKa0lIUmxjbTF6SUdGdVpDQmpiMjVrYVhScGIyNXpJRzltSUhWelpTd2dZMlZ5ZEdsbWFXTmhkR1VnY0c5c2FXTjVJR0Z1WkNCalpYSjBhV1pwWTJGMGFXOXVJSEJ5WVdOMGFXTmxJSE4wWVhSbGJXVnVkSE11TURZR0NDc0dBUVVGQndJQkZpcG9kSFJ3T2k4dmQzZDNMbUZ3Y0d4bExtTnZiUzlqWlhKMGFXWnBZMkYwWldGMWRHaHZjbWwwZVM4d05BWURWUjBmQkMwd0t6QXBvQ2VnSllZamFIUjBjRG92TDJOeWJDNWhjSEJzWlM1amIyMHZZWEJ3YkdWaGFXTmhNeTVqY213d0hRWURWUjBPQkJZRUZBSWtNQXVhN3UxR01aZWtwbG9wbmtKeGdoeEZNQTRHQTFVZER3RUIvd1FFQXdJSGdEQVBCZ2txaGtpRzkyTmtCaDBFQWdVQU1Bb0dDQ3FHU000OUJBTUNBMGNBTUVRQ0lIU2hzeVRiUWtsRERkTW5URkIweElDTm1oOUlEanFGeGNFMkpXWXlYN3lqQWlCcE5wQlRxL1VMV2xMNTlnQk54WXF0YkZDbjFnaG9ONURncHpyUUhrclpnVENDQXU0d2dnSjFvQU1DQVFJQ0NFbHRMNzg2bU5xWE1Bb0dDQ3FHU000OUJBTUNNR2N4R3pBWkJnTlZCQU1NRWtGd2NHeGxJRkp2YjNRZ1EwRWdMU0JITXpFbU1DUUdBMVVFQ3d3ZFFYQndiR1VnUTJWeWRHbG1hV05oZEdsdmJpQkJkWFJvYjNKcGRIa3hFekFSQmdOVkJBb01Da0Z3Y0d4bElFbHVZeTR4Q3pBSkJnTlZCQVlUQWxWVE1CNFhEVEUwTURVd05qSXpORFl6TUZvWERUSTVNRFV3TmpJek5EWXpNRm93ZWpFdU1Dd0dBMVVFQXd3bFFYQndiR1VnUVhCd2JHbGpZWFJwYjI0Z1NXNTBaV2R5WVhScGIyNGdRMEVnTFNCSE16RW1NQ1FHQTFVRUN3d2RRWEJ3YkdVZ1EyVnlkR2xtYVdOaGRHbHZiaUJCZFhSb2IzSnBkSGt4RXpBUkJnTlZCQW9NQ2tGd2NHeGxJRWx1WXk0eEN6QUpCZ05WQkFZVEFsVlRNRmt3RXdZSEtvWkl6ajBDQVFZSUtvWkl6ajBEQVFjRFFnQUU4QmNSaEJuWFpJWFZHbDRsZ1FkMjZJQ2k3OTU3cmszZ2pmeExrK0V6VnRWbVd6V3VJdENYZGcwaVRudTZDUDEyRjg2SXkzYTdabkMreU9ncGhQOVVSYU9COXpDQjlEQkdCZ2dyQmdFRkJRY0JBUVE2TURnd05nWUlLd1lCQlFVSE1BR0dLbWgwZEhBNkx5OXZZM053TG1Gd2NHeGxMbU52YlM5dlkzTndNRFF0WVhCd2JHVnliMjkwWTJGbk16QWRCZ05WSFE0RUZnUVVJL0pKeEUrVDVPOG41c1QyS0d3L29ydjlMa3N3RHdZRFZSMFRBUUgvQkFVd0F3RUIvekFmQmdOVkhTTUVHREFXZ0JTN3NONmhXRE9JbXFTS21kNit2ZXV2MnNza3F6QTNCZ05WSFI4RU1EQXVNQ3lnS3FBb2hpWm9kSFJ3T2k4dlkzSnNMbUZ3Y0d4bExtTnZiUzloY0hCc1pYSnZiM1JqWVdjekxtTnliREFPQmdOVkhROEJBZjhFQkFNQ0FRWXdFQVlLS29aSWh2ZGpaQVlDRGdRQ0JRQXdDZ1lJS29aSXpqMEVBd0lEWndBd1pBSXdPczl5ZzFFV21iR0crelhEVnNwaXYvUVg3ZGtQZFUyaWpyN3huSUZlUXJlSitKajNtMW1mbU5WQkRZK2Q2Y0wrQWpBeUxkVkVJYkNqQlhkc1hmTTRPNUJuL1JkOExDRnRsay9HY21tQ0VtOVUrSHA5RzVuTG13bUpJV0VHbVE4SmtoMEFBREdDQVl3d2dnR0lBZ0VCTUlHR01Ib3hMakFzQmdOVkJBTU1KVUZ3Y0d4bElFRndjR3hwWTJGMGFXOXVJRWx1ZEdWbmNtRjBhVzl1SUVOQklDMGdSek14SmpBa0JnTlZCQXNNSFVGd2NHeGxJRU5sY25ScFptbGpZWFJwYjI0Z1FYVjBhRzl5YVhSNU1STXdFUVlEVlFRS0RBcEJjSEJzWlNCSmJtTXVNUXN3Q1FZRFZRUUdFd0pWVXdJSVdkaWh2S3IwNDgwd0RRWUpZSVpJQVdVREJBSUJCUUNnZ1pVd0dBWUpLb1pJaHZjTkFRa0RNUXNHQ1NxR1NJYjNEUUVIQVRBY0Jna3Foa2lHOXcwQkNRVXhEeGNOTWpJd01USTFNRGt6TkRVMldqQXFCZ2txaGtpRzl3MEJDVFF4SFRBYk1BMEdDV0NHU0FGbEF3UUNBUVVBb1FvR0NDcUdTTTQ5QkFNQ01DOEdDU3FHU0liM0RRRUpCREVpQkNCZGtsejFGczFhb29aOUs3WmtUQk42MjFCUnBuMU5xOER1ajVzSzl2VndTVEFLQmdncWhrak9QUVFEQWdSSE1FVUNJRGRwbURodEd1anp1V3ZZQ2tNbVBQbmNCb2pkckEwZ3drdXhRVU9OdTBxTkFpRUE0VExQbEFDNHRpWjJtMFhOVVZ5WXVkQ24xTzB6RXlJS2dRdnhIMS91WGEwQUFBQUFBQUE9IiwiaGVhZGVyIjp7InB1YmxpY0tleUhhc2giOiJ6Y2ZxbjRUU3lPdG9mV1AvVnRiL21icmxPaE10NGh3N2xHTVhNVmxKOWhRPSIsImVwaGVtZXJhbFB1YmxpY0tleSI6Ik1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMERBUWNEUWdBRUJ6VVJBYUtSbHJob3hQQklNb2lzWU4xdzUwR0FOM2pKazQ2YUZVOWtzSzdUNDNZMXpIWlg3eDU1VHoxSG5LbUFXL1ZKaW55TG5EZTRheDZCMElwSzdnPT0iLCJ0cmFuc2FjdGlvbklkIjoiOGY1NmU4NDMzOTA3NDg3ZmNkY2RiZTVhZWJjYzg4ZmFiY2U4Mjg3ODQwYmJkODgxODVhZTBiN2FjMzg1YmExMSJ9LCJ2ZXJzaW9uIjoiRUNfdjEifQ==',
      isv_applePayValidationUrl: "https://apple-pay-gateway-cert.apple.com/paymentservices/startSession",
      isv_applePayDisplayName: "Sunrise",
      isv_customerIpAddress: "49.206.8.235", isv_maskedPan: '483196XXXXXX5772',
      isv_cardExpiryMonth: '12',
      isv_userAgentHeader: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
      isv_acceptHeader: '*/*',
      isv_cardType: '001'
    }
  },
  paymentStatus: {},
  transactions: [
    {
      id: 'ab75ae47-843b-4792-ac96-64e99dea2c74',
      timestamp: '2022-01-25T09:34:59.615Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 6970,
        fractionDigits: 2
      },
      interactionId: applePay.authReversalId,
      state: 'Success'
    }
  ],
  interfaceInteractions: [],
  anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be'
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

export const authReversalId = applePay.authReversalId

export const authReversalID = '64311367635468863039'

export const payments =
{
  id: '8efb864e-e0e9-4cd2-aebd-983ef3358633',
  version: 15,
  lastMessageSequenceNumber: 4,
  createdAt: '2022-01-25T09:34:33.160Z',
  lastModifiedAt: '2022-01-25T12:06:07.316Z',
  lastModifiedBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be'
  },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be'
  },
  customer: { typeId: 'customer', id: 'e6a74099-888c-4070-90bd-c920c3ba7804' },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: applePay.centAmountValue,
    fractionDigits: 2
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'applePay',
    name: { en: 'Apple Pay' }
  },
  custom: {
    type: { typeId: 'type', id: '87b9d9db-74a3-45d7-8e60-dde669866808' },
    fields: {
      isv_deviceFingerprintId: '5f39f56e-fb1f-4c29-80af-5168603ab5ce',
      isv_cardExpiryYear: '23  ',
      isv_token: 'eyJkYXRhIjoiTDVzMndKK1F1c3Roa3JNNXd2YmNoTjJjem16MVplZTE3TVhaajFxZFZLV0tpVlFtVGozb2pDM0Z3M2dFZWdXcVZuM1VqV0NhZkZjR3hRMURQYk4rZHBDWmFKeUEzVWJJZEFJRUVEZ3lCdjgzQ2FwaFVaRSsvQUl3NURBdFBIK3h4Z2k2S215MmlQYzlUeTlkdlJDNEJsdk5uMVJyM0RUc3FIMkNscXBuYXgvYkYzVzhQeTZKeVEvdzFrQXNtekVLeVBQODdjWjVZeWIrUEEvZTJ6SGhPLzNSN050SkEzakxYWlo4dXdwSk9JelpaSW5uYkh5SE51YWtCUDZxSU5ieG5XT1pqNzhtenFWcmtKUGpHaEp4TDQ3QS9RL2ZsYU9jTzUvSTlJU3crbndOZTkwbjZXWGxoQ0toRXJVVjdpMkNxNXFNLzA3OGk1cDRqRUsxQmhYc0ZrYVFHeGVBY1dRT01NT1A1OXhEKy9TbFFLMXJjK2hqQlVPcngvUHJscEp6RHg0ZkQ1TE5KektGbGtERmhTY1BpWkl4VlNwVHdRQm9SN1lRM2lYOUJDMD0iLCJzaWduYXR1cmUiOiJNSUFHQ1NxR1NJYjNEUUVIQXFDQU1JQUNBUUV4RHpBTkJnbGdoa2dCWlFNRUFnRUZBRENBQmdrcWhraUc5dzBCQndFQUFLQ0FNSUlENURDQ0E0dWdBd0lCQWdJSVdkaWh2S3IwNDgwd0NnWUlLb1pJemowRUF3SXdlakV1TUN3R0ExVUVBd3dsUVhCd2JHVWdRWEJ3YkdsallYUnBiMjRnU1c1MFpXZHlZWFJwYjI0Z1EwRWdMU0JITXpFbU1DUUdBMVVFQ3d3ZFFYQndiR1VnUTJWeWRHbG1hV05oZEdsdmJpQkJkWFJvYjNKcGRIa3hFekFSQmdOVkJBb01Da0Z3Y0d4bElFbHVZeTR4Q3pBSkJnTlZCQVlUQWxWVE1CNFhEVEl4TURReU1ERTVNemN3TUZvWERUSTJNRFF4T1RFNU16WTFPVm93WWpFb01DWUdBMVVFQXd3ZlpXTmpMWE50Y0MxaWNtOXJaWEl0YzJsbmJsOVZRelF0VTBGT1JFSlBXREVVTUJJR0ExVUVDd3dMYVU5VElGTjVjM1JsYlhNeEV6QVJCZ05WQkFvTUNrRndjR3hsSUVsdVl5NHhDekFKQmdOVkJBWVRBbFZUTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFZ2pEOXE4T2M5MTRnTEZEWm0wVVM1amZpcVFIZGJMUGdzYzFMVW1lWStNOU92ZWdhSmFqQ0hrd3ozYzZPS3BiQzlxK2hrd05GeE9oNlJDYk9sUnNTbGFPQ0FoRXdnZ0lOTUF3R0ExVWRFd0VCL3dRQ01BQXdId1lEVlIwakJCZ3dGb0FVSS9KSnhFK1Q1TzhuNXNUMktHdy9vcnY5TGtzd1JRWUlLd1lCQlFVSEFRRUVPVEEzTURVR0NDc0dBUVVGQnpBQmhpbG9kSFJ3T2k4dmIyTnpjQzVoY0hCc1pTNWpiMjB2YjJOemNEQTBMV0Z3Y0d4bFlXbGpZVE13TWpDQ0FSMEdBMVVkSUFTQ0FSUXdnZ0VRTUlJQkRBWUpLb1pJaHZkalpBVUJNSUgrTUlIREJnZ3JCZ0VGQlFjQ0FqQ0J0Z3lCczFKbGJHbGhibU5sSUc5dUlIUm9hWE1nWTJWeWRHbG1hV05oZEdVZ1lua2dZVzU1SUhCaGNuUjVJR0Z6YzNWdFpYTWdZV05qWlhCMFlXNWpaU0J2WmlCMGFHVWdkR2hsYmlCaGNIQnNhV05oWW14bElITjBZVzVrWVhKa0lIUmxjbTF6SUdGdVpDQmpiMjVrYVhScGIyNXpJRzltSUhWelpTd2dZMlZ5ZEdsbWFXTmhkR1VnY0c5c2FXTjVJR0Z1WkNCalpYSjBhV1pwWTJGMGFXOXVJSEJ5WVdOMGFXTmxJSE4wWVhSbGJXVnVkSE11TURZR0NDc0dBUVVGQndJQkZpcG9kSFJ3T2k4dmQzZDNMbUZ3Y0d4bExtTnZiUzlqWlhKMGFXWnBZMkYwWldGMWRHaHZjbWwwZVM4d05BWURWUjBmQkMwd0t6QXBvQ2VnSllZamFIUjBjRG92TDJOeWJDNWhjSEJzWlM1amIyMHZZWEJ3YkdWaGFXTmhNeTVqY213d0hRWURWUjBPQkJZRUZBSWtNQXVhN3UxR01aZWtwbG9wbmtKeGdoeEZNQTRHQTFVZER3RUIvd1FFQXdJSGdEQVBCZ2txaGtpRzkyTmtCaDBFQWdVQU1Bb0dDQ3FHU000OUJBTUNBMGNBTUVRQ0lIU2hzeVRiUWtsRERkTW5URkIweElDTm1oOUlEanFGeGNFMkpXWXlYN3lqQWlCcE5wQlRxL1VMV2xMNTlnQk54WXF0YkZDbjFnaG9ONURncHpyUUhrclpnVENDQXU0d2dnSjFvQU1DQVFJQ0NFbHRMNzg2bU5xWE1Bb0dDQ3FHU000OUJBTUNNR2N4R3pBWkJnTlZCQU1NRWtGd2NHeGxJRkp2YjNRZ1EwRWdMU0JITXpFbU1DUUdBMVVFQ3d3ZFFYQndiR1VnUTJWeWRHbG1hV05oZEdsdmJpQkJkWFJvYjNKcGRIa3hFekFSQmdOVkJBb01Da0Z3Y0d4bElFbHVZeTR4Q3pBSkJnTlZCQVlUQWxWVE1CNFhEVEUwTURVd05qSXpORFl6TUZvWERUSTVNRFV3TmpJek5EWXpNRm93ZWpFdU1Dd0dBMVVFQXd3bFFYQndiR1VnUVhCd2JHbGpZWFJwYjI0Z1NXNTBaV2R5WVhScGIyNGdRMEVnTFNCSE16RW1NQ1FHQTFVRUN3d2RRWEJ3YkdVZ1EyVnlkR2xtYVdOaGRHbHZiaUJCZFhSb2IzSnBkSGt4RXpBUkJnTlZCQW9NQ2tGd2NHeGxJRWx1WXk0eEN6QUpCZ05WQkFZVEFsVlRNRmt3RXdZSEtvWkl6ajBDQVFZSUtvWkl6ajBEQVFjRFFnQUU4QmNSaEJuWFpJWFZHbDRsZ1FkMjZJQ2k3OTU3cmszZ2pmeExrK0V6VnRWbVd6V3VJdENYZGcwaVRudTZDUDEyRjg2SXkzYTdabkMreU9ncGhQOVVSYU9COXpDQjlEQkdCZ2dyQmdFRkJRY0JBUVE2TURnd05nWUlLd1lCQlFVSE1BR0dLbWgwZEhBNkx5OXZZM053TG1Gd2NHeGxMbU52YlM5dlkzTndNRFF0WVhCd2JHVnliMjkwWTJGbk16QWRCZ05WSFE0RUZnUVVJL0pKeEUrVDVPOG41c1QyS0d3L29ydjlMa3N3RHdZRFZSMFRBUUgvQkFVd0F3RUIvekFmQmdOVkhTTUVHREFXZ0JTN3NONmhXRE9JbXFTS21kNit2ZXV2MnNza3F6QTNCZ05WSFI4RU1EQXVNQ3lnS3FBb2hpWm9kSFJ3T2k4dlkzSnNMbUZ3Y0d4bExtTnZiUzloY0hCc1pYSnZiM1JqWVdjekxtTnliREFPQmdOVkhROEJBZjhFQkFNQ0FRWXdFQVlLS29aSWh2ZGpaQVlDRGdRQ0JRQXdDZ1lJS29aSXpqMEVBd0lEWndBd1pBSXdPczl5ZzFFV21iR0crelhEVnNwaXYvUVg3ZGtQZFUyaWpyN3huSUZlUXJlSitKajNtMW1mbU5WQkRZK2Q2Y0wrQWpBeUxkVkVJYkNqQlhkc1hmTTRPNUJuL1JkOExDRnRsay9HY21tQ0VtOVUrSHA5RzVuTG13bUpJV0VHbVE4SmtoMEFBREdDQVl3d2dnR0lBZ0VCTUlHR01Ib3hMakFzQmdOVkJBTU1KVUZ3Y0d4bElFRndjR3hwWTJGMGFXOXVJRWx1ZEdWbmNtRjBhVzl1SUVOQklDMGdSek14SmpBa0JnTlZCQXNNSFVGd2NHeGxJRU5sY25ScFptbGpZWFJwYjI0Z1FYVjBhRzl5YVhSNU1STXdFUVlEVlFRS0RBcEJjSEJzWlNCSmJtTXVNUXN3Q1FZRFZRUUdFd0pWVXdJSVdkaWh2S3IwNDgwd0RRWUpZSVpJQVdVREJBSUJCUUNnZ1pVd0dBWUpLb1pJaHZjTkFRa0RNUXNHQ1NxR1NJYjNEUUVIQVRBY0Jna3Foa2lHOXcwQkNRVXhEeGNOTWpJd01USTFNRGt6TkRVMldqQXFCZ2txaGtpRzl3MEJDVFF4SFRBYk1BMEdDV0NHU0FGbEF3UUNBUVVBb1FvR0NDcUdTTTQ5QkFNQ01DOEdDU3FHU0liM0RRRUpCREVpQkNCZGtsejFGczFhb29aOUs3WmtUQk42MjFCUnBuMU5xOER1ajVzSzl2VndTVEFLQmdncWhrak9QUVFEQWdSSE1FVUNJRGRwbURodEd1anp1V3ZZQ2tNbVBQbmNCb2pkckEwZ3drdXhRVU9OdTBxTkFpRUE0VExQbEFDNHRpWjJtMFhOVVZ5WXVkQ24xTzB6RXlJS2dRdnhIMS91WGEwQUFBQUFBQUE9IiwiaGVhZGVyIjp7InB1YmxpY0tleUhhc2giOiJ6Y2ZxbjRUU3lPdG9mV1AvVnRiL21icmxPaE10NGh3N2xHTVhNVmxKOWhRPSIsImVwaGVtZXJhbFB1YmxpY0tleSI6Ik1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMERBUWNEUWdBRUJ6VVJBYUtSbHJob3hQQklNb2lzWU4xdzUwR0FOM2pKazQ2YUZVOWtzSzdUNDNZMXpIWlg3eDU1VHoxSG5LbUFXL1ZKaW55TG5EZTRheDZCMElwSzdnPT0iLCJ0cmFuc2FjdGlvbklkIjoiOGY1NmU4NDMzOTA3NDg3ZmNkY2RiZTVhZWJjYzg4ZmFiY2U4Mjg3ODQwYmJkODgxODVhZTBiN2FjMzg1YmExMSJ9LCJ2ZXJzaW9uIjoiRUNfdjEifQ==',
      isv_applePayValidationUrl: "https://apple-pay-gateway-cert.apple.com/paymentservices/startSession",
      isv_applePayDisplayName: "Sunrise",
      isv_customerIpAddress: "49.206.8.235",
      isv_maskedPan: '483196XXXXXX5772',
      isv_cardExpiryMonth: '12',
      isv_userAgentHeader: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
      isv_acceptHeader: '*/*',
      isv_cardType: '001'
    }
  },
  paymentStatus: {},
  transactions: [
    {
      id: 'ab75ae47-843b-4792-ac96-64e99dea2c74',
      timestamp: '2022-01-25T09:34:59.615Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 6970,
        fractionDigits: 2
      },
      interactionId: applePay.authReversalId,
      state: 'Success'
    }
  ],
  interfaceInteractions: [],
  anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be'
}

export const shippingCart = {
  "type": "Cart",
  "id": "26e44ca8-794f-4bc5-84db-4b476eb4fed1",
  "version": 16,
  "versionModifiedAt": "2023-04-21T07:15:39.775Z",
  "lastMessageSequenceNumber": 1,
  "createdAt": "2023-04-21T07:13:31.827Z",
  "lastModifiedAt": "2023-04-21T07:15:39.775Z",
  "lastModifiedBy": {
    "clientId": "C0f71msxpiTpAB0OiOaItOs8",
    "isPlatformClient": false,
    "anonymousId": "475f215e-9a1e-49f1-8756-8fadac9a5623"
  },
  "createdBy": {
    "clientId": "C0f71msxpiTpAB0OiOaItOs8",
    "isPlatformClient": false,
    "anonymousId": "475f215e-9a1e-49f1-8756-8fadac9a5623"
  },
  "anonymousId": "475f215e-9a1e-49f1-8756-8fadac9a5623",
  "locale": "en-US",
  "lineItems": [
    {
      "id": "77197bf1-a747-499b-88e4-df16ff235f9f",
      "productId": "c28cfa09-801e-4309-8e2e-edf39f85ddf2",
      "name": {
        "en": "sandalen “Aubrey” Michael Kors brown",
        "de": "sandalen “Aubrey” Michael Kors brown",
        "en-US": "sandalen “Aubrey” Michael Kors brown",
        "de-DE": "sandalen “Aubrey” Michael Kors brown"
      },
      "productType": {
        "typeId": "product-type",
        "id": "404a5e8f-70a7-41a3-9b39-0b02b1b90b83",
        "version": 1
      },
      "productSlug": {
        "en": "a5",
        "de": "a5",
        "en-US": "a5",
        "de-DE": "a5"
      },
      "variant": {
        "id": 1,
        "sku": "sku-5",
        "prices": [
          {
            "id": "4306d10f-8582-44f5-9cce-201be3066555",
            "value": {
              "type": "centPrecision",
              "currencyCode": "EUR",
              "centAmount": 8000,
              "fractionDigits": 2
            },
            "country": "DE"
          },
          {
            "id": "99663748-061c-46f1-b6ad-13cd7872b817",
            "value": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 8000,
              "fractionDigits": 2
            },
            "country": "US"
          }
        ],
        "images": [
          {
            "url": "https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/082405_1_medium.jpg",
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
        "id": "99663748-061c-46f1-b6ad-13cd7872b817",
        "value": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 8000,
          "fractionDigits": 2
        },
        "country": "US"
      },
      "quantity": 1,
      "discountedPricePerQuantity": [],
      "perMethodTaxRate": [],
      "addedAt": "2023-04-21T07:13:32.176Z",
      "lastModifiedAt": "2023-04-21T07:13:32.176Z",
      "state": [
        {
          "quantity": 1,
          "state": {
            "typeId": "state",
            "id": "8e52f9e7-5650-4d0f-a4bf-7d6ba7c2f98f"
          }
        }
      ],
      "priceMode": "Platform",
      "lineItemMode": "Standard",
      "totalPrice": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 8000,
        "fractionDigits": 2
      },
      "taxedPricePortions": []
    }
  ],
  "cartState": "Active",
  "totalPrice": {
    "type": "centPrecision",
    "currencyCode": "USD",
    "centAmount": 10180,
    "fractionDigits": 2
  },
  "country": "US",
  "shippingMode": "Multiple",
  "shipping": [
    {
      "shippingKey": "shippingKey123",
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
          "name": "test-taxes-category",
          "amount": 0.2,
          "includedInPrice": true,
          "country": "US",
          "id": "yo5l4O7M",
          "subRates": []
        },
        "taxCategory": {
          "typeId": "tax-category",
          "id": "9ed4dda8-d050-4f6b-90a8-34901c33b6f8"
        },
        "deliveries": [],
        "shippingMethod": {
          "typeId": "shipping-method",
          "id": "793cc3e5-20fa-4931-a22d-0bb7c9db8be3"
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
      "shippingAddress": {
        "streetName": "ABC Street",
        "streetNumber": "1234",
        "postalCode": "94043",
        "city": "Mountain Views",
        "region": "CA",
        "country": "US",
        "key": "addressKeyOne"
      }
    },
    {
      "shippingKey": "myUniqueKey23455",
      "shippingInfo": {
        "shippingMethodName": "DHL",
        "price": {
          "type": "centPrecision",
          "currencyCode": "USD",
          "centAmount": 1190,
          "fractionDigits": 2
        },
        "shippingRate": {
          "price": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 1190,
            "fractionDigits": 2
          },
          "tiers": []
        },
        "taxRate": {
          "name": "test-taxes-category",
          "amount": 0.2,
          "includedInPrice": true,
          "country": "US",
          "id": "yo5l4O7M",
          "subRates": []
        },
        "taxCategory": {
          "typeId": "tax-category",
          "id": "9ed4dda8-d050-4f6b-90a8-34901c33b6f8"
        },
        "deliveries": [],
        "shippingMethod": {
          "typeId": "shipping-method",
          "id": "c80f6822-8b9d-476e-b4ac-3125fa789af2"
        },
        "taxedPrice": {
          "totalNet": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 992,
            "fractionDigits": 2
          },
          "totalGross": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 1190,
            "fractionDigits": 2
          },
          "totalTax": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 198,
            "fractionDigits": 2
          }
        },
        "shippingMethodState": "MatchesCart"
      },
      "shippingAddress": {
        "streetName": "PRB Nagar",
        "streetNumber": "1234",
        "postalCode": "94043",
        "city": "Mountain Views",
        "region": "CA",
        "country": "US",
        "key": "addressKeyTwo"
      }
    }
  ],
  "customLineItems": [],
  "discountCodes": [],
  "directDiscounts": [],
  "paymentInfo": {
    "payments": [
      {
        "typeId": "payment",
        "id": "8bac631c-8d54-4c80-95fb-aac3f7b294cf"
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
    "firstName": "Shakshi",
    "lastName": "Poddar",
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

export const multipleShippingPayment =
{
  id: 'd5c67aab-2880-4cba-8431-4cb90f9c6fd9',
  version: 2,
  lastMessageSequenceNumber: 2,
  createdAt: '2021-10-13T07:07:39.945Z',
  lastModifiedAt: '2021-10-13T07:07:39.945Z',
  lastModifiedBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '47d6586f-6c7a-4d0e-93bb-344b25600a8a'
  },
  createdBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '47d6586f-6c7a-4d0e-93bb-344b25600a8a'
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: applePay.centAmount,
    fractionDigits: 2
  },
  paymentMethodInfo: { paymentInterface: 'cybersource', method: 'applePay' },
  custom: {
    type: { typeId: 'type', id: '28701886-4e26-4cab-924e-9b0da3829f88' },
    fields: {
      isv_deviceFingerprintId: "1ccd2043-4c08-4419-a629-bc32dc5f91eb",
      isv_cardExpiryYear: '2030',
      isv_token: 'eyJraWQiOiIwOG5aU1BESXFHRnZpaElMWEVxcEdkUG5lbUVUZXkySCIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAzMCIsIm51bWJlciI6IjQxMTExMVhYWFhYWDExMTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wOCIsImV4cCI6MTYzNTIzMTM5NCwidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTYzNTIzMDQ5NCwianRpIjoiMUU2NTZWNThZVjVUS0hQUU1aTFdaMVlPWU1NNjhWWFNSOEpQTllGOFVFSTAzWFlYTTNCRDYxNzdBNkEyMEU5MiIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDMwIn0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDExMTEiLCJiaW4iOiI0MTExMTEifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.U-4A01seF4P9kXQLcNTivdWgYokoRUkjus9pujmNjVx4UOWSxRdp_FnCnt93H7_cEH7eZ46grEiYwyDwbCLYmar4zvzadhaMw0LG3L2_nchCO8GDUoroqpChMdgJ269iKg5EsFTQffMYGCc4FfNkHPn1E1_s_n47VDcqKvidAhryQvb16EsOVoheREE_d8fh8ltad32zwSnXcAyXKu_Zj2XFdhzIyq9Yf_ZTN1vlkMCyDEqpGZ-IX-sWdNFrsoU8L7RDeCNnknzl7JUy4usLo6lIf4vq-BgFrHc3b2W_q2CBqMvylixNlblDGChkB743TXXKR9iFrs3ajYXjHdZztA',
      isv_customerIpAddress: "106.202.150.94",
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_acceptHeader: "*/*",
      isv_cardType: '001',
      isv_userAgentHeader: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
      isv_tokenVerificationContext: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI3cUE5TzduOU81YjEremZ5c2VyWUloQUFFQ0hDMFhiaVZDY3o2a0plQ0VxMjdMNHZFbnV5MHdGclFyTkhGTkVYRWdGcE1sak43MG8rNy9KNjkvdWhTK3gyTFB2a0FvKzZRdUxja1JhM01nbmRNN0FQb3VSV1BqWkEzaG9yeWJ6MGNlWFAiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJrYlU5MXBmTVR0U1htUDBlMjN4dnFtaDdmdFZyS3Q4WEFHaEhIX3pYbGFqSnBxbG1sTklYUHJOaTA1Q0FSS1hiSVc5cHNaU2xPUEUwMGNlSEtsVXhWWkVnbVVxZHZtczItbk5wZzgxeE1XLTU2Q2tHaG53N281Vk9RdllVakhCcDl5MzFPNjMzaHRqeFZkMGEyRG9WX3kyNHIxNFZzcTFVaFVzX0VEdUY2U0pLQ0pnODlKVzhXcW1SblB0VTVDb2hHRUNqWm5NSVYtM3ByUkNUY3U5VTZtWko5SlhQYktjeUZvZ3NRakozeWs4OVRQOTE4bm5Mc3ozbzRXZTNnWFpvOWFScXBPem5EWlRTbkJ3akNneUNfSUtqNm5XV2Vvc0VHc21NZ3B1VnUwbVJzSDNhdG01OGo5SW5qN2dmcVc5MXdYenZWVElpWjU4aW4wSW9MU3BOSXciLCJraWQiOiIwODV3dGJMZXN5dlJFMVc2QllTV3BISERtQk9LMTVReCJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzQxMDk3MzksImlhdCI6MTYzNDEwODgzOSwianRpIjoiM2pTZVZLR3R2UGZ5QU1DaSJ9.A9Ek14fsuCEr63DRuihOx6nVUTb4I5PF91Jcnfbn5YI'
    }
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
        fractionDigits: 2
      },
      interactionId: applePay.multipleShippingAuthReversalId,
      state: 'Success'
    },
  ],
  interfaceInteractions: [],
};

export const multipleShippingReversalId = applePay.multipleShippingAuthReversalId