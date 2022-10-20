import crypto from 'crypto';
import path from 'path';
import winston from 'winston';
import WinstonCloudwatch from 'winston-cloudwatch';
import { format } from 'winston';
import 'winston-daily-rotate-file';
import { Constants } from '../constants';

const { combine, printf } = format;

const logData = (fileName, methodName, type, id, message) => {
  let loggingFormat;
  let logger;
  if(null != id && Constants.STRING_EMPTY != id){
    loggingFormat = printf(({ label, methodName, level, message }) => {
      return `[${new Date(Date.now()).toISOString()}] [${label}] [${methodName}] [${level.toUpperCase()}] [${id}] : ${message}`;
    });
  }
  else{
    loggingFormat = printf(({ label, methodName, level, message }) => {
      return `[${new Date(Date.now()).toISOString()}] [${label}] [${methodName}] [${level.toUpperCase()}]  : ${message}`;
    });
  }
  if(process.env.PAYMENT_GATEWAY_ENABLE_CLOUD_LOGS == Constants.STRING_TRUE){
    logger = winston.createLogger({
      level: type,
      format: combine(loggingFormat),
      transports: [
        new WinstonCloudwatch({
          awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID_VALUE,
          awsSecretKey: process.env.AWS_SECRET_KEY_VALUE,
          logGroupName: Constants.STRING_MY_APPLICATION,
          logStreamName: function () {
            let date = new Date().toISOString().split('T')[Constants.VAL_ZERO]
            return Constants.STRING_MY_REQUESTS + date
          },
          awsRegion: process.env.AWS_REGION_NAME,
          jsonMessage: true
        })
      ],
    });
  }
  else{
    logger = winston.createLogger({
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
  }
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_FIELD_MAPPER, Constants.LOG_INFO, null, Constants.ERROR_MSG_EMPTY_CUSTOM_FIELDS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_FIELD_MAPPER, Constants.LOG_ERROR, null, exceptionData);
  }
  return actions;
};

const fieldMapperNull = (fields) => {
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
          value: null,
        });
      });
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_FIELD_MAPPER_NULL, Constants.LOG_INFO, null, Constants.ERROR_MSG_EMPTY_CUSTOM_FIELDS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_FIELD_MAPPER_NULL, Constants.LOG_ERROR, null, exceptionData);
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_TRANSACTION_ID, Constants.LOG_INFO, null, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_TRANSACTION_ID, Constants.LOG_ERROR, null, exceptionData);
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CHANGE_STATE, Constants.LOG_INFO, null, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CHANGE_STATE, Constants.LOG_ERROR, null, exceptionData);
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_FAILURE_RESPONSE, Constants.LOG_INFO, null, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_FAILURE_RESPONSE, Constants.LOG_ERROR, null, exceptionData);
  }
  return failureResponseData;
};

const visaCardDetailsAction = (visaCheckoutData) => {
  let actions = [] as any;
  let cardPrefix: any;
  let cardSuffix: any;
  let maskedPan: any;
  let exceptionData: any;
  try {
    if (null != visaCheckoutData && visaCheckoutData.hasOwnProperty(Constants.CARD_FIELD_GROUP) && Constants.VAL_ZERO < Object.keys(visaCheckoutData.cardFieldGroup).length) {
      if (visaCheckoutData.cardFieldGroup.hasOwnProperty(Constants.STRING_PREFIX) && null != visaCheckoutData.cardFieldGroup.prefix && visaCheckoutData.cardFieldGroup.hasOwnProperty(Constants.STRING_SUFFIX) && null != visaCheckoutData.cardFieldGroup.suffix) {
        cardPrefix = visaCheckoutData.cardFieldGroup.prefix;
        cardSuffix = visaCheckoutData.cardFieldGroup.suffix;
        maskedPan = cardPrefix.concat(Constants.CLICK_TO_PAY_CARD_MASK, cardSuffix);
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_MASKED_PAN,
          value: maskedPan,
        });
      }
      if (visaCheckoutData.cardFieldGroup.hasOwnProperty(Constants.STRING_EXPIRATION_MONTH) && null != visaCheckoutData.cardFieldGroup.expirationMonth) {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_EXPIRY_MONTH,
          value: visaCheckoutData.cardFieldGroup.expirationMonth,
        });
      }
      if (visaCheckoutData.cardFieldGroup.hasOwnProperty(Constants.STRING_EXPIRATION_YEAR) && null != visaCheckoutData.cardFieldGroup.expirationYear) {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_EXPIRY_YEAR,
          value: visaCheckoutData.cardFieldGroup.expirationYear,
        });
      }
      if (visaCheckoutData.cardFieldGroup.hasOwnProperty(Constants.TYPE_ID_TYPE) && null != visaCheckoutData.cardFieldGroup.type) {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_TYPE,
          value: visaCheckoutData.cardFieldGroup.type,
        });
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_VISA_CARD_DETAILS_ACTION, Constants.LOG_INFO, null, Constants.ERROR_MSG_CLICK_TO_PAY_DATA);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_VISA_CARD_DETAILS_ACTION, Constants.LOG_ERROR, null, exceptionData);
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
          type: { key: Constants.ISV_ENROLMENT_CHECK },
          fields: {
            authorizationAllowed: true,
            authenticationRequired: true,
            xid: response.xid,
            paReq: response.pareq,
            acsUrl: response.acsurl,
            authenticationTransactionId: response.authenticationTransactionId,
            veresEnrolled: response.veresEnrolled,
            cardinalReferenceId: response.cardinalId,
            proofXml: response.proofXml,
            specificationVersion: response.specificationVersion,
            directoryServerTransactionId: response.directoryServerTransactionId,
          },
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_PAYER_AUTHENTICATION_REQUIRED,
          value: response.isv_payerAuthenticationRequired,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_PAYER_AUTHENTICATION_TRANSACTION_ID,
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
          name: Constants.ISV_STEPUP_URL,
          value: response.stepUpUrl,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_RESPONSE_JWT,
          value: response.isv_responseJwt,
        },
      ];
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_ACTIONS, Constants.LOG_INFO, null, Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_ACTIONS, Constants.LOG_ERROR, null, exceptionData);
  }
  return action;
};

