/* eslint-disable import/order */
import googlePay from '../JSON/googlePay.json';
import applePay from '../JSON/applePay.json';
import creditCard from '../JSON/creditCard.json';
import cpay from '../JSON/clickToPay.json';
import unit from '../JSON/unit.json';
import updateToken from '../JSON/updateToken.json';
import deleteToken from '../JSON/deleteToken.json';


  export const updateCardHandlerTokens  = {
    alias: updateToken.alias,
    value: updateToken.value,
    cardType: updateToken.cardType,
    cardName: updateToken.cardName,
    cardNumber: updateToken.cardNumber,
    cardExpiryMonth: updateToken.cardExpiryMonth,
    cardExpiryYear: updateToken.cardExpiryYear,
    paymentToken: updateToken.paymentToken,
    flag: 'update',
    oldExpiryMonth: updateToken.oldExpiryMonth,
    oldExpiryYear: updateToken.oldExpiryYear
  }

  export const updateCardHandlerCustomerId = unit.customerId;
  
  export const orderManagementHandlerPaymentId = unit.paymentId;

  export const orderManagementHandlerUpdateTransactions = {
    id: '8d3dab83-6024-4c50-ba0e-c387a89762be',
    timestamp: '2022-01-11T06:37:11.153Z',
    type: 'Charge',
    amount: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 5980,
      fractionDigits: 2
    },
    state: 'Initial'
  }

