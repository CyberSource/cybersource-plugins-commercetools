import { CardAddressGroupType } from '../../types/Types';
import creditCard from '../JSON/creditCard.json';
import unit from '../JSON/unit.json';

let visaCardDetailsActionVisaCheckoutData: any = {
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

const visaCardDetailsActionVisaCheckoutEmptyData: Partial<CardAddressGroupType> = {
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
        streetNumber: '',
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
        streetNumber: '',
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
let payerEnrollActionsUpdatePaymentObj: any = {
    id: unit.paymentId,
    version: 15,
    customer: { id: '5917bbf8-2b3a-4934-9dcc-cbda0778719f' },
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

const getUpdateInvalidTokenActionsActions = ['*@&*&*(*(&^%^', '%^&(&*&^%&((('];

const deleteTokenResponse = {
    httpCode: 204,
    message: '',
    deletedToken: 'DC2417E36C42D8ADE053AF598E0A1705',
};

const deleteTokenCustomerObj: any = {
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
            id: '5917bbf8-2b3a-4934-9dcc-cbda0778719f',
        },
    },
    createdBy: {
        clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
        isPlatformClient: false,
        customer: {
            typeId: 'customer',
            id: '5917bbf8-2b3a-4934-9dcc-cbda0778719f',
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
            id: '',
        },
    },
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
    "id": "32bbfe26-ba80-430d-968d-4060c92db3aa",
    "version": 41,
    "versionModifiedAt": "2025-05-29T11:29:41.762Z",
    "lastMessageSequenceNumber": 3,
    "createdAt": "2025-05-29T11:29:21.030Z",
    "lastModifiedAt": "2025-05-29T11:29:41.762Z",
    "lastModifiedBy": {
        "clientId": "ClKSqi1W4oIpuCSNLE0RMDH7",
        "isPlatformClient": false,
        "anonymousId": "1f93f788-42a9-4f4e-8832-9b546f7ffe1a"
    },
    "createdBy": {
        "clientId": "ClKSqi1W4oIpuCSNLE0RMDH7",
        "isPlatformClient": false,
        "anonymousId": "1f93f788-42a9-4f4e-8832-9b546f7ffe1a"
    },
    "amountPlanned": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 10450,
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
            "id": "10407153-9f92-48bb-a1c4-4fa99cb540ea"
        },
        "fields": {
            "isv_requestJwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NTNhYTc5Mi01N2U2LTQ2N2MtYTFiOS1jNDJhNmRiMjgyYWIiLCJpYXQiOjE3NDg1MTgxNzIsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTc0ODUyMTc3MiwiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUmVmZXJlbmNlSWQiOiI3NmZiYTNkOS1jNjU0LTQwNWItODA4Yi1hNDUwMjU1MmY5YTgifQ.Q_1YZjp7UNQMY8iOw4I9p_4JD3VnBtYs9MDvctrDYns",
            "isv_deviceFingerprintId": "8a31a8e1-e8a8-46e1-bfa1-3f7363c0d4f4",
            "isv_payerEnrollTransactionId": "7485181772476040104805",
            "isv_token": "eyJraWQiOiIwOGZtNG1MZm5odFp1YU5GalFLcXd4MjZQcEJiYWI2ZyIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA3IiwiZXhwIjoxNzQ4NTE5MDcxLCJ0eXBlIjoibWYtMi4xLjAiLCJpYXQiOjE3NDg1MTgxNzEsImp0aSI6IjFFM001QkRZUTZWNUpHRDI5TzZXVTA2WUROWjlRWFdBSzlVMllEU1ZRVUI3TlZBOTdWWEw2ODM4NDg5RjM5RkQiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAyOCJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTExMSJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwMSJ9fX19fQ.Wb6gLA2eOVJQLSAbGhV0dM6oJSG3cjOMWSv5MA5qdvc0cfqfVpps9zc_NMRBCFgvWDN2gBmQkFQcWTjVoQD3qCEJpGSM5eaCDkDpijRmOQw6hKKY2aRk8B3HHLv1qS-_9CLAQaHMrOmMYDrFr3Qwseiq6a-4U5MW_L8OXQB99GCx2RLfLG5Jtz_5wrfCwgXox2pIfjrz4a7ZQP9Kkr6BjOgMUHxFSvMC51GNGQRewEaoau7iT6ngDSQazbh21Xv_-U2mVAON0GQlIQKH0906q1_6Jo5m_DFmukvzJEtZLTPlKT6XMk_Of2haoLTmDOzCpPNNeVNARWLEjhrAUIoMXQ",
            "isv_CVVResponse": "3",
            "isv_maskedPan": "undefinedXXXXXXXXXXXX1111",
            "isv_AVSResponse": "1",
            "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
            "isv_responseCode": "00",
            "isv_payerAuthenticationTransactionId": "WcYrHRudtcyMsZxPHQD0",
            "isv_responseDateAndTime": "2025-05-29T11:29:37Z",
            "isv_payerAuthenticationRequired": false,
            "isv_ECI": "vbv",
            "isv_deviceDataCollectionUrl": "https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect",
            "isv_cardinalReferenceId": "76fba3d9-c654-405b-808b-a4502552f9a8",
            "isv_cardExpiryYear": "2028",
            "isv_merchantId": "",
            "isv_saleEnabled": false,
            "isv_screenHeight": 720,
            "isv_payerEnrollHttpCode": 201,
            "isv_shippingMethod": "lowcost",
            "isv_acceptHeader": "*/*",
            "isv_screenWidth": 1280,
            "isv_cardType": "001",
            "isv_payerEnrollStatus": "AUTHORIZED",
            "isv_customerIpAddress": "192.168.1.1",
            "isv_authorizationStatus": "AUTHORIZED",
            "isv_cardExpiryMonth": "01",
            "isv_dmpaFlag": false,
            "isv_userAgentHeader": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0",
            "isv_tokenVerificationContext": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsInRyYW5zaWVudFRva2VuUmVzcG9uc2VPcHRpb25zIjp7ImluY2x1ZGVDYXJkUHJlZml4IjpmYWxzZX0sImRhdGEiOiJIVDVxVkliNXIzeU9jT05BVUZDeDVoQUFFTVdTeVZEWjVhQlFkbWZEMmMxMnI5OFVYY3ZMOHRNenFWUGNnWW45cEp5Tk1pZUw0NE9KVmd6c0dua2F1MVhkSmg4Mlg2RkVvZG1MRTgxRDNwNUtoZ0s1YmlETXBJaU03WG1sTzcrUFVCaGkiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJta0tUVVVaOXp6ZE1IeFl4QmpYZUZhWlhXYmswOFkzRFRSRDIzeS1FZ3BXZHRxbXZHVWptQlFRWGVFb2ZQX2tHM25UWkpxN1c1MDJuZTdiN1B0YzBKRGhtYXl0Y2ZDRGJobUtMMHI2LUluQnl4eGFVLUlubDdPZVJvSnZzcldZZWFOVEExOC1NNlMwbkloVGZscGdkR3hTRENDai1IR2ZXSVNDLTlQLXBJT1JFaE1vLWpVaVk0bGNuUG1vd0dNNEpFdzhPYnFUUHdFQkU0LTMzRzJHYVlza1VTcTBydzFqWEVlT1VWbnByVWh5UzVqWW12ajdUaXlfZGxJZzQyU2RiNzM3ZC1na1p4Y1JHWXk2WnhDRDJzVlpvU2l2X1lteklXMElrVE1HWDcwc0FCdEZPY0RNb2YzbFRtb0pnbHVWWktpZXVraXg3ZzlvMmIwcWVpWjB2eHciLCJraWQiOiIwOGZtNG1MZm5odFp1YU5GalFLcXd4MjZQcEJiYWI2ZyJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnlJbnRlZ3JpdHkiOiJzaGEyNTYtNGtxcmNKTExuRGJLTStOYW9uYXhVZzhSV3A4Tm10bmpRbzdQSmNXckx6Zz0iLCJjbGllbnRMaWJyYXJ5IjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20vbWljcm9mb3JtL2J1bmRsZS92Mi42LjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkpDQiJdLCJ0YXJnZXRPcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJdLCJtZk9yaWdpbiI6Imh0dHBzOi8vdGVzdGZsZXguY3liZXJzb3VyY2UuY29tIiwiYWxsb3dlZFBheW1lbnRUeXBlcyI6WyJDQVJEIl19LCJ0eXBlIjoibWYtMi4xLjAifV0sImlzcyI6IkZsZXggQVBJIiwiZXhwIjoxNzQ4NTE5MDYwLCJpYXQiOjE3NDg1MTgxNjAsImp0aSI6Ino4dlIyT1hlZ3dZeEtDdGQifQ.c63biYMwlLsH-cFnZgEAZvGvsfd3BkSxxURYupBB7aI"
        }
    },
    "paymentStatus": {},
    "transactions": [
        {
            "id": "a85913b2-8a51-4996-b2bd-098ef3d1a451",
            "timestamp": "2025-05-29T11:29:40.853Z",
            "type": "Authorization",
            "amount": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 10450,
                "fractionDigits": 2
            },
            "interactionId": "7485181772476040104805",
            "state": "Success"
        }
    ],
    "interfaceInteractions": [],
    "anonymousId": "1f93f788-42a9-4f4e-8832-9b546f7ffe1a"
};

