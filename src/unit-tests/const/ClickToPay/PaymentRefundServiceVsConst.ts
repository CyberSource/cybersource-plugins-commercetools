import clickToPay from '../../JSON/clickToPay.json';
const payment = {
  "id": "f7653d99-e765-4ab0-a9c4-d09ccbb8701b",
  "version": 8,
  "versionModifiedAt": "2025-03-17T10:17:22.560Z",
  "lastMessageSequenceNumber": 3,
  "createdAt": "2025-03-17T10:17:17.963Z",
  "lastModifiedAt": "2025-03-17T10:17:22.560Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "af1d0296-0af7-4f8b-b95d-6f773498794f"
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "af1d0296-0af7-4f8b-b95d-6f773498794f"
  },
  "amountPlanned": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 501900,
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
          "id": "28bba466-fc03-4801-a823-6c7e6e3586b0"
      },
      "fields": {
          "isv_deviceFingerprintId": "2b06fc7d-f575-4438-b543-b47f5a47b992",
          "isv_merchantId": "chtest",
          "isv_token": "6487362459229686102",
          "isv_saleEnabled": false,
          "isv_shippingMethod": "SINGLE",
          "isv_acceptHeader": "*/*",
          "isv_AVSResponse": "Y",
          "isv_authorizationStatus": "AUTHORIZED",
          "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
          "isv_responseCode": "00",
          "isv_responseDateAndTime": "2025-03-17T10:17:22Z",
          "isv_userAgentHeader": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0"
      }
  },
  "paymentStatus": {},
  "transactions": [
      {
          "id": "37e724d0-de4c-441f-b9fb-9ddad300e13d",
          "timestamp": "2025-03-17T10:17:19.286Z",
          "type": "Authorization",
          "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 501900,
              "fractionDigits": 2
          },
          "interactionId": clickToPay.captureId,
          "state": "Success"
      }
  ],
  "interfaceInteractions": [],
  "anonymousId": "af1d0296-0af7-4f8b-b95d-6f773498794f"
};

const captureId = clickToPay.captureId;

const captureID = '6397250673686731603';

const updateTransactions = {
  id: '1aae9dec-d4bc-40d3-ba7e-3f187d381b99',
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
  updateTransactions,
  orderNo,
  orderNumber
}