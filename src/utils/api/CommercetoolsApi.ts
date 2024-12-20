import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Address } from '../../models/AddressModel';
import { Token } from '../../models/TokenModel';
import { ActionType, AddressType, CardAddressGroupType, CustomerType, PaymentTransactionType, PaymentType, ReportSyncType, VisaUpdateType } from '../../types/Types';
import paymentUtils from '../PaymentUtils';
type createClient = typeof createClient;
type createHttpMiddleware = typeof createHttpMiddleware;
dotenv.config();

/**
 * Gets the CommerceTools client.
 * 
 * @returns {any} - The CommerceTools client.
 */
const getClient = () => {
  const projectKey = process.env.CT_PROJECT_KEY;
  let client: createClient;
  try {
    if (process.env.CT_AUTH_HOST && process.env.CT_CLIENT_ID && process.env.CT_CLIENT_SECRET && process.env.CT_API_HOST) {
      const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
        host: process.env.CT_AUTH_HOST,
        projectKey,
        credentials: {
          clientId: process.env.CT_CLIENT_ID,
          clientSecret: process.env.CT_CLIENT_SECRET,
        },
        fetch,
      });
      client = createClient({
        middlewares: [
          authMiddleware,
          createHttpMiddleware({
            host: process.env.CT_API_HOST,
            fetch,
          }),
        ],
      });
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_CLIENT, CustomMessages.EXCEPTION_MSG_COMMERCETOOLS_CONNECT, exception, '', '', '');
  }
  return client;
};

const client = getClient();

/**
 * Executes a request against the Commercetools API and returns the response.
 *
 * This function captures the start and end times of the API call, retrieves the response body,
 * and attaches timing information to the response. It provides a structured way to interact
 * with the Commercetools client while tracking performance metrics.
 *
 * @param {any} request - The request object to be executed against the Commercetools API.
 * @returns {Promise<any>} - A promise that resolves with the API response, including timing details.
 */
const makeCommercetoolsRequest = async (request: any) => {
  let clientResponse: any = {};
  const startTime = new Date().getTime();
  const clientResponseObject = await client.execute(request);
  const endTime = new Date().getTime();
  if (clientResponseObject?.body) {
    clientResponse = clientResponseObject.body;
  }
  clientResponse.consolidatedTime = endTime - startTime;
  return clientResponse;
}

/**
 * Queries a cart by its ID.
 * 
 * @param {string} id - The ID of the cart.
 * @param {string} idType - The type of ID.
 * @returns {Promise<any>} - The cart details.
 */
const queryCartById = async (id: string, idType: string): Promise<any> => {
  let retrieveCartByIdResponse = null;
  let uri = '';
  let logIdType = '';
  if (id && idType) {
    if (client && process.env.CT_PROJECT_KEY) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      switch (idType) {
        case Constants.ANONYMOUS_ID:
          uri = requestBuilder.carts.parse({ where: [`${Constants.ANONYMOUS_ID} = "${id}"`, `${Constants.ACTIVE_CART_STATE}`], sort: [{ by: Constants.LAST_MODIFIED_AT, direction: Constants.DESC_ORDER }] }).build();
          logIdType = 'Anonymous Id : ';
          break;
        case Constants.CUSTOMER_ID:
          uri = requestBuilder.carts.parse({ where: [`${Constants.CUSTOMER_ID} = "${id}"`, `${Constants.ACTIVE_CART_STATE}`], sort: [{ by: Constants.LAST_MODIFIED_AT, direction: Constants.DESC_ORDER }] }).build();
          logIdType = 'Customer Id : ';
          break;
        case Constants.PAYMENT_ID:
          uri = requestBuilder.carts.parse({ where: [`paymentInfo(payments(id="${id}"))`] }).build();
          logIdType = 'Payment Id : ';
      }
      const channelsRequest = {
        uri: uri,
        method: 'GET',
      };
      retrieveCartByIdResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_QUERY_CART_BY_ID, Constants.LOG_INFO, logIdType + id || '', '', `${retrieveCartByIdResponse.consolidatedTime}`)
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_QUERY_CART_BY_ID, Constants.LOG_ERROR, logIdType + id || '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
  return retrieveCartByIdResponse;
};

/**
 * Queries an order by its ID.
 * 
 * @param {string} id - The ID of the order.
 * @param {string} idType - The type of ID.
 * @returns {Promise<any>} - The order details.
 */