const getCreditCardResponseCartObj = {
    type: "Cart",
    id: "9c054cc1-4f91-4f3d-8b2f-d37ada448b36",
    version: 15,
    versionModifiedAt: "2025-05-28T13:09:43.794Z",
    lastMessageSequenceNumber: 1,
    createdAt: "2025-05-28T13:08:52.111Z",
    lastModifiedAt: "2025-05-28T13:09:43.794Z",
    lastModifiedBy: {
        clientId: "ClKSqi1W4oIpuCSNLE0RMDH7",
        isPlatformClient: false,
        anonymousId: "1f93f788-42a9-4f4e-8832-9b546f7ffe1a"
    },
    createdBy: {
        clientId: "ClKSqi1W4oIpuCSNLE0RMDH7",
        isPlatformClient: false,
        anonymousId: "1f93f788-42a9-4f4e-8832-9b546f7ffe1a"
    },
    anonymousId: "1f93f788-42a9-4f4e-8832-9b546f7ffe1a",
    locale: "en",
    lineItems: [
        {
            id: "5c411952-3985-4e6f-9c84-60d3c24ed3a1",
            productId: "48cc2295-e5c8-4dfe-840b-4f1356e68097",
            name: {
                "en": "Dress",
                "de": "Dress",
                "de-DE": "Dress",
                "en-US": "Dress"
            },
            productType: {
                typeId: "product-type",
                id: "7fe70d2e-1537-4a65-ba12-48052b3066e9",
                version: 1
            },
            productSlug: {
                "en": "SKU-W52",
                "de-DE": "SKU-W52",
                "en-US": "SKU-W52"
            },
            variant: {
                id: 1,
                sku: "SKU-W52",
                prices: [
                    {
                        id: "49c20b21-1440-4f61-94f8-ff1883d39cfb",
                        value: {
                            type: "centPrecision",
                            currencyCode: "USD",
                            centAmount: 9460,
                            fractionDigits: 2
                        },
                        country: "US"
                    },
                    {
                        id: "6fe2048e-79d4-4223-9cf0-ea440307a495",
                        value: {
                            type: "centPrecision",
                            currencyCode: "EUR",
                            centAmount: 4550,
                            fractionDigits: 2
                        },
                        country: "DE"
                    }
                ],
                images: [
                    {
                        url: "https://th.bing.com/th/id/OIP.xP20EfW1OxvrVc2roj5hgwHaHa?rs=1&pid=ImgDetMain",
                        dimensions: {
                            w: 300,
                            h: 375
                        }
                    }
                ],
                attributes: [],
                assets: []
            },
            price: {
                id: "49c20b21-1440-4f61-94f8-ff1883d39cfb",
                value: {
                    type: "centPrecision",
                    currencyCode: "USD",
                    centAmount: 9460,
                    fractionDigits: 2
                },
                country: "US"
            },
            quantity: 1,
            discountedPricePerQuantity: [],
            taxRate: {
                name: "test-tax-category",
                amount: 0.2,
                includedInPrice: true,
                country: "US",
                id: "HHLJRvE9",
                subRates: []
            },
            perMethodTaxRate: [],
            addedAt: "2025-05-28T13:08:52.449Z",
            lastModifiedAt: "2025-05-28T13:08:52.449Z",
            state: [
                {
                    "quantity": 1,
                    "state": {
                        "typeId": "state",
                        "id": "34c13bc4-6bb6-4f83-87e9-a71c471e8124"
                    }
                }
            ],
            "priceMode": "Platform",
            "lineItemMode": "Standard",
            "totalPrice": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 9460,
                "fractionDigits": 2
            },
            "taxedPrice": {
                "totalNet": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 7883,
                    "fractionDigits": 2
                },
                "totalGross": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 9460,
                    "fractionDigits": 2
                },
                "taxPortions": [
                    {
                        "rate": 0.2,
                        "amount": {
                            "type": "centPrecision",
                            "currencyCode": "USD",
                            "centAmount": 1577,
                            "fractionDigits": 2
                        },
                        "name": "test-tax-category"
                    }
                ],
                "totalTax": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 1577,
                    "fractionDigits": 2
                }
            },
            "taxedPricePortions": []
        }
    ],
    "cartState": "Active",
    "totalPrice": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 10450,
        "fractionDigits": 2
    },
    "taxedPrice": {
        "totalNet": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 8708,
            "fractionDigits": 2
        },
        "totalGross": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 10450,
            "fractionDigits": 2
        },
        "taxPortions": [
            {
                "rate": 0.2,
                "amount": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 1742,
                    "fractionDigits": 2
                },
                "name": "test-tax-category"
            }
        ],
        "totalTax": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 1742,
            "fractionDigits": 2
        }
    },
    "country": "US",
    "taxedShippingPrice": {
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
        "taxPortions": [
            {
                "rate": 0.2,
                "amount": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 165,
                    "fractionDigits": 2
                },
                "name": "test-tax-category"
            }
        ],
        "totalTax": {
            "type": "centPrecision",
            "currencyCode": "USD",
            "centAmount": 165,
            "fractionDigits": 2
        }
    },
    "shippingMode": "Single",
    "shippingInfo": {
        "shippingMethodName": "DHL",
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
            "id": "HHLJRvE9",
            "subRates": []
        },
        "taxCategory": {
            "typeId": "tax-category",
            "id": "5fc0cd72-d76a-47d8-9ec2-04b700e1ac5c"
        },
        "deliveries": [],
        "shippingMethod": {
            "typeId": "shipping-method",
            "id": "9d98ffea-42e0-441a-9116-9c347e98592f"
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
            "taxPortions": [
                {
                    "rate": 0.2,
                    "amount": {
                        "type": "centPrecision",
                        "currencyCode": "USD",
                        "centAmount": 165,
                        "fractionDigits": 2
                    },
                    "name": "test-tax-category"
                }
            ],
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
        "firstName": "test",
        "lastName": "t",
        "streetName": "1295 Charleston Road, 7th Lane",
        "additionalStreetInfo": "",
        "postalCode": "94043",
        "city": "Mountain view",
        "region": "CA",
        "country": "US",
        "phone": "9823454321",
        "email": "test@gmail.com"
    },
    "shipping": [],
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
    "billingAddress": {
        "firstName": "test",
        "lastName": "t",
        "streetName": "1295 Charleston Road, 7th Lane",
        "additionalStreetInfo": "",
        "postalCode": "94043",
        "city": "Mountain view",
        "region": "CA",
        "country": "US",
        "phone": "9823454321",
        "email": "test@gmail.com"
    },
    "itemShippingAddresses": [],
    "discountTypeCombination": {
        "type": "Stacking"
    },
    "totalLineItemQuantity": 1
};
const getCreditCardResponseUpdateTransactions = {};

