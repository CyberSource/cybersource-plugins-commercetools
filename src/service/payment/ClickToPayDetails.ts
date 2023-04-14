import restApi from 'cybersource-rest-client';
import path from 'path';
import { Constants } from '../../constants';
import paymentService from '../../utils/PaymentService';
import multiMid from '../../utils/config/MultiMid';

const getVisaCheckoutData = async (paymentResponse, payment) => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let visaCheckoutData = {
    httpCode: null,
    billToFieldGroup: null,
    shipToFieldGroup: null,
    cardFieldGroup: null,
  };
  let midCredentials: any;
  try {
    if (null != paymentResponse && null != payment) {
      const id = paymentResponse.transactionId;
      if (null != id) {
        if (Constants.TEST_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) {
          runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
        } else if (Constants.LIVE_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) {
          runEnvironment = Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT;
        }
        midCredentials = await multiMid.getMidCredentials(payment);
        const configObject = {
          authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
          runEnvironment: runEnvironment,
          merchantID: midCredentials.merchantId,
          merchantKeyId: midCredentials.merchantKeyId,
          merchantsecretKey: midCredentials.merchantSecretKey,
          logConfiguration: {
            enableLog: false,
          },
        };
        const apiClient = new restApi.ApiClient();
        const instance = new restApi.TransactionDetailsApi(configObject, apiClient);
        return await new Promise((resolve, reject) => {
          instance.getTransaction(id, function (error, data, response) {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_VISA_CHECKOUT_DATA, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.TRANSACTION_DETAILS_RESPONSE + JSON.stringify(response));
            if (data) {
              visaCheckoutData.httpCode = response[Constants.STRING_RESPONSE_STATUS];
              visaCheckoutData.billToFieldGroup = data.orderInformation.billTo;
              visaCheckoutData.shipToFieldGroup = data.orderInformation.shipTo;
              visaCheckoutData.cardFieldGroup = data.paymentInformation.card;
              resolve(visaCheckoutData);
            } else if (error) {
              if (error.hasOwnProperty(Constants.STRING_RESPONSE) && null != error.response && Constants.VAL_ZERO < Object.keys(error.response).length && error.response.hasOwnProperty(Constants.STRING_TEXT) && null != error.response.text && Constants.VAL_ZERO < Object.keys(error.response.text).length) {
                paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_VISA_CHECKOUT_DATA, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, error.response.text);
              } else {
                if (typeof error === 'object') {
                  errorData = JSON.stringify(error);
                } else {
                  errorData = error;
                }
                paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_VISA_CHECKOUT_DATA, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, errorData);
              }
              visaCheckoutData.httpCode = error.status;
              reject(visaCheckoutData);
            } else {
              reject(visaCheckoutData);
            }
          });
        }).catch((error) => {
          return visaCheckoutData;
        });
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_VISA_CHECKOUT_DATA, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
        return visaCheckoutData;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_VISA_CHECKOUT_DATA, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
      return visaCheckoutData;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    if (Constants.EXCEPTION_MERCHANT_SECRET_KEY_REQUIRED == exceptionData || Constants.EXCEPTION_MERCHANT_KEY_ID_REQUIRED == exceptionData) {
      exceptionData = Constants.EXCEPTION_MSG_ENV_VARIABLE_NOT_SET + midCredentials.merchantId;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_VISA_CHECKOUT_DATA, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, exceptionData);
    return visaCheckoutData;
  }
};

export default { getVisaCheckoutData };
