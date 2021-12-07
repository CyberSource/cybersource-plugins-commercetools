import restApi from 'cybersource-rest-client';
import path from 'path';
import jwtDecode from 'jwt-decode';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';

const payerAuthEnrollmentCheck = async (payment, cart, cardinalReferenceId) => {
  let jtiToken: any;
  let errorData: any;
  let exceptionData: any;
  let j = Constants.VAL_ZERO;
  let unitPrice = Constants.VAL_FLOAT_ZERO;
  let shippingCost = Constants.VAL_FLOAT_ZERO;
  var enrollmentCheckResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
    data: null,
    cardinalReferenceId: null,
  };
  try {
    if (null != payment && null != cart && null != cardinalReferenceId) {
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.CheckPayerAuthEnrollmentRequest();
      const configObject = {
        authenticationType: Constants.ISV_PAYMENT_AUTHENTICATION_TYPE,
        runEnvironment: process.env.CONFIG_RUN_ENVIRONMENT,
        merchantID: process.env.ISV_PAYMENT_MERCHANT_ID,
        merchantKeyId: process.env.ISV_PAYMENT_MERCHANT_KEY_ID,
        merchantsecretKey: process.env.ISV_PAYMENT_MERCHANT_SECRET_KEY,
      };

      var clientReferenceInformation = new restApi.Riskv1decisionsClientReferenceInformation();
      clientReferenceInformation.code = payment.id;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      var clientReferenceInformationpartner = new restApi.Riskv1decisionsClientReferenceInformationPartner();
      clientReferenceInformationpartner.solutionId = Constants.ISV_PAYMENT_PARTNER_SOLUTION_ID;
      clientReferenceInformation.partner = clientReferenceInformationpartner;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      const totalAmount = paymentService.convertCentToAmount(payment.amountPlanned.centAmount);

      var orderInformation = new restApi.Riskv1authenticationsOrderInformation();
      var orderInformationAmountDetails = new restApi.Riskv1authenticationsOrderInformationAmountDetails();
      orderInformationAmountDetails.currency = payment.amountPlanned.currencyCode;
      orderInformationAmountDetails.totalAmount = totalAmount;
      orderInformation.amountDetails = orderInformationAmountDetails;

      var orderInformationBillTo = new restApi.Riskv1authenticationsOrderInformationBillTo();
      orderInformationBillTo.firstName = cart.billingAddress.firstName;
      orderInformationBillTo.lastName = cart.billingAddress.lastName;
      orderInformationBillTo.address1 = cart.billingAddress.streetName;
      orderInformationBillTo.locality = cart.billingAddress.city;
      orderInformationBillTo.administrativeArea = cart.billingAddress.region;
      orderInformationBillTo.postalCode = cart.billingAddress.postalCode;
      orderInformationBillTo.country = cart.billingAddress.country;
      orderInformationBillTo.email = cart.billingAddress.email;
      orderInformationBillTo.phoneNumber = cart.billingAddress.phoneNumber;
      orderInformation.billTo = orderInformationBillTo;

      requestObj.orderInformation = orderInformation;

      orderInformation.lineItems = [];
      cart.lineItems.forEach((lineItem) => {
        var orderInformationLineItems = new restApi.Riskv1authenticationsOrderInformationLineItems();
        unitPrice = paymentService.convertCentToAmount(lineItem.price.value.centAmount);
        orderInformationLineItems.productName = lineItem.name.en;
        orderInformationLineItems.quantity = lineItem.quantity;
        orderInformationLineItems.productSku = lineItem.variant.sku;
        orderInformationLineItems.productCode = lineItem.productId;
        orderInformationLineItems.unitPrice = unitPrice;
        orderInformation.lineItems[j] = orderInformationLineItems;
        j++;
      });
      if (Constants.SHIPPING_INFO in cart) {
        var orderInformationLineItems = new restApi.Riskv1authenticationsOrderInformationLineItems();
        shippingCost = paymentService.convertCentToAmount(cart.shippingInfo.price.centAmount);
        orderInformationLineItems.productName = cart.shippingInfo.shippingMethodName;
        orderInformationLineItems.quantity = Constants.VAL_ONE;
        orderInformationLineItems.productSku = Constants.SHIPPING_AND_HANDLING;
        orderInformationLineItems.productCode = Constants.SHIPPING_AND_HANDLING;
        orderInformationLineItems.unitPrice = shippingCost;
        orderInformationLineItems.tax = cart.shippingInfo.taxRate.amount;
        orderInformation.lineItems[j] = orderInformationLineItems;
      }
      requestObj.orderInformation = orderInformation;

      if (Constants.ISV_SAVED_TOKEN in payment.custom.fields) {
        var paymentInformation = new restApi.Riskv1authenticationsPaymentInformation();
        var paymentInformationCustomer = new restApi.Ptsv2paymentsPaymentInformationCustomer();
        paymentInformationCustomer.id = payment.custom.fields.isv_savedToken;
        paymentInformation.customer = paymentInformationCustomer;
        requestObj.paymentInformation = paymentInformation;
      } else {
        jtiToken = jwtDecode(payment.custom.fields.isv_token);
        var tokenInformation = new restApi.Riskv1authenticationsetupsTokenInformation();
        tokenInformation.transientToken = jtiToken.jti;
        requestObj.tokenInformation = tokenInformation;
      }

      var consumerAuthenticationInformation = new restApi.Riskv1decisionsConsumerAuthenticationInformation();
      consumerAuthenticationInformation.referenceId = cardinalReferenceId;
      consumerAuthenticationInformation.transactionMode = Constants.ISV_PAYMENT_TRANSACTION_MODE;
      consumerAuthenticationInformation.returnUrl = process.env.CONFIG_3DS_RETURN_URL + '/sunriseSpa';
      requestObj.consumerAuthenticationInformation = consumerAuthenticationInformation;
      const instance = new restApi.PayerAuthenticationApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        instance.checkPayerAuthEnrollment(requestObj, function (error, data, response) {
          if (data) {
            enrollmentCheckResponse.httpCode = response[Constants.STATUS_CODE];
            enrollmentCheckResponse.transactionId = data.consumerAuthenticationInformation.authenticationTransactionId;
            enrollmentCheckResponse.status = data.status;
            enrollmentCheckResponse.message = data.message;
            enrollmentCheckResponse.data = data;
            enrollmentCheckResponse.cardinalReferenceId = cardinalReferenceId;
            resolve(enrollmentCheckResponse);
          } else {
            errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ENROLLMENT_CHECK_RESPONSE, Constants.LOG_INFO, errorData.message);
            enrollmentCheckResponse.httpCode = error.status;
            enrollmentCheckResponse.transactionId = errorData.id;
            enrollmentCheckResponse.status = errorData.status;
            enrollmentCheckResponse.message = errorData.message;
            resolve(enrollmentCheckResponse);
          }
        });
      }).catch((error) => {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ENROLLMENT_CHECK_RESPONSE, Constants.LOG_INFO, error.message);
        return enrollmentCheckResponse;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ENROLLMENT_CHECK_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_INPUT);
      return enrollmentCheckResponse;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ENROLLMENT_CHECK_RESPONSE, Constants.LOG_ERROR, exceptionData);
    return enrollmentCheckResponse;
  }
};

export default { payerAuthEnrollmentCheck };
