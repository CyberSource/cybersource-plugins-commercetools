import { addressType } from '../../types/Types';

export const setTransactionIdPaymentResponse: any = {
  httpCode: 201,
  transactionId: '7017633839226148803955',
  status: 'AUTHORIZED',
  data: {
    _links: {
      self: {
        href: '/pts/v2/payments/7017623381496947603955',
        method: 'GET',
      },
      capture: {
        href: '/pts/v2/payments/7017623381496947603955/captures',
        method: 'POST',
      },
    },
    id: '7017633839226148803955',
    submitTimeUtc: '2023-12-05T08:03:04Z',
    status: 'AUTHORIZED',
    clientReferenceInformation: {
      code: '871e5198-a84f-4794-adb3-4d7fd72290f8',
    },
    processorInformation: {
      approvalCode: '831000',
      transactionId: '201506041511351',
      networkTransactionId: '201506041511351',
      responseCode: '00',
      avs: {
        code: '1',
      },
      cardVerification: {
        resultCode: '3',
      },
    },
    paymentAccountInformation: {
      card: {
        type: '001',
      },
    },
    paymentInformation: {
      card: {
        type: '001',
      },
      tokenizedCard: {
        type: '001',
      },
      scheme: 'VISA DEBIT',
      bin: '411111',
      accountType: 'Visa Classic',
      issuer: 'CONOTOXIA SP. Z O.O',
      binCountry: 'PL',
    },
    orderInformation: {
      amountDetails: {
        authorizedAmount: '38.40',
        currency: 'USD',
      },
    },
    riskInformation: {
      profile: {},
      infoCodes: {
        customerList: ['NEG-CC', 'NEG-EM', 'NEG-FCB', 'NEG-SUSP'],
        identityChange: ['MORPH-P'],
        globalVelocity: ['VELL-EM', 'VELV-EM'],
      },
      casePriority: 1,
      localTime: '0:45:38',
      score: {
        factorCodes: ['F', 'G', 'Q', 'V'],
        modelUsed: 'default_eu',
        result: '90',
      },
      ipAddress: {
        locality: 'new delhi',
        country: 'in',
        administrativeArea: 'dl',
        routingMethod: 'fixed',
        carrier: 'bharti airtel ltd.',
        organization: 'bharti airtel ltd. 224okhla industrial area phase iii new delh',
      },
      providers: {
        fingerprint: {
          profile_duration: '5',
          test_risk_rating: 'neutral',
        },
      },
    },
    consumerAuthenticationInformation: {},
  },
};

export const setTransactionIdTransactionDetail = {
  id: '8a3e4e74-7599-45c9-9538-b76b73814f2a',
  timestamp: '2023-12-05T08:03:04.037Z',
  type: 'Authorization',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 7640,
    fractionDigits: 2,
  },
  state: 'Initial',
};

export const failurePaymentResponse = {
  httpCode: 201,
  transactionId: '6437973031316274803954',
  status: 'DECLINED',
  data: {
    id: '6437973031316274803954',
    submitTimeUtc: '2022-02-02T10:21:43Z',
    status: 'DECLINED',
    errorInformation: {
      reason: 'DECISION_PROFILE_REJECT',
      message: 'The order has been rejected by Decision Manager',
    },
    clientReferenceInformation: {
      code: '2d2f0cdb-e057-41f5-81f9-d98da238c3f2',
    },
    processingInformation: {
      paymentSolution: '012',
    },
    paymentInformation: {
      scheme: 'VISA CREDIT',
      bin: '411111',
      accountType: 'Visa Gold',
      issuer: 'RIVER VALLEY CREDIT UNION',
      binCountry: 'US',
    },
    riskInformation: {
      profile: {},
      infoCodes: {
        customerList: ['NEG-AFCB', 'NEG-CC', 'NEG-EM', 'NEG-FCB'],
        deviceBehavior: ['KeyMouseDisabled'],
        suspicious: ['RISK-GEO'],
        globalVelocity: ['VELL-FP', 'VELS-FP', 'VELS-TIP', 'VELV-EM'],
      },
      casePriority: 3,
      localTime: '0:21:43',
      score: {
        factorCodes: ['F', 'G', 'V'],
        modelUsed: 'default',
        result: '42',
      },
      providers: {},
    },
    consumerAuthenticationInformation: {},
  },
};

