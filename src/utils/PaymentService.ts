import crypto from 'crypto';
import path from 'path';
import winston from 'winston';
import WinstonCloudwatch from 'winston-cloudwatch';
import { format } from 'winston';
import 'winston-daily-rotate-file';
import { Constants } from '../constants';
import clickToPay from '../service/payment/ClickToPayDetails';
import paymentAuthSetUp from '../service/payment/PayerAuthenticationSetupService';
import paymentAuthorization from './../service/payment/PaymentAuthorizationService';
import paymentRefund from './../service/payment/PaymentRefundService';
import { stringify } from 'flatted';
import commercetoolsApi from './../utils/api/CommercetoolsApi';
import multiMid from './config/MultiMid';
import createSearchRequest from '../service/payment/CreateTransactionSearchRequest';
import axios from 'axios';
import paymentAuthReversal from './../service/payment/PaymentAuthorizationReversal';
import { AzureBlobTransport } from 'winston-azure-transport';
import getTransientTokenData from '../service/payment/GetTransientTokenData';

const { combine, printf } = format;

const logData = (fileName, methodName, type, id, message) => {
  let loggingFormat;
  let logger;
  let containerUrlString: any;
  let localDeployment = true;
  if (null != id && Constants.STRING_EMPTY != id) {
    loggingFormat = printf(({ label, methodName, level, message }) => {
      return `[${new Date(Date.now()).toISOString()}] [${label}] [${methodName}] [${level.toUpperCase()}] [${id}] : ${message}`;
    });
  } else {
    loggingFormat = printf(({ label, methodName, level, message }) => {
      return `[${new Date(Date.now()).toISOString()}] [${label}] [${methodName}] [${level.toUpperCase()}]  : ${message}`;
    });
  }
  if (Constants.STRING_AWS == process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT && Constants.STRING_TRUE == process.env.AWS_ENABLE_LOGS) {
    localDeployment = false;
    logger = winston.createLogger({
      level: type,
      format: combine(loggingFormat),
      transports: [
        new WinstonCloudwatch({
          awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
          awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
          logGroupName: 'my-application',
          logStreamName: function () {
            let date = new Date().toISOString().split('T')[Constants.VAL_ZERO];
            return Constants.STRING_MY_REQUESTS + date;
          },
          awsRegion: process.env.AWS_REGION,
          jsonMessage: true,
        }),
      ],
    });
  }
  if (Constants.STRING_AZURE == process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT && Constants.STRING_TRUE == process.env.AZURE_ENABLE_LOGS && undefined != process.env.AZURE_CONTAINER_URL && Constants.STRING_EMPTY != process.env.AZURE_CONTAINER_URL) {
    localDeployment = false;
    containerUrlString = process.env.AZURE_CONTAINER_URL;
    logger = winston.createLogger({
      level: type,
      format: combine(loggingFormat),
      transports: [
        new AzureBlobTransport({
          containerUrl: containerUrlString,
          nameFormat: getFileName(),
          retention: 365,
        }),
      ],
    });
  }
  if (localDeployment) {
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
  if (null != id && Constants.STRING_EMPTY != id) {
    logger.log({
      label: fileName,
      methodName: methodName,
      level: type,
      id: id,
      message: message,
    });
  } else {
    logger.log({
      label: fileName,
      methodName: methodName,
      level: type,
      message: message,
    });
  }
};

const getFileName = () => {
  const date = new Date().toISOString().split('T')[Constants.VAL_ZERO];
  return Constants.STRING_MY_REQUESTS + date + '.log';
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
      if (visaCheckoutData.cardFieldGroup.hasOwnProperty('prefix') && null != visaCheckoutData.cardFieldGroup.prefix && visaCheckoutData.cardFieldGroup.hasOwnProperty('suffix') && null != visaCheckoutData.cardFieldGroup.suffix) {
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
      if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == response.httpCode && Constants.API_STATUS_AUTHORIZED == response.status) {
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
        Constants.HTTP_CODE_TWO_HUNDRED_ONE == response.httpCode &&
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

const getUpdateTokenActions = (actions, existingFailedTokensMap, errorFlag, customerObj, address) => {
  let returnResponse: any;
  if (customerObj?.custom && customerObj.custom.fields?.isv_tokens) {
    returnResponse = {
      actions: [
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_TOKENS,
          value: JSON.parse(JSON.stringify(actions)),
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_TOKEN_UPDATED,
          value: !errorFlag,
        },
      ],
    };
    if (undefined != existingFailedTokensMap && null != existingFailedTokensMap) {
      returnResponse.actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: Constants.ISV_FAILED_TOKENS,
        value: existingFailedTokensMap,
      });
    }
    if (customerObj.custom.fields?.isv_tokenAction && Constants.STRING_EMPTY != customerObj.custom.fields.isv_tokenAction) {
      returnResponse.actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: Constants.ISV_TOKEN_ACTION,
        value: Constants.STRING_EMPTY,
      });
      if (customerObj.custom.fields?.isv_cardNewExpiryYear)
        returnResponse.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_NEW_EXPIRY_YEAR,
          value: Constants.STRING_EMPTY,
        });
      if (customerObj.custom.fields?.isv_cardNewExpiryMonth)
        returnResponse.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_NEW_EXPIRY_MONTH,
          value: Constants.STRING_EMPTY,
        });
    }
    if (customerObj.custom.fields?.isv_tokenAlias && Constants.STRING_EMPTY != customerObj.custom.fields.isv_tokenAlias) {
      returnResponse.actions.push(
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_TOKEN_ALIAS,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_TYPE,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_EXPIRY_YEAR,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_EXPIRY_MONTH,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_ADDRESS_ID,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CURRENCY_CODE,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_DEVICE_FINGERPRINT_ID,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_TOKEN,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_MASKED_PAN,
          value: Constants.STRING_EMPTY,
        }
      );
    }
    if (null != address && undefined != address) {
      returnResponse.actions.push(
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_ADDRESS_ID,
          value: Constants.STRING_EMPTY,
        })
    }
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
            isv_tokenUpdated: !errorFlag,
            isv_failedTokens: existingFailedTokensMap,
          },
        },
      ],
      errors: [],
    };
  }
  if (null != address && undefined != address) {
    returnResponse.actions.push({
      action: Constants.ADD_ADDRESS,
      address: {
        firstName: address.firstName,
        lastName: address.lastName,
        country: address.country,
        streetName: address.address1,
        streetNumber: address.buildingNumber,
        postalCode: address.postalCode,
        city: address.locality,
        region: address.administrativeArea,
        email: address.email,
      },
    })
  }
  return returnResponse;
};

const getUpdateTokenActionsWithAddress = (actions, existingFailedTokensMap, errorFlag, address, customerObj) => {
  let returnResponse: any;
  if (customerObj?.custom && customerObj?.custom?.fields?.isv_tokens) {
    returnResponse = {
      actions: [
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_TOKENS,
          value: JSON.parse(JSON.stringify(actions)),
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_TOKEN_UPDATED,
          value: !errorFlag,
        },
      ],
    };
    if (undefined != existingFailedTokensMap && null != existingFailedTokensMap) {
      returnResponse.actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: Constants.ISV_FAILED_TOKENS,
        value: existingFailedTokensMap,
      });
    }
    if (customerObj.custom.fields?.isv_tokenAction && Constants.STRING_EMPTY != customerObj.custom.fields.isv_tokenAction) {
      returnResponse.actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: Constants.ISV_TOKEN_ACTION,
        value: Constants.STRING_EMPTY,
      });
      if (customerObj.custom.fields?.isv_cardNewExpiryYear)
        returnResponse.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_NEW_EXPIRY_YEAR,
          value: Constants.STRING_EMPTY,
        });
      if (customerObj.custom.fields?.isv_cardNewExpiryMonth)
        returnResponse.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_NEW_EXPIRY_MONTH,
          value: Constants.STRING_EMPTY,
        });
    }
    if (customerObj.custom.fields?.isv_tokenAlias && Constants.STRING_EMPTY != customerObj.custom.fields.isv_tokenAlias) {
      returnResponse.actions.push(
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_TOKEN_ALIAS,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_TYPE,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_EXPIRY_YEAR,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_EXPIRY_MONTH,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CURRENCY_CODE,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_DEVICE_FINGERPRINT_ID,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_TOKEN,
          value: Constants.STRING_EMPTY,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_MASKED_PAN,
          value: Constants.STRING_EMPTY,
        }
      );
    }
    if (null != address && undefined != address) {
      returnResponse.actions.push({
        action: Constants.ADD_ADDRESS,
        address: {
          firstName: address.firstName,
          lastName: address.lastName,
          country: address.country,
          streetName: address.address1,
          streetNumber: address.buildingNumber,
          postalCode: address.postalCode,
          city: address.locality,
          region: address.administrativeArea,
          email: address.email,
        },
      },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_ADDRESS_ID,
          value: '',
        })
    }
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
            isv_tokenUpdated: false,
            isv_failedTokens: existingFailedTokensMap,
          },
        },
        {
          action: Constants.ADD_ADDRESS,
          address: {
            firstName: address.firstName,
            lastName: address.lastName,
            country: address.country,
            streetName: address.address1,
            streetNumber: address.buildingNumber,
            postalCode: address.postalCode,
            city: address.locality,
            region: address.administrativeArea,
            email: address.email,
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
        response = createResponse(setTransaction, setCustomField, null, null);
      } else if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == paymentResponse.status || Constants.API_STATUS_PENDING_REVIEW == paymentResponse.status) && null != transactionDetail) {
        setTransaction = setTransactionId(paymentResponse, transactionDetail);
        setCustomField = changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_PENDING);
        response = createResponse(setTransaction, setCustomField, null, null);
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
        paymentResponse.hasOwnProperty('data') &&
        Constants.VAL_ZERO < Object.keys(paymentResponse.data).length &&
        paymentResponse.data.hasOwnProperty('consumerAuthenticationInformation') &&
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
          response = createResponse(setTransaction, setCustomField, paymentFailure, null);
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

