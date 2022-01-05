export const payment = {
    id: '779f9ebb-27f8-45af-b966-56fc7c54c340',
    version: 12,
    lastMessageSequenceNumber: 6,
    createdAt: '2021-11-10T06:15:42.254Z',
    lastModifiedAt: '2021-11-10T07:16:42.046Z',
    lastModifiedBy: { clientId: '4OdEsQlt0ZNkkwpineHHUy3h', isPlatformClient: false },
    createdBy: {
      clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
      isPlatformClient: false,
      anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc'
    },
    amountPlanned: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 6970,
      fractionDigits: 2
    },
    paymentMethodInfo: { paymentInterface: 'cybersource', method: 'visaCheckout' },
    custom: {
      type: { typeId: 'type', id: '28701886-4e26-4cab-924e-9b0da3829f88' },
      fields: {
        isv_cardExpiryYear: '25  ',
        isv_token: '4304492039459355101',
        isv_cardType: '001',
        isv_maskedPan: '411111...1111',
        isv_cardExpiryMonth: '05'
      }
    },
    paymentStatus: {},
    transactions: [
      {
        id: '598400c2-794b-4d01-aa56-85b546faec20',
        type: 'Authorization',
        amount: [Object],
        interactionId: '6365249466406423103955',
        state: 'Success'
      },
      {
        id: 'eeaa46c0-e6a1-4bc2-8b88-7fe73f772815',
        type: 'Charge',
        amount: [Object],
        interactionId: '6397250673686731603955',
        state: 'Success'
      }
    ],
    interfaceInteractions: [],
    anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc'
  }

  export const captureId = '6397250673686731603955';

  export const captureID = '6397250673686731603';

  export const updateTransactions = {
    id: '1aae9dec-d4bc-40d3-ba7e-3f187d381b99',
    type: 'Refund',
    amount: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 6970,
      fractionDigits: 2
    },
    state: 'Initial'
  }