const getGooglePayResponseUpdatePaymentObj = {
    "id": "d85e7509-c9f7-4350-b075-168bc57a83fb",
    "version": 11,
    "versionModifiedAt": "2025-05-29T07:07:12.409Z",
    "lastMessageSequenceNumber": 3,
    "createdAt": "2025-05-29T07:07:08.194Z",
    "lastModifiedAt": "2025-05-29T07:07:12.409Z",
    "lastModifiedBy": {
        "clientId": "qMwfMIjiZVdOY3cocI8UKyix",
        "isPlatformClient": false,
        "anonymousId": "f30696fc-1b1b-4bf7-aac7-e1c14741ae22"
    },
    "createdBy": {
        "clientId": "qMwfMIjiZVdOY3cocI8UKyix",
        "isPlatformClient": false,
        "anonymousId": "f30696fc-1b1b-4bf7-aac7-e1c14741ae22"
    },
    "amountPlanned": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 10450,
        "fractionDigits": 2
    },
    "paymentMethodInfo": {
        "paymentInterface": "cybersource",
        "method": "googlePay",
        "name": {
            "en": "Google Pay"
        }
    },
    "custom": {
        "type": {
            "typeId": "type",
            "id": "4ba2cb73-2318-409d-bcdc-2be266730733"
        },
        "fields": {
            "isv_deviceFingerprintId": "e7509057-33ef-41d5-8614-35396a47634b",
            "isv_token": "eyJzaWduYXR1cmUiOiJNRVFDSUNXaWhYUmx0dHl2M21oMXNRRGxtSDcwNzB4Q1RWUlRZS3ZSd0liZkwxb0lBaUFMVFJTWmFJNXAyUUhIbmJ2UzRxT0Z1dVgzcSsvd3dsUzRUZTZsOFRoK0NnXHUwMDNkXHUwMDNkIiwicHJvdG9jb2xWZXJzaW9uIjoiRUN2MSIsInNpZ25lZE1lc3NhZ2UiOiJ7XCJlbmNyeXB0ZWRNZXNzYWdlXCI6XCJxQWVtdUtGNkRPT0QyMGd4bGJROWVaRSt1dmJDeTllOUd6U2RzSytrZnhaS1JkTlkzQWRSejR1cm1WMWZ2d1hVZ0pmL2pqRE5FNEFSYlU1R3RwRVRWZ25NMCtOM1pLK0M5NWxSem9CS0ttUDcxUFF5L2c2b1NTLzZJbFhjTzBUWVIzSmpNRWJYZWZrVGEyNlIzOEpnL3dQWnkzREZwbWZXdHFLNmVCdFl5NytlMTQ3VkJWSVhudjVMVnlwRjVBeENWTUtPWDZFNmpkeGpjU3BEN2FGOVlrbkJYRnJFcDFtRUF2NXFsZjdCSVY0bGJXSlhxRHdxUnlFM0pwVjNyYzNEV1ZCbG1IUWx5M1IreFBlNENWKzFMeFZYYTFLdUpZRitKMHpjamdFeU80bGlTTmZPMVdxZ2UzWk11OVprb2s1ZFBnQks0RVA0N2pka0NGakdjT093aHdjWFZnTEcyb01mZStqNVA3Ti9lT0JRK1pHSkpGUEI3UGYxT0hwUWtibVhwRmhQdHpPeFNBc0hmR2hnVGoxUXlDazZMWGc5YWJTUjFqMnMreEVcXHUwMDNkXCIsXCJlcGhlbWVyYWxQdWJsaWNLZXlcIjpcIkJHVWZ5YlB2QmpMMXRQakZYSnJjeGR3OFNvSjJIb1hvUXJpTFdHb2NpMnFMR1E2MXVXZkhwQ2o3WkJ0RktadW4wMkVzbUZ2TzhkN2g0bTZ5T1NPT3VRUVxcdTAwM2RcIixcInRhZ1wiOlwiOEhrOGE5b1dxZjdGR0hBTUFoUFdWcjIvNTZKSWpkT0k3dXFLQzg3U29lMFxcdTAwM2RcIn0ifQ==",
            "isv_saleEnabled": false,
            "isv_shippingMethod": "Lowcost",
            "isv_customerIpAddress": "192.168.1.1",
            "isv_AVSResponse": "1",
            "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
            "isv_responseCode": "00",
            "isv_responseDateAndTime": "2025-05-29T07:07:12Z",
            "isv_userAgentHeader": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
            "isv_cardExpiryYear": "2027",
            "isv_merchantId": "",
            "isv_acceptHeader": "*/*",
            "isv_cardType": "001",
            "isv_authorizationStatus": "AUTHORIZED",
            "isv_cardExpiryMonth": "01"
        }
    },
    "paymentStatus": {},
    "transactions": [
        {
            "id": "7edef04b-7729-4829-afa0-886c91597996",
            "timestamp": "2025-05-29T07:07:10.756Z",
            "type": "Authorization",
            "amount": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 10450,
                "fractionDigits": 2
            },
            "interactionId": "7485024317336847804805",
            "state": "Success"
        }
    ],
    "interfaceInteractions": [],
    "anonymousId": "f30696fc-1b1b-4bf7-aac7-e1c14741ae22"
};