export const deleteCardHandlerUpdateCustomerObj = {
    alias: deleteToken.alias,
    value: deleteToken.value,
    cardType: deleteToken.cardType,
    cardName: deleteToken.cardName,
    cardNumber: deleteToken.cardNumber,
    cardExpiryMonth: deleteToken.cardExpiryMonth,
    cardExpiryYear: deleteToken.cardExpiryYear,
    flag: 'delete'
  }

  export const deleteCardHandlerCutsomerId = unit.customerId

  export const applePaySessionHandlerFields = 
  {
    isv_deviceFingerprintId: '2cd0221d-e31e-42d3-9d6b-aaeedd0eb62c',
    isv_applePayValidationUrl: 'https://apple-pay-gateway-cert.apple.com/paymentservices/startSession',
    isv_acceptHeader: '*/*',
    isv_applePayDisplayName: 'Sunrise',
    isv_userAgentHeader: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15'
    }

  export const authoriationHandlerGPUpdatePaymentObject = 
  {
      "id":"58a12619-a284-46cc-9376-e839f5eb8b41",
      "version":2,
      "lastMessageSequenceNumber":2,
      "createdAt":"2022-02-01T09:27:28.609Z",
      "lastModifiedAt":"2022-02-01T09:27:28.609Z",
      "lastModifiedBy":
      {
          "clientId":"iFOAd29Lew5ADrpakIhQkz_N",
          "isPlatformClient":false,
          "customer":
          {
              "typeId":"customer",
              "id":"88c278f9-82d9-427c-96df-f98a4f23e543"
            }
        },
        "createdBy":
        {
            "clientId":"iFOAd29Lew5ADrpakIhQkz_N",
            "isPlatformClient":false,
            "customer":
            {
                "typeId":"customer",
                "id":"88c278f9-82d9-427c-96df-f98a4f23e543"
            }
        },
        "customer":
        {
            "typeId":"customer",
            "id":"88c278f9-82d9-427c-96df-f98a4f23e543"
        },
        "amountPlanned":
        {
            "type":"centPrecision",
            "currencyCode":"USD",
            "centAmount":6970,
            "fractionDigits":2
        },
        "paymentMethodInfo":
        {
            "paymentInterface":"cybersource",
            "method":"googlePay",
            "name":
            {
                "en":"Google Pay"
            }
        },
        "custom":
        {
            "type":
            {
                "typeId":"type",
                "id":"87b9d9db-74a3-45d7-8e60-dde669866808"
            },
            "fields":
            {
                "isv_deviceFingerprintId":"c115e1e8-5864-4217-bea2-e0a09ca06abd",
                "isv_token":googlePay.isv_token,
                "isv_acceptHeader":"*/*",
                "isv_customerIpAddress":"106.202.150.94",
                "isv_userAgentHeader":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
            }
        },
        "paymentStatus":{},
        "transactions":[],
        "interfaceInteractions":[]
    }

	export const authorizationHandlerUpdateTransactions = 
    {
        "id":"6f2129cc-76fc-441f-a1ae-cfa940184f6d",
        "timestamp":"2022-02-01T09:27:30.561Z",
        "type":"Authorization",
        "amount":
        {
            "type":"centPrecision",
            "currencyCode":"USD",
            "centAmount":6970,
            "fractionDigits":2
        },
        "state":"Initial"
    }

    export const authorizationHandlerVSUpdatePaymentObject = {
        id: 'e1389f95-b621-4d31-b865-defbe5d889c9',
        version: 2,
        lastMessageSequenceNumber: 2,
        createdAt: '2022-01-10T08:46:10.728Z',
        lastModifiedAt: '2022-01-10T08:46:10.728Z',
        lastModifiedBy: {
          clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
          isPlatformClient: false,
          customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' }
        },
        createdBy: {
          clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
          isPlatformClient: false,
          customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' }
        },
        customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' },
        amountPlanned: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 5980,
          fractionDigits: 2
        },
        paymentMethodInfo: {
          paymentInterface: 'cybersource',
          method: 'visaCheckout',
          name: { en: 'Click to Pay' }
        },
        custom: {
          type: { typeId: 'type', id: '87b9d9db-74a3-45d7-8e60-dde669866808' },
          fields: {
           isv_deviceFingerprintId: '016bd52d-4592-4c90-8e5f-18a7592b4a4f',
            isv_token: cpay.isv_token,
            isv_acceptHeader:"*/*",
            isv_customerIpAddress:"106.202.150.94",
            isv_userAgentHeader:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
           }
        },
        paymentStatus: {},
        transactions: [],
        interfaceInteractions: []
      }

    export const authorizationHandlerCCUpdatePaymentObject = {
        id: '2c89cf32-2846-4030-b256-ffdb442a18d6',
        version: 12,
        lastMessageSequenceNumber: 2,
        createdAt: '2022-01-10T08:08:48.572Z',
        lastModifiedAt: '2022-01-10T08:09:08.339Z',
        lastModifiedBy: {
          clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
          isPlatformClient: false,
          customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' }
        },
        createdBy: {
          clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
          isPlatformClient: false,
          customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' }
        },
        customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' },
        amountPlanned: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 5980,
          fractionDigits: 2
        },
        paymentMethodInfo: {
          paymentInterface: 'cybersource',
          method: 'creditCard',
          name: { en: 'Credit Card' }
        },
        custom: {
          type: { typeId: 'type', id: '87b9d9db-74a3-45d7-8e60-dde669866808' },
          fields: {
            isv_tokenCaptureContextSignature: 'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI1U05zMVduOWxXZnczZ2Z2b3QvTERSQUFFTzBrWUxFeTdmSHZSa09RZzMvMUs3S0lnNTl2ajJRWWJMKzNhU1dRUE1Vc0RhUGVKc0lNNHFvMTFERm5qNkcvV3NPZ1lrRndwVlZVQzJMQWxucWM1aHRqLzFjY2h6Q3g3NkMxTWUrMGZSZHIiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJxTXdHNWl0WDVjdV8zbjZteFFlNWR3eWRHWjRpS1FjRmlmd0FsM3c2UDdENUMtUF83SXhFMkwyNTRFa05UYVNqNk9VOWZCaldxZWU0VDdfeUZHbUxnTldZODc0dTVaTmNkeWZjcUlVa2hnV2JSOXdleVRkQVpuREY5YnE4emN1LUhQT1puU3pJS25MdUN1QmlfN0lRVkRfMkFNaXlqTU0yM1lwNlh3clVfLXRiUzZDeGprNFRRT0NfWVpzdXd6UEZuZEJ1aExWcVpQOXlfczBMSHhEOGRhZ0toMUVlcDN2cDRFTXl2OHl3WDNLdExxSEdWNTNubXc0bXBfRUdNRjY3STUwMzgtOGU2OXB1RGZUUnNrVC1OMUFIOUxUVmFjLVV0NGpMSmRRU2dLb2txWlJaSGNUTUNiMlg4NmtNTTNuQ19WQnpjVlloNWFKWFhBSGF3WW85ZnciLCJraWQiOiIwOHVnNEtYMmt4SnRicWFCMjlOU2pnYVdUbFUyMUFUaCJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NDE4MDMwMjgsImlhdCI6MTY0MTgwMjEyOCwianRpIjoibTVEbnVSbnR1UU5pWm9RUSJ9.ATYmhFloIbOQtrp8UxwummoMvTVftvyVQFEBua-6g_YoDfr38d3TZrhr5DPaLvuYTxCUSxulFC97jzYSNyWqsgpIvdLXda_dal7uf3PZblNg5yBg9nOP_2RGSzbqHgRR8rWW55zKR-8xOvdIaJ4Kr9Hsf5zoC0rxIjcCCPmP494PaLdVXgfWOZwlp3jOeEqn_v78pP_7JwMLGEj4iEo2wpCSe_ra0_57aeJloq-pXS_C0SMKZq9CXytHpdJlL2uNpwisyBH9N6fdebaEvRARttHXHEkr0wAeFj0jEs46oW5DdjDQmTla2Qf4TSFkhZeUrYTce63nG8bAGd62MhwIng',
            isv_deviceFingerprintId: '016bd52d-4592-4c90-8e5f-18a7592b4a4f',
            isv_cardExpiryYear: '2024',
            isv_token: creditCard.isv_token,
            isv_customerIpAddress:"106.202.150.94",
            isv_maskedPan: '411111XXXXXX1111',
            isv_cardExpiryMonth: '01',
            isv_acceptHeader: '*/*',
            isv_cardType: '001',
            isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
            isv_tokenVerificationContext: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI1U05zMVduOWxXZnczZ2Z2b3QvTERSQUFFTzBrWUxFeTdmSHZSa09RZzMvMUs3S0lnNTl2ajJRWWJMKzNhU1dRUE1Vc0RhUGVKc0lNNHFvMTFERm5qNkcvV3NPZ1lrRndwVlZVQzJMQWxucWM1aHRqLzFjY2h6Q3g3NkMxTWUrMGZSZHIiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJxTXdHNWl0WDVjdV8zbjZteFFlNWR3eWRHWjRpS1FjRmlmd0FsM3c2UDdENUMtUF83SXhFMkwyNTRFa05UYVNqNk9VOWZCaldxZWU0VDdfeUZHbUxnTldZODc0dTVaTmNkeWZjcUlVa2hnV2JSOXdleVRkQVpuREY5YnE4emN1LUhQT1puU3pJS25MdUN1QmlfN0lRVkRfMkFNaXlqTU0yM1lwNlh3clVfLXRiUzZDeGprNFRRT0NfWVpzdXd6UEZuZEJ1aExWcVpQOXlfczBMSHhEOGRhZ0toMUVlcDN2cDRFTXl2OHl3WDNLdExxSEdWNTNubXc0bXBfRUdNRjY3STUwMzgtOGU2OXB1RGZUUnNrVC1OMUFIOUxUVmFjLVV0NGpMSmRRU2dLb2txWlJaSGNUTUNiMlg4NmtNTTNuQ19WQnpjVlloNWFKWFhBSGF3WW85ZnciLCJraWQiOiIwOHVnNEtYMmt4SnRicWFCMjlOU2pnYVdUbFUyMUFUaCJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NDE4MDMwMjgsImlhdCI6MTY0MTgwMjEyOCwianRpIjoibTVEbnVSbnR1UU5pWm9RUSJ9.eEnpS5aFcJZEA4wuI7zNzYtTTt_s-ALIBMG2b3a22Pk' 
          }
        },
        paymentStatus: {},
        transactions: [],
        interfaceInteractions: []
      }
    
    export const authorizationHandler3DSUpdatePaymentObject = {
        id: 'd5dddb44-f941-4b9a-bb09-1c507088179c',
        version: 17,
        lastMessageSequenceNumber: 2,
        createdAt: '2022-01-10T06:29:25.858Z',
        lastModifiedAt: '2022-01-10T06:38:29.073Z',
        lastModifiedBy: {
          clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
          isPlatformClient: false,
          customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' }
        },
        createdBy: {
          clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
          isPlatformClient: false,
        customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' }
      },
      customer: { typeId: 'customer', id: '88c278f9-82d9-427c-96df-f98a4f23e543' },
      amountPlanned: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 5980,
        fractionDigits: 2
      },
      paymentMethodInfo: {
        paymentInterface: 'cybersource',
        method: 'creditCardWithPayerAuthentication',
        name: { en: 'Credit Card Payer Authentication' }
      },
      custom: {
        type: { typeId: 'type', id: '87b9d9db-74a3-45d7-8e60-dde669866808' },
        fields: {
          isv_deviceFingerprintId: '26a7d17b-426d-4b66-935d-db6593fe960d',
          isv_cardExpiryYear: '2024',
          isv_token: creditCard.isv_token,
          isv_customerIpAddress:"106.202.150.94",
          isv_maskedPan: '411111XXXXXX1111',
          isv_cardExpiryMonth: '01',
          isv_deviceDataCollectionUrl:"https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect",
          isv_cardinalReferenceId:"64fad511-5092-4b93-acd5-714e1d8754c0",
          isv_requestJwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNzg5NzMzZS1mNTQ5LTQwOTktOTc1OC01ZDU1ZWMzZDU5NWEiLCJpYXQiOjE2NDE3OTY3MDQsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTY0MTgwMDMwNCwiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUmVmZXJlbmNlSWQiOiJjN2UxMzI2Zi03OTI2LTQ2NjEtOTk4My1hMDg4Mjk4MDE2ZmUifQ.d4OMX7yrAj5en7UsV2lsKvD5sObvO4jVBOqOtEIg0ps',
          isv_tokenCaptureContextSignature: 'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJYY3hJVnZYMEFHdjFVd3JMRjY3VnJSQUFFR0pMM1MxMXdHb0c2RHdpaWRVQ2UrZm9UaGQ1cUhCUEpWN2FLYm9meXlYVzhpb20wU1RxZGhwejRXYk42TmYySDE2VG1DNjlqVUpmVlh6VFdRSVNqT21NeWFaWS9GSFJGa0orVElwZk5EbUoiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJ1dGVUU3NRc2FISjI0NGllQ1lSWjNldG9PdUhPUUxTMmhsa203STFZX3k3aURQU0VSMUVLZ0FlNl9MOWI3YW1HTFVOM2xPZDdIMnU3TDhXX1V1M2k1ZzNlV3RkN3p3MXc5SV9VNWlUcm0wUTRpaWV2ZVdpdnJHclIyMWpnWTZhZ3FVanVxbllvTUJvckkxN2ZuTlZST0xkN1cwZ2NuOWkwcW1HU3lGUC02a05heFFZQnJhSVlzajg3eTE2MER3X2VJc1lrQnlnMWdXNjVCUWRGQW4tNTdhQnhZSVZNdGJPdm1hZFlqSkxDQVh3d19qU3ZOWjZZRmw5SUJLa3ZUelktcGNVOUloTHpiT242VDJYT05icTRaZFRmTTJqU0FuOHktVFJHTTVVN3V1YkxXcy1iVWtiR1FYSFN2V21ieFk3ZmU0dzk4bDUxZDAyYjg1RDdBa3dyb1EiLCJraWQiOiIwOGZHZEIzbzk4cFZHN3p5MXB2MlpFWHQ2ZlRUMlNXQiJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NDE3OTcwNjUsImlhdCI6MTY0MTc5NjE2NSwianRpIjoieDRzb2FkWFl4MDdKSlhxeCJ9.LCYZBFSv3QK3mErxjFnDm6t4BrhxYbPOFext1Gz5G1UP5gIw-XK8-sb7rZafMIrMXt2WU_3zXfEv8rLMZrVi8706MWM8gArVg-AanTB-Eo3HefafC90ebro1aUsD1CB-Tmm6mn_JAL9b7PFJSxpLn_PeddBnxvk_Aq6hAIw1LoHqJGply5EDxE2df75p0GNXw69WfaJ1_7VdIyIwL953FrGJZ8whHtEV7hPNh_6-jd9U_xbE6cJmvj0bK2ijFFP67eSJ19Tde7TIi8BhXe-n6HE0_1BbjW8By1W0oY-ejJCcRCfWN1wd_dp5D_AjtwK6MirFwTWT3IOhgMJM6NxRXQ',
          isv_acceptHeader: '*/*',
          isv_cardType: '001',
          isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
          isv_tokenVerificationContext: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJYY3hJVnZYMEFHdjFVd3JMRjY3VnJSQUFFR0pMM1MxMXdHb0c2RHdpaWRVQ2UrZm9UaGQ1cUhCUEpWN2FLYm9meXlYVzhpb20wU1RxZGhwejRXYk42TmYySDE2VG1DNjlqVUpmVlh6VFdRSVNqT21NeWFaWS9GSFJGa0orVElwZk5EbUoiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJ1dGVUU3NRc2FISjI0NGllQ1lSWjNldG9PdUhPUUxTMmhsa203STFZX3k3aURQU0VSMUVLZ0FlNl9MOWI3YW1HTFVOM2xPZDdIMnU3TDhXX1V1M2k1ZzNlV3RkN3p3MXc5SV9VNWlUcm0wUTRpaWV2ZVdpdnJHclIyMWpnWTZhZ3FVanVxbllvTUJvckkxN2ZuTlZST0xkN1cwZ2NuOWkwcW1HU3lGUC02a05heFFZQnJhSVlzajg3eTE2MER3X2VJc1lrQnlnMWdXNjVCUWRGQW4tNTdhQnhZSVZNdGJPdm1hZFlqSkxDQVh3d19qU3ZOWjZZRmw5SUJLa3ZUelktcGNVOUloTHpiT242VDJYT05icTRaZFRmTTJqU0FuOHktVFJHTTVVN3V1YkxXcy1iVWtiR1FYSFN2V21ieFk3ZmU0dzk4bDUxZDAyYjg1RDdBa3dyb1EiLCJraWQiOiIwOGZHZEIzbzk4cFZHN3p5MXB2MlpFWHQ2ZlRUMlNXQiJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NDE3OTcwNjUsImlhdCI6MTY0MTc5NjE2NSwianRpIjoieDRzb2FkWFl4MDdKSlhxeCJ9.RXEfST3kVUZ4-oPjVM63UuUbYn8rn3H-42DHx6Hs3kA'
        }
      },
      paymentStatus: {},
      transactions: [],
      interfaceInteractions: []
    }

    export const authorizationHandlerAPUpdatePaymentObject =
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
            isv_applePayValidationUrl:"https://apple-pay-gateway-cert.apple.com/paymentservices/startSession",
            isv_acceptHeader: '*/*',
            isv_applePayDisplayName:"Sunrise",
            isv_customerIpAddress:"106.202.150.94",
            isv_userAgentHeader: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
            isv_applePaySessionData:"{\"epochTimestamp\":1646040487087,\"expiresAt\":1646044087087,\"merchantSessionIdentifier\":\"SSH16DCA47C8288434F8F9F1B6C252F9827_916523AAED1343F5BC5815E12BEE9250AFFDC1A17C46B0DE5A943F0F94927C24\",\"nonce\":\"21432f7c\",\"merchantIdentifier\":\"490BF9671420F23BAF41925E4FF7474DFD27854BD78C9DE6C0DEC26EF9567B06\",\"domainName\":\"www.qa.ct.cybsplugin.com\",\"displayName\":\"Sunrise\",\"signature\":\"308006092a864886f70d010702a0803080020101310f300d06096086480165030402010500308006092a864886f70d0107010000a080308203e43082038ba003020102020859d8a1bcaaf4e3cd300a06082a8648ce3d040302307a312e302c06035504030c254170706c65204170706c69636174696f6e20496e746567726174696f6e204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b3009060355040613025553301e170d3231303432303139333730305a170d3236303431393139333635395a30623128302606035504030c1f6563632d736d702d62726f6b65722d7369676e5f5543342d53414e44424f5831143012060355040b0c0b694f532053797374656d7331133011060355040a0c0a4170706c6520496e632e310b30090603550406130255533059301306072a8648ce3d020106082a8648ce3d030107034200048230fdabc39cf75e202c50d99b4512e637e2a901dd6cb3e0b1cd4b526798f8cf4ebde81a25a8c21e4c33ddce8e2a96c2f6afa1930345c4e87a4426ce951b1295a38202113082020d300c0603551d130101ff04023000301f0603551d2304183016801423f249c44f93e4ef27e6c4f6286c3fa2bbfd2e4b304506082b0601050507010104393037303506082b060105050730018629687474703a2f2f6f6373702e6170706c652e636f6d2f6f63737030342d6170706c65616963613330323082011d0603551d2004820114308201103082010c06092a864886f7636405013081fe3081c306082b060105050702023081b60c81b352656c69616e6365206f6e207468697320636572746966696361746520627920616e7920706172747920617373756d657320616363657074616e6365206f6620746865207468656e206170706c696361626c65207374616e64617264207465726d7320616e6420636f6e646974696f6e73206f66207573652c20636572746966696361746520706f6c69637920616e642063657274696669636174696f6e2070726163746963652073746174656d656e74732e303606082b06010505070201162a687474703a2f2f7777772e6170706c652e636f6d2f6365727469666963617465617574686f726974792f30340603551d1f042d302b3029a027a0258623687474703a2f2f63726c2e6170706c652e636f6d2f6170706c6561696361332e63726c301d0603551d0e041604140224300b9aeeed463197a4a65a299e4271821c45300e0603551d0f0101ff040403020780300f06092a864886f76364061d04020500300a06082a8648ce3d0403020347003044022074a1b324db4249430dd3274c5074c4808d9a1f480e3a85c5c1362566325fbca3022069369053abf50b5a52f9f6004dc58aad6c50a7d608683790e0a73ad01e4ad981308202ee30820275a0030201020208496d2fbf3a98da97300a06082a8648ce3d0403023067311b301906035504030c124170706c6520526f6f74204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b3009060355040613025553301e170d3134303530363233343633305a170d3239303530363233343633305a307a312e302c06035504030c254170706c65204170706c69636174696f6e20496e746567726174696f6e204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b30090603550406130255533059301306072a8648ce3d020106082a8648ce3d03010703420004f017118419d76485d51a5e25810776e880a2efde7bae4de08dfc4b93e13356d5665b35ae22d097760d224e7bba08fd7617ce88cb76bb6670bec8e82984ff5445a381f73081f4304606082b06010505070101043a3038303606082b06010505073001862a687474703a2f2f6f6373702e6170706c652e636f6d2f6f63737030342d6170706c65726f6f7463616733301d0603551d0e0416041423f249c44f93e4ef27e6c4f6286c3fa2bbfd2e4b300f0603551d130101ff040530030101ff301f0603551d23041830168014bbb0dea15833889aa48a99debebdebafdacb24ab30370603551d1f0430302e302ca02aa0288626687474703a2f2f63726c2e6170706c652e636f6d2f6170706c65726f6f74636167332e63726c300e0603551d0f0101ff0404030201063010060a2a864886f7636406020e04020500300a06082a8648ce3d040302036700306402303acf7283511699b186fb35c356ca62bff417edd90f754da28ebef19c815e42b789f898f79b599f98d5410d8f9de9c2fe0230322dd54421b0a305776c5df3383b9067fd177c2c216d964fc6726982126f54f87a7d1b99cb9b0989216106990f09921d00003182018c30820188020101308186307a312e302c06035504030c254170706c65204170706c69636174696f6e20496e746567726174696f6e204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b3009060355040613025553020859d8a1bcaaf4e3cd300d06096086480165030402010500a08195301806092a864886f70d010903310b06092a864886f70d010701301c06092a864886f70d010905310f170d3232303232383039323830375a302a06092a864886f70d010934311d301b300d06096086480165030402010500a10a06082a8648ce3d040302302f06092a864886f70d010904312204206640919e57549701d5de630d600c5ef07f4488eee4f6c75292e3dc910254ffb5300a06082a8648ce3d04030204473045022100d8cfb2f2f14db4849b458ba21d67444fa1a8e2b7aa27de403e0959565385153d02203bee8dbd0389210ec09e512c6bee47b86ad6b7e2b2f7841f53019098754c106b000000000000\",\"operationalAnalyticsIdentifier\":\"Sunrise:490BF9671420F23BAF41925E4FF7474DFD27854BD78C9DE6C0DEC26EF9567B06\",\"retries\":0}",
            isv_token: applePay.isv_token
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

