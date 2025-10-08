import payPal from '../../JSON/payPal.json';
const payment = {
    "id": "894515ff-a97b-4b9c-a7a7-b88dbafad781",
    "version": 17,
    "versionModifiedAt": "2025-03-17T17:05:28.176Z",
    "lastMessageSequenceNumber": 5,
    "createdAt": "2025-03-17T17:02:43.038Z",
    "lastModifiedAt": "2025-03-17T17:05:28.176Z",
    "lastModifiedBy": {
        "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
        "isPlatformClient": false
    },
    "createdBy": {
        "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
        "isPlatformClient": false,
        "customer": {
            "typeId": "customer",
            "id": "ba03b41a-5c8f-42ce-be17-d83c5fbfede6"
        }
    },
    "customer": {
        "typeId": "customer",
        "id": "ba03b41a-5c8f-42ce-be17-d83c5fbfede6"
    },
    "amountPlanned": {
        "type": "centPrecision",
        "currencyCode": "USD",
        "centAmount": 501900,
        "fractionDigits": 2
    },
    "paymentMethodInfo": {
        "paymentInterface": "cybersource",
        "method": "payPal",
        "name": {
            "en": "PayPal"
        }
    },
    "custom": {
        "type": {
            "typeId": "type",
            "id": "28bba466-fc03-4801-a823-6c7e6e3586b0"
        },
        "fields": {
            "isv_deviceFingerprintId": "c4ebb8bd-9b22-47d4-adc3-5c79dd06f276",
            "isv_merchantId": "",
            "isv_saleEnabled": false,
            "isv_shippingMethod": "SINGLE",
            "isv_customerIpAddress": "192.168.1.1",
            "isv_payPalUrl": "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-07T70146AU3926337",
            "isv_payPalRequestId": "7422309640116241304806",
            "isv_authorizationStatus": "AUTHORIZED",
            "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
            "isv_responseDateAndTime": "2025-03-17T17:03:04Z"
        }
    },
    "paymentStatus": {},
    "transactions": [
        {
            "id": "098aae9d-c43e-4844-8e95-fca055d626d8",
            "timestamp": "2025-03-17T17:02:58.431Z",
            "type": "Authorization",
            "amount": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 501900,
                "fractionDigits": 2
            },
            "interactionId": "7422309820496462104805",
            "state": "Success"
        },
        {
            "id": "b84ea47a-91a6-4ba6-908b-bdf9ae33c1a8",
            "timestamp": "2025-03-17T17:05:25.678Z",
            "type": "Charge",
            "amount": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 1200,
                "fractionDigits": 2
            },
            "interactionId": payPal.authId,
            "state": "Success"
        }
    ],
    "interfaceInteractions": [],
    "consolidatedTime": 80
};

const captureId = payPal.captureId;

const captureID = '7422312556746449304806';

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