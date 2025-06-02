import restApi from 'cybersource-rest-client';

import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { MidCredentialsType } from '../../types/Types';
import { AuthenticationError, errorHandler } from '../../utils/ErrorHandler';
import paymentUtils from '../../utils/PaymentUtils';
import isvApi from '../../utils/api/isvApi';

/**
 * Deletes a webhook subscription.
 * @param {MidCredentialsType} midCredentials - The MID credentials.
 * @param {string | undefined} webhookId - The subscription ID.
 * @returns {Promise<any>} A promise that resolves with the delete webhook subscription response.
 */
const deleteWebhookSubscriptionResponse = async (midCredentials: MidCredentialsType, webhookId: string | undefined): Promise<any> => {
  const deleteResponse = {
    httpCode: 0,
  };
  try {
    if (midCredentials?.merchantId && midCredentials?.merchantKeyId && midCredentials?.merchantSecretKey && webhookId) {
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_DELETE_WEBHOOK_SUBSCRIPTION_RESPONSE, midCredentials, null, null);
      const apiClient = new restApi.ApiClient();
      const startTime = new Date().getTime();
      return await new Promise<any>(function (resolve, reject) {
          isvApi.deleteWebhookSubscription(apiClient,configObject,webhookId, (error: any, data: any, response: any) => {
            const endTime = new Date().getTime();
            paymentUtils.logData(__filename, FunctionConstant.FUNC_DELETE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_DEBUG, 'webhookId : ' + webhookId, 'deleteWebhookSubscriptionResponse = ' + JSON.stringify(response), `${endTime - startTime}`);
            paymentUtils.logData(__filename, FunctionConstant.FUNC_DELETE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_DEBUG, '', 'Delete subscription data = ' + data);
            if (Constants.HTTP_OK_STATUS_CODE === response?.status) {
              deleteResponse.httpCode = response[Constants.STRING_RESPONSE_STATUS];
              resolve(deleteResponse);
            } else if (error) {
              deleteResponse.httpCode = error.status;
              reject(deleteResponse);
            } else {
              reject(deleteResponse);
            }
          });
      }).catch((error: any) => {
        errorHandler.logError(new AuthenticationError(CustomMessages.ERROR_MSG_SERVICE_PROCESS, '',FunctionConstant.FUNC_DELETE_WEBHOOK_SUBSCRIPTION_RESPONSE),__filename,  'webhookId : ' + webhookId);
        return error;
      });
    } else {
      return deleteResponse;
    }
  } catch (exception) {
    errorHandler.logError(new AuthenticationError(CustomMessages.EXCEPTION_MSG_DELETE_TOKEN, exception,FunctionConstant.FUNC_DELETE_CUSTOMER_TOKEN),__filename, '');
    return deleteResponse;
  }
};

export default { deleteWebhookSubscriptionResponse };