const getApplePayResponseUpdatePaymentObj = {
    "id": "a8d08050-c76c-4c09-b711-fdf58774de6e",
    "version": 12,
    "versionModifiedAt": "2025-05-29T12:57:18.530Z",
    "lastMessageSequenceNumber": 3,
    "createdAt": "2025-05-29T12:57:04.213Z",
    "lastModifiedAt": "2025-05-29T12:57:18.530Z",
    "lastModifiedBy": {
        "clientId": "ClKSqi1W4oIpuCSNLE0RMDH7",
        "isPlatformClient": false,
        "anonymousId": "e4f35abe-bcb0-4a4c-b68e-9540cf474629"
    },
    "createdBy": {
        "clientId": "ClKSqi1W4oIpuCSNLE0RMDH7",
        "isPlatformClient": false,
        "anonymousId": "e4f35abe-bcb0-4a4c-b68e-9540cf474629"
    },
    "amountPlanned": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 9460,
        "fractionDigits": 2
    },
    "paymentMethodInfo": {
        "paymentInterface": "cybersource",
        "method": "applePay",
        "name": {
            "en": "Apple Pay"
        }
    },
    "custom": {
        "type": {
            "typeId": "type",
            "id": "10407153-9f92-48bb-a1c4-4fa99cb540ea"
        },
        "fields": {
            "isv_deviceFingerprintId": "7e3c1029-b491-4d83-a113-fa3de5361e5f",
            "isv_merchantId": "",
            "isv_token": "eyJkYXRhIjoicHFtVVRYTzc2c2JFcWpJTWJqaGlTWVRHOE53Yk9tYlArUkFmcmZKZzMwVlR2NUpvMzJzUEdMZ1hVcFFEWGhnTGlUSUduZ1cyS0tRbDU4K05DVk1qUnNKZDAyNXB6bGpqeFpMV3FDT2lRRWhsVFlicGYzR21hVW9xUFdTb2NCRWE3NTB6a0VTOGY3OXpBOEtRd2RDM3grOTJhM0hrQ1NhNTBPdERORGpkaUU0SlNyckExWndLZGNua2drcnoyK1VSR2RvWEZjSVlPNkdKbEJvbHluaFU3cWU5czlkSElrRE13WWhpRXI4aEl3SUpnOUFNbzBtK0VYMlUyWnMyNEtXOXRpdTk2SzhFbWV0SkZ6TDB1cGw5MXdjb21hMDJGUmNMSzNrMFFPeVlMTUFFT2k0TVVQWnBsZGhuUFlJYmd0dmRhdmpsdGJqTGxFNzJhS0RQZTlxenAyNklpcGt0cTc1M3NieEFVUXhhZlg4SDVJTFFiYS9QK0JyMFpkMVJXMHFlZS9TQUk5OUdkeUVYSm9zUmlYeFRkb2xIMFNIbGZHdWorNUV0TjVvdXRuND0iLCJzaWduYXR1cmUiOiJNSUFHQ1NxR1NJYjNEUUVIQXFDQU1JQUNBUUV4RFRBTEJnbGdoa2dCWlFNRUFnRXdnQVlKS29aSWh2Y05BUWNCQUFDZ2dEQ0NBK1F3Z2dPTG9BTUNBUUlDQ0ZuWW9ieXE5T1BOTUFvR0NDcUdTTTQ5QkFNQ01Ib3hMakFzQmdOVkJBTU1KVUZ3Y0d4bElFRndjR3hwWTJGMGFXOXVJRWx1ZEdWbmNtRjBhVzl1SUVOQklDMGdSek14SmpBa0JnTlZCQXNNSFVGd2NHeGxJRU5sY25ScFptbGpZWFJwYjI0Z1FYVjBhRzl5YVhSNU1STXdFUVlEVlFRS0RBcEJjSEJzWlNCSmJtTXVNUXN3Q1FZRFZRUUdFd0pWVXpBZUZ3MHlNVEEwTWpBeE9UTTNNREJhRncweU5qQTBNVGt4T1RNMk5UbGFNR0l4S0RBbUJnTlZCQU1NSDJWall5MXpiWEF0WW5KdmEyVnlMWE5wWjI1ZlZVTTBMVk5CVGtSQ1QxZ3hGREFTQmdOVkJBc01DMmxQVXlCVGVYTjBaVzF6TVJNd0VRWURWUVFLREFwQmNIQnNaU0JKYm1NdU1Rc3dDUVlEVlFRR0V3SlZVekJaTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEEwSUFCSUl3L2F2RG5QZGVJQ3hRMlp0RkV1WTM0cWtCM1d5ejRMSE5TMUpubVBqUFRyM29HaVdvd2g1TU05M09qaXFXd3Zhdm9aTURSY1RvZWtRbXpwVWJFcFdqZ2dJUk1JSUNEVEFNQmdOVkhSTUJBZjhFQWpBQU1COEdBMVVkSXdRWU1CYUFGQ1B5U2NSUGsrVHZKK2JFOWloc1A2SzcvUzVMTUVVR0NDc0dBUVVGQndFQkJEa3dOekExQmdnckJnRUZCUWN3QVlZcGFIUjBjRG92TDI5amMzQXVZWEJ3YkdVdVkyOXRMMjlqYzNBd05DMWhjSEJzWldGcFkyRXpNREl3Z2dFZEJnTlZIU0FFZ2dFVU1JSUJFRENDQVF3R0NTcUdTSWIzWTJRRkFUQ0IvakNCd3dZSUt3WUJCUVVIQWdJd2diWU1nYk5TWld4cFlXNWpaU0J2YmlCMGFHbHpJR05sY25ScFptbGpZWFJsSUdKNUlHRnVlU0J3WVhKMGVTQmhjM04xYldWeklHRmpZMlZ3ZEdGdVkyVWdiMllnZEdobElIUm9aVzRnWVhCd2JHbGpZV0pzWlNCemRHRnVaR0Z5WkNCMFpYSnRjeUJoYm1RZ1kyOXVaR2wwYVc5dWN5QnZaaUIxYzJVc0lHTmxjblJwWm1sallYUmxJSEJ2YkdsamVTQmhibVFnWTJWeWRHbG1hV05oZEdsdmJpQndjbUZqZEdsalpTQnpkR0YwWlcxbGJuUnpMakEyQmdnckJnRUZCUWNDQVJZcWFIUjBjRG92TDNkM2R5NWhjSEJzWlM1amIyMHZZMlZ5ZEdsbWFXTmhkR1ZoZFhSb2IzSnBkSGt2TURRR0ExVWRId1F0TUNzd0thQW5vQ1dHSTJoMGRIQTZMeTlqY213dVlYQndiR1V1WTI5dEwyRndjR3hsWVdsallUTXVZM0pzTUIwR0ExVWREZ1FXQkJRQ0pEQUxtdTd0UmpHWHBLWmFLWjVDY1lJY1JUQU9CZ05WSFE4QkFmOEVCQU1DQjRBd0R3WUpLb1pJaHZkalpBWWRCQUlGQURBS0JnZ3Foa2pPUFFRREFnTkhBREJFQWlCMG9iTWsyMEpKUXczVEoweFFkTVNBalpvZlNBNDZoY1hCTmlWbU1sKzhvd0lnYVRhUVU2djFDMXBTK2ZZQVRjV0tyV3hRcDlZSWFEZVE0S2M2MEI1SzJZRXdnZ0x1TUlJQ2RhQURBZ0VDQWdoSmJTKy9PcGphbHpBS0JnZ3Foa2pPUFFRREFqQm5NUnN3R1FZRFZRUUREQkpCY0hCc1pTQlNiMjkwSUVOQklDMGdSek14SmpBa0JnTlZCQXNNSFVGd2NHeGxJRU5sY25ScFptbGpZWFJwYjI0Z1FYVjBhRzl5YVhSNU1STXdFUVlEVlFRS0RBcEJjSEJzWlNCSmJtTXVNUXN3Q1FZRFZRUUdFd0pWVXpBZUZ3MHhOREExTURZeU16UTJNekJhRncweU9UQTFNRFl5TXpRMk16QmFNSG94TGpBc0JnTlZCQU1NSlVGd2NHeGxJRUZ3Y0d4cFkyRjBhVzl1SUVsdWRHVm5jbUYwYVc5dUlFTkJJQzBnUnpNeEpqQWtCZ05WQkFzTUhVRndjR3hsSUVObGNuUnBabWxqWVhScGIyNGdRWFYwYUc5eWFYUjVNUk13RVFZRFZRUUtEQXBCY0hCc1pTQkpibU11TVFzd0NRWURWUVFHRXdKVlV6QlpNQk1HQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJQQVhFWVFaMTJTRjFScGVKWUVIZHVpQW91L2VlNjVONEkzOFM1UGhNMWJWWmxzMXJpTFFsM1lOSWs1N3VnajlkaGZPaU10MnUyWnd2c2pvS1lUL1ZFV2pnZmN3Z2ZRd1JnWUlLd1lCQlFVSEFRRUVPakE0TURZR0NDc0dBUVVGQnpBQmhpcG9kSFJ3T2k4dmIyTnpjQzVoY0hCc1pTNWpiMjB2YjJOemNEQTBMV0Z3Y0d4bGNtOXZkR05oWnpNd0hRWURWUjBPQkJZRUZDUHlTY1JQaytUdkorYkU5aWhzUDZLNy9TNUxNQThHQTFVZEV3RUIvd1FGTUFNQkFmOHdId1lEVlIwakJCZ3dGb0FVdTdEZW9WZ3ppSnFraXBuZXZyM3JyOXJMSktzd053WURWUjBmQkRBd0xqQXNvQ3FnS0lZbWFIUjBjRG92TDJOeWJDNWhjSEJzWlM1amIyMHZZWEJ3YkdWeWIyOTBZMkZuTXk1amNtd3dEZ1lEVlIwUEFRSC9CQVFEQWdFR01CQUdDaXFHU0liM1kyUUdBZzRFQWdVQU1Bb0dDQ3FHU000OUJBTUNBMmNBTUdRQ01EclBjb05SRnBteGh2czF3MWJLWXIvMEYrM1pEM1ZOb282KzhaeUJYa0szaWZpWTk1dFpuNWpWUVEyUG5lbkMvZ0l3TWkzVlJDR3dvd1YzYkYzek9EdVFaLzBYZkN3aGJaWlB4bkpwZ2hKdlZQaDZmUnVaeTVzSmlTRmhCcGtQQ1pJZEFBQXhnZ0dKTUlJQmhRSUJBVENCaGpCNk1TNHdMQVlEVlFRRERDVkJjSEJzWlNCQmNIQnNhV05oZEdsdmJpQkpiblJsWjNKaGRHbHZiaUJEUVNBdElFY3pNU1l3SkFZRFZRUUxEQjFCY0hCc1pTQkRaWEowYVdacFkyRjBhVzl1SUVGMWRHaHZjbWwwZVRFVE1CRUdBMVVFQ2d3S1FYQndiR1VnU1c1akxqRUxNQWtHQTFVRUJoTUNWVk1DQ0ZuWW9ieXE5T1BOTUFzR0NXQ0dTQUZsQXdRQ0FhQ0JrekFZQmdrcWhraUc5dzBCQ1FNeEN3WUpLb1pJaHZjTkFRY0JNQndHQ1NxR1NJYjNEUUVKQlRFUEZ3MHlOVEExTWpreE1qVTNNVEZhTUNnR0NTcUdTSWIzRFFFSk5ERWJNQmt3Q3dZSllJWklBV1VEQkFJQm9Rb0dDQ3FHU000OUJBTUNNQzhHQ1NxR1NJYjNEUUVKQkRFaUJDQlM1OGwycllIVUk4OWQrMEtBbTl5UWdKY1FSUm94blFnT2tHSjJsMnJ2dXpBS0JnZ3Foa2pPUFFRREFnUklNRVlDSVFET1c3V3NtdXA2bHdkWTMwMk5XK3pHRGVNdFFuRUZEUFFWVjcxQkRpTThIZ0loQUlydG5MWHFJTUtYUDdFSFRrRUNtaUdRVzllZXBnNWZ2aTdsVythMEdHZ0NBQUFBQUFBQSIsImhlYWRlciI6eyJwdWJsaWNLZXlIYXNoIjoiRkgzMG1FNjY4YVkxbHoxVmExRjFSeVdIYWVhUXg5VkhKYUdZNks5RUdRND0iLCJlcGhlbWVyYWxQdWJsaWNLZXkiOiJNRmt3RXdZSEtvWkl6ajBDQVFZSUtvWkl6ajBEQVFjRFFnQUVURkZZUUZLaVArb1VuKzhzK295aGZ4MmhKaDczdlhaYlhDdFhQRWFERWNSRXVvU3VDWW1sR0VtUWRmQWRnWHY3NCswM0MveE00L3lNS3FvWEE3YTFYUT09IiwidHJhbnNhY3Rpb25JZCI6IjllN2EzYTFjZjg1NTM3ODgzODUyNjA2M2FlNzNhNzE4ZjM3OGFhNWExNGRlNTBlZTllMzQwOTgzNTg0YjEyYTQifSwidmVyc2lvbiI6IkVDX3YxIn0=",
            "isv_saleEnabled": true,
            "isv_applePayValidationUrl": "https://apple-pay-gateway-cert.apple.com/paymentservices/startSession",
            "isv_shippingMethod": "lowcost",
            "isv_acceptHeader": "*/*",
            "isv_applePayDisplayName": "Sunrise",
            "isv_customerIpAddress": "192.168.1.1",
            "isv_AVSResponse": "1",
            "isv_authorizationStatus": "AUTHORIZED",
            "isv_responseCode": "00",
            "isv_responseDateAndTime": "2025-05-29T12:57:18Z",
            "isv_userAgentHeader": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15"
        }
    },
    "paymentStatus": {},
    "transactions": [
        {
            "id": "f21152c7-cf60-414c-a80a-2b199d230f32",
            "timestamp": "2025-05-29T12:57:17.099Z",
            "type": "Charge",
            "amount": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 9460,
                "fractionDigits": 2
            },
            "interactionId": "7485234377156790604807",
            "state": "Success"
        }
    ],
    "interfaceInteractions": [],
    "anonymousId": "e4f35abe-bcb0-4a4c-b68e-9540cf474629"
};

