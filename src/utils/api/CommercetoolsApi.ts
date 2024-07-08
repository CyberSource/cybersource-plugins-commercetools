import path from 'path';

import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import fetch from 'node-fetch';

import { Constants } from '../../constants';
import { Address } from '../../models/AddressModel';
import { ActionType, AddressType, CardAddressGroupType, CustomerType, PaymentTransactionType, PaymentType, ReportSyncType, VisaUpdateType } from '../../types/Types';

import paymentUtils from './../PaymentUtils';
type createClient = typeof createClient;
type createHttpMiddleware = typeof createHttpMiddleware;

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
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetClient', Constants.EXCEPTION_MSG_COMMERCETOOLS_CONNECT, exception, '', '', '');
  }
  return client;
};

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
  try {
    if (id && idType) {
      const client = getClient();
      if (client && process.env.CT_PROJECT_KEY) {
        const requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        if (Constants.ANONYMOUS_ID === idType) {
          uri = requestBuilder.carts.parse({ where: [`${Constants.ANONYMOUS_ID} = "${id}"`, `${Constants.ACTIVE_CART_STATE}`], sort: [{ by: Constants.LAST_MODIFIED_AT, direction: Constants.DESC_ORDER }] }).build();
          logIdType = 'Anonymous Id : ';
        } else if (Constants.CUSTOMER_ID === idType) {
          uri = requestBuilder.carts.parse({ where: [`${Constants.CUSTOMER_ID} = "${id}"`, `${Constants.ACTIVE_CART_STATE}`], sort: [{ by: Constants.LAST_MODIFIED_AT, direction: Constants.DESC_ORDER }] }).build();
          logIdType = 'Customer Id : ';
        } else if (Constants.PAYMENT_ID === idType) {
          uri = requestBuilder.carts.parse({ where: [`paymentInfo(payments(id="${id}"))`] }).build();
          logIdType = 'Payment Id : ';
        }
        const channelsRequest = {
          uri: uri,
          method: 'GET',
        };
        const retrieveCartByIdResponseObject = await client.execute(channelsRequest);
        if (retrieveCartByIdResponseObject?.body && Constants.HTTP_OK_STATUS_CODE === retrieveCartByIdResponseObject?.statusCode) {
          retrieveCartByIdResponse = retrieveCartByIdResponseObject.body;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncQueryCartById', Constants.LOG_INFO, logIdType + id, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncQueryCartById', Constants.LOG_INFO, logIdType + id, Constants.ERROR_MSG_CART_DETAILS);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncQueryCartById', Constants.EXCEPTION_MSG_CART_DETAILS, exception, id, logIdType, '');
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
  try {
    if (id && idType) {
      const client = getClient();
      if (client) {
        const requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        if (Constants.CART_ID === idType) {
          uri = requestBuilder.orders.parse({ where: [`cart(id="${id}")`] }).build();
          logIdType = 'CartId : ';
        } else if (Constants.PAYMENT_ID === idType) {
          uri = requestBuilder.orders.parse({ where: [`paymentInfo(payments(id="${id}"))`] }).build();
          logIdType = 'PaymentId : ';
        } else if (Constants.CUSTOMER_ID === idType) {
          const filterDate = new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString();
          uri = requestBuilder.orders.where(`customerId="${id}" and createdAt >= "${filterDate}"`).build();
          logIdType = 'CustomerId : ';
        }
        const channelsRequest = {
          uri: uri,
          method: 'GET',
        };
        queryOrderByIdResponse = await client.execute(channelsRequest);
        if (queryOrderByIdResponse?.body) {
          queryOrderByIdResponse = queryOrderByIdResponse.body;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncQueryOrderById', Constants.LOG_INFO, logIdType + id, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncQueryOrderById', Constants.LOG_INFO, logIdType + id, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncQueryOrderById', Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS, exception, id, logIdType, '');
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
  let retrievePaymentResponse: PaymentType | null = null;
  try {
    const client = getClient();
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.payments.byId(paymentId).build();
      const channelsRequest = {
        uri: uri,
        method: 'GET',
      };
      const retrievePaymentResponseObject = await client.execute(channelsRequest);
      if (retrievePaymentResponseObject?.body) {
        retrievePaymentResponse = retrievePaymentResponseObject.body;
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRetrievePayment', Constants.LOG_INFO, 'PaymentId : ' + paymentId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncRetrievePayment', Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS, exception, paymentId, 'PaymentId : ', '');
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
const addTransaction = async (transactionObject: PaymentTransactionType, paymentId: string): Promise<PaymentType | null> => {
  let addTransactionResponse: PaymentType | null = null;
  try {
    if (transactionObject && paymentId) {
      const client = getClient();
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
                  timestamp: new Date(Date.now()).toISOString(),
                  amount: transactionObject.amount,
                  state: transactionObject.state,
                },
              },
            ],
          }),
        };
        const addTransactionResponseObject = await client.execute(channelsRequest);
        if (addTransactionResponseObject?.body) {
          addTransactionResponse = addTransactionResponseObject.body;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddTransaction', Constants.LOG_INFO, 'PaymentId : ' + paymentId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAddTransaction', Constants.EXCEPTION_MSG_ADD_TRANSACTION, exception, paymentId, 'PaymentId : ', '');
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
  let getOrderResponseBody = null;
  try {
    const client = getClient();
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.payments.parse({ sort: [{ by: Constants.LAST_MODIFIED_AT, direction: Constants.DESC_ORDER }] }).build();
      const channelsRequest = {
        uri: uri,
        method: 'GET',
      };
      getOrderResponse = await client.execute(channelsRequest);
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetOrders', Constants.LOG_INFO, '', Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetOrders', Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS, exception, '', '', '');
  }
  if (getOrderResponse?.body) {
    getOrderResponseBody = getOrderResponse.body;
  }
  return getOrderResponseBody;
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
const updateCartByPaymentId = async (cartId: string, paymentId: string, cartVersion: number, addressData: CardAddressGroupType): Promise<any> => {
  let updateCartByPaymentIdResponse = null;
  const actions: ActionType[] = [];
  try {
    if (cartId && 0 < cartVersion && addressData && Object.keys(addressData).length) {
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
      if (addressData?.shipTo && Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING) {
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
      if (actions && 0 !== actions.length) {
        const client = getClient();
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
          const updateCartByPaymentIdResponseObject = await client.execute(channelsRequest);
          if (updateCartByPaymentIdResponseObject?.body) {
            updateCartByPaymentIdResponse = updateCartByPaymentIdResponseObject.body;
          }
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateCartByPaymentId', Constants.LOG_INFO, 'PaymentId : ' + paymentId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateCartByPaymentId', Constants.LOG_INFO, 'PaymentId : ' + paymentId, Constants.ERROR_MSG_UPDATE_CART);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateCartByPaymentId', Constants.LOG_INFO, 'PaymentId : ' + paymentId, Constants.ERROR_MSG_EMPTY_CART);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncUpdateCartByPaymentId', Constants.EXCEPTION_MSG_CART_UPDATE, exception, paymentId, 'PaymentId : ', '');
  }
  return updateCartByPaymentIdResponse;
};

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
  let failedTokens: string[] = [];
  let customTypePresent = false;
  try {
    if (paymentInstrumentId && instrumentIdentifier && updatePaymentObj?.customer?.id && updatePaymentObj?.custom?.fields) {
      const customerId = updatePaymentObj.customer.id;
      const customFields = updatePaymentObj?.custom?.fields;
      const customerInfo = await getCustomer(customerId);
      if (customerInfo) {
        customTypePresent = (customerInfo?.custom?.type?.id) ? true : false;
        const tokenData = {
          alias: customFields.isv_tokenAlias,
          value: tokenCustomerId,
          paymentToken: paymentInstrumentId,
          instrumentIdentifier: instrumentIdentifier,
          cardType: customFields.isv_cardType,
          cardName: customFields.isv_cardType,
          cardNumber: customFields.isv_maskedPan,
          cardExpiryMonth: customFields.isv_cardExpiryMonth,
          cardExpiryYear: customFields.isv_cardExpiryYear,
          addressId: addressId,
          timeStamp: new Date(Date.now()).toISOString(),
        };
        const stringTokenData = JSON.stringify(tokenData);
        if (customTypePresent) {
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
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSetCustomerTokens', Constants.LOG_INFO, 'CustomerId : ' + updatePaymentObj?.customer?.id, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    let customerId = updatePaymentObj?.customer?.id ? updatePaymentObj?.customer?.id : '';
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncSetCustomerTokens', Constants.EXCEPTION_MSG_CUSTOMER_UPDATE, exception, customerId, 'CustomerId : ', '');
  }
  return setCustomerTokensResponse;
};

/**
 * Retrieves customer information by ID.
 * 
 * @param {string} customerId - The ID of the customer.
 * @returns {Promise<CustomerType | null>} - The response containing customer information.
 */
const getCustomer = async (customerId: string): Promise<CustomerType | null> => {
  let getCustomerResponse: CustomerType | null = null;
  try {
    if (customerId) {
      const client = getClient();
      if (client) {
        const requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        const uri = requestBuilder.customers.byId(customerId).build();
        const channelsRequest = {
          uri: uri,
          method: 'GET',
        };
        const getCustomerResponseObject = await client.execute(channelsRequest);
        if (getCustomerResponseObject?.body) {
          getCustomerResponse = getCustomerResponseObject.body;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetCustomer', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetCustomer', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_CUSTOMER_DETAILS);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetCustomer', Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS, exception, customerId, 'CustomerId : ', '');
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
const updateDecisionSync = async (decisionUpdateObject: PaymentTransactionType, transactionId: string) => {
  try {
    if (decisionUpdateObject) {
      const client = getClient();
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
        await client.execute(channelsRequest);
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateDecisionSync', Constants.LOG_INFO, 'PaymentId : ' + decisionUpdateObject?.id, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    }
  } catch (exception) {
    if (decisionUpdateObject?.id) {
      paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncUpdateDecisionSync', Constants.EXCEPTION_MSG_DECISION_SYNC, exception, decisionUpdateObject?.id, 'PaymentId : ', '');
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
  let syncVisaCardDetailsResponse: PaymentType | null = null;
  try {
    if (visaUpdateObject && visaUpdateObject?.id) {
      const client = getClient();
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
        const syncVisaCardDetailsResponseObject = await client.execute(channelsRequest);
        if (syncVisaCardDetailsResponseObject?.body) {
          syncVisaCardDetailsResponse = syncVisaCardDetailsResponseObject.body;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSyncVisaCardDetails', Constants.LOG_INFO, 'PaymentId : ' + visaUpdateObject?.id, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSyncVisaCardDetails', Constants.LOG_INFO, 'PaymentId : ' + visaUpdateObject?.id, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncSyncVisaCardDetails', Constants.EXCEPTION_MSG_SYNC_DETAILS, exception, visaUpdateObject?.id, 'PaymentId : ', '');
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
  let syncAddTransactionResponse: PaymentType | null = null;
  let channelsRequest = null;
  try {
    if (syncUpdateObject) {
      const client = getClient();
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
                    timestamp: new Date(Date.now()).toISOString(),
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
                    timestamp: new Date(Date.now()).toISOString(),
                    amount: syncUpdateObject.amountPlanned,
                    state: syncUpdateObject.state,
                    interactionId: syncUpdateObject.interactionId,
                  },
                },
              ],
            }),
          };
        }
        const syncAddTransactionResponseObject = await client.execute(channelsRequest);
        if (syncAddTransactionResponseObject?.body) {
          syncAddTransactionResponse = syncAddTransactionResponseObject.body;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSyncAddTransaction', Constants.LOG_INFO, 'PaymentId : ' + syncUpdateObject.id, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSyncAddTransaction', Constants.LOG_INFO, 'PaymentId : ', Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    let paymentId = syncUpdateObject?.id ? syncUpdateObject?.id : '';
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncSyncAddTransaction', Constants.EXCEPTION_MSG_SYNC_DETAILS, exception, paymentId, 'PaymentId : ', '');
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
    const client = getClient();
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
      addCustomTypeResponse = await client.execute(channelsRequest);
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddCustomTypes', Constants.LOG_INFO, '', Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAddCustomTypes', Constants.EXCEPTION_MSG_CUSTOM_TYPE, exception, '', '', customType.key);
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
  try {
    const client = getClient();
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
      addExtensionsResponse = await client.execute(channelsRequest);
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddExtensions', Constants.LOG_INFO, '', Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAddExtensions', Constants.EXCEPTION_MSG_ADD_EXTENSION, exception, '', '', extension.key);
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
  try {
    if (key) {
      const client = getClient();
      if (client) {
        const requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        const uri = requestBuilder.types.byKey(key).build();
        const channelsRequest = {
          uri: uri,
          method: 'GET',
        };
        getCustomTypeResponse = await client.execute(channelsRequest);
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetCustomType', Constants.LOG_INFO, '', Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetCustomType', Constants.EXCEPTION_MSG_CUSTOM_TYPE, exception, '', '', key);
    getCustomTypeResponse = exception;
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
const setCustomType = async (customerId: string | undefined, fieldsData: string[], failedTokenData: string[] | undefined, customerTokenId?: string): Promise<CustomerType | null> => {
  let setCustomTypeResponse: CustomerType | null = null;
  try {
    if (customerId) {
      const client = getClient();
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
        const setCustomTypeResponseObject = await client.execute(channelsRequest);
        if (setCustomTypeResponseObject?.body) {
          setCustomTypeResponse = setCustomTypeResponseObject.body;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSetCustomType', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSetCustomType', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_CREATE_CUSTOM_TYPE);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncSetCustomType', Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS, exception, customerId || '', 'CustomerId : ', '');
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
  let changeTransactionInteractionIdResponse: PaymentType | null = null;
  try {
    if (transactionObj) {
      const client = getClient();
      if (null != client) {
        const requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        const uri = requestBuilder.payments.byId(transactionObj.paymentId).build();
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
        const changeTransactionInteractionIdResponseObject = await client.execute(channelsRequest);
        if (changeTransactionInteractionIdResponseObject?.body) {
          changeTransactionInteractionIdResponse = changeTransactionInteractionIdResponseObject.body;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncChangeTransactionInteractionId', Constants.LOG_INFO, 'PaymentId : ' + transactionObj?.id, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncChangeTransactionInteractionId', Constants.LOG_INFO, 'PaymentId : ' + transactionObj.id, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncChangeTransactionInteractionId', Constants.EXCEPTION_MSG_CHANGE_TRANSACTION_INTERACTION_ID, exception, transactionObj?.paymentId, 'PaymentId : ', '');
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
  try {
    if (typeId && version && fieldDefinition) {
      const client = getClient();
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
        addCustomFieldResponse = await client.execute(channelsRequest);
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddCustomField', Constants.LOG_INFO, '', Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddCustomField', Constants.LOG_INFO, '', Constants.ERROR_MSG_UPDATE_CUSTOM_TYPE);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAddCustomField', Constants.EXCEPTION_MSG_ADDING_CUSTOM_FIELD, exception, '', '', '');
  }
  if (addCustomFieldResponse?.body) {
    addCustomFieldResponse = addCustomFieldResponse.body;
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
  try {
    if (paymentId && version && transactionId && 0 <= pendingAmount) {
      const client = getClient();
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
        updateAvailableAmountResponse = await client.execute(channelsRequest);
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateAvailableAmount', Constants.LOG_INFO, '', Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateAvailableAmount', Constants.LOG_INFO, 'PaymentId : ' + paymentId, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncUpdateAvailableAmount', Constants.EXCEPTION_MSG_CUSTOM_TYPE, exception, paymentId, 'PaymentId : ', '');
  }
  if (updateAvailableAmountResponse?.body) {
    updateAvailableAmountResponse = updateAvailableAmountResponse.body;
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
  try {
    if (cartId) {
      const client = getClient();
      if (client) {
        const requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        const uri = requestBuilder.carts.byId(cartId).build();
        const channelsRequest = {
          uri: uri,
          method: 'GET',
        };
        getCartByIdResponse = await client.execute(channelsRequest);
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRetrieveCartByAnonymousId', Constants.LOG_INFO, 'CartId : ' + cartId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRetrieveCartByAnonymousId', Constants.LOG_INFO, 'CartId : ' + cartId, Constants.ERROR_MSG_CART_DETAILS);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncRetrieveCartByAnonymousId', Constants.EXCEPTION_MSG_CART_DETAILS, exception, cartId, 'CartId : ', '');
  }
  if (getCartByIdResponse?.body) {
    getCartByIdResponse = getCartByIdResponse.body;
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
const addCustomerAddress = async (customerId: string, addressObj: AddressType) => {
  const actions: ActionType[] = [];
  let addCustomerAddressResponse: CustomerType | null = null;
  let customerData: CustomerType | null = null;
  try {
    if (customerId) {
      customerData = await getCustomer(customerId);
      if (customerData) {
        actions.push({
          action: 'addAddress',
          address: new Address(addressObj)
        });
        if (actions && 0 < actions.length) {
          const client = getClient();
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
            const customerResponseObject = await client.execute(channelsRequest);
            if (customerResponseObject?.body) {
              addCustomerAddressResponse = customerResponseObject;
            }
          } else {
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddCustomerAddress', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
          }
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddCustomerAddress', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_CUSTOMER_UPDATE);
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddCustomerAddress', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_CUSTOMER_DETAILS);
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAddCustomerAddress', Constants.EXCEPTION_MSG_CUSTOMER_UPDATE_ADDRESS, exception, customerId, 'CustomerId : ', '');
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
  try {
    const client = getClient();
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
      setCustomObjectResponse = await client.execute(channelsRequest);
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncCreateCTCustomObject', Constants.LOG_INFO, '', Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncCreateCTCustomObject', Constants.EXCEPTION_MSG_CUSTOM_TYPE, exception, '', '', '');
    setCustomObjectResponse = exception;
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
  try {
    const client = getClient();
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });

      const uri = requestBuilder.customObjects.where(`container="${container}"`).build();
      const channelsRequest = {
        uri: uri,
        method: 'GET',
      };
      getCustomObjectsResponse = await client.execute(channelsRequest);
      if (getCustomObjectsResponse?.body) {
        getCustomObjectsResponse = getCustomObjectsResponse.body;
      }
    }
  } catch (exception) {
    getCustomObjectsResponse = exception;
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
const updateCustomerToken = async (updateObject: any, customerObject: CustomerType, failedTokens: any, customerTokenId: string | null) => {
  let setCustomFieldResponse: any;
  let actions = [];
  try {
    if (customerObject) {
      const client = getClient();
      if (client) {
        const requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        if (failedTokens) {
          actions.push({
            action: 'setCustomField',
            name: 'isv_failedTokens',
            value: failedTokens,
          });
        }
        if (customerTokenId) {
          actions.push({
            action: 'setCustomField',
            name: 'isv_customerId',
            value: customerTokenId
          });
        }
        if (updateObject) {
          actions.push({
            action: 'setCustomField',
            name: 'isv_tokens',
            value: updateObject,
          });
        }
        if (customerObject?.custom?.fields?.isv_tokenAction) {
          actions.push({
            action: 'setCustomField',
            name: 'isv_tokenAction',
            value: null,
          });
        }
        if (customerObject?.custom?.fields?.isv_cardNewExpiryMonth) {
          actions.push({
            action: 'setCustomField',
            name: 'isv_cardNewExpiryMonth',
            value: null,
          });
        }
        if (customerObject?.custom?.fields?.isv_cardNewExpiryYear) {
          actions.push({
            action: 'setCustomField',
            name: 'isv_cardNewExpiryYear',
            value: null,
          });
        }
        const uri = requestBuilder.customers.byId(customerObject.id).build();
        const channelsRequest = {
          uri: uri,
          method: 'POST',
          body: JSON.stringify({
            version: customerObject.version,
            actions: actions,
          }),
        };
        setCustomFieldResponse = await client.execute(channelsRequest);
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateCustomerToken', Constants.LOG_INFO, '', Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncUpdateCustomerToken', Constants.EXCEPTION_MSG_CUSTOM_TYPE, exception, '', '', '');
    setCustomFieldResponse = exception;
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
  try {
    const client = getClient();
    if (client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      if (customFieldName && customFieldValue) {
        const query = `custom(fields(${customFieldName}="${customFieldValue}"))`;
        const uri = await requestBuilder.customers.where(query).build();
        const channelsRequest = {
          uri: uri,
          method: 'GET',
        };
        retrieveCustomerByCustomObjectResponse = await client.execute(channelsRequest);
        if (retrieveCustomerByCustomObjectResponse?.body) {
          retrieveCustomerByCustomObjectResponse = retrieveCustomerByCustomObjectResponse.body;
        }
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRetrieveCustomerByCustomField', Constants.LOG_INFO, '', Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncRetrieveCustomerByCustomField', 'An exception occurred while fetching customer object', exception, '', '', '');
    retrieveCustomerByCustomObjectResponse = exception;
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
  try {
    if (null !== discountId) {
      const client = getClient();
      if (null !== client) {
        const requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        const uri = requestBuilder.discountCodes.byId(discountId).build()
        const channelsRequest = {
          uri: uri,
          method: 'GET',
        };
        const getDiscountResponseObject = await client.execute(channelsRequest);
        if (getDiscountResponseObject?.body) {
          getDiscountResponse = getDiscountResponseObject?.body;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetDiscountCodes', Constants.LOG_INFO, 'DiscountCodeId : ' + discountId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetDiscountCodes', Constants.LOG_INFO, 'DiscountCodeId : ' + discountId, Constants.ERROR_MSG_DISCOUNT_DETAILS);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetDiscountCodes', Constants.EXCEPTION_MSG_FETCH_DISCOUNT_DETAILS, exception, discountId, 'DiscountCodeId : ', '');
  }
  return getDiscountResponse;
};

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
  getDiscountCodes
};