function createResponse(setTransaction, setCustomField, paymentFailure, setCustomType) {
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
    if (null != setCustomType) {
      actions.push(setCustomType);
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

const getOMServiceResponse = (paymentResponse, transactionDetail, captureId, pendingAmount) => {
  let setTransaction: any;
  let setCustomField: any;
  let paymentFailure: any;
  let setCustomType: any;
  let exceptionData: any;
  let response = {};
  try {
    if (null != paymentResponse && null != transactionDetail) {
      if (Constants.API_STATUS_PENDING == paymentResponse.status || Constants.API_STATUS_REVERSED == paymentResponse.status) {
        setCustomField = changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_SUCCESS);
        if (null != captureId && null != pendingAmount && pendingAmount >= 0) {
          setCustomType = setCustomTypeData(captureId, pendingAmount);
        }
        paymentFailure = null;
      } else {
        setCustomField = changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE);
        paymentFailure = failureResponse(paymentResponse, transactionDetail);
      }
      setTransaction = setTransactionId(paymentResponse, transactionDetail);
      response = createResponse(setTransaction, setCustomField, paymentFailure, setCustomType);
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
  let fractionDigits = Constants.VAL_ZERO;
  try {
    if (null != refundPaymentObj) {
      fractionDigits = refundPaymentObj.amountPlanned.fractionDigits;
      refundTransaction = refundPaymentObj.transactions;
      indexValue = refundTransaction.findIndex((transaction, index) => {
        if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type) {
          return true;
        }
        return index;
      });
      if (Constants.VAL_ZERO <= indexValue) {
        refundTransaction.forEach((transaction) => {
          if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
            capturedAmount = capturedAmount + Number(transaction.amount.centAmount);
          }
        });
        refundedAmount = Constants.VAL_FLOAT_ZERO;
        refundTransaction.forEach((transaction) => {
          if (Constants.CT_TRANSACTION_TYPE_REFUND == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
            refundedAmount = refundedAmount + Number(transaction.amount.centAmount);
          }
        });
        pendingCaptureAmount = capturedAmount - refundedAmount;
        pendingCaptureAmount = convertCentToAmount(pendingCaptureAmount, fractionDigits);
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

const getAuthorizedAmount = (capturePaymentObj) => {
  let captureTransaction: any;
  let indexValue: any;
  let exceptionData: any;
  let authorizedAmount = Constants.VAL_FLOAT_ZERO;
  let capturedAmount = Constants.VAL_ZERO;
  let pendingAuthorizedAmount = Constants.VAL_ZERO;
  let fractionDigits = Constants.VAL_ZERO;
  try {
    if (null != capturePaymentObj) {
      captureTransaction = capturePaymentObj.transactions;
      fractionDigits = capturePaymentObj.amountPlanned.fractionDigits;
      indexValue = captureTransaction.findIndex((transaction, index) => {
        if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION == transaction.type) {
          return true;
        }
        return index;
      });
      if (Constants.VAL_ZERO <= indexValue) {
        authorizedAmount = Number(captureTransaction[indexValue].amount.centAmount);
        capturedAmount = Constants.VAL_FLOAT_ZERO;
        captureTransaction.forEach((transaction) => {
          if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
            capturedAmount = capturedAmount + Number(transaction.amount.centAmount);
          }
        });
        pendingAuthorizedAmount = authorizedAmount - capturedAmount;
        pendingAuthorizedAmount = convertCentToAmount(pendingAuthorizedAmount, fractionDigits);
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_AUTHORIZED_AMOUNT, Constants.LOG_INFO, null, Constants.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_AUTHORIZED_AMOUNT, Constants.LOG_ERROR, null, exceptionData);
  }
  return pendingAuthorizedAmount;
};

const addRefundAction = (amount, orderResponse, state) => {
  let refundAction: any;
  let exceptionData: any;
  try {
    if (null != amount && null != orderResponse) {
      refundAction = {
        action: Constants.ADD_TRANSACTION,
        transaction: {
          type: Constants.CT_TRANSACTION_TYPE_REFUND,
          timestamp: new Date(Date.now()).toISOString(),
          amount: amount,
          state: state,
          interactionId: orderResponse.transactionId,
        },
      };
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_REFUND_ACTION, Constants.LOG_INFO, null, Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_REFUND_ACTION, Constants.LOG_ERROR, null, exceptionData);
  }
  return refundAction;
};

const setCustomTypeData = (transactionId, pendingAmount) => {
  let returnResponse: any;
  let exceptionData: any;
  try {
    if (null != transactionId && null != pendingAmount) {
      returnResponse = {
        action: Constants.SET_TRANSACTION_CUSTOM_TYPE,
        type: {
          key: Constants.ISV_TRANSACTION_DATA,
          typeId: Constants.TYPE_ID_TYPE,
        },
        fields: {
          isv_availableCaptureAmount: pendingAmount,
        },
        transactionId: transactionId,
      };
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOM_TYPE_DATA, Constants.LOG_INFO, null, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOM_TYPE_DATA, Constants.LOG_ERROR, null, exceptionData);
  }
  return returnResponse;
};

const convertCentToAmount = (amount, fractionDigits) => {
  if (null != amount) {
    amount = Number((amount / Math.pow(Constants.VAL_TEN, fractionDigits)).toFixed(fractionDigits)) * Constants.VAL_ONE;
  }
  return amount;
};

const convertAmountToCent = (amount, fractionDigits) => {
  let cent = Constants.VAL_ZERO;
  if (null != amount && null != fractionDigits) {
    cent = Number(Math.trunc(amount * Math.pow(Constants.VAL_TEN, fractionDigits)) / Math.pow(Constants.VAL_TEN, fractionDigits)) * Math.pow(Constants.VAL_TEN, fractionDigits);
  }
  return cent;
};



const roundOff = (amount, fractionDigits) => {
  let value = Constants.VAL_FLOAT_ZERO;
  if (null != amount && null != fractionDigits) {
    value = Math.round(amount * Math.pow(Constants.VAL_TEN, fractionDigits)) / Math.pow(Constants.VAL_TEN, fractionDigits);
  }
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
  let key: any;
  let baseEncodedData: any;
  let exceptionData: any;
  let encryption: any;
  let encryptStringData: any;
  try {
    if (data) {
      key = process.env.CT_CLIENT_SECRET;
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv(Constants.HEADER_ENCRYPTION_ALGORITHM, key, iv);
      encryption = cipher.update(data, Constants.UNICODE_ENCODING_SYSTEM, Constants.ENCODING_BASE_SIXTY_FOUR);
      encryption += cipher.final(Constants.ENCODING_BASE_SIXTY_FOUR);
      const authTag = cipher.getAuthTag();
      encryptStringData = iv.toString(Constants.HEX) + Constants.STRING_FULLCOLON + encryption.toString() + Constants.STRING_FULLCOLON + authTag.toString(Constants.HEX);
      baseEncodedData = Buffer.from(encryptStringData).toString(Constants.ENCODING_BASE_SIXTY_FOUR);
    }
  } catch (exception) {
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
  let key: any;
  let data: any;
  let decryptedData: any;
  let encryptedData: any;
  let exceptionData: any;
  let ivBuff: any;
  let authTagBuff: any;
  try {
    if (encodedCredentials) {
      key = process.env.CT_CLIENT_SECRET;
      data = Buffer.from(encodedCredentials, Constants.ENCODING_BASE_SIXTY_FOUR).toString('ascii');
      ivBuff = Buffer.from(data.split(Constants.STRING_FULLCOLON)[Constants.VAL_ZERO], Constants.HEX);
      encryptedData = data.split(Constants.STRING_FULLCOLON)[Constants.VAL_ONE];
      authTagBuff = Buffer.from(data.split(Constants.STRING_FULLCOLON)[Constants.VAL_TWO], Constants.HEX);
      const decipher = crypto.createDecipheriv(Constants.HEADER_ENCRYPTION_ALGORITHM, key, ivBuff);
      decipher.setAuthTag(authTagBuff);
      decryptedData = decipher.update(encryptedData, Constants.ENCODING_BASE_SIXTY_FOUR, Constants.UNICODE_ENCODING_SYSTEM);
      decryptedData += decipher.final(Constants.UNICODE_ENCODING_SYSTEM);
    }
  } catch (exception) {
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

const getCreditCardResponse = async (updatePaymentObj, customerInfo, cartObj, updateTransactions, cardTokens, orderNo) => {
  let authResponse: any;
  let paymentResponse: any;
  let cardDetails: any;
  let actions: any;
  let startTime: any;
  let limiterResponse: any;
  let cardRate: any;
  let cardRateCount: any;
  let dontSaveTokenFlag = false;
  let payerAuthMandateFlag = false;
  let exceptionData: any;
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  try {
    if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER && null != customerInfo) {
      cardRate = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME ? process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME : Constants.DEFAULT_PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME;
      cardRateCount = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE ? process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE : Constants.DEFAULT_PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE;
      startTime = new Date();
      startTime.setHours(startTime.getHours() - cardRate);
      limiterResponse = await rateLimiterAddToken(customerInfo, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
      if (null != limiterResponse && limiterResponse >= parseInt(cardRateCount)) {
        dontSaveTokenFlag = true;
      }
    }
    if (updatePaymentObj?.custom?.fields?.isv_transientToken && (Constants.STRING_FULL == process.env.PAYMENT_GATEWAY_BILLING_TYPE || Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_SHIPPING)
    ) {
      cartObj = await updateCartWithUCAddress(updatePaymentObj, cartObj);
    }
    paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, Constants.STRING_CARD, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
    if (null != updatePaymentObj && null != paymentResponse && null != paymentResponse.httpCode) {
      authResponse = getAuthResponse(paymentResponse, updateTransactions);
      if (null != authResponse) {
        if (Constants.APPLE_PAY == updatePaymentObj.paymentMethodInfo.method) {
          cardDetails = await clickToPay.getVisaCheckoutData(paymentResponse, updatePaymentObj);
          if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.HTTP_CODE_TWO_HUNDRED == cardDetails.httpCode && cardDetails.hasOwnProperty(Constants.CARD_FIELD_GROUP) && Constants.VAL_ZERO < Object.keys(cardDetails.cardFieldGroup).length) {
            actions = visaCardDetailsAction(cardDetails);
            if (null != actions && Constants.VAL_ZERO < actions.length) {
              actions.forEach((i) => {
                authResponse.actions.push(i);
              });
            }
          }
          if (updatePaymentObj?.custom?.fields?.isv_applePaySessionData && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_applePaySessionData) {
            authResponse.actions.push({
              action: Constants.SET_CUSTOM_FIELD,
              name: Constants.ISV_PAYMENT_APPLE_PAY_SESSION_DATA,
              value: null,
            });
          }
        }
      } else {
        logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CREDIT_CARD_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
        returnResponse.errorFlag = true;
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CREDIT_CARD_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
      returnResponse.errorFlag = true;
    }
    returnResponse.paymentResponse = paymentResponse;
    returnResponse.authResponse = authResponse;
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CREDIT_CARD_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
    returnResponse.errorFlag = true;
  }
  return returnResponse;
};

const getPayerAuthSetUpResponse = async (updatePaymentObj) => {
  let setUpServiceResponse: any;
  let setUpActionResponse: any;
  let exceptionData: any;
  let cardTokens: any;
  let customerInfo: any;
  let paymentInstrumentToken = null;
  let errorFlag = false;
  let cartObj: any;
  let customFields: any;
  try {
    if (updatePaymentObj?.custom?.fields) {
      customFields = updatePaymentObj.custom.fields;
      if (customFields?.isv_token || customFields?.isv_savedToken || customFields?.isv_transientToken) {
        if (updatePaymentObj?.customer?.id) {
          customerInfo = await commercetoolsApi.getCustomer(updatePaymentObj.customer.id);
          cardTokens = await getCardTokens(customerInfo, paymentInstrumentToken);
          if (customFields?.isv_savedToken) {
            paymentInstrumentToken = updatePaymentObj.custom.fields.isv_savedToken;
          }
        }
        if (
          (Constants.STRING_FULL == process.env.PAYMENT_GATEWAY_BILLING_TYPE || Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_SHIPPING) &&
          updatePaymentObj?.custom?.fields?.isv_transientToken
        ) {
          cartObj = await commercetoolsApi.retrieveCartByPaymentId(updatePaymentObj.id);
          if (null == cartObj || (null != cartObj && Constants.VAL_ZERO == cartObj.count)) {
            if (updatePaymentObj?.customer && updatePaymentObj?.customer?.id) {
              cartObj = await commercetoolsApi.retrieveCartByCustomerId(updatePaymentObj.customer.id);
            } else {
              cartObj = await commercetoolsApi.retrieveCartByAnonymousId(updatePaymentObj.anonymousId);
            }
          }
          if (undefined != cartObj && null != cartObj && Constants.VAL_ZERO != cartObj.count) {
            await updateCartWithUCAddress(updatePaymentObj, cartObj.results[Constants.VAL_ZERO])
          }
        }
        setUpServiceResponse = await paymentAuthSetUp.payerAuthSetupResponse(updatePaymentObj, cardTokens);
        if (null != setUpServiceResponse && null != setUpServiceResponse.httpCode) {
          setUpActionResponse = getAuthResponse(setUpServiceResponse, null);
        } else {
          logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
          errorFlag = true;
        }
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
      errorFlag = true;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_PAYER_AUTH + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_PAYER_AUTH + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_PAYER_AUTH + Constants.STRING_HYPHEN + exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
    errorFlag = true;
  }
  if (errorFlag) {
    setUpActionResponse = invalidInputResponse();
  }
  return setUpActionResponse;
};

const getPayerAuthEnrollResponse = async (updatePaymentObj) => {
  let enrollResponse: any;
  let enrollServiceResponse: any;
  let cartObj: any;
  let exceptionData: any;
  let cardTokens: any;
  let enrollAuthResponse: any;
  let startTime: any;
  let limiterResponse: any;
  let cardRate: any;
  let cardRateCount: any;
  let customerInfo: any;
  let cardinalReferenceId = null;
  let paymentInstrumentToken = null;
  let orderNo = null;
  let errorFlag = false;
  let dontSaveTokenFlag = false;
  let payerAuthMandateFlag = false;
  try {
    if (
      null != updatePaymentObj &&
      Constants.STRING_CUSTOM in updatePaymentObj &&
      Constants.ISV_CARDINAL_REFERENCE_ID in updatePaymentObj.custom.fields &&
      Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_cardinalReferenceId &&
      ((Constants.ISV_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_token) ||
        (Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_savedToken) ||
        (Constants.ISV_PAYMENT_TRANSIENT_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_transientToken))
    ) {
      cardinalReferenceId = updatePaymentObj.custom.fields.isv_cardinalReferenceId;
      cartObj = await commercetoolsApi.retrieveCartByPaymentId(updatePaymentObj.id);
      if (null == cartObj || (null != cartObj && Constants.VAL_ZERO == cartObj.count)) {
        if (Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer) {
          cartObj = await commercetoolsApi.retrieveCartByCustomerId(updatePaymentObj.customer.id);
        } else {
          cartObj = await commercetoolsApi.retrieveCartByAnonymousId(updatePaymentObj.anonymousId);
        }
      }
      if (null != cartObj && Constants.VAL_ZERO < cartObj.count) {
        if (Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer) {
          if (Constants.STRING_CUSTOM in updatePaymentObj && Constants.STRING_FIELDS in updatePaymentObj.custom && Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_savedToken) {
            paymentInstrumentToken = updatePaymentObj.custom.fields.isv_savedToken;
          }
          if (null != updatePaymentObj.customer.id) {
            customerInfo = await commercetoolsApi.getCustomer(updatePaymentObj.customer.id);
            cardTokens = await getCardTokens(customerInfo, paymentInstrumentToken);
          }
        }
        orderNo = await getOrderId(cartObj, updatePaymentObj.id);
        if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER && null != customerInfo) {
          cardRate = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME ? process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME : Constants.DEFAULT_PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME;
          cardRateCount = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE ? process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE : Constants.DEFAULT_PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE;
          startTime = new Date();
          startTime.setHours(startTime.getHours() - cardRate);
          limiterResponse = await rateLimiterAddToken(customerInfo, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
          if (null != limiterResponse && limiterResponse >= parseInt(cardRateCount)) {
            dontSaveTokenFlag = true;
          }
        }
        if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == updatePaymentObj.custom.fields.isv_payerEnrollHttpCode && Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED == updatePaymentObj.custom.fields.isv_payerEnrollStatus) {
          payerAuthMandateFlag = true;
        }
        enrollServiceResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], Constants.STRING_ENROLL_CHECK, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
        enrollServiceResponse.cardinalReferenceId = cardinalReferenceId;
        enrollResponse = payerEnrollActions(enrollServiceResponse, updatePaymentObj);
        enrollAuthResponse = getAuthResponse(enrollServiceResponse, null);
        if (null != enrollAuthResponse && Constants.VAL_ZERO < enrollAuthResponse.actions.length) {
          enrollAuthResponse.actions.forEach((i) => {
            enrollResponse.actions.push(i);
          });
        }
        enrollResponse = await setCustomerTokenData(cardTokens, enrollServiceResponse, enrollResponse, false, updatePaymentObj.paymentMethodInfo.method, updatePaymentObj, cartObj.results[Constants.VAL_ZERO]);
      } else {
        logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_EMPTY_CART);
        errorFlag = true;
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
      errorFlag = true;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
    errorFlag = true;
  }
  if (errorFlag) {
    enrollResponse = invalidInputResponse();
  }
  return enrollResponse;
};

const getPayerAuthValidateResponse = async (updatePaymentObj) => {
  let authResponse: any;
  let paymentResponse: any;
  let startTime: any;
  let limiterResponse: any;
  let cardRate: any;
  let cardRateCount: any;
  let cartObj: any;
  let cardTokens: any;
  let exceptionData: any;
  let customerInfo: any;
  let dontSaveTokenFlag = false;
  let payerAuthMandateFlag = false;
  let paymentInstrumentToken = null;
  let orderNo = null;
  let errorFlag = false;
  try {
    if (
      null != updatePaymentObj &&
      Constants.STRING_CUSTOM in updatePaymentObj &&
      ((Constants.STRING_EMPTY != updatePaymentObj?.custom?.fields?.isv_token) ||
        (Constants.STRING_EMPTY != updatePaymentObj?.custom?.fields?.isv_savedToken) ||
        (Constants.STRING_EMPTY != updatePaymentObj?.custom?.fields?.isv_transientToken))
    ) {
      cartObj = await commercetoolsApi.retrieveCartByPaymentId(updatePaymentObj.id);
      if (null == cartObj || (null != cartObj && Constants.VAL_ZERO == cartObj.count)) {
        if (Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer) {
          cartObj = await commercetoolsApi.retrieveCartByCustomerId(updatePaymentObj.customer.id);
        } else {
          cartObj = await commercetoolsApi.retrieveCartByAnonymousId(updatePaymentObj.anonymousId);
        }
      }
      if (null != cartObj && Constants.VAL_ZERO < cartObj.count) {
        if (Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer) {
          if (Constants.STRING_CUSTOM in updatePaymentObj && Constants.STRING_FIELDS in updatePaymentObj.custom && Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_savedToken) {
            paymentInstrumentToken = updatePaymentObj.custom.fields.isv_savedToken;
          }
          if (null != updatePaymentObj.customer.id) {
            customerInfo = await commercetoolsApi.getCustomer(updatePaymentObj.customer.id);
            cardTokens = await getCardTokens(customerInfo, paymentInstrumentToken);
          }
        }
        orderNo = await getOrderId(cartObj, updatePaymentObj.id);
        if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER && Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer && null != updatePaymentObj.customer.id) {
          cardRate = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME ? process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME : Constants.DEFAULT_PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME;
          cardRateCount = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE ? process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE : Constants.DEFAULT_PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE;
          startTime = new Date();
          startTime.setHours(startTime.getHours() - cardRate);
          limiterResponse = await rateLimiterAddToken(customerInfo, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
          if (null != limiterResponse && limiterResponse >= parseInt(cardRateCount)) {
            dontSaveTokenFlag = true;
          }
        }
        paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], Constants.VALIDATION, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
        if (null != paymentResponse && null != paymentResponse.httpCode) {
          authResponse = payerEnrollActions(paymentResponse, updatePaymentObj);
          if (null != authResponse) {
            if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && !paymentResponse.data.hasOwnProperty(Constants.ERROR_INFORMATION)) {
              authResponse.actions.push({
                action: Constants.ADD_INTERFACE_INTERACTION,
                type: {
                  key: Constants.ISV_PAYER_AUTHENTICATION_VALIDATE_RESULT,
                },
                fields: {
                  cavv: paymentResponse.data.consumerAuthenticationInformation.cavv,
                  eciRaw: paymentResponse.data.consumerAuthenticationInformation.eciRaw,
                  paresStatus: paymentResponse.data.consumerAuthenticationInformation.paresStatus,
                  commerceIndicator: paymentResponse.data.consumerAuthenticationInformation.indicator,
                  authenticationResult: paymentResponse.data.consumerAuthenticationInformation.authenticationResult,
                  xid: paymentResponse.data.consumerAuthenticationInformation.xid,
                  cavvAlgorithm: paymentResponse.data.consumerAuthenticationInformation.cavvAlgorithm,
                  authenticationStatusMessage: paymentResponse.data.consumerAuthenticationInformation.authenticationStatusMessage,
                  eci: paymentResponse.data.consumerAuthenticationInformation.eci,
                  specificationVersion: paymentResponse.data.consumerAuthenticationInformation.specificationVersion,
                },
              });
            }
            if (
              Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
              paymentResponse.data.hasOwnProperty(Constants.ERROR_INFORMATION) &&
              Constants.VAL_ZERO < Object.keys(paymentResponse.data.errorInformation).length &&
              paymentResponse.data.errorInformation.hasOwnProperty(Constants.STRING_REASON) &&
              Constants.VAL_ZERO < Object.keys(paymentResponse.data.errorInformation.reason).length &&
              Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED == paymentResponse.data.errorInformation.reason
            ) {
              authResponse.actions.push(
                {
                  action: Constants.SET_CUSTOM_FIELD,
                  name: Constants.ISV_PAYER_AUTHENTICATION_ENROLL_STATUS,
                  value: paymentResponse.data.errorInformation.reason,
                },
                {
                  action: Constants.SET_CUSTOM_FIELD,
                  name: Constants.ISV_PAYER_AUTHENTICATION_ENROLL_HTTP_CODE,
                  value: paymentResponse.httpCode,
                }
              );
            }
          } else {
            logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
            errorFlag = true;
          }
        } else {
          logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
          errorFlag = true;
        }
        authResponse = await setCustomerTokenData(cardTokens, paymentResponse, authResponse, false, updatePaymentObj.paymentMethodInfo.method, updatePaymentObj, cartObj.results[Constants.VAL_ZERO]);
      } else {
        logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
        errorFlag = true;
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
      errorFlag = true;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
    errorFlag = true;
  }
  if (errorFlag) {
    authResponse = invalidInputResponse();
  }
  return authResponse;
};

const clickToPayResponse = async (updatePaymentObj, cartObj, updateTransactions, customerTokenId, orderNo) => {
  let authResponse: any;
  let paymentResponse: any;
  let cartUpdate: any;
  let visaCheckoutData: any;
  let actions: any;
  let dontSaveTokenFlag = false;
  let payerAuthMandateFlag = false;
  let exceptionData: any;
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  try {
    paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, 'visa', customerTokenId, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
    if (null != paymentResponse && null != paymentResponse.httpCode) {
      authResponse = getAuthResponse(paymentResponse, updateTransactions);
      if (null != authResponse) {
        visaCheckoutData = await clickToPay.getVisaCheckoutData(paymentResponse, updatePaymentObj);
        if (
          Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
          Constants.HTTP_CODE_TWO_HUNDRED == visaCheckoutData.httpCode &&
          visaCheckoutData.hasOwnProperty(Constants.CARD_FIELD_GROUP) &&
          Constants.VAL_ZERO < Object.keys(visaCheckoutData.cardFieldGroup).length
        ) {
          actions = visaCardDetailsAction(visaCheckoutData);
          if (null != actions && Constants.VAL_ZERO < actions.length) {
            actions.forEach((i) => {
              authResponse.actions.push(i);
            });
          }
          cartUpdate = await commercetoolsApi.updateCartByPaymentId(cartObj.id, updatePaymentObj.id, cartObj.version, visaCheckoutData);
          if (null != cartUpdate) {
            logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.SUCCESS_MSG_UPDATE_CLICK_TO_PAY_CARD_DETAILS);
          }
        } else {
          logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_UPDATE_CLICK_TO_PAY_DATA);
        }
      } else {
        logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
        returnResponse.errorFlag = true;
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
      returnResponse.errorFlag = true;
    }
    returnResponse.paymentResponse = paymentResponse;
    returnResponse.authResponse = authResponse;
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
    returnResponse.errorFlag = true;
  }
  return returnResponse;
};

const googlePayResponse = async (updatePaymentObj, cartObj, updateTransactions, customerTokenId, orderNo) => {
  let authResponse: any;
  let paymentResponse: any;
  let actions: any;
  let dontSaveTokenFlag = false;
  let payerAuthMandateFlag = false;
  let exceptionData: any;
  let cardDetails = {
    cardFieldGroup: null,
  };
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  try {
    if (updatePaymentObj?.custom?.fields?.isv_transientToken && (Constants.STRING_FULL == process.env.PAYMENT_GATEWAY_BILLING_TYPE || Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_SHIPPING)
    ) {
      cartObj = await updateCartWithUCAddress(updatePaymentObj, cartObj);
    }
    paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, 'google', customerTokenId, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
    if (null != paymentResponse && null != paymentResponse.httpCode) {
      authResponse = getAuthResponse(paymentResponse, updateTransactions);
      if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
        if (paymentResponse?.data?.paymentInformation?.tokenizedCard && paymentResponse.data.paymentInformation.tokenizedCard?.expirationMonth) {
          cardDetails.cardFieldGroup = paymentResponse.data.paymentInformation.tokenizedCard;
        } else if (paymentResponse?.data?.paymentInformation?.card && paymentResponse.data.paymentInformation.card?.expirationMonth) {
          cardDetails.cardFieldGroup = paymentResponse.data.paymentInformation.card;
        }
        if (null != cardDetails.cardFieldGroup) {
          actions = visaCardDetailsAction(cardDetails);
          if (null != actions && Constants.VAL_ZERO < actions.length) {
            actions.forEach((i) => {
              authResponse.actions.push(i);
            });
          }
        }
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GOOGLE_PAY_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
      returnResponse.errorFlag = true;
    }
    returnResponse.paymentResponse = paymentResponse;
    returnResponse.authResponse = authResponse;
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GOOGLE_PAY_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
    returnResponse.errorFlag = true;
  }
  return returnResponse;
};

const getTransactionSummaries = async (updatePaymentObj, retryCount) => {
  let query = Constants.STRING_EMPTY;
  let transactionDetail: any;
  let exceptionData: any;
  let transactionSummaryObject = {
    summaries: null,
    historyPresent: false,
  };
  let errorData: any;
  let authMid: any;
  try {
    query = Constants.PAYMENT_GATEWAY_CLIENT_REFERENCE_CODE + updatePaymentObj.id + Constants.STRING_AND + Constants.STRING_SYNC_QUERY;
    authMid = await multiMid.getMidCredentials(updatePaymentObj);
    return await new Promise(async function (resolve, reject) {
      await setTimeout(async () => {
        transactionDetail = await createSearchRequest.getTransactionSearchResponse(query, Constants.STRING_SYNC_SORT, authMid);
        if (
          null != transactionDetail &&
          Constants.HTTP_CODE_TWO_HUNDRED_ONE == transactionDetail.httpCode &&
          transactionDetail?.data?._embedded?.transactionSummaries &&
          ((Constants.CC_PAYER_AUTHENTICATION == updatePaymentObj.paymentMethodInfo.method && Constants.VAL_TWO <= transactionDetail.data.totalCount && Constants.VAL_THREE == retryCount) ||
            (Constants.VAL_ONE == transactionDetail.data.totalCount && updatePaymentObj?.custom?.fields?.isv_saleEnabled && updatePaymentObj.custom.fields.isv_saleEnabled) ||
            (Constants.VAL_ONE < transactionDetail.data.totalCount && Constants.CC_PAYER_AUTHENTICATION != updatePaymentObj.paymentMethodInfo.method))
        ) {
          transactionSummaryObject.summaries = transactionDetail.data._embedded.transactionSummaries;
          transactionSummaryObject.historyPresent = true;
          resolve(transactionSummaryObject);
        } else {
          logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SUMMARIES, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_RETRY_TRANSACTION_SEARCH);
          reject(transactionSummaryObject);
        }
      }, 1500);
    }).catch((error) => {
      if (typeof error === 'object') {
        errorData = JSON.stringify(error);
      } else {
        errorData = error;
      }
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SUMMARIES, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_RETRY_TRANSACTION_SEARCH + errorData);
      return transactionSummaryObject;
    });
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_TRANSACTION_SEARCH + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_TRANSACTION_SEARCH + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_TRANSACTION_SEARCH + Constants.STRING_HYPHEN + exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SUMMARIES, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
  }
  return transactionSummaryObject;
};

const checkAuthReversalTriggered = async (updatePaymentObj, cartObj, paymentResponse, updateActions) => {
  let transactionDetail: any;
  let transactionSummaries: any;
  let applications: any;
  let authReversalResponse: any;
  let exceptionData: any;
  let authReversalTriggered = false;
  let returnAction = {
    action: Constants.ADD_TRANSACTION,
    transaction: {
      type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
      timestamp: new Date(Date.now()).toISOString(),
      amount: null,
      state: Constants.STRING_EMPTY,
      interactionId: null,
    },
  };
  let reversalAction = {
    action: Constants.ADD_TRANSACTION,
    transaction: {
      type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
      timestamp: new Date(Date.now()).toISOString(),
      amount: null,
      state: Constants.STRING_EMPTY,
      interactionId: null,
    },
  };
  let authAction = {
    action: Constants.ADD_TRANSACTION,
    transaction: {
      type: Constants.CT_TRANSACTION_TYPE_AUTHORIZATION,
      timestamp: new Date(Date.now()).toISOString(),
      amount: null,
      state: Constants.STRING_EMPTY,
      interactionId: null,
    },
  };
  try {
    for (let i = Constants.VAL_ZERO; i < Constants.VAL_THREE; i++) {
      transactionDetail = await getTransactionSummaries(updatePaymentObj, i + Constants.VAL_ONE);
      if (null != transactionDetail) {
        transactionSummaries = transactionDetail.summaries;
        if (true == transactionDetail.historyPresent) {
          break;
        }
      }
    }
    if (null != transactionSummaries) {
      transactionSummaries.forEach((element) => {
        applications = element.applicationInformation.applications;
        applications.forEach((application) => {
          if (
            Constants.ECHECK != updatePaymentObj.paymentMethodInfo.method &&
            Constants.STRING_CUSTOM in updatePaymentObj &&
            Constants.STRING_FIELDS in updatePaymentObj.custom &&
            Constants.ISV_SALE_ENABLED in updatePaymentObj.custom.fields &&
            updatePaymentObj.custom.fields.isv_saleEnabled &&
            Constants.STRING_SYNC_AUTH_NAME == application.name &&
            undefined != application.reasonCode
          ) {
            if (Constants.VAL_HUNDRED == application.reasonCode) {
              authAction.transaction.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
              authAction.transaction.amount = updatePaymentObj.amountPlanned;
              authAction.transaction.interactionId = element.id;
            } else {
              authAction.transaction.state = Constants.CT_TRANSACTION_STATE_FAILURE;
              authAction.transaction.amount = updatePaymentObj.amountPlanned;
              authAction.transaction.interactionId = element.id;
            }
            updateActions.actions.push(authAction);
          }
          if (Constants.STRING_SYNC_AUTH_REVERSAL_NAME == application.name) {
            if (Constants.APPLICATION_RCODE == application.rCode && Constants.APPLICATION_RFLAG == application.rFlag) {
              authReversalTriggered = true;
              returnAction.transaction.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
            } else {
              returnAction.transaction.state = Constants.CT_TRANSACTION_STATE_FAILURE;
            }
            returnAction.transaction.amount = updatePaymentObj.amountPlanned;
            returnAction.transaction.interactionId = element.id;
            updateActions.actions.push(returnAction);
          }
        });
      });
    }
    if (!authReversalTriggered) {
      authReversalResponse = await paymentAuthReversal.authReversalResponse(updatePaymentObj, cartObj, paymentResponse.transactionId);
      if (null != authReversalResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE == authReversalResponse.httpCode && Constants.API_STATUS_REVERSED == authReversalResponse.status) {
        reversalAction.transaction.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      } else {
        reversalAction.transaction.state = Constants.CT_TRANSACTION_STATE_FAILURE;
      }
      reversalAction.transaction.amount = updatePaymentObj.amountPlanned;
      reversalAction.transaction.interactionId = authReversalResponse.transactionId;
      updateActions.actions.push(reversalAction);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CHECK_AUTH_REVERSAL_TRIGGERED, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
  }
  return updateActions;
};

const getCertificatesData = async (url) => {
  let certificateResponse = {
    status: Constants.VAL_ZERO,
    data: null,
  };
  if (null != url) {
    return new Promise(async (resolve, reject) => {
      axios
        .get(url)
        .then(function (response) {
          if (response.data) {
            certificateResponse.data = response.data;
            certificateResponse.status = response.status;
            resolve(certificateResponse);
          } else {
            certificateResponse.status = response.status;
            logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CERTIFICATES_DATA, Constants.LOG_ERROR, null, stringify(response));
            reject(stringify(certificateResponse));
          }
        })
        .catch(function (exception) {
          logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CERTIFICATES_DATA, Constants.LOG_ERROR, null, exception);
          reject(exception);
        });
    });
  }
};

const getRefundResponse = async (updatePaymentObj, updateTransactions, orderNo) => {
  let refundAmount: any;
  let captureId = null;
  let transactionId = null;
  let paymentId: any;
  let pendingTransactionAmount = Constants.VAL_FLOAT_ZERO;
  let orderResponse: any;
  let refundResponse: any;
  let exceptionData: any;
  let returnRefundResponse = {
    refundTriggered: false,
    refundActions: null,
  };
  try {
    if (null != updatePaymentObj && null != updateTransactions) {
      paymentId = updatePaymentObj.id;
      refundAmount = updateTransactions.amount.centAmount;
      if (null != refundAmount && refundAmount > Constants.VAL_ZERO) {
        for (let transaction of updatePaymentObj.transactions) {
          if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
            if (refundAmount <= transaction.amount.centAmount && !(Constants.STRING_CUSTOM in transaction)) {
              captureId = transaction.interactionId;
              transactionId = transaction.id;
              pendingTransactionAmount = transaction.amount.centAmount - refundAmount;
              break;
            } else if (
              refundAmount <= transaction.amount.centAmount &&
              transaction?.custom?.fields?.isv_availableCaptureAmount &&
              Constants.VAL_ZERO != transaction.custom.fields.isv_availableCaptureAmount &&
              transaction.custom.fields.isv_availableCaptureAmount >= refundAmount
            ) {
              captureId = transaction.interactionId;
              transactionId = transaction.id;
              pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmount;
              break;
            }
          }
        }
        if (null != captureId) {
          orderResponse = await paymentRefund.refundResponse(updatePaymentObj, captureId, updateTransactions, orderNo);
          if (null != orderResponse && null != orderResponse.httpCode) {
            refundResponse = getOMServiceResponse(orderResponse, updateTransactions, transactionId, pendingTransactionAmount);
            if (null != refundResponse) {
              returnRefundResponse.refundActions = refundResponse;
              returnRefundResponse.refundTriggered = true;
            }
          }
        }
      } else {
        logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_REFUND_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_SERVICE_PROCESS);
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_REFUND_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_SERVICE_PROCESS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_REFUND_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentId, exceptionData);
  }
  return returnRefundResponse;
};

const getAddRefundResponse = async (updatePaymentObj, updateTransactions, orderNo) => {
  let refundAmount: any;
  let paymentId: any;
  let captureId = null;
  let transactionId = null;
  let pendingTransactionAmount = 0;
  let amount: any;
  let refundAmountUsed: any;
  let orderResponse: any;
  let refundAction: any;
  let actions = [] as any;
  let refundResponse = {};
  let setCustomTypeDataResponse: any;
  let exceptionData: any;
  try {
    if (null != updatePaymentObj && null != updateTransactions) {
      paymentId = updatePaymentObj.id;
      refundAmount = updateTransactions.amount.centAmount;
      for (let transaction of updatePaymentObj.transactions) {
        captureId = null;
        pendingTransactionAmount = Constants.VAL_FLOAT_ZERO;
        transactionId = null;
        amount = {
          type: null,
          currencyCode: null,
          centAmount: Constants.VAL_ZERO,
          fractionDigits: Constants.VAL_ZERO,
        };
        amount.type = updateTransactions.amount.type;
        amount.currencyCode = updateTransactions.amount.currencyCode;
        amount.fractionDigits = updateTransactions.amount.fractionDigits;
        if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state && Constants.VAL_ZERO < refundAmount) {
          captureId = transaction.interactionId;
          transactionId = transaction.id;
          if (transaction?.custom?.fields?.isv_availableCaptureAmount && Constants.VAL_ZERO != transaction.custom.fields.isv_availableCaptureAmount && refundAmount <= transaction.custom.fields.isv_availableCaptureAmount) {
            updateTransactions.amount.centAmount = refundAmount;
            refundAmountUsed = refundAmount;
            amount.centAmount = refundAmountUsed;
            pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmountUsed;
          } else if (transaction?.custom?.fields?.isv_availableCaptureAmount && Constants.VAL_ZERO != transaction.custom.fields.isv_availableCaptureAmount && refundAmount >= transaction.custom.fields.isv_availableCaptureAmount) {
            updateTransactions.amount.centAmount = Number(transaction.custom.fields.isv_availableCaptureAmount);
            refundAmountUsed = Number(transaction.custom.fields.isv_availableCaptureAmount);
            amount.centAmount = refundAmountUsed;
            pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmountUsed;
          } else if (refundAmount <= transaction.amount.centAmount && !(Constants.STRING_CUSTOM in transaction)) {
            updateTransactions.amount.centAmount = refundAmount;
            refundAmountUsed = refundAmount;
            amount.centAmount = refundAmountUsed;
            pendingTransactionAmount = transaction.amount.centAmount - refundAmountUsed;
          } else if (refundAmount >= transaction.amount.centAmount && !(Constants.STRING_CUSTOM in transaction)) {
            updateTransactions.amount.centAmount = transaction.amount.centAmount;
            refundAmountUsed = transaction.amount.centAmount;
            amount.centAmount = refundAmountUsed;
            pendingTransactionAmount = transaction.amount.centAmount - refundAmountUsed;
          }
        }
        if (null != captureId && Constants.VAL_ZERO != amount.centAmount) {
          orderResponse = await paymentRefund.refundResponse(updatePaymentObj, captureId, updateTransactions, orderNo);
          if (null != orderResponse && null != orderResponse.httpCode) {
            refundAmount = refundAmount - refundAmountUsed;
            if (Constants.API_STATUS_PENDING == orderResponse.status) {
              setCustomTypeDataResponse = setCustomTypeData(transactionId, pendingTransactionAmount);
              actions.push(setCustomTypeDataResponse);
              refundAction = addRefundAction(amount, orderResponse, Constants.CT_TRANSACTION_STATE_SUCCESS);
              actions.push(refundAction);
            } else {
              refundAction = addRefundAction(amount, orderResponse, Constants.CT_TRANSACTION_STATE_FAILURE);
              actions.push(refundAction);
            }
          }
        }
      }
      if (null != actions) {
        refundResponse = {
          actions: actions,
          errors: [],
        };
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_ADD_REFUND_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_SERVICE_PROCESS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_ADD_REFUND_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentId, exceptionData);
  }
  return refundResponse;
};

const getCardTokens = async (customerInfo, isvSavedToken) => {
  let existingTokens: any;
  let existingTokensMap: any;
  let newToken: any;
  let tokenLength = Constants.VAL_ZERO;
  let currentIndex = Constants.VAL_ZERO;
  let cardTokens = {
    customerTokenId: null,
    paymentInstrumentId: null,
  };
  if (
    null != customerInfo &&
    Constants.STRING_CUSTOM in customerInfo &&
    Constants.STRING_FIELDS in customerInfo.custom &&
    Constants.ISV_TOKENS in customerInfo.custom.fields &&
    Constants.STRING_EMPTY != customerInfo.custom.fields.isv_tokens &&
    Constants.VAL_ZERO < customerInfo.custom.fields.isv_tokens.length
  ) {
    existingTokens = customerInfo.custom.fields.isv_tokens;
    existingTokensMap = existingTokens.map((item) => item);
    tokenLength = customerInfo.custom.fields.isv_tokens.length;
    existingTokensMap.forEach((token, index) => {
      newToken = JSON.parse(token);
      currentIndex++;
      if (newToken.paymentToken == isvSavedToken) {
        cardTokens.customerTokenId = newToken.value;
        cardTokens.paymentInstrumentId = newToken.paymentToken;
      }
      if (tokenLength == currentIndex && null == cardTokens.customerTokenId) {
        cardTokens.customerTokenId = newToken.value;
      }
    });
  }
  return cardTokens;
};

const setCustomerTokenData = async (cardTokens, paymentResponse, authResponse, errorFlag, paymentMethod, updatePaymentObj, cartObj) => {
  let customerTokenResponse: any;
  let customerInfo: any;
  let failedToken: any;
  let existingFailedTokens: any;
  let existingFailedTokensMap: any;
  let existingTokens: any;
  let paymentInstrumentId = null;
  let instrumentIdentifier = null;
  let customerTokenId = null;
  let customerId = null;
  let addressId = null;
  let failedTokenLength = Constants.VAL_ZERO;
  if (null != cartObj && cartObj?.billingAddress?.id) {
    addressId = cartObj.billingAddress.id;
  }
  if (
    !errorFlag &&
    Constants.STRING_CUSTOMER in updatePaymentObj &&
    Constants.STRING_ID in updatePaymentObj.customer &&
    Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
    Constants.API_STATUS_AUTHORIZED == paymentResponse.status &&
    (Constants.CREDIT_CARD == paymentMethod || Constants.CC_PAYER_AUTHENTICATION == paymentMethod) &&
    (null == updatePaymentObj.custom.fields.isv_savedToken || Constants.STRING_EMPTY == updatePaymentObj.custom.fields.isv_savedToken) &&
    Constants.ISV_TOKEN_ALIAS in updatePaymentObj.custom.fields &&
    Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_tokenAlias
  ) {
    if (
      paymentResponse.data.hasOwnProperty(Constants.TOKEN_INFORMATION) &&
      Constants.VAL_ZERO < Object.keys(paymentResponse.data.tokenInformation).length &&
      paymentResponse.data.tokenInformation.hasOwnProperty(Constants.PAYMENT_INSTRUMENT) &&
      Constants.VAL_ZERO < Object.keys(paymentResponse.data.tokenInformation.paymentInstrument).length
    ) {
      authResponse.actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: Constants.ISV_SAVED_TOKEN,
        value: paymentResponse.data.tokenInformation.paymentInstrument.id,
      });
      if (null != cardTokens && null == cardTokens.customerTokenId && paymentResponse.data.tokenInformation.hasOwnProperty(Constants.STRING_CUSTOMER) && Constants.VAL_ZERO < Object.keys(paymentResponse.data.tokenInformation.customer).length) {
        customerTokenId = paymentResponse.data.tokenInformation.customer.id;
      } else {
        customerTokenId = cardTokens.customerTokenId;
      }
      paymentInstrumentId = paymentResponse.data.tokenInformation.paymentInstrument.id;
      instrumentIdentifier = paymentResponse.data.tokenInformation.instrumentIdentifier.id;
      customerTokenResponse = await processTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId);
      if (null != customerTokenResponse) {
        logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + updatePaymentObj.customer.id, Constants.SUCCESS_MSG_CARD_TOKENS_UPDATE);
      } else {
        logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + updatePaymentObj.customer.id, Constants.ERROR_MSG_TOKEN_UPDATE);
      }
    }
  } else {
    if (
      Constants.STRING_CUSTOMER in updatePaymentObj &&
      Constants.STRING_ID in updatePaymentObj.customer &&
      Constants.API_STATUS_PENDING_AUTHENTICATION != paymentResponse.status &&
      Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED != paymentResponse.status &&
      (Constants.CREDIT_CARD == paymentMethod || Constants.CC_PAYER_AUTHENTICATION == paymentMethod) &&
      (null == updatePaymentObj.custom.fields.isv_savedToken || Constants.STRING_EMPTY == updatePaymentObj.custom.fields.isv_savedToken) &&
      Constants.ISV_TOKEN_ALIAS in updatePaymentObj.custom.fields &&
      Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_tokenAlias
    ) {
      customerId = updatePaymentObj.customer.id;
      customerInfo = await commercetoolsApi.getCustomer(customerId);
      failedToken = {
        alias: updatePaymentObj.custom.fields.isv_tokenAlias,
        cardType: updatePaymentObj.custom.fields.isv_cardType,
        cardName: updatePaymentObj.custom.fields.isv_cardType,
        cardNumber: updatePaymentObj.custom.fields.isv_maskedPan,
        cardExpiryMonth: updatePaymentObj.custom.fields.isv_cardExpiryMonth,
        cardExpiryYear: updatePaymentObj.custom.fields.isv_cardExpiryYear,
        addressId: addressId,
        timeStamp: new Date(Date.now()).toISOString(),
      };
      if (null != customerInfo) {
        if (Constants.STRING_CUSTOM in customerInfo && Constants.STRING_FIELDS in customerInfo.custom) {
          if (Constants.ISV_FAILED_TOKENS in customerInfo.custom.fields && Constants.STRING_EMPTY != customerInfo.custom.fields.isv_failedTokens && Constants.VAL_ZERO < customerInfo.custom.fields.isv_failedTokens.length) {
            existingFailedTokens = customerInfo.custom.fields.isv_failedTokens;
            existingFailedTokensMap = existingFailedTokens.map((item) => item);
            failedTokenLength = customerInfo.custom.fields.isv_failedTokens.length;
            existingFailedTokensMap[failedTokenLength] = JSON.stringify(failedToken);
          } else {
            existingFailedTokensMap = [JSON.stringify(failedToken)];
          }
          existingTokens = customerInfo.custom.fields.isv_tokens;
        } else {
          existingFailedTokensMap = [JSON.stringify(failedToken)];
        }
      }
      customerTokenResponse = await commercetoolsApi.setCustomType(updatePaymentObj.customer.id, existingTokens, existingFailedTokensMap);
      if (null != customerTokenResponse) {
        logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + updatePaymentObj.customer.id, Constants.SUCCESS_MSG_CARD_TOKENS_UPDATE);
      } else {
        logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + updatePaymentObj.customer.id, Constants.ERROR_MSG_TOKEN_UPDATE);
      }
    }
  }
  return authResponse;
};

