import paymentUtils from '../PaymentUtils';

/**
 * Retrieves subscription details from the specified API client.
 *
 * This function sets the configuration for the API client, prepares the necessary headers,
 * and makes a GET request to the webhook endpoint for notification subscriptions.
 * The result of the API call is returned, allowing for further processing or handling via a callback.
 *
 * @param {any} apiClient - The API client instance used to make requests.
 * @param {any} configObject - Configuration settings for the API client.
 * @param {any} requestObject - The request object containing details for the API call.
 * @param {any} callback - A callback function to handle the response from the API.
 * @returns {Promise<any>} - A promise that resolves with the API response.
 */
const getSubscriptionDetails = async (apiClient: any, configObject: any, requestObject: any, callback: any) => {
  await apiClient.setConfiguration(configObject);
  const apiHeaders = paymentUtils.prepareApiHeaders({}, {}, requestObject, null, {}, {}, [], ['application/json;charset=utf-8'], ['application/json']);
  return await apiClient.callApi(
    '/notification-subscriptions/v1/webhooks',
    'GET',
    apiHeaders.pathParams,
    apiHeaders.queryParams,
    apiHeaders.headerParams,
    apiHeaders.formParams,
    apiHeaders.postBody,
    apiHeaders.authNames,
    apiHeaders.contentTypes,
    apiHeaders.accepts,
    apiHeaders.returnType,
    callback
  );
};

export default {
  getSubscriptionDetails,
};
