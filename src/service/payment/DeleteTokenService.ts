import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { CustomerTokensType, ResponseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

/**
 * Deletes a customer token.
 * @param {CustomerTokensType} customerTokenObj - The customer token object to delete.
 * @returns {Promise<any>} A promise that resolves with the delete customer token response.
 */
const deleteCustomerToken = async (customerTokenObj: CustomerTokensType): Promise<any> => {
  let errorData: string;
  const opts: never[] = [];
  const customerTokenDeleteResponse = {
    httpCode: 0,
    deletedToken: '',
  };
  try {
    if (customerTokenObj && customerTokenObj?.value && customerTokenObj?.paymentToken) {
      const customerTokenId = customerTokenObj.value;
      const paymentInstrumentTokenId = customerTokenObj.paymentToken;
      const configObject = await prepareFields.getConfigObject('FuncDeleteCustomerToken', null, null, null);
      const apiClient = new restApi.ApiClient();
      const customerPaymentInstrumentApiInstance = new restApi.CustomerPaymentInstrumentApi(configObject, apiClient);
      return await new Promise<ResponseType>(function (resolve, reject) {
        customerPaymentInstrumentApiInstance.deleteCustomerPaymentInstrument(customerTokenId, paymentInstrumentTokenId, opts, function (error: any, data: any, response: any) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteCustomerToken', Constants.LOG_INFO, '', 'Delete Token Response = ' + JSON.stringify(response));
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteCustomerToken', Constants.LOG_INFO, '', 'Delete Token Response Data = ' + JSON.stringify(data));
          if (Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE === response?.status) {
            customerTokenDeleteResponse.httpCode = response.status;
            customerTokenDeleteResponse.deletedToken = paymentInstrumentTokenId;
            resolve(customerTokenDeleteResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteCustomerToken', Constants.LOG_ERROR, '', error.response.text);
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteCustomerToken', Constants.LOG_ERROR, '', errorData);
            }
            customerTokenDeleteResponse.httpCode = response.status;
            reject(customerTokenDeleteResponse);
          } else {
            reject(customerTokenDeleteResponse);
          }
        });
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteCustomerToken', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_CUSTOMER_INPUT);
      return customerTokenDeleteResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncDeleteCustomerToken', '', exception, '', '', '');
    return customerTokenDeleteResponse;
  }
};

export default { deleteCustomerToken };
