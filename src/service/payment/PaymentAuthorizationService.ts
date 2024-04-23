import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { customTokenType, paymentType, responseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

const authorizationResponse = async (payment: paymentType, cart: any, service: string, cardTokens: customTokenType, notSaveToken: boolean, payerAuthMandateFlag: boolean, orderNo: string) => {
  let errorData: string;
  const paymentResponse = {
    httpCode: 0,
    transactionId: '',
    status: '',
    data: '',
  };
  try {
    if (payment && payment?.custom?.fields && cart && service && cart?.locale) {
      const apiClient = new restApi.ApiClient();

      const configObject = await prepareFields.getConfigObject('FuncAuthorizationResponse', null, payment, null);
      const customFields = payment?.custom?.fields;
      const requestObj = new restApi.CreatePaymentRequest(payment, customFields, orderNo, service, cardTokens, notSaveToken);

      requestObj.clientReferenceInformation = await prepareFields.getClientReferenceInformation('FuncAuthorizationResponse', payment.id);
      const processingInformation = await prepareFields.getProcessingInformation('FuncAuthorizationResponse', payment, orderNo, service, cardTokens, notSaveToken);
      const tokenInformation = await prepareFields.getTokenInformation(payment, 'FuncAuthorizationResponse');
      if (Constants.CREDIT_CARD === payment.paymentMethodInfo.method || Constants.CC_PAYER_AUTHENTICATION === payment.paymentMethodInfo.method) {
        if (!customFields?.isv_savedToken) {
          requestObj.tokenInformation = tokenInformation;
        }
        if (Constants.CC_PAYER_AUTHENTICATION === payment.paymentMethodInfo.method) {
          const consumerAuthenticationInformation = await prepareFields.getConsumerAuthenticationInformation(payment, service, notSaveToken, payerAuthMandateFlag);
          requestObj.consumerAuthenticationInformation = consumerAuthenticationInformation;
        }
      }
      if (customFields?.isv_transientToken) {
        requestObj.tokenInformation = tokenInformation;
        processingInformation.commerceIndicator = 'internet';
      }
      requestObj.processingInformation = processingInformation;
      const paymentInformation = await prepareFields.getPaymentInformation('FuncAuthorizationResponse', payment, cardTokens, null);
      requestObj.paymentInformation = paymentInformation;
      requestObj.orderInformation = await prepareFields.getOrderInformation('FuncAuthorizationResponse', payment, payment.transactions[0], cart, null, null, null, '');
      requestObj.deviceInformation = await prepareFields.getDeviceInformation(payment, null);

      if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        Constants.STRING_ENROLL_CHECK === service
          ? paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthorizationResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Payer Authentication Enrolment Check Request = ' + JSON.stringify(requestObj))
          : paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthorizationResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Authorization Request = ' + JSON.stringify(requestObj));
      }
      const paymentsApiInstance = new restApi.PaymentsApi(configObject, apiClient);
      return await new Promise<responseType>(function (resolve, reject) {
        paymentsApiInstance.createPayment(requestObj, async function (error: any, data: any, response: any) {
          let logMessage = Constants.STRING_ENROLL_CHECK === service ? 'Payer Authentication Enrolment Check Response = ' : 'Authorization Response = ';
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthorizationResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, logMessage + JSON.stringify(response));
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE] || response['status'];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            paymentResponse.data = data;
            resolve(paymentResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthorizationResponse', Constants.LOG_ERROR, 'PaymentId : ' + payment.id, error.response.text);
              const errorDataObj = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
              paymentResponse.transactionId = errorDataObj.id;
              paymentResponse.status = errorDataObj.status;
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'PaymentId : ' + payment.id, Constants.LOG_ERROR, 'PaymentId : ' + payment.id, errorData);
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
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthorizationResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAuthorizationResponse', '', exception, payment.id, 'PaymentId : ', '');
    return paymentResponse;
  }
};

export default { authorizationResponse };
