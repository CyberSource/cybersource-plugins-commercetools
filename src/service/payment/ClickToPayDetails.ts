import restApi from 'cybersource-rest-client';
import path from 'path';
import { Constants } from '../../constants';
import paymentService from '../../utils/PaymentService';

const getVisaCheckoutData = async (paymentResponse) => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let visaCheckoutData = {
    httpCode: null,
    billToFieldGroup: null,
    shipToFieldGroup: null,
    cardFieldGroup: null,
  };
  try {
    if (null != paymentResponse) {
      const id = paymentResponse.transactionId;
      if (null != id) {
        if (process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() == Constants.TEST_ENVIRONMENT) {
          runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
        } else if (process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() == Constants.LIVE_ENVIRONMENT) {
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
        const apiClient = new restApi.ApiClient();
        const instance = new restApi.TransactionDetailsApi(configObject, apiClient);
        return await new Promise((resolve, reject) => {
          instance.getTransaction(id, function (error, data, response) {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_VISA_CHECKOUT_DATA, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentResponse.data.clientReferenceInformation.code, Constants.TRANSACTION_DETAILS_RESPONSE + JSON.stringify(response));
            if (data) {
              visaCheckoutData.httpCode = response[Constants.STRING_RESPONSE_STATUS];
              visaCheckoutData.billToFieldGroup = data.orderInformation.billTo;
              visaCheckoutData.shipToFieldGroup = data.orderInformation.shipTo;
              visaCheckoutData.cardFieldGroup = data.paymentInformation.card;
              resolve(visaCheckoutData);
            } else if (error) {
              if (error.hasOwnProperty(Constants.STRING_RESPONSE) && null != error.response &&  Constants.VAL_ZERO < Object.keys(error.response).length && error.response.hasOwnProperty(Constants.STRING_TEXT) && null != error.response.text && Constants.VAL_ZERO < Object.keys(error.response.text).length) {
                paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_VISA_CHECKOUT_DATA, Constants.LOG_INFO, error.response.text);
              } else {
                if (typeof error === 'object') {
                  errorData = JSON.stringify(error);
                } else {
                  errorData = error;
                }
                paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_VISA_CHECKOUT_DATA, Constants.LOG_INFO, errorData);
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
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_VISA_CHECKOUT_DATA, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_INPUT);
        return visaCheckoutData;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_VISA_CHECKOUT_DATA, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentResponse.data.clientReferenceInformation.code, Constants.ERROR_MSG_INVALID_INPUT);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_VISA_CHECKOUT_DATA, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentResponse.data.clientReferenceInformation.code, exceptionData);
    return visaCheckoutData;
  }
};

export default { getVisaCheckoutData };