const getClickToPayResponseUpdatePaymentObj = {
    "id": "b833b0c8-f989-478b-b05d-21b8caf3869f",
    "version": 8,
    "versionModifiedAt": "2025-05-29T13:35:44.644Z",
    "lastMessageSequenceNumber": 3,
    "createdAt": "2025-05-29T13:35:39.415Z",
    "lastModifiedAt": "2025-05-29T13:35:44.644Z",
    "lastModifiedBy": {
        "clientId": "ClKSqi1W4oIpuCSNLE0RMDH7",
        "isPlatformClient": false,
        "anonymousId": "7cfa587b-406a-4e1f-b040-6eb46c6d4b28"
    },
    "createdBy": {
        "clientId": "ClKSqi1W4oIpuCSNLE0RMDH7",
        "isPlatformClient": false,
        "anonymousId": "7cfa587b-406a-4e1f-b040-6eb46c6d4b28"
    },
    "amountPlanned": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 10450,
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
            "id": "10407153-9f92-48bb-a1c4-4fa99cb540ea"
        },
        "fields": {
            "isv_transientToken": "eyJraWQiOiIwOG4zcWJod3daUnJBZlZFODQ4aDZWdmppMEJERmdkaCIsImFsZyI6IlJTMjU2In0.eyJtZXRhZGF0YSI6eyJjYXJkaG9sZGVyQXV0aGVudGljYXRpb25TdGF0dXMiOmZhbHNlfSwiaXNzIjoiRmxleC8wNyIsImV4cCI6MTc0ODUyNjYzNiwidHlwZSI6ImdkYS0wLjkuMCIsImlhdCI6MTc0ODUyNTczNiwianRpIjoiMUU0R1oxR0taWUFURllJUEpDVzhVSEIzQ1E2Rzk4Wks1VTU2V0o4UzlURzA5V0g4NUJFTzY4Mzg2NjJDNUQwNCIsImNvbnRlbnQiOnsicHJvY2Vzc2luZ0luZm9ybWF0aW9uIjp7InBheW1lbnRTb2x1dGlvbiI6eyJ2YWx1ZSI6IjAyNyJ9fSwib3JkZXJJbmZvcm1hdGlvbiI6eyJiaWxsVG8iOnsibGFzdE5hbWUiOnt9LCJmaXJzdE5hbWUiOnt9LCJjb3VudHJ5Ijp7fSwiYWRkcmVzczIiOnt9LCJhZGRyZXNzMSI6e30sInBvc3RhbENvZGUiOnt9LCJsb2NhbGl0eSI6e30sImFkbWluaXN0cmF0aXZlQXJlYSI6e30sImVtYWlsIjp7fX0sImFtb3VudERldGFpbHMiOnsidG90YWxBbW91bnQiOnt9LCJjdXJyZW5jeSI6e319LCJzaGlwVG8iOnsiY291bnRyeSI6e30sImFkZHJlc3MyIjp7fSwiYWRkcmVzczEiOnt9LCJwb3N0YWxDb2RlIjp7fSwibG9jYWxpdHkiOnt9LCJhZG1pbmlzdHJhdGl2ZUFyZWEiOnt9fX0sInBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAyOSJ9LCJudW1iZXIiOnsibWFza2VkVmFsdWUiOiJYWFhYWFhYWFhYWFgxMTExIn0sImV4cGlyYXRpb25Nb250aCI6eyJ2YWx1ZSI6IjEyIn0sInR5cGUiOnsidmFsdWUiOiIwMDEifSwidXNlQXMiOnsidmFsdWUiOiJEIn19fX19.RihIcqpty8EzImZTainzL8tNgmpgC1fnvngkIC2g-E7AKnYdPL3FjJKTvC4Q1D4EzMwG2Z7RxCws28VPt9TbNF3FIXXPZUse5z2n75AJV3heVTE1YNS3wKlla3cTN6nM26oMg0A08321W2dDqgLHb7mVOGzXpWVVXY72xFpdRp-PJEUKg16SrkAmOuP9X5q5_8FjhX2evykcAN8ETVt7_wQflZmJ016ecVInDA3oVj9lYJsaaarhn14HZSkPlKxNXLHPDjIQkmFBdShxLiTsXuOpB8hExssFk23O4jyaYKIP5vzxiTgyZikHibCGT-XuHwuIFmHjsZKWqga3SpQNFA",
            "isv_deviceFingerprintId": "5be84848-f1b9-4fd1-8360-3c2836e84f2b",
            "isv_saleEnabled": false,
            "isv_shippingMethod": "lowcost",
            "isv_cardType": "001",
            "isv_maskedPan": "undefinedXXXXXXXXXXXX1111",
            "isv_AVSResponse": "X",
            "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
            "isv_responseCode": "100",
            "isv_responseDateAndTime": "2025-05-29T13:35:44Z",
            "isv_cardExpiryYear": "2029",
            "isv_merchantId": "visa_isv_opencart_pmt_101",
            "isv_authorizationStatus": "AUTHORIZED",
            "isv_cardExpiryMonth": "12"
        }
    },
    "paymentStatus": {},
    "transactions": [
        {
            "id": "cdc6ab70-1503-4707-b684-98a762ef61c5",
            "timestamp": "2025-05-29T13:35:42.624Z",
            "type": "Authorization",
            "amount": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 10450,
                "fractionDigits": 2
            },
            "interactionId": "7485257442696664004805",
            "state": "Success"
        }
    ],
    "interfaceInteractions": [],
    "anonymousId": "7cfa587b-406a-4e1f-b040-6eb46c6d4b28"
};

