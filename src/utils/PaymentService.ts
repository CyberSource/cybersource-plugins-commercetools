import path from 'path';
import winston from 'winston';
import { format } from 'winston';
import 'winston-daily-rotate-file';
import { Constants } from '../constants';

const { combine, printf } = format;

const logData = (fileName, methodName, type, message) => {
  const loggingFormat = printf(({ label, methodName, level, message }) => {
    return `[${label}] [${methodName}] [${level.toUpperCase()}]  : ${message}`;
  });
  const logger = winston.createLogger({
    level: type,
    format: combine(loggingFormat),
    transports: [
      new winston.transports.DailyRotateFile({
        filename: 'src/loggers/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });
  logger.log({
    label: fileName,
    methodName: methodName,
    level: type,
    message: message,
  });
};

const fieldMapper = (fields) => {
  let actions = [] as any;
  let keys: any;
  let exceptionData: any;
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_FIELD_MAPPER, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_CUSTOM_FIELDS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_FIELD_MAPPER, Constants.LOG_ERROR, exceptionData);
  }
  return actions;
};

function setTransactionId(paymentResponse, transactionDetail) {
  let exceptionData: any;
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_TRANSACTION_ID, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_TRANSACTION_ID, Constants.LOG_ERROR, exceptionData);
  }
  return transactionIdData;
}

function changeState(transactionDetail, state) {
  let exceptionData: any;
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CHANGE_STATE, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CHANGE_STATE, Constants.LOG_ERROR, exceptionData);
  }
  return changeStateData;
}

const failureResponse = (paymentResponse, transactionDetail) => {
  let exceptionData: any;
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_FAILURE_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_FAILURE_RESPONSE, Constants.LOG_ERROR, exceptionData);
  }
  return failureResponseData;
};

const visaCardDetailsAction = (visaCheckoutData) => {
  let actions: any;
  let cardPrefix: any;
  let cardSuffix: any;
  let maskedPan: any;
  let exceptionData: any;
  try {
    if (null != visaCheckoutData) {
      cardPrefix = visaCheckoutData.cardFieldGroup.prefix;
      cardSuffix = visaCheckoutData.cardFieldGroup.suffix;
      maskedPan = cardPrefix.concat(Constants.CLICK_TO_PAY_CARD_MASK, cardSuffix);
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_VISA_CARD_DETAILS_ACTION, Constants.LOG_INFO, Constants.ERROR_MSG_CLICK_TO_PAY_DATA);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_VISA_CARD_DETAILS_ACTION, Constants.LOG_ERROR, exceptionData);
  }
  return actions;
};

const payerAuthActions = (response) => {
  let action: any;
  let exceptionData: any;
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
            authenticationTransactionId: response.isv_payerAuthenticationTransactionId,
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_ACTIONS, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_ACTIONS, Constants.LOG_ERROR, exceptionData);
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
  let exceptionData: any;
  let isv_payerAuthenticationTransactionId = Constants.STRING_EMPTY;
  let isv_payerAuthenticationRequired = false;
  let isv_requestJwt = Constants.STRING_EMPTY;
  let isv_merchantDefinedData_mddField_1 = Constants.STRING_EMPTY;
  let isv_merchantDefinedData_mddField_2 = Constants.STRING_EMPTY;
  try {
    if (null != paymentResponse) {
      if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED == paymentResponse.status) {
        setTransaction = setTransactionId(paymentResponse, transactionDetail);
        setCustomField = changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_SUCCESS);
        response = createResponse(setTransaction, setCustomField, null);
      } else if (
        (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.API_STATUS_PENDING_REVIEW == paymentResponse.status) ||
        Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status
      ) {
        setTransaction = setTransactionId(paymentResponse, transactionDetail);
        setCustomField = changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_PENDING);
        response = createResponse(setTransaction, setCustomField, null);
      } else if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.API_STATUS_COMPLETED == paymentResponse.status) {
        isv_requestJwt = paymentResponse.accessToken;
        isv_merchantDefinedData_mddField_1 = paymentResponse.referenceId;
        isv_merchantDefinedData_mddField_2 = paymentResponse.deviceDataCollectionUrl;
        actions = fieldMapper({
          isv_requestJwt,
          isv_merchantDefinedData_mddField_1,
          isv_merchantDefinedData_mddField_2,
        });
        response = {
          actions: actions,
          errors: [],
        };
      } else if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.API_STATUS_PENDING_AUTHENTICATION == paymentResponse.status) {
        payerAuthenticationData = {
          isv_payerAuthenticationPaReq: paymentResponse.data.consumerAuthenticationInformation.pareq,
          isv_payerAuthenticationTransactionId: paymentResponse.data.consumerAuthenticationInformation.authenticationTransactionId,
          stepUpUrl: paymentResponse.data.consumerAuthenticationInformation.stepUpUrl,
          isv_responseJwt: paymentResponse.data.consumerAuthenticationInformation.accessToken,
          isv_payerAuthenticationRequired: true,
          xid: paymentResponse.data.consumerAuthenticationInformation.xid,
          pareq: paymentResponse.data.consumerAuthenticationInformation.pareq,
          cardinalId: paymentResponse.cardinalReferenceId,
          proofXml: paymentResponse.data.consumerAuthenticationInformation.proofXml,
          veresEnrolled: paymentResponse.data.consumerAuthenticationInformation.veresEnrolled,
          specificationVersion: paymentResponse.data.consumerAuthenticationInformation.specificationVersion,
          acsurl: paymentResponse.data.consumerAuthenticationInformation.acsUrl,
          authenticationTransactionId: paymentResponse.data.consumerAuthenticationInformation.authenticationTransactionId,
        };
        actions = payerAuthActions(payerAuthenticationData);
        response = {
          actions: actions,
          errors: [],
        };
      } else if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.API_STATUS_AUTHENTICATION_SUCCESSFUL == paymentResponse.status) {
        isv_payerAuthenticationTransactionId = paymentResponse.data.consumerAuthenticationInformation.authenticationTransactionId;
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
          setCustomField = changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE);
          paymentFailure = failureResponse(paymentResponse, transactionDetail);
          response = createResponse(setTransaction, setCustomField, paymentFailure);
        }
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_AUTH_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_AUTH_RESPONSE, Constants.LOG_ERROR, exceptionData);
  }
  return response;
};

