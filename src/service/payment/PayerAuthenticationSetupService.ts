import restApi, { PayerAuthSetupRequest, Riskv1authenticationsetupsTokenInformation } from 'cybersource-rest-client';
import { RiskV1AuthenticationSetupsPost201Response } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { PaymentType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Performs payer authentication setup and returns the response.
 * @param {PaymentType} payment - The payment object.
 * @param {string} customerTokenId - The customer token ID.
 * @returns {Promise<RiskV1AuthenticationSetupsPost201Response>} - The payer authentication setup response.
*/
const getPayerAuthSetupData = async (payment: PaymentType, customerTokenId: string): Promise<any> => {
  let paymentId = payment?.id || '';
  let errorData = {
    id: null,
    status: null,
  };
  const paymentResponse = {
    accessToken: '',
    referenceId: '',
    deviceDataCollectionUrl: '',
    httpCode: 0,
    transactionId: '',
    status: '',
  };
  if (payment) {
    const apiClient = new restApi.ApiClient();
    const configObject = prepareFields.getConfigObject(FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_DATA, null, payment, null);
    let clientReferenceInformation = prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_DATA, payment.id);
    const tokenInformation: Riskv1authenticationsetupsTokenInformation = prepareFields.getTokenInformation(payment, FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_DATA);
    const requestObj: PayerAuthSetupRequest = {
      clientReferenceInformation: clientReferenceInformation,
      ...tokenInformation.transientToken && { tokenInformation }
    };
    if (payment?.custom?.fields?.isv_savedToken) {
      const paymentInformation = prepareFields.getPaymentInformation(FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_DATA, payment, null, customerTokenId);
      requestObj.paymentInformation = paymentInformation;
    }
    if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_DATA, Constants.LOG_DEBUG, 'PaymentId : ' + paymentId, 'Payer Authentication Setup Request = ' + paymentUtils.maskData(JSON.stringify(requestObj)));
    }
    const payerAuthenticationApiInstance = configObject && new restApi.PayerAuthenticationApi(configObject, apiClient);
    const startTime = new Date().getTime();
    return await new Promise<RiskV1AuthenticationSetupsPost201Response>(function (resolve, reject) {
      if (payerAuthenticationApiInstance) {
        payerAuthenticationApiInstance.payerAuthSetup(requestObj, function (error: any, data: any, response: any) {
          const endTime = new Date().getTime();
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_DATA, Constants.LOG_DEBUG, 'PaymentId : ' + paymentId, 'Payer Authentication Setup Response = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE] || response[Constants.STRING_RESPONSE_STATUS];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            paymentResponse.accessToken = data.consumerAuthenticationInformation.accessToken;
            paymentResponse.referenceId = data.consumerAuthenticationInformation.referenceId;
            paymentResponse.deviceDataCollectionUrl = data.consumerAuthenticationInformation.deviceDataCollectionUrl;
            resolve(paymentResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_DATA, Constants.LOG_ERROR, 'PaymentId : ' + paymentId, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
              if (errorData?.id && errorData?.status) {
                paymentResponse.transactionId = errorData.id;
                paymentResponse.status = errorData.status;
              }
            } else {
              let errorDataObj;
              typeof error === Constants.STR_OBJECT ? (errorDataObj = JSON.stringify(error)) : (errorDataObj = error);
              paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_DATA, Constants.LOG_ERROR, 'PaymentId : ' + paymentId, errorDataObj);
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

export default { getPayerAuthSetupData };
