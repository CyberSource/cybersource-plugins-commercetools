import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
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
      return await new Promise<Partial<ResponseType>>(function (resolve, reject) {
        if (customerPaymentInstrumentApiInstance) { 
          customerPaymentInstrumentApiInstance.deleteCustomerPaymentInstrument(customerTokenId, paymentInstrumentTokenId, opts, function (error: any, data: any, response: any) {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_INFO, '', 'Delete Token Response = ' + JSON.stringify(response));
            paymentUtils.logData(__filename, FunctionConstant.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_INFO, '', 'Delete Token Response Data = ' + JSON.stringify(data));
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
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        }
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_INVALID_CUSTOMER_INPUT);
      return customerTokenDeleteResponse;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_DELETE_CUSTOMER_TOKEN, '', exception, '', '', '');
    return customerTokenDeleteResponse;
  }
};

export default { deleteCustomerToken };