const processTokens = async (customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId) => {
  let customerInfo: any;
  let existingTokens: any;
  let existingTokensMap: any;
  let newToken: any;
  let parsedTokens: any;
  let updateTokenResponse: any;
  let length = Constants.VAL_NEGATIVE_ONE;
  let existingCardFlag = false;
  let customerId = updatePaymentObj.customer.id;
  customerInfo = await commercetoolsApi.getCustomer(customerId);
  if (
    null != customerInfo &&
    Constants.STRING_CUSTOM in customerInfo &&
    Constants.STRING_FIELDS in customerInfo.custom &&
    Constants.ISV_TOKENS in customerInfo.custom.fields &&
    Constants.STRING_EMPTY != customerInfo.custom.fields.isv_tokens &&
    Constants.VAL_ZERO < customerInfo.custom.fields.isv_tokens.length
  ) {
    existingTokens = customerInfo.custom.fields.isv_tokens;
    existingTokensMap = existingTokens.map((item) => item);
    existingTokensMap.forEach((token, index) => {
      newToken = JSON.parse(token);
      if (newToken.cardNumber == updatePaymentObj.custom.fields.isv_maskedPan && newToken.value == customerTokenId && newToken.instrumentIdentifier == instrumentIdentifier) {
        length = index;
      }
    });
    if (Constants.VAL_NEGATIVE_ONE < length) {
      existingCardFlag = true;
      parsedTokens = JSON.parse(existingTokensMap[length]);
      parsedTokens.alias = updatePaymentObj.custom.fields.isv_tokenAlias;
      parsedTokens.value = customerTokenId;
      parsedTokens.paymentToken = paymentInstrumentId;
      parsedTokens.cardExpiryMonth = updatePaymentObj.custom.fields.isv_cardExpiryMonth;
      parsedTokens.cardExpiryYear = updatePaymentObj.custom.fields.isv_cardExpiryYear;
      parsedTokens.addressId = addressId;
      existingTokensMap[length] = JSON.stringify(parsedTokens);
      updateTokenResponse = await commercetoolsApi.setCustomType(customerId, existingTokensMap, customerInfo.custom.fields.isv_failedTokens);
    }
  }
  if (!existingCardFlag) {
    updateTokenResponse = await commercetoolsApi.setCustomerTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId);
  }
  return updateTokenResponse;
};

