import paymentUtils from '../PaymentUtils';

const getSubscriptionDetails = async (apiClient: any, configObject: any, requestObject: any, callback: any) => {
  await apiClient.setConfiguration(configObject);
  const apiHeaders = paymentUtils.prepareCybsApiHeaders({}, {}, requestObject, null, {}, {}, [], ['application/json;charset=utf-8'], ['application/json']);
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