const payerEnrollActions = (response, updatePaymentObj) => {
  let action: any;
  let exceptionData: any;
  let consumerErrorData: any;
  let isv_payerAuthenticationTransactionId = null;
  let isv_cardinalReferenceId = null;
  let isv_deviceDataCollectionUrl = null;
  let isv_requestJwt = null;
  let isv_responseJwt = null;
  let isv_stepUpUrl = null;
  let isv_payerAuthenticationPaReq = null;
  let isv_payerAuthenticationRequired = false;
  try {
    if (null != response) {
      action = {
        actions: [
          {
            action: Constants.SET_CUSTOM_FIELD,
            name: Constants.ISV_PAYER_AUTHENTICATION_ENROLL_TRANSACTION_ID,
            value: response.transactionId,
          },
          {
            action: Constants.SET_CUSTOM_FIELD,
            name: Constants.ISV_PAYER_AUTHENTICATION_ENROLL_HTTP_CODE,
            value: response.httpCode,
          },
          {
            action: Constants.SET_CUSTOM_FIELD,
            name: Constants.ISV_PAYER_AUTHENTICATION_ENROLL_STATUS,
            value: response.status,
          },
        ],
        errors: [],
      };
      if (response.httpCode == Constants.HTTP_CODE_TWO_HUNDRED_ONE && response.status == Constants.API_STATUS_AUTHORIZED) {
        isv_payerAuthenticationTransactionId = response.data.consumerAuthenticationInformation.authenticationTransactionId;
        action.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_PAYER_AUTHENTICATION_TRANSACTION_ID,
          value: isv_payerAuthenticationTransactionId,
        });
      }
      if (Constants.ISV_CAPTURE_CONTEXT_SIGNATURE in updatePaymentObj.custom.fields && null != updatePaymentObj.custom.fields.isv_tokenCaptureContextSignature) {
        action.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CAPTURE_CONTEXT_SIGNATURE,
          value: null,
        });
      }
      if (
        Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields &&
        Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_savedToken &&
        Constants.ISV_TOKEN_VERIFICATION_CONTEXT in updatePaymentObj.custom.fields &&
        null != updatePaymentObj.custom.fields.isv_tokenVerificationContext &&
        Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_tokenVerificationContext
      ) {
        action.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_TOKEN_VERIFICATION_CONTEXT,
          value: null,
        });
      }
      isv_payerAuthenticationRequired = Constants.API_STATUS_PENDING_AUTHENTICATION == response.status ? true : updatePaymentObj.custom.fields.isv_payerAuthenticationRequired ? true : false;
      action.actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: Constants.ISV_PAYER_AUTHENTICATION_REQUIRED,
        value: isv_payerAuthenticationRequired,
      });
      if (
        response.httpCode == Constants.HTTP_CODE_TWO_HUNDRED_ONE &&
        response.data.hasOwnProperty(Constants.ERROR_INFORMATION) &&
        Constants.VAL_ZERO < Object.keys(response.data.errorInformation).length &&
        response.data.errorInformation.hasOwnProperty(Constants.STRING_REASON) &&
        Constants.VAL_ZERO < Object.keys(response.data.errorInformation.reason).length &&
        Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED == response.data.errorInformation.reason
      ) {
        action.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_PAYER_AUTHENTICATION_ENROLL_STATUS,
          value: response.data.errorInformation.reason,
        });
        if (updatePaymentObj.custom.fields.isv_payerAuthenticationRequired) {
          consumerErrorData = fieldMapperNull({
            isv_payerAuthenticationTransactionId,
            isv_cardinalReferenceId,
            isv_deviceDataCollectionUrl,
            isv_requestJwt,
            isv_responseJwt,
            isv_stepUpUrl,
            isv_payerAuthenticationPaReq,
          });
          consumerErrorData.forEach((i) => {
            action.actions.push(i);
          });
        } else {
          consumerErrorData = fieldMapperNull({
            isv_cardinalReferenceId,
            isv_deviceDataCollectionUrl,
            isv_requestJwt,
          });
          consumerErrorData.forEach((i) => {
            action.actions.push(i);
          });
        }
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_ENROLL_ACTIONS, Constants.LOG_INFO, null, Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_ENROLL_ACTIONS, Constants.LOG_ERROR, null, exceptionData);
  }
  return action;
};

