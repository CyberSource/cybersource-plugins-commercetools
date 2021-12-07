import restApi from 'cybersource-rest-client';
import path from 'path';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';

const refundResponse = async (payment, captureId, updateTransactions) => {
  let errorData: any;
  let exceptionData: any;
  let paymentResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
  };
  try {
    if (null != captureId && null != payment && null != updateTransactions) {
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.RefundPaymentRequest();
      const configObject = {
        authenticationType: Constants.ISV_PAYMENT_AUTHENTICATION_TYPE,
        runEnvironment: process.env.CONFIG_RUN_ENVIRONMENT,
        merchantID: process.env.ISV_PAYMENT_MERCHANT_ID,
        merchantKeyId: process.env.ISV_PAYMENT_MERCHANT_KEY_ID,
        merchantsecretKey: process.env.ISV_PAYMENT_MERCHANT_SECRET_KEY,
      };
      var clientReferenceInformation = new restApi.Ptsv2paymentsClientReferenceInformation();
      clientReferenceInformation.code = payment.id;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      var clientReferenceInformationpartner = new restApi.Ptsv2paymentsidClientReferenceInformationPartner();
      clientReferenceInformationpartner.solutionId = Constants.ISV_PAYMENT_PARTNER_SOLUTION_ID;
      clientReferenceInformation.partner = clientReferenceInformationpartner;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      if (Constants.VISA_CHECKOUT == payment.paymentMethodInfo.method) {
        var processingInformation = new restApi.Ptsv2paymentsidrefundsProcessingInformation();
        processingInformation.paymentSolution = payment.paymentMethodInfo.method;
        processingInformation.visaCheckoutId = payment.custom.fields.isv_token;
        requestObj.processingInformation = processingInformation;
      }

      var orderInformation = new restApi.Ptsv2paymentsidrefundsOrderInformation();
      var orderInformationAmountDetails = new restApi.Ptsv2paymentsidcapturesOrderInformationAmountDetails();

      const refundAmount = paymentService.convertCentToAmount(updateTransactions.amount.centAmount);

      orderInformationAmountDetails.totalAmount = refundAmount;
      orderInformationAmountDetails.currency = payment.amountPlanned.currencyCode;
      orderInformation.amountDetails = orderInformationAmountDetails;

      requestObj.orderInformation = orderInformation;

      const instance = new restApi.RefundApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        instance.refundPayment(requestObj, captureId, function (error, data, response) {
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            paymentResponse.message = data.message;
            resolve(paymentResponse);
          } else {
            errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REFUND_RESPONSE, Constants.LOG_INFO, errorData.message);
            paymentResponse.httpCode = error.status;
            paymentResponse.transactionId = errorData.id;
            paymentResponse.status = errorData.status;
            paymentResponse.message = errorData.message;
            reject(paymentResponse);
          }
        });
      }).catch((error) => {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REFUND_RESPONSE, Constants.LOG_INFO, error.message);
        return paymentResponse;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REFUND_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REFUND_RESPONSE, Constants.LOG_ERROR, exceptionData);
    return paymentResponse;
  }
};

export default { refundResponse };