const tokenCreateFlagCustomerInfo = {
    id: "d816604e-91ae-44f4-bd1a-4c4386aefff6",
    version: 1,
    versionModifiedAt: "2025-05-28T13:02:47.818Z",
    lastMessageSequenceNumber: 1,
    createdAt: "2025-05-28T13:02:47.818Z",
    lastModifiedAt: "2025-05-28T13:02:47.818Z",
    lastModifiedBy: {
        clientId: "ClKSqi1W4oIpuCSNLE0RMDH7",
        isPlatformClient: false,
        anonymousId: "dc7570e0-3ff6-41e7-acd1-b6200365eea4"
    },
    createdBy: {
        clientId: "ClKSqi1W4oIpuCSNLE0RMDH7",
        isPlatformClient: false,
        anonymousId: "dc7570e0-3ff6-41e7-acd1-b6200365eea4"
    },
    email: "testoutt@gmail.com",
    firstName: "tets",
    lastName: "e",
    password: "****jLI=",
    addresses: [],
    shippingAddressIds: [],
    billingAddressIds: [],
    isEmailVerified: false,
    customerGroupAssignments: [],
    stores: [],
    authenticationMode: "Password"
};

const customerCardTokens = {
    customerTokenId: '',
    paymentInstrumentId: '',
};