export const getPayerAuthEnrollResponseUpdatePaymentObj =
{
  "id": "1a3878c8-2860-4475-adca-a1acc433fb9c",
  "version": 15,
  "lastMessageSequenceNumber": 1,
  "createdAt": "2022-03-29T11:27:40.206Z",
  "lastModifiedAt": "2022-03-29T11:28:03.902Z",
  "lastModifiedBy": {
    "clientId": "0GrQ8c2D9t1iSjzJF8E3Ygu3",
    "isPlatformClient": false,
    "customer": {
      "typeId": "customer",
      "id": "b0c50186-fc83-4a97-9ea3-47bab58b3cc6"
    }
  },
  "createdBy": {
    "clientId": "0GrQ8c2D9t1iSjzJF8E3Ygu3",
    "isPlatformClient": false,
    "customer": {
      "typeId": "customer",
      "id": "b0c50186-fc83-4a97-9ea3-47bab58b3cc6"
    }
  },
  "customer": {
    "typeId": "customer",
    "id": "b0c50186-fc83-4a97-9ea3-47bab58b3cc6"
  },
  "amountPlanned": {
    "type": "centPrecision",
    "currencyCode": "USD",
    "centAmount": 6970,
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
      "id": "87b9d9db-74a3-45d7-8e60-dde669866808"
    },
    "fields": {
      "isv_deviceFingerprintId": "f360dac6-1271-42f2-8733-3b1b3e497bc1",
      "isv_cardExpiryYear": "2025",
      "isv_token": creditCard.isv_token,
      "isv_customerIpAddress": "223.226.228.123",
      "isv_maskedPan": "411111XXXXXX1111",
      "isv_cardExpiryMonth": "01",
      "isv_deviceDataCollectionUrl": "https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect",
      "isv_cardinalReferenceId": "b98223d5-b297-4b75-9cf9-f540ab6c0359",
      "isv_requestJwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYTYxMmNmNS1hMmY2LTRkN2MtOTQzMy0wMTI5M2RhODY4NzQiLCJpYXQiOjE2NDg1NTMyODMsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTY0ODU1Njg4MywiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUmVmZXJlbmNlSWQiOiJiOTgyMjNkNS1iMjk3LTRiNzUtOWNmOS1mNTQwYWI2YzAzNTkifQ.RaAXN3siqhEF3NG0dLfuNcc27mgTNLbqMDIO9-jv7jA",
      "isv_tokenCaptureContextSignature": "eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI2ei93SGNLc1BtTmltdXU0T09VR3V4QUFFTmhrQ29DRSsvUWJHcm5IWTk1YTkzRm4xQTY1a1ZPRjVYcUFSUHhaUW1kUGNvVTdlblBwWk05Vmt2NkZDRTNiT0NMcjJxcFpvOEhUSVIrY2lFcU9FdjBWdTMwakR6b3Uwb25RVkRYNkpyZDgiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJ5WU9Ld2dTU090d0ZSaWNVT1Nid0taLXBndVpweV9vQ3Bmc1lZbGVwVkJSM3lULXF1Qk5aa09CelY2UHlDdzhfcS1weldFRnZ2RW1qcDJ3bndLSlF2RHVTOGxJN1JwdzZIeFlkTklUVmZpT19PeHFTdUJSbGFhM0J5dFVZUEszVkJfMjc1MkRBZkpubnNha3hyN3VuNE5wWHdfdEhHUnJBZkg2cmFrNmtKUlZsRU84UXY4Ykl2VkxTN1VSM19qdHNnTTNLcHZGci0wRFVfOGgwNGc2cnJfT3RhWF93VmlxdXdCeWp1ZGdZNE9scDYxd29pWlFhQlNVQjZPWDVLaXlORnRYNzhQX3M1OG9wdjlhQTNaN2dKTWNyUFB3UGhPa2dwbXRQUnJFTjhneFBYZkFld2ZUeFR0YUp6TmVXYWp2OUk2a3doZ2Rrc3NCRFUwYXJEVjRaUnciLCJraWQiOiIwOE52cW8wRllsZGh4MjB3MTNXaFhsZUtwWnBCd1FWRSJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NDg1NTQxNTksImlhdCI6MTY0ODU1MzI1OSwianRpIjoiWnFjT0Vjd205cFB4UnltOSJ9.DlRcaWUfrCFWACsVMGs70u4IKoiF2DoLCfF3_gpKAxBZl6QBcgUURy1ntD1ydZMNGn2LiKoDpwucaRuN9KDLd66O3or0KQ4ZeQi1ZfIIZ657lZ1U1m0hKN2iAeYmRGllnu5jbUVfHC_i-sRon07hNhHlVtv63StVkIwbYfQO6uk2iIv1WVQOJajzVc7OmjZoW4UbEskiu4ivW2mKaJfCVTfzq1Gv---9Wypbv9ERwyJ2SEok7eBjLrbu7YAWDTyryXMEx8C2liV4xu_Osu1SUzUsbrj_IuldHIoBSU4591joikaraHIlmmXmPPCyLRumTOrIu9Y0vKWfS4N72B7wJA",
      "isv_acceptHeader": "*/*",
      "isv_cardType": "001",
      "isv_userAgentHeader": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36",
      "isv_tokenVerificationContext": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiI2ei93SGNLc1BtTmltdXU0T09VR3V4QUFFTmhrQ29DRSsvUWJHcm5IWTk1YTkzRm4xQTY1a1ZPRjVYcUFSUHhaUW1kUGNvVTdlblBwWk05Vmt2NkZDRTNiT0NMcjJxcFpvOEhUSVIrY2lFcU9FdjBWdTMwakR6b3Uwb25RVkRYNkpyZDgiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJ5WU9Ld2dTU090d0ZSaWNVT1Nid0taLXBndVpweV9vQ3Bmc1lZbGVwVkJSM3lULXF1Qk5aa09CelY2UHlDdzhfcS1weldFRnZ2RW1qcDJ3bndLSlF2RHVTOGxJN1JwdzZIeFlkTklUVmZpT19PeHFTdUJSbGFhM0J5dFVZUEszVkJfMjc1MkRBZkpubnNha3hyN3VuNE5wWHdfdEhHUnJBZkg2cmFrNmtKUlZsRU84UXY4Ykl2VkxTN1VSM19qdHNnTTNLcHZGci0wRFVfOGgwNGc2cnJfT3RhWF93VmlxdXdCeWp1ZGdZNE9scDYxd29pWlFhQlNVQjZPWDVLaXlORnRYNzhQX3M1OG9wdjlhQTNaN2dKTWNyUFB3UGhPa2dwbXRQUnJFTjhneFBYZkFld2ZUeFR0YUp6TmVXYWp2OUk2a3doZ2Rrc3NCRFUwYXJEVjRaUnciLCJraWQiOiIwOE52cW8wRllsZGh4MjB3MTNXaFhsZUtwWnBCd1FWRSJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NDg1NTQxNTksImlhdCI6MTY0ODU1MzI1OSwianRpIjoiWnFjT0Vjd205cFB4UnltOSJ9.FAyChQy16U6DtkTaskGynyf459KXkvOKNCzJby-u6LQ"
    }
  },
  "paymentStatus": {},
  "transactions": [],
  "interfaceInteractions": []
}

