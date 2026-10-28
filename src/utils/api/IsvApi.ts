import paymentUtils from '../PaymentUtils';

const getSubscriptionDetails = async (apiClient: any, configObject: any, requestObject: any, callback: any) => {
  await apiClient.setConfiguration(configObject);
  const apiHeaders = paymentUtils.prepareApiHeaders({}, {}, requestObject, null, {}, {}, [], ['application/json;charset=utf-8'], ['application/json']);
  return await apiClient.callApi(
    '/notification-subscriptions/v2/webhooks',
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
    false,
    callback
  );
};

const getSubscribedProducts = async (apiClient: any, configObject: any, organizationId: any, callback: any) => {
  await apiClient.setConfiguration(configObject);
  const apiHeaders = paymentUtils.prepareApiHeaders({ organizationId: organizationId }, {}, {}, null, {}, [Object], [], ['application/json;charset=utf-8'], ['application/json']);
  return await apiClient.callApi(
    '/notification-subscriptions/v2/products/{organizationId}',
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
    false,
    callback
  );
};

const createNewSubscription = async (apiClient: any, configObject: any, requestObject: any, callback: any) => {
  await apiClient.setConfiguration(configObject);
  const apiHeaders = paymentUtils.prepareApiHeaders({}, {}, {}, requestObject.createWebhook, {}, {}, [], ['application/json;charset=utf-8'], ['application/json']);
  return await apiClient.callApi(
    '/notification-subscriptions/v2/webhooks',
    'POST',
    apiHeaders.pathParams,
    apiHeaders.queryParams,
    apiHeaders.headerParams,
    apiHeaders.formParams,
    apiHeaders.postBody,
    apiHeaders.authNames,
    apiHeaders.contentTypes,
    apiHeaders.accepts,
    apiHeaders.returnType,
    false,
    callback
  );
};

const deleteWebhookSubscription = async (apiClient: any, configObject: any, webhookId: any, callback: any) => {
  await apiClient.setConfiguration(configObject);
  const apiHeaders = paymentUtils.prepareApiHeaders({ webhookId: webhookId }, {}, {}, null, {}, {}, [], ['application/json;charset=utf-8'], ['application/json']);
  return await apiClient.callApi(
    '/notification-subscriptions/v2/webhooks/{webhookId}',
    'DELETE',
    apiHeaders.pathParams,
    apiHeaders.queryParams,
    apiHeaders.headerParams,
    apiHeaders.formParams,
    apiHeaders.postBody,
    apiHeaders.authNames,
    apiHeaders.contentTypes,
    apiHeaders.accepts,
    apiHeaders.returnType,
    false,
    callback
  );
};

const updateWebhookStatus = async (apiClient: any, configObject: any, webhookId: any, statusBody: any, callback: any) => {
  await apiClient.setConfiguration(configObject);
  const apiHeaders = paymentUtils.prepareApiHeaders({ webhookId: webhookId }, {}, {}, statusBody, {}, {}, [], ['application/json;charset=utf-8'], ['application/json']);
  return await apiClient.callApi(
    '/notification-subscriptions/v2/webhooks/{webhookId}/status',
    'PUT',
    apiHeaders.pathParams,
    apiHeaders.queryParams,
    apiHeaders.headerParams,
    apiHeaders.formParams,
    apiHeaders.postBody,
    apiHeaders.authNames,
    apiHeaders.contentTypes,
    apiHeaders.accepts,
    apiHeaders.returnType,
    false,
    callback
  );
};

export default {
  getSubscriptionDetails,
  getSubscribedProducts,
  createNewSubscription,
  deleteWebhookSubscription,
  updateWebhookStatus
};