function createResponse(setTransaction, setCustomField, paymentFailure) {
  let actions = [] as any;
  let exceptionData: any;
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
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CREATE_RESPONSE, Constants.LOG_ERROR, exceptionData);
  }
  returnResponse = {
    actions: actions,
    errors: [],
  };
  return returnResponse;
}

const getOMServiceResponse = (paymentResponse, transactionDetail) => {
  let response = {};
  let setTransaction: any;
  let setCustomField: any;
  let paymentFailure: any;
  let exceptionData: any;
  try {
    if (null != paymentResponse && null != transactionDetail) {
      if (Constants.API_STATUS_PENDING == paymentResponse.status || Constants.API_STATUS_REVERSED == paymentResponse.status) {
        setCustomField = changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_SUCCESS);
        paymentFailure = null;
      } else {
        setCustomField = changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE);
        paymentFailure = failureResponse(paymentResponse, transactionDetail);
      }
      setTransaction = setTransactionId(paymentResponse, transactionDetail);
      response = createResponse(setTransaction, setCustomField, paymentFailure);
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_SERVICE_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_SERVICE_RESPONSE, Constants.LOG_ERROR, exceptionData);
  }
  return response;
};

const convertCentToAmount = (num) => {
  let amount = Constants.VAL_ZERO;
  if (null != num) {
    amount = Number((num / Constants.VAL_HUNDRED).toFixed(Constants.VAL_TWO)) * Constants.VAL_ONE;
  }
  return amount;
};

const convertAmountToCent = (amount) => {
  let cent = Constants.VAL_ZERO;
  if (null != amount) {
    cent = Number((amount.toFixed(Constants.VAL_TWO) * Constants.VAL_HUNDRED).toFixed(Constants.VAL_TWO));
  }
  return cent;
};

const getCapturedAmount = (refundPaymentObj) => {
  let refundTransaction: any;
  let indexValue: any;
  let exceptionData: any;
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
        capturedAmount = Number(refundTransaction[indexValue].amount.centAmount);
        refundedAmount = Constants.VAL_FLOAT_ZERO;
        refundTransaction.forEach((transaction) => {
          if (Constants.CT_TRANSACTION_TYPE_REFUND == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
            refundedAmount = refundedAmount + Number(transaction.amount.centAmount);
          }
        });
        pendingCaptureAmount = capturedAmount - refundedAmount;
        pendingCaptureAmount = convertCentToAmount(pendingCaptureAmount);
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CAPTURED_AMOUNT, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CAPTURED_AMOUNT, Constants.LOG_ERROR, exceptionData);
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
  logData,
  fieldMapper,
  changeState,
  failureResponse,
  getAuthResponse,
  getOMServiceResponse,
  convertCentToAmount,
  convertAmountToCent,
  getCapturedAmount,
  payerAuthActions,
  getEmptyResponse,
  visaCardDetailsAction,
  invalidOperationResponse,
  invalidInputResponse,
};
