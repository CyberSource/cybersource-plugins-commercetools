import restApi from 'cybersource-rest-client';
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import { Constants } from '../../constants';

const keys = async () => {
  let isv_tokenCaptureContextSignature: string;
  let isv_tokenVerificationContext = null;
  let contextWithoutSignature: string;
  let parsedContext: string;
  const format = Constants.JWT_FORMAT;
  const apiClient = new restApi.ApiClient();
  const configObject = {
    authenticationType: Constants.AUTHENTICATION_TYPE,
    runEnvironment: process.env.CONFIG_RUN_ENVIRONMENT,
    merchantID: process.env.ISV_PAYMENT_MERCHANT_ID,
    merchantKeyId: process.env.ISV_PAYMENT_MERCHANT_KEY_ID,
    merchantsecretKey: process.env.ISV_PAYMENT_MERCHANT_SECRET_KEY,
  };
  // eslint-disable-next-line no-var
  var requestObj = new restApi.GeneratePublicKeyRequest();
  requestObj.encryptionType = Constants.ENCRYPTION_TYPE;
  requestObj.targetOrigin = process.env.CONFIG_TARGET_ORIGIN;
  const instance = new restApi.KeyGenerationApi(configObject, apiClient);
  return await new Promise(function (resolve, reject) {
    instance.generatePublicKey(
      format,
      requestObj,
      function (error, data, response) {
        if (data) {
          isv_tokenCaptureContextSignature = data.keyId;
          contextWithoutSignature = isv_tokenCaptureContextSignature.substring(
            0,
            isv_tokenCaptureContextSignature.lastIndexOf('.') + 1
          );
          parsedContext = jwt_decode(contextWithoutSignature);
          isv_tokenVerificationContext = jwt.sign(
            parsedContext,
            process.env.ISV_PAYMENT_VERIFICATION_KEY
          );
          resolve({
            isv_tokenCaptureContextSignature,
            isv_tokenVerificationContext,
          });
        } else {
          console.log(Constants.ERROR_MSG_FLEX_TOKEN, JSON.stringify(error));
          isv_tokenCaptureContextSignature = Constants.EMPTY_STRING;
          isv_tokenVerificationContext = null;
          reject({
            isv_tokenCaptureContextSignature,
            isv_tokenVerificationContext,
          });
        }
      }
    );
  }).catch((error) => {
    console.log(Constants.ERROR_STRING, error);
    return { isv_tokenCaptureContextSignature, isv_tokenVerificationContext };
  });
};

export default { keys };
