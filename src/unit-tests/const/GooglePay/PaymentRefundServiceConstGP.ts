import googlePay from '../../JSON/googlePay.json';
const payment = {
  "id": "b5aab355-aac2-4c07-81f5-f16edf11ab52",
  "version": 13,
  "versionModifiedAt": "2025-03-07T09:31:28.778Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-07T09:30:14.279Z",
  "lastModifiedAt": "2025-03-07T09:31:28.778Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "5c7f6567-1d8f-43ed-bb0b-6092cd8ec77c"
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "5c7f6567-1d8f-43ed-bb0b-6092cd8ec77c"
  },
  "customer": {
      "typeId": "customer",
      "id": "acbdb445-015d-4770-a6ef-dea8ed456cf6"
  },
  "amountPlanned": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 45600,
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
          "isv_deviceFingerprintId": "9d1d6fcd-0d51-48db-a013-12592c5b92dd",
          "isv_token": "eyJzaWduYXR1cmUiOiJNRVVDSUdmYzQ2U3RST0tUY0VKTE5PZHZpeE9DK1psMHlSUUZuM0UvdHdmVXdMZkdBaUVBMmV0MWRZUVRXR3k2ZisvSDFvN3R2UFpVaGxJelY5c0pDVnVkUENlaW9aY1x1MDAzZCIsInByb3RvY29sVmVyc2lvbiI6IkVDdjEiLCJzaWduZWRNZXNzYWdlIjoie1wiZW5jcnlwdGVkTWVzc2FnZVwiOlwiajhseXRhZTE2eHNtZngrUTkwWVVTd21uUXhOb0M2RnQxOEFSd3FKMUVmZGliZlp3cnlUa2dXNVpMTWExUmNjYVl2WVFHTDUyNzVKNG5rNExsYVlGcFA5WXRoZGhibVV1aTd4b3phNnFaOHVSUDJOUEgwWm1qTFI2akVFZG1hVmxka0x5OEZsTFE3WnpadXhZOWVhMmp6V3QxWnE5Yjd4UDRCb285NzVGVC8xMFRJODEzekFOTHg5OWwreWJteng1SFJrdUxsS0FmdHRBMFkxOXFENWFXcDRFbzc5OXBRNm1HSUU5MnJhTTBtUUxFS05UWko4bDVybmlNRDlTanIva1NaOVkzT3JzRTdPTkphYmZvTjBXc0tSOWJsNGNTak5lMUhnbXExOFdXRytNUXhiVlk0YnN1bjY5enFlT1ZMUXFSQkFOejV0ajBiR0VQaUNaYnBhcEFaSDU1OEtvL3dtaHZObktIWDQweHdySVJMSXdIZFBFd2toK2hlRU95NlRGOU5QVkRyeXUyNjVBaWZrUTJITGpmNHdCZnJzdkwxb3pWeFJzdDhvXFx1MDAzZFwiLFwiZXBoZW1lcmFsUHVibGljS2V5XCI6XCJCRjNmdVNDVnIxN3NGakw1TnVUdnpBRGFZcCtCMkdtUGhBVzNwVzVqb1I0QXpjT2dzTXNDUWVNWE5XbTRLeWhMSTdoOEpHMGNMWEpTd1hTN0thZXg5QUVcXHUwMDNkXCIsXCJ0YWdcIjpcIkJBUm5BS3MzN29QMk5VYzJoSTZmcS9YMSthU0VST1dMTzdRUUlneTdpelFcXHUwMDNkXCJ9In0=",
          "isv_saleEnabled": true,
          "isv_shippingMethod": "",
          "isv_customerIpAddress": "192.168.1.1",
          "isv_maskedPan": "400000XXXXXX1000",
          "isv_AVSResponse": "1",
          "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
          "isv_responseCode": "00",
          "isv_responseDateAndTime": "2025-03-07T09:30:23Z",
          "isv_userAgentHeader": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
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
          "id": "edae9199-010d-4dbf-921d-980cf9e26e74",
          "timestamp": "2025-03-07T09:30:22.518Z",
          "type": "Charge",
          "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 45600,
              "fractionDigits": 2
          },
          "interactionId": googlePay.captureId,
          "state": "Success"
      }
  ],
  "interfaceInteractions": [],
  "anonymousId": "5c7f6567-1d8f-43ed-bb0b-6092cd8ec77c"
};

const captureId = googlePay.captureId;

const captureID = '64009063539269775034';

const updateTransaction = {
  id: '05d19a9b-fcb7-4c0a-bef7-5ddf0e3afc8e',
  timestamp: '2021-12-22T05:34:24.008Z',
  type: 'Refund',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 100,
    fractionDigits: 2,
  },
  state: 'Initial',
};

const orderNo = '';

const orderNumber = '10';

export default {
  payment,
  captureId,
  captureID,
  updateTransaction,
  orderNo,
  orderNumber
}