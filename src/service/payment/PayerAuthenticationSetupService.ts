import restApi from 'cybersource-rest-client';
import { Constants } from '../../constants';

const getPayerAuthSetupResponse = async (id, jtiToken) => {
  let paymentResponse = {
    accessToken: null,
    referenceId: null,
    deviceDataCollectionUrl: null,
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
  };
  const apiClient = new restApi.ApiClient();
  var requestObj = new restApi.PayerAuthSetupRequest();
  const configObject = {
    authenticationType: Constants.AUTHENTICATION_TYPE,
    runEnvironment: process.env.CONFIG_RUN_ENVIRONMENT,
    merchantID: process.env.ISV_PAYMENT_MERCHANT_ID,
    merchantKeyId: process.env.ISV_PAYMENT_MERCHANT_KEY_ID,
    merchantsecretKey: process.env.ISV_PAYMENT_MERCHANT_SECRET_KEY,
  };
  var clientReferenceInformation =
    new restApi.Riskv1decisionsClientReferenceInformation();
  clientReferenceInformation.code = id;
  requestObj.clientReferenceInformation = clientReferenceInformation;

  var clientReferenceInformationpartner =
    new restApi.Riskv1decisionsClientReferenceInformationPartner();
  clientReferenceInformationpartner.solutionId =
    Constants.ISV_PAYMENT_PARTNER_SOLUTION_ID;
  clientReferenceInformation.partner = clientReferenceInformationpartner;
  requestObj.clientReferenceInformation = clientReferenceInformation;

  var tokenInformation =
    new restApi.Riskv1authenticationsetupsTokenInformation();
  tokenInformation.transientToken = jtiToken;
  requestObj.tokenInformation = tokenInformation;

  const instance = new restApi.PayerAuthenticationApi(configObject, apiClient);
  return await new Promise(function (resolve, reject) {
    instance.payerAuthSetup(requestObj, function (error, data, response) {
      if (data) {
        paymentResponse.httpCode = response[Constants.STATUS_CODE];
        paymentResponse.transactionId = data.id;
        paymentResponse.status = data.status;
        paymentResponse.message = data.message;
        paymentResponse.accessToken =
          data.consumerAuthenticationInformation.accessToken;
        paymentResponse.referenceId =
          data.consumerAuthenticationInformation.referenceId;
        paymentResponse.deviceDataCollectionUrl =
          data.consumerAuthenticationInformation.deviceDataCollectionUrl;
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

export default { getPayerAuthSetupResponse };
