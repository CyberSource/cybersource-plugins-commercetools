import path from 'path';

import paymentService from '../PaymentService';
import { Constants } from '../../constants';

const getMidCredentials = async (payment) => {
  let midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  }
  let midData = [] as any;
  let exceptionData: any;
  let merchantIdentifier: any
  let allMidCredentials: any;
  try {
    if (payment && null != payment) {
      if (payment?.custom?.fields?.isv_merchantId && Constants.STRING_EMPTY != payment.custom.fields.isv_merchantId) {
        merchantIdentifier = payment.custom.fields.isv_merchantId;
        allMidCredentials = await getAllMidDetails();
        allMidCredentials.forEach(async element => {
          if (element.merchantId == merchantIdentifier) {
            midData = element;
          }
        });
        if (midData.length == Constants.VAL_ZERO) {
          midData.merchantId = merchantIdentifier;
          midData.merchantKeyId = null;
          midData.merchantSecretKey = null;
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_MID_CREDENTIALS, Constants.LOG_WARN, Constants.LOG_PAYMENT_ID + payment.id, merchantIdentifier + Constants.ERROR_MSG_MERCHANT_ID_NOT_FOUND);
        }
      } else {
        midData = midCredentials;
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_MID_CREDENTIALS, Constants.LOG_WARN, Constants.LOG_PAYMENT_ID + payment.id, Constants.ERROR_MSG_MULTI_MID_NOT_ENABLED);
      }
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_GET_MID_CREDENTIALS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_GET_MID_CREDENTIALS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_GET_MID_CREDENTIALS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_MID_CREDENTIALS, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, exceptionData);
  }
  return midData;
}

const getAllMidDetails = async () => {
  let environment: any;
  let midArray = [] as any;
  let keyId: any;
  let secretKey: any;
  let secretKeyPrefix = Constants.STRING_EMPTY;
  let secretKeyIndex: any;
  let exceptionData: any;
  try {
    environment = process.env;
    for (let variable in environment) {
      if ((variable.includes(Constants.STRING_SECRET_KEY)) && variable != Constants.DEFAULT_MERCHANT_SECRET_KEY_VARIABLE) {
        secretKeyIndex = variable.indexOf(Constants.STRING_SECRET_KEY);
        secretKeyPrefix = variable.slice(Constants.VAL_ZERO, secretKeyIndex);
        keyId = process.env[secretKeyPrefix + Constants.STRING_KEY_ID];
        secretKey = process.env[variable];
        if (Constants.STRING_EMPTY != secretKeyPrefix && undefined != keyId && Constants.STRING_EMPTY != keyId && undefined != secretKey && Constants.STRING_EMPTY != secretKey) {
          midArray.push({
            merchantId: secretKeyPrefix.toLowerCase(),
            merchantKeyId: keyId,
            merchantSecretKey: secretKey,
          })
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_ALL_MID_DETAILS, Constants.LOG_ERROR, null, Constants.ERROR_MSG_ENV_VARIABLES_NOT_FOUND + secretKeyPrefix.toLowerCase());
        }
      }
    }
  }
  catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_ALL_MID_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_ALL_MID_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_ALL_MID_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_ALL_MID_DETAILS, Constants.LOG_ERROR, null, exceptionData);
  }
  return midArray;
}

export default {
  getMidCredentials,
  getAllMidDetails
}