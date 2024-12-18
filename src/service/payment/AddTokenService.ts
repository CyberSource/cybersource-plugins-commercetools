import restApi, { CreatePaymentRequest, Ptsv2paymentsOrderInformation, Ptsv2paymentsProcessingInformation, Ptsv2paymentsTokenInformation } from 'cybersource-rest-client';
import { PtsV2PaymentsPost201Response } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
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
  if (customerId && customerObj && address && customerObj?.custom?.fields?.isv_token) {
    const apiClient = new restApi.ApiClient();
    const configObject = prepareFields.getConfigObject(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, null, null, null);
    let clientReferenceInformation = prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, customerId);
    let processingInformation = prepareFields.getProcessingInformation(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, null, '', '', cardTokens, null) as Ptsv2paymentsProcessingInformation;
    const tokenInformation: Ptsv2paymentsTokenInformation = {
      transientTokenJwt: customerObj.custom.fields.isv_token
    };
    let paymentInformation = prepareFields.getPaymentInformation(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, null, cardTokens, null);
    const currencyCode = customerObj?.custom?.fields?.isv_currencyCode || '';
    let orderInformation = prepareFields.getOrderInformation(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, null, null, '', customerObj, address, null, currencyCode) as Ptsv2paymentsOrderInformation;
    let deviceInformation = prepareFields.getDeviceInformation(null, customerObj, '');
    const requestObj: CreatePaymentRequest = {
      clientReferenceInformation: clientReferenceInformation,
      processingInformation: processingInformation,
      tokenInformation: tokenInformation,
      paymentInformation: paymentInformation,
      orderInformation: orderInformation,
      deviceInformation: deviceInformation
    }
    if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, Constants.LOG_DEBUG, 'CustomerId : ' + customerId, 'Add Token Request = ' + paymentUtils.maskData(JSON.stringify(requestObj)));
    }
    const paymentsApiInstance = configObject && new restApi.PaymentsApi(configObject, apiClient);
    const startTime = new Date().getTime();
    return await new Promise<PtsV2PaymentsPost201Response>(function (resolve, reject) {
      if (paymentsApiInstance) {
        paymentsApiInstance.createPayment(requestObj, function (error: any, data: any, response: any) {
          const endTime = new Date().getTime();
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, Constants.LOG_DEBUG, 'CustomerId : ' + customerId, 'Add Token Response = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
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
      }
    }).catch((error) => {
      return error;
    });
  } else {
    return paymentResponse;
  }
};

export default { getAddTokenResponse };
