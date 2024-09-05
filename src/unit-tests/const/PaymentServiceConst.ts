import { CardAddressGroupType, CustomerType, PaymentType, ReportSyncType } from '../../types/Types';
import clickToPay from '../JSON/clickToPay.json';
import creditCard from '../JSON/creditCard.json';
import googlePay from '../JSON/googlePay.json';
import unit from '../JSON/unit.json';

 let visaCardDetailsActionVisaCheckoutData : any= {
  httpCode: 200,
  billToFieldGroup: {
    firstName: 'john',
    lastName: 'doe',
    address1: '1295 Charleston Road',
    address2: '5th lane',
    locality: 'Mountain View',
    administrativeArea: 'CA',
    postalCode: '94043',
    email: 'john.doe@wipro.com',
    country: 'US',
    phoneNumber: '08808906634',
  },
  shipToFieldGroup: {
    firstName: 'john',
    lastName: 'doe',
    address1: '1295 Charleston Road',
    locality: 'Mountain View',
    administrativeArea: 'CA',
    postalCode: '94043',
    country: 'US',
    phoneNumber: '08808906634',
  },
  cardFieldGroup: {
    suffix: '1111',
    prefix: '411111',
    expirationMonth: '05',
    expirationYear: '25  ',
    type: '001',
  },
  message: null,
};

 const visaCardDetailsActionVisaCheckoutEmptyData : Partial<CardAddressGroupType>= {
  httpCode: 200,
  billToFieldGroup: {
    id: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    locality: '',
    administrativeArea: '',
    postalCode: '',
    email: '',
    country: '',
    phoneNumber: '',
    city: '',
    region: '',
    phone: '',
    additionalStreetInfo: '',
    mobile: '',
    buildingNumber: '',
    streetName: '',
    streetNumber: ''
  },
  shipToFieldGroup: {
    id: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    locality: '',
    administrativeArea: '',
    postalCode: '',
    email: '',
    country: '',
    phoneNumber: '',
    city: '',
    region: '',
    phone: '',
    additionalStreetInfo: '',
    mobile: '',
    buildingNumber: '',
    streetName: '',
    streetNumber: ''
  },
  cardFieldGroup: {
    suffix: '',
    prefix: '',
    expirationMonth: '',
    expirationYear: '',
    type: '',
  },
};

 const getOMServiceResponsePaymentResponse = {
  httpCode: 201,
  transactionId: '6420561530596093703954',
  status: 'PENDING',
  message: undefined,
};

 const getOMServiceResponsePaymentResponseObject = {
  httpCode: 400,
  transactionId: null,
  status: 'INVALID_REQUEST',
  message: undefined,
};

 const getOMServiceResponseTransactionDetail = {
  id: 'bf72a390-77e6-4748-b099-f253ba0744d9',
  timestamp: '2022-01-13T06:42:30.259Z',
  type: 'Charge',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 11960,
    fractionDigits: 2,
  },
  state: 'Initial',
};

 const getAuthResponsePaymentResponse = {
  httpCode: 201,
  transactionId: '6424036020586494403954',
  status: 'AUTHORIZED',
  data: {
    _links: {
      self: {
        href: '/pts/v2/payments/6424036020586494403954',
        method: 'GET',
      },
      capture: {
        href: '/pts/v2/payments/6424036020586494403954/captures',
        method: 'POST',
      },
    },
    id: '6424036020586494403954',
    submitTimeUtc: '2022-01-17T07:13:22Z',
    status: 'AUTHORIZED',
    clientReferenceInformation: {
      code: 'ba1914ef-ceef-4e9b-b770-5689592ce65d',
    },
    processorInformation: {
      approvalCode: '831000',
      transactionId: '201506041511351',
      networkTransactionId: '201506041511351',
      responseCode: '00',
      avs: {
        code: '1',
      },
      merchantAdvice: {
        code: '01',
        codeRaw: '01',
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
      customer: {
        id: 'D55DEE93D3823B34E053AF598E0A2652',
      },
      paymentInstrument: {
        id: 'D55DF05DDCF85EDEE053AF598E0A0056',
      },
      instrumentIdentifier: {
        id: '7010000000121591111',
        state: 'ACTIVE',
      },
    },
    orderInformation: {
      amountDetails: {
        authorizedAmount: '59.80',
        currency: 'USD',
      },
    },
  },
};

 const getAuthResponsePaymentResponseObject = {
  httpCode: 201,
  transactionId: '6424036020586494403954',
  status: 'AUTHORIZED_PENDING_REVIEW',
  data: {
    _links: {
      self: {
        href: '/pts/v2/payments/6424036020586494403954',
        method: 'GET',
      },
      capture: {
        href: '/pts/v2/payments/6424036020586494403954/captures',
        method: 'POST',
      },
    },
    id: '6424036020586494403954',
    submitTimeUtc: '2022-01-17T07:13:22Z',
    status: 'AUTHORIZED_PENDING_REVIEW',
    errorInformation: {
      reason: 'DECISION_PROFILE_REVIEW',
      message: 'The order is marked for review by Decision Manager',
    },
    clientReferenceInformation: {
      code: 'ba1914ef-ceef-4e9b-b770-5689592ce65d',
    },
    processorInformation: {
      approvalCode: '831000',
      transactionId: '201506041511351',
      networkTransactionId: '201506041511351',
      responseCode: '00',
      avs: {
        code: '1',
      },
      merchantAdvice: {
        code: '01',
        codeRaw: '01',
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
      customer: {
        id: 'D55DEE93D3823B34E053AF598E0A2652',
      },
      paymentInstrument: {
        id: 'D55DF05DDCF85EDEE053AF598E0A0056',
      },
      instrumentIdentifier: {
        id: '7010000000121591111',
        state: 'ACTIVE',
      },
    },
    orderInformation: {
      amountDetails: {
        authorizedAmount: '59.80',
        currency: 'USD',
      },
    },
  },
};

 const getAuthResponsePaymentDeclinedResponse = {
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

 const getAuthResponseTransactionDetail = {
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

 const getAuthResponsePaymentSuccessResponse = {
  httpCode: 201,
  transactionId: 'B4ZCm7bmq3v7RZ333Yj0',
  status: 'AUTHENTICATION_SUCCESSFUL',
  data: {
    id: '6437969198926252803955',
    submitTimeUtc: '2022-02-02T10:15:20Z',
    status: 'AUTHENTICATION_SUCCESSFUL',
    clientReferenceInformation: {
      code: 'a9cf118c-8a3f-4225-8190-6d155d357b22',
      partner: {
        solutionId: '42EA2Y58',
      },
    },
    consumerAuthenticationInformation: {
      authenticationTransactionId: 'B4ZCm7bmq3v7RZ333Yj0',
      directoryServerErrorCode: '101',
      directoryServerErrorDescription: 'Invalid Formatted Message Invalid Formatted Message',
      ecommerceIndicator: 'internet',
      specificationVersion: '2.1.0',
      threeDSServerTransactionId: '34cd96a6-4984-4afc-b4dd-fbb6d2e993b4',
      veresEnrolled: 'U',
    },
  },
  cardinalReferenceId: 'aa5120d4-d5f7-4b9d-bea2-1db7aaa6f07c',
};

 const getAuthResponsePaymentCompleteResponse = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmYzhhMzBmNy1jNGEyLTQ0M2YtYmJhNC0wNDQ1M2I3YzE2NmYiLCJpYXQiOjE2NDM3OTY5MTUsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTY0MzgwMDUxNSwiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUmVmZXJlbmNlSWQiOiJhYTUxMjBkNC1kNWY3LTRiOWQtYmVhMi0xZGI3YWFhNmYwN2MifQ.U5MB8c1PMJRJEnYbY78pWg8Ky4XbPTlVSCUuzmV0r6M',
  referenceId: 'aa5120d4-d5f7-4b9d-bea2-1db7aaa6f07c',
  deviceDataCollectionUrl: 'https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect',
  httpCode: 201,
  transactionId: '6437969152436266203954',
  status: 'COMPLETED',
};

 const getAuthResponsePaymentPendingResponse = {
  httpCode: 201,
  transactionId: 'NsuSvxr0fOA2eL4b9Uj0',
  status: 'PENDING_AUTHENTICATION',
  data: {
    id: '6438013048936509503955',
    submitTimeUtc: '2022-02-02T11:28:25Z',
    status: 'PENDING_AUTHENTICATION',
    clientReferenceInformation: {
      code: '5bfd0e66-7243-4359-9891-7fce264aaa30',
      partner: {
        solutionId: '42EA2Y58',
      },
    },
    consumerAuthenticationInformation: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNzU5ZTkwYy1hMTU1LTRlYTYtYWUzYy1hMmI1NTRkM2E4NDEiLCJpYXQiOjE2NDM4MDEzMDUsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTY0MzgwNDkwNSwiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUGF5bG9hZCI6eyJBQ1NVcmwiOiJodHRwczovLzBtZXJjaGFudGFjc3N0YWcuY2FyZGluYWxjb21tZXJjZS5jb20vTWVyY2hhbnRBQ1NXZWIvY3JlcS5qc3AiLCJQYXlsb2FkIjoiZXlKdFpYTnpZV2RsVkhsd1pTSTZJa05TWlhFaUxDSnRaWE56WVdkbFZtVnljMmx2YmlJNklqSXVNUzR3SWl3aWRHaHlaV1ZFVTFObGNuWmxjbFJ5WVc1elNVUWlPaUk0TTJVNU1tTTNPUzAyTkRZMkxUUm1Nak10T0RGbU15MHdNRGc1WW1aaU56Z3labVVpTENKaFkzTlVjbUZ1YzBsRUlqb2lOMkkwTW1abVlqSXRZekExTkMwME5EWXhMV0l3TlRNdFptVmtORE5rTWpreU9Ua3dJaXdpWTJoaGJHeGxibWRsVjJsdVpHOTNVMmw2WlNJNklqQXlJbjAiLCJUcmFuc2FjdGlvbklkIjoiTnN1U3Z4cjBmT0EyZUw0YjlVajAifSwiT2JqZWN0aWZ5UGF5bG9hZCI6dHJ1ZSwiUmV0dXJuVXJsIjoiaHR0cHM6Ly95b3V0aGZ1bC1maWVsZC02NDgxMy5wa3RyaW90Lm5ldC9zdW5yaXNlU3BhIn0.jkDqtsLs3oMkRoaJh2Vw5qsTbkk9CEVGOu5g0xGT4bI',
      acsTransactionId: '7b42ffb2-c054-4461-b053-fed43d292990',
      acsUrl: 'https://0merchantacsstag.cardinalcommerce.com/MerchantACSWeb/creq.jsp',
      authenticationTransactionId: 'NsuSvxr0fOA2eL4b9Uj0',
      challengeRequired: 'N',
      pareq: 'eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiI4M2U5MmM3OS02NDY2LTRmMjMtODFmMy0wMDg5YmZiNzgyZmUiLCJhY3NUcmFuc0lEIjoiN2I0MmZmYjItYzA1NC00NDYxLWIwNTMtZmVkNDNkMjkyOTkwIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAyIn0',
      specificationVersion: '2.1.0',
      stepUpUrl: 'https://centinelapistag.cardinalcommerce.com/V2/Cruise/StepUp',
      threeDSServerTransactionId: '83e92c79-6466-4f23-81f3-0089bfb782fe',
      veresEnrolled: 'Y',
      directoryServerTransactionId: 'fff8a722-62a9-471b-8993-a41c91048d22',
    },
    errorInformation: {
      reason: 'CONSUMER_AUTHENTICATION_REQUIRED',
      message: 'The cardholder is enrolled in Payer Authentication. Please authenticate the cardholder before continuing with the transaction.',
    },
  },
  cardinalReferenceId: '8f0d726c-3c21-447e-a936-d9a5dfc5e57b',
};

 const getCapturedAmountRefundPaymentObj = {
  id: '5bfd0e66-7243-4359-9891-7fce264aaa30',
  version: 33,
  lastMessageSequenceNumber: 7,
  createdAt: '2022-02-02T11:28:03.285Z',
  lastModifiedAt: '2022-02-02T12:12:31.722Z',
  lastModifiedBy: { clientId: 'iFOAd29Lew5ADrpakIhQkz_N', isPlatformClient: false },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' },
  },
  customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 6970,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'creditCardWithPayerAuthentication',
    name: { en: 'Credit Card Payer Authentication' },
  },
  custom: {
    type: { typeId: 'type', id: '87b9d9db-74a3-45d7-8e60-dde669866808' },
    fields: {
      isv_requestJwt:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOWM3YzZmNC0xZTliLTRlMTItOGFkNC0yOTIzNWUyY2U1ZTAiLCJpYXQiOjE2NDM4MDEzMDAsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTY0MzgwNDkwMCwiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUmVmZXJlbmNlSWQiOiI4ZjBkNzI2Yy0zYzIxLTQ0N2UtYTkzNi1kOWE1ZGZjNWU1N2IifQ.wEXK-GCJc62oqrrhAYOca3kuqN1A4dNQh8OmHkSkILc',
      isv_deviceFingerprintId: '9703373f-4385-4f5c-9fa7-de89e7f8e469',
      isv_cardExpiryYear: '2025',
      isv_token:
        'eyJraWQiOiIwOFlZeFh4dVl4Y1pvUlA0dEl5MHE0ck5IU28yTjlrNSIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAyNSIsIm51bWJlciI6IjQwMDAwMFhYWFhYWDEwOTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wNyIsImV4cCI6MTY0MzgwMjE5OCwidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTY0MzgwMTI5OCwianRpIjoiMUUyQzVCR1pYSllISjA2S1k2TU1GWE5CVVdVU05IUDhTRzM3SDFTTVdPMzAwQTJQU0JPRDYxRkE2RTU2MTVDQiIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDI1In0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDEwOTEiLCJiaW4iOiI0MDAwMDAifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.feBSpCU9jvQAV9y_hOkXb3o4EJN8OvTRXZIXrpuse9iWeRAMrfVAXHYiIeQ5o0mTIqwuLxikGUlVY0Cug3UwvU4zD9fPklDZhE8vApElrkKDbceH2lvAHLswz97IF04PicPqmKbs5vYQ36d-UM0VJo4iQF6vMRN1upfGWU07aaE2sOfK7CAEyQjVD_PoLzRMKobyvBdykq7HfGpEI3hLSPARDd-ZVWpyxTIdHXFHnzQ9vfmCQd1ZMK4FoWk2Rlwqd-_wnIHebFHwzkaNkT31aO4M9HKzNYfISjPGROFwT9L5j9UUfluYmWH2oc0hLy794Hw4KxlyLPokJQgz_s9czA',
      isv_payerAuthenticationPaReq:
        'eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiI4M2U5MmM3OS02NDY2LTRmMjMtODFmMy0wMDg5YmZiNzgyZmUiLCJhY3NUcmFuc0lEIjoiN2I0MmZmYjItYzA1NC00NDYxLWIwNTMtZmVkNDNkMjkyOTkwIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAyIn0',
      isv_maskedPan: '400000XXXXXX1091',
      isv_payerAuthenticationTransactionId: 'NsuSvxr0fOA2eL4b9Uj0',
      isv_payerAuthenticationRequired: true,
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_cardExpiryMonth: '01',
      isv_payerAuthenticationAcsUrl: 'https://0merchantacsstag.cardinalcommerce.com/MerchantACSWeb/creq.jsp',
      isv_responseJwt:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNzU5ZTkwYy1hMTU1LTRlYTYtYWUzYy1hMmI1NTRkM2E4NDEiLCJpYXQiOjE2NDM4MDEzMDUsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTY0MzgwNDkwNSwiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUGF5bG9hZCI6eyJBQ1NVcmwiOiJodHRwczovLzBtZXJjaGFudGFjc3N0YWcuY2FyZGluYWxjb21tZXJjZS5jb20vTWVyY2hhbnRBQ1NXZWIvY3JlcS5qc3AiLCJQYXlsb2FkIjoiZXlKdFpYTnpZV2RsVkhsd1pTSTZJa05TWlhFaUxDSnRaWE56WVdkbFZtVnljMmx2YmlJNklqSXVNUzR3SWl3aWRHaHlaV1ZFVTFObGNuWmxjbFJ5WVc1elNVUWlPaUk0TTJVNU1tTTNPUzAyTkRZMkxUUm1Nak10T0RGbU15MHdNRGc1WW1aaU56Z3labVVpTENKaFkzTlVjbUZ1YzBsRUlqb2lOMkkwTW1abVlqSXRZekExTkMwME5EWXhMV0l3TlRNdFptVmtORE5rTWpreU9Ua3dJaXdpWTJoaGJHeGxibWRsVjJsdVpHOTNVMmw2WlNJNklqQXlJbjAiLCJUcmFuc2FjdGlvbklkIjoiTnN1U3Z4cjBmT0EyZUw0YjlVajAifSwiT2JqZWN0aWZ5UGF5bG9hZCI6dHJ1ZSwiUmV0dXJuVXJsIjoiaHR0cHM6Ly95b3V0aGZ1bC1maWVsZC02NDgxMy5wa3RyaW90Lm5ldC9zdW5yaXNlU3BhIn0.jkDqtsLs3oMkRoaJh2Vw5qsTbkk9CEVGOu5g0xGT4bI',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI3Q0svYUpYR3BlSmNCOXZzUkxlRmVoQUFFQVptdk9JaVorOTlQZTN2MXBqUGdEM3R5VVNnRHdRa2NWZEpBSUs2dmNwUm5QcGVjY3dmbm9pSXlZQ28xZHZuRTQzakF2d2oxcFZTQmtBNVhGbzNQempJcWRnQXE0WlFIQXdwZWVnNnMxSmsiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiIzYnZ5VjZoUGdzQzlxNGdSRUhwa1ZhSlVFNy1nQkl6YjNOcExFeDlHXzRJMWNsSmhac05DanFiTWVXTUVIbC1iZlNfRk9GVVV1TzhqSnRPdDJud09nN1BtX3R0VEFCMlExUS1nTHlocEF4UmM5ZUYzci1KVzZDS2syUmhTNDZiSlBRc3ZiYm1XaUpkVG96SUhUaFZ3cHhnMHdBVDFhdWhUMWtsTHptSWMtY3AyeWNuRThpZGVLcW92QXNCSDhsZ3k0T2FoWWtmMmM4Y1BCN3owYnFLaVVzcHFHcTBNWExEcEtDaU1xdi1nUmN1MFoxejVLb2RvZlUwTmVvTDJINWNPVjFWMi1jaUdnSHhHVDh6UEpWVU1RX2dKRzNhRTBfUm40ZkR4YjIxeHo4M3V0TDR4c2tDZ29kYjdDU0E3cVVOZGZfQmRzd01TelJXbWxObEdzaVVPOXciLCJraWQiOiIwOFlZeFh4dVl4Y1pvUlA0dEl5MHE0ck5IU28yTjlrNSJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NDM4MDIxODIsImlhdCI6MTY0MzgwMTI4MiwianRpIjoiZHB0OXd4ejVOWGxyaUd1eSJ9.6Rx1nETbPUWLXZfaDCCTgfZ_Y1SulD56u3gi9a8_TGA',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: 'a66038fa-48ac-49af-ab99-909144d037b0',
      timestamp: '2022-02-02T11:28:37.126Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 6970,
        fractionDigits: 2,
      },
      interactionId: '6438013202686533603954',
      state: 'Success',
    },
    {
      id: '0847f181-5631-4d02-b414-40e4f29b7f74',
      timestamp: '2022-02-02T12:12:27.562Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 6970,
        fractionDigits: 2,
      },
      interactionId: '6438039510446950603955',
      state: 'Success',
    },
  ],
  interfaceInteractions: [
    {
      type: {
        typeId: 'type',
        id: '0fe48d4b-5696-4b68-9725-c6d9b94a32cd',
      },
      fields: {
        specificationVersion: '2.1.0',
        authorizationAllowed: true,
        cardinalReferenceId: '09e3092e-829e-4166-a31b-d86fbd42637a',
        acsUrl: 'https://0merchantacsstag.cardinalcommerce.com/MerchantACSWeb/creq.jsp',
        veresEnrolled: 'Y',
        authenticationRequired: true,
        directoryServerTransactionId: '8285ab73-81c2-4d25-b298-075a40f60a4e',
        paReq: 'eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiJmOTMzMWZmOS1jYzQ4LTQ3YTMtODU2Mi0yOTM4ZTM3ODI0ZTMiLCJhY3NUcmFuc0lEIjoiNjZhYWJkMWUtN2NjOS00NTFhLThjOTYtNzQ3NmM2Mjc2ZTFhIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAxIn0',
        authenticationTransactionId: '8G2TD6BEkp9pQ8i2pfO0',
      },
    },
  ],
};

 const getCapturedZeroAmountRefundPaymentObj = {
  id: '5bfd0e66-7243-4359-9891-7fce264aaa30',
  version: 33,
  lastMessageSequenceNumber: 7,
  createdAt: '2022-02-02T11:28:03.285Z',
  lastModifiedAt: '2022-02-02T12:12:31.722Z',
  lastModifiedBy: { clientId: 'iFOAd29Lew5ADrpakIhQkz_N', isPlatformClient: false },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' },
  },
  customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 6970,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'creditCardWithPayerAuthentication',
    name: { en: 'Credit Card Payer Authentication' },
  },
  custom: {
    type: { typeId: 'type', id: '87b9d9db-74a3-45d7-8e60-dde669866808' },
    fields: {
      isv_requestJwt:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOWM3YzZmNC0xZTliLTRlMTItOGFkNC0yOTIzNWUyY2U1ZTAiLCJpYXQiOjE2NDM4MDEzMDAsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTY0MzgwNDkwMCwiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUmVmZXJlbmNlSWQiOiI4ZjBkNzI2Yy0zYzIxLTQ0N2UtYTkzNi1kOWE1ZGZjNWU1N2IifQ.wEXK-GCJc62oqrrhAYOca3kuqN1A4dNQh8OmHkSkILc',
      isv_deviceFingerprintId: '9703373f-4385-4f5c-9fa7-de89e7f8e469',
      isv_cardExpiryYear: '2025',
      isv_token:
        'eyJraWQiOiIwOFlZeFh4dVl4Y1pvUlA0dEl5MHE0ck5IU28yTjlrNSIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAyNSIsIm51bWJlciI6IjQwMDAwMFhYWFhYWDEwOTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wNyIsImV4cCI6MTY0MzgwMjE5OCwidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTY0MzgwMTI5OCwianRpIjoiMUUyQzVCR1pYSllISjA2S1k2TU1GWE5CVVdVU05IUDhTRzM3SDFTTVdPMzAwQTJQU0JPRDYxRkE2RTU2MTVDQiIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDI1In0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDEwOTEiLCJiaW4iOiI0MDAwMDAifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.feBSpCU9jvQAV9y_hOkXb3o4EJN8OvTRXZIXrpuse9iWeRAMrfVAXHYiIeQ5o0mTIqwuLxikGUlVY0Cug3UwvU4zD9fPklDZhE8vApElrkKDbceH2lvAHLswz97IF04PicPqmKbs5vYQ36d-UM0VJo4iQF6vMRN1upfGWU07aaE2sOfK7CAEyQjVD_PoLzRMKobyvBdykq7HfGpEI3hLSPARDd-ZVWpyxTIdHXFHnzQ9vfmCQd1ZMK4FoWk2Rlwqd-_wnIHebFHwzkaNkT31aO4M9HKzNYfISjPGROFwT9L5j9UUfluYmWH2oc0hLy794Hw4KxlyLPokJQgz_s9czA',
      isv_payerAuthenticationPaReq:
        'eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiI4M2U5MmM3OS02NDY2LTRmMjMtODFmMy0wMDg5YmZiNzgyZmUiLCJhY3NUcmFuc0lEIjoiN2I0MmZmYjItYzA1NC00NDYxLWIwNTMtZmVkNDNkMjkyOTkwIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAyIn0',
      isv_maskedPan: '400000XXXXXX1091',
      isv_payerAuthenticationTransactionId: 'NsuSvxr0fOA2eL4b9Uj0',
      isv_payerAuthenticationRequired: true,
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_cardExpiryMonth: '01',
      isv_payerAuthenticationAcsUrl: 'https://0merchantacsstag.cardinalcommerce.com/MerchantACSWeb/creq.jsp',
      isv_responseJwt:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNzU5ZTkwYy1hMTU1LTRlYTYtYWUzYy1hMmI1NTRkM2E4NDEiLCJpYXQiOjE2NDM4MDEzMDUsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTY0MzgwNDkwNSwiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUGF5bG9hZCI6eyJBQ1NVcmwiOiJodHRwczovLzBtZXJjaGFudGFjc3N0YWcuY2FyZGluYWxjb21tZXJjZS5jb20vTWVyY2hhbnRBQ1NXZWIvY3JlcS5qc3AiLCJQYXlsb2FkIjoiZXlKdFpYTnpZV2RsVkhsd1pTSTZJa05TWlhFaUxDSnRaWE56WVdkbFZtVnljMmx2YmlJNklqSXVNUzR3SWl3aWRHaHlaV1ZFVTFObGNuWmxjbFJ5WVc1elNVUWlPaUk0TTJVNU1tTTNPUzAyTkRZMkxUUm1Nak10T0RGbU15MHdNRGc1WW1aaU56Z3labVVpTENKaFkzTlVjbUZ1YzBsRUlqb2lOMkkwTW1abVlqSXRZekExTkMwME5EWXhMV0l3TlRNdFptVmtORE5rTWpreU9Ua3dJaXdpWTJoaGJHeGxibWRsVjJsdVpHOTNVMmw2WlNJNklqQXlJbjAiLCJUcmFuc2FjdGlvbklkIjoiTnN1U3Z4cjBmT0EyZUw0YjlVajAifSwiT2JqZWN0aWZ5UGF5bG9hZCI6dHJ1ZSwiUmV0dXJuVXJsIjoiaHR0cHM6Ly95b3V0aGZ1bC1maWVsZC02NDgxMy5wa3RyaW90Lm5ldC9zdW5yaXNlU3BhIn0.jkDqtsLs3oMkRoaJh2Vw5qsTbkk9CEVGOu5g0xGT4bI',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI3Q0svYUpYR3BlSmNCOXZzUkxlRmVoQUFFQVptdk9JaVorOTlQZTN2MXBqUGdEM3R5VVNnRHdRa2NWZEpBSUs2dmNwUm5QcGVjY3dmbm9pSXlZQ28xZHZuRTQzakF2d2oxcFZTQmtBNVhGbzNQempJcWRnQXE0WlFIQXdwZWVnNnMxSmsiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiIzYnZ5VjZoUGdzQzlxNGdSRUhwa1ZhSlVFNy1nQkl6YjNOcExFeDlHXzRJMWNsSmhac05DanFiTWVXTUVIbC1iZlNfRk9GVVV1TzhqSnRPdDJud09nN1BtX3R0VEFCMlExUS1nTHlocEF4UmM5ZUYzci1KVzZDS2syUmhTNDZiSlBRc3ZiYm1XaUpkVG96SUhUaFZ3cHhnMHdBVDFhdWhUMWtsTHptSWMtY3AyeWNuRThpZGVLcW92QXNCSDhsZ3k0T2FoWWtmMmM4Y1BCN3owYnFLaVVzcHFHcTBNWExEcEtDaU1xdi1nUmN1MFoxejVLb2RvZlUwTmVvTDJINWNPVjFWMi1jaUdnSHhHVDh6UEpWVU1RX2dKRzNhRTBfUm40ZkR4YjIxeHo4M3V0TDR4c2tDZ29kYjdDU0E3cVVOZGZfQmRzd01TelJXbWxObEdzaVVPOXciLCJraWQiOiIwOFlZeFh4dVl4Y1pvUlA0dEl5MHE0ck5IU28yTjlrNSJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NDM4MDIxODIsImlhdCI6MTY0MzgwMTI4MiwianRpIjoiZHB0OXd4ejVOWGxyaUd1eSJ9.6Rx1nETbPUWLXZfaDCCTgfZ_Y1SulD56u3gi9a8_TGA',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: 'a66038fa-48ac-49af-ab99-909144d037b0',
      timestamp: '2022-02-02T11:28:37.126Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 6970,
        fractionDigits: 2,
      },
      interactionId: '6438013202686533603954',
      state: 'Success',
    },
    {
      id: '0847f181-5631-4d02-b414-40e4f29b7f74',
      timestamp: '2022-02-02T12:12:27.562Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 0,
        fractionDigits: 2,
      },
      interactionId: '6438039510446950603955',
      state: 'Success',
    },
  ],
  interfaceInteractions: [
    {
      type: {
        typeId: 'type',
        id: '0fe48d4b-5696-4b68-9725-c6d9b94a32cd',
      },
      fields: {
        specificationVersion: '2.1.0',
        authorizationAllowed: true,
        cardinalReferenceId: '09e3092e-829e-4166-a31b-d86fbd42637a',
        acsUrl: 'https://0merchantacsstag.cardinalcommerce.com/MerchantACSWeb/creq.jsp',
        veresEnrolled: 'Y',
        authenticationRequired: true,
        directoryServerTransactionId: '8285ab73-81c2-4d25-b298-075a40f60a4e',
        paReq: 'eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiJmOTMzMWZmOS1jYzQ4LTQ3YTMtODU2Mi0yOTM4ZTM3ODI0ZTMiLCJhY3NUcmFuc0lEIjoiNjZhYWJkMWUtN2NjOS00NTFhLThjOTYtNzQ3NmM2Mjc2ZTFhIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAxIn0',
        authenticationTransactionId: '8G2TD6BEkp9pQ8i2pfO0',
      },
    },
  ],
};

 const payerAuthActionsResponse = {
  isv_payerAuthenticationPaReq:
    'eNpVUV1vgjAUfe+vMGbP9APEaa5NdGyZZhhl6p5ZaSaJfFhgiL9+LcLc+nTP7bntOefC7qik9N6lqJTk4MuiCL/kII5mw2bxZgdXetqNndJbsf12Q8iQw2YeyDOHb6mKOEs5tYjFAPcQ6SeUOIZpySEU58VyzR13wqgLuIMIEqmWHrcd6jDmMHI7gG9tBGmYSF7HucpOZQS4hQhEVqWlavijo6k9QFCpEz+WZV5MMa7r2hLNp1aSVUpIS2QJYENAgO+qNpWpCm32Ekdc7le+T1eu/3HZr68BCZ6z5nB42frefAbYMBBEYSk5I4wR2yYDSqcOmRpDbR9BmBg1/MGdWGOtrYMIcvPR/Ibcibn629GOKqVkKnpLPUIgL3mWSs3Ruf7W2sNd+dOrSVeUOq8Rc1w6GZt4W9yOxzobNiK0nY/boLCZwd3ycLdnXf3b/w9MkKjU',
  isv_payerAuthenticationTransactionId: 'yBL3Rz1lT74tDJ2UQP00',
  stepUpUrl: 'https://centinelapistag.cardinalcommerce.com/V2/Cruise/StepUp',
  isv_responseJwt:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNDlkYTZmMS04NWMxLTQxZTgtYmQ0ZS0wYWQ3ZjM1NzkzNjEiLCJpYXQiOjE2NDg2NDA0MTYsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTY0ODY0NDAxNiwiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUGF5bG9hZCI6eyJBQ1NVcmwiOiJodHRwczovL21lcmNoYW50YWNzc3RhZy5jYXJkaW5hbGNvbW1lcmNlLmNvbS9NZXJjaGFudEFDU1dlYi9wYXJlcS5qc3A_dmFhPWImZ29sZD1BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUEiLCJQYXlsb2FkIjoiZU5wVlVWMXZnakFVZmUrdk1HYlA5QVBFYWE1TmRHeVpaaGhsNnA1WmFTYUpmRmhnaUw5K0xjTGMrblRQN2JudE9lZkM3cWlrOU42bHFKVGs0TXVpQ0wva0lJNW13MmJ4WmdkWGV0cU5uZEpic2YxMlE4aVF3MllleURPSGI2bUtPRXM1dFlqRkFQY1E2U2VVT0lacHlTRVU1OFZ5elIxM3dxZ0x1SU1JRXFtV0hyY2Q2akRtTUhJN2dHOXRCR21ZU0Y3SHVjcE9aUVM0aFFoRVZxV2xhdmlqbzZrOVFGQ3BFeitXWlY1TU1hN3IyaExOcDFhU1ZVcElTMlFKWUVOQWdPK3FOcFdwQ20zMkVrZGM3bGUrVDFldS8zSFpyNjhCQ1o2ejVuQjQyZnJlZkFiWU1CQkVZU2s1STR3UjJ5WURTcWNPbVJwRGJSOUJtQmcxL01HZFdHT3RyWU1JY3ZQUi9JYmNpYm42MjlHT0txVmtLbnBMUFVJZ0wzbVdTczNSdWY3VzJzTmQrZE9yU1ZlVU9xOFJjMXc2R1p0NFc5eU94em9iTmlLMG5ZL2JvTENad2QzeWNMZG5YZjNiL3c5TWtLalUiLCJUcmFuc2FjdGlvbklkIjoieUJMM1J6MWxUNzR0REoyVVFQMDAifSwiT2JqZWN0aWZ5UGF5bG9hZCI6dHJ1ZSwiUmV0dXJuVXJsIjoiaHR0cHM6Ly95b3V0aGZ1bC1maWVsZC02NDgxMy5wa3RyaW90Lm5ldC9wYXllckF1dGhSZXR1cm5VcmwifQ.j1yRw1vkOsXhzyvfDra7ZX0XhDEjzXokxybSpQL3sHM',
  isv_payerAuthenticationRequired: true,
  xid: 'eUJMM1J6MWxUNzR0REoyVVFQMDA=',
  pareq:
    'eNpVUV1vgjAUfe+vMGbP9APEaa5NdGyZZhhl6p5ZaSaJfFhgiL9+LcLc+nTP7bntOefC7qik9N6lqJTk4MuiCL/kII5mw2bxZgdXetqNndJbsf12Q8iQw2YeyDOHb6mKOEs5tYjFAPcQ6SeUOIZpySEU58VyzR13wqgLuIMIEqmWHrcd6jDmMHI7gG9tBGmYSF7HucpOZQS4hQhEVqWlavijo6k9QFCpEz+WZV5MMa7r2hLNp1aSVUpIS2QJYENAgO+qNpWpCm32Ekdc7le+T1eu/3HZr68BCZ6z5nB42frefAbYMBBEYSk5I4wR2yYDSqcOmRpDbR9BmBg1/MGdWGOtrYMIcvPR/Ibcibn629GOKqVkKnpLPUIgL3mWSs3Ruf7W2sNd+dOrSVeUOq8Rc1w6GZt4W9yOxzobNiK0nY/boLCZwd3ycLdnXf3b/w9MkKjU',
  cardinalId: '6ab813c3-8edf-430f-8ec7-62b19209f78f',
  proofXml:
    '<AuthProof><Time>2022 Mar 30 11:40:16</Time><DSUrl>https://merchantacsstag.cardinalcommerce.com/MerchantACSWeb/vereq.jsp?acqid=CYBS</DSUrl><VEReqProof><Message id="yBL3Rz1lT74tDJ2UQP00"><VEReq><version>1.0.2</version><pan>XXXXXXXXXXXX1091</pan><Merchant><acqBIN>469216</acqBIN><merID>341422420000000</merID></Merchant><Browser><deviceCategory>0</deviceCategory><accept>*/*</accept><userAgent>Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36</userAgent></Browser></VEReq></Message></VEReqProof><VEResProof><Message id="yBL3Rz1lT74tDJ2UQP00"><VERes><version>1.0.2</version><CH><enrolled>Y</enrolled><acctID>5246197</acctID></CH><url>https://merchantacsstag.cardinalcommerce.com/MerchantACSWeb/pareq.jsp?vaa=b&amp;gold=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</url><protocol>ThreeDSecure</protocol></VERes></Message></VEResProof></AuthProof>',
  veresEnrolled: 'Y',
  specificationVersion: '1.0.2',
  acsurl:
    'https://merchantacsstag.cardinalcommerce.com/MerchantACSWeb/pareq.jsp?vaa=b&gold=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  authenticationTransactionId: 'yBL3Rz1lT74tDJ2UQP00',
  directoryServerTransactionId: undefined,
};

 const payerAuthActionsEmptyResponse = {
  isv_payerAuthenticationPaReq: '',
  isv_payerAuthenticationTransactionId: '',
  stepUpUrl: '',
  isv_responseJwt: '',
  isv_payerAuthenticationRequired: true,
  xid: '',
  pareq: '',
  cardinalId: '',
  proofXml: '',
  veresEnrolled: 'Y',
  specificationVersion: '1.0.2',
  acsurl: '',
  authenticationTransactionId: '',
  directoryServerTransactionId: undefined,
};

 const payerEnrollActionsResponse = {
  httpCode: 201,
  transactionId: '6486429828526882404951',
  status: 'PENDING_AUTHENTICATION',
  data: {
    id: '6486429828526882404951',
    submitTimeUtc: '2022-03-30T12:23:03Z',
    status: 'PENDING_AUTHENTICATION',
    errorInformation: {
      reason: 'CONSUMER_AUTHENTICATION_REQUIRED',
      message: 'The cardholder is enrolled in Payer Authentication. Please authenticate the cardholder before continuing with the transaction.',
    },
    clientReferenceInformation: {
      code: '5c162200-5e31-4857-9778-458b3efc9d77',
    },
    paymentInformation: {
      card: {
        type: 'VISA',
      },
      customer: {
        id: 'DB0B315B52BABC38E053AF598E0A8268',
      },
      paymentInstrument: {
        id: 'DB0B3127886FBB46E053AF598E0AF2A5',
      },
      instrumentIdentifier: {
        id: '7010000000121591111',
        state: 'ACTIVE',
      },
    },
    consumerAuthenticationInformation: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTNlN2IwMy01OTg3LTQ2MjYtOGNmMS1mMDllNzFmZWViNTEiLCJpYXQiOjE2NDg2NDI5ODMsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTY0ODY0NjU4MywiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUGF5bG9hZCI6eyJBQ1NVcmwiOiJodHRwczovL21lcmNoYW50YWNzc3RhZy5jYXJkaW5hbGNvbW1lcmNlLmNvbS9NZXJjaGFudEFDU1dlYi9wYXJlcS5qc3A_dmFhPWImZ29sZD1BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUEiLCJQYXlsb2FkIjoiZU5wVlVjdHV3akFRdlBzckVPbzVkaHdUQ0Zvc1FWRUZWQ0FFcUttNHBZNVZVdkxDU1hqMDYydUhwTFErN2F4bjdabFoyQjJVbE5PdEZKV1NISmF5S0lKUDJZbkNVWmY2L2YwMjNIdUQzZWJNMU8yZDdGOUpsOE42dkpFbkRtZXBpaWhMdVcwUml3SnVJZEpQS0hFSTBwSkRJRTZUK1lvejE2TzJDN2lCQ0JLcDVsUHVNSnRSeWlpNUg4RDNOb0kwU0NTL1JMbks0aklFWEVNRUlxdlNVdDM0Z0dscUN4QlVLdWFIc3N5TEljYVh5OFVTdHcrdEpLdVVrSmJJRXNDR2dBQS9WSzByVXhYYTdEVUsrVElXamgrdmp2N1hrYjI5TE9ocXR1ajUwMG13L1I2UEFCc0dnakFvSmFlRVV1STRwR1BUSVhXR1JIdXUrd2lDeEtqaFQ2NW45YlcyQmlMSXpVZmpPM0k5Yy9XM294MVZTc2xVdEpaYWhFQmU4eXlWbXFQLytLMjFoNGZ5NTVsSlY1UTZyeDVscnUzMVRidzFyc2NqblEzdEVidWVqK3Fnc0puQnpmSndzMmRkL2R2L0Q5amNxUjg9IiwiVHJhbnNhY3Rpb25JZCI6IjJXN1pTZFo5OFRSdjRyeVgwWkswIn0sIk9iamVjdGlmeVBheWxvYWQiOnRydWUsIlJldHVyblVybCI6Imh0dHBzOi8veW91dGhmdWwtZmllbGQtNjQ4MTMucGt0cmlvdC5uZXQvcGF5ZXJBdXRoUmV0dXJuVXJsIn0.uPVslu3p29n3_iILm0_ywbqTmMcqeiMiZHT62qcazDk',
      acsUrl:
        'https://merchantacsstag.cardinalcommerce.com/MerchantACSWeb/pareq.jsp?vaa=b&gold=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      authenticationPath: 'ENROLLED',
      authenticationTransactionId: '2W7ZSdZ98TRv4ryX0ZK0',
      pareq:
        'eNpVUctuwjAQvPsrEOo5dhwTCFosQVEFVCAEqKm4pY5VUvLCSXj062uHpLQ+7axn7ZlZ2B2UlNOtFJWSHJayKIJP2YnCUZf6/f023HuD3ebM1O2d7F9Jl8N6vJEnDmepiihLuW0RiwJuIdJPKHEI0pJDIE6T+Yoz16O2C7iBCBKp5lPuMJtRyii5H8D3NoI0SCS/RLnK4jIEXEMEIqvSUt34gGlqCxBUKuaHssyLIcaXy8UStw+tJKuUkJbIEsCGgAA/VK0rUxXa7DUK+TIWjh+vjv7Xkb29LOhqtuj500mw/R6PABsGgjAoJaeEUuI4pGPTIXWGRHuu+wiCxKjhT65n9bW2BiLIzUfjO3I9c/W3ox1VSslUtJZahEBe8yyVmqP/+K21h4fy55lJV5Q6rx5lru31Tbw1rscjnQ3tEbuej+qgsJnBzfJws2dd/dv/D9jcqR8=',
      proofXml:
        '<AuthProof><Time>2022 Mar 30 12:23:02</Time><DSUrl>https://merchantacsstag.cardinalcommerce.com/MerchantACSWeb/vereq.jsp?acqid=CYBS</DSUrl><VEReqProof><Message id="2W7ZSdZ98TRv4ryX0ZK0"><VEReq><version>1.0.2</version><pan>XXXXXXXXXXXX1091</pan><Merchant><acqBIN>469216</acqBIN><merID>341422420000000</merID></Merchant><Browser><deviceCategory>0</deviceCategory><accept>*/*</accept><userAgent>Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36</userAgent></Browser></VEReq></Message></VEReqProof><VEResProof><Message id="2W7ZSdZ98TRv4ryX0ZK0"><VERes><version>1.0.2</version><CH><enrolled>Y</enrolled><acctID>5246197</acctID></CH><url>https://merchantacsstag.cardinalcommerce.com/MerchantACSWeb/pareq.jsp?vaa=b&amp;gold=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</url><protocol>ThreeDSecure</protocol></VERes></Message></VEResProof></AuthProof>',
      proxyPan: '5246197',
      specificationVersion: '1.0.2',
      stepUpUrl: 'https://centinelapistag.cardinalcommerce.com/V2/Cruise/StepUp',
      veresEnrolled: 'Y',
      xid: 'Mlc3WlNkWjk4VFJ2NHJ5WDBaSzA=',
    },
  },
  cardinalReferenceId: 'b0c79f37-281e-4f09-a7a1-8ed01a459f20',
};
 let payerEnrollActionsUpdatePaymentObj : PaymentType= {
  id: unit.paymentId,
  version: 15,
  customer: { id: 'b0c50186-fc83-4a97-9ea3-47bab58b3cc6' },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 6970,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    method: 'creditCardWithPayerAuthentication',
  },
  custom: {
    fields: {
      isv_deviceFingerprintId: '5bb99fdb-9c2b-4606-a71c-c45d05a1b812',
      isv_cardExpiryYear: '2025',
      isv_token:
        'eyJraWQiOiIwODVJUUxGaENrVmFmcUxLa1RBNnBGMWdIZmNGZ1ROOCIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAyNSIsIm51bWJlciI6IjQwMDAwMFhYWFhYWDEwOTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wOCIsImV4cCI6MTY0ODY0Mzg3MywidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTY0ODY0Mjk3MywianRpIjoiMUUwSEI1R1RWNzgwUjk5WEhTWkU5WFVHM0JYQzk2TVRLOFRaNkU0SEVWWVVMMUMxQllYVjYyNDQ0RjIxM0MyQSIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDI1In0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDEwOTEiLCJiaW4iOiI0MDAwMDAifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.DWOWqICszl7KVlzRZLhV0E39cTkK19V8ZpRl-rKfeON6ObxYnwvWu8R-OMI1C6J9U4p0ng44lA7sMcEGqI0Tbl8SNSvbyznxlJLfxMyHmzgYNvLHl0b2aa6B4x_FYSe1YEMlaN_JRE33eHtUiL2Ev_3UPkz3oQ3jUPqvei7XIHrBO_BMmUd85JzRyrC5OswcRlAOkvQ9nrMnsIhrG8FmbgQXoJ6_u5i8dVJHa-UwtvvU1vUo-QYCygh1HE8NfatF_bW2-XXrZOLvlEVuaIYph0vMt9gUb8mawSTbIInnSZlTYfwJr9CVc9qyzYhYfSdKjdJ1JkeFRW15XGP5ZXjNyQ',
      isv_customerIpAddress: '27.57.67.109',
      isv_maskedPan: '400000XXXXXX1091',
      isv_cardExpiryMonth: '01',
      isv_deviceDataCollectionUrl: 'https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect',
      isv_cardinalReferenceId: 'b0c79f37-281e-4f09-a7a1-8ed01a459f20',
      isv_requestJwt:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNTJjOWM4Yi1mNzQ1LTRjMTMtYmM1Yi0xMzg4NjI2NzI1NDciLCJpYXQiOjE2NDg2NDI5NzYsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTY0ODY0NjU3NiwiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUmVmZXJlbmNlSWQiOiJiMGM3OWYzNy0yODFlLTRmMDktYTdhMS04ZWQwMWE0NTlmMjAifQ.ewcXvvaNDlHWMNIJc8zvSOxLwB200etnHgiVIJojLbI',
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJJVzh1U2NXT3dmbHZCS0s4aVRuRER4QUFFQS9rTVBkQStYd04yQmZBeEVLbHVtMXJiUEdUMkpNeFQvRk9lOC92V2VwNFlMYVJsUTFBUisrTVRlN0xPTU5kTmVVbUdDU0l6cFpPaTZ4UFdpb1dFdXhMaG9PWFgxWnVkVDhrMzNoK0RCL2oiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJrQWJ2M0ZNcFk5cHZxc1JZc1QyeU1PdkFoZUlkVi1VNm9WNDdqclJCRTd3dF93eGVJTzRqUzEyMUp2U0szMU5yeGVnWExTcWdFVUczSTFVUWRESGJONXlOYmJUMzluT2EzckxOT0g1di0yVEhpUGp3Y0RYX2ZBeW1CRG1QWnU2N0w1SDdCZXZYRXdnTk9tR1RXX3B6LUZKemRYVGh3MHV6QnZPRktNVXYtNXNoSm9nRjBrOEhMajdka1cyWG5nVUNJT1ZwNkJ1TDJmNW15bWhsUjhmSWF6Y3NIejlYLUVhRkVGUF9EWU9zVmFtNnRzc2s2TF8zdXpUOGNNckt1amRZVktnVWs0Ym5EdVBrQXFFSV81ay1IYnByQm43SUxJRGJ5MGJKa3E3NVY4Mm82TFhKVEc3cnpSQkhTVFU5T3haYmdaS0pZOWw4M1AyZjhKcERzNlJZNHciLCJraWQiOiIwODVJUUxGaENrVmFmcUxLa1RBNnBGMWdIZmNGZ1ROOCJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NDg2NDM4NjAsImlhdCI6MTY0ODY0Mjk2MCwianRpIjoiQmpvRDMwY2Y0WFBzV25rUSJ9.gqAJLWLjy44aZ1mADZPkArcfag870e0ELdC1cpybFsqHQx6RvPLEa506dg31cncqtPRL6wH4IIqTaPqWU7zpe-iNlSs7Ja3Fk3nl9quOjSysgK4xs3PD7ozlIhJ29-GmDhlamFbCRqhnjFa6wCbf3s7vy5gyckAXIWNyK3K1OZDgogkMHzpLorLYRQTVFdzImS6pjpVvjHn6B4pGuVVOgDgFCdlsKKs4uXAU8c8P_jWNWU37TxLPCpEoiqIkhaCG_Wz7gtplIcIifeU1OlLpprv_RPyu-g1qLzLLYQvF1eQFJ4vDBoWhNSCClXZXloGd1WRxAI0iq5MpI5wcuqnLdQ',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJJVzh1U2NXT3dmbHZCS0s4aVRuRER4QUFFQS9rTVBkQStYd04yQmZBeEVLbHVtMXJiUEdUMkpNeFQvRk9lOC92V2VwNFlMYVJsUTFBUisrTVRlN0xPTU5kTmVVbUdDU0l6cFpPaTZ4UFdpb1dFdXhMaG9PWFgxWnVkVDhrMzNoK0RCL2oiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJrQWJ2M0ZNcFk5cHZxc1JZc1QyeU1PdkFoZUlkVi1VNm9WNDdqclJCRTd3dF93eGVJTzRqUzEyMUp2U0szMU5yeGVnWExTcWdFVUczSTFVUWRESGJONXlOYmJUMzluT2EzckxOT0g1di0yVEhpUGp3Y0RYX2ZBeW1CRG1QWnU2N0w1SDdCZXZYRXdnTk9tR1RXX3B6LUZKemRYVGh3MHV6QnZPRktNVXYtNXNoSm9nRjBrOEhMajdka1cyWG5nVUNJT1ZwNkJ1TDJmNW15bWhsUjhmSWF6Y3NIejlYLUVhRkVGUF9EWU9zVmFtNnRzc2s2TF8zdXpUOGNNckt1amRZVktnVWs0Ym5EdVBrQXFFSV81ay1IYnByQm43SUxJRGJ5MGJKa3E3NVY4Mm82TFhKVEc3cnpSQkhTVFU5T3haYmdaS0pZOWw4M1AyZjhKcERzNlJZNHciLCJraWQiOiIwODVJUUxGaENrVmFmcUxLa1RBNnBGMWdIZmNGZ1ROOCJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NDg2NDM4NjAsImlhdCI6MTY0ODY0Mjk2MCwianRpIjoiQmpvRDMwY2Y0WFBzV25rUSJ9.0rwH22Eb51O6y8W2EzRHGkEtR7kAEG2HMPAbSh0kYdM',
    },
  },
  transactions: [],
};

 const getUpdateTokenActionsActions = [
  '{"alias":"4111card","value":"DB0B315B52BABC38E053AF598E0A8268","paymentToken":"DB0B3127886FBB46E053AF598E0AF2A5","instrumentIdentifier":"7010000000121591111","cardType":"001","cardName":"001","cardNumber":"411111XXXXXX1111","cardExpiryMonth":"01","cardExpiryYear":"2026","flag":"updated"}',
  '{"alias":"1091card","value":"DB0B315B52BABC38E053AF598E0A8268","paymentToken":"DB476FB611F49979E053AF598E0A0DE1","instrumentIdentifier":"7020000000005531091","cardType":"001","cardName":"001","cardNumber":"400000XXXXXX1091","cardExpiryMonth":"01","cardExpiryYear":"2026","flag":"updated"}',
];

 const getUpdateInvalidTokenActionsActions = [
'*@&*&*(*(&^%^',
'%^&(&*&^%&((('
];

 const deleteTokenResponse = {
  httpCode: 204,
  message: '',
  deletedToken: 'DC2417E36C42D8ADE053AF598E0A1705',
};

 const deleteTokenCustomerObj: CustomerType = {
  id: 'def6c669-eed5-4c57-ba2e-5fb04bfed1fa',
  version: 6,
  lastMessageSequenceNumber: 1,
  createdAt: '2022-04-08T11:20:47.143Z',
  lastModifiedAt: '2022-04-08T11:51:03.132Z',
  lastModifiedBy: {
    clientId: 'IDntqVHAxvMRxkMJfC5wFN6x',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'b0c50186-fc83-4a97-9ea3-47bab58b3cc6',
    },
  },
  createdBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'b0c50186-fc83-4a97-9ea3-47bab58b3cc6',
    },
  },
  email: 'sp@gmail.com',
  firstName: 'john ',
  lastName: 'doe',
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  isEmailVerified: false,
  custom: {
    fields: {
      isv_tokens: [
        '{"alias":"1091 31card","value":"DC23E657AA7749A4E053AF598E0AF2E6","paymentToken":"DC23CAF2946BDDE9E053AF598E0A482D","instrumentIdentifier":"7020000000005531091","cardType":"001","cardName":"001","cardNumber":"400000XXXXXX1091","cardExpiryMonth":"01","cardExpiryYear":"2031"}',
        '{"alias":"1111 25card","value":"DC23E657AA7749A4E053AF598E0AF2E6","paymentToken":"DC2417E36C42D8ADE053AF598E0A1705","instrumentIdentifier":"7010000000121591111","cardType":"001","cardName":"001","cardNumber":"411111XXXXXX1111","cardExpiryMonth":"01","cardExpiryYear":"2025"}',
      ],
    },
    type: {
      typeId: '',
      id: ''
    }
  }
};

 const getAuthorizedAmountCapturePaymentObj = {
  id: '14666485-c56b-4fa8-9ec7-668dc4141245',
  version: 21,
  versionModifiedAt: '2023-04-03T13:50:54.890Z',
  lastMessageSequenceNumber: 7,
  createdAt: '2023-04-03T10:53:56.281Z',
  lastModifiedAt: '2023-04-03T13:50:54.890Z',
  lastModifiedBy: {
    clientId: '5VRvbanr0X61yFLI3xiRqYZI',
    isPlatformClient: false,
  },
  createdBy: {
    clientId: 'C0f71msxpiTpAB0OiOaItOs8',
    isPlatformClient: false,
    anonymousId: 'baaf0387-930b-440d-be81-2ef80e23e251',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 4990,
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
      id: '4efe4b9b-c264-475d-b8ae-add573cd1800',
    },
    fields: {
      isv_deviceFingerprintId: 'a9d85a92-e44f-4e7b-ac28-5f9ef297990d',
      isv_cardExpiryYear: '2027',
      isv_token:
        'eyJraWQiOiIwOG5QcmMzOXduMHZBZzFjcXBwazRXUnVqb2RtaWhFSSIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAyNyIsIm51bWJlciI6IjQxMTExMVhYWFhYWDExMTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wOCIsImV4cCI6MTY4MDUyMDE1OSwidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTY4MDUxOTI1OSwianRpIjoiMUU0TFFCRDQ4UzYzSko5WkdZQzFBVUpNN0w1VjhOMThQUllSWkowMTdMTjY4TTFGRlNWTzY0MkFCM0RGNjlBMSIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDI3In0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDExMTEiLCJiaW4iOiI0MTExMTEifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.g0_ajMJx8_U4bZ1B8RQAXTSrC-b0kTFTPmm_DGBJa7NaCQm5P0ACQIjdDLj533mxwUOQxwQZ_4-HFIW9KONCL6Idw3SanfB7QsAsjVBNePE8491GxuR8xjGQ72TVDOX_OR93jTttJiHa7Cn_BgrmqUQPd_N0x-JvqWUUR5kdZCBFycu7D2et0nl2MMbb31SMDIk6mW38EUeuCIQzZW2jJeS9ASuo9rMkNEOLFy8F5tMZuuQupxOMgqRvCqe5q8uY5vUz3weBEcmxbQciY8SRlgVLpQX8ASgc2g1COCheqxEMKMMQwW9eVJ3kg8R-CJLzuvvAMv1Sl1T4e5Ps57xh_A',
      isv_saleEnabled: false,
      isv_cardType: '001',
      isv_customerIpAddress: '171.79.66.179',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJBMHR3czlsV2hpMk5yU1ZreHhVdGRSQUFFTjRDTTNVSE10VjdEYVlVc1k5Y0FWcnE0WHFvQ0tDaUhic0FwMzRZVTA1dHRwUVppemR6SWV5Y2dqdERvYXRicXN2TFM0Q3JSYmoyWDhxbDlOQnZDQm9ibVRUcHFYWjZqKzlOTUlqSWZRYysiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJoUFhpQTE0ek11WDFLa2xpeWRlSExhWks3YmVVZl9kRWlaQkhxcW41NXRNSDg5QnBOX0xqcTFzcGloaTVCSm1yMHpSMmFxTGt4N1RTcE1HZGNUQV83ak04bXptX3BlNDVGYjRmMkw5TElRSmdlSGpQVU51SnpJQ2VVTEpmX3JtbVZWckM3TXVxamxQRjFXUWV5bnhJYlNhSnZ1YjIyeFpJbk54bks3Nkg2amtndlQxS0p2aXFSa0JuR2FPZGtyT1JVWGdUQUN3T1JjQ2JVNUhKeUZBZmgtSHBhcU9ncHlsZ3dlTkJ5TGJScUVJQVZvM2xKMmVrd1lDenZ2SVQ0UFNibXRfSlRrVzFYQmdFUzFoNm9PM2ZNRWRlaTQtS1pTTzk5ZzBkS3dWNlpDQ29Qb1dXWnFnTlJnc1p1Nl9LRldqTDlUaDh3MFp5cjdtaWhWWU9FX01iYlEiLCJraWQiOiIwOG5QcmMzOXduMHZBZzFjcXBwazRXUnVqb2RtaWhFSSJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgyIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2ODA1MjAxMzYsImlhdCI6MTY4MDUxOTIzNiwianRpIjoiVlFheGNTQlFoVUw1T1dmNyJ9.u9-2VZPJkNS0iGCChVvhaz4ccf1BpmehNZsNJG6-JwQ',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '6d6b8091-b1ae-4cae-8fd1-add0b1d71b61',
      timestamp: '2023-04-03T10:54:23.070Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 4990,
        fractionDigits: 2,
      },
      interactionId: '6805192636456088103954',
      state: 'Success',
    },
    {
      id: '8be78c9a-4653-49ba-94e1-e0888b40858c',
      timestamp: '2023-04-03T13:50:42.196Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 300,
        fractionDigits: 2,
      },
      interactionId: '6805298432786349303955',
      state: 'Success',
    },
    {
      id: 'f6800138-1f32-4b4b-b7e9-a1f9089da74e',
      timestamp: '2023-04-03T13:50:53.384Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 200,
        fractionDigits: 2,
      },
      interactionId: '6805298545496228003954',
      state: 'Success',
    },
  ],
  interfaceInteractions: [],
  anonymousId: 'baaf0387-930b-440d-be81-2ef80e23e251',
};

 const getAuthorizedZeroAmountCapturePaymentObj = {
  id: '14666485-c56b-4fa8-9ec7-668dc4141245',
  version: 21,
  versionModifiedAt: '2023-04-03T13:50:54.890Z',
  lastMessageSequenceNumber: 7,
  createdAt: '2023-04-03T10:53:56.281Z',
  lastModifiedAt: '2023-04-03T13:50:54.890Z',
  lastModifiedBy: {
    clientId: '5VRvbanr0X61yFLI3xiRqYZI',
    isPlatformClient: false,
  },
  createdBy: {
    clientId: 'C0f71msxpiTpAB0OiOaItOs8',
    isPlatformClient: false,
    anonymousId: 'baaf0387-930b-440d-be81-2ef80e23e251',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 0,
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
      id: '4efe4b9b-c264-475d-b8ae-add573cd1800',
    },
    fields: {
      isv_deviceFingerprintId: 'a9d85a92-e44f-4e7b-ac28-5f9ef297990d',
      isv_cardExpiryYear: '2027',
      isv_token:
        'eyJraWQiOiIwOG5QcmMzOXduMHZBZzFjcXBwazRXUnVqb2RtaWhFSSIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAyNyIsIm51bWJlciI6IjQxMTExMVhYWFhYWDExMTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wOCIsImV4cCI6MTY4MDUyMDE1OSwidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTY4MDUxOTI1OSwianRpIjoiMUU0TFFCRDQ4UzYzSko5WkdZQzFBVUpNN0w1VjhOMThQUllSWkowMTdMTjY4TTFGRlNWTzY0MkFCM0RGNjlBMSIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDI3In0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDExMTEiLCJiaW4iOiI0MTExMTEifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.g0_ajMJx8_U4bZ1B8RQAXTSrC-b0kTFTPmm_DGBJa7NaCQm5P0ACQIjdDLj533mxwUOQxwQZ_4-HFIW9KONCL6Idw3SanfB7QsAsjVBNePE8491GxuR8xjGQ72TVDOX_OR93jTttJiHa7Cn_BgrmqUQPd_N0x-JvqWUUR5kdZCBFycu7D2et0nl2MMbb31SMDIk6mW38EUeuCIQzZW2jJeS9ASuo9rMkNEOLFy8F5tMZuuQupxOMgqRvCqe5q8uY5vUz3weBEcmxbQciY8SRlgVLpQX8ASgc2g1COCheqxEMKMMQwW9eVJ3kg8R-CJLzuvvAMv1Sl1T4e5Ps57xh_A',
      isv_saleEnabled: false,
      isv_cardType: '001',
      isv_customerIpAddress: '171.79.66.179',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJBMHR3czlsV2hpMk5yU1ZreHhVdGRSQUFFTjRDTTNVSE10VjdEYVlVc1k5Y0FWcnE0WHFvQ0tDaUhic0FwMzRZVTA1dHRwUVppemR6SWV5Y2dqdERvYXRicXN2TFM0Q3JSYmoyWDhxbDlOQnZDQm9ibVRUcHFYWjZqKzlOTUlqSWZRYysiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJoUFhpQTE0ek11WDFLa2xpeWRlSExhWks3YmVVZl9kRWlaQkhxcW41NXRNSDg5QnBOX0xqcTFzcGloaTVCSm1yMHpSMmFxTGt4N1RTcE1HZGNUQV83ak04bXptX3BlNDVGYjRmMkw5TElRSmdlSGpQVU51SnpJQ2VVTEpmX3JtbVZWckM3TXVxamxQRjFXUWV5bnhJYlNhSnZ1YjIyeFpJbk54bks3Nkg2amtndlQxS0p2aXFSa0JuR2FPZGtyT1JVWGdUQUN3T1JjQ2JVNUhKeUZBZmgtSHBhcU9ncHlsZ3dlTkJ5TGJScUVJQVZvM2xKMmVrd1lDenZ2SVQ0UFNibXRfSlRrVzFYQmdFUzFoNm9PM2ZNRWRlaTQtS1pTTzk5ZzBkS3dWNlpDQ29Qb1dXWnFnTlJnc1p1Nl9LRldqTDlUaDh3MFp5cjdtaWhWWU9FX01iYlEiLCJraWQiOiIwOG5QcmMzOXduMHZBZzFjcXBwazRXUnVqb2RtaWhFSSJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgyIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2ODA1MjAxMzYsImlhdCI6MTY4MDUxOTIzNiwianRpIjoiVlFheGNTQlFoVUw1T1dmNyJ9.u9-2VZPJkNS0iGCChVvhaz4ccf1BpmehNZsNJG6-JwQ',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '6d6b8091-b1ae-4cae-8fd1-add0b1d71b61',
      timestamp: '2023-04-03T10:54:23.070Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 40,
        fractionDigits: 2,
      },
      interactionId: '6805192636456088103954',
      state: 'Success',
    },
    {
      id: '8be78c9a-4653-49ba-94e1-e0888b40858c',
      timestamp: '2023-04-03T13:50:42.196Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 0,
        fractionDigits: 2,
      },
      interactionId: '6805298432786349303955',
      state: 'Success',
    },
    {
      id: 'f6800138-1f32-4b4b-b7e9-a1f9089da74e',
      timestamp: '2023-04-03T13:50:53.384Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 0,
        fractionDigits: 2,
      },
      interactionId: '6805298545496228003954',
      state: 'Success',
    },
  ],
  interfaceInteractions: [],
  anonymousId: 'baaf0387-930b-440d-be81-2ef80e23e251',
};

 const getRefundResponseUpdatePaymentObj = {
  id: 'e014e68a-c453-494e-9692-ed4daca9cf4d',
  version: 15,
  versionModifiedAt: '2023-08-11T08:57:47.643Z',
  lastMessageSequenceNumber: 11,
  createdAt: '2023-08-10T11:28:45.770Z',
  lastModifiedAt: '2023-08-11T08:57:47.643Z',
  lastModifiedBy: {
    clientId: 'vjOtikmRR04ldgMx3H3Dgc63',
    isPlatformClient: false,
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
    method: 'creditCard',
    name: {
      en: 'Credit Card',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '919acdd9-f671-4a83-ad81-2b01caa72250',
    },
    fields: {
      isv_transientToken: creditCard.isv_transientToken,
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
      id: 'bc74c77b-3dc6-4f1f-adec-cabc80cb9234',
      timestamp: '2023-08-10T11:28:48.091Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 5000,
        fractionDigits: 2,
      },
      interactionId: creditCard.authId,
      state: 'Success',
    },
    {
      id: '30a11b74-2ea3-483d-8ab4-e9aac2660987',
      timestamp: '2023-08-11T08:57:34.933Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 5000,
        fractionDigits: 2,
      },
      interactionId: creditCard.captureId,
      state: 'Success',
      custom: {
        type: {
          typeId: 'type',
          id: '2f335fa3-1381-49c4-aa5d-c64caac073c6',
        },
        fields: {
          isv_availableCaptureAmount: 4900,
        },
      },
    },
    {
      id: 'fdd7952a-b7e6-408a-80d6-bc48bbc807f0',
      timestamp: '2023-08-11T08:57:46.538Z',
      type: 'Refund',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 100,
        fractionDigits: 2,
      },
      interactionId: creditCard.refundId,
      state: 'Success',
    },
    {
      id: 'c68616f7-eaba-4307-9d5b-2117929be514',
      timestamp: '2023-08-11T08:57:50.043Z',
      type: 'Refund',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 100,
        fractionDigits: 2,
      },
      state: 'Initial',
    },
  ],
  interfaceInteractions: [],
  anonymousId: '9f414dca-2701-400f-86ad-f1af98d6a81a',
};

 const getRefundResponseUpdateTransactions = {
  id: 'c68616f7-eaba-4307-9d5b-2117929be514',
  timestamp: '2023-08-11T08:57:50.043Z',
  type: 'Refund',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 100,
    fractionDigits: 2,
  },
  state: 'Initial',
};

 const addRefundActionAmount = {
  type: 'centPrecision',
  currencyCode: 'USD',
  centAmount: 100,
  fractionDigits: 2,
};

 const addRefundActionZeroAmount = {
  type: 'centPrecision',
  currencyCode: 'USD',
  centAmount: 0,
  fractionDigits: 2,
};

 const addRefundActionOrderResponse = {
  httpCode: 201,
  transactionId: creditCard.refundId,
  status: 'PENDING',
};

 const state = 'Success';

 const getCreditCardResponseUpdatePaymentObj: any = {
  id: 'b18ec6af-6802-4638-8f75-d387d2977177',
  version: 12,
  versionModifiedAt: '2023-08-11T12:24:39.887Z',
  lastMessageSequenceNumber: 2,
  createdAt: '2023-08-11T12:23:58.555Z',
  lastModifiedAt: '2023-08-11T12:24:39.887Z',
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
    centAmount: 10000,
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
      id: '919acdd9-f671-4a83-ad81-2b01caa72250',
    },
    fields: {
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJHQ3k4SzBKbzJpNVRUdDVNSVcxSGxSQUFFS3AxeGMrSmtNa2ZFL2VvNWlraG91UU9hVk5pMXUyZWlwWkZaSFovd0tKWUlLakhoOXJ1M3V5aGcvU2tzc1dENWRkQVVTNXlKQ2JhcW5DSlJFYkhiVzVQRVg3VHlCOC9hOFF2L2cxYXluR2QiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiIzdzhia0lfbG1kaGx4Qzg2Nl82dktUQ1VkTzZzWUNvN2hsX0IzYlVmNk01YmRRbmhrTG14QUhLQ1R0alhWaE1TLVJDbTBJUmVOX2xCYnpzLVpMZU5PMHc5LVJKWW44WUlDcDdOeFV6MmRuRnpNMExpV21MUjhieV9CWEcxdnpMSDY5a3FGMjFiQ1h1NFVZV1ZtUEhzZno5QzJhdS1vTFc1X282b0x0VjgwU3U0QWoxaGVVdVJXSEpNcTUwem96Rm9LMldrRUp5dU5pclFVQzZSdVFFSmFtVTh2ekk5Sm1jVzRSUk84ZFJ4UmcydjhNd3RhWUgzYXN3dzNFQ1Z2bHItejV4TkstZkpTNHVXNzU1SWdJMWx4Ni1qTGNuQW5CcTRjdTVSMDdUVG5JcWZpelFYUUw5RUJPQnRxb1pfc09zZS1jNE0ydGR5TWpkaXc2YmFIeEVFdVEiLCJraWQiOiIwOHhnSzhGZGwxWDBPSUc3RHFCZjNJUnJpSXMzSm1RNiJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YxL2ZsZXgtbWljcm9mb3JtLm1pbi5qcyIsInRhcmdldE9yaWdpbnMiOlsiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MCJdLCJtZk9yaWdpbiI6Imh0dHBzOi8vdGVzdGZsZXguY3liZXJzb3VyY2UuY29tIn0sInR5cGUiOiJtZi0xLjAuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2OTE3NTc1MzgsImlhdCI6MTY5MTc1NjYzOCwianRpIjoiVHhMZThmTHlMejZvdG42RyJ9.cE4jeVTm7M30w6HLgikh-5-FDzHBWwUy0jxfOwncOu_sKP9vfmNbJYUOkzs2Gus94H8Gjhn8yWHCYrsXyrzmIVXQgHVhXEQ9BXsoms68-g5vmO-MZsWmMoNVuSjMyxNNCdk6RSQE0h8EQLUOmcyKrJYfGRf56tW9jPuwRKJYe6pE3kpGYY4Crkm8xr25VH3knJJcnjDM4djERYnzq9sovYrSTdhoKSIZCFdUULlKYvbBvEkUooXszirKvfAc3zVY1mDLKtNWxM49KPkp6L096t1pFYwKwwrBsBVCd4ZTsswVDPQJ2plegYSHUPN18qe4kQLIV6omLemmgK7W43cruQ',
      isv_deviceFingerprintId: '9ee1d36f-15b5-43e5-a41d-a4c9ea70e2b2',
      isv_token: creditCard.isv_token,
      isv_saleEnabled: false,
      isv_cardType: '001',
      isv_customerIpAddress: '192.140.152.59',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJHQ3k4SzBKbzJpNVRUdDVNSVcxSGxSQUFFS3AxeGMrSmtNa2ZFL2VvNWlraG91UU9hVk5pMXUyZWlwWkZaSFovd0tKWUlLakhoOXJ1M3V5aGcvU2tzc1dENWRkQVVTNXlKQ2JhcW5DSlJFYkhiVzVQRVg3VHlCOC9hOFF2L2cxYXluR2QiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiIzdzhia0lfbG1kaGx4Qzg2Nl82dktUQ1VkTzZzWUNvN2hsX0IzYlVmNk01YmRRbmhrTG14QUhLQ1R0alhWaE1TLVJDbTBJUmVOX2xCYnpzLVpMZU5PMHc5LVJKWW44WUlDcDdOeFV6MmRuRnpNMExpV21MUjhieV9CWEcxdnpMSDY5a3FGMjFiQ1h1NFVZV1ZtUEhzZno5QzJhdS1vTFc1X282b0x0VjgwU3U0QWoxaGVVdVJXSEpNcTUwem96Rm9LMldrRUp5dU5pclFVQzZSdVFFSmFtVTh2ekk5Sm1jVzRSUk84ZFJ4UmcydjhNd3RhWUgzYXN3dzNFQ1Z2bHItejV4TkstZkpTNHVXNzU1SWdJMWx4Ni1qTGNuQW5CcTRjdTVSMDdUVG5JcWZpelFYUUw5RUJPQnRxb1pfc09zZS1jNE0ydGR5TWpkaXc2YmFIeEVFdVEiLCJraWQiOiIwOHhnSzhGZGwxWDBPSUc3RHFCZjNJUnJpSXMzSm1RNiJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YxL2ZsZXgtbWljcm9mb3JtLm1pbi5qcyIsInRhcmdldE9yaWdpbnMiOlsiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MCJdLCJtZk9yaWdpbiI6Imh0dHBzOi8vdGVzdGZsZXguY3liZXJzb3VyY2UuY29tIn0sInR5cGUiOiJtZi0xLjAuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2OTE3NTc1MzgsImlhdCI6MTY5MTc1NjYzOCwianRpIjoiVHhMZThmTHlMejZvdG42RyJ9.HRrLioN2q7fbFKyHWiiLMriKcwkoVb4nwcu3UBpeYUw',
      isv_cardExpiryYear: '2026',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '6d93adbe-7c8d-45d4-833a-ae60467addcb',
      timestamp: '2023-08-11T12:24:43.318Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 10000,
        fractionDigits: 2,
      },
      state: 'Initial',
    },
  ],
  interfaceInteractions: [],
  anonymousId: '9f414dca-2701-400f-86ad-f1af98d6a81a',
};

 const getCreditCardResponseCartObj = {
  type: 'Cart',
  id: '56414cc7-5e77-4fd9-9d6a-edad661dd95b',
  version: 12,
  versionModifiedAt: '2023-08-11T13:09:35.169Z',
  lastMessageSequenceNumber: 1,
  createdAt: '2023-08-11T13:08:57.901Z',
  lastModifiedAt: '2023-08-11T13:09:35.169Z',
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
  anonymousId: '9f414dca-2701-400f-86ad-f1af98d6a81a',
  locale: 'en',
  lineItems: [
    {
      id: '1da7495a-70f8-49ea-b443-3625ce8e9366',
      productId: 'ad0cf3f4-fe64-4517-b7d0-c028d64e04ef',
      name: {
        'de-DE': 'Bridal Lahenga',
        'es-CL': 'Bridal Lahenga',
        ja: 'Bridal Lahenga',
        'en-GB': 'Bridal Lahenga',
        en: 'Bridal Lahenga',
        'en-US': 'Bridal Lahenga',
        'ar-BH': 'Bridal Lahenga',
      },
      productType: {
        typeId: 'product-type',
        id: '526d8919-fe8f-4e26-8e60-35ecceec9284',
        version: 1,
      },
      productSlug: {
        en: 'a16',
      },
      variant: {
        id: 1,
        sku: 'SKU-16',
        prices: [
          {
            id: '1bf0d8f5-c3f3-47bd-aa51-0c55b4366c7c',
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 1580,
              fractionDigits: 2,
            },
            country: 'DE',
          },
          {
            id: '6cca5967-3537-4ee9-9447-5dc5c08f69b9',
            value: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 5000,
              fractionDigits: 2,
            },
            country: 'US',
          },
          {
            id: 'd0f0ab75-4f61-4417-84c3-14c5d0cbc40d',
            value: {
              type: 'centPrecision',
              currencyCode: 'JPY',
              centAmount: 50,
              fractionDigits: 0,
            },
            country: 'JP',
          },
          {
            id: 'c1dd6377-a92c-4a3c-8922-a38b15a3873f',
            value: {
              type: 'centPrecision',
              currencyCode: 'CLP',
              centAmount: 50,
              fractionDigits: 0,
            },
            country: 'CL',
          },
          {
            id: 'be7e1c2a-0d06-4151-a3ce-6d41df9e9809',
            value: {
              type: 'centPrecision',
              currencyCode: 'BHD',
              centAmount: 50000,
              fractionDigits: 3,
            },
            country: 'BH',
          },
          {
            id: '9a2a70a3-9c6f-4ccf-b5c6-f076d238e8b0',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 6000,
              fractionDigits: 2,
            },
            country: 'GB',
          },
        ],
        images: [
          {
            url: 'https://img.weddingbazaar.com/shaadisaga_production/photos/pictures/000/923/067/new_large/the_wedding_conteurs3.jpg?1560777936',
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
        id: '6cca5967-3537-4ee9-9447-5dc5c08f69b9',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 5000,
          fractionDigits: 2,
        },
        country: 'US',
      },
      quantity: 1,
      discountedPricePerQuantity: [],
      taxRate: {
        name: 'test-taxes-category',
        amount: 0.2,
        includedInPrice: true,
        country: 'US',
        id: '4C4h3IUy',
        subRates: [],
      },
      perMethodTaxRate: [],
      addedAt: '2023-08-11T13:08:58.537Z',
      lastModifiedAt: '2023-08-11T13:08:58.537Z',
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: '16817240-b167-4ddd-82ce-6772851db76a',
          },
        },
      ],
      priceMode: 'Platform',
      lineItemMode: 'Standard',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 5000,
        fractionDigits: 2,
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 4167,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 5000,
          fractionDigits: 2,
        },
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 833,
          fractionDigits: 2,
        },
      },
      taxedPricePortions: [],
    },
  ],
  cartState: 'Active',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5000,
    fractionDigits: 2,
  },
  taxedPrice: {
    totalNet: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 4167,
      fractionDigits: 2,
    },
    totalGross: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 5000,
      fractionDigits: 2,
    },
    taxPortions: [
      {
        rate: 0.2,
        amount: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 833,
          fractionDigits: 2,
        },
        name: 'test-taxes-category',
      },
    ],
    totalTax: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 833,
      fractionDigits: 2,
    },
  },
  country: 'US',
  shippingMode: 'Single',
  shippingAddress: {
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
  shipping: [],
  customLineItems: [],
  discountCodes: [],
  directDiscounts: [],
  paymentInfo: {
    payments: [
      {
        typeId: 'payment',
        id: 'b5bc1c23-627b-4466-95fb-3ef5b5cc07cc',
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

 const getGooglePayResponseUpdatePaymentObj = {
  id: '9d727280-43f8-46cf-90dd-b2a4909b761f',
  version: 2,
  versionModifiedAt: '2023-08-11T13:30:01.153Z',
  lastMessageSequenceNumber: 2,
  createdAt: '2023-08-11T13:30:01.153Z',
  lastModifiedAt: '2023-08-11T13:30:01.153Z',
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
      isv_deviceFingerprintId: '9ee1d36f-15b5-43e5-a41d-a4c9ea70e2b2',
      isv_token: googlePay.isv_token,
      isv_saleEnabled: false,
      isv_acceptHeader: '*/*',
      isv_customerIpAddress: '192.140.152.59',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: 'cdb4c031-98fa-4a97-b7e9-b180fcce81d3',
      timestamp: '2023-08-11T13:30:04.984Z',
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

 const getClickToPayResponseUpdatePaymentObj = {
  id: '6a29a73d-7ade-4d52-a0a3-3b52c15c59a0',
  version: 2,
  versionModifiedAt: '2023-08-11T13:52:25.234Z',
  lastMessageSequenceNumber: 2,
  createdAt: '2023-08-11T13:52:25.234Z',
  lastModifiedAt: '2023-08-11T13:52:25.234Z',
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
    method: 'clickToPay',
    name: {
      en: 'Click to Pay',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '919acdd9-f671-4a83-ad81-2b01caa72250',
    },
    fields: {
      isv_deviceFingerprintId: '3d628d88-af91-4fb5-b498-e42a4484b65b',
      isv_token: clickToPay.isv_token,
      isv_saleEnabled: false,
      isv_acceptHeader: '*/*',
      isv_customerIpAddress: '192.140.152.59',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '874c9d63-e1c5-4998-9054-fd66aa81a52e',
      timestamp: '2023-08-11T13:52:28.760Z',
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

 const tokenCreateFlagCustomerInfo = {
  id: '19357cc7-8edf-4e19-ad10-37d9ecd26398',
  version: 1,
  versionModifiedAt: '2023-10-06T06:41:47.315Z',
  lastMessageSequenceNumber: 1,
  createdAt: '2023-10-06T06:41:47.315Z',
  lastModifiedAt: '2023-10-06T06:41:47.315Z',
  lastModifiedBy: {
    clientId: '58JLGBoIQt5xVaer1FVEvFCA',
    isPlatformClient: false,
    customer: { typeId: 'customer', id: '5ab91b4c-7eeb-4bd7-92bd-bf6d72fd7e8e' },
  },
  createdBy: {
    clientId: '58JLGBoIQt5xVaer1FVEvFCA',
    isPlatformClient: false,
    customer: { typeId: 'customer', id: '5ab91b4c-7eeb-4bd7-92bd-bf6d72fd7e8e' },
  },
  email: 'testerkevin@gmail.com',
  firstName: 'Tester',
  lastName: 'kevin',
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  isEmailVerified: false,
  stores: []
};

 const tokenCreateFlagPaymentObj: PaymentType = {
  id: 'a16d2aa2-4e89-404d-ac45-2c048e4e8cda',
  version: 14,
  customer: { id: '19357cc7-8edf-4e19-ad10-37d9ecd26398' },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 6585,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    method: 'creditCard',
  },
  custom: {
    fields: {
      isv_tokenCaptureContextSignature: 'Q',
      isv_deviceFingerprintId: '25ebc821-8a83-497b-a9cf-5014e0b07514',
      isv_token: 'Hs_YDi305SE6_Sg',
      isv_cardType: '001',
      isv_customerIpAddress: '192.1.1',
      isv_maskedPan: '411111XXXXXXXXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_tokenVerificationContext: 's',
      isv_cardExpiryYear: '2026',
      isv_saleEnabled: false,
      isv_tokenAlias: 'card1',
    },
  },
  transactions: [
    {
      id: '5575f965-7326-40ca-911b-c4e4528b4801',
      timestamp: '2023-10-06T06:42:31.510Z',
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
};

 const tokenCreateFlagFunctionName = 'FuncGetCreditCardResponse';

 const createResponseSetTransaction = {
  action: 'changeTransactionInteractionId',
  interactionId: '7017763034976210803954',
  transactionId: '7c53c4d8-a463-49ad-a50e-a4e639513066',
};

 const createTransactionSetCustomField = {
  action: 'changeTransactionState',
  state: 'Success',
  transactionId: '7c53c4d8-a463-49ad-a50e-a4e639513066',
};

 const createTransactionSetFailedCustomField = {
  action: 'changeTransactionState',
  state: 'Failure',
  transactionId: '7c53c4d8-a463-49ad-a50e-a4e639513066',
};

 const getTransactionSummariesUpdatePaymentObj = {
  id: '4cb11292-d00f-45db-8505-caa387cb1fdc',
  version: 12,
  versionModifiedAt: '2023-12-05T12:29:38.507Z',
  lastMessageSequenceNumber: 2,
  createdAt: '2023-12-05T12:29:24.554Z',
  lastModifiedAt: '2023-12-05T12:29:38.507Z',
  lastModifiedBy: {
    clientId: 'YP-uO3kEDIxjg2BnnfwnBGj9',
    isPlatformClient: false,
    anonymousId: 'ad4acd03-8ada-4b90-9d2d-6eb7a611e213',
  },
  createdBy: {
    clientId: 'YP-uO3kEDIxjg2BnnfwnBGj9',
    isPlatformClient: false,
    anonymousId: 'ad4acd03-8ada-4b90-9d2d-6eb7a611e213',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 38040,
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
      id: 'a4d5396c-7d1d-442c-aae2-fdda7f908dd1',
    },
    fields: {
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJ6aUpGTldhS3NCcW9GbEcvQ3ludE1SQUFFR1M5RVlCRklzdlRHTURCQlJaTWQwRmpoVHlJWFlyZEVYR0J6RENzVm53QzFpMldUVUJNaFFhUGgvU0FubzUwUlBsc2xQSkxQOTBWMy84bml4L0VtdThMQmZLa0JLWHRFU0tNUENObEE3TWciLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiIyWTJVYXZ6TEZJVWZ1bzFtUGJROGFDd283QllEZmdvY21VeHkxSURtem93bDc3N1YwS05UTVRDckg0MTJqWXduRTlXOVB5UHd1VHk3T2ZKWU1HdUYzZWNoQ2tmcU9hb1YxTmxiNDFEeng3TXlMSjNoZjJsSFR2eGU4MmtpMXRiSnhyZTM0bmF0QVRPaGEzbWFyTVp3UEZ5S3ZZX0tEUV91QkM2c2E5UXNVVGV6NWVDRVNWWUxyWGJUSGVfMllfRDJmZ1lETno3MWp6aXlST3gyS0xBMFNNLThCcExjS1d4V19KVlVpdkRKQjNSdUNSaXRMTW5IMTJBRERtb21MWGxRY204OHUyX2NTb2t1OUdtU0FuVGFGclZnNjExbE55Nnp0MWRLVG5oVEhsRXJPY3lJTWEzUXZzc0hXVDlJQ0RZRFRsdXNFNTlzQ3M3c1FJZDdvS0ZVLXciLCJraWQiOiIwOHplUzFxSmVqYmVwTWhydWh2THhpSmFXYXR4SUdSMyJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiLCJNQUVTVFJPIiwiQ0FSVEVTQkFOQ0FJUkVTIiwiQ1VQIiwiSkNCIiwiRElORVJTQ0xVQiIsIkRJU0NPVkVSIl0sInRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTIuMC4wIn1dLCJpc3MiOiJGbGV4IEFQSSIsImV4cCI6MTcwMTc4MDI2NCwiaWF0IjoxNzAxNzc5MzY0LCJqdGkiOiJZdmhuVVJIYlZmSDB1S3l3In0.LBpm0v9M6UWz3mZuDcFpPFX46aiGj-Jd638cyZusPG52PpYNxfjxkC5k9DHFQ8QJQAUiXl67Saoq7c-A3kkHCnqeyOjuWtquQeNjw9Ru0tcmBTtgHGUZXV2enR5LMSPJGWecsazgSilPQs9grmRLVSQBz32gr5-n9pvIBmfqz73V7bUuih8ph_mcDEBOKUSoOOqfMvhL8ntVvMEs5zcsPhOpIu1znCeox76wjDH-maSQIu5SCLwQS5a8cTycGwy_CwaGnbxnEo_JLgq9uCP7vDQxeUXWjJnVfexZ-HNGsyeqWVBhglgGteJCX84AUzaqwgeWgZxvcXjn6ZiByucnQA',
      isv_deviceFingerprintId: 'ab53e5d6-ea2c-4552-b5fb-45f06066c1ba',
      isv_cardExpiryYear: '2032',
      isv_token:
        'eyJraWQiOiIwOHplUzFxSmVqYmVwTWhydWh2THhpSmFXYXR4SUdSMyIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA3IiwiZXhwIjoxNzAxNzgwMjc3LCJ0eXBlIjoibWYtMi4wLjAiLCJpYXQiOjE3MDE3NzkzNzcsImp0aSI6IjFFMlM4N05NSk8zU1ZERlBYMFNESU9KRlVIOEpPV1IzNVlEN0NUWldLUEk0R0RXWFROSFA2NTZGMUIzNUQ4MTAiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAzMiJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTA5MSIsImJpbiI6IjQwMDAwMCJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwMSJ9fX19fQ.CNE39XB99N0k4tLdic0O24pQXNefkwDmv_csczQgkk4zwVwH7ZHQLEqS5XGAn9xCaBo952X-9le2S69xlV0nnCW8rwN38MmejatxikIq_EE4-H7imq7iGrwcRSqTrJ71KWSCIIIv1a_r4I-tw8_Pu_5dyJ10AShbOptJ58ug4icBB3zCevrBsZILKCVvdCdaZ4KFajPkDDibGNQtD8mrmmsNFa8IU05FHnt544FfpbOJaAKtUFlTkxSbgHushEwjqXfooQ7rgnM1DSa4PArlQ8mFicXjbU8SQFpazGCbLOo0Ih3m0NkNcEDLowkDoAdV8KhnEqjKsnE0oAQeC52Dqg',
      isv_saleEnabled: false,
      isv_cardType: '001',
      isv_customerIpAddress: '122.161.52.252',
      isv_maskedPan: '400000XXXXXXXXXXXX1091',
      isv_cardExpiryMonth: '01',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJ6aUpGTldhS3NCcW9GbEcvQ3ludE1SQUFFR1M5RVlCRklzdlRHTURCQlJaTWQwRmpoVHlJWFlyZEVYR0J6RENzVm53QzFpMldUVUJNaFFhUGgvU0FubzUwUlBsc2xQSkxQOTBWMy84bml4L0VtdThMQmZLa0JLWHRFU0tNUENObEE3TWciLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiIyWTJVYXZ6TEZJVWZ1bzFtUGJROGFDd283QllEZmdvY21VeHkxSURtem93bDc3N1YwS05UTVRDckg0MTJqWXduRTlXOVB5UHd1VHk3T2ZKWU1HdUYzZWNoQ2tmcU9hb1YxTmxiNDFEeng3TXlMSjNoZjJsSFR2eGU4MmtpMXRiSnhyZTM0bmF0QVRPaGEzbWFyTVp3UEZ5S3ZZX0tEUV91QkM2c2E5UXNVVGV6NWVDRVNWWUxyWGJUSGVfMllfRDJmZ1lETno3MWp6aXlST3gyS0xBMFNNLThCcExjS1d4V19KVlVpdkRKQjNSdUNSaXRMTW5IMTJBRERtb21MWGxRY204OHUyX2NTb2t1OUdtU0FuVGFGclZnNjExbE55Nnp0MWRLVG5oVEhsRXJPY3lJTWEzUXZzc0hXVDlJQ0RZRFRsdXNFNTlzQ3M3c1FJZDdvS0ZVLXciLCJraWQiOiIwOHplUzFxSmVqYmVwTWhydWh2THhpSmFXYXR4SUdSMyJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiLCJNQUVTVFJPIiwiQ0FSVEVTQkFOQ0FJUkVTIiwiQ1VQIiwiSkNCIiwiRElORVJTQ0xVQiIsIkRJU0NPVkVSIl0sInRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTIuMC4wIn1dLCJpc3MiOiJGbGV4IEFQSSIsImV4cCI6MTcwMTc4MDI2NCwiaWF0IjoxNzAxNzc5MzY0LCJqdGkiOiJZdmhuVVJIYlZmSDB1S3l3In0.ioSSM1JIIXowdSAgLWAnB5Ia1oCkK3RuGQTA9iv0x48',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: 'c16be598-5100-41a1-93c4-922697a246a4',
      timestamp: '2023-12-05T12:29:44.094Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 38040,
        fractionDigits: 2,
      },
      state: 'Initial',
    },
  ],
  interfaceInteractions: [],
  anonymousId: 'ad4acd03-8ada-4b90-9d2d-6eb7a611e213',
};

 const checkAuthReversalTriggeredPaymentResponse = {
  httpCode: 201,
  transactionId: '7018441973826257903954',
  status: 'AUTHORIZED_RISK_DECLINED',
  data: {
    _links: {
      self: {
        href: '/pts/v2/payments/7018441973826257903954',
        method: 'GET',
      },
      capture: {
        href: '/pts/v2/payments/7018441973826257903954/captures',
        method: 'POST',
      },
    },
    id: '7018441973826257903954',
    submitTimeUtc: '2023-12-06T06:29:58Z',
    status: 'AUTHORIZED_RISK_DECLINED',
    errorInformation: {
      reason: 'DECISION_PROFILE_REJECT',
      message: 'The order has been rejected by Decision Manager',
    },
    clientReferenceInformation: {
      code: '95aadb57-6587-4597-bcb4-342ef7b63a64',
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
    paymentInformation: {
      scheme: 'VISA DEBIT',
      bin: '411111',
      accountType: 'Visa Classic',
      issuer: 'CONOTOXIA SP. Z O.O',
      binCountry: 'PL',
    },
    orderInformation: {
      amountDetails: {
        authorizedAmount: '418.40',
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
      localTime: '0:29:57',
      score: {
        factorCodes: ['F', 'G', 'Q'],
        modelUsed: 'default_eu',
        result: '85',
      },
      ipAddress: {
        locality: 'new delhi',
        country: 'in',
        administrativeArea: 'dl',
        routingMethod: 'fixed',
        carrier: 'bharti airtel ltd.',
        organization: 'bharti airtel ltd. 224  okhla industrial area phase iii new delh',
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

 const checkAuthReversalTriggeredUpdateActions = {
  actions: [
    {
      action: 'changeTransactionInteractionId',
      interactionId: '7018441973826257903954',
      transactionId: 'adb0a601-590a-48af-a66e-f4264980c274',
    },
    {
      action: 'changeTransactionState',
      state: 'Success',
      transactionId: 'adb0a601-590a-48af-a66e-f4264980c274',
    },
    {
      action: 'setCustomField',
      name: 'isv_tokenCaptureContextSignature',
      value: null,
    },
  ],
  errors: [],
};

 let runSyncAddTransactionSyncUpdateObject: ReportSyncType = {
  id: unit.paymentId,
  transactionId: '',
  version: 32,
  interactionId: '7018680726606510103955',
  amountPlanned: {
    currencyCode: 'USD',
    centAmount: 2000,
  },
  type: 'Refund',
  state: '',
  securityCodePresent: false,
};

 let runSyncAddTransactionSyncUpdateEmptyObject: ReportSyncType = {
  id: unit.paymentId,
  transactionId: '',
  version: 32,
  interactionId: '',
  amountPlanned: {
    currencyCode: '',
    centAmount: 1,
  },
  type: '',
  state: '',
  securityCodePresent: false,
};

 const runSyncUpdateCaptureAmountUpdatePaymentObj = {
  id: unit.paymentId,
  version: 38,
  versionModifiedAt: '2023-12-07T06:33:01.682Z',
  lastMessageSequenceNumber: 19,
  createdAt: '2023-12-04T11:38:09.372Z',
  lastModifiedAt: '2023-12-07T06:33:01.682Z',
  lastModifiedBy: {
    clientId: 'YP-uO3kEDIxjg2BnnfwnBGj9',
    isPlatformClient: false,
  },
  createdBy: {
    clientId: 'YP-uO3kEDIxjg2BnnfwnBGj9',
    isPlatformClient: false,
    anonymousId: 'ad4acd03-8ada-4b90-9d2d-6eb7a611e213',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 26600,
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
      id: 'a4d5396c-7d1d-442c-aae2-fdda7f908dd1',
    },
    fields: {
      isv_deviceFingerprintId: '530f8aac-9f\b0-42ae-acc2-1bbd790eedd7',
      isv_cardExpiryYear: '2031',
      isv_token:
        'eyJraWQiOiIwOHJyNUtlR3lwYVRuRGo3bGhiRHVkUEFUTlBpTWZmOCIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA4IiwiZXhwIjoxNzAxNjkwNzk5LCJ0eXBlIjoibWYtMi4wLjAiLCJpYXQiOjE3MDE2ODk4OTksImp0aSI6IjFFM1FZRUhNOThCWThWQzgzNEpOVVdBSTlXVkRWQVc4MUpDMUVYUDRFVEdVU0FEVFU3Rjk2NTZEQkRBRkRGQTciLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAzMSJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTExMSIsImJpbiI6IjQxMTExMSJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwMSJ9fX19fQ.SrjWLypZPCSR99GZ5-1NM4qKkvI-PGQmDuDEAj3H8_diok1YvXtfaQmnh6LlD8ljzOkgy9dtlcDZI7WQt1fNWZ7K6wYoms1ynlH5fcJJXUz4zliPfxMOWH_09w0xAuDb-hbDkuv_aoSMBfgmk2H_ji2qyTiBKeeI5xBdbukn0FOmNqomWxobZkoxBG2yeDOeU_-8A3DkzwwWVXaD860020_jDYWjq25nYe5BE2WrWOROXPFbpSNshHNlZOt2It1hCaxjig4kGhDHnnQqQBg_RLJ-kFEBXs8d5OXX7ojTm2Ml_IJsLtQ2MPA7E79uXBT7--KF3KURm-42O-6W7Atq4A',
      isv_saleEnabled: false,
      isv_cardType: '001',
      isv_customerIpAddress: '122.161.49.253',
      isv_maskedPan: '411111XXXXXXXXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJIaWt5MjcwOElrRCt2R1kvd2JrNWxCQUFFRXc0NmM1N0NxMHFHQTNIYkpQczJnRGoyTHlIY3BsaUFEUVd1UDhPMUlaNnZ2NXBPdVI4cGlqb1drSTE4dXdMNlJFb0FZRmx0THhXYXE3MnNtZk4zQ3EzWVVjSWx6VDV2cldEejhrai9MVVAiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJoQUVHVm9OSDZDOGhaSzNhYU5adFJ6ZjZxTlZCOVgwUnR2SV9NbHpsMTNLV2tvaWFCekthNWgxT2o4RkVKWWFOYTM1d2VFMEVNX3dGX2NGd05rdERTaEJmM3JiaF9LVHh1N1RhcTd4U3R2SWJVS295SkZMR3hmYnNQZWRmZVNmck0tQ1d1MVlCVm5acjNDaVlqRmFrN3BDYXJyZDdxTFVRU2tHVmx3cWo3TldKRW1yVzdITDhhU1lGZlFmbVZzOGd0NzZNTGlXSjdoLXVZUXNaT2ZvZm1LcVkyc2FQcF8wWmF6Z1FreTQ4eXYzRXptWjZ2SzlZNmpuVUlBQy0tTk55NDRBeTI1R05pUlJTMF82S19xRW5tTWZrdXdwcHlHSGdnQ2tNZ3NzTzdFaHROMlF3R2ZVZkdKYm42Slk4YTNTaXZtb0g0ZmJOZHpyTzRxNjdYaEVYWFEiLCJraWQiOiIwOHJyNUtlR3lwYVRuRGo3bGhiRHVkUEFUTlBpTWZmOCJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiLCJNQUVTVFJPIiwiQ0FSVEVTQkFOQ0FJUkVTIiwiQ1VQIiwiSkNCIiwiRElORVJTQ0xVQiIsIkRJU0NPVkVSIl0sInRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTIuMC4wIn1dLCJpc3MiOiJGbGV4IEFQSSIsImV4cCI6MTcwMTY5MDc4OSwiaWF0IjoxNzAxNjg5ODg5LCJqdGkiOiJKVWNNU2JWMlVmaGZIa2pLIn0.F05remV1MpwaGNzSZe1onfb3OqP3e30fTPbwzODDgMA',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '0cc55e21-782d-495a-8f46-e048549d6968',
      timestamp: '2023-12-04T11:38:26.489Z',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 26600,
        fractionDigits: 2,
      },
      interactionId: '7016899066126931003954',
      state: 'Success',
    },
    {
      id: 'cee8ede5-1b8d-49e9-b1d0-df59e7ba8f8a',
      timestamp: '2023-12-05T07:34:37.591Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 200,
        fractionDigits: 2,
      },
      interactionId: '7017616789236062003954',
      state: 'Success',
      custom: {
        type: {
          typeId: 'type',
          id: 'b564934d-0ba1-4fa3-9a4a-d828a4b0fd4c',
        },
        fields: {
          isv_availableCaptureAmount: 0,
        },
      },
    },
    {
      id: '6cc2c4dc-965d-48de-bfe9-dcf85eba6752',
      timestamp: '2023-12-05T07:35:44.536Z',
      type: 'Refund',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 200,
        fractionDigits: 2,
      },
      interactionId: '7017617455386884103955',
      state: 'Success',
    },
    {
      id: '6c92d7d8-536c-4260-85cf-abd90ab5df15',
      timestamp: '2023-12-05T11:02:31.783Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 1000,
        fractionDigits: 2,
      },
      interactionId: '7017741531276917203954',
      state: 'Success',
      custom: {
        type: {
          typeId: 'type',
          id: 'b564934d-0ba1-4fa3-9a4a-d828a4b0fd4c',
        },
        fields: {
          isv_availableCaptureAmount: 0,
        },
      },
    },
    {
      id: 'ee3ddfe0-63b3-425f-8fc1-58f9694e15a3',
      timestamp: '2023-12-05T11:16:39.300Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 2000,
        fractionDigits: 2,
      },
      interactionId: '7017750003876040703954',
      state: 'Success',
      custom: {
        type: {
          typeId: 'type',
          id: 'b564934d-0ba1-4fa3-9a4a-d828a4b0fd4c',
        },
        fields: {
          isv_availableCaptureAmount: 0,
        },
      },
    },
    {
      id: '17487610-5918-49a3-83f3-e3f257500f55',
      timestamp: '2023-12-06T08:23:52.094Z',
      type: 'Refund',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 1000,
        fractionDigits: 2,
      },
      state: 'Initial',
    },
    {
      id: 'e2706b89-787a-4156-954e-19425bb430d2',
      timestamp: '2023-12-06T08:24:33.624Z',
      type: 'Refund',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 1000,
        fractionDigits: 2,
      },
      interactionId: '7018510331776398603954',
      state: 'Success',
    },
    {
      id: '5d6eada0-0741-4c75-955e-6a17d7763b87',
      timestamp: '2023-12-06T13:07:51.341Z',
      type: 'Refund',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 2000,
        fractionDigits: 2,
      },
      state: 'Initial',
    },
    {
      id: 'f36a4729-9eb3-454f-9257-da3964405254',
      timestamp: '2023-12-06T13:08:11.728Z',
      type: 'Refund',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 2000,
        fractionDigits: 2,
      },
      interactionId: '7018680726606510103955',
      state: 'Success',
    },
    {
      id: '73f17824-1cc5-4cbf-8204-da26829453bc',
      timestamp: '2023-12-07T06:30:12.288Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 1000,
        fractionDigits: 2,
      },
      state: 'Initial',
    },
    {
      id: 'b85c1cb7-0bbb-4c6b-ac11-63c0f5e86f02',
      timestamp: '2023-12-07T06:30:27.358Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 1000,
        fractionDigits: 2,
      },
      interactionId: '7019306136406400803955',
      state: 'Success',
    },
    {
      id: 'c2f30bfc-f0a3-45ec-8a97-2304018904d3',
      timestamp: '2023-12-07T06:31:29.037Z',
      type: 'Refund',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 1000,
        fractionDigits: 2,
      },
      state: 'Initial',
    },
    {
      id: 'a06bad98-d728-40b8-9ed6-e5d7cb2e8f9c',
      timestamp: '2023-12-07T06:33:00.879Z',
      type: 'Refund',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 1000,
        fractionDigits: 2,
      },
      interactionId: '7019306899606591603954',
      state: 'Success',
    },
  ],
  interfaceInteractions: [],
  anonymousId: 'ad4acd03-8ada-4b90-9d2d-6eb7a611e213',
};

 const customerCardTokens = {
  customerTokenId: '',
  paymentInstrumentId: '',
};

 const retrieveSyncResponseTransactionElement: any = {
  id: '7077198716926378103955',
  submitTimeUtc: '2024-02-12T06:37:51Z',
  merchantId: 'visa_isv_opencart_pmt_dm',
  applicationInformation: {
    reasonCode: '100',
    rCode: '1',
    rFlag: 'SOK',
    applications: [
      {
        name: 'ics_auth',
        reasonCode: '100',
        rCode: '1',
        rFlag: 'SOK',
        reconciliationId: '74986830LRZD8MPI',
        rMessage: 'Request was processedsuccessfully.',
        returnCode: 1010000,
      },
    ],
  },
  buyerInformation: {},
  clientReferenceInformation: {
    code: '16ecff99-397e-4248-9776-fb34cd8c4e91',
    applicationName: 'REST API',
    partner: {
      solutionId: '42EA2Y58',
    },
  },
  consumerAuthenticationInformation: {
    eciRaw: '7',
  },
  deviceInformation: {
    ipAddress: '223.186.21.112',
  },
  errorInformation: {},
  fraudMarkingInformation: {},
  merchantInformation: {
    resellerId: 'cybs_plugins',
  },
  orderInformation: {
    billTo: {
      firstName: 'john',
      lastName: 'P',
      address1: '1295 road',
      email: 'sp@gmail.com',
      country: 'US',
    },
    shipTo: {
      firstName: 'john',
      lastName: 'P',
      address1: '1295 road',
      country: 'US',
    },
    amountDetails: {
      totalAmount: '45.00',
      currency: 'USD',
    },
  },
  paymentInformation: {
    paymentType: {
      type: 'credit card',
      method: 'VI',
    },
    customer: {},
    card: {
      suffix: '1111',
      prefix: '411111',
      type: '001',
    },
  },
  processingInformation: {
    commerceIndicator: '7',
    commerceIndicatorLabel: 'internet',
  },
  processorInformation: {
    processor: {
      name: 'smartpay',
    },
    approvalCode: '888888',
  },
  pointOfSaleInformation: {
    terminalId: '123456',
    partner: {},
    emv: {},
  },
  riskInformation: {
    providers: {},
  },
  _links: {
    transactionDetail: {
      href: 'https://apitest.cybersource.com/tss/v2/transactions/7077198716926378103955',
      method: 'GET',
    },
  },
};

 const retrieveSyncAmountDetailsApplicationResponse = {
  authPresent: true,
  authReasonCodePresent: true,
  capturePresent: false,
  captureReasonCodePresent: false,
  authReversalPresent: false,
  refundPresent: false,
};

 const retrieveAddRefundResponseObjectTransaction = {
  id: '21f9e6e5-4851-496d-ad9d-dc78f4d9645a',
  timestamp: '2024-02-12T12:11:52.422Z',
  type: 'Charge',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 2000,
    fractionDigits: 2,
  },
  interactionId: '7077398800576759503955',
  state: 'Success',
  custom: {
    type: {
      typeId: 'type',
      id: '665ddfd2-fb8c-4f47-b53e-4535e0bf5562',
    },
    fields: {
      isv_availableCaptureAmount: 1700,
    },
  },
};

 const retrieveAddRefundResponseObjectTransactionWithNoCustom = {
  id: '21f9e6e5-4851-496d-ad9d-dc78f4d9645a',
  timestamp: '2024-02-12T12:11:52.422Z',
  type: 'Charge',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 2000,
    fractionDigits: 2,
  },
  interactionId: '7077398800576759503955',
  state: 'Success',
};

 const captureResponse = {
  id: '21f9e6e5-4851-496d-ad9d-dc78f4d9645a',
  timestamp: '2024-02-12T12:11:52.422Z',
  type: 'Charge',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 2000,
    fractionDigits: 2,
  },
  interactionId: '7077398800576759503955',
  state: 'Success',
  custom: {
    type: {
      typeId: 'type',
      id: '665ddfd2-fb8c-4f47-b53e-4535e0bf5562',
    },
    fields: {
      isv_availableCaptureAmount: 900,
    },
  },
};

 const customFields = {
  isv_deviceFingerprintId: 'acc334ea-a883-4280-98de-6be782780ae7',
  isv_token:
    'eyJraWQiOiIwOHZhTlBiWXRqTTNRTHhOUkxPU0Mzejc2bjhSUVFPbCIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA4IiwiZXhwIjoxNzA3ODkxNjczLCJ0eXBlIjoibWYtMi4wLjAiLCJpYXQiOjE3MDc4OTA3NzMsImp0aSI6IjFFNFY2U05WN0JRRzNGNEJOVEo5VkE5QTVXNlFBWkxIOUNZUzVFR0JBMDVWVVFWWkJVNkE2NUNDNUJEOTE0NUUiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAzMiJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTExMSIsImJpbiI6IjQxMTExMSJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwMSJ9fX19fQ.MftUQ5bugFPilh3YLyHuPpuRhwdTRHt0C13gjNBwIRTe8s8CbS_lACIMdQycd8VB1gXfbnsuEbbWp_iUjjdOlrYb5fBI5ogLX1rcZGCagu-NUWcCm1AASOc43dJTdq3xYdAqgFaJ5LqjXQiHaofTtSgZjV-f-9VQ5JD5T9LUsEmkTgULY1fUrPjBd4_ZrQJDFX-rt3f3hD3DYclrgKfVD5MeCayvPQjQOlKoAX6UwJujC-7LQ65UVi-sCxiUNNSNvTNDPvrFnBD5VUYEIif986A2NryhJ6qC7yYGTL4y71589Qf5mjyqFsFWFzhRmjh9WnnftbxuU4PFFu9Qs030qQ',
  isv_customerIpAddress: '106.206.73.122',
  isv_maskedPan: '411111XXXXXXXXXXXX1111',
  isv_cardExpiryMonth: '01',
  isv_deviceDataCollectionUrl: 'https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect',
  isv_cardinalReferenceId: '62ddd38a-e58f-4495-90e0-c12f54ba4b9a',
  isv_requestJwt:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YWZlM2U4MS1jYWQzLTRlOTMtOGIzNS04ODY2ZWE3NzQ1NDEiLCJpYXQiOjE3MDc4OTA3NzYsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTcwNzg5NDM3NiwiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUmVmZXJlbmNlSWQiOiI2MmRkZDM4YS1lNThmLTQ0OTUtOTBlMC1jMTJmNTRiYTRiOWEifQ.WI3G4_jDLbKyc_J0wI3j-A9YDhqcGtlfBdRDrtRqMPE',
  isv_tokenCaptureContextSignature:
    'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI2RVAzYldPTHdqMWUzM3h2WWpoeWVoQUFFRmo3Q1VJWkZ0cU1VZCtCazRLL3B0VFJiTmNJMmRLTld6TGJXWk42ZWt5dHRnUVVTbXMrZXB5MUpKNUpUQXpYUmFVeE1HSU00c01HUVBBM0dFRnBmNWw4U0hsa1o0V1Q1VldaN3JJeGFUWVIiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJsbFZrVEo2bEMwZW52Q24xNldQU21waXM2QU9pZ0pITVNBUGdyUnN1b1NGd0hKT2pkQU82dUNHaVRJSWJTdkt5aU9lR0tfUGo5c0JTdG9PZkx1Q0pUY2Z3X1pQa09sYWNPWUV5bkZBalRsY2txWmZhanBfWUdKbXhjRkQ5NWk5NTYxTXdhazhpeU43SlFkQks5Q3Y1bFNQSGVoVDJRYUdXVDN2ZWhpUk4zeEJlUEpUd1JELTluckozY0dLU0ZzM19kUWl3SmNnZUs4WFJPQ28xZlBmdVJCMjhhMkhDcmRLRHFWUE5NdVlKRk00QVpESjg4VjZaOFlXZnhBNTB2RFcyd2Vzc0NueDZHR2lDUjFORGJrYklKNGhyVVVxeFVEUGMzeE5vQlBuU0lEcUw3RjVzSWFMaGFLVUpQUlB1ZnNSbk1wbVBHRkczUnR2RzJ6czVtQjl4RHciLCJraWQiOiIwOHZhTlBiWXRqTTNRTHhOUkxPU0Mzejc2bjhSUVFPbCJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiLCJNQUVTVFJPIiwiQ0FSVEVTQkFOQ0FJUkVTIiwiQ1VQIiwiSkNCIiwiRElORVJTQ0xVQiIsIkRJU0NPVkVSIl0sInRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgyIiwiaHR0cHM6Ly9ibzItY3QuaXN2cGx1Z2lucy5jb20iLCJodHRwOi8vbG9jYWxob3N0OjgwODAiXSwibWZPcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSJ9LCJ0eXBlIjoibWYtMi4wLjAifV0sImlzcyI6IkZsZXggQVBJIiwiZXhwIjoxNzA3ODkxNjU5LCJpYXQiOjE3MDc4OTA3NTksImp0aSI6IkNYTHNKbmh2MXBuc3QyRzgifQ.ZUskT8srDKxseuNquexSgrwZ2LF692GFd8WVUY40g1zUqeg7gF52ZA0oF0Wzd7SCgzC6iM_nt_OAfheLOA64VG8XF9V_xmuZwdnDn9Lbh43FgbgbyE9qbVxU0pv4XtXxkG02pNnvuv0L7dF4_zCCgoiB0Ur1ZyX8axc6MwpSEQp-2_rS8L6QJpFZMbVZgbQ8sa_3G3AFM2dQ_4mCMVUcDRKGISicUPiIwr4IvyttARrb8UeJmYdebOsA1s8Bvl241UUqb_YCqdb1XNR7tar1Nzr2RxBCE2VnZVS1m2-LIo89aQW2dsN4QzUBRCXdghxFhmoseFDnXhcIgi_LzB2IwA',
  isv_cardExpiryYear: '2032',
  isv_merchantId: '',
  isv_saleEnabled: false,
  isv_tokenAlias: '41111111',
  isv_acceptHeader: '*/*',
  isv_cardType: '001',
  isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  isv_tokenVerificationContext:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI2RVAzYldPTHdqMWUzM3h2WWpoeWVoQUFFRmo3Q1VJWkZ0cU1VZCtCazRLL3B0VFJiTmNJMmRLTld6TGJXWk42ZWt5dHRnUVVTbXMrZXB5MUpKNUpUQXpYUmFVeE1HSU00c01HUVBBM0dFRnBmNWw4U0hsa1o0V1Q1VldaN3JJeGFUWVIiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJsbFZrVEo2bEMwZW52Q24xNldQU21waXM2QU9pZ0pITVNBUGdyUnN1b1NGd0hKT2pkQU82dUNHaVRJSWJTdkt5aU9lR0tfUGo5c0JTdG9PZkx1Q0pUY2Z3X1pQa09sYWNPWUV5bkZBalRsY2txWmZhanBfWUdKbXhjRkQ5NWk5NTYxTXdhazhpeU43SlFkQks5Q3Y1bFNQSGVoVDJRYUdXVDN2ZWhpUk4zeEJlUEpUd1JELTluckozY0dLU0ZzM19kUWl3SmNnZUs4WFJPQ28xZlBmdVJCMjhhMkhDcmRLRHFWUE5NdVlKRk00QVpESjg4VjZaOFlXZnhBNTB2RFcyd2Vzc0NueDZHR2lDUjFORGJrYklKNGhyVVVxeFVEUGMzeE5vQlBuU0lEcUw3RjVzSWFMaGFLVUpQUlB1ZnNSbk1wbVBHRkczUnR2RzJ6czVtQjl4RHciLCJraWQiOiIwOHZhTlBiWXRqTTNRTHhOUkxPU0Mzejc2bjhSUVFPbCJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiLCJNQUVTVFJPIiwiQ0FSVEVTQkFOQ0FJUkVTIiwiQ1VQIiwiSkNCIiwiRElORVJTQ0xVQiIsIkRJU0NPVkVSIl0sInRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgyIiwiaHR0cHM6Ly9ibzItY3QuaXN2cGx1Z2lucy5jb20iLCJodHRwOi8vbG9jYWxob3N0OjgwODAiXSwibWZPcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSJ9LCJ0eXBlIjoibWYtMi4wLjAifV0sImlzcyI6IkZsZXggQVBJIiwiZXhwIjoxNzA3ODkxNjU5LCJpYXQiOjE3MDc4OTA3NTksImp0aSI6IkNYTHNKbmh2MXBuc3QyRzgifQ.8JHhM4JcSmdPFQE87BdosLhqrC8PWB4aAOLpxXQekHM',
};

 const getPresentApplications = [
  {
    name: 'ics_auth',
    reasonCode: '100',
    rCode: '1',
    rFlag: 'SOK',
    reconciliationId: '74986830LRZD8MPI',
    rMessage: 'Request was processedsuccessfully.',
    returnCode: 1010000,
  },
];

 const tokenResponse = {
  notSaveToken: false,
  isError: false,
};

 const authResponse = {
  actions: [
    {
      action: 'setCustomField',
      name: 'isv_payerEnrollTransactionId',
      value: '7079852003866499403954',
    },
    {
      action: 'setCustomField',
      name: 'isv_payerEnrollHttpCode',
      value: 201,
    },
    {
      action: 'setCustomField',
      name: 'isv_payerEnrollStatus',
      value: 'AUTHORIZED',
    },
    {
      action: 'setCustomField',
      name: 'isv_payerAuthenticationTransactionId',
      value: 'n3BiaWvAy8aFyXQkt8A0',
    },
    {
      action: 'setCustomField',
      name: 'isv_tokenCaptureContextSignature',
      value: null,
    },
    {
      action: 'setCustomField',
      name: 'isv_payerAuthenticationRequired',
      value: false,
    },
  ],
  errors: [],
};

 const handleAuthApplication = {
  name: 'ics_auth',
  reasonCode: '100',
  rCode: '1',
  rFlag: 'SOK',
  reconciliationId: '4102993266',
  rMessage: 'Request was processed successfully.',
  returnCode: 1010000,
};

 const handleAuthReversalResponseUpdateActions = {
  actions: [
    {
      action: 'changeTransactionInteractionId',
      interactionId: '7079961643916103303955',
      transactionId: '788ace83-ffbe-478d-935e-ce5337424124',
    },
    {
      action: 'changeTransactionState',
      state: 'Failure',
      transactionId: '788ace83-ffbe-478d-935e-ce5337424124',
    },
    {
      action: 'setCustomField',
      name: 'isv_tokenCaptureContextSignature',
      value: null,
    },
    {
      action: 'addTransaction',
      transaction: {
        amount: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 36000,
          fractionDigits: 2,
        },
        state: 'Success',
        type: 'Authorization',
        interactionId: '7079961643916103303955',
        timestamp: '2024-02-15T11:22:51.120Z',
      },
    },
  ],
  errors: [],
};

 const processTokensCustomerCardTokensObject = {
  customerTokenId: '116C393967840ACDE063AF598E0ADE72',
  paymentInstrumentId: '116C475A535C411BE063AF598E0A3DC8',
};

 const processTokensCustomerInvalidCardTokensObject = {
  customerTokenId: '@#%^@RW^Y&',
  paymentInstrumentId: '&YY#&DBGV(I',
};

 const processTokensInstrumentIdentifier = '703000000002660108812';

 const searchSubscriptionResponse = {
  httpCode: 200,
  webhookId: '1208e4c6-fb85-94d8-e063-9c588e0a4bf0',
  webhookUrl: 'https://iyi6rylvc8.execute-api.us-east-1.amazonaws.com/netTokenNotification',
};

 const invalidSearchSubscriptionResponse = {
  httpCode: 404,
  webhookId: '',
  webhookUrl: '',
};

 const invalidSubscriptionResponse = {
  httpCode: 0,
  webhookId: '@*&^@&*U@*',
  webhookUrl: '(@*^&(!@&^',
};

 const createTransactionPaymentFailure = {
  action: 'addInterfaceInteraction',
  type: { 
    key: 'isv_payment_failure' 
  },
  fields: {
    reasonCode: '400',
    transactionId: 'fada81af-f217-4279-ab08-1bd1300c19d8'
  }
} 

 const createTransactionSetCustomType = {
  action: 'setTransactionCustomType',
  type: { 
    key: 'isv_transaction_data', 
    typeId: 'type' 
  },
  fields: { 
    isv_availableCaptureAmount: 0 
  },
  transactionId: '1e53fc0c-1109-4850-bd75-41da1b1108a5'
}

