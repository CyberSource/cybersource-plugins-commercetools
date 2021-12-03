import restApi from 'cybersource-rest-client';
import jwtDecode from 'jwt-decode';
import { Constants } from '../../constants';

const getPayerAuthSetupResponse = async (payment) => {
  let jtiToken: any;
  let paymentResponse = {
    accessToken: null,
    referenceId: null,
    deviceDataCollectionUrl: null,
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
  };
  try {
    if (null != payment) {
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.PayerAuthSetupRequest();
      const configObject = {
        authenticationType: Constants.ISV_PAYMENT_AUTHENTICATION_TYPE,
        runEnvironment: process.env.CONFIG_RUN_ENVIRONMENT,
        merchantID: process.env.ISV_PAYMENT_MERCHANT_ID,
        merchantKeyId: process.env.ISV_PAYMENT_MERCHANT_KEY_ID,
        merchantsecretKey: process.env.ISV_PAYMENT_MERCHANT_SECRET_KEY,
      };
      var clientReferenceInformation =
        new restApi.Riskv1decisionsClientReferenceInformation();
      clientReferenceInformation.code = payment.id;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      var clientReferenceInformationpartner =
        new restApi.Riskv1decisionsClientReferenceInformationPartner();
      clientReferenceInformationpartner.solutionId =
        Constants.ISV_PAYMENT_PARTNER_SOLUTION_ID;
      clientReferenceInformation.partner = clientReferenceInformationpartner;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      if (Constants.ISV_SAVED_TOKEN in payment.custom.fields) {
        console.log('Payer Auth save');
        var paymentInformation =
          new restApi.Riskv1authenticationsetupsPaymentInformation();
        var paymentInformationCustomer =
          new restApi.Riskv1authenticationsetupsPaymentInformationCustomer();
        paymentInformationCustomer.id = payment.custom.fields.isv_savedToken;
        paymentInformation.customer = paymentInformationCustomer;
        requestObj.paymentInformation = paymentInformation;
      } else {
        console.log('Payer Auth transient');
        jtiToken = jwtDecode(payment.custom.fields.isv_token);
        var tokenInformation =
          new restApi.Riskv1authenticationsetupsTokenInformation();
        tokenInformation.transientToken = jtiToken.jti;
        requestObj.tokenInformation = tokenInformation;
      }
      const instance = new restApi.PayerAuthenticationApi(
        configObject,
        apiClient
      );
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
            console.log(Constants.STRING_ERROR, error);
            const errorData = JSON.parse(
              error.response.text.replace(
                Constants.REGEX_DOUBLE_SLASH,
                Constants.STRING_EMPTY
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
        console.log(Constants.STRING_ERROR, error);
        return paymentResponse;
      });
    } else {
      console.log(Constants.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    console.log(Constants.STRING_ERROR, exception);
    return paymentResponse;
  }
};

export default { getPayerAuthSetupResponse };