const rateLimiterAddToken = async (customerObj, startTime, endTime) => {
  let existingTokens: any;
  let existingTokensMap: any;
  let existingFailedTokens: any;
  let existingFailedTokensMap: any;
  let tokenToCompare: any;
  let count = Constants.VAL_ZERO;
  if (Constants.STRING_CUSTOM in customerObj && Constants.ISV_FAILED_TOKENS in customerObj.custom.fields && Constants.STRING_EMPTY != customerObj.custom.fields.isv_failedTokens && Constants.VAL_ZERO < customerObj.custom.fields.isv_failedTokens.length) {
    existingFailedTokens = customerObj.custom.fields.isv_failedTokens;
    existingFailedTokensMap = existingFailedTokens.map((item) => item);
    existingFailedTokensMap.forEach((failToken) => {
      tokenToCompare = JSON.parse(failToken);
      if (tokenToCompare.timeStamp > startTime && tokenToCompare.timeStamp < endTime) {
        count++;
      }
    });
  }
  if (Constants.STRING_CUSTOM in customerObj && Constants.ISV_TOKENS in customerObj.custom.fields && Constants.STRING_EMPTY != customerObj.custom.fields.isv_tokens && Constants.VAL_ZERO < customerObj.custom.fields.isv_tokens.length) {
    existingTokens = customerObj.custom.fields.isv_tokens;
    existingTokensMap = existingTokens.map((item) => item);
    existingTokensMap.forEach((token) => {
      tokenToCompare = JSON.parse(token);
      if (tokenToCompare.timeStamp > startTime && tokenToCompare.timeStamp < endTime) {
        count++;
      }
    });
  }
  return count;
};

