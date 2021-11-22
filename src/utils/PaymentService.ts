import { Constants } from '../constants';

const transactionDetails = (trasanctionData) => {
  return {
    amount: trasanctionData.amount.centAmount,
    id: trasanctionData.id,
    state: trasanctionData.state,
    type: trasanctionData.type,
  };
};

const fieldMapper = (fields) => {
  let actions = [] as any;
  const keys = Object.keys(fields);
  keys.forEach((key, index) => {
    actions.push({
      action: Constants.SET_CUSTOME_FIELD,
      name: key,
      value: fields[key],
    });
  });
  return actions;
};

function setTransactionId(paymentResponse, transactionDetail) {
  return {
    action: Constants.CHANGE_TRANSACTION_INTERACTION_ID,
    interactionId: paymentResponse.transactionId,
    transactionId: transactionDetail.id,
  };
}

function changeState(transactionDetail, state) {
  return {
    action: Constants.CHANGE_TRANSACTION_STATE,
    state: state,
    transactionId: transactionDetail.id,
  };
}

const failureResponse = (paymentResponse, transactionDetail) => {
  return {
    action: Constants.ADD_INTERFACE_INTERACTION,
    type: {
      key: Constants.ISV_PAYMENT_FAILURE,
    },
    fields: {
      reasonCode: `${paymentResponse.httpCode}`,
      transactionId: transactionDetail.id,
    },
  };
};

const visaCardDetailsAction = (visaCheckoutData) => {
  var cardPrefix = visaCheckoutData.cardFieldGroup.prefix;
  var cardSuffix = visaCheckoutData.cardFieldGroup.suffix;
  var maskedPan = cardPrefix.concat('...', cardSuffix);
  const actions = [
    {
      action: Constants.SET_CUSTOME_FIELD,
      name: Constants.ISV_MASKED_PAN,
      value: maskedPan,
    },
    {
      action: Constants.SET_CUSTOME_FIELD,
      name: Constants.ISV_CARD_EXPIRY_MONTH,
      value: visaCheckoutData.cardFieldGroup.expirationMonth,
    },
    {
      action: Constants.SET_CUSTOME_FIELD,
      name: Constants.ISV_CARD_EXPIRY_YEAR,
      value: visaCheckoutData.cardFieldGroup.expirationYear,
    },
    {
      action: Constants.SET_CUSTOME_FIELD,
      name: Constants.ISV_CARD_TYPE,
      value: visaCheckoutData.cardFieldGroup.type,
    },
  ];
  return actions;
};

const payerauthactions = (response) => {
  return {
    actions: [
      {
        action: Constants.ADD_INTERFACE_INTERACTION,
        type: { key: Constants.ISV_ENROLLMENT_CHECK },
        fields: {
          authorizationAllowed: true,
          authenticationRequired: true,
          xid: response.xid,
          authenticationTransactionId:
            response.isv_payerAuthenticationTransactionId,
          veresEnrolled: response.veresEnrolled,
          cardinalReferenceId: response.cardinalId,
          proofXml: response.proofXml,
          specificationVersion: response.specificationVersion,
        },
      },
      {
        action: Constants.SET_CUSTOME_FIELD,
        name: Constants.ISV_PAYER_AUTHENTICATION_REQUIRED,
        value: response.isv_payerAuthenticationRequired,
      },
      {
        action: Constants.SET_CUSTOME_FIELD,
        name: Constants.ISV_PAYER_AUTHETICATION_TRANSACTION_ID,
        value: response.isv_payerAuthenticationTransactionId,
      },
      {
        action: Constants.SET_CUSTOME_FIELD,
        name: Constants.ISV_ACS_URL,
        value: response.acsurl,
      },
      {
        action: Constants.SET_CUSTOME_FIELD,
        name: Constants.ISV_PAREQ,
        value: response.isv_payerAuthenticationPaReq,
      },
      {
        action: Constants.SET_CUSTOME_FIELD,
        name: Constants.ISV_MDD_3,
        value: response.stepUpUrl,
      },
      {
        action: Constants.SET_CUSTOME_FIELD,
        name: Constants.ISV_RESPONSE_JWT,
        value: response.isv_responseJwt,
      },
    ],
    errors: [],
  };
};

