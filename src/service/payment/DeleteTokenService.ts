import restApi from 'cybersource-rest-client';

import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { CustomerTokensType, ResponseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Deletes a customer token.
 * @param {CustomerTokensType} customerTokenObj - The customer token object to delete.
 * @returns {Promise<any>} A promise that resolves with the delete customer token response.
 */
const deleteCustomerToken = async (customerTokenObj: Partial<CustomerTokensType>): Promise<any> => {
  const opts = '';
  const customerTokenDeleteResponse = {
    httpCode: 0,
    deletedToken: '',
  };
  try {
    if (customerTokenObj && customerTokenObj?.value && customerTokenObj?.paymentToken) {
      const customerTokenId = customerTokenObj.value;
      const paymentInstrumentTokenId = customerTokenObj.paymentToken;
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_DELETE_CUSTOMER_TOKEN, null, null, null);
      const apiClient = new restApi.ApiClient();
      const customerPaymentInstrumentApiInstance = configObject && new restApi.CustomerPaymentInstrumentApi(configObject, apiClient);
      const startTime = new Date().getTime();
      return await new Promise<Partial<ResponseType>>(function (resolve, reject) {
        if (customerPaymentInstrumentApiInstance) {
          customerPaymentInstrumentApiInstance.deleteCustomerPaymentInstrument(customerTokenId, paymentInstrumentTokenId, opts, function (error: any, data: any, response: any) {
            const endTime = new Date().getTime();
            paymentUtils.logData(__filename, FunctionConstant.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_DEBUG, '', 'Delete Token Response = ' + response, `${endTime - startTime}`);
            paymentUtils.logData(__filename, FunctionConstant.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_DEBUG, '', 'Delete Token Response Data = ' + data);
            if (Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE === response?.status) {
              customerTokenDeleteResponse.httpCode = response.status;
              customerTokenDeleteResponse.deletedToken = paymentInstrumentTokenId;
              resolve(customerTokenDeleteResponse);
            } else if (error) {
              customerTokenDeleteResponse.httpCode = response.status;
              reject(customerTokenDeleteResponse);
            } else {
              reject(customerTokenDeleteResponse);
            }
          });
        }
      }).catch((error) => {
        return error;
      });
    } else {
      return customerTokenDeleteResponse;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_DELETE_CUSTOMER_TOKEN, '', exception, '', '', '');
    return customerTokenDeleteResponse;
  }
};

export default { deleteCustomerToken };