export const failureResponseTransactionDetail = {
  id: 'fa4185f4-3e11-49f8-bbbe-9982e1f7ab68',
  timestamp: '2022-01-17T07:13:19.814Z',
  type: 'Authorization',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
    fractionDigits: 2,
  },
  state: 'Initial',
};

export const changeStateFailureTransactionDetail = {
  id: 'fa4185f4-3e11-49f8-bbbe-9982e1f7ab68',
  timestamp: '2022-01-17T07:13:19.814Z',
  type: 'Authorization',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
    fractionDigits: 2,
  },
  state: 'Initial',
};

export const failureState = 'Failure';

export const changeStateTransactionDetail = {
  id: 'c36b4a64-f2da-4d31-9a98-41a9e82663af',
  timestamp: '2022-03-30T07:22:03.564Z',
  type: 'Charge',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 6970,
    fractionDigits: 2,
  },
  state: 'Initial',
};

export const successState = 'Success';

export const setCustomFieldMapperFields = {
  isv_tokenCaptureContextSignature:
    'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEihRVWpwa3g1RThRcFhCQUFFSFZpSXVyQjl3NW11ZXBhY0JtcG01UUlyWnNCR1NxQmhheVoyWXM4YS9NbXdTZDg1bEsxZ1g3VmY4Z2dPS1A2VStKU0Qxa3hHMW0vc0lHpXZG4wM2puaFNHaTVIcHpuWTQiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiYyIsIm4iOiIzNmJfcDhXZFR1ZVBOdk5jbVBMeGtaakdtUm1ReUFsN25CaU5DWXBBY0dBekZVcW90RU1ndjZfQXRpMDh6SW5fR3VmQ1F3X05kRnFaUXQtaGxoNy1uZ4NGFpMFdkYlY2eThUV0pzYkxhLXdiNWJYM0VKRWFkdjRkdnZGa0lQQ0lqUWV2R1lnUHdLMkI5cUVORUV2VlpCVTFvWXIxU0owbldUZW5RbTFsOXZsdlRDOUhWOWxGJEZjM2VFcxNGZMNlRWN3Rob08taWx4UUo1UFhRdzRyZExrbVl6d1E0VTFTZk96Sml0MW1MMi1RLXFMREFSS3JxRnQ1U1dCY0YtTm94ZXJIaVpHdllUU2xLYjFWcWwW0wZWs0eXRfU1czYXJTc3g1NmtnTFpnQWtLNTEwbjJqVU5BMVEiLCJraWQiOiIwODVQUzhhVkFXakJ5MEM3dEt2aTBQdkdMVUJxSGh2eSJ9fSwiY3R4IjpbeyJkYXdE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NDE4ODgzMTIsImlhdCI6MTY0MTg4NzQxMiwianRpIjoibFg5eFY5Z25kMTFIcHd4byJ9.DZpFRe8PnMd9WYgL_3419Q4cMkjf-up4teaYxk-xVBSXgo_K9DI7hbnZRFQGSU48NCpIz4MoAQvzjzEYIXIeUDrM5uItkIwYphDynq9vNRYcRmd-b5VYAm1QV5Jrn_gODZmIOV581MuoAZ-zZsYMwidUoPSDrUqAWuUB2KYV5im191t3kVauN_4cqyZM08VLOCjqzThNOq2eSKg95y62JKEP0GI-VnXNujieSBm8Qh1OIDgNym2IGnXBjCw5uD7XsgUwm8xSOPPuEuv4UgHLvxYVm1yqoGuPz7X8zrsZBUYg',
  isv_tokenVerificationContext:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJWpwa3g1RThRcFhCQUFFSFZpSXVyQjl3NW11ZXBhY0JtcG01UUlyWnNCR1NxQmhheVoyWXM4YS9NbXdTZDg1bEsxZ1g3VmY4Z2dPS1A2VStKU0Qxa3hHMW0vc0lFdVZG4wM2puaFNHaTVIcHpuWTQiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsIsIm4iOiIzNmJfcDhXZFR1ZVBOdk5jbVBMeGtaakdtUm1ReUFsN25CaU5DWXBBY0dBekZVcW90RU1ndjZfQXRpMDh6SW5fR3VmQ1F3X05kRnFaUXQtaGxoNy1uZnlRFpMFdkYlY2eThUV0pzYkxhLXdiNWJYM0VKRWFkdjRkdnZGa0lQQ0lqUWV2R1lnUHdLMkI5cUVORUV2VlpCVTFvWXIxU0owbldUZW5RbTFsOXZsdlRDOUhWOWxGVFljM2VFcxNGZMNlRWN3Rob08taWx4UUo1UFhRdzRyZExrbVl6d1E0VTFTZk96Sml0MW1MMi1RLXFMREFSS3JxRnQ1U1dCY0YtTm94ZXJIaVpHdllUU2xLYjFWcWwzYXZWs0eXRfU1czYXJTc3g1NmtnTFpnQWtLNTEwbjJqVU5BMVEiLCJraWQiOiIwODVQUzhhVkFXakJ5MEM3dEt2aTBQdkdMVUJxSGh2eSJ9fSwiY3R4IjpbeyJkYXRhIyaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuNzIjoiRmxleCBBUEkiLCJleHAiOjE2NDE4ODgzMTIsImlhdCI6MTY0MTg4NzQxMiwianRpIjoibFg5eFY5Z25kMTFIcHd4byJ9.6KZEcOTyFEI2sM_gShgzdX4C8Xbac',
};