const getAuthResponse = (paymentResponse, transactionDetail) => {
  let response = {};
  let isv_payerAuthenticationTransactionId = Constants.EMPTY_STRING;
  let isv_payerAuthenticationRequired = false;
  let isv_requestJwt = Constants.EMPTY_STRING;
  let isv_merchantDefinedData_mddField_1 = Constants.EMPTY_STRING;
  let isv_merchantDefinedData_mddField_2 = Constants.EMPTY_STRING;
  if (Constants.API_STATUS_AUTHORIZED == paymentResponse.status) {
    const setTransaction = setTransactionId(paymentResponse, transactionDetail);
    const setCustomField = changeState(transactionDetail, Constants.SUCCESS);
    response = createResponse(
      setTransaction,
      setCustomField,
      paymentResponse.data,
      null
    );
  } else if (Constants.API_STATUS_PENDING_REVIEW == paymentResponse.status) {
    const setTransaction = setTransactionId(paymentResponse, transactionDetail);
    const setCustomField = changeState(transactionDetail, Constants.PENDING);
    response = createResponse(
      setTransaction,
      setCustomField,
      paymentResponse.data,
      null
    );
  } else if (Constants.API_STATUS_COMPLETED == paymentResponse.status) {
    isv_requestJwt = paymentResponse.accessToken;
    isv_merchantDefinedData_mddField_1 = paymentResponse.referenceId;
    isv_merchantDefinedData_mddField_2 =
      paymentResponse.deviceDataCollectionUrl;
    let actions = fieldMapper({
      isv_requestJwt,
      isv_merchantDefinedData_mddField_1,
      isv_merchantDefinedData_mddField_2,
    });
    response = {
      actions: actions,
      errors: [],
    };
  } else if (
    Constants.API_STATUS_PENDING_AUTHENTICATION == paymentResponse.status
  ) {
    const data = {
      isv_payerAuthenticationPaReq:
        paymentResponse.data.consumerAuthenticationInformation.pareq,
      isv_payerAuthenticationTransactionId:
        paymentResponse.data.consumerAuthenticationInformation
          .authenticationTransactionId,
      stepUpUrl:
        paymentResponse.data.consumerAuthenticationInformation.stepUpUrl,
      isv_responseJwt:
        paymentResponse.data.consumerAuthenticationInformation.accessToken,
      isv_payerAuthenticationRequired: true,
      xid: paymentResponse.data.consumerAuthenticationInformation.xid,
      pareq: paymentResponse.data.consumerAuthenticationInformation.pareq,
      cardinalId: paymentResponse.cardinalReferenceId,
      proofXml: paymentResponse.data.consumerAuthenticationInformation.proofXml,
      veresEnrolled:
        paymentResponse.data.consumerAuthenticationInformation.veresEnrolled,
      specificationVersion:
        paymentResponse.data.consumerAuthenticationInformation
          .specificationVersion,
      acsurl: paymentResponse.data.consumerAuthenticationInformation.acsUrl,
      authenticationTransactionId:
        paymentResponse.data.consumerAuthenticationInformation
          .authenticationTransactionId,
    };
    response = payerauthactions(data);
  } else if (
    Constants.API_STATUS_AUTHENTICATION_SUCCESSFUL == paymentResponse.status
  ) {
    isv_payerAuthenticationTransactionId =
      paymentResponse.data.consumerAuthenticationInformation
        .authenticationTransactionId;
    let actions = fieldMapper({
      isv_payerAuthenticationTransactionId,
      isv_payerAuthenticationRequired,
    });
    response = {
      actions: actions,
      errors: [],
    };
  } else {
    if (null == transactionDetail) {
      transactionDetail = null;
      response = getEmptyResponse();
    } else {
      const setTransaction = setTransactionId(
        paymentResponse,
        transactionDetail
      );
      const setCustomField = changeState(transactionDetail, Constants.FAILURE);
      const paymentFailure = failureResponse(
        paymentResponse,
        transactionDetail
      );
      response = createResponse(
        setTransaction,
        setCustomField,
        paymentResponse.data,
        paymentFailure
      );
    }
  }
  return response;
};