const getUpdateTokenActions = (actions, existingFailedTokensMap, errorFlag) => {
  let returnResponse: any;
  if (errorFlag) {
    returnResponse = {
      actions: [
        {
          action: Constants.SET_CUSTOM_TYPE,
          type: {
            key: Constants.ISV_PAYMENTS_CUSTOMER_TOKENS,
            typeId: Constants.TYPE_ID_TYPE,
          },
          fields: {
            isv_tokens: actions,
            isv_tokenUpdated: false,
            isv_failedTokens: existingFailedTokensMap,
          },
        },
      ],
      errors: [],
    };
  } else {
    returnResponse = {
      actions: [
        {
          action: Constants.SET_CUSTOM_TYPE,
          type: {
            key: Constants.ISV_PAYMENTS_CUSTOMER_TOKENS,
            typeId: Constants.TYPE_ID_TYPE,
          },
          fields: {
            isv_tokens: actions,
            isv_tokenUpdated: true,
            isv_failedTokens: existingFailedTokensMap,
          },
        },
      ],
      errors: [],
    };
  }
  return returnResponse;
};

const getAuthResponse = (paymentResponse, transactionDetail) => {
  let response: any;
  let actions: any;
  let setTransaction: any;
  let setCustomField: any;
  let paymentFailure: any;
  let payerAuthenticationData: any;
  let exceptionData: any;
  let isv_requestJwt = Constants.STRING_EMPTY;
  let isv_cardinalReferenceId = Constants.STRING_EMPTY;
  let isv_deviceDataCollectionUrl = Constants.STRING_EMPTY;
  try {
    if (null != paymentResponse) {
      if (
        Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
        null != transactionDetail &&
        (Constants.API_STATUS_AUTHORIZED == paymentResponse.status || Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status || Constants.API_STATUS_PENDING == paymentResponse.status)
      ) {
        setTransaction = setTransactionId(paymentResponse, transactionDetail);
        if (Constants.CT_TRANSACTION_TYPE_CHARGE == transactionDetail.type && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status) {
          setCustomField = changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE);
        } else {
          setCustomField = changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_SUCCESS);
        }
        response = createResponse(setTransaction, setCustomField, null);
      } else if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == paymentResponse.status || Constants.API_STATUS_PENDING_REVIEW == paymentResponse.status) && null != transactionDetail) {
        setTransaction = setTransactionId(paymentResponse, transactionDetail);
        setCustomField = changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_PENDING);
        response = createResponse(setTransaction, setCustomField, null);
      } else if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.API_STATUS_COMPLETED == paymentResponse.status) {
        isv_requestJwt = paymentResponse.accessToken;
        isv_cardinalReferenceId = paymentResponse.referenceId;
        isv_deviceDataCollectionUrl = paymentResponse.deviceDataCollectionUrl;
        actions = fieldMapper({
          isv_requestJwt,
          isv_cardinalReferenceId,
          isv_deviceDataCollectionUrl,
        });
        response = {
          actions: actions,
          errors: [],
        };
      } else if (
        Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
        Constants.API_STATUS_PENDING_AUTHENTICATION == paymentResponse.status &&
        paymentResponse.hasOwnProperty(Constants.STRING_DATA) &&
        Constants.VAL_ZERO < Object.keys(paymentResponse.data).length &&
        paymentResponse.data.hasOwnProperty(Constants.STRING_CONSUMER_AUTHENTICATION) &&
        Constants.VAL_ZERO < Object.keys(paymentResponse.data.consumerAuthenticationInformation).length
      ) {
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
          directoryServerTransactionId: paymentResponse.data.consumerAuthenticationInformation.directoryServerTransactionId,
        };
        actions = payerAuthActions(payerAuthenticationData);
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_AUTH_RESPONSE, Constants.LOG_INFO, null, Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_AUTH_RESPONSE, Constants.LOG_ERROR, null, exceptionData);
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
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CREATE_RESPONSE, Constants.LOG_ERROR, null, exceptionData);
  }
  returnResponse = {
    actions: actions,
    errors: [],
  };
  return returnResponse;
}

