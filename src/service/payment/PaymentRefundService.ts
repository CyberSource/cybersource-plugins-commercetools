import restApi from 'cybersource-rest-client';
import path from 'path';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';
import multiMid from '../../utils/config/MultiMid';

const refundResponse = async (payment, captureId, updateTransactions, orderNo) => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let paymentResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
  };
  let midCredentials: any;
  let fractionDigits = Constants.VAL_ZERO;
  try {
    if (null != captureId && null != payment && null != updateTransactions) {
      fractionDigits = payment.amountPlanned.fractionDigits;
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.RefundPaymentRequest();
      runEnvironment = (Constants.LIVE_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) ? Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT : runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
      midCredentials = await multiMid.getMidCredentials(payment);
      const configObject = {
        authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
        runEnvironment: runEnvironment,
        merchantID: midCredentials.merchantId,
        merchantKeyId: midCredentials.merchantKeyId,
        merchantsecretKey: midCredentials.merchantSecretKey,
        logConfiguration: {
          enableLog: false,
        },
      };
      var clientReferenceInformation = new restApi.Ptsv2paymentsClientReferenceInformation();
      clientReferenceInformation.code = payment.id;
      requestObj.clientReferenceInformation = clientReferenceInformation;
      var clientReferenceInformationpartner = new restApi.Ptsv2paymentsidClientReferenceInformationPartner();
      clientReferenceInformationpartner.solutionId = Constants.PAYMENT_GATEWAY_PARTNER_SOLUTION_ID;
      clientReferenceInformation.partner = clientReferenceInformationpartner;
      requestObj.clientReferenceInformation = clientReferenceInformation;
      var processingInformation = new restApi.Ptsv2paymentsidrefundsProcessingInformation();
      if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ORDER_RECONCILIATION && null != orderNo) {
        processingInformation.reconciliationId = orderNo;
      }
      if (Constants.CLICK_TO_PAY == payment.paymentMethodInfo.method) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_CLICK_TO_PAY_PAYMENT_SOLUTION;
        processingInformation.visaCheckoutId = payment.custom.fields.isv_token;
      } else if (Constants.GOOGLE_PAY == payment.paymentMethodInfo.method) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_GOOGLE_PAY_PAYMENT_SOLUTION;
      } else if (Constants.APPLE_PAY == payment.paymentMethodInfo.method) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_APPLE_PAY_PAYMENT_SOLUTION;
      } else if (Constants.ECHECK == payment.paymentMethodInfo.method) {
        var paymentInformation = new restApi.Ptsv2paymentsidrefundsPaymentInformation();
        var paymentInformationBank = new restApi.Ptsv2paymentsPaymentInformationBank();
        var paymentInformationBankAccount = new restApi.Ptsv2paymentsPaymentInformationBankAccount();
        paymentInformationBankAccount.type = payment.custom.fields.isv_accountType;
        paymentInformationBankAccount.number = payment.custom.fields.isv_accountNumber;
        paymentInformationBank.account = paymentInformationBankAccount;
        paymentInformationBank.routingNumber = payment.custom.fields.isv_routingNumber;
        paymentInformation.bank = paymentInformationBank;
        var paymentInformationPaymentType = new restApi.Ptsv2paymentsPaymentInformationPaymentType();
        paymentInformationPaymentType.name = Constants.PAYMENT_GATEWAY_E_CHECK_PAYMENT_TYPE;
        paymentInformation.paymentType = paymentInformationPaymentType;
        requestObj.paymentInformation = paymentInformation;
      }
      requestObj.processingInformation = processingInformation;
      var orderInformation = new restApi.Ptsv2paymentsidrefundsOrderInformation();
      var orderInformationAmountDetails = new restApi.Ptsv2paymentsidcapturesOrderInformationAmountDetails();
      const refundAmount = paymentService.convertCentToAmount(updateTransactions.amount.centAmount, fractionDigits);
      orderInformationAmountDetails.totalAmount = refundAmount;
      orderInformationAmountDetails.currency = payment.amountPlanned.currencyCode;
      orderInformation.amountDetails = orderInformationAmountDetails;
      requestObj.orderInformation = orderInformation;
      if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REFUND_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.REFUND_REQUEST + JSON.stringify(requestObj));
      }
      const refundApiInstance = new restApi.RefundApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        refundApiInstance.refundPayment(requestObj, captureId, function (error, data, response) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REFUND_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.REFUND_RESPONSE + JSON.stringify(response));
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            resolve(paymentResponse);
          } else if (error) {
            if (
              error.hasOwnProperty(Constants.STRING_RESPONSE) &&
              null != error.response &&
              Constants.VAL_ZERO < Object.keys(error.response).length &&
              error.response.hasOwnProperty(Constants.STRING_TEXT) &&
              null != error.response.text &&
              Constants.VAL_ZERO < Object.keys(error.response.text).length
            ) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REFUND_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
              paymentResponse.transactionId = errorData.id;
              paymentResponse.status = errorData.status;
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REFUND_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, errorData);
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
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REFUND_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
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
    if (Constants.EXCEPTION_MERCHANT_SECRET_KEY_REQUIRED == exceptionData || Constants.EXCEPTION_MERCHANT_KEY_ID_REQUIRED == exceptionData) {
      exceptionData = Constants.EXCEPTION_MSG_ENV_VARIABLE_NOT_SET + midCredentials.merchantId;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REFUND_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, exceptionData);
    return paymentResponse;
  }
};

export default { refundResponse };