function createResponse(
  setTransaction,
  setCustomField,
  paymentResponse,
  paymentFailure
) {
  let actions = [] as any;
  let returnResponse = {};
  actions.push(setTransaction);
  actions.push(setCustomField);
  if (paymentFailure) {
    actions.push(paymentFailure);
  }
  returnResponse = {
    actions: actions,
    errors: [],
  };
  return returnResponse;
}

const getServiceResponse = (paymentResponse, transactionDetail) => {
  let response = {};
  if (
    Constants.API_STATUS_PENDING == paymentResponse.status ||
    Constants.API_STATUS_REVERSED == paymentResponse.status
  ) {
    const setTransaction = setTransactionId(paymentResponse, transactionDetail);
    const setCustomField = changeState(transactionDetail, Constants.SUCCESS);
    response = createResponse(
      setTransaction,
      setCustomField,
      paymentResponse.data,
      null
    );
  } else {
    const setTransaction = setTransactionId(paymentResponse, transactionDetail);
    const setCustomField = changeState(transactionDetail, Constants.FAILURE);
    const paymentFailure = failureResponse(paymentResponse, transactionDetail);
    response = createResponse(
      setTransaction,
      setCustomField,
      paymentResponse.data,
      paymentFailure
    );
  }
  return response;
};

const convertCentToAmount = (num) => {
  return (
    Number((num / Constants.VAL_HUNDRED).toFixed(Constants.VAL_TWO)) *
    Constants.VAL_ONE
  );
};

const convertAmountToCent = (amount) => {
  return Number(
    (amount.toFixed(Constants.VAL_TWO) * Constants.VAL_HUNDRED).toFixed(
      Constants.VAL_TWO
    )
  );
};

const getCapturedAmount = (refundPaymentObj) => {
  let pendingCaptureAmount = Constants.VAL_ZERO;
  const refundTransaction = refundPaymentObj.transactions;
  const index = refundTransaction.findIndex((transaction, index) => {
    if (Constants.CHARGE == transaction.type) {
      return true;
    }
    return index;
  });
  if (Constants.VAL_ZERO <= index) {
    const capturedAmount = Number(refundTransaction[index].amount.centAmount);
    let refundedAmount = 0;
    refundTransaction.forEach((transaction) => {
      if (
        Constants.REFUND == transaction.type &&
        Constants.SUCCESS == transaction.state
      ) {
        refundedAmount = refundedAmount + Number(transaction.amount.centAmount);
      }
    });
    pendingCaptureAmount = capturedAmount - refundedAmount;
    pendingCaptureAmount = convertCentToAmount(pendingCaptureAmount);
  }
  return pendingCaptureAmount;
};

const getEmptyResponse = () => {
  return {
    actions: [],
    errors: [],
  };
};

const invalidOperationResponse = () => {
  return {
    actions: [],
    errors: [
      {
        code: Constants.INVALID_OPERATION,
        message: Constants.ERROR_MSG_INVALID_OPERATION,
      },
    ],
  };
};

const invalidInputResponse = () => {
  return {
    actions: [],
    errors: [
      {
        code: Constants.INVALID_INPUT,
        message: Constants.ERROR_MSG_INVALID_INPUT,
      },
    ],
  };
};

export default {
  fieldMapper,
  transactionDetails,
  changeState,
  failureResponse,
  getAuthResponse,
  getServiceResponse,
  convertCentToAmount,
  convertAmountToCent,
  getCapturedAmount,
  payerauthactions,
  getEmptyResponse,
  visaCardDetailsAction,
  invalidOperationResponse,
  invalidInputResponse,
};