const getApplicationsPresent = async (applications) => {
  let applicationResponse = {
    authPresent: false,
    authReasonCodePresent: false,
    capturePresent: false,
    captureReasonCodePresent: false,
    authReversalPresent: false,
    refundPresent: false,
  };
  if (null != applications) {
    if (applications.some((item) => Constants.STRING_SYNC_AUTH_NAME == item.name) || applications.some((item) => Constants.STRING_SYNC_ECHECK_DEBIT_NAME == item.name)) {
      applicationResponse.authPresent = true;
    }
    if (applications.some((item) => Constants.STRING_SYNC_AUTH_NAME == item.name && null != item.reasonCode && Constants.VAL_HUNDRED == item.reasonCode)) {
      applicationResponse.authReasonCodePresent = true;
    }
    if (applications.some((item) => Constants.STRING_SYNC_ECHECK_DEBIT_NAME == item.name && null == item.reasonCode)) {
      if (applications.some((nextItem) => Constants.STRING_SYNC_DECISION_NAME == nextItem.name && Constants.VAL_FOUR_EIGHTY == nextItem.reasonCode)) {
        applicationResponse.authReasonCodePresent = true;
      }
    }
    if (applications.some((item) => Constants.STRING_SYNC_CAPTURE_NAME == item.name)) {
      applicationResponse.capturePresent = true;
    }
    if (applications.some((item) => Constants.STRING_SYNC_CAPTURE_NAME == item.name && null != item.reasonCode && Constants.VAL_HUNDRED == item.reasonCode)) {
      applicationResponse.captureReasonCodePresent = true;
    }
    if (applications.some((item) => Constants.STRING_SYNC_AUTH_REVERSAL_NAME == item.name)) {
      applicationResponse.authReversalPresent = true;
    }
    if (applications.some((item) => Constants.STRING_SYNC_REFUND_NAME == item.name || Constants.STRING_SYNC_ECHECK_CREDIT_NAME == item.name)) {
      applicationResponse.refundPresent = true;
    }
  } else {
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_APPLICATIONS_PRESENT, Constants.LOG_INFO, null, Constants.ERROR_MSG_APPLICATION_DETAILS);
  }
  return applicationResponse;
};