const getOMServiceResponse = (paymentResponse, transactionDetail) => {
  let setTransaction: any;
  let setCustomField: any;
  let paymentFailure: any;
  let exceptionData: any;
  let response = {};
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_SERVICE_RESPONSE, Constants.LOG_INFO, null, Constants.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_SERVICE_RESPONSE, Constants.LOG_ERROR, null, exceptionData);
  }
  return response;
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
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CAPTURED_AMOUNT, Constants.LOG_INFO, null, Constants.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CAPTURED_AMOUNT, Constants.LOG_ERROR, null, exceptionData);
  }
  return pendingCaptureAmount;
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

const roundOff = (amount) => {
  let value = Constants.VAL_FLOAT_ZERO;
  value = Math.round(amount * Constants.VAL_HUNDRED) / Constants.VAL_HUNDRED;
  return value;
};

const getSubstring = (firstIndex, lastIndex, input) => {
  let subString = Constants.STRING_EMPTY;
  subString = input.substring(firstIndex, lastIndex);
  return subString;
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
const encryption = (data) => {
  let key:any;
  let baseEncodedData:any;
  let exceptionData:any;
  let encryption:any
  let encryptStringData:any;
  try{
    if(data){
      key = process.env.CT_CLIENT_SECRET;
      const iv = crypto.randomBytes(Constants.VAL_TWELVE);
      const cipher = crypto.createCipheriv(Constants.HEADER_ENCRYPTION_ALGORITHM, key, iv);
      encryption = cipher.update(data, Constants.UNICODE_ENCODING_SYSTEM, Constants.ENCODING_BASE_SIXTY_FOUR);
      encryption += cipher.final(Constants.ENCODING_BASE_SIXTY_FOUR);
      const authTag = cipher.getAuthTag();
      encryptStringData = iv.toString(Constants.HEX)+Constants.STRING_FULLCOLON+encryption.toString()+Constants.STRING_FULLCOLON+authTag.toString(Constants.HEX);
      baseEncodedData = (Buffer.from(encryptStringData)).toString(Constants.ENCODING_BASE_SIXTY_FOUR);
    }
  }catch(exception){
    baseEncodedData = null;
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DECRYPTION, Constants.LOG_ERROR, null, exceptionData);
  }
  return baseEncodedData;
};

const decryption = (encodedCredentials) => {
  let key:any;
  let data:any;
  let decryptedData:any;
  let encryptedData:any;
  let exceptionData:any;
  let ivBuff:any;
  let authTagBuff:any;
  try{
    if(encodedCredentials){
      key = process.env.CT_CLIENT_SECRET;
      data = (Buffer.from(encodedCredentials, Constants.ENCODING_BASE_SIXTY_FOUR)).toString(Constants.ASCII);
      ivBuff = Buffer.from(data.split(Constants.STRING_FULLCOLON)[Constants.VAL_ZERO], Constants.HEX);
      encryptedData = data.split(Constants.STRING_FULLCOLON)[Constants.VAL_ONE];
      authTagBuff = Buffer.from(data.split(Constants.STRING_FULLCOLON)[Constants.VAL_TWO], Constants.HEX);
      const decipher = crypto.createDecipheriv(Constants.HEADER_ENCRYPTION_ALGORITHM, key, ivBuff);
      decipher.setAuthTag(authTagBuff);
      decryptedData = decipher.update(encryptedData, Constants.ENCODING_BASE_SIXTY_FOUR, Constants.UNICODE_ENCODING_SYSTEM);
      decryptedData += decipher.final(Constants.UNICODE_ENCODING_SYSTEM);
    }
  }catch(exception){
    decryptedData = null;
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DECRYPTION, Constants.LOG_ERROR, null, exceptionData);
  }
  return decryptedData;
};

export default {
  logData,
  fieldMapper,
  changeState,
  failureResponse,
  visaCardDetailsAction,
  payerAuthActions,
  payerEnrollActions,
  getUpdateTokenActions,
  getAuthResponse,
  getOMServiceResponse,
  getCapturedAmount,
  convertCentToAmount,
  convertAmountToCent,
  getSubstring,
  getEmptyResponse,
  invalidOperationResponse,
  invalidInputResponse,
  roundOff,
  encryption,
  decryption
};