export const setCustomFieldMapperFieldObject = {
  isv_payerAuthenticationTransactionId: '3G3ZO8q9FwcuodU7LXH0',
  isv_payerAuthenticationRequired: false,
};

export const setCustomFieldMapperFieldEmptyObject = {
  isv_payerAuthenticationTransactionId: '',
  isv_payerAuthenticationRequired: false,
};

export const createTokenDataCustomerObj = {
  id: 'dede3a3c-e241-43ed-b960-e3496a8a30ed',
  version: 14,
  versionModifiedAt: '2024-02-20T06:03:29.889Z',
  lastMessageSequenceNumber: 14,
  createdAt: '2024-02-20T06:02:52.825Z',
  lastModifiedAt: '2024-02-20T06:03:29.889Z',
  lastModifiedBy: {
    clientId: 'TnbXn9Au9uii0OKudfR7pqCG',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'dede3a3c-e241-43ed-b960-e3496a8a30ed',
    },
  },
  createdBy: {
    clientId: 'TnbXn9Au9uii0OKudfR7pqCG',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: '7681699c-fdff-4e3e-89fa-ddcaa9dea72b',
    },
  },
  email: 'sp3@gmail.com',
  firstName: 'shakshi',
  lastName: 'p',
  addresses: [
    {
      id: '9_w7UQYD',
      firstName: 'shakshi',
      lastName: 'p',
      streetName: '1295 road',
      postalCode: '94043',
      city: 'mountain View',
      region: 'CA',
      country: 'US',
      email: 'sp@gmail.com',
    },
  ],
  shippingAddressIds: [],
  billingAddressIds: [],
  isEmailVerified: false,
  custom: {
    type: {
      typeId: 'type',
      id: 'c4d562cd-f0ba-4ad6-a03c-31fd4b5a2a6d',
    },
    fields: {
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJmZFRpaGdSdjUrb3J2dXJWcE5tWGtoQUFFTUtrd0lMZ1FNTFh2RVV1dy9KZERpVys1Tlhsb1pUK0pJV0dEQzFQSXBHSDlMQ2RxRGxYUWdITzYzWkN2MUI3MXZhT0lPNUdBdE9EcDdhTkRSL3NXcDJnY3o5aVRkUzVKdktMOWR0NVlVWTlNdUpWREcrOGlVOHU0cFdZNWlaZGtnXHUwMDNkXHUwMDNkIiwib3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20iLCJqd2siOnsia3R5IjoiUlNBIiwiZSI6IkFRQUIiLCJ1c2UiOiJlbmMiLCJuIjoibnRGa0N2a0hsbllwR2l3aW0zY3JmRS0wT2R3aTRZRThGTl9tOXBFbXZ3TFFReTE5NzFtXzQ0OVd6bnBCNGV2TklNSEl0SmZPVkxmaV9UVS1hWkp4TGMwbllieHhXb2Y4SGl3bkM0dkJvWE1fdEQyaFYxRTdaYXlMY2pVRzVkUVVBSElRYnRaU0NReWtSeXN6RGtGeW02Mm95a01kOUpJOUc4UkdKZFVrUDkyNERhMXFZY01xNE90dmtWY3VoWVYzeWdFSVlZR3RVWUNYczJVT3F4aXNPbHk2Z3Fqb2NrYkstdzRmZWdDaTVEb0JzLTZ3TWJYZkJtT3hfVEcwRXFLZTZrSVR6TDZzZkptYW9rbDUwcG55djRHczF1QUxYdFVEekdiY3Jza2xqa0dqNTZUbDBZdjZYS212OTg0NjJvdk42OVh1c0xvVWhPZnRSeHFkWGYySDd3Iiwia2lkIjoiMDhQZDlsMTlaekpDMVRQR2p6MkdnZDlPeGViTDVyTUYifX0sImN0eCI6W3siZGF0YSI6eyJjbGllbnRMaWJyYXJ5IjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20vbWljcm9mb3JtL2J1bmRsZS92Mi4wL2ZsZXgtbWljcm9mb3JtLm1pbi5qcyIsImFsbG93ZWRDYXJkTmV0d29ya3MiOlsiVklTQSIsIk1BU1RFUkNBUkQiLCJBTUVYIiwiTUFFU1RSTyIsIkNBUlRFU0JBTkNBSVJFUyIsIkNVUCIsIkpDQiIsIkRJTkVSU0NMVUIiLCJESVNDT1ZFUiJdLCJ0YXJnZXRPcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsImh0dHBzOi8vYm8yLWN0LmlzdnBsdWdpbnMuY29tIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTIuMC4wIn1dLCJpc3MiOiJGbGV4IEFQSSIsImV4cCI6MTcwODQwOTg5MSwiaWF0IjoxNzA4NDA4OTkxLCJqdGkiOiJBQjJaaHVvZXUySWw1QmJ3In0.AwoQNROS51-ocXdWJw6Un8zxoxQWDIO1q1_nvJQ054ejCxfLHvw4B4eoHJDRmLBTaWflXnvtPZQBnLs0IcXC6d2VtsRqOKrTrNVOvLWvNV8_gazPfwbOIs2nM8tx9q2UU1I5_TGd-bJb9ESTn9RPWy_QuHyDWkZ-rjvJBXPqaEUSbiMP1Z0ZsKhPgsAOvccXZU83G8j248T08pzSpeGIMvrVBL2RG8dEzxPa5AVDQEi-hq0wtNND4O4VkT76Fm7v0dPYXHUoL_V1jurb2TCV9lOiO8iywlxSrXOxgbllA5zYFUrIizX4U7PWfp8LXBJuaTuCJW2CUw331XlQaim6yw',
      isv_deviceFingerprintId: 'a9097967-344e-4bff-91f0-9e1396feb84a',
      isv_cardExpiryYear: '2032',
      isv_token:
        'eyJraWQiOiIwOFBkOWwxOVp6SkMxVFBHanoyR2dkOU94ZWJMNXJNRiIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA4IiwiZXhwIjoxNzA4NDA5OTEwLCJ0eXBlIjoibWYtMi4wLjAiLCJpYXQiOjE3MDg0MDkwMTAsImp0aSI6IjFFM1VIN0RERklIOTA5TFMzRkExRERVT0VCQ1k4OE1MMUFOQVRGRk1SWVExS1pHV0tLQjg2NUQ0NDQzNjRENjYiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAzMiJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTExMSIsImJpbiI6IjQxMTExMSJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwMSJ9fX19fQ.HCAes-6PUR3H0ObxreYniGUZB43oArGpyRASpJ9lCCQbl35GK6Nij1OvKOvjOBfC1PljNXZAZVgmWcXQ_xK4PJyUPjxjaejVQ1uIz1mnSNgbvy65IR3VnaWJBdqOHGvryYgAsoVCC7sNgK8TQ5wJ6-43opDvQinvWWlD1f6YQWxPPMJe5kONkIWWGOH_DmJrMdMa99mOwLpxCWJ6_szjspc0SwJ1QUNsDelt9pxcZsd8VZQGcFwpkzVzAD4BYaK-Gg-kHqvThGxVumyPR0Pf2RSIBgw69RRH5f6z8cECgDeJKVjyY-8U9MvOP6ePoNZ7sPb7gPYFIlW37NVnDLT0NA',
      isv_tokenAlias: '411111111',
      isv_cardType: '001',
      isv_cardExpiryMonth: '01',
      isv_currencyCode: 'USD',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJmZFRpaGdSdjUrb3J2dXJWcE5tWGtoQUFFTUtrd0lMZ1FNTFh2RVV1dy9KZERpVys1Tlhsb1pUK0pJV0dEQzFQSXBHSDlMQ2RxRGxYUWdITzYzWkN2MUI3MXZhT0lPNUdBdE9EcDdhTkRSL3NXcDJnY3o5aVRkUzVKdktMOWR0NVlVWTlNdUpWREcrOGlVOHU0cFdZNWlaZGtnPT0iLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJudEZrQ3ZrSGxuWXBHaXdpbTNjcmZFLTBPZHdpNFlFOEZOX205cEVtdndMUVF5MTk3MW1fNDQ5V3pucEI0ZXZOSU1ISXRKZk9WTGZpX1RVLWFaSnhMYzBuWWJ4eFdvZjhIaXduQzR2Qm9YTV90RDJoVjFFN1pheUxjalVHNWRRVUFISVFidFpTQ1F5a1J5c3pEa0Z5bTYyb3lrTWQ5Skk5RzhSR0pkVWtQOTI0RGExcVljTXE0T3R2a1ZjdWhZVjN5Z0VJWVlHdFVZQ1hzMlVPcXhpc09seTZncWpvY2tiSy13NGZlZ0NpNURvQnMtNndNYlhmQm1PeF9URzBFcUtlNmtJVHpMNnNmSm1hb2tsNTBwbnl2NEdzMXVBTFh0VUR6R2JjcnNrbGprR2o1NlRsMFl2NlhLbXY5ODQ2Mm92TjY5WHVzTG9VaE9mdFJ4cWRYZjJIN3ciLCJraWQiOiIwOFBkOWwxOVp6SkMxVFBHanoyR2dkOU94ZWJMNXJNRiJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiLCJNQUVTVFJPIiwiQ0FSVEVTQkFOQ0FJUkVTIiwiQ1VQIiwiSkNCIiwiRElORVJTQ0xVQiIsIkRJU0NPVkVSIl0sInRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiaHR0cHM6Ly9ibzItY3QuaXN2cGx1Z2lucy5jb20iXSwibWZPcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSJ9LCJ0eXBlIjoibWYtMi4wLjAifV0sImlzcyI6IkZsZXggQVBJIiwiZXhwIjoxNzA4NDA5ODkxLCJpYXQiOjE3MDg0MDg5OTEsImp0aSI6IkFCMlpodW9ldTJJbDVCYncifQ.JWVmgEDHWkFGF7fGccp1Y3aw_qoRQA7et29AkTLEUw8',
      isv_addressId: '9_w7UQYD',
      isv_maskedPan: '411111XXXXXXXXXXXX1111',
    },
  },
  stores: [],
  authenticationMode: 'Password',
};

export const createTokenDataAddress: addressType = {
  id: 'Gu_fd8_a',
  firstName: 'shakshi',
  lastName: 'poddar',
  streetName: '1295 Charleston Road',
  additionalStreetInfo: '5th lane',
  postalCode: '94043',
  city: 'Mountain View',
  region: 'CA',
  country: 'US',
  phone: '+19876543210',
  email: 'shakshi.poddar@wipro.com',
};