const updateVisaDetails = async (payment, paymentVersion, transactionId) => {
  let actions: any;
  let syncVisaCardDetailsResponse: any;
  let visaCheckoutData: any;
  let visaResponse: any;
  let cartDetails: any;
  let visaObject = {
    transactionId: null,
  };
  let updateResponse = {
    cartVersion: null,
    paymentVersion: null,
  };
  let visaUpdateObject = {
    id: null,
    version: null,
    actions: null,
  };
  if (null != payment && null != paymentVersion && null != transactionId) {
    visaObject.transactionId = transactionId;
    visaCheckoutData = await clickToPay.getVisaCheckoutData(visaObject, payment);
    if (null != visaCheckoutData) {
      cartDetails = await getCartDetailsByPaymentId(payment.id);
      if (null != cartDetails && 'Active' == cartDetails.cartState) {
        visaResponse = await commercetoolsApi.updateCartByPaymentId(cartDetails.id, payment.id, cartDetails.version, visaCheckoutData);
        if (null != visaResponse) {
          updateResponse.cartVersion = visaResponse.version;
          actions = await visaCardDetailsAction(visaCheckoutData);
          if (actions != null && Constants.VAL_ZERO < actions.length) {
            visaUpdateObject.actions = actions;
            visaUpdateObject.id = payment.id;
            visaUpdateObject.version = paymentVersion;
            syncVisaCardDetailsResponse = await commercetoolsApi.syncVisaCardDetails(visaUpdateObject);
            if (null != syncVisaCardDetailsResponse) {
              updateResponse.paymentVersion = syncVisaCardDetailsResponse.version;
            }
          }
        }
      }
    }
  } else {
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_VISA_DETAILS, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.ERROR_MSG_PAYMENT_DETAILS);
  }
  return updateResponse;
};

