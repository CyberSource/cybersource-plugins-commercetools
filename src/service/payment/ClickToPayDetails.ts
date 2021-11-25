import restApi from 'cybersource-rest-client';
import { Constants } from '../../constants';

const getVisaCheckoutData = async (paymentResponse) => {
  let visaCheckoutData = {
    httpCode: null,
    billToFieldGroup: null,
    shipToFieldGroup: null,
    cardFieldGroup: null,
  };
  const id = paymentResponse.transactionId;
  const configObject = {
    authenticationType: Constants.AUTHENTICATION_TYPE,
    runEnvironment: process.env.CONFIG_RUN_ENVIRONMENT,
    merchantID: process.env.ISV_PAYMENT_MERCHANT_ID,
    merchantKeyId: process.env.ISV_PAYMENT_MERCHANT_KEY_ID,
    merchantsecretKey: process.env.ISV_PAYMENT_MERCHANT_SECRET_KEY,
  };
  const apiClient = new restApi.ApiClient();
  const instance = new restApi.TransactionDetailsApi(configObject, apiClient);
  return await new Promise((resolve, reject) => {
    instance.getTransaction(id, function (error, data, response) {
      if (data) {
        visaCheckoutData.httpCode = response[Constants.RESPONSE_STATUS];
        visaCheckoutData.billToFieldGroup = data.orderInformation.billTo;
        visaCheckoutData.shipToFieldGroup = data.orderInformation.shipTo;
        visaCheckoutData.cardFieldGroup = data.paymentInformation.card;
        resolve(visaCheckoutData);
      } else {
        console.log(Constants.ERROR_STRING, error);
        visaCheckoutData.httpCode = error.status;
        reject(visaCheckoutData);
      }
    });
  }).catch((error) => {
    console.log(Constants.ERROR_STRING, error);
    return visaCheckoutData;
  });
};

export default { getVisaCheckoutData };
