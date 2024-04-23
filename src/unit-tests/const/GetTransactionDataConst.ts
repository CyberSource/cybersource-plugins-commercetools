import clickToPay from '../JSON/clickToPay.json';
export const paymentResponse = {
  httpCode: 201,
  transactionId: clickToPay.authId,
  status: 'AUTHORIZED',
  data: {
    _links: {
      self: {
        href: '/pts/v2/payments/6662486597036799103954',
        method: 'GET',
      },
      capture: {
        href: '/pts/v2/payments/6662486597036799103954/captures',
        method: 'POST',
      },
    },
    id: '6662486597036799103954',
    submitTimeUtc: '2022-10-20T06:51:00Z',
    status: 'AUTHORIZED',
    clientReferenceInformation: {
      code: '0ad553a7-edc7-4157-b5ba-22e961e71f98',
    },
    processingInformation: {
      paymentSolution: 'visacheckout',
    },
    processorInformation: {
      approvalCode: '831000',
      transactionId: '201506041511351',
      networkTransactionId: '201506041511351',
      responseCode: '00',
      avs: {
        code: '1',
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
    },
    orderInformation: {
      amountDetails: {
        authorizedAmount: '35.00',
        currency: 'USD',
      },
    },
  },
};

export const paymentResponses = {
  httpCode: 201,
  transactionId: '66624865970367991039',
  status: 'AUTHORIZED',
  data: {
    _links: {
      self: {
        href: '/pts/v2/payments/6662486597036799103954',
        method: 'GET',
      },
      capture: {
        href: '/pts/v2/payments/6662486597036799103954/captures',
        method: 'POST',
      },
    },
    id: '6662486597036799103954',
    submitTimeUtc: '2022-10-20T06:51:00Z',
    status: 'AUTHORIZED',
    clientReferenceInformation: {
      code: '0ad553a7-edc7-4157-b5ba-22e961e71f98',
    },
    processingInformation: {
      paymentSolution: 'visacheckout',
    },
    processorInformation: {
      approvalCode: '831000',
      transactionId: '201506041511351',
      networkTransactionId: '201506041511351',
      responseCode: '00',
      avs: {
        code: '1',
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
    },
    orderInformation: {
      amountDetails: {
        authorizedAmount: '35.00',
        currency: 'USD',
      },
    },
  },
};
