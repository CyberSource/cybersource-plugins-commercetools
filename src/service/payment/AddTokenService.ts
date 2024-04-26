import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { addressType, customerType, customTokenType, responseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

const addTokenResponse = async (customerId: string, customerObj: customerType, address: addressType | null, cardTokens: customTokenType) => {
  let errorData: string;
  const paymentResponse = {
    httpCode: 0,
    transactionId: '',
    status: '',
    data: '',
  };
  try {
    if (customerId && customerObj && address && customerObj?.custom?.fields?.isv_token) {
      const apiClient = new restApi.ApiClient();
      const requestObj = new restApi.CreatePaymentRequest();
      const configObject = await prepareFields.getConfigObject('FuncAddTokenResponse', null, null, null);

      requestObj.clientReferenceInformation = await prepareFields.getClientReferenceInformation('FuncAddTokenResponse', customerId);
      requestObj.processingInformation = await prepareFields.getProcessingInformation('FuncAddTokenResponse', null, '', '', cardTokens, null);
      const tokenInformation = new restApi.Ptsv2paymentsTokenInformation();
      tokenInformation.transientTokenJwt = customerObj.custom.fields.isv_token;
      requestObj.tokenInformation = tokenInformation;
      requestObj.paymentInformation = await prepareFields.getPaymentInformation('FuncAddTokenResponse', null, cardTokens, null);
      const currencyCode = customerObj?.custom?.fields?.isv_currencyCode ? customerObj.custom.fields.isv_currencyCode : '';
      requestObj.orderInformation = await prepareFields.getOrderInformation('FuncAddTokenResponse', null, null, '', customerObj, address, null, currencyCode);
      requestObj.deviceInformation = await prepareFields.getDeviceInformation(null, customerObj);

      if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddTokenResponse', Constants.LOG_INFO, 'CustomerId : ' + customerId, 'Add Token Request = ' + JSON.stringify(requestObj));
      }
      const paymentsApiInstance = new restApi.PaymentsApi(configObject, apiClient);
      return await new Promise<responseType>(function (resolve, reject) {
        paymentsApiInstance.createPayment(requestObj, function (error: any, data: any, response: any) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddTokenResponse', Constants.LOG_INFO, 'CustomerId : ' + customerId, 'Add Token Response = ' + JSON.stringify(response));
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE] || response['status'];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            paymentResponse.data = data;
            resolve(paymentResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddTokenResponse', Constants.LOG_ERROR, 'CustomerId : ' + customerId, error.response.text);
              const errorDataObject = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
              paymentResponse.transactionId = errorDataObject.id;
              paymentResponse.status = errorDataObject.status;
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddTokenResponse', Constants.LOG_ERROR, 'CustomerId : ' + customerId, errorData);
            }
            paymentResponse.httpCode = error.status;
            reject(paymentResponse);
          } else {
            reject(paymentResponse);
          }
        });
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddTokenResponse', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAddTokenResponse', '', exception, customerId, 'CustomerId : ', '');
    return paymentResponse;
  }
};

export default { addTokenResponse };
