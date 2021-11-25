import restApi from 'cybersource-rest-client';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';

const enrolmentCheck = async (
  payment,
  cart,
  transientToken,
  cardinalReferenceId
) => {
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
  const apiClient = new restApi.ApiClient();
  var requestObj = new restApi.CheckPayerAuthEnrollmentRequest();
  const configObject = {
    authenticationType: Constants.AUTHENTICATION_TYPE,
    runEnvironment: process.env.CONFIG_RUN_ENVIRONMENT,
    merchantID: process.env.ISV_PAYMENT_MERCHANT_ID,
    merchantKeyId: process.env.ISV_PAYMENT_MERCHANT_KEY_ID,
    merchantsecretKey: process.env.ISV_PAYMENT_MERCHANT_SECRET_KEY,
  };

  var clientReferenceInformation =
    new restApi.Riskv1decisionsClientReferenceInformation();
  clientReferenceInformation.code = payment.id;
  requestObj.clientReferenceInformation = clientReferenceInformation;

  const totalAmount = paymentService.convertCentToAmount(
    payment.amountPlanned.centAmount
  );

  var orderInformation = new restApi.Riskv1authenticationsOrderInformation();
  var orderInformationAmountDetails =
    new restApi.Riskv1authenticationsOrderInformationAmountDetails();
  orderInformationAmountDetails.currency = payment.amountPlanned.currencyCode;
  orderInformationAmountDetails.totalAmount = totalAmount;
  orderInformation.amountDetails = orderInformationAmountDetails;

  var orderInformationBillTo =
    new restApi.Riskv1authenticationsOrderInformationBillTo();
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
    var orderInformationLineItems =
      new restApi.Riskv1authenticationsOrderInformationLineItems();
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
      new restApi.Riskv1authenticationsOrderInformationLineItems();
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

  var tokenInformation =
    new restApi.Riskv1authenticationsetupsTokenInformation();
  tokenInformation.transientToken = transientToken;
  requestObj.tokenInformation = tokenInformation;

  var consumerAuthenticationInformation =
    new restApi.Riskv1decisionsConsumerAuthenticationInformation();
  consumerAuthenticationInformation.referenceId = cardinalReferenceId;
  consumerAuthenticationInformation.transactionMode =
    Constants.TRANSACTION_MODE;
  consumerAuthenticationInformation.returnUrl =
    process.env.CONFIG_3DS_RETURN_URL + '/sunriseSpa';
  requestObj.consumerAuthenticationInformation =
    consumerAuthenticationInformation;

  const instance = new restApi.PayerAuthenticationApi(configObject, apiClient);
  return await new Promise(function (resolve, reject) {
    instance.checkPayerAuthEnrollment(
      requestObj,
      function (error, data, response) {
        if (data) {
          enrollmentCheckResponse.httpCode = response[Constants.STATUS_CODE];
          enrollmentCheckResponse.transactionId =
            data.consumerAuthenticationInformation.authenticationTransactionId;
          enrollmentCheckResponse.status = data.status;
          enrollmentCheckResponse.message = data.message;
          enrollmentCheckResponse.data = data;
          enrollmentCheckResponse.cardinalReferenceId = cardinalReferenceId;
          resolve(enrollmentCheckResponse);
        } else {
          console.log(Constants.ERROR_STRING, JSON.stringify(error));
          const errorData = JSON.parse(
            error.response.text.replace(
              Constants.DOUBLE_SLASH,
              Constants.EMPTY_STRING
            )
          );
          enrollmentCheckResponse.httpCode = error.status;
          enrollmentCheckResponse.transactionId = errorData.id;
          enrollmentCheckResponse.status = errorData.status;
          enrollmentCheckResponse.message = errorData.message;
          resolve(enrollmentCheckResponse);
        }
      }
    );
  }).catch((error) => {
    console.log(Constants.ERROR_STRING, error);
    return enrollmentCheckResponse;
  });
};

export default { enrolmentCheck };
