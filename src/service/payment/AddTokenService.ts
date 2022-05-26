import restApi from 'cybersource-rest-client';
import path from 'path';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';

const addTokenResponse = async (customerId, customerObj, address, cardTokens) => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let actionList = new Array();
  let paymentResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
    data: null,
  };
  try {
    if (null != customerId && null != customerObj && null != address) {
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.CreatePaymentRequest();
      if (process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() == Constants.TEST_ENVIRONMENT) {
        runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
      } else if (process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() == Constants.LIVE_ENVIRONMENT) {
        runEnvironment = Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT;
      }
      const configObject = {
        authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
        runEnvironment: runEnvironment,
        merchantID: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
        merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
        merchantsecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
        logConfiguration: {
          enableLog: false,
        },
      };
      var clientReferenceInformation = new restApi.Ptsv2paymentsClientReferenceInformation();
      clientReferenceInformation.code = customerId;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      var clientReferenceInformationpartner = new restApi.Ptsv2paymentsClientReferenceInformationPartner();
      clientReferenceInformationpartner.solutionId = Constants.PAYMENT_GATEWAY_PARTNER_SOLUTION_ID;
      clientReferenceInformation.partner = clientReferenceInformationpartner;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      var processingInformation = new restApi.Ptsv2paymentsProcessingInformation();
      if (Constants.STRING_FALSE == process.env.PAYMENT_GATEWAY_DECISION_MANAGER) {
        actionList.push(Constants.PAYMENT_GATEWAY_DECISION_SKIP);
      } else {
        processingInformation.actionList = actionList;
      }
      actionList.push(Constants.PAYMENT_GATEWAY_TOKEN_CREATE);
      var initiator = new restApi.Ptsv2paymentsProcessingInformationAuthorizationOptionsInitiator();
      initiator.credentialStoredOnFile = true;
      var authorizationOptions = new restApi.Ptsv2paymentsProcessingInformationAuthorizationOptions();
      authorizationOptions.initiator = initiator;
      processingInformation.authorizationOptions = authorizationOptions;
      if (null != cardTokens && null != cardTokens.customerTokenId) {
        processingInformation.actionTokenTypes = Constants.PAYMENT_GATEWAY_TOKEN_ACTION_TYPES_CUSTOMER_EXISTS;
      } else {
        processingInformation.actionTokenTypes = Constants.PAYMENT_GATEWAY_TOKEN_ACTION_TYPES;
      }
      processingInformation.actionList = actionList;
      var paymentInformation = new restApi.Ptsv2paymentsPaymentInformation();
      var tokenInformation = new restApi.Ptsv2paymentsTokenInformation();
      if (null != cardTokens && null != cardTokens.customerTokenId) {
        var paymentInformationCustomer = new restApi.Ptsv2paymentsPaymentInformationCustomer();
        paymentInformationCustomer.id = cardTokens.customerTokenId;
        paymentInformation.customer = paymentInformationCustomer;
      }
      var paymentInformationCard = new restApi.Ptsv2paymentsPaymentInformationCard();
      paymentInformationCard.typeSelectionIndicator = Constants.VAL_ONE;
      paymentInformation.card = paymentInformationCard;
      tokenInformation.transientTokenJwt = customerObj.custom.fields.isv_token;
      requestObj.tokenInformation = tokenInformation;
      requestObj.processingInformation = processingInformation;
      requestObj.paymentInformation = paymentInformation;

      var orderInformation = new restApi.Ptsv2paymentsOrderInformation();
      var orderInformationAmountDetails = new restApi.Ptsv2paymentsOrderInformationAmountDetails();
      orderInformationAmountDetails.totalAmount = Constants.VAL_FLOAT_ZERO;
      orderInformationAmountDetails.currency = 'USD';
      orderInformation.amountDetails = orderInformationAmountDetails;

      var orderInformationBillTo = new restApi.Ptsv2paymentsOrderInformationBillTo();
      orderInformationBillTo.firstName = address.firstName;
      orderInformationBillTo.lastName = address.lastName;
      orderInformationBillTo.address1 = address.streetName;
      orderInformationBillTo.locality = address.city;
      orderInformationBillTo.administrativeArea = address.region;
      orderInformationBillTo.postalCode = address.postalCode;
      orderInformationBillTo.country = address.country;
      orderInformationBillTo.email = address.email;
      orderInformationBillTo.phoneNumber = address.phone;
      orderInformation.billTo = orderInformationBillTo;
      requestObj.orderInformation = orderInformation;

      requestObj.orderInformation = orderInformation;
      var deviceInformation = new restApi.Ptsv2paymentsDeviceInformation();
      if (Constants.ISV_DEVICE_FINGERPRINT_ID in customerObj.custom.fields && Constants.STRING_EMPTY != customerObj.custom.fields.isv_deviceFingerprintId) {
        deviceInformation.fingerprintSessionId = customerObj.custom.fields.isv_deviceFingerprintId;
      } 
      requestObj.deviceInformation = deviceInformation;
      const instance = new restApi.PaymentsApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        instance.createPayment(requestObj, function (error, data, response) {
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            paymentResponse.message = data.message;
            paymentResponse.data = data;
            resolve(paymentResponse);
          } else if (error) {
            if (error.hasOwnProperty(Constants.STRING_RESPONSE) && null != error.response && Constants.VAL_ZERO < Object.keys(error.response).length && error.response.hasOwnProperty(Constants.STRING_TEXT) && null != error.response.text && Constants.VAL_ZERO < Object.keys(error.response.text).length) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_TOKEN_RESPONSE, Constants.LOG_INFO, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
              paymentResponse.transactionId = errorData.id;
              paymentResponse.status = errorData.status;
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_TOKEN_RESPONSE, Constants.LOG_INFO, errorData);
            }
            paymentResponse.httpCode = error.status;
            reject(paymentResponse);
          } else {
            reject(paymentResponse);
          }
        });
      }).catch((error) => {
        return paymentResponse;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_TOKEN_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_INPUT);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_TOKEN_RESPONSE, Constants.LOG_ERROR, exceptionData);
    return paymentResponse;
  }
};

export default { addTokenResponse };
