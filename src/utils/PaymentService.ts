import { Constants } from '../constants';

/* const transactionDetails = (trasanctionData) => {
  let transactiondetails = {
    amount: null,
    id: null,
    state: null,
    type: null,
  };
  try {
    if (null != trasanctionData) {
      transactiondetails.amount = trasanctionData.amount.centAmount;
      transactiondetails.id = trasanctionData.id;
      transactiondetails.state = trasanctionData.state;
      transactiondetails.type = trasanctionData.type;
    } else {
      console.log(Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (e) {
    console.log(Constants.STRING_ERROR, e);
  }
  return transactiondetails;
}; */

const fieldMapper = (fields) => {
  let actions = [] as any;
  let keys: any;
  try {
    keys = Object.keys(fields);
    if (null != keys) {
      keys.forEach((key, index) => {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: key,
          value: fields[key],
        });
      });
    } else {
      console.log(Constants.ERROR_MSG_EMPTY_CUSTOM_FIELDS);
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
  }
  return actions;
};

function setTransactionId(paymentResponse, transactionDetail) {
  let transactionIdData = {
    action: Constants.CHANGE_TRANSACTION_INTERACTION_ID,
    interactionId: null,
    transactionId: null,
  };
  try {
    if (null != paymentResponse && null != transactionDetail) {
      transactionIdData.interactionId = paymentResponse.transactionId;
      transactionIdData.transactionId = transactionDetail.id;
    } else {
      console.log(Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
  }
  return transactionIdData;
}

function changeState(transactionDetail, state) {
  let changeStateData = {
    action: Constants.CHANGE_TRANSACTION_STATE,
    state: null,
    transactionId: null,
  };
  try {
    if (null != transactionDetail && null != state) {
      changeStateData.state = state;
      changeStateData.transactionId = transactionDetail.id;
    } else {
      console.log(Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
  }
  return changeStateData;
}

const failureResponse = (paymentResponse, transactionDetail) => {
  let failureResponseData = {
    action: Constants.ADD_INTERFACE_INTERACTION,
    type: {
      key: Constants.ISV_PAYMENT_FAILURE,
    },
    fields: {
      reasonCode: Constants.STRING_EMPTY,
      transactionId: null,
    },
  };
  try {
    if (null != paymentResponse && null != transactionDetail) {
      failureResponseData.fields.reasonCode = `${paymentResponse.httpCode}`;
      failureResponseData.fields.transactionId = transactionDetail.id;
    } else {
      console.log(Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
  }
  return failureResponseData;
};

const visaCardDetailsAction = (visaCheckoutData) => {
  let actions: any;
  let cardPrefix: any;
  let cardSuffix: any;
  let maskedPan: any;
  try {
    if (null != visaCheckoutData) {
      cardPrefix = visaCheckoutData.cardFieldGroup.prefix;
      cardSuffix = visaCheckoutData.cardFieldGroup.suffix;
      maskedPan = cardPrefix.concat(
        Constants.CLICK_TO_PAY_CARD_MASK,
        cardSuffix
      );
      actions = [
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_MASKED_PAN,
          value: maskedPan,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_EXPIRY_MONTH,
          value: visaCheckoutData.cardFieldGroup.expirationMonth,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_EXPIRY_YEAR,
          value: visaCheckoutData.cardFieldGroup.expirationYear,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_TYPE,
          value: visaCheckoutData.cardFieldGroup.type,
        },
      ];
    } else {
      console.log(Constants.ERROR_MSG_CLICK_TO_PAY_DATA);
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
  }
  return actions;
};

const payerauthactions = (response) => {
  let action: any;
  try {
    if (null != response) {
      action = [
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
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_PAYER_AUTHENTICATION_REQUIRED,
          value: response.isv_payerAuthenticationRequired,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_PAYER_AUTHETICATION_TRANSACTION_ID,
          value: response.isv_payerAuthenticationTransactionId,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_ACS_URL,
          value: response.acsurl,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_PAREQ,
          value: response.isv_payerAuthenticationPaReq,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_MDD_3,
          value: response.stepUpUrl,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_RESPONSE_JWT,
          value: response.isv_responseJwt,
        },
      ];
    } else {
      console.log(Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
  }
  return action;
};

const getAuthResponse = (paymentResponse, transactionDetail) => {
  let response: any;
  let actions: any;
  let setTransaction: any;
  let setCustomField: any;
  let paymentFailure: any;
  let payerAuthenticationData: any;
  let isv_payerAuthenticationTransactionId = Constants.STRING_EMPTY;
  let isv_payerAuthenticationRequired = false;
  let isv_requestJwt = Constants.STRING_EMPTY;
  let isv_merchantDefinedData_mddField_1 = Constants.STRING_EMPTY;
  let isv_merchantDefinedData_mddField_2 = Constants.STRING_EMPTY;
  try {
    if (null != paymentResponse) {
      if (
        Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
        Constants.API_STATUS_AUTHORIZED == paymentResponse.status
      ) {
        setTransaction = setTransactionId(paymentResponse, transactionDetail);
        setCustomField = changeState(
          transactionDetail,
          Constants.CT_TRANSACTION_STATE_SUCCESS
        );
        response = createResponse(setTransaction, setCustomField, null);
      } else if (
        (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
          Constants.API_STATUS_PENDING_REVIEW == paymentResponse.status) ||
        Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status
      ) {
        setTransaction = setTransactionId(paymentResponse, transactionDetail);
        setCustomField = changeState(
          transactionDetail,
          Constants.CT_TRANSACTION_STATE_PENDING
        );
        response = createResponse(setTransaction, setCustomField, null);
      } else if (
        Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
        Constants.API_STATUS_COMPLETED == paymentResponse.status
      ) {
        isv_requestJwt = paymentResponse.accessToken;
        isv_merchantDefinedData_mddField_1 = paymentResponse.referenceId;
        isv_merchantDefinedData_mddField_2 =
          paymentResponse.deviceDataCollectionUrl;
        actions = fieldMapper({
          isv_requestJwt,
          isv_merchantDefinedData_mddField_1,
          isv_merchantDefinedData_mddField_2,
        });
        response = {
          actions: actions,
          errors: [],
        };
      } else if (
        Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
        Constants.API_STATUS_PENDING_AUTHENTICATION == paymentResponse.status
      ) {
        payerAuthenticationData = {
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
          proofXml:
            paymentResponse.data.consumerAuthenticationInformation.proofXml,
          veresEnrolled:
            paymentResponse.data.consumerAuthenticationInformation
              .veresEnrolled,
          specificationVersion:
            paymentResponse.data.consumerAuthenticationInformation
              .specificationVersion,
          acsurl: paymentResponse.data.consumerAuthenticationInformation.acsUrl,
          authenticationTransactionId:
            paymentResponse.data.consumerAuthenticationInformation
              .authenticationTransactionId,
        };
        actions = payerauthactions(payerAuthenticationData);
        response = {
          actions: actions,
          errors: [],
        };
      } else if (
        Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
        Constants.API_STATUS_AUTHENTICATION_SUCCESSFUL == paymentResponse.status
      ) {
        isv_payerAuthenticationTransactionId =
          paymentResponse.data.consumerAuthenticationInformation
            .authenticationTransactionId;
        actions = fieldMapper({
          isv_payerAuthenticationTransactionId,
          isv_payerAuthenticationRequired,
        });
        response = {
          actions: actions,
          errors: [],
        };
      } else {
        if (null == transactionDetail) {
          response = getEmptyResponse();
        } else {
          setTransaction = setTransactionId(paymentResponse, transactionDetail);
          setCustomField = changeState(
            transactionDetail,
            Constants.CT_TRANSACTION_STATE_FAILURE
          );
          paymentFailure = failureResponse(paymentResponse, transactionDetail);
          response = createResponse(
            setTransaction,
            setCustomField,
            paymentFailure
          );
        }
      }
    } else {
      console.log(Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
  }
  return response;
};

function createResponse(setTransaction, setCustomField, paymentFailure) {
  let actions = [] as any;
  let returnResponse = {};
  try {
    if (null != setTransaction && null != setCustomField) {
      actions.push(setTransaction);
      actions.push(setCustomField);
    }
    if (null != paymentFailure) {
      actions.push(paymentFailure);
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
  }
  returnResponse = {
    actions: actions,
    errors: [],
  };
  return returnResponse;
}

const getServiceResponse = (paymentResponse, transactionDetail) => {
  let response = {};
  let setTransaction: any;
  let setCustomField: any;
  let paymentFailure: any;
  try {
    if (null != paymentResponse && null != transactionDetail) {
      if (
        Constants.API_STATUS_PENDING == paymentResponse.status ||
        Constants.API_STATUS_REVERSED == paymentResponse.status
      ) {
        setCustomField = changeState(
          transactionDetail,
          Constants.CT_TRANSACTION_STATE_SUCCESS
        );
        paymentFailure = null;
      } else {
        setCustomField = changeState(
          transactionDetail,
          Constants.CT_TRANSACTION_STATE_FAILURE
        );
        paymentFailure = failureResponse(paymentResponse, transactionDetail);
      }
      setTransaction = setTransactionId(paymentResponse, transactionDetail);
      response = createResponse(setTransaction, setCustomField, paymentFailure);
    } else {
      console.log(Constants.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
  }
  return response;
};

const convertCentToAmount = (num) => {
  let amount = Constants.VAL_ZERO;
  if (null != num) {
    amount =
      Number((num / Constants.VAL_HUNDRED).toFixed(Constants.VAL_TWO)) *
      Constants.VAL_ONE;
  }
  return amount;
};

const convertAmountToCent = (amount) => {
  let cent = Constants.VAL_ZERO;
  if (null != amount) {
    cent = Number(
      (amount.toFixed(Constants.VAL_TWO) * Constants.VAL_HUNDRED).toFixed(
        Constants.VAL_TWO
      )
    );
  }
  return cent;
};

const getCapturedAmount = (refundPaymentObj) => {
  let refundTransaction: any;
  let indexValue: any;
  let capturedAmount = Constants.VAL_FLOAT_ZERO;
  let refundedAmount = Constants.VAL_ZERO;
  let pendingCaptureAmount = Constants.VAL_ZERO;
  try {
    if (null != refundPaymentObj) {
      refundTransaction = refundPaymentObj.transactions;
      indexValue = refundTransaction.findIndex((transaction, index) => {
        if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type) {
          return true;
        }
        return index;
      });
      if (Constants.VAL_ZERO <= indexValue) {
        capturedAmount = Number(
          refundTransaction[indexValue].amount.centAmount
        );
        refundedAmount = Constants.VAL_FLOAT_ZERO;
        refundTransaction.forEach((transaction) => {
          if (
            Constants.CT_TRANSACTION_TYPE_REFUND == transaction.type &&
            Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state
          ) {
            refundedAmount =
              refundedAmount + Number(transaction.amount.centAmount);
          }
        });
        pendingCaptureAmount = capturedAmount - refundedAmount;
        pendingCaptureAmount = convertCentToAmount(pendingCaptureAmount);
      }
    } else {
      console.log(Constants.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
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
  //transactionDetails,
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
