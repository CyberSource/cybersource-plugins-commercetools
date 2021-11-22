import restApi from 'cybersource-rest-client';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';

const authReversalResponse = async (payment, cart, authReversalId) => {
  let j = Constants.VAL_ZERO;
  let shippingCost = Constants.VAL_FLOAT_ZERO;
  let totalAmount = Constants.VAL_FLOAT_ZERO;
  let paymentResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
  };
  const apiClient = new restApi.ApiClient();
  var requestObj = new restApi.AuthReversalRequest();
  const configObject = {
    authenticationType: Constants.AUTHENTICATION_TYPE,
    runEnvironment: process.env.CONFIG_RUN_ENVIRONMENT,
    merchantID: process.env.ISV_PAYMENT_MERCHANT_ID,
    merchantKeyId: process.env.ISV_PAYMENT_MERCHANT_KEY_ID,
    merchantsecretKey: process.env.ISV_PAYMENT_MERCHANT_SECRET_KEY,
  };
  var clientReferenceInformation =
    new restApi.Ptsv2paymentsidreversalsClientReferenceInformation();
  clientReferenceInformation.code = payment.id;
  requestObj.clientReferenceInformation = clientReferenceInformation;

  var clientReferenceInformationpartner =
    new restApi.Ptsv2paymentsidreversalsClientReferenceInformationPartner();
  clientReferenceInformationpartner.solutionId =
    Constants.ISV_PAYMENT_PARTNER_SOLUTION_ID;
  clientReferenceInformation.partner = clientReferenceInformationpartner;
  requestObj.clientReferenceInformation = clientReferenceInformation;

  if (Constants.VISA_CHECKOUT == payment.paymentMethodInfo.method) {
    var processingInformation =
      new restApi.Ptsv2paymentsidreversalsProcessingInformation();
    processingInformation.paymentSolution = payment.paymentMethodInfo.method;
    processingInformation.visaCheckoutId = payment.custom.fields.isv_token;
    requestObj.processingInformation = processingInformation;
  }

  var orderInformation = new restApi.Ptsv2paymentsidreversalsOrderInformation();

  orderInformation.lineItems = [];
  cart.lineItems.forEach((lineItem) => {
    var orderInformationLineItems =
      new restApi.Ptsv2paymentsidreversalsOrderInformationLineItems();
    const unitPrice = paymentService.convertCentToAmount(
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
      new restApi.Ptsv2paymentsidreversalsOrderInformationLineItems();
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

  totalAmount = paymentService.convertCentToAmount(
    payment.amountPlanned.centAmount
  );

  var orderInformation = new restApi.Ptsv2paymentsidreversalsOrderInformation();
  var orderInformationAmountDetails =
    new restApi.Ptsv2paymentsidreversalsOrderInformationAmountDetails();
  orderInformationAmountDetails.totalAmount = totalAmount;
  orderInformationAmountDetails.currency = payment.amountPlanned.currencyCode;
  orderInformation.amountDetails = orderInformationAmountDetails;

  var instance = new restApi.ReversalApi(configObject, apiClient);
  return await new Promise((resolve, reject) => {
    instance.authReversal(
      authReversalId,
      requestObj,
      function (error, data, response) {
        if (data) {
          paymentResponse.httpCode = response[Constants.STATUS_CODE];
          paymentResponse.transactionId = data.id;
          paymentResponse.status = data.status;
          paymentResponse.message = data.message;
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
      }
    );
  }).catch((error) => {
    console.log(Constants.ERROR_STRING, error);
    return paymentResponse;
  });
};

export default { authReversalResponse };