let payment = {
    id: unit.paymentId,
    version: 13,
    lastMessageSequenceNumber: 2,
    createdAt: '2021-12-06T10:19:24.257Z',
    lastModifiedAt: '2021-12-06T10:19:53.227Z',
    lastModifiedBy: {
        clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
        isPlatformClient: false,
        customer: {
            typeId: 'customer',
            id: unit.customerId,
        },
    },
    createdBy: {
        clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
        isPlatformClient: false,
        customer: {
            typeId: 'customer',
            id: '5917bbf8-2b3a-4934-9dcc-cbda0778719f',
        },
    },
    customer: {
        typeId: 'customer',
        id: unit.customerId,
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
            isv_merchantId: '',
            isv_payerAuthenticationTransactionId: 'AftqasS2lskIPXS4Q2q0',
            isv_payerAuthenticationPaReq: 'eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMi4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiI1MjNkNzRiOS1kMWMwLTQ2MGItYWE5NC0yMDg4MTg1MmI2NGYiLCJhY3NUcmFuc0lEIjoiMGFmZmQ5NWEtZWYzZC00ZDM2LWI1YTEtNGFkNGE1YmU1MDI4IiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAyIn0',
            isv_cardinalReferenceId: '520d7555-8563-4819-899c-bed098ceeded',
            isv_metadata: "{\"1\":\"testValue1\",\"2\":\"testValue2\"}"
        },
    },
    paymentStatus: {},
    transactions: [],
    interfaceInteractions: [],
};

