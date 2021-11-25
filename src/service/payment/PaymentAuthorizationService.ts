import restApi from 'cybersource-rest-client';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';

const getAuthorizationResponse = async (payment, cart, service) => {
  let j = Constants.VAL_ZERO;
  let totalAmount = Constants.VAL_FLOAT_ZERO;
  let unitPrice = Constants.VAL_FLOAT_ZERO;
  let shippingCost = Constants.VAL_FLOAT_ZERO;
  let actionList = new Array();
  let paymentResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
    data: null,
  };
  const apiClient = new restApi.ApiClient();
  var requestObj = new restApi.CreatePaymentRequest();
  const configObject = {
    authenticationType: Constants.AUTHENTICATION_TYPE,
    runEnvironment: process.env.CONFIG_RUN_ENVIRONMENT,
    merchantID: process.env.ISV_PAYMENT_MERCHANT_ID,
    merchantKeyId: process.env.ISV_PAYMENT_MERCHANT_KEY_ID,
    merchantsecretKey: process.env.ISV_PAYMENT_MERCHANT_SECRET_KEY,
  };
  var clientReferenceInformation =
    new restApi.Ptsv2paymentsClientReferenceInformation();
  clientReferenceInformation.code = payment.id;
  requestObj.clientReferenceInformation = clientReferenceInformation;

  var clientReferenceInformationpartner =
    new restApi.Ptsv2paymentsClientReferenceInformationPartner();
  clientReferenceInformationpartner.solutionId =
    Constants.ISV_PAYMENT_PARTNER_SOLUTION_ID;
  clientReferenceInformation.partner = clientReferenceInformationpartner;
  requestObj.clientReferenceInformation = clientReferenceInformation;

  var processingInformation = new restApi.Ptsv2paymentsProcessingInformation();
  if (Constants.FALSE == process.env.ISV_PAYMENT_DECISION_MANAGER) {
    actionList.push(Constants.DECISION_SKIP);
  } else {
    processingInformation.actionList = actionList;
  }
  if (Constants.VALIDATION == service) {
    actionList.push(Constants.VALIDATE_CONSUMER_AUTHENTICATION);
  }
  if (Constants.ISV_TOKEN_ALIAS in payment.custom.fields) {
    actionList.push(Constants.TOKEN_CREATE);
    processingInformation.actionTokenTypes = Constants.TOKEN_ACTION_TYPES;
  }
  processingInformation.actionList = actionList;
  if (
    Constants.CREDIT_CARD == payment.paymentMethodInfo.method ||
    (Constants.CC_PAYER_AUTHENTICATION == payment.paymentMethodInfo.method &&
      Constants.CARD == service)
  ) {
    var tokenInformation = new restApi.Ptsv2paymentsTokenInformation();
    tokenInformation.transientTokenJwt = payment.custom.fields.isv_token;
    requestObj.tokenInformation = tokenInformation;
  } else if (Constants.VISA_CHECKOUT == payment.paymentMethodInfo.method) {
    processingInformation.paymentSolution = payment.paymentMethodInfo.method;
    processingInformation.visaCheckoutId = payment.custom.fields.isv_token;
  } else if (
    Constants.CC_PAYER_AUTHENTICATION == payment.paymentMethodInfo.method &&
    Constants.VALIDATION == service
  ) {
    var tokenInformation = new restApi.Ptsv2paymentsTokenInformation();
    tokenInformation.transientTokenJwt = payment.custom.fields.isv_token;
    requestObj.tokenInformation = tokenInformation;
    var consumerAuthenticationInformation =
      new restApi.Ptsv2paymentsConsumerAuthenticationInformation();
    consumerAuthenticationInformation.authenticationTransactionId =
      payment.custom.fields.isv_payerAuthenticationTransactionId;
    requestObj.consumerAuthenticationInformation =
      consumerAuthenticationInformation;
  }
  requestObj.processingInformation = processingInformation;

  totalAmount = paymentService.convertCentToAmount(
    payment.amountPlanned.centAmount
  );

  var orderInformation = new restApi.Ptsv2paymentsOrderInformation();
  var orderInformationAmountDetails =
    new restApi.Ptsv2paymentsOrderInformationAmountDetails();
  orderInformationAmountDetails.totalAmount = totalAmount;
  orderInformationAmountDetails.currency = payment.amountPlanned.currencyCode;
  orderInformation.amountDetails = orderInformationAmountDetails;

  var orderInformationBillTo =
    new restApi.Ptsv2paymentsOrderInformationBillTo();
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

  var orderInformationShipTo =
    new restApi.Ptsv2paymentsOrderInformationShipTo();
  orderInformationShipTo.firstName = cart.shippingAddress.firstName;
  orderInformationShipTo.lastName = cart.shippingAddress.lastName;
  orderInformationShipTo.address1 = cart.shippingAddress.streetName;
  orderInformationShipTo.locality = cart.shippingAddress.city;
  orderInformationShipTo.administrativeArea = cart.shippingAddress.region;
  orderInformationShipTo.postalCode = cart.shippingAddress.postalCode;
  orderInformationShipTo.country = cart.shippingAddress.country;
  orderInformationShipTo.email = cart.shippingAddress.email;
  orderInformationShipTo.phoneNumber = cart.shippingAddress.phone;
  orderInformation.shipTo = orderInformationShipTo;
  requestObj.orderInformation = orderInformation;

  orderInformation.lineItems = [];
  cart.lineItems.forEach((lineItem) => {
    var orderInformationLineItems =
      new restApi.Ptsv2paymentsOrderInformationLineItems();
    unitPrice = paymentService.convertCentToAmount(
      lineItem.price.value.centAmount
    );
    orderInformationLineItems.productName = lineItem.name.en;
    orderInformationLineItems.quantity = lineItem.quantity;
    orderInformationLineItems.productSku = lineItem.variant.sku;
    orderInformationLineItems.productCode = lineItem.productId;
    orderInformationLineItems.unitPrice = unitPrice;
    orderInformation.lineItems[j] = orderInformationLineItems;
    j++;
  });
  if (Constants.SHIPPING_INFO in cart) {
    shippingCost = paymentService.convertCentToAmount(
      cart.shippingInfo.price.centAmount
    );
    var orderInformationLineItems =
      new restApi.Ptsv2paymentsOrderInformationLineItems();
    orderInformationLineItems.productName =
      cart.shippingInfo.shippingMethodName;
    orderInformationLineItems.quantity = Constants.VAL_ONE;
    orderInformationLineItems.productSku = Constants.SHIPPING_AND_HANDLING;
    orderInformationLineItems.productCode = Constants.SHIPPING_AND_HANDLING;
    orderInformationLineItems.unitPrice = shippingCost;
    orderInformationLineItems.tax = cart.shippingInfo.taxRate.amount;
    orderInformation.lineItems[j] = orderInformationLineItems;
  }
  requestObj.orderInformation = orderInformation;

  var deviceInformation = new restApi.Ptsv2paymentsDeviceInformation();
  deviceInformation.fingerprintSessionId =
    payment.custom.fields.isv_deviceFingerprintId;
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
      } else {
        console.log(Constants.ERROR_STRING, error);
        const errorData = JSON.parse(
          error.response.text.replace(
            Constants.DOUBLE_SLASH,
            Constants.EMPTY_STRING
          )
        );
        paymentResponse.httpCode = error.status;
        paymentResponse.transactionId = errorData.id;
        paymentResponse.status = errorData.status;
        paymentResponse.message = errorData.message;
        reject(paymentResponse);
      }
    });
  }).catch((error) => {
    console.log(Constants.ERROR_STRING, error);
    return paymentResponse;
  });
};

export default { getAuthorizationResponse };
