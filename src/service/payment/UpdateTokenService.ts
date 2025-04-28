import restApi, { PatchCustomerPaymentInstrumentRequest, Tmsv2customersEmbeddedDefaultPaymentInstrumentCard, Tmsv2customersEmbeddedDefaultPaymentInstrumentInstrumentIdentifier } from 'cybersource-rest-client';

import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { AddressType, CustomerTokensType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Updates the token and returns the response.
 * @param {CustomerTokensType} tokens - The customer tokens object.
 * @param {string} newExpiryMonth - The new expiry month.
 * @param {string} newExpiryYear - The new expiry year.
 * @param {AddressType | null} addressData - The address data.
 * @returns {Promise<unknown>} - The update token response.
 */
const getUpdateTokenResponse = async (tokens: Partial<CustomerTokensType>, newExpiryMonth: string, newExpiryYear: string, addressData: AddressType | null): Promise<unknown> => {
  let customerTokenId: string;
  let paymentInstrumentTokenId: string;
  const opts = '';
  const tokenResponse = {
    httpCode: 0,
    default: null,
    card: null,
  };
  try {
    if (tokens && tokens?.value && tokens?.paymentToken && tokens?.cardExpiryMonth && tokens?.cardExpiryYear) {
      customerTokenId = tokens.value;
      paymentInstrumentTokenId = tokens.paymentToken;
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_UPDATE_TOKEN_RESPONSE, null, null, null);
      let billTo = prepareFields.getUpdateTokenBillTo(addressData);
      const card: Tmsv2customersEmbeddedDefaultPaymentInstrumentCard = {
        expirationMonth: newExpiryMonth,
        expirationYear: newExpiryYear
      }
      const instrumentIdentifier: Tmsv2customersEmbeddedDefaultPaymentInstrumentInstrumentIdentifier = {
        id: tokens.instrumentIdentifier
      }
      const requestObj: PatchCustomerPaymentInstrumentRequest = {
        card: card,
        billTo: billTo,
        instrumentIdentifier: instrumentIdentifier
      }
      if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_UPDATE_TOKEN_RESPONSE, Constants.LOG_DEBUG, '', 'Update Token Request = ' + paymentUtils.maskData(JSON.stringify(requestObj)));
      }
      const startTime = new Date().getTime();
      const customerPaymentInstrumentApiInstance = configObject && new restApi.CustomerPaymentInstrumentApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        if (customerPaymentInstrumentApiInstance) {
          customerPaymentInstrumentApiInstance.patchCustomersPaymentInstrument(customerTokenId, paymentInstrumentTokenId, requestObj, opts, function (error: any, data: any, response: any) {
            const endTime = new Date().getTime();
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_UPDATE_TOKEN_RESPONSE, Constants.LOG_DEBUG, '', 'Update Token Response = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
            if (data) {
              tokenResponse.httpCode = response[Constants.STATUS_CODE] || response[Constants.STRING_RESPONSE_STATUS];
              tokenResponse.default = data.default;
              tokenResponse.card = data.card;
              resolve(tokenResponse);
            } else if (error) {
              tokenResponse.httpCode = error.status;
              reject(tokenResponse);
            } else {
              reject(tokenResponse);
            }
          });
        }
      }).catch((error) => {
        return error;
      });
    } else {
      return tokenResponse;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_UPDATE_TOKEN_RESPONSE, '', exception, '', '', '');
    return tokenResponse;
  }
};

export default { getUpdateTokenResponse };
