import restApi from 'cybersource-rest-client';
import { Constants } from '../../constants';

const getVisaCheckoutData = async (paymentResponse) => {
  let visaCheckoutData = {
    httpCode: null,
    billToFieldGroup: null,
    shipToFieldGroup: null,
    cardFieldGroup: null,
  };
  try {
    if (null != paymentResponse) {
      const id = paymentResponse.transactionId;
      if (null != id) {
        const configObject = {
          authenticationType: Constants.ISV_PAYMENT_AUTHENTICATION_TYPE,
          runEnvironment: process.env.CONFIG_RUN_ENVIRONMENT,
          merchantID: process.env.ISV_PAYMENT_MERCHANT_ID,
          merchantKeyId: process.env.ISV_PAYMENT_MERCHANT_KEY_ID,
          merchantsecretKey: process.env.ISV_PAYMENT_MERCHANT_SECRET_KEY,
        };
        const apiClient = new restApi.ApiClient();
        const instance = new restApi.TransactionDetailsApi(
          configObject,
          apiClient
        );
        return await new Promise((resolve, reject) => {
          instance.getTransaction(id, function (error, data, response) {
            if (data) {
              visaCheckoutData.httpCode =
                response[Constants.STRING_RESPONSE_STATUS];
              visaCheckoutData.billToFieldGroup = data.orderInformation.billTo;
              visaCheckoutData.shipToFieldGroup = data.orderInformation.shipTo;
              visaCheckoutData.cardFieldGroup = data.paymentInformation.card;
              resolve(visaCheckoutData);
            } else {
              console.log(Constants.STRING_ERROR, error);
              visaCheckoutData.httpCode = error.status;
              reject(visaCheckoutData);
            }
          });
        }).catch((error) => {
          console.log(Constants.STRING_ERROR, error);
          return visaCheckoutData;
        });
      } else {
        console.log(Constants.ERROR_MSG_INVALID_INPUT);
        return visaCheckoutData;
      }
    } else {
      console.log(Constants.ERROR_MSG_INVALID_INPUT);
      return visaCheckoutData;
    }
  } catch (exception) {
    console.log(Constants.STRING_ERROR, exception);
    return paymentResponse;
  }
};

export default { getVisaCheckoutData };
