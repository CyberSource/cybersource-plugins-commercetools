import dotenv from 'dotenv';

import { CustomMessages } from './constants/customMessages';
import { FunctionConstant } from './constants/functionConstant';
import { Constants } from './constants/paymentConstants';
import createTransactionSearchRequest from './service/payment/CreateTransactionSearchRequest';
import { ApiError, errorHandler } from './utils/ErrorHandler';
import paymentUtils from './utils/PaymentUtils';
import MultiMid from './utils/config/MultiMid';
dotenv.config();

/**
 * Tests the API connection for payment gateways.
 *
 * @async
 * @function testApiConnection
 * @returns {Promise<void>} Resolves when all connection tests are completed.
 */
const testApiConnection = async (): Promise<string> => {
    let connectionMessage = '';
    const defaultMid = {
        merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
        merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
        merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY
    };
    let isInvalidCreds = false;
    try {
        const midCredentials = MultiMid.getAllMidDetails();
        if (defaultMid.merchantId && defaultMid.merchantKeyId && defaultMid.merchantSecretKey) {
            midCredentials.push(defaultMid);
        }
        if (0 < midCredentials.length) {
            for (let midCount = 0; midCount < midCredentials.length; midCount++) {
                const connectionResponse = await createTransactionSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, 1, Constants.STRING_SYNC_SORT, midCredentials[midCount], true);
                if (Constants.HTTP_SUCCESS_STATUS_CODE === connectionResponse?.httpCode) {
                    connectionMessage = `${CustomMessages.SUCCESS_MSG_CONNECTION_TEST}`;
                } else {
                    isInvalidCreds = true;
                }
            }
            if (isInvalidCreds) {
                connectionMessage = `${CustomMessages.ERROR_MSG_INVALID_CREDENTIALS}`;
            }
            paymentUtils.logData(__filename, FunctionConstant.FUNC_TEST_API_CONNECTION, Constants.LOG_INFO, '', connectionMessage);
        } else {
            connectionMessage = CustomMessages.EXCEPTION_MSG_ENV_VARIABLE_NOT_SET;
            paymentUtils.logData(__filename, FunctionConstant.FUNC_TEST_API_CONNECTION, Constants.LOG_WARN, '', connectionMessage);
        }
    } catch (exception) {
        connectionMessage = CustomMessages.EXCEPTION_MSG_CONNECTION_ERROR;
        errorHandler.logError(new ApiError(connectionMessage, exception, FunctionConstant.FUNC_TEST_API_CONNECTION), __filename, '');
    }
    return connectionMessage;
};

export {
    testApiConnection
}

