import applePay from '../../JSON/applePay.json';
export const payment =  {
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
      centAmount: 100,
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
        isv_applePayValidationUrl:"https://apple-pay-gateway-cert.apple.com/paymentservices/startSession",
        isv_applePayDisplayName:"Sunrise",
        isv_customerIpAddress:"49.206.8.235",
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
            centAmount: 100,
            fractionDigits: 2
        },
        interactionId: '6431033040436397403954',
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
        "id": "3d09ed42-1b1b-450a-b670-269437683939",
        "version": 17,
        "lastMessageSequenceNumber": 1,
        "createdAt": "2022-04-11T09:08:17.675Z",
        "lastModifiedAt": "2022-04-11T09:11:01.390Z",
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
                    "centAmount": 100,
                    "fractionDigits": 2
                  },
                  "country": "US"
                },
                {
                  "id": "68018b50-2c8a-4304-b67a-ae15389be32d",
                  "value": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 100,
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
                "centAmount": 100,
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
              "centAmount": 100,
              "fractionDigits": 2
            },
            "taxedPrice": {
              "totalNet": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 49,
                "fractionDigits": 2
              },
              "totalGross": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 100,
                "fractionDigits": 2
              },
              "totalTax": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 99,
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
          "centAmount": 100,
          "fractionDigits": 2
        },
        "taxedPrice": {
          "totalNet": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 49,
            "fractionDigits": 2
          },
          "totalGross": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 100,
            "fractionDigits": 2
          },
          "taxPortions": [
            {
              "rate": 0.2,
              "amount": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 99,
                "fractionDigits": 2
              },
              "name": "test-tax-category"
            }
          ],
          "totalTax": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 99,
            "fractionDigits": 2
          }
        },
        "country": "US",
        "customLineItems": [],
        "discountCodes": [],
        "directDiscounts": [],
        "paymentInfo": {
          "payments": [
            {
              "typeId": "payment",
              "id": "65e14caa-8250-4f49-9807-f248d08e5c78"
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
export const authId = applePay.authId;

export const authID = '64311311155868791039'

export const orderNo =  null;