import eCheck from '../../JSON/eCheck.json';
export const payment = {
  id: 'b793821e-c364-4166-b47f-da3f181664ed',
  version: 5,
  lastMessageSequenceNumber: 4,
  createdAt: '2022-06-09T08:56:19.561Z',
  lastModifiedAt: '2022-06-09T08:56:32.140Z',
  lastModifiedBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    anonymousId: '137e1f96-4328-4fda-85f5-b039bb640fec',
  },
  createdBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    anonymousId: '137e1f96-4328-4fda-85f5-b039bb640fec',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 2490,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'eCheck',
    name: {
      en: 'eCheck',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '87b9d9db-74a3-45d7-8e60-dde669866808',
    },
    fields: {
      isv_deviceFingerprintId: '8a031d45-3893-4ba3-9b8f-7f406c3e085f',
      isv_accountNumber: eCheck.accountNumber,
      isv_acceptHeader: '*/*',
      isv_accountType: 'C',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
      isv_customerIpAddress: '223.178.233.243',
      isv_routingNumber: eCheck.routingNumber,
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '02a4ead4-a81a-401e-acae-9bfb6edc5701',
      timestamp: '2022-06-09T08:56:21.079Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 2490,
        fractionDigits: 2,
      },
      interactionId: eCheck.captureId,
      state: 'Success',
    },
  ],
  interfaceInteractions: [],
  anonymousId: '137e1f96-4328-4fda-85f5-b039bb640fec',
};

export const paymentObject = {
  id: 'b793821e-c364-4166-b47f-da3f181664ed',
  version: 5,
  lastMessageSequenceNumber: 4,
  createdAt: '2022-06-09T08:56:19.561Z',
  lastModifiedAt: '2022-06-09T08:56:32.140Z',
  lastModifiedBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    anonymousId: '137e1f96-4328-4fda-85f5-b039bb640fec',
  },
  createdBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    anonymousId: '137e1f96-4328-4fda-85f5-b039bb640fec',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 2490,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'eCheck',
    name: {
      en: 'eCheck',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '87b9d9db-74a3-45d7-8e60-dde669866808',
    },
    fields: {
      isv_deviceFingerprintId: '8a031d45-3893-4ba3-9b8f-7f406c3e085f',
      isv_accountNumber: eCheck.accountNumber,
      isv_acceptHeader: '*/*',
      isv_accountType: 'C',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
      isv_customerIpAddress: '223.178.233.243',
      isv_routingNumber: eCheck.routingNumber,
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '02a4ead4-a81a-401e-acae-9bfb6edc5701',
      timestamp: '2022-06-09T08:56:21.079Z',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 2490,
        fractionDigits: 2,
      },
      interactionId: '654764988418617350',
      state: 'Success',
    },
  ],
  interfaceInteractions: [],
  anonymousId: '137e1f96-4328-4fda-85f5-b039bb640fec',
};

export const captureId = eCheck.captureId;

export const captureID = '63972375285265242';

export const updateTransaction = {
  id: 'c812578f-493c-4535-970e-31c210e74420',
  timestamp: '2021-12-07T09:12:49.763Z',
  type: 'Refund',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 100,
    fractionDigits: 2,
  },
  state: 'Initial',
};

export const orderNo = '';
