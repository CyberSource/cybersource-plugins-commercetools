import googlePay from '../../JSON/googlePay.json';
const payment = {
  "id": "bbab9385-079d-4835-9101-a2bc150ac395",
  "version": 12,
  "versionModifiedAt": "2025-03-13T09:21:10.196Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-13T09:21:05.617Z",
  "lastModifiedAt": "2025-03-13T09:21:10.196Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "customer": {
          "typeId": "customer",
          "id": "5917bbf8-2b3a-4934-9dcc-cbda0778719f"
      }
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "customer": {
          "typeId": "customer",
          "id": "5917bbf8-2b3a-4934-9dcc-cbda0778719f"
      }
  },
  "customer": {
      "typeId": "customer",
      "id": "5917bbf8-2b3a-4934-9dcc-cbda0778719f"
  },
  "amountPlanned": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 501900,
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
          "id": "28bba466-fc03-4801-a823-6c7e6e3586b0"
      },
      "fields": {
          "isv_deviceFingerprintId": "083a4c13-b6f3-4a1c-8010-914e5d570124",
          "isv_token": "eyJzaWduYXR1cmUiOiJNRVVDSUJFamttQzlpL0UyRmplOXJpS281VXpGK1E4aCtyclluMjBPTUJnK2R5MzlBaUVBd2t0d1l3Zm03SXpMd0FsUkhNVlZTYWhwd1I0bjNMU3Yvem1nR2wvQndGOFx1MDAzZCIsInByb3RvY29sVmVyc2lvbiI6IkVDdjEiLCJzaWduZWRNZXNzYWdlIjoie1wiZW5jcnlwdGVkTWVzc2FnZVwiOlwidWRlMUdaWDNuaHkyNXdWc1oyUS9tQjRvcXFJNVppTFJicU42VDBGcWgwMWhOelFPUlVUb05YbTR3cnV4U0Fadm5XeDhMTkt3MkZKS2phSkdCOVdxYWxzQnJWMXVTMkhHbWZpaHVndk1GdTBMdWdtK1J0TUp3REJxV3BDbVNXLytHK0dydHkyU3g1bmlCODhVcGdkdVFUZVVRTXpDMnhMcXNiamNETWRJaFdUYXd0ZXRLZlNvOFlQYWoweUo3ZTZZTXhHYUVIVXR3bHlZVTcvYTUwdHNYOXVnLzRLV3lORTE1K2hmNlMwWE1IWE5ua3hlMTRPaW5GL0tFTTRiRHdHUkFHWjh6aWRrUXR5KzIvcTVWSEw4MXlKOUVWQmVzRkNEbnUyWC8wTXB0aGJjZi8xYU4rK0F1VVMzeGx5M2xTaWM4QVg0QWl5OHBxUTl0cU1mSlQzV1VDcHhzNzNjWWdhb2s5NUx2b0NuazhZcTM4YmdkQVVrVzF0dmJ0cDY5RjFaY0I3T1pzZG9UUC9jdHIxd2R3c2ducG9jN2tzUmU2NnhDalNVbUZrXFx1MDAzZFwiLFwiZXBoZW1lcmFsUHVibGljS2V5XCI6XCJCRmRhYThiUmg1ZEFmUnNWcmlaUnlUT0dxTDlwa0JMR2VkNlV6UDhxV21DNWpQUHVGVFNrM3lOeWNOR3VZMmNLd2xmejZzaHRSbFFFUzBmNUxWdGNXZXNcXHUwMDNkXCIsXCJ0YWdcIjpcIkZXdjN2UlU1aSs2a1IwTXc4blM0aWx3bG1reXBZa1kvOWR4MFQzOVA1cllcXHUwMDNkXCJ9In0=",
          "isv_saleEnabled": false,
          "isv_shippingMethod": "SINGLE",
          "isv_customerIpAddress": "192.168.1.1",
          "isv_maskedPan": "400000XXXXXX1000",
          "isv_AVSResponse": "1",
          "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
          "isv_responseCode": "00",
          "isv_responseDateAndTime": "2025-03-13T09:21:10Z",
          "isv_userAgentHeader": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
          "isv_cardExpiryYear": "2027",
          "isv_merchantId": "wiproltd",
          "isv_acceptHeader": "*/*",
          "isv_cardType": "001",
          "isv_authorizationStatus": "AUTHORIZED",
          "isv_cardExpiryMonth": "01"
      }
  },
  "paymentStatus": {},
  "transactions": [
      {
          "id": "3589c629-d9bc-47c8-bafe-2eba66980136",
          "timestamp": "2025-03-13T09:21:08.681Z",
          "type": "Authorization",
          "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 501900,
              "fractionDigits": 2
          },
          "interactionId": googlePay.authId,
          "state": "Success"
      }
  ],
  "interfaceInteractions": []
};

const updateTransactions = {
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

const authID = googlePay.authId;

const authId = '64008194644864627039';

const orderNo = '';

const orderNumber = '10';

export default {
  payment,
  updateTransactions,
  authID,
  authId,
  orderNo,
  orderNumber
}