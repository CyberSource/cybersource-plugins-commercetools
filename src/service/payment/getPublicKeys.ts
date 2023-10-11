import restApi from 'cybersource-rest-client';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import path from 'path';
import multiMid from '../../utils/config/MultiMid';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';
import crypto from 'crypto';

const getPublicKeys = async (captureContext, paymentObj) => {
    let decodedCaptureContext;
    let runEnvironment = Constants.TEST_ENVIRONMENT;
    let parsedValue;
    let publicKeyURL;
    let publicKeyPathParams;
    let publicKeyHeaderParams = {};
    let publicKeyRequestBody = null;
    let pemPublicKey;
    let isSignatureValid;
    let exceptionData;
    let errorData;
    let midCredentials;
    try {
        decodedCaptureContext = Buffer.from(captureContext.split(Constants.REGEX_DOT)[0], 'base64').toString('utf-8');
        parsedValue = JSON.parse(decodedCaptureContext);
        const apiClient = new restApi.ApiClient();
        runEnvironment = (Constants.LIVE_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) ? Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT : runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
        midCredentials = await multiMid.getMidCredentials(paymentObj);
        const configObject = {
            authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
            runEnvironment: runEnvironment,
            merchantID: midCredentials.merchantId,
            merchantKeyId: midCredentials.merchantKeyId,
            merchantsecretKey: midCredentials.merchantSecretKey,
            logConfiguration: {
                enableLog: false,
            },
        };
        apiClient.setConfiguration(configObject);
        if (parsedValue?.kid) {
            publicKeyURL = `/flex/v2/public-keys/${parsedValue.kid}`;
            publicKeyPathParams = {
                kid: parsedValue.kid
            }
        }
        const digest = crypto.createHash('sha256').update(JSON.stringify(publicKeyRequestBody), 'utf8').digest('base64');
        publicKeyHeaderParams['Digest'] = `SHA-256=${digest}`;
        return await new Promise((resolve, reject) => {
            apiClient.callApi(
                publicKeyURL, 'GET', publicKeyPathParams, {},
                publicKeyHeaderParams, null, publicKeyRequestBody, [],
                ['application/json'], ['application/json'], 'Object',
                (error, data, response) => {
                    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PUBLIC_KEY, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentObj.id, Constants.PUBLIC_KEY_RESPONSE + JSON.stringify(response));
                    if (data) {
                        try {
                            pemPublicKey = jwkToPem(data);
                            isSignatureValid = jwt.verify(captureContext, pemPublicKey);
                        }catch (exception) {
                            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PUBLIC_KEY, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentObj.id, Constants.ERROR_MSG_PUBLIC_KEY_VERIFICATION + Constants.STRING_HYPHEN + exception);
                        }
                        isSignatureValid?.flx?.data ? resolve(true) : reject(false)
                    } else {
                        if (
                            error.hasOwnProperty(Constants.STRING_RESPONSE) &&
                            null !== error.response &&
                            Constants.VAL_ZERO < Object.keys(error.response).length &&
                            error.response.hasOwnProperty(Constants.STRING_TEXT) &&
                            null !== error.response.text &&
                            Constants.VAL_ZERO < Object.keys(error.response.text).length
                        ) {
                            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PUBLIC_KEY, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentObj.id, Constants.ERROR_MSG_PUBLIC_KEY_VERIFICATION + Constants.STRING_HYPHEN + error.response.text);
                        } else {
                            errorData = (error?.response?.text) ? error.response.text : JSON.stringify(error);
                            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PUBLIC_KEY, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentObj.id, Constants.ERROR_MSG_PUBLIC_KEY_VERIFICATION + Constants.STRING_HYPHEN + errorData);
                        }
                        reject(errorData);
                    }
                }
            );
        }).catch((error) => {
            return error;
        });
    } catch (exception) {
        if (typeof exception === 'string') {
            exceptionData = exception.toUpperCase();
        } else if (exception instanceof Error) {
            exceptionData = exception.message;
        } else {
            exceptionData = exception;
        }
        if (Constants.EXCEPTION_MERCHANT_SECRET_KEY_REQUIRED === exceptionData || Constants.EXCEPTION_MERCHANT_KEY_ID_REQUIRED === exceptionData) {
            exceptionData = Constants.EXCEPTION_MSG_ENV_VARIABLE_NOT_SET + midCredentials.merchantId;
        }
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PUBLIC_KEY, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentObj.id, exceptionData);
        return false;
    }
};
export default { getPublicKeys };