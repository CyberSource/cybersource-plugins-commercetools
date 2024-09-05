import restApi, { CreatePaymentRequest, Ptsv2paymentsOrderInformation, Ptsv2paymentsProcessingInformation, Ptsv2paymentsTokenInformation } from 'cybersource-rest-client';
import { PtsV2PaymentsPost201Response } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { AddressType, CustomerType, CustomTokenType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Service function responsible for Adding token to a customer.
 * @param {string} customerId - The ID of the customer.
 * @param {CustomerType} customerObj - The customer object containing necessary information.
 * @param {AddressType|null} address - The customer's address.
 * @param {CustomTokenType} cardTokens - The token information.
 * @returns {Promise<PtsV2PaymentsPost201Response>} A promise that resolves with the payment response.
 */
const getAddTokenResponse = async (customerId: string, customerObj: Partial<CustomerType>, address: AddressType | null, cardTokens: CustomTokenType): Promise<PtsV2PaymentsPost201Response | any> => {
  const paymentResponse = {
    httpCode: 0,
    transactionId: '',
    status: '',
    data: '',
  };
  try {
    if (customerId && customerObj && address && customerObj?.custom?.fields?.isv_token) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, null, null, null);
      let clientReferenceInformation = await prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, customerId);
      let processingInformation = await prepareFields.getProcessingInformation(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, null, '', '', cardTokens, null) as Ptsv2paymentsProcessingInformation;
      const tokenInformation: Ptsv2paymentsTokenInformation = {
        transientTokenJwt: customerObj.custom.fields.isv_token
      };
      let paymentInformation = await prepareFields.getPaymentInformation(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, null, cardTokens, null);
      const currencyCode = customerObj?.custom?.fields?.isv_currencyCode || '';
      let orderInformation = await prepareFields.getOrderInformation(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, null, null, '', customerObj, address, null, currencyCode) as Ptsv2paymentsOrderInformation;
      let deviceInformation = await prepareFields.getDeviceInformation(null, customerObj, '');
      const requestObj: CreatePaymentRequest = {
        clientReferenceInformation: clientReferenceInformation,
        processingInformation: processingInformation,
        tokenInformation: tokenInformation,
        paymentInformation: paymentInformation,
        orderInformation: orderInformation,
        deviceInformation: deviceInformation
      }

      if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, Constants.LOG_INFO, 'CustomerId : ' + customerId, 'Add Token Request = ' + JSON.stringify(requestObj));
      }
      const paymentsApiInstance = configObject && new restApi.PaymentsApi(configObject, apiClient);
      return await new Promise<PtsV2PaymentsPost201Response>(function (resolve, reject) {
        if (paymentsApiInstance) {
          paymentsApiInstance.createPayment(requestObj, function (error: any, data: any, response: any) {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, Constants.LOG_INFO, 'CustomerId : ' + customerId, 'Add Token Response = ' + JSON.stringify(response));
            if (data) {
              paymentResponse.httpCode = response[Constants.STATUS_CODE] || response[Constants.STRING_RESPONSE_STATUS];
              paymentResponse.transactionId = data.id;
              paymentResponse.status = data.status;
              paymentResponse.data = data;
              resolve(paymentResponse);
            } else if (error) {
              if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
                const errorDataObject = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
                paymentResponse.transactionId = errorDataObject.id;
                paymentResponse.status = errorDataObject.status;
              }
              paymentResponse.httpCode = error.status;
              reject(paymentResponse);
            } else {
              reject(paymentResponse);
            }
          });
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, Constants.LOG_INFO, 'CustomerId : ' + customerId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        }
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, Constants.LOG_INFO, 'CustomerId : ' + customerId, CustomMessages.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, '', exception, customerId, 'CustomerId : ', '');
    return paymentResponse;
  }
};

export default { getAddTokenResponse };
