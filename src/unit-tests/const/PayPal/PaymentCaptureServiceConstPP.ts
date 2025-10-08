import payPal from '../../JSON/payPal.json';
const payment = {
    "id": "d1ca17fc-4465-49f5-9ad6-719fc5efaf3f",
    "version": 14,
    "versionModifiedAt": "2025-03-17T16:32:26.346Z",
    "lastMessageSequenceNumber": 3,
    "createdAt": "2025-03-17T16:32:05.637Z",
    "lastModifiedAt": "2025-03-17T16:32:26.346Z",
    "lastModifiedBy": {
        "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
        "isPlatformClient": false,
        "customer": {
            "typeId": "customer",
            "id": "ba03b41a-5c8f-42ce-be17-d83c5fbfede6"
        }
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
        "centAmount": 1003800,
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
            "isv_merchantId": "wiproltd",
            "isv_saleEnabled": false,
            "isv_shippingMethod": "SINGLE",
            "isv_customerIpAddress": "192.168.1.1",
            "isv_payPalUrl": "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-4HB65878H0616622K",
            "isv_payPalRequestId": "7422291265676794604805",
            "isv_authorizationStatus": "AUTHORIZED",
            "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
            "isv_responseDateAndTime": "2025-03-17T16:32:26Z"
        }
    },
    "paymentStatus": {},
    "transactions": [
        {
            "id": "19aaac6e-2aa1-4d49-b44b-6022fa100a80",
            "timestamp": "2025-03-17T16:32:20.845Z",
            "type": "Authorization",
            "amount": {
                "type": "centPrecision",
                "currencyCode": "USD",
                "centAmount": 1003800,
                "fractionDigits": 2
            },
            "interactionId": payPal.authId,
            "state": "Success"
        }
    ],
    "interfaceInteractions": [],
    "consolidatedTime": 79
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

const authID = payPal.authId;

const authId = '7422308799416363704805';

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