import restApi, { Ptsv2paymentsOrderInformation, Ptsv2paymentsProcessingInformation } from 'cybersource-rest-client';
import { PtsV2PaymentsPost201Response } from 'cybersource-rest-client';
import { CreatePaymentRequest } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { CustomTokenType, PaymentType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Performs authorization and returns the response.
 * @param {PaymentType} payment - The payment object.
 * @param {any} cart - The cart object.
 * @param {string} service - The service string.
 * @param {CustomTokenType} cardTokens - The card tokens object.
 * @param {boolean} isSaveToken - Boolean indicating whether to save the token.
 * @param {boolean} payerAuthMandateFlag - Boolean indicating the payer authentication mandate flag.
 * @param {string} orderNo - The order number.
 * @returns { Promise<PtsV2PaymentsPost201Response>} - The authorization response.
 */
const getAuthorizationResponse = async (payment: PaymentType, cart: any, service: string, cardTokens: CustomTokenType, isSaveToken: boolean, payerAuthMandateFlag: boolean, orderNo: string): Promise<any> => {
  const paymentResponse = {
    httpCode: 0,
    transactionId: '',
    status: '',
    data: '',
    action: '',
    requestData: '',
    text: ''
  };
  try {
    if (payment && payment?.custom?.fields && cart && service && cart?.locale) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, null, payment, null);
      const customFields = payment?.custom?.fields;
      let clientReferenceInformation = await prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, payment.id, payment);
      const requestObj: CreatePaymentRequest = {
        clientReferenceInformation: clientReferenceInformation
      };
      const processingInformation = await prepareFields.getProcessingInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, payment, orderNo, service, cardTokens, isSaveToken) as Ptsv2paymentsProcessingInformation;
      const tokenInformation = await prepareFields.getTokenInformation(payment, FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE);
      if (Constants.CREDIT_CARD === payment.paymentMethodInfo.method || Constants.CC_PAYER_AUTHENTICATION === payment.paymentMethodInfo.method) {
        if (!customFields?.isv_savedToken) requestObj.tokenInformation = tokenInformation;
        if (Constants.CC_PAYER_AUTHENTICATION === payment.paymentMethodInfo.method) {
          const consumerAuthenticationInformation = await prepareFields.getConsumerAuthenticationInformation(payment, service, isSaveToken, payerAuthMandateFlag);
          requestObj.consumerAuthenticationInformation = consumerAuthenticationInformation;
        }
      }
      if (customFields?.isv_transientToken && processingInformation) {
        requestObj.tokenInformation = tokenInformation;
        processingInformation.commerceIndicator = 'internet';
      }
      requestObj.processingInformation = processingInformation;
      const paymentInformation = await prepareFields.getPaymentInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, payment, cardTokens, null);
      requestObj.paymentInformation = paymentInformation;
      requestObj.orderInformation = await prepareFields.getOrderInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, payment, payment.transactions[0], cart, null, null, null, '') as Ptsv2paymentsOrderInformation;
      requestObj.deviceInformation = await prepareFields.getDeviceInformation(payment, null, service);
      requestObj.riskInformation = await prepareFields.getRiskInformation(payment);
      if (0 < cart?.discountCodes.length) {
        const promotionInformation = await prepareFields.getPromotionInformation(cart);
        if (promotionInformation) requestObj.promotionInformation = promotionInformation;
      }
      requestObj.buyerInformation = await prepareFields.getBuyerInformation(payment);
      if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) {
        Constants.STRING_ENROLL_CHECK === service
          ? paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Payer Authentication Enrolment Check Request = ' + JSON.stringify(requestObj))
          : paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Authorization Request = ' + JSON.stringify(requestObj));
      }
      const paymentsApiInstance = configObject && new restApi.PaymentsApi(configObject, apiClient);
      return await new Promise<PtsV2PaymentsPost201Response>(function (resolve, reject) {
        if(paymentsApiInstance) {
          paymentsApiInstance.createPayment(requestObj, async function (error: any, data: any, response: any) {
            let logMessage = Constants.STRING_ENROLL_CHECK === service ? 'Payer Authentication Enrolment Check Response = ' : 'Authorization Response = ';
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, logMessage + JSON.stringify(response));
            if (data) {
              paymentResponse.httpCode = response[Constants.STATUS_CODE] || response[Constants.STRING_RESPONSE_STATUS];
              paymentResponse.transactionId = data.id;
              paymentResponse.status = data.status;
              paymentResponse.data = data;
              paymentResponse.text = JSON.parse(response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
              paymentResponse.requestData = JSON.parse(response?.req?.data);
              if (JSON.parse(response.text).riskInformation?.profile?.action) {
                paymentResponse.action = JSON.parse(response.text).riskInformation?.profile?.action;
              }
              resolve(paymentResponse);
            } else if (error) {
              if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
                const errorDataObj = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
                paymentResponse.transactionId = errorDataObj.id;
                paymentResponse.status = errorDataObj.status;
              }
              paymentResponse.httpCode = error.status;
              if (response?.text) {
                paymentResponse.text = JSON.parse(response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
              }
              reject(paymentResponse);
            } else {
              reject(paymentResponse);
            }
          });
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        }
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, CustomMessages.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, '', exception, payment.id, 'PaymentId : ', '');
    return paymentResponse;
  }
};

export default { getAuthorizationResponse };