export default {
  visaCardDetailsActionVisaCheckoutData,
  visaCardDetailsActionVisaCheckoutEmptyData,
  getOMServiceResponsePaymentResponse,
  getOMServiceResponsePaymentResponseObject,
  getOMServiceResponseTransactionDetail,
  getAuthResponsePaymentResponse,
  getAuthResponsePaymentResponseObject,
  getAuthResponsePaymentDeclinedResponse,
  getAuthResponseTransactionDetail,
  getAuthResponsePaymentSuccessResponse,
  getAuthResponsePaymentCompleteResponse,
  getAuthResponsePaymentPendingResponse,
  getCapturedAmountRefundPaymentObj,
  getCapturedZeroAmountRefundPaymentObj,
  payerAuthActionsResponse,
  payerAuthActionsEmptyResponse,
  payerEnrollActionsResponse,
  payerEnrollActionsUpdatePaymentObj,
  getUpdateTokenActionsActions,
  getUpdateInvalidTokenActionsActions,
  deleteTokenResponse,
  deleteTokenCustomerObj,
  getAuthorizedAmountCapturePaymentObj,
  getAuthorizedZeroAmountCapturePaymentObj,
  getRefundResponseUpdatePaymentObj,
  getRefundResponseUpdateTransactions,
  addRefundActionAmount,
  addRefundActionZeroAmount,
  addRefundActionOrderResponse,
  state,
  getCreditCardResponseUpdatePaymentObj,
  getCreditCardResponseCartObj,
  getGooglePayResponseUpdatePaymentObj,
  getClickToPayResponseUpdatePaymentObj,
  tokenCreateFlagCustomerInfo,
  tokenCreateFlagPaymentObj,
  tokenCreateFlagFunctionName,
  createResponseSetTransaction,
  createTransactionSetCustomField,
  createTransactionSetFailedCustomField,
  getTransactionSummariesUpdatePaymentObj,
  checkAuthReversalTriggeredPaymentResponse,
  checkAuthReversalTriggeredUpdateActions,
  runSyncAddTransactionSyncUpdateObject,
  runSyncAddTransactionSyncUpdateEmptyObject,
  runSyncUpdateCaptureAmountUpdatePaymentObj,
  customerCardTokens,
  retrieveSyncResponseTransactionElement,
  retrieveSyncAmountDetailsApplicationResponse,
  retrieveAddRefundResponseObjectTransaction,
  retrieveAddRefundResponseObjectTransactionWithNoCustom,
  captureResponse,
  customFields,
  getPresentApplications,
  tokenResponse,
  authResponse,
  handleAuthApplication,
  handleAuthReversalResponseUpdateActions,
  processTokensCustomerCardTokensObject,
  processTokensCustomerInvalidCardTokensObject,
  processTokensInstrumentIdentifier,
  searchSubscriptionResponse,
  invalidSearchSubscriptionResponse,
  invalidSubscriptionResponse,
  createTransactionPaymentFailure,
  createTransactionSetCustomType
}