const getCartDetailsByPaymentId = async (paymentId) => {
  let cartResponse: any;
  let cartDetails: any;
  if (null != paymentId) {
    cartResponse = await commercetoolsApi.retrieveCartByPaymentId(paymentId);
    if (null != cartResponse && Constants.VAL_ZERO < cartResponse.count) {
      cartDetails = cartResponse.results[Constants.VAL_ZERO];
    }
  } else {
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CART_DETAILS_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_PAYMENT_DETAILS);
  }
  return cartDetails;
};

const runSyncAddTransaction = async (syncUpdateObject, reasonCode, authPresent, authReasonCodePresent) => {
  let updateSyncResponse: any;
  let transactionDetail: any;
  let transactionSummaries: any;
  let applications: any;
  let paymentDetails: any;
  let transactions: any;
  let query = Constants.STRING_EMPTY;
  let authReversalTriggered = false;
  let refundAmount = Constants.VAL_FLOAT_ZERO;
  let authReversalObject = {
    paymentId: null,
    version: null,
    amount: null,
    type: Constants.STRING_EMPTY,
    state: Constants.STRING_EMPTY,
  };
  let authMid: any;
  if (null != syncUpdateObject && null != reasonCode) {
    if (Constants.VAL_HUNDRED == reasonCode && Constants.CT_TRANSACTION_TYPE_REFUND != syncUpdateObject.type) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    } else if (Constants.VAL_HUNDRED == reasonCode && Constants.CT_TRANSACTION_TYPE_REFUND == syncUpdateObject.type) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
      refundAmount = syncUpdateObject.amountPlanned.centAmount;
      updateSyncResponse = await runSyncUpdateCaptureAmount(updateSyncResponse, refundAmount);
    } else if (Constants.VAL_FOUR_EIGHTY == reasonCode && authPresent && authReasonCodePresent) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_PENDING;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    } else if (Constants.VAL_FOUR_EIGHTY_ONE == reasonCode && authPresent && authReasonCodePresent) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
      query = Constants.PAYMENT_GATEWAY_CLIENT_REFERENCE_CODE + syncUpdateObject.id + Constants.STRING_AND + Constants.STRING_SYNC_QUERY;
      paymentDetails = await commercetoolsApi.retrievePayment(syncUpdateObject.id);
      if (paymentDetails) {
        authMid = await multiMid.getMidCredentials(paymentDetails);
        transactionDetail = await createSearchRequest.getTransactionSearchResponse(query, Constants.STRING_SYNC_SORT, authMid);
        if (null != transactionDetail && Constants.HTTP_CODE_TWO_HUNDRED_ONE == transactionDetail.httpCode && transactionDetail?.data?._embedded?.transactionSummaries) {
          transactionSummaries = transactionDetail.data._embedded.transactionSummaries;
          for (let element of transactionSummaries) {
            applications = element.applicationInformation.applications;
            for (let application of applications) {
              if (Constants.STRING_SYNC_AUTH_REVERSAL_NAME == application.name) {
                if (Constants.VAL_THIRTY_SIX == element.clientReferenceInformation.code.length) {
                  paymentDetails = await commercetoolsApi.retrievePayment(element.clientReferenceInformation.code);
                  if (null != paymentDetails && Constants.STRING_TRANSACTIONS in paymentDetails) {
                    transactions = paymentDetails.transactions;
                    if (null != applications && null != transactions) {
                      if (transactions.some((item) => item.interactionId == element.id)) {
                        if (Constants.APPLICATION_RCODE == application.rCode && Constants.APPLICATION_RFLAG == application.rFlag) {
                          authReversalTriggered = true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (!authReversalTriggered) {
        authReversalObject.paymentId = syncUpdateObject.id;
        authReversalObject.state = Constants.CT_TRANSACTION_STATE_INITIAL;
        authReversalObject.type = Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION;
        authReversalObject.amount = syncUpdateObject.amountPlanned;
        authReversalObject.version = updateSyncResponse.version;
        updateSyncResponse = await commercetoolsApi.addTransaction(authReversalObject);
      }
    } else if ((Constants.VAL_FOUR_EIGHTY == reasonCode || Constants.VAL_FOUR_EIGHTY_ONE == reasonCode) && authPresent && !authReasonCodePresent) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_FAILURE;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    } else if (Constants.VAL_HUNDRED != reasonCode && 475 != reasonCode) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_FAILURE;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    }
  } else {
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RUN_SYNC_ADD_TRANSACTION, Constants.LOG_INFO, null, Constants.ERROR_MSG_FETCH_TRANSACTIONS);
  }
  return updateSyncResponse;
};

const runSyncUpdateCaptureAmount = async (updatePaymentObj, amount) => {
  let refundAmount: any;
  let pendingTransactionAmount: any;
  let transactionId: any;
  let updateTransactions: any;
  let refundTriggered = false;
  let updateResponse: any;
  let paymentId: any;
  let paymentVersion: any;
  let refundAmountUsed: any;
  if (null != updatePaymentObj && null != amount && amount > 0) {
    refundAmount = amount;
    updateTransactions = updatePaymentObj.transactions;
    paymentId = updatePaymentObj.id;
    paymentVersion = updatePaymentObj.version;
    for (let transaction of updateTransactions) {
      if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
        if (refundAmount <= transaction.amount.centAmount && !(Constants.STRING_CUSTOM in transaction)) {
          transactionId = transaction.id;
          pendingTransactionAmount = transaction.amount.centAmount - refundAmount;
          refundTriggered = true;
          updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transactionId, pendingTransactionAmount);
          break;
        } else if (
          refundAmount <= transaction.amount.centAmount &&
          transaction?.custom?.fields?.isv_availableCaptureAmount &&
          Constants.VAL_ZERO != transaction.custom.fields.isv_availableCaptureAmount &&
          transaction.custom.fields.isv_availableCaptureAmount >= refundAmount
        ) {
          transactionId = transaction.id;
          pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmount;
          refundTriggered = true;
          updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transactionId, pendingTransactionAmount);
          break;
        }
      }
    }
    if (!refundTriggered) {
      for (let transaction of updateTransactions) {
        transactionId = null;
        if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state && Constants.VAL_ZERO < refundAmount) {
          if (transaction?.custom?.fields?.isv_availableCaptureAmount && Constants.VAL_ZERO != transaction.custom.fields.isv_availableCaptureAmount && refundAmount <= transaction.custom.fields.isv_availableCaptureAmount) {
            transactionId = transaction.id;
            refundAmountUsed = refundAmount;
            pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmountUsed;
            refundAmount = refundAmount - refundAmountUsed;
          } else if (transaction?.custom?.fields?.isv_availableCaptureAmount && Constants.VAL_ZERO != transaction.custom.fields.isv_availableCaptureAmount && refundAmount >= transaction.custom.fields.isv_availableCaptureAmount) {
            transactionId = transaction.id;
            refundAmountUsed = Number(transaction.custom.fields.isv_availableCaptureAmount);
            pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmountUsed;
            refundAmount = refundAmount - refundAmountUsed;
          } else if (refundAmount <= transaction.amount.centAmount && !(Constants.STRING_CUSTOM in transaction)) {
            transactionId = transaction.id;
            refundAmountUsed = refundAmount;
            pendingTransactionAmount = transaction.amount.centAmount - refundAmountUsed;
            refundAmount = refundAmount - refundAmountUsed;
          } else if (refundAmount >= transaction.amount.centAmount && !(Constants.STRING_CUSTOM in transaction)) {
            transactionId = transaction.id;
            refundAmountUsed = transaction.amount.centAmount;
            pendingTransactionAmount = transaction.amount.centAmount - refundAmountUsed;
            refundAmount = refundAmount - refundAmountUsed;
          }
        }
        if (null != transactionId) {
          updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transactionId, pendingTransactionAmount);
          paymentVersion = updateResponse.version;
        }
      }
    }
  } else {
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RUN_SYNC_UPDATE_CAPTURE_AMOUNT, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_PAYMENT_DETAILS);
  }
  return updateResponse;
};

