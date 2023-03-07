import restApi from 'cybersource-rest-client';
import path from 'path';
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import { Constants } from '../../constants';
import paymentService from '../../utils/PaymentService';

const keys = async () => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let contextWithoutSignature: string;
  let parsedContext: string;
  let isv_tokenCaptureContextSignature = Constants.STRING_EMPTY;
  let isv_tokenVerificationContext = Constants.STRING_EMPTY;
  const format = Constants.PAYMENT_GATEWAY_JWT_FORMAT;
  try {
    const apiClient = new restApi.ApiClient();
    if (Constants.TEST_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) {
      runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
    } else if (Constants.LIVE_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) {
      runEnvironment = Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT;
    }
    const configObject = {
      authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
      runEnvironment: runEnvironment,
      merchantID: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
      merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
      merchantsecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
      logConfiguration: {
        enableLog: false,
      },
    };
    // eslint-disable-next-line no-var
    var requestObj = new restApi.GeneratePublicKeyRequest();
    requestObj.encryptionType = Constants.PAYMENT_GATEWAY_ENCRYPTION_TYPE;
    requestObj.targetOrigin = process.env.PAYMENT_GATEWAY_TARGET_ORIGIN;

    if(Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_DEBUG){
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_KEYS, Constants.LOG_INFO, null, Constants.FLEX_KEYS_REQUEST + JSON.stringify(requestObj));
    }

    const instance = new restApi.KeyGenerationApi(configObject, apiClient);
    return await new Promise(function (resolve, reject) {
      instance.generatePublicKey(format, requestObj, function (error, data, response) {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_KEYS, Constants.LOG_INFO, null, Constants.FLEX_KEYS_RESPONSE +JSON.stringify(response));
        if (data) {
          isv_tokenCaptureContextSignature = data.keyId;
          contextWithoutSignature = isv_tokenCaptureContextSignature.substring(Constants.VAL_ZERO, isv_tokenCaptureContextSignature.lastIndexOf(Constants.REGEX_DOT) + Constants.VAL_ONE);
          parsedContext = jwt_decode(contextWithoutSignature);
          isv_tokenVerificationContext = jwt.sign(parsedContext, process.env.PAYMENT_GATEWAY_VERIFICATION_KEY);
          resolve({
            isv_tokenCaptureContextSignature,
            isv_tokenVerificationContext,
          });
        } else if (error) {
          if (
            error.hasOwnProperty(Constants.STRING_RESPONSE) &&
            null != error.response &&
            Constants.VAL_ZERO < Object.keys(error.response).length &&
            error.response.hasOwnProperty(Constants.STRING_TEXT) &&
            null != error.response.text &&
            Constants.VAL_ZERO < Object.keys(error.response.text).length
          ) {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_KEYS, Constants.LOG_ERROR, null, Constants.ERROR_MSG_FLEX_TOKEN_KEYS + Constants.STRING_HYPHEN + error.response.text);
          } else {
            if (typeof error === 'object') {
              errorData = JSON.stringify(error);
            } else {
              errorData = error;
            }
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_KEYS, Constants.LOG_ERROR, null, Constants.ERROR_MSG_FLEX_TOKEN_KEYS + Constants.STRING_HYPHEN + errorData);
          }
          isv_tokenCaptureContextSignature = Constants.STRING_EMPTY;
          isv_tokenVerificationContext = Constants.STRING_EMPTY;
          reject({
            isv_tokenCaptureContextSignature,
            isv_tokenVerificationContext,
          });
        } else {
          reject({
            isv_tokenCaptureContextSignature,
            isv_tokenVerificationContext,
          });
        }
      });
    }).catch((error) => {
      return { isv_tokenCaptureContextSignature, isv_tokenVerificationContext };
    });
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_KEYS, Constants.LOG_ERROR, null, exceptionData);
    return { isv_tokenCaptureContextSignature, isv_tokenVerificationContext };
  }
};

export default { keys };
