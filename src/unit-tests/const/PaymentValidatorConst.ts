
 const validAddTokenServiceResponse = {
    "httpCode": 201,
    "transactionId": "7163560946556935304951",
    "status": "AUTHORIZED",
    "data": {
      "_links": {
        "self": {
          "href": "/pts/v2/payments/7163560946556935304951",
          "method": "GET"
        },
        "capture": {
          "href": "/pts/v2/payments/7163560946556935304951/captures",
          "method": "POST"
        }
      },
      "id": "7163560946556935304951",
      "submitTimeUtc": "2024-05-22T05:34:54Z",
      "status": "AUTHORIZED",
      "clientReferenceInformation": {
        "code": "d97e4f9b-d229-449a-9c7d-00625c1da80e"
      },
      "processorInformation": {
        "approvalCode": "831000",
        "transactionId": "201506041511351",
        "networkTransactionId": "201506041511351",
        "responseCode": "00",
        "avs": {
          "code": "1"
        },
        "cardVerification": {
          "resultCode": "3"
        },
        "merchantAdvice": {
          "code": "01",
          "codeRaw": "01"
        }
      },
      "paymentAccountInformation": {
        "card": {
          "type": "001"
        }
      },
      "paymentInformation": {
        "card": {
          "type": "001"
        },
        "tokenizedCard": {
          "type": "001"
        },
        "customer": {
          "id": "1878CFB968EF50D6E063AF598E0A63D1"
        }
      },
      "orderInformation": {
        "amountDetails": {
          "authorizedAmount": "0.00",
          "currency": "USD"
        }
      },
      "tokenInformation": {
        "instrumentidentifierNew": false,
        "paymentInstrument": {
          "id": "19052119B218A7D3E063AF598E0A06BA"
        },
        "instrumentIdentifier": {
          "id": "7030000000026601088",
          "state": "ACTIVE"
        }
      }
    }
  }

   const validUpdateResponse : any = {
    "httpCode": 200,
    "default": false,
    "card": {
      "expirationMonth": "06",
      "expirationYear": "2033",
      "type": "001"
    }
  }

   const validCustomerAuthenticationResponse:any = {

  }

   const validTransactionDetail =
    {
      "httpCode": 201,
      "data": {
          "searchId": "3f5e7ba9-9ccd-47e1-a74e-f58d281990ce",
          "save": false,
          "timezone": "GMT",
          "query": "clientReferenceInformation.code:dd120cce-0459-4e71-abfa-0ef967240e9f AND submitTimeUtc:[NOW/DAY-1DAY TO NOW/HOUR+1HOUR}",
          "offset": 0,
          "limit": 50,
          "sort": "submitTimeUtc:desc",
          "count": 2,
          "totalCount": 2,
          "submitTimeUtc": "2024-07-31T12:21:28Z",
          "_embedded": {
              "transactionSummaries": [
                  {
                      "id": "7224284779446843404953",
                      "submitTimeUtc": "2024-07-31T12:21:18Z",
                      "merchantId": "visa_isv_opencart_barc_dm",
                      "applicationInformation": {
                          "reasonCode": "481",
                          "rCode": "0",
                          "rFlag": "DREJECT",
                          "applications": [
                              {
                                  "name": "ics_pa_enroll",
                                  "reasonCode": "100",
                                  "rCode": "1",
                                  "rFlag": "SOK",
                                  "reconciliationId": "4109727580",
                                  "rMessage": "ics_pa_enroll service was successful",
                                  "returnCode": 1050000
                              },
                              {
                                  "name": "ics_decision",
                                  "reasonCode": "481",
                                  "rCode": "0",
                                  "rFlag": "DREJECT",
                                  "reconciliationId": "4109727580",
                                  "rMessage": "Decision is REJECT.",
                                  "returnCode": 1322002
                              },
                              {
                                  "name": "ics_decision_early",
                                  "reasonCode": "100",
                                  "rCode": "1",
                                  "reconciliationId": "4109727580",
                                  "returnCode": 9999999
                              },
                              {
                                  "name": "ics_auth",
                                  "reasonCode": "100",
                                  "rCode": "1",
                                  "rFlag": "SOK",
                                  "reconciliationId": "4109727580",
                                  "rMessage": "Request was processed successfully.",
                                  "returnCode": 1010000
                              }
                          ]
                      },
                      "buyerInformation": {},
                      "clientReferenceInformation": {
                          "code": "dd120cce-0459-4e71-abfa-0ef967240e9f",
                          "applicationName": "REST API",
                          "partner": {
                              "solutionId": "42EA2Y58"
                          }
                      },
                      "consumerAuthenticationInformation": {
                          "xid": "AJkBBkhgQQAAAE4gSEJydQAAAAA=",
                          "transactionId": "Un4uuOQ4XR2Nu3bbMAB0",
                          "eciRaw": "5"
                      },
                      "deviceInformation": {
                          "ipAddress": "157.51.180.89"
                      },
                      "errorInformation": {},
                      "fraudMarkingInformation": {},
                      "merchantInformation": {
                          "resellerId": "cybs_plugins"
                      },
                      "orderInformation": {
                          "billTo": {
                              "firstName": "TEST",
                              "lastName": "T",
                              "address1": "123 char road",
                              "email": "test@email.com",
                              "country": "US"
                          },
                          "shipTo": {
                              "firstName": "TEST",
                              "lastName": "T",
                              "address1": "123 char road",
                              "country": "US"
                          },
                          "amountDetails": {
                              "totalAmount": "131.85",
                              "currency": "USD"
                          }
                      },
                      "paymentInformation": {
                          "paymentType": {
                              "type": "credit card",
                              "method": "VI"
                          },
                          "customer": {},
                          "card": {
                              "suffix": "1000",
                              "prefix": "400000",
                              "type": "001"
                          }
                      },
                      "processingInformation": {
                          "commerceIndicator": "5",
                          "commerceIndicatorLabel": "vbv"
                      },
                      "processorInformation": {
                          "processor": {
                              "name": "barclays2"
                          },
                          "approvalCode": "131"
                      },
                      "pointOfSaleInformation": {
                          "terminalId": "10011001",
                          "partner": {},
                          "emv": {}
                      },
                      "riskInformation": {
                          "providers": {}
                      },
                      "_links": {
                          "transactionDetail": {
                              "href": "https://apitest.cybersource.com/tss/v2/transactions/7224284779446843404953",
                              "method": "GET"
                          }
                      }
                  },
                  {
                      "id": "7224284700816842204953",
                      "submitTimeUtc": "2024-07-31T12:21:10Z",
                      "merchantId": "visa_isv_opencart_barc_dm",
                      "applicationInformation": {
                          "reasonCode": "100",
                          "rCode": "1",
                          "rFlag": "SOK",
                          "applications": [
                              {
                                  "name": "ics_pa_setup",
                                  "reasonCode": "100",
                                  "rCode": "1",
                                  "rFlag": "SOK",
                                  "rMessage": "Setup complete.",
                                  "returnCode": 1865000
                              }
                          ]
                      },
                      "buyerInformation": {},
                      "clientReferenceInformation": {
                          "code": "dd120cce-0459-4e71-abfa-0ef967240e9f",
                          "applicationName": "REST API",
                          "partner": {}
                      },
                      "consumerAuthenticationInformation": {},
                      "deviceInformation": {},
                      "errorInformation": {},
                      "fraudMarkingInformation": {},
                      "merchantInformation": {
                          "resellerId": "cybs_plugins"
                      },
                      "orderInformation": {
                          "billTo": {},
                          "shipTo": {},
                          "amountDetails": {}
                      },
                      "paymentInformation": {
                          "paymentType": {
                              "type": "credit card",
                              "method": "VI"
                          },
                          "customer": {},
                          "card": {
                              "suffix": "1000",
                              "prefix": "400000",
                              "type": "001"
                          }
                      },
                      "processingInformation": {},
                      "processorInformation": {
                          "processor": {}
                      },
                      "pointOfSaleInformation": {
                          "partner": {},
                          "emv": {}
                      },
                      "riskInformation": {
                          "providers": {}
                      },
                      "_links": {
                          "transactionDetail": {
                              "href": "https://apitest.cybersource.com/tss/v2/transactions/7224284700816842204953",
                              "method": "GET"
                          }
                      }
                  }
              ]
          },
          "_links": {
              "self": {
                  "href": "https://apitest.cybersource.com/tss/v2/searches/3f5e7ba9-9ccd-47e1-a74e-f58d281990ce",
                  "method": "GET"
              }
          }
      }
  }

   const validateTransactionUpdatePaymentObj = {
    "id": "dd120cce-0459-4e71-abfa-0ef967240e9f",
    "version": 31,
    "versionModifiedAt": "2024-07-31T12:21:19.577Z",
    "lastMessageSequenceNumber": 2,
    "createdAt": "2024-07-31T12:20:47.568Z",
    "lastModifiedAt": "2024-07-31T12:21:19.577Z",
    "lastModifiedBy": {
        "clientId": "SjNz8D11gWZnJ8jKqvaW6tAs",
        "isPlatformClient": false,
        "anonymousId": "72e36b22-957d-42da-8a12-ed35da020967"
    },
    "createdBy": {
        "clientId": "SjNz8D11gWZnJ8jKqvaW6tAs",
        "isPlatformClient": false,
        "anonymousId": "72e36b22-957d-42da-8a12-ed35da020967"
    },
    "amountPlanned": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 13185,
        "fractionDigits": 2
    },
    "paymentMethodInfo": {
        "paymentInterface": "cybersource",
        "method": "creditCardWithPayerAuthentication",
        "name": {
            "en": "Credit Card Payer Authentication"
        }
    },
    "custom": {
        "type": {
            "typeId": "type",
            "id": "5cadad95-0bcd-4bf2-8c2f-aaf71223f15c"
        },
        "fields": {
            "isv_requestJwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNjNkMWU2ZS1kOTg2LTQzODItYWQ3OC04NjE3MWE4MzIyYzciLCJpYXQiOjE3MjI0Mjg0NzAsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTcyMjQzMjA3MCwiT3JnVW5pdElkIjoiNjQ5NDRlMzYxMzFlZjIzNzQ3NGQyYTc5IiwiUmVmZXJlbmNlSWQiOiIzNmQ1ZmQ1OC01ZjY5LTQ2NTEtYTRiMC02OTA1OTZiNjM3YjQifQ.ypUhzKBTzIrTii-6mvcowF8P-FgRDIMQtJchD0KXCxQ",
            "isv_deviceFingerprintId": "7206b3f7-ef0c-4e6d-beeb-c9a323785bf3",
            "isv_payerEnrollTransactionId": "7224284779446843404953",
            "isv_token": "eyJraWQiOiIwOEFpOFBiRThHa21sejBJQTB0MmJveVpERFQya2ZUZSIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA4IiwiZXhwIjoxNzIyNDI5MzY5LCJ0eXBlIjoibWYtMi4wLjAiLCJpYXQiOjE3MjI0Mjg0NjksImp0aSI6IjFFMVQ3WDgzUjhZUk9TVjRCN0lCTVFBTFZRTlRSMFBUTFFOS1JUV1E4NFE5Q1ZaWTE5WjY2NkFBMkZCOTIxMTYiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAzMCJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTAwMCIsImJpbiI6IjQwMDAwMCJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwMSJ9fX19fQ.AMc6yycjvdBmPHYORWoHl5SWUAzyQbbwKUneqtP5Rr7IM6l2iWF_wnbAwnNtYKOXzUk9AH2XcPcDksU8A58R-kmhu17I5kG6YgktMXcWY-og9J7wKWZt9BtwjseMrNEWdzpzvrkR3ojNh8vNsR-Y1upgLyf0kE8s-GACP_gFb1Y3Wf8UnJAmQd3VvoW2O7csVKHYdA2LIIhfsDYBdX3fF4HzNoOej8TsW9bnXKBe2_NTRaJyHinBe1Mru-GQP8Dnmv60EMXo9k-nccSlIAsvnhNyrWSGDfnPNTQ5kJWpAfF4CGg8vYK5JXVL02RmlaVXJIdnfGEtJLLGPEZZDww4Aw",
            "isv_payerEnrollHttpCode": 201,
            "isv_CVVResponse": "2",
            "isv_maskedPan": "400000XXXXXXXXXXXX1000",
            "isv_AVSResponse": "U",
            "isv_responseCode": "0",
            "isv_responseDateAndTime": "2024-07-31T12:21:19Z",
            "isv_payerAuthenticationRequired": false,
            "isv_ECI": "vbv",
            "isv_deviceDataCollectionUrl": "https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect",
            "isv_cardinalReferenceId": "36d5fd58-5f69-4651-a4b0-690596b637b4",
            "isv_cardExpiryYear": "2030",
            "isv_merchantId": "",
            "isv_saleEnabled": false,
            "isv_screenHeight": 900,
            "isv_acceptHeader": "*/*",
            "isv_screenWidth": 1440,
            "isv_cardType": "001",
            "isv_payerEnrollStatus": "AUTHORIZED_RISK_DECLINED",
            "isv_customerIpAddress": "157.51.180.89",
            "isv_authorizationStatus": "AUTHORIZED_RISK_DECLINED",
            "isv_cardExpiryMonth": "01",
            "isv_dmpaFlag": true,
            "isv_userAgentHeader": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
            "isv_tokenVerificationContext": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJuYXhEMWQzckVOa3lYVnhodFhBbGNCQUFFQ3RzRVVYK3dTOS9QMHVNV1M5bEZXdW1JMnN4cmdIT2tENG1HcnFOYmdKcGxxaUx3ZTRnSy94N0h3ZGxGRy9QRzgwRkRxQVBsdGw2NTRKNGJQQmUweFdLVGhBL21SV1hNTm5CTmt2cWZhUFBKWGZEYnh5Ymc1UVowTUhmVTNsMXh3PT0iLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJqZUw5U0VIek9NZXBIcmpxSDNJSmRyZ1laVnJDM3NOVjVfUkkwRWVJRXN3cE41QzJYMF9fTG1aNXpZdzNFRTRMX1lsX2g2ZXBUYjIyaUd6U3JleU5SYmRTSnI2NFJBODFwVDF2V0FpaFBPVGxBdW9MeXJTNWFFX1RlTi1SR0RtOUdaTG81NTBxZUp4WjhDaFRhdEMtMTRSMzFaZTlfajR6bHlITHFPOElVN0RReDgteEswTFZNNmxUQ1gtNXZpSncwX2JkZjJpdW81U29xbWJCVnpJdTE5WW44SzA3VXVnY0E5N0kxRVcxZzVrU3J1TFp4eE9Fc3lDYlJJN0lNZFpZYmZFTzJsR0hLMkdTbDFBMXpUdGhKQnE2T0VId1pEQndPMlNBY193VTBPYzBtSVVmWnd1cTJRelV3RnNpSFBBckZzVGVHYzBaTktDaEFzWm9oY0U5VlEiLCJraWQiOiIwOEFpOFBiRThHa21sejBJQTB0MmJveVpERFQya2ZUZSJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiXSwidGFyZ2V0T3JpZ2lucyI6WyJodHRwczovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTIuMC4wIn1dLCJpc3MiOiJGbGV4IEFQSSIsImV4cCI6MTcyMjQyOTM0NywiaWF0IjoxNzIyNDI4NDQ3LCJqdGkiOiJGNlUwbVBkYXVnTjEyY2tIIn0.oc-DW-c4bhB1CL4zQBha5Hfi-O6_pl911fxSzCFR028"
        }
    },
    "paymentStatus": {},
    "transactions": [
        {
            "id": "14e70af5-0dd6-4ab4-9b9c-ec81b872ca59",
            "timestamp": "2024-07-31T12:21:24.088Z",
            "type": "Authorization",
            "amount": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 13185,
                "fractionDigits": 2
            },
            "state": "Initial"
        }
    ],
    "interfaceInteractions": [],
    "anonymousId": "72e36b22-957d-42da-8a12-ed35da020967"
}
  
 const validateConsumerAuthenticationRequiredResponse = {
  "httpCode": 201,
  "transactionId": "7224300956076407204951",
  "status": "201",
  "data": {
      "id": "7224300956076407204951",
      "submitTimeUtc": "2024-07-31T12:48:16Z",
      "status": "201",
      "errorInformation": {
          "reason": "CUSTOMER_AUTHENTICATION_REQUIRED",
          "message": "Decline - Strong Customer Authentication required."
      }
  },
  "action": "",
  "requestData": {
      "clientReferenceInformation": {
          "code": "d35c910a-7771-4c2c-921e-5071870b634d",
          "pausedRequestId": "7224300834216403904951",
          "partner": {
              "solutionId": "42EA2Y58",
              "developerId": "42EA2Y58"
          }
      },
      "tokenInformation": {
          "transientTokenJwt": "eyJraWQiOiIwOFIyOU9NR3ZSMDcwSjlVbFFUUEhmSXhRTlc4TnQ5aSIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA4IiwiZXhwIjoxNzIyNDMwOTc0LCJ0eXBlIjoibWYtMi4wLjAiLCJpYXQiOjE3MjI0MzAwNzQsImp0aSI6IjFFMElNTzIwQlVaOVlRNk9WOUVHVUVGNTZQOUZMUFJGMjdWUUVCTk84V1pSRTVKTzA1OVU2NkFBMzVGRUQ2MzUiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAyNyJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTA5MSIsImJpbiI6IjQwMDAwMCJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwMSJ9fX19fQ.tZYms7c82WXU2wDi_x1RYnOojDtjrBinkq4N8BcygCcrkQNF8eYNnYjiZWZE6Za6mh9OwYed8-91_vsvGUkCFm_yi_AzmpB_Fbg9traOu1C4M-QJxAJJpkpD2YXvn55fpD9uCJMGFehu6NiqJvApXtmO_XS44n0WMOciFISTdlpj8qOidR6NGGsoGGSfcxbbbSufQ43LWoz44SVUj3O3MmDAYfHJ5_rjbKZFoWkvxyMt_-g-qLXd7KNiHSn2fFpYXedJUIPqAgoU7a5P4Es1bNDq6AIZbcWVhs4rs5eF-gmi3eatfKJsZlFhx9UwdGlabZZ0tfZqOo5D_MMpDsrPww"
      },
      "consumerAuthenticationInformation": {
          "authenticationTransactionId": "Zv7S31cQsj2K0DTcE8j0",
          "signedPares": "eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiIyNTdlMGRiZS1kZjhmLTQ2MGYtODg5Zi1kYzVjMTFlMGYyODkiLCJhY3NUcmFuc0lEIjoiMWIwYzA5MDQtNTM4OC00Mzc2LWFjZjItNjE3YTdlYTk1NzcxIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAyIn0"
      },
      "processingInformation": {
          "actionList": [
              "VALIDATE_CONSUMER_AUTHENTICATION"
          ]
      },
      "paymentInformation": {
          "card": {
              "typeSelectionIndicator": 1
          }
      },
      "orderInformation": {
          "billTo": {
              "firstName": "test",
              "lastName": "t",
              "address1": "123 char road",
              "address2": "",
              "locality": "MV",
              "administrativeArea": "CA",
              "postalCode": "94043",
              "country": "US",
              "email": "test@email.com"
          },
          "shipTo": {
              "firstName": "test",
              "lastName": "t",
              "address1": "123 char road",
              "address2": "",
              "locality": "MV",
              "administrativeArea": "CA",
              "postalCode": "94043",
              "country": "US",
              "email": "test@email.com"
          },
          "lineItems": [
              {
                  "totalAmount": 5009.1,
                  "productName": "Shirt",
                  "productSku": "shirt",
                  "productCode": "default",
                  "unitPrice": 5009.1,
                  "quantity": 1,
                  "discountAmount": 0
              },
              {
                  "totalAmount": 9.9,
                  "productName": "DHL",
                  "productSku": "shipping_and_handling",
                  "productCode": "shipping_and_handling",
                  "unitPrice": 9.9,
                  "quantity": 1,
                  "discountAmount": 0
              }
          ],
          "amountDetails": {
              "totalAmount": 5019,
              "currency": "USD"
          }
      },
      "deviceInformation": {
          "fingerprintSessionId": "6656e9c3-a312-44bc-8a3e-ffd42bd4955c",
          "ipAddress": "157.51.180.89",
          "httpAcceptBrowserValue": "*/*",
          "userAgentBrowserValue": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15"
      },
      "riskInformation": {
          "buyerHistory": {
              "customerAccount": {
                  "creationHistory": "GUEST"
              }
          }
      },
      "buyerInformation": {
          "merchantCustomerID": "72e36b22-957d-42da-8a12-ed35da020967"
      }
  },
  "text": {
      "id": "7224300956076407204951",
      "submitTimeUtc": "2024-07-31T12:48:16Z",
      "status": "201",
      "errorInformation": {
          "reason": "CUSTOMER_AUTHENTICATION_REQUIRED",
          "message": "Decline - Strong Customer Authentication required."
      }
  }
}

 const processFailedTokenPaymentResponse = {
  "httpCode": 400,
  "transactionId": "7224322051866412204951",
  "status": "INVALID_REQUEST",
  "data": "",
  "action": "",
  "requestData": "",
  "text": {
      "id": "7224322051866412204951",
      "submitTimeUtc": "2024-07-31T13:23:25Z",
      "status": "INVALID_REQUEST",
      "reason": "INVALID_DATA",
      "message": "Declined - One or more fields in the request contains invalid data"
  }
}

 const processFailedTokenUpdatePaymentObj = {
  "id": "cce2f044-7050-497c-9f7f-78fc3138791f",
  "version": 35,
  "versionModifiedAt": "2024-07-31T13:23:14.541Z",
  "lastMessageSequenceNumber": 2,
  "createdAt": "2024-07-31T13:22:23.242Z",
  "lastModifiedAt": "2024-07-31T13:23:14.541Z",
  "lastModifiedBy": {
      "clientId": "SjNz8D11gWZnJ8jKqvaW6tAs",
      "isPlatformClient": false,
      "customer": {
          "typeId": "customer",
          "id": "d812c38e-2261-4aa5-b110-57933a07e82e"
      }
  },
  "createdBy": {
      "clientId": "SjNz8D11gWZnJ8jKqvaW6tAs",
      "isPlatformClient": false,
      "customer": {
          "typeId": "customer",
          "id": "d812c38e-2261-4aa5-b110-57933a07e82e"
      }
  },
  "customer": {
      "typeId": "customer",
      "id": "d812c38e-2261-4aa5-b110-57933a07e82e"
  },
  "amountPlanned": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 5055,
      "fractionDigits": 2
  },
  "paymentMethodInfo": {
      "paymentInterface": "cybersource",
      "method": "creditCardWithPayerAuthentication",
      "name": {
          "en": "Credit Card Payer Authentication"
      }
  },
  "custom": {
      "type": {
          "typeId": "type",
          "id": "5cadad95-0bcd-4bf2-8c2f-aaf71223f15c"
      },
      "fields": {
          "isv_requestJwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmODdhYWRmNy00YjNlLTQzNTgtOTU3Mi1lYjZlYzEwMDI2ZTMiLCJpYXQiOjE3MjI0MzIxODQsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTcyMjQzNTc4NCwiT3JnVW5pdElkIjoiNjQ5NDRlMzYxMzFlZjIzNzQ3NGQyYTc5IiwiUmVmZXJlbmNlSWQiOiJjMjE2ZTdjNS05ZWQ1LTRkNTctYTg4Yi01YzhjMTMwMWFmODMifQ.nFl2uwDVJUzCPjeZm5pbdXBZeGClLf4zGhi67TgrvGI",
          "isv_deviceFingerprintId": "73b55164-22b6-4ddf-99ba-492d0094b657",
          "isv_payerEnrollTransactionId": "7224321931146409804951",
          "isv_token": "eyJraWQiOiIwOG9XZjFtTFFBVWFkdmlydGhuU25LU3RLUjdSV1dYcyIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA4IiwiZXhwIjoxNzIyNDMzMDgwLCJ0eXBlIjoibWYtMi4wLjAiLCJpYXQiOjE3MjI0MzIxODAsImp0aSI6IjFFMURNS01UT1Q0M05aU1RORDVaQkU4REJUUk1IODFVVjhSNjZBTU9KM0pEWUpPUkU1MU02NkFBM0UzOERGNzUiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAyOSJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTA5MSIsImJpbiI6IjQwMDAwMCJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwMSJ9fX19fQ.iymhz3kEbJ0-OBlHJgNcjSNpbcVpRY-w9xy43lGozIRzE1KRS8d2Bo5DUzndbnSXdwO0tU13NTMLhO1HZUY1Sf3DxJhJb9ya5dWgxQEIBKlK1J9THuHAaoqlzfsdMVCb74F_BuQaEZQYlojJ4r_vF8SBjEC2KgRtLyzVtWEIcbc9-B5D7xCD-TewRQnUcS2BnGf1fGWMcffv3Ph_wGbCfxYsEHQGKYrhdZ7hLKey7h8l5C3livuC1j4L4IOGlX8CYmXWoNs0TNzNjNv_fkUFDMBETMAii-14SkhAoHZlDPs_jn8U6ex95xvengdCOdPaqE5GMbjKF83NAJ5yzZc6xA",
          "isv_payerEnrollHttpCode": 201,
          "isv_payerAuthenticationPaReq": "eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiJjM2VlYzY1Zi00ZmU5LTQ3YjgtYjY1OC04Y2E3NDMxYWZkMzUiLCJhY3NUcmFuc0lEIjoiMmIzNDdkYmQtMzkwZS00OTA5LTlkYWMtNTliMTg3MDAyMjE5IiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAyIn0",
          "isv_stepUpUrl": "https://centinelapistag.cardinalcommerce.com/V2/Cruise/StepUp",
          "isv_maskedPan": "400000XXXXXXXXXXXX1091",
          "isv_payerAuthenticationTransactionId": "zRWZAk2Nq7H27EczDwY0",
          "isv_responseDateAndTime": "2024-07-31T13:23:14Z",
          "isv_payerAuthenticationRequired": true,
          "isv_deviceDataCollectionUrl": "https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect",
          "isv_cardinalReferenceId": "c216e7c5-9ed5-4d57-a88b-5c8c1301af83",
          "isv_cardExpiryYear": "2029",
          "isv_merchantId": "",
          "isv_tokenAlias": "test31",
          "isv_saleEnabled": false,
          "isv_screenHeight": 900,
          "isv_acceptHeader": "*/*",
          "isv_screenWidth": 1440,
          "isv_cardType": "001",
          "isv_payerEnrollStatus": "PENDING_AUTHENTICATION",
          "isv_customerIpAddress": "157.51.180.89",
          "isv_authorizationStatus": "PENDING_AUTHENTICATION",
          "isv_cardExpiryMonth": "01",
          "isv_payerAuthenticationAcsUrl": "https://0merchantacsstag.cardinalcommerce.com/MerchantACSWeb/creq.jsp",
          "isv_dmpaFlag": true,
          "isv_responseJwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZmFhNTYxNS0wNDRhLTRhZjYtOTVkNi0xNmYyMDJlNmUxNjIiLCJpYXQiOjE3MjI0MzIxOTQsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTcyMjQzNTc5NCwiT3JnVW5pdElkIjoiNjQ5NDRlMzYxMzFlZjIzNzQ3NGQyYTc5IiwiUGF5bG9hZCI6eyJBQ1NVcmwiOiJodHRwczovLzBtZXJjaGFudGFjc3N0YWcuY2FyZGluYWxjb21tZXJjZS5jb20vTWVyY2hhbnRBQ1NXZWIvY3JlcS5qc3AiLCJQYXlsb2FkIjoiZXlKdFpYTnpZV2RsVkhsd1pTSTZJa05TWlhFaUxDSnRaWE56WVdkbFZtVnljMmx2YmlJNklqSXVNUzR3SWl3aWRHaHlaV1ZFVTFObGNuWmxjbFJ5WVc1elNVUWlPaUpqTTJWbFl6WTFaaTAwWm1VNUxUUTNZamd0WWpZMU9DMDRZMkUzTkRNeFlXWmtNelVpTENKaFkzTlVjbUZ1YzBsRUlqb2lNbUl6TkRka1ltUXRNemt3WlMwME9UQTVMVGxrWVdNdE5UbGlNVGczTURBeU1qRTVJaXdpWTJoaGJHeGxibWRsVjJsdVpHOTNVMmw2WlNJNklqQXlJbjAiLCJUcmFuc2FjdGlvbklkIjoielJXWkFrMk5xN0gyN0VjekR3WTAifSwiT2JqZWN0aWZ5UGF5bG9hZCI6dHJ1ZSwiUmV0dXJuVXJsIjoiaHR0cHM6Ly9ocm4xZWhhZWw2LmV4ZWN1dGUtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3BheWVyQXV0aFJldHVyblVybCJ9.d9LUqHqoMaOtsi6j5_AWo-Hmw39tyF00hG7l-lDy1pI",
          "isv_userAgentHeader": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
          "isv_tokenVerificationContext": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiIxUW00Ri9tRFRMMzlYV3QvUnBKY09CQUFFUFlNWjF3TDBQcCtDdmFGQU1nd3Rzc0hkRnIzN25yOHFpOFg2VXZHQ2ptb1g4eFN4YnAvbVZMZFg4KzJGZTBpSTJ4aWZzZEExOXdHYm9hZWpLaU1MQmRweTFzajczU1VqbmhLdTBMRlpncGFMRWhBZmMzT2dEdmxjQkYwb3ZoR21BPT0iLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJtSFFEcUhZN2d5SzFOU0FycG5lMWEzTGFBT2NZRDl3by0tclkwUWY5ZVRIM0xudWswQVBrRTNMc05GTTlKYUo3V21QOTNIdWFVUkNqc3czVk5IQ2pvM1RhVE1zSy1iYURCUENxVkFxdzdvclZxdlNIS09Ca21WOW83Y3RrMm9CZDlTWUxzM2NsS0xUQ09NYXo4VEhkemg3QVVPelV1VEc0U29QM3FKbUFHZEwyRE9jVW15VGpIdUNqMFQtdXRIVlZOZGNidXBRam1XQzl5d1VDLXFfMFAycW1uR2taby10eGhsckxVUjhuV0JPLVFKMWdCZEhnLVN1NnFRcjRVOEdSUnN3NndVZWRJbHNfWUJfTUpMRHVuWl9QSlp2aFQtU0t0RHVZTURpWTNsN2RLYlBPTXdKNEdsTkxTblZiM0pieXBHUXMxeUp1TDBINWx2eFpzQzFodnciLCJraWQiOiIwOG9XZjFtTFFBVWFkdmlydGhuU25LU3RLUjdSV1dYcyJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiXSwidGFyZ2V0T3JpZ2lucyI6WyJodHRwczovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTIuMC4wIn1dLCJpc3MiOiJGbGV4IEFQSSIsImV4cCI6MTcyMjQzMzA0MywiaWF0IjoxNzIyNDMyMTQzLCJqdGkiOiJNOHdMUmdMc3dpTW1adVJkIn0.VxfmAh69K6KwK8CPfgBF3Un7uq6DvRoDCRd4rYYDjkU"
      }
  },
  "paymentStatus": {},
  "transactions": [],
  "interfaceInteractions": [
      {
          "type": {
              "typeId": "type",
              "id": "ca474ffc-72d1-4564-b396-8eb692b41456"
          },
          "fields": {
              "specificationVersion": "2.1.0",
              "authorizationAllowed": true,
              "cardinalReferenceId": "c216e7c5-9ed5-4d57-a88b-5c8c1301af83",
              "acsUrl": "https://0merchantacsstag.cardinalcommerce.com/MerchantACSWeb/creq.jsp",
              "veresEnrolled": "Y",
              "authenticationRequired": true,
              "directoryServerTransactionId": "c92dd114-bcb7-43b1-b7fd-99513aeed31a",
              "authenticationTransactionId": "zRWZAk2Nq7H27EczDwY0"
          }
      }
  ]
}

 const processTokenPaymentResponse  = {
  "httpCode": 201,
  "transactionId": "7224883492286504104951",
  "status": "AUTHORIZED",
  "data": {
      "_links": {
          "self": {
              "href": "/pts/v2/payments/7224883492286504104951",
              "method": "GET"
          },
          "capture": {
              "href": "/pts/v2/payments/7224883492286504104951/captures",
              "method": "POST"
          }
      },
      "id": "7224883492286504104951",
      "submitTimeUtc": "2024-08-01T04:59:10Z",
      "status": "AUTHORIZED",
      "clientReferenceInformation": {
          "code": "866e17b6-618a-4e8e-9510-305ed8dac2bb"
      },
      "processorInformation": {
          "approvalCode": "831000",
          "transactionId": "201506041511351",
          "networkTransactionId": "201506041511351",
          "responseCode": "00",
          "avs": {
              "code": "1"
          },
          "cardVerification": {
              "resultCode": "3"
          },
          "merchantAdvice": {
              "code": "01",
              "codeRaw": "01"
          }
      },
      "paymentAccountInformation": {
          "card": {
              "type": "001"
          }
      },
      "paymentInformation": {
          "card": {
              "type": "001"
          },
          "tokenizedCard": {
              "type": "001"
          },
          "customer": {
              "id": "1B14C3561477468FE063AF598E0A0695"
          },
          "scheme": "VISA CREDIT",
          "bin": "400000",
          "accountType": "Visa Traditional",
          "issuer": "INTL HDQTRS-CENTER OWNED",
          "binCountry": "US"
      },
      "orderInformation": {
          "amountDetails": {
              "authorizedAmount": "50.55",
              "currency": "USD"
          }
      },
      "tokenInformation": {
          "instrumentidentifierNew": false,
          "paymentInstrument": {
              "id": "1E98D6362ADB514FE063AF598E0A8407"
          },
          "instrumentIdentifier": {
              "id": "7020000000005531091",
              "state": "ACTIVE"
          }
      },
      "riskInformation": {
          "profile": {},
          "infoCodes": {
              "address": [
                  "UNV-ADDR"
              ],
              "customerList": [
                  "NEG-ASUSP",
                  "NEG-CC",
                  "NEG-EM",
                  "NEG-SUSP"
              ],
              "identityChange": [
                  "MORPH-C",
                  "MORPH-E"
              ],
              "internet": [
                  "FREE-EM",
                  "INTL-IPCO",
                  "MM-IPBCO"
              ],
              "suspicious": [
                  "MUL-EM"
              ],
              "globalVelocity": [
                  "VEL-ADDR",
                  "VEL-NAME",
                  "VELI-CC",
                  "VELL-CC",
                  "VELL-EM",
                  "VELS-CC",
                  "VELV-CC",
                  "VELV-EM"
              ]
          },
          "casePriority": 1,
          "localTime": "21:59:09",
          "score": {
              "factorCodes": [
                  "F",
                  "H",
                  "P"
              ],
              "modelUsed": "default",
              "result": "37"
          },
          "ipAddress": {
              "locality": "chennai",
              "country": "in",
              "administrativeArea": "tn",
              "routingMethod": "mobile gateway",
              "carrier": "reliance jio infocomm limited",
              "organization": "reliance jio infocomm ltd"
          },
          "providers": {
              "fingerprint": {
                  "profile_duration": "4",
                  "test_risk_rating": "neutral"
              }
          }
      },
      "consumerAuthenticationInformation": {}
  }
}

 const processTokenUpdatePaymentObj = {
  "id": "866e17b6-618a-4e8e-9510-305ed8dac2bb",
  "version": 14,
  "versionModifiedAt": "2024-08-01T04:59:04.205Z",
  "lastMessageSequenceNumber": 2,
  "createdAt": "2024-08-01T04:58:39.925Z",
  "lastModifiedAt": "2024-08-01T04:59:04.205Z",
  "lastModifiedBy": {
      "clientId": "SjNz8D11gWZnJ8jKqvaW6tAs",
      "isPlatformClient": false,
      "customer": {
          "typeId": "customer",
          "id": "d812c38e-2261-4aa5-b110-57933a07e82e"
      }
  },
  "createdBy": {
      "clientId": "SjNz8D11gWZnJ8jKqvaW6tAs",
      "isPlatformClient": false,
      "customer": {
          "typeId": "customer",
          "id": "d812c38e-2261-4aa5-b110-57933a07e82e"
      }
  },
  "customer": {
      "typeId": "customer",
      "id": "d812c38e-2261-4aa5-b110-57933a07e82e"
  },
  "amountPlanned": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 5055,
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
          "id": "5cadad95-0bcd-4bf2-8c2f-aaf71223f15c"
      },
      "fields": {
          "isv_tokenCaptureContextSignature": "eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI1bGJPT3FHOHBzUlp3dVEyV0FZRGJSQUFFRU9maTM0a3J6aUZBb3p5VXJpOUtQbzQ4ZHlOeG4xMVlHR1dEM3ZMaDNzU2laNS94OE5rK1Q1Tll6a2s1WE15bkFxNzhWeFgrbmFGUmU0OWRXNm5DTWE0cmk3OHQzU1p2UWpxUys2eVVmdWoiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJzRTVaTDNfYkxXbHBaM3VaelZmX1ZIV0ZUNUVTVW0wRGVlWDN3M1kyaFlYRXJnWHNsdGk5OFVFTWdDTEUtNmhVNWV5akxBdFBTd1Z1Qnl2dE94aFI2QVBMeWpBV1pHYWtNdUlWYXZOeTlnUEtLR1VpYnExamhocE93SW0tOTBWRlk1bnNaZ1BzSnQ3d0NiQ1FTMFprWWJNaEJzTmtRVm5oeGhNaERvdlRDQlZaQnA0Z0w0UkNJTThZQkhKbjZqS2pBUFh6Vm9sbkRpbEZKcUt3N0VQam0tclctejRON3JuX1JtQVAwSjhLZk9VNEFDV0xhMk1ic2NXaXNFWnRoQ3VvQVg2T25EbERGTzJHVnptQTg5SWRnZnZzXzdqX0xScHJkVGU1b1hKTmtGTVZjOF94UWZ2dUE1U2ptRXJUT3lZV0Ruc1h1dGxBMU9KZTEzQklxaWVWeXciLCJraWQiOiIwODdoUHptYzBDbWVPYXRKcE4zYkhDOENBQ0hCbHNnViJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiXSwidGFyZ2V0T3JpZ2lucyI6WyJodHRwczovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTIuMC4wIn1dLCJpc3MiOiJGbGV4IEFQSSIsImV4cCI6MTcyMjQ4OTIxOSwiaWF0IjoxNzIyNDg4MzE5LCJqdGkiOiJmRFJsVnRwMFRpb2U2RHhFIn0.Y-k8qsXCUAUEuuzfhcvFXKr4cTXrlX1ZOE1FSVP3QR9ajgF3wxhWeLXoaRnPyyf0dffDRf4AtOYECpkQPUWelATddDEogpGrfSE5a2pUvYpCaBqJv3xdDXUnXcCXXYVdLW4qYE8O9LJ7qKqsokbiTkwE0-z7wgAJNaak5apXYhSVjNg0DOPJoq20OhGjasj4C-4WoLt_Cnv3wt5Q22RwR0ZAbmB4prTf27DEs7qVhLqhCFAyLqvgG92tNS4gia6j935zJdTdVeUH0tHi8rzZrtSMY-fgTRBiSym8G0jNXS-CZBcPUppQ4loTVGl_U6EeKRoK6LDoTfgCOv307A5q8Q",
          "isv_deviceFingerprintId": "8417d0a2-9a8c-448c-8462-6cf943d1918d",
          "isv_token": "eyJraWQiOiIwODdoUHptYzBDbWVPYXRKcE4zYkhDOENBQ0hCbHNnViIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA4IiwiZXhwIjoxNzIyNDg5MjQxLCJ0eXBlIjoibWYtMi4wLjAiLCJpYXQiOjE3MjI0ODgzNDEsImp0aSI6IjFFMzhXNTNITEJLTTJDR0RCTTUwM0xBRDBWWVYyVDkzTTdGNkFNOURENVhYSFpVOFhZWDk2NkFCMTk5OTk2NDciLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAzMCJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTA5MSIsImJpbiI6IjQwMDAwMCJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwMSJ9fX19fQ.kfTr0_j1C5yGqS-ors93pwhiLWWO2XPejjiefqdWvsxI_2z0JAwU-JlQAlmCSZ3D_RftvdsYCrAwGN1soMKoHCCzsb7_4XxTxUNgXZcShNtIhwsUb9Z62chPYjb8KT6He1AgL27fso6gdqP0uJbIoXYDQeZ3hktjuT1QrGSstLpW9X72MNLVgpKigjcTJdKh0kmF-18H9qDlybEa9A_3PXmy-dXVXzWEo15OyTuVxACoaum79_QEU9YGHMptDvNO7-PjCa9arQ0_LMKhOjjXNDvQ25NJPzMx1f5-zD6HP8gypJ6grmQWZxpjWbhSUty86KnFK6IRWmWtTZ21RlgoJA",
          "isv_cardType": "001",
          "isv_customerIpAddress": "157.51.161.79",
          "isv_maskedPan": "400000XXXXXXXXXXXX1091",
          "isv_cardExpiryMonth": "01",
          "isv_tokenVerificationContext": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI1bGJPT3FHOHBzUlp3dVEyV0FZRGJSQUFFRU9maTM0a3J6aUZBb3p5VXJpOUtQbzQ4ZHlOeG4xMVlHR1dEM3ZMaDNzU2laNS94OE5rK1Q1Tll6a2s1WE15bkFxNzhWeFgrbmFGUmU0OWRXNm5DTWE0cmk3OHQzU1p2UWpxUys2eVVmdWoiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJzRTVaTDNfYkxXbHBaM3VaelZmX1ZIV0ZUNUVTVW0wRGVlWDN3M1kyaFlYRXJnWHNsdGk5OFVFTWdDTEUtNmhVNWV5akxBdFBTd1Z1Qnl2dE94aFI2QVBMeWpBV1pHYWtNdUlWYXZOeTlnUEtLR1VpYnExamhocE93SW0tOTBWRlk1bnNaZ1BzSnQ3d0NiQ1FTMFprWWJNaEJzTmtRVm5oeGhNaERvdlRDQlZaQnA0Z0w0UkNJTThZQkhKbjZqS2pBUFh6Vm9sbkRpbEZKcUt3N0VQam0tclctejRON3JuX1JtQVAwSjhLZk9VNEFDV0xhMk1ic2NXaXNFWnRoQ3VvQVg2T25EbERGTzJHVnptQTg5SWRnZnZzXzdqX0xScHJkVGU1b1hKTmtGTVZjOF94UWZ2dUE1U2ptRXJUT3lZV0Ruc1h1dGxBMU9KZTEzQklxaWVWeXciLCJraWQiOiIwODdoUHptYzBDbWVPYXRKcE4zYkhDOENBQ0hCbHNnViJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiXSwidGFyZ2V0T3JpZ2lucyI6WyJodHRwczovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTIuMC4wIn1dLCJpc3MiOiJGbGV4IEFQSSIsImV4cCI6MTcyMjQ4OTIxOSwiaWF0IjoxNzIyNDg4MzE5LCJqdGkiOiJmRFJsVnRwMFRpb2U2RHhFIn0.JQYxqhBcdH4YIKMNkyGkNMpPzTt0c4q1_qkH9L501Fk",
          "isv_cardExpiryYear": "2030",
          "isv_merchantId": "",
          "isv_saleEnabled": false,
          "isv_tokenAlias": "visaTest"
      }
  },
  "paymentStatus": {},
  "transactions": [
      {
          "id": "4b98e493-ffee-4d3d-a9eb-343e0852a034",
          "timestamp": "2024-08-01T04:59:07.706Z",
          "type": "Authorization",
          "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 5055,
              "fractionDigits": 2
          },
          "state": "Initial"
      }
  ],
  "interfaceInteractions": []
}

export default {
    validAddTokenServiceResponse,
    validUpdateResponse,
    validCustomerAuthenticationResponse,
    validTransactionDetail,
    validateTransactionUpdatePaymentObj,
    validateConsumerAuthenticationRequiredResponse,
    processFailedTokenPaymentResponse,
    processFailedTokenUpdatePaymentObj,
    processTokenPaymentResponse,
    processTokenUpdatePaymentObj
}