const getOrderId = async (cartObj, paymentId) => {
  let orderObj: any;
  let orderNo = null;
  if (null != cartObj && Constants.VAL_ZERO < cartObj.count) {
    orderObj = await commercetoolsApi.retrieveOrderByCartId(cartObj.results[Constants.VAL_ZERO].id);
    if (null != orderObj && Constants.VAL_ZERO < orderObj.count && Constants.STRING_ORDER_NUMBER in orderObj.results[Constants.VAL_ZERO]) {
      orderNo = orderObj.results[Constants.VAL_ZERO].orderNumber;
    }
  }
  if (null == orderNo) {
    orderObj = await commercetoolsApi.retrieveOrderByPaymentId(paymentId);
    if (null != orderObj && Constants.VAL_ZERO < orderObj.count && Constants.STRING_ORDER_NUMBER in orderObj.results[Constants.VAL_ZERO]) {
      orderNo = orderObj.results[Constants.VAL_ZERO].orderNumber;
    }
  }
  return orderNo;
};

const updateCustomField = async (customFields, getCustomObj, typeId, version) => {
  let result: any;
  let exceptionData: any;
  let fieldExist = false;
  try {
    if (null != customFields && null != getCustomObj && null != typeId && null != version) {
      for (let field of customFields) {
        fieldExist = false;
        getCustomObj.forEach((custom) => {
          if (field.name == custom.name) {
            fieldExist = true;
          }
        });
        if (!fieldExist) {
          result = await commercetoolsApi.addCustomField(typeId, version, field);
          version = result.version;
        }
      }
    } else {
      logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CUSTOM_FIELDS, Constants.LOG_INFO, null, Constants.ERROR_MSG_UPDATE_CUSTOM_TYPE);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CUSTOM_FIELDS, Constants.LOG_ERROR, null, exceptionData);
  }
};

const updateCartWithUCAddress = async (updatePaymentObj, cartObj) => {
  let transientTokenData: any;
  let orderInformation: any;
  let updatedCart: any;
  let exceptionData: any;
  let message = Constants.STRING_EMPTY;
  try {
    if (null != updatePaymentObj && null != cartObj && undefined != cartObj) {
      transientTokenData = await getTransientTokenData.transientTokenDataResponse(updatePaymentObj, Constants.SERVICE_PAYMENT);
      if (Constants.STRING_EMPTY != transientTokenData && null != getTransientTokenData && Constants.HTTP_CODE_TWO_HUNDRED == transientTokenData.httpCode) {
        orderInformation = JSON.parse(transientTokenData.data).orderInformation;
        updatedCart = await commercetoolsApi.updateCartByPaymentId(cartObj.id, updatePaymentObj.id, cartObj.version, orderInformation);
        if (undefined != updatedCart) {
          cartObj = updatedCart;
          message = Constants.SUCCESS_MSG_UC_ADDRESS_DETAILS;
        } else {
          message = Constants.ERROR_MSG_UC_ADDRESS_DETAILS;
        }
      } else {
        message = Constants.ERROR_MSG_TRANSIENT_TOKEN_DATA;
      }
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CREDIT_CARD_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, message);
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CART_WITH_UC_ADDRESS, Constants.LOG_ERROR, null, exceptionData);
  }
  return cartObj;
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
  getSubstring,
  getEmptyResponse,
  invalidOperationResponse,
  invalidInputResponse,
  encryption,
  decryption,
  getAuthorizedAmount,
  addRefundAction,
  setCustomTypeData,
  getCreditCardResponse,
  getPayerAuthValidateResponse,
  getPayerAuthSetUpResponse,
  getPayerAuthEnrollResponse,
  googlePayResponse,
  clickToPayResponse,
  getAddRefundResponse,
  updateCustomField,
  checkAuthReversalTriggered,
  getRefundResponse,
  getCertificatesData,
  getApplicationsPresent,
  updateVisaDetails,
  runSyncAddTransaction,
  getCardTokens,
  getOrderId,
  setCustomerTokenData,
  rateLimiterAddToken,
  getUpdateTokenActionsWithAddress,
  convertCentToAmount,
  roundOff,
  convertAmountToCent
};