const queryOrderById = async (id: string, idType: string) => {
  let queryOrderByIdResponse = null;
  let uri = '';
  let logIdType = '';
  if (id && idType) {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      switch (idType) {
        case Constants.CART_ID:
          uri = requestBuilder.orders.parse({ where: [`cart(id="${id}")`] }).build();
          logIdType = 'CartId : ';
          break;
        case Constants.PAYMENT_ID:
          uri = requestBuilder.orders.parse({ where: [`paymentInfo(payments(id="${id}"))`] }).build();
          logIdType = 'PaymentId : ';
          break;
        case Constants.CUSTOMER_ID: {
          let newDate = paymentUtils.getDate(null, false, -6, null) as number;
          let setDate = paymentUtils.getDate(null, false, null, newDate);
          let filterDate = paymentUtils.getDate(setDate, true);
          uri = requestBuilder.orders.where(`customerId="${id}" and createdAt >= "${filterDate}"`).build();
          logIdType = 'CustomerId : ';
        }
      }
      const channelsRequest = {
        uri: uri,
        method: 'GET',
      };
      queryOrderByIdResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_QUERY_ORDER_BY_ID, Constants.LOG_INFO, logIdType + id || '', '', `${queryOrderByIdResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_QUERY_ORDER_BY_ID, Constants.LOG_ERROR, logIdType + id || '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
  return queryOrderByIdResponse;
};

/**
 * Retrieves payment details by ID.
 * 
 * @param {string} paymentId - The ID of the payment.
 * @returns {Promise<any>} - The payment details.
 */
const retrievePayment = async (paymentId: string): Promise<any> => {
  let retrievePaymentResponse = null;
  try {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.payments.byId(paymentId).build();
      const channelsRequest = {
        uri: uri,
        method: 'GET',
      };
      retrievePaymentResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_RETRIEVE_PAYMENT, Constants.LOG_INFO, '', '', `${retrievePaymentResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_RETRIEVE_PAYMENT, Constants.LOG_ERROR, 'PaymentId: ' + paymentId || '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_RETRIEVE_PAYMENT, CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT, exception, '', '', '');
  }
  return retrievePaymentResponse;
};

/**
 * Adds a transaction to a payment.
 * 
 * @param {PaymentTransactionType} transactionObject - The transaction object to add.
 * @param {string} paymentId - The ID of the payment.
 * @returns {Promise<PaymentType | null>} - The updated payment with the added transaction.
 */
const addTransaction = async (transactionObject: Partial<PaymentTransactionType>, paymentId: string): Promise<PaymentType | null> => {
  let addTransactionResponse = null;
  if (transactionObject && paymentId) {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.payments.byId(paymentId).build();
      const channelsRequest = {
        uri: uri,
        method: 'POST',
        body: JSON.stringify({
          version: transactionObject.version,
          actions: [
            {
              action: 'addTransaction',
              transaction: {
                type: transactionObject.type,
                timestamp: paymentUtils.getDate(Date.now(), true),
                amount: transactionObject.amount,
                state: transactionObject.state,
              },
            },
          ],
        }),
      };
      addTransactionResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_RETRIEVE_PAYMENT, Constants.LOG_INFO, '', '', `${addTransactionResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_TRANSACTION, Constants.LOG_ERROR, 'PaymentId: ' + paymentId, CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT)
    }
  }
  return addTransactionResponse;
};

/**
 * Retrieves orders.
 * 
 * @returns {Promise<any>} - The response body containing orders.
 */
const getOrders = async (): Promise<any> => {
  let getOrderResponse: any = null;
  if (client) {
    const requestBuilder = createRequestBuilder({
      projectKey: process.env.CT_PROJECT_KEY,
    });
    const uri = requestBuilder.payments.parse({ sort: [{ by: Constants.LAST_MODIFIED_AT, direction: Constants.DESC_ORDER }] }).build();
    const channelsRequest = {
      uri: uri,
      method: 'GET',
    };
    getOrderResponse = await makeCommercetoolsRequest(channelsRequest);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_ORDERS, Constants.LOG_INFO, '', '', `${getOrderResponse.consolidatedTime}`)
  } else {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_ORDERS, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
  }
  return getOrderResponse;
};


/**
 * Updates cart by payment ID.
 * 
 * @param {string} cartId - The ID of the cart.
 * @param {string} paymentId - The ID of the payment.
 * @param {number} cartVersion - The version of the cart.
 * @param {CardAddressGroupType} addressData - The address data.
 * @returns {Promise<any>} - The response body containing updated cart data.
 */
const updateCartByPaymentId = async (cartId: string, paymentId: string, cartVersion: number, addressData: Partial<CardAddressGroupType>): Promise<any> => {
  let updateCartByPaymentIdResponse = null;
  const actions: Partial<ActionType>[] = [];
  if (cartId && cartVersion && addressData && Object.keys(addressData).length) {
    if (addressData?.billToFieldGroup && Object.keys(addressData.billToFieldGroup).length) {
      actions.push({
        action: 'setBillingAddress',
        address: new Address(addressData.billToFieldGroup)
      });
    }
    if (addressData?.shipToFieldGroup && 0 !== Object.keys(addressData.shipToFieldGroup).length) {
      if (!addressData?.shipToFieldGroup?.email) {
        const cartData = await queryCartById(paymentId, Constants.PAYMENT_ID);
        addressData.shipToFieldGroup.email = cartData?.results[0]?.shippingAddress?.email;
      }
      actions.push({
        action: 'setShippingAddress',
        address: new Address(addressData.shipToFieldGroup),
      });
    }
    if (addressData?.billTo && Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE) {
      actions.push({
        action: 'setBillingAddress',
        address: new Address(addressData.billTo),
      });
    }
    if (addressData?.shipTo && paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING)) {
      const cartDetail = await getCartById(cartId);
      if (cartDetail) {
        if ('Single' === cartDetail.shippingMode) {
          actions.push({
            action: 'setShippingAddress',
            address: new Address(addressData.shipTo),
          })
        }
      }
    }
    if (actions && actions.length) {
      if (client) {
        const requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        const uri = requestBuilder.carts.byId(cartId).build();
        const channelsRequest = {
          uri: uri,
          method: 'POST',
          body: JSON.stringify({
            version: cartVersion,
            actions: actions,
          }),
        };
        updateCartByPaymentIdResponse = await makeCommercetoolsRequest(channelsRequest);
        paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, 'CartId: ' + cartId || '', '', `${updateCartByPaymentIdResponse.consolidatedTime}`);
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_CART_BY_PAYMENT_ID, Constants.LOG_ERROR, 'CartId: ' + cartId || '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    }
  }
  return updateCartByPaymentIdResponse;
};

//Aswin:need to change this
/**
 * Sets customer tokens.
 * 
 * @param {string} tokenCustomerId - The ID of the token customer.
 * @param {string} paymentInstrumentId - The ID of the payment instrument.
 * @param {string} instrumentIdentifier - The identifier of the instrument.
 * @param {PaymentType} updatePaymentObj - The payment object to update.
 * @param {string} addressId - The ID of the address.
 * @returns {Promise<any>} - The response after setting customer tokens.
 */
const setCustomerTokens = async (tokenCustomerId: string, paymentInstrumentId: string, instrumentIdentifier: string, updatePaymentObj: PaymentType, addressId: string): Promise<any> => {
  let setCustomerTokensResponse = null;
  let isCustomTypePresent = false;
  let failedTokens: string[] = [];
  if (paymentInstrumentId && instrumentIdentifier && updatePaymentObj?.customer?.id && updatePaymentObj?.custom?.fields) {
    const customerId = updatePaymentObj.customer.id;
    const customFields = updatePaymentObj?.custom?.fields;
    const customerInfo = await getCustomer(customerId);
    if (customerInfo) {
      isCustomTypePresent = (customerInfo?.custom?.type?.id) ? true : false;
      const stringTokenData = JSON.stringify(new Token(customFields, tokenCustomerId, paymentInstrumentId, instrumentIdentifier, addressId, ''));
      if (isCustomTypePresent) {
        if (customerInfo?.custom?.fields?.isv_tokens && 0 < customerInfo?.custom?.fields?.isv_tokens?.length) {
          if (customerInfo?.custom?.fields?.isv_failedTokens) {
            failedTokens = customerInfo.custom.fields.isv_failedTokens;
          }
          const isvTokens = customerInfo.custom.fields.isv_tokens;
          const mappedTokens = isvTokens.map((item) => item);
          const length = mappedTokens.length;
          mappedTokens[length] = stringTokenData;
          setCustomerTokensResponse = await updateCustomerToken(mappedTokens, customerInfo, failedTokens, tokenCustomerId);
        } else {
          if (customerInfo.custom?.fields?.isv_failedTokens) {
            failedTokens = customerInfo.custom.fields.isv_failedTokens;
          }
          const tokenArray = [stringTokenData];
          setCustomerTokensResponse = await updateCustomerToken(tokenArray, customerInfo, failedTokens, tokenCustomerId);
        }
      } else {
        const tokenArray = [stringTokenData];
        setCustomerTokensResponse = await setCustomType(customerId, tokenArray, failedTokens, tokenCustomerId);
      }
    }
  }
  return setCustomerTokensResponse;
};

/**
 * Retrieves customer information by ID.
 * 
 * @param {string} customerId - The ID of the customer.
 * @returns {Promise<CustomerType | null>} - The response containing customer information.
 */
const getCustomer = async (customerId: string): Promise<Partial<CustomerType> | null> => {
  let getCustomerResponse = null;
  if (customerId) {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.customers.byId(customerId).build();
      const channelsRequest = {
        uri: uri,
        method: 'GET',
      };
      getCustomerResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CUSTOMER, Constants.LOG_INFO, 'CustomerId : ' + customerId, '', `${getCustomerResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CUSTOMER, Constants.LOG_ERROR, 'CustomerId : ' + customerId, CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
  return getCustomerResponse;
};

/**
 * Updates a payment transaction's state synchronously.
 * 
 * @param {PaymentTransactionType} decisionUpdateObject - The object containing payment transaction details.
 * @param {string} transactionId - The ID of the transaction to update.
 * @returns {Promise<void>}
 */
const updateDecisionSync = async (decisionUpdateObject: Partial<PaymentTransactionType>, transactionId: string): Promise<void> => {
  if (decisionUpdateObject) {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.payments.byId(decisionUpdateObject.id).build();
      const channelsRequest = {
        uri: uri,
        method: 'POST',
        body: JSON.stringify({
          version: decisionUpdateObject.version,
          actions: [
            {
              action: 'changeTransactionState',
              transactionId: transactionId,
              state: decisionUpdateObject.state,
            },
          ],
        }),
      };
      const decisionSyncResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_INFO, 'PaymentId : ' + decisionUpdateObject?.id, '', `${decisionSyncResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_ERROR, 'PaymentId : ' + decisionUpdateObject?.id, CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
};

/**
 * Syncs Visa card details for a payment.
 * 
 * @param {VisaUpdateType} visaUpdateObject - Object containing Visa card update details.
 * @returns {Promise<PaymentType | null>} - Updated payment object.
 */
const syncVisaCardDetails = async (visaUpdateObject: VisaUpdateType): Promise<PaymentType | null> => {
  let syncVisaCardDetailsResponse = null;
  if (visaUpdateObject && visaUpdateObject?.id) {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.payments.byId(visaUpdateObject.id).build();
      const channelsRequest = {
        uri: uri,
        method: 'POST',
        body: JSON.stringify({
          version: visaUpdateObject.version,
          actions: visaUpdateObject.actions,
        }),
      };
      syncVisaCardDetailsResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_SYNC_VISA_CARD_DETAILS, Constants.LOG_INFO, 'PaymentId : ' + visaUpdateObject?.id, '', `${syncVisaCardDetailsResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_SYNC_VISA_CARD_DETAILS, Constants.LOG_ERROR, 'PaymentId : ' + visaUpdateObject?.id, CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
  return syncVisaCardDetailsResponse;
};

/**
 * Syncs additional transaction details for a payment.
 * 
 * @param {ReportSyncType} syncUpdateObject - Object containing transaction details to sync.
 * @returns {Promise<PaymentType | null>} - Updated payment object.
 */
const syncAddTransaction = async (syncUpdateObject: ReportSyncType): Promise<PaymentType | null> => {
  let channelsRequest = null;
  let syncAddTransactionResponse = null;
  if (syncUpdateObject) {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.payments.byId(syncUpdateObject.id).build();
      if (syncUpdateObject.securityCodePresent) {
        channelsRequest = {
          uri: uri,
          method: 'POST',
          body: JSON.stringify({
            version: syncUpdateObject.version,
            actions: [
              {
                action: 'addTransaction',
                transaction: {
                  type: syncUpdateObject.type,
                  timestamp: paymentUtils.getDate(Date.now(), true),
                  amount: syncUpdateObject.amountPlanned,
                  state: syncUpdateObject.state,
                  interactionId: syncUpdateObject.interactionId,
                },
              },
              {
                action: Constants.SET_CUSTOM_FIELD,
                name: Constants.ISV_SECURITY_CODE,
                value: null,
              },
            ],
          }),
        };
      } else {
        channelsRequest = {
          uri: uri,
          method: 'POST',
          body: JSON.stringify({
            version: syncUpdateObject.version,
            actions: [
              {
                action: 'addTransaction',
                transaction: {
                  type: syncUpdateObject.type,
                  timestamp: paymentUtils.getDate(Date.now(), true),
                  amount: syncUpdateObject.amountPlanned,
                  state: syncUpdateObject.state,
                  interactionId: syncUpdateObject.interactionId,
                },
              },
            ],
          }),
        };
      }
      syncAddTransactionResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_SYNC_ADD_TRANSACTION, Constants.LOG_INFO, 'PaymentId : ' + syncUpdateObject?.id, '', `${syncAddTransactionResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_SYNC_ADD_TRANSACTION, Constants.LOG_ERROR, 'PaymentId : ' + syncUpdateObject?.id, CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
  return syncAddTransactionResponse;
};

/**
 * Adds custom types to the CommerceTools project.
 * 
 * @param {any} customType - Custom type object to add.
 * @returns {Promise<any>} - Response of the add custom type operation.
 */
const addCustomTypes = async (customType: any): Promise<any> => {
  let addCustomTypeResponse;
  let data: any;
  try {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.types.build();
      const channelsRequest = {
        uri: uri,
        method: 'POST',
        body: JSON.stringify(customType),
      };
      const startTime = new Date().getTime();
      addCustomTypeResponse = await client.execute(channelsRequest);
      const endTime = new Date().getTime();
      paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_CUSTOM_TYPES, Constants.LOG_INFO, '', '', `${endTime - startTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_CUSTOM_TYPES, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_ADD_CUSTOM_TYPE, CustomMessages.EXCEPTION_MSG_CUSTOM_TYPE, exception, '', '', '');
    data = exception;
    if (Constants.HTTP_BAD_REQUEST_STATUS_CODE === data.statusCode && Constants.HTTP_BAD_REQUEST_STATUS_CODE === data?.body?.statusCode && Constants.STRING_DUPLICATE_FIELD === data?.body?.errors[0]?.code) {
      addCustomTypeResponse = data;
    }
  }
  return addCustomTypeResponse;
};

/**
 * Adds extensions to the CommerceTools project.
 * 
 * @param {any} extension - Extension object to add.
 * @returns {Promise<any>} - Response of the add extension operation.
 */
const addExtensions = async (extension: any): Promise<any> => {
  let addExtensionsResponse;
  if (client) {
    const requestBuilder = createRequestBuilder({
      projectKey: process.env.CT_PROJECT_KEY,
    });
    const uri = requestBuilder.extensions.build();
    const channelsRequest = {
      uri: uri,
      method: 'POST',
      body: JSON.stringify(extension),
    };
    const startTime = new Date().getTime();
    addExtensionsResponse = await client.execute(channelsRequest);
    const endTime = new Date().getTime();
    paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_EXTENSIONS, Constants.LOG_INFO, '', '', `${endTime - startTime}`);
  } else {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_EXTENSIONS, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
  }
  return addExtensionsResponse;
};

/**
 * Retrieves a custom type by its key.
 * 
 * @param {string} key - Key of the custom type to retrieve.
 * @returns {Promise<any>} - Response of the get custom type operation.
 */
const getCustomType = async (key: string): Promise<any> => {
  let getCustomTypeResponse = null;
  if (key) {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.types.byKey(key).build();
      const channelsRequest = {
        uri: uri,
        method: 'GET',
      };
      const startTime = new Date().getTime();
      getCustomTypeResponse = await client.execute(channelsRequest);
      const endTime = new Date().getTime();
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CUSTOM_TYPE, Constants.LOG_INFO, '', '', `${endTime - startTime}`);
    }
  }
  return getCustomTypeResponse;
};

/**
 * Updates the custom type associated with a customer.
 * 
 * @param {string} customerId - ID of the customer.
 * @param {string[]} fieldsData - Data to update the custom type fields.
 * @param {string[]} failedTokenData - Array of failed token data.
 * @param {string} [customerTokenId] - Customer token ID.
 * @returns {Promise<CustomerType | null>} - Response of the set custom type operation.
 */
const setCustomType = async (customerId: string | undefined, fieldsData: string[], failedTokenData: string[] | undefined, customerTokenId?: string): Promise<Partial<CustomerType> | null> => {
  let setCustomTypeResponse = null;
  if (customerId) {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const customerInfo = await getCustomer(customerId);
      const uri = requestBuilder.customers.byId(customerId).build();
      const failedTokens = failedTokenData ? failedTokenData : [];
      const channelsRequest = {
        uri: uri,
        method: 'POST',
        body: JSON.stringify({
          version: customerInfo?.version,
          actions: [
            {
              action: 'setCustomType',
              type: {
                key: 'isv_payments_customer_tokens',
                typeId: Constants.TYPE_ID_TYPE,
              },
              fields: {
                isv_tokens: fieldsData,
                isv_failedTokens: failedTokens,
                isv_customerId: customerTokenId,
              },
            },
          ],
        }),
      };
      setCustomTypeResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_SET_CUSTOM_TYPE, Constants.LOG_INFO, '', '', `${setCustomTypeResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_SET_CUSTOM_TYPE, Constants.LOG_ERROR, 'CustomerId: ' + customerId, CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
  return setCustomTypeResponse;
};

/**
 * Changes the interaction ID of a transaction.
 * 
 * @param {any} transactionObj - Object containing transaction details.
 * @returns {Promise<PaymentType | null>} - Response of the change transaction interaction ID operation.
 */
const changeTransactionInteractionId = async (transactionObj: any) => {
  let changeTransactionInteractionIdResponse = null;
  if (transactionObj) {
    let paymentId = transactionObj.paymentId;
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.payments.byId(paymentId).build();
      const channelsRequest = {
        uri: uri,
        method: 'GET',
        body: JSON.stringify({
          version: transactionObj.version,
          actions: [
            {
              action: Constants.CHANGE_TRANSACTION_INTERACTION_ID,
              transactionId: transactionObj.transactionId,
              interactionId: transactionObj.interactionId,
            },
          ],
        }),
      };
      changeTransactionInteractionIdResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_CHANGE_TRANSACTION_INTERACTION_ID, Constants.LOG_INFO, '', '', `${changeTransactionInteractionIdResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_CHANGE_TRANSACTION_INTERACTION_ID, Constants.LOG_ERROR, 'PaymentId: ' + paymentId, CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
  return changeTransactionInteractionIdResponse;
};

/**
 * Adds a custom field to a given type.
 * 
 * @param {string} typeId - The ID of the type to which the field will be added.
 * @param {number} version - The version of the type.
 * @param {any} fieldDefinition - The definition of the custom field to be added.
 * @returns {Promise<any>} - Response of the add custom field operation.
 */
const addCustomField = async (typeId: string, version: number, fieldDefinition: any) => {
  let addCustomFieldResponse;
  if (typeId && version && fieldDefinition) {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.types.byId(typeId).build();
      const channelsRequest = {
        uri: uri,
        method: 'POST',
        body: JSON.stringify({
          version: version,
          actions: [
            {
              action: 'addFieldDefinition',
              fieldDefinition: fieldDefinition,
            },
          ],
        }),
      };
      addCustomFieldResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_CUSTOM_FIELD, Constants.LOG_INFO, '', '', `${addCustomFieldResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_CUSTOM_FIELD, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
  return addCustomFieldResponse;
};

/**
 * Updates the available capture amount for a transaction.
 * 
 * @param {string} paymentId - The ID of the payment associated with the transaction.
 * @param {number} version - The version of the payment.
 * @param {string} transactionId - The ID of the transaction.
 * @param {number} pendingAmount - The pending amount to be set as available capture amount.
 * @returns {Promise<any>} - Response of the update available amount operation.
 */
const updateAvailableAmount = async (paymentId: string, version: number, transactionId: string, pendingAmount: number) => {
  let updateAvailableAmountResponse;
  if (paymentId && version && transactionId && 0 > pendingAmount) {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.payments.byId(paymentId).build();
      const channelsRequest = {
        uri: uri,
        method: 'POST',
        body: JSON.stringify({
          version: version,
          actions: [
            {
              action: 'setTransactionCustomType',
              type: {
                key: 'isv_transaction_data',
                typeId: Constants.TYPE_ID_TYPE,
              },
              fields: {
                isv_availableCaptureAmount: pendingAmount,
              },
              transactionId: transactionId,
            },
          ],
        }),
      };
      updateAvailableAmountResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_AVAILABLE_AMOUNT, Constants.LOG_INFO, '', '', `${updateAvailableAmountResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_AVAILABLE_AMOUNT, Constants.LOG_ERROR, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
  return updateAvailableAmountResponse;
};

/**
 * Retrieves a cart by its ID.
 * 
 * @param {string} cartId - The ID of the cart to retrieve.
 * @returns {Promise<any>} - Response containing the cart details.
 */
const getCartById = async (cartId: string) => {
  let getCartByIdResponse;
  if (cartId) {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.carts.byId(cartId).build();
      const channelsRequest = {
        uri: uri,
        method: 'GET',
      };
      getCartByIdResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CART_BY_ID, Constants.LOG_INFO, '', '', `${getCartByIdResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CART_BY_ID, Constants.LOG_ERROR, 'CartId : ' + cartId, CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
  return getCartByIdResponse;
};

/**
 * Adds a new address to a customer.
 * 
 * @param {string} customerId - The ID of the customer.
 * @param {AddressType} addressObj - The address object to add.
 * @returns {Promise<any>} - Response containing the updated customer details.
 */
const addCustomerAddress = async (customerId: string, addressObj: Partial<AddressType>) => {
  const actions: Partial<ActionType>[] = [];
  let addCustomerAddressResponse = null;
  let customerData: Partial<CustomerType> | null = null;
  if (customerId) {
    customerData = await getCustomer(customerId);
    actions.push({
      action: 'addAddress',
      address: new Address(addressObj)
    });
    if (actions && actions.length && customerData) {
      if (client) {
        const requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        const uri = requestBuilder.customers.byId(customerId).build();
        const channelsRequest = {
          uri: uri,
          method: 'POST',
          body: JSON.stringify({
            version: customerData.version,
            actions: actions,
          }),
        };
        addCustomerAddressResponse = await makeCommercetoolsRequest(channelsRequest);
        paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_CUSTOMER_ADDRESS, Constants.LOG_INFO, '', '', `${addCustomerAddressResponse.consolidatedTime}`);
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_CUSTOMER_ADDRESS, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    }
  }
  return addCustomerAddressResponse;
};

//Network Tokenization
/**
 * Creates a custom object in the commercetools platform.
 * 
 * @param {any} customObjectData - Data for the custom object.
 * @returns {Promise<any>} - Response containing the created custom object.
 */
const createCTCustomObject = async (customObjectData: any) => {
  let setCustomObjectResponse: any;
  if (client) {
    const requestBuilder = createRequestBuilder({
      projectKey: process.env.CT_PROJECT_KEY,
    });
    const uri = requestBuilder.customObjects.build();
    const channelsRequest = {
      uri: uri,
      method: 'POST',
      body: JSON.stringify(customObjectData),
    };
    setCustomObjectResponse = await makeCommercetoolsRequest(channelsRequest);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_CREATE_CT_CUSTOM_OBJECT, Constants.LOG_INFO, '', '', `${setCustomObjectResponse.consolidatedTime}`);
  } else {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_CREATE_CT_CUSTOM_OBJECT, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
  }
  return setCustomObjectResponse;
};

/**
 * Retrieves custom objects from the commercetools platform by container.
 * 
 * @param {string} container - The container name.
 * @returns {Promise<any>} - Response containing the retrieved custom objects.
 */
const retrieveCustomObjectByContainer = async (container: string) => {
  let getCustomObjectsResponse: any;
  if (client) {
    const requestBuilder = createRequestBuilder({
      projectKey: process.env.CT_PROJECT_KEY,
    })
    const uri = requestBuilder.customObjects.where(`container = "${container}"`).build();
    const channelsRequest = {
      uri: uri,
      method: 'GET',
    };
    const startTime = new Date().getTime();
    getCustomObjectsResponse = await client.execute(channelsRequest);
    const endTime = new Date().getTime();
    if (getCustomObjectsResponse?.body) {
      getCustomObjectsResponse = getCustomObjectsResponse.body;
    }
    paymentUtils.logData(__filename, FunctionConstant.FUNC_RETRIEVE_CUSTOMER_OBJECT_BY_CONTAINER, Constants.LOG_INFO, '', '', `${endTime - startTime}`);
  }
  return getCustomObjectsResponse;
};

/**
 * Updates customer tokens.
 * 
 * @param {any} updateObject - Object containing the token to update.
 * @param {CustomerType} customerObject - Customer object to update.
 * @param {any} failedTokens - Failed tokens data.
 * @returns {Promise<any>} - Response containing the result of the update.
 */
const updateCustomerToken = async (updateObject: any, customerObject: Partial<CustomerType>, failedTokens: any, customerTokenId: string | null) => {
  let actions: any = [];
  let setCustomFieldResponse: any;
  if (customerObject && customerObject?.id) {
    let customerId = customerObject.id;
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      if (failedTokens) {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_FAILED_TOKENS,
          value: failedTokens,
        });
      }
      if (updateObject) {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_TOKENS,
          value: updateObject,
        });
      }
      if (customerTokenId) {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CUSTOMER_ID,
          value: customerTokenId
        });
      }
      if (customerObject?.custom?.fields?.isv_tokenAction) {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_TOKEN_ACTION,
          value: null,
        });
      }
      if (customerObject?.custom?.fields?.isv_cardNewExpiryMonth) {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_NEW_EXPIRY_MONTH,
          value: null,
        });
      }
      if (customerObject?.custom?.fields?.isv_cardNewExpiryYear) {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CARD_NEW_EXPIRY_YEAR,
          value: null,
        });
      }
      const uri = requestBuilder.customers.byId(customerId).build();
      const channelsRequest = {
        uri: uri,
        method: 'POST',
        body: JSON.stringify({
          version: customerObject.version,
          actions: actions,
        }),
      };
      setCustomFieldResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_CUSTOMER_TOKEN, Constants.LOG_INFO, customerId, '', `${setCustomFieldResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_CUSTOMER_TOKEN, Constants.LOG_ERROR, customerId, CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
  return setCustomFieldResponse;
};

/**
 * Retrieves customer by custom field name and value.
 * 
 * @param {string} customFieldName - Name of the custom field.
 * @param {string} customFieldValue - Value of the custom field.
 * @returns {Promise<any>} - Response containing the customer object.
 */
const retrieveCustomerByCustomField = async (customFieldName: string, customFieldValue: string) => {
  let retrieveCustomerByCustomObjectResponse;
  if (client) {
    const requestBuilder = createRequestBuilder({
      projectKey: process.env.CT_PROJECT_KEY,
    });
    if (customFieldName && customFieldValue) {
      const query = `custom(fields(${customFieldName} = "${customFieldValue}"))`;
      const uri = await requestBuilder.customers.where(query).build();
      const channelsRequest = {
        uri: uri,
        method: 'GET',
      };
      retrieveCustomerByCustomObjectResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_RETRIEVE_CUSTOMER_BY_CUSTOM_FIELD, Constants.LOG_INFO, '', '', `${retrieveCustomerByCustomObjectResponse.consolidatedTime}`);
    }
  } else {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_RETRIEVE_CUSTOMER_BY_CUSTOM_FIELD, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
  }
  return retrieveCustomerByCustomObjectResponse;
};

/**
 * Retrieves discount by its ID.
 * 
 * @param {string} discountId - The ID of the discount.
 * @returns {Promise<any>} - The response containing the discount information.
 */
const getDiscountCodes = async (discountId: string) => {
  let getDiscountResponse = null;
  if (discountId) {
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.discountCodes.byId(discountId).build();
      const channelsRequest = {
        uri: uri,
        method: 'GET',
      };
      getDiscountResponse = await makeCommercetoolsRequest(channelsRequest);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_RETRIEVE_CUSTOMER_BY_CUSTOM_FIELD, Constants.LOG_INFO, '', '', `${getDiscountResponse.consolidatedTime}`);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_DISCOUNT_CODES, Constants.LOG_ERROR, discountId || '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  }
  return getDiscountResponse;
};

/**
 * Fetches all payment records from the commercetools platform, sorted by last modified date in descending order.
 * 
 * @async
 * @function getAllPayments
 * @returns {Promise<Object|null>} Returns the response object containing all payment records, or null if the request fails.
 * 
 * Logs an error if unable to connect to the commercetools client.
 * */
const getAllPayments = async () => {
  let getAllPaymentsResponse = null;
  const client = getClient();
  if (client) {
    const requestBuilder = createRequestBuilder({
      projectKey: process.env.CT_PROJECT_KEY,
    });
    const uri = requestBuilder.payments.parse({ sort: [{ by: Constants.LAST_MODIFIED_AT, direction: Constants.DESC_ORDER }] }).build()
    const channelsRequest = {
      uri: uri,
      method: 'GET',
    };
    const getAllPaymentsResponseObject = await client.execute(channelsRequest);
    if (getAllPaymentsResponseObject?.body) {
      getAllPaymentsResponse = getAllPaymentsResponseObject.body;
    }
  } else {
    paymentUtils.logData(__filename, 'FuncGetAllPayments', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT);
  }
  return getAllPaymentsResponse;
}
export default {
  queryCartById,
  queryOrderById,
  retrievePayment,
  addTransaction,
  getOrders,
  updateCartByPaymentId,
  setCustomerTokens,
  getCustomer,
  getCustomType,
  setCustomType,
  updateDecisionSync,
  syncVisaCardDetails,
  syncAddTransaction,
  addCustomTypes,
  addExtensions,
  addCustomField,
  updateAvailableAmount,
  getCartById,
  addCustomerAddress,
  changeTransactionInteractionId,
  createCTCustomObject,
  retrieveCustomObjectByContainer,
  updateCustomerToken,
  retrieveCustomerByCustomField,
  getDiscountCodes,
  getAllPayments
};
