import restApi from 'cybersource-rest-client';
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import { Constants } from '../../constants';

const keys = async () => {
  let isv_tokenCaptureContextSignature = '';
  let isv_tokenVerificationContext = null;
  let contextWithoutSignature: string;
  let parsedContext: string;
  const format = Constants.ISV_PAYMENT_JWT_FORMAT;
  try {
    const apiClient = new restApi.ApiClient();
    const configObject = {
      authenticationType: Constants.ISV_PAYMENT_AUTHENTICATION_TYPE,
      runEnvironment: process.env.CONFIG_RUN_ENVIRONMENT,
      merchantID: process.env.ISV_PAYMENT_MERCHANT_ID,
      merchantKeyId: process.env.ISV_PAYMENT_MERCHANT_KEY_ID,
      merchantsecretKey: process.env.ISV_PAYMENT_MERCHANT_SECRET_KEY,
    };
    // eslint-disable-next-line no-var
    var requestObj = new restApi.GeneratePublicKeyRequest();
    requestObj.encryptionType = Constants.ISV_PAYMENT_ENCRYPTION_TYPE;
    requestObj.targetOrigin = process.env.CONFIG_TARGET_ORIGIN;
    const instance = new restApi.KeyGenerationApi(configObject, apiClient);
    return await new Promise(function (resolve, reject) {
      instance.generatePublicKey(
        format,
        requestObj,
        function (error, data, response) {
          if (data) {
            isv_tokenCaptureContextSignature = data.keyId;
            contextWithoutSignature =
              isv_tokenCaptureContextSignature.substring(
                Constants.VAL_ZERO,
                isv_tokenCaptureContextSignature.lastIndexOf(
                  Constants.REGEX_DOT
                ) + Constants.VAL_ONE
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
            console.log(
              Constants.ERROR_MSG_FLEX_TOKEN_KEYS,
              JSON.stringify(error)
            );
            isv_tokenCaptureContextSignature = Constants.STRING_EMPTY;
            isv_tokenVerificationContext = null;
            reject({
              isv_tokenCaptureContextSignature,
              isv_tokenVerificationContext,
            });
          }
        }
      );
    }).catch((error) => {
      console.log(Constants.STRING_ERROR, error);
      return { isv_tokenCaptureContextSignature, isv_tokenVerificationContext };
    });
  } catch (exception) {
    console.log(Constants.STRING_ERROR, exception);
    return { isv_tokenCaptureContextSignature, isv_tokenVerificationContext };
  }
};

export default { keys };