let cart = {
    type: 'Cart',
    id: '3d09ed42-1b1b-450a-b670-269437683939',
    version: 10,
    lastMessageSequenceNumber: 1,
    createdAt: '2022-04-11T09:08:17.675Z',
    lastModifiedAt: '2022-04-11T09:10:51.071Z',
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
                            centAmount: 15845,
                            fractionDigits: 2,
                        },
                        country: 'US',
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
                centAmount: 5980,
                fractionDigits: 2,
            },
            taxedPrice: {
                totalNet: {
                    type: 'centPrecision',
                    currencyCode: 'USD',
                    centAmount: 4983,
                    fractionDigits: 2,
                },
                totalGross: {
                    type: 'centPrecision',
                    currencyCode: 'USD',
                    centAmount: 5980,
                    fractionDigits: 2,
                },
                totalTax: {
                    type: 'centPrecision',
                    currencyCode: 'USD',
                    centAmount: 997,
                    fractionDigits: 2,
                },
            },
            lineItemMode: 'Standard',
        },
    ],
    cartState: 'Active',
    totalPrice: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 5980,
        fractionDigits: 2,
    },
    taxedPrice: {
        totalNet: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 4983,
            fractionDigits: 2,
        },
        totalGross: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 5980,
            fractionDigits: 2,
        },
        taxPortions: [
            {
                rate: 0.2,
                amount: {
                    type: 'centPrecision',
                    currencyCode: 'USD',
                    centAmount: 997,
                    fractionDigits: 2,
                },
                name: 'test-tax-category',
            },
        ],
        totalTax: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 997,
            fractionDigits: 2,
        },
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
                firstName: 'john',
                lastName: 'doe',
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
    inventoryMode: 'None',
    taxMode: 'Platform',
    taxRoundingMode: 'HalfEven',
    taxCalculationMode: 'LineItemLevel',
    deleteDaysAfterLastModification: 90,
    refusedGifts: [],
    origin: 'Customer',
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
    getCreditCardResponseUpdateTransactions,
    getGooglePayResponseUpdatePaymentObj,
    getApplePayResponseUpdatePaymentObj,
    getClickToPayResponseUpdatePaymentObj,
    tokenCreateFlagCustomerInfo,
    customerCardTokens,
    payment,
    cart
};
