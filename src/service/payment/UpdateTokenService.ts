import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { addressType, customerTokensType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

const updateTokenResponse = async (tokens: customerTokensType, newExpiryMonth: string, newExpiryYear: string, addressData: addressType | null) => {
  let errorData: string;
  let customerTokenId: string;
  let paymentInstrumentTokenId: string;
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
      const opts: never[] = [];
      const configObject = await prepareFields.getConfigObject('FuncUpdateTokenResponse', null, null, null);
      const requestObj = new restApi.PatchCustomerPaymentInstrumentRequest();
      const card = new restApi.Tmsv2customersEmbeddedDefaultPaymentInstrumentCard();
      card.expirationMonth = newExpiryMonth;
      card.expirationYear = newExpiryYear;
      requestObj.card = card;
      requestObj.billTo = await prepareFields.getUpdateTokenBillTo(addressData);
      const instrumentIdentifier = new restApi.Tmsv2customersEmbeddedDefaultPaymentInstrumentInstrumentIdentifier();
      instrumentIdentifier.id = tokens.instrumentIdentifier;
      requestObj.instrumentIdentifier = instrumentIdentifier;
      if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateTokenResponse', Constants.LOG_INFO, '', 'Update Token Request = ' + JSON.stringify(requestObj));
      }
      const customerPaymentInstrumentApiInstance = new restApi.CustomerPaymentInstrumentApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        customerPaymentInstrumentApiInstance.patchCustomersPaymentInstrument(customerTokenId, paymentInstrumentTokenId, requestObj, opts, function (error: any, data: any, response: any) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateTokenResponse', Constants.LOG_INFO, '', 'Update Token Response = ' + JSON.stringify(response));
          if (data) {
            tokenResponse.httpCode = response[Constants.STATUS_CODE] || response['status'];
            tokenResponse.default = data.default;
            tokenResponse.card = data.card;
            resolve(tokenResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateTokenResponse', Constants.LOG_ERROR, '', error.response.text);
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateTokenResponse', Constants.LOG_ERROR, '', errorData);
            }
            tokenResponse.httpCode = error.status;
            reject(tokenResponse);
          } else {
            reject(tokenResponse);
          }
        });
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateTokenResponse', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_INPUT);
      return tokenResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncCaptureResponse', '', exception, '', '', '');
    return tokenResponse;
  }
};

export default { updateTokenResponse };
