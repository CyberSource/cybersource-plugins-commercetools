import { ByProjectKeyRequestBuilder, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  _BaseAddress, ApiRequest, CartUpdateAction,
  Customer, CustomerUpdateAction, CustomObjectDraft,
  ExtensionDraft, OrderPagedQueryResponse, Payment,
  PaymentAddTransactionAction, PaymentPagedQueryResponse,
  PaymentUpdateAction, TypeDraft
} from '@commercetools/platform-sdk';
import { type AuthMiddlewareOptions, ClientBuilder, type HttpMiddlewareOptions } from '@commercetools/ts-client';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import { Address } from '../../models/AddressModel';
import { Token } from '../../models/TokenModel';
import { AmountPlannedType, CardAddressGroupType, PaymentTransactionType, ReportSyncType, VisaUpdateType } from '../../types/Types';
import { ApiError, errorHandler, PaymentProcessingError } from '../ErrorHandler';
import paymentUtils from '../PaymentUtils';
dotenv.config();

const projectKey = process.env.CT_PROJECT_KEY || '';
const clientId = process.env.CT_CLIENT_ID || '';
const clientSecret = process.env.CT_CLIENT_SECRET || '';
const authHost = process.env.CT_AUTH_HOST || '';
const apiHost = process.env.CT_API_HOST || '';

const getClient = async () => {
  let client: ByProjectKeyRequestBuilder | null = null;
  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: apiHost,
    httpClient: fetch,
  };
  const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: authHost,
    projectKey: projectKey,
    credentials: {
      clientId: clientId,
      clientSecret: clientSecret,
    },
    httpClient: fetch,
  };
  try {
    const ctpClient = new ClientBuilder()
      .withProjectKey(projectKey)
      .withClientCredentialsFlow(authMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();
    return createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
  } catch (error) {
    errorHandler.logError(new ApiError(CustomMessages.EXCEPTION_MSG_COMMERCETOOLS_CONNECT, error, FunctionConstant.FUNC_INITIALIZE_COMMERCETOOLS_CLIENT), __filename, '');
  }
  return client;
}

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
const makeCommercetoolsRequest = async (query: any) => {
  let clientResponse: any = {};
  const startTime = new Date().getTime();
  const clientResponseObject = await query.execute();;
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
  let query;
  let logIdType = '';
  let queryCartByIdResponse = null;
  const client = await getClient();
  if (id && idType && client) {
    switch (idType) {
      case Constants.ANONYMOUS_ID:
        query = client
          .carts()
          .get({
            queryArgs: {
              where: `${Constants.ANONYMOUS_ID}="${id}" AND ${Constants.ACTIVE_CART_STATE}`,
              sort: `${Constants.LAST_MODIFIED_AT} ${Constants.DESC_ORDER}`,
            },
          });
        logIdType = 'Anonymous Id: ';
        break;
      case Constants.CUSTOMER_ID:
        query = client
          .carts()
          .get({
            queryArgs: {
              where: `${Constants.CUSTOMER_ID}="${id}" AND ${Constants.ACTIVE_CART_STATE}`,
              sort: `${Constants.LAST_MODIFIED_AT} ${Constants.DESC_ORDER}`,
            },
          });
        logIdType = 'Customer Id: ';
        break;
      case Constants.PAYMENT_ID:
        query = client
          .carts()
          .get({
            queryArgs: {
              where: `paymentInfo(payments(id="${id}"))`,
            },
          });
        logIdType = 'Payment Id: ';
        break;
      default:
        return null;
    }
    queryCartByIdResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(
      __filename,
      FunctionConstant.FUNC_QUERY_CART_BY_ID,
      Constants.LOG_INFO,
      logIdType + id,
      '',
      `${queryCartByIdResponse.consolidatedTime}`
    );
  }
  return queryCartByIdResponse;
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
  let query: ApiRequest<OrderPagedQueryResponse>;
  let logIdType = '';
  const client = await getClient();
  if (id && idType && client) {
    switch (idType) {
      case Constants.CART_ID:
        query = client.orders().get({ queryArgs: { where: [`cart(id="${id}")`] } });
        logIdType = 'CartId : ';
        break;
      case Constants.PAYMENT_ID:
        query = client.orders().get({ queryArgs: { where: [`paymentInfo(payments(id="${id}"))`] } });
        logIdType = 'PaymentId : ';
        break;
      default:
        return null;
    }
    queryOrderByIdResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_QUERY_ORDER_BY_ID, Constants.LOG_INFO, logIdType + id || '', '', `${queryOrderByIdResponse.consolidatedTime}`);
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
  const client = await getClient();
  if (paymentId && client) {
    try {
      const query = client.payments().withId({ ID: paymentId }).get();
      retrievePaymentResponse = await makeCommercetoolsRequest(query);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_RETRIEVE_PAYMENT, Constants.LOG_INFO, '', '', `${retrievePaymentResponse.consolidatedTime}`);
    } catch (exception: any) {
      if (typeof exception === Constants.STR_OBJECT && exception.message) {
        errorHandler.logError(new PaymentProcessingError(exception.message, exception, FunctionConstant.FUNC_RETRIEVE_PAYMENT), __filename, '');
      } else {
        errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_COMMERCETOOLS_CONNECT, exception, FunctionConstant.FUNC_RETRIEVE_PAYMENT), __filename, '');
      }
    }
  }
  return retrievePaymentResponse;
};

/**
 * Adds a transaction to a payment.
 * 
 * @param {PaymentTransactionType} transactionObject - The transaction object to add.
 * @param {string} paymentId - The ID of the payment.
 * @returns {Promise<Payment | null>} - The updated payment with the added transaction.
 */
const addTransaction = async (transactionObject: Partial<PaymentTransactionType>, paymentId: string): Promise<Payment | null> => {
  let addTransactionResponse = null;
  const client = await getClient();
  if (transactionObject && paymentId && client) {
    const query = client.payments().withId({ ID: paymentId }).post({
      body: {
        version: transactionObject.version as number,
        actions: [
          {
            action: 'addTransaction',
            transaction: {
              type: transactionObject.type as string,
              timestamp: paymentUtils.getDate(Date.now(), true),
              amount: transactionObject.amount as AmountPlannedType,
              state: transactionObject.state,
            },
          },
        ],
      }
    });
    addTransactionResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_RETRIEVE_PAYMENT, Constants.LOG_INFO, '', '', `${addTransactionResponse.consolidatedTime}`);
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
  const client = await getClient();
  if (client) {
    const query = client.payments().get({
      queryArgs: {
        sort: `${Constants.LAST_MODIFIED_AT} ${Constants.DESC_ORDER}`,
      },
    });
    getOrderResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_ORDERS, Constants.LOG_INFO, '', '', `${getOrderResponse.consolidatedTime} `);
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
  let actions: CartUpdateAction[] = [];
  const client = await getClient();
  if (cartId && cartVersion && addressData && Object.keys(addressData).length && client) {
    if (addressData?.billToFieldGroup && Object.keys(addressData.billToFieldGroup).length) {
      actions.push({
        action: 'setBillingAddress',
        address: new Address(addressData.billToFieldGroup) as _BaseAddress
      });
    }
    if (addressData?.shipToFieldGroup && 0 !== Object.keys(addressData.shipToFieldGroup).length) {
      if (!addressData?.shipToFieldGroup?.email) {
        const cartData = await queryCartById(paymentId, Constants.PAYMENT_ID);
        addressData.shipToFieldGroup.email = cartData?.results[0]?.shippingAddress?.email;
      }
      actions.push({
        action: 'setShippingAddress',
        address: new Address(addressData.shipToFieldGroup) as _BaseAddress,
      });
    }
    if (addressData?.billTo && Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE) {
      actions.push({
        action: 'setBillingAddress',
        address: new Address(addressData.billTo) as _BaseAddress,
      });
    }
    if (addressData?.shipTo && paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING)) {
      const cartDetail = await getCartById(cartId);
      if (cartDetail) {
        if ('Single' === cartDetail.shippingMode) {
          actions.push({
            action: 'setShippingAddress',
            address: new Address(addressData.shipTo) as _BaseAddress,
          })
        }
      }
    }
    if (actions && actions.length) {
      const query = client.carts().withId({ ID: cartId }).post({
        body: {
          version: cartVersion,
          actions: actions,
        },
      });
      updateCartByPaymentIdResponse = await makeCommercetoolsRequest(query);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, 'CartId: ' + cartId || '', '', `${updateCartByPaymentIdResponse.consolidatedTime} `);
    }
  }
  return updateCartByPaymentIdResponse;
};

/**
 * Sets customer tokens.
 * 
 * @param {string} tokenCustomerId - The ID of the token customer.
 * @param {string} paymentInstrumentId - The ID of the payment instrument.
 * @param {string} instrumentIdentifier - The identifier of the instrument.
 * @param {Payment} updatePaymentObj - The payment object to update.
 * @param {string} addressId - The ID of the address.
 * @returns {Promise<any>} - The response after setting customer tokens.
 */
const setCustomerTokens = async (tokenCustomerId: string, paymentInstrumentId: string, instrumentIdentifier: string, updatePaymentObj: Payment, addressId: string): Promise<any> => {
  let setCustomerTokensResponse = null;
  let isCustomTypePresent = false;
  let failedTokens: string[] = [];
  const client = await getClient();
  if (paymentInstrumentId && instrumentIdentifier && updatePaymentObj?.customer?.id && updatePaymentObj?.custom?.fields && client) {
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
          const mappedTokens = isvTokens.map((item: any) => item);
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
 * @returns {Promise<Customer| null>} - The response containing customer information.
 */
const getCustomer = async (customerId: string): Promise<Customer | null> => {
  let getCustomerResponse = null;
  const client = await getClient();
  if (customerId && client) {
    const query = client.customers().withId({ ID: customerId }).get();
    getCustomerResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CUSTOMER, Constants.LOG_INFO, 'CustomerId : ' + customerId, '', `${getCustomerResponse.consolidatedTime} `);
  }
  return getCustomerResponse;
};

/**
 * Updates a payment transaction's state synchronously.
 * 
 * @param {Partial<PaymentTransactionType>} decisionUpdateObject - The object containing payment transaction details.
 * @param {string} transactionId - The ID of the transaction to update.
 * @returns {Promise<void>}
 */
const updateDecisionSync = async (decisionUpdateObject: Partial<PaymentTransactionType>, transactionId: string): Promise<void> => {
  const client = await getClient();
  if (decisionUpdateObject && decisionUpdateObject?.id && client) {
    const query = client.payments().withId({ ID: decisionUpdateObject.id }).post({
      body: {
        version: decisionUpdateObject.version as number,
        actions: [
          {
            action: Constants.CHANGE_TRANSACTION_STATE,
            transactionId: transactionId,
            state: decisionUpdateObject.state as string,
          },
        ],
      },
    });
    const decisionSyncResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_INFO, 'PaymentId : ' + decisionUpdateObject?.id, '', `${decisionSyncResponse.consolidatedTime} `);
  }
};

/**
 * Syncs Visa card details for a payment.
 * 
 * @param {VisaUpdateType} visaUpdateObject - Object containing Visa card update details.
 * @returns {Promise<Payment | null>} - Updated payment object.
 */
const syncVisaCardDetails = async (visaUpdateObject: VisaUpdateType): Promise<Payment | null> => {
  const client = await getClient();
  let syncVisaCardDetailsResponse = null;
  if (visaUpdateObject && visaUpdateObject?.id && client) {
    const query = client.payments().withId({ ID: visaUpdateObject.id }).post({
      body: {
        version: visaUpdateObject.version,
        actions: visaUpdateObject.actions as PaymentUpdateAction[],
      }
    });
    syncVisaCardDetailsResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_SYNC_VISA_CARD_DETAILS, Constants.LOG_INFO, 'PaymentId : ' + visaUpdateObject?.id, '', `${syncVisaCardDetailsResponse.consolidatedTime} `);
  }
  return syncVisaCardDetailsResponse;
};

/**
 * Syncs additional transaction details for a payment.
 * 
 * @param {ReportSyncType} syncUpdateObject - Object containing transaction details to sync.
 * @returns {Promise<Payment | null>} - Updated payment object.
 */
const syncAddTransaction = async (syncUpdateObject: ReportSyncType): Promise<Payment | null> => {
  let syncAddTransactionResponse = null;
  const client = await getClient();
  const addTransactionAction: (PaymentUpdateAction | PaymentAddTransactionAction)[] = [];
  if (syncUpdateObject && syncUpdateObject.id && client) {
    addTransactionAction.push({
      action: 'addTransaction',
      transaction: {
        type: syncUpdateObject.type as string,
        timestamp: paymentUtils.getDate(Date.now(), true),
        amount: syncUpdateObject.amountPlanned,
        state: syncUpdateObject.state,
        interactionId: syncUpdateObject.interactionId,
      },
    });
    const query = client.payments().withId({ ID: syncUpdateObject.id }).post({
      body: {
        version: syncUpdateObject.version as number,
        actions: addTransactionAction
      }
    });
    syncAddTransactionResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_SYNC_ADD_TRANSACTION, Constants.LOG_INFO, 'PaymentId : ' + syncUpdateObject?.id, '', `${syncAddTransactionResponse.consolidatedTime} `);
  }
  return syncAddTransactionResponse;
};

/**
 * Adds custom types to the CommerceTools project.
 * 
 * @param {TypeDraft} customType - Custom type object to add.
 * @returns {Promise<any>} - Response of the add custom type operation.
 */
const addCustomTypes = async (customType: TypeDraft): Promise<any> => {
  let addCustomTypeResponse;
  let data: any;
  try {
    const client = await getClient();
    if (client) {
      const query = client.types().post({
        body: customType
      });
      const startTime = new Date().getTime();
      addCustomTypeResponse = await query.execute();
      const endTime = new Date().getTime();
      paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_CUSTOM_TYPES, Constants.LOG_INFO, '', '', `${endTime - startTime} `);
    }
  } catch (exception: any) {
    data = exception;
    errorHandler.logError(errorHandler.createErrorFromHttpStatus(data?.statusCode, CustomMessages.EXCEPTION_MSG_CUSTOM_TYPE, exception, FunctionConstant.FUNC_ADD_CUSTOM_TYPE), __filename, '');
    if (Constants.HTTP_BAD_REQUEST_STATUS_CODE === data.statusCode && Constants.HTTP_BAD_REQUEST_STATUS_CODE === data?.body?.statusCode && Constants.STRING_DUPLICATE_FIELD === data?.body?.errors[0]?.code) {
      addCustomTypeResponse = data;
    }
  }
  return addCustomTypeResponse;
};

/**
 * Adds extensions to the CommerceTools project.
 * 
 * @param {ExtensionDraft} extension - Extension object to add.
 * @returns {Promise<any>} - Response of the add extension operation.
 */
const addExtensions = async (extension: ExtensionDraft): Promise<any> => {
  let addExtensionsResponse;
  const client = await getClient();
  if (client) {
    const query = client.extensions().post({
      body: extension
    });
    const startTime = new Date().getTime();
    addExtensionsResponse = await query.execute();
    const endTime = new Date().getTime();
    paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_EXTENSIONS, Constants.LOG_INFO, '', '', `${endTime - startTime} `);
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
  const client = await getClient();
  if (key && client) {
    const query = client.types().withKey({ key: key }).get();
    const startTime = new Date().getTime();
    getCustomTypeResponse = await query.execute();
    const endTime = new Date().getTime();
    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CUSTOM_TYPE, Constants.LOG_INFO, '', '', `${endTime - startTime} `);
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
 * @returns {Promise<Customer | null>} - Response of the set custom type operation.
 */
const setCustomType = async (customerId: string | undefined, fieldsData: string[], failedTokenData: string[] | undefined, customerTokenId?: string): Promise<Partial<Customer> | null> => {
  let setCustomTypeResponse = null;
  const failedTokens = failedTokenData ? failedTokenData : [];
  const client = await getClient();
  if (customerId && client) {
    const customerInfo = await getCustomer(customerId);
    const query = client.customers().withId({ ID: customerId }).post({
      body: {
        version: customerInfo?.version as number,
        actions: [
          {
            action: Constants.SET_CUSTOM_TYPE,
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
      }
    });
    setCustomTypeResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_SET_CUSTOM_TYPE, Constants.LOG_INFO, '', '', `${setCustomTypeResponse.consolidatedTime} `);
  }
  return setCustomTypeResponse;
};

/**
 * Changes the interaction ID of a transaction.
 * 
 * @param {any} transactionObj - Object containing transaction details.
 * @returns {Promise<Payment | null>} - Response of the change transaction interaction ID operation.
 */
const changeTransactionInteractionId = async (transactionObj: any) => {
  let changeTransactionInteractionIdResponse = null;
  const client = await getClient();
  if (transactionObj?.paymentId && client) {
    let paymentId = transactionObj.paymentId;
    const query = client.payments().withId({ ID: paymentId }).post({
      body: {
        version: transactionObj.version,
        actions: [
          {
            action: Constants.CHANGE_TRANSACTION_INTERACTION_ID,
            transactionId: transactionObj.transactionId,
            interactionId: transactionObj.interactionId,
          },
        ],
      }
    });
    changeTransactionInteractionIdResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_CHANGE_TRANSACTION_INTERACTION_ID, Constants.LOG_INFO, '', '', `${changeTransactionInteractionIdResponse.consolidatedTime} `);
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
  const client = await getClient();
  if (typeId && version && fieldDefinition && client) {
    const query = client.types().withId({ ID: typeId }).post({
      body: {
        version: version,
        actions: [
          {
            action: Constants.ADD_FIELD_DEFINITION,
            fieldDefinition: fieldDefinition,
          },
        ],
      }
    });
    addCustomFieldResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_CUSTOM_FIELD, Constants.LOG_INFO, '', '', `${addCustomFieldResponse.consolidatedTime} `);
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
  const client = await getClient();
  if (paymentId && version && transactionId && 0 > pendingAmount && client) {
    const query = client.payments().withId({ ID: paymentId }).post({
      body: {
        version: version,
        actions: [
          {
            action: Constants.SET_TRANSACTION_CUSTOM_TYPE,
            type: {
              key: Constants.ISV_TRANSACTION_DATA,
              typeId: Constants.TYPE_ID_TYPE,
            },
            fields: {
              isv_availableCaptureAmount: pendingAmount,
            },
            transactionId: transactionId,
          },
        ],
      }
    });
    updateAvailableAmountResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_AVAILABLE_AMOUNT, Constants.LOG_INFO, '', '', `${updateAvailableAmountResponse.consolidatedTime} `);
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
  const client = await getClient();
  if (cartId && client) {
    const query = client.carts().withId({ ID: cartId }).get();
    getCartByIdResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CART_BY_ID, Constants.LOG_INFO, '', '', `${getCartByIdResponse.consolidatedTime} `);
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
const addCustomerAddress = async (customerId: string, addressObj: Partial<_BaseAddress>) => {
  const actions: CustomerUpdateAction[] = [];
  let addCustomerAddressResponse = null;
  let customerData: Partial<Customer> | null = null;
  const client = await getClient();
  if (customerId && client) {
    customerData = await getCustomer(customerId);
    actions.push({
      action: 'addAddress',
      address: new Address(addressObj) as _BaseAddress
    });
    if (actions && actions.length && customerData) {
      const query = client.customers().withId({ ID: customerId }).post({
        body: {
          version: customerData.version as number,
          actions: actions,
        }
      });
      addCustomerAddressResponse = await makeCommercetoolsRequest(query);
      paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_CUSTOMER_ADDRESS, Constants.LOG_INFO, '', '', `${addCustomerAddressResponse.consolidatedTime} `);
    }
  }
  return addCustomerAddressResponse;
};

/**
 * Creates a custom object in the commercetools platform.
 * 
 * @param {CustomObjectDraft} customObjectData - Data for the custom object.
 * @returns {Promise<any>} - Response containing the created custom object.
 */
const createCTCustomObject = async (customObjectData: CustomObjectDraft) => {
  let setCustomObjectResponse: any;
  const client = await getClient();
  if (customObjectData && client) {
    const query = client.customObjects().post({ body: customObjectData });
    setCustomObjectResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_CREATE_CT_CUSTOM_OBJECT, Constants.LOG_INFO, '', '', `${setCustomObjectResponse.consolidatedTime} `);
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
  const client = await getClient();
  if (container && client) {
    const query = client.customObjects().get({ queryArgs: { where: [`container="${container}"`] } });
    const startTime = new Date().getTime();
    getCustomObjectsResponse = await query.execute();
    const endTime = new Date().getTime();
    if (getCustomObjectsResponse?.body) {
      getCustomObjectsResponse = getCustomObjectsResponse.body;
    }
    paymentUtils.logData(__filename, FunctionConstant.FUNC_RETRIEVE_CUSTOMER_OBJECT_BY_CONTAINER, Constants.LOG_INFO, '', '', `${endTime - startTime} `);
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
const updateCustomerToken = async (updateObject: any, customerObject: Partial<Customer>, failedTokens: any, customerTokenId: string | null) => {
  let setCustomFieldResponse: any;
  const client = await getClient();
  if (customerObject && customerObject?.id && client) {
    let customerId = customerObject.id;
    const actions = [
      failedTokens && { action: Constants.SET_CUSTOM_FIELD, name: Constants.ISV_FAILED_TOKENS, value: failedTokens },
      updateObject && { action: Constants.SET_CUSTOM_FIELD, name: Constants.ISV_TOKENS, value: updateObject },
      customerTokenId && { action: Constants.SET_CUSTOM_FIELD, name: Constants.ISV_CUSTOMER_ID, value: customerTokenId },
      customerObject?.custom?.fields?.isv_tokenAction && { action: Constants.SET_CUSTOM_FIELD, name: Constants.ISV_TOKEN_ACTION, value: null },
      customerObject?.custom?.fields?.isv_cardNewExpiryMonth && { action: Constants.SET_CUSTOM_FIELD, name: Constants.ISV_CARD_NEW_EXPIRY_MONTH, value: null },
      customerObject?.custom?.fields?.isv_cardNewExpiryYear && { action: Constants.SET_CUSTOM_FIELD, name: Constants.ISV_CARD_NEW_EXPIRY_YEAR, value: null }
    ].filter(Boolean);
    const query = client.customers().withId({ ID: customerId }).post({
      body: {
        version: customerObject.version as number,
        actions: actions,
      }
    })
    setCustomFieldResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_CUSTOMER_TOKEN, Constants.LOG_INFO, customerId, '', `${setCustomFieldResponse.consolidatedTime} `);
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
  const client = await getClient();
  if (customFieldName && customFieldValue && client) {
    const query = client.customers().get({ queryArgs: { where: `custom(fields(${customFieldName} = "${customFieldValue}"))` } });
    retrieveCustomerByCustomObjectResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_RETRIEVE_CUSTOMER_BY_CUSTOM_FIELD, Constants.LOG_INFO, '', '', `${retrieveCustomerByCustomObjectResponse.consolidatedTime} `);
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
  const client = await getClient();
  if (discountId && client) {
    const query = client.discountCodes().withId({ ID: discountId }).get();
    getDiscountResponse = await makeCommercetoolsRequest(query);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_RETRIEVE_CUSTOMER_BY_CUSTOM_FIELD, Constants.LOG_INFO, '', '', `${getDiscountResponse.consolidatedTime} `);
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
const getAllPayments = async (): Promise<PaymentPagedQueryResponse> => {
  let getAllPaymentsResponse = {} as PaymentPagedQueryResponse;
  const client = await getClient();
  if (client) {
    const query = client.payments().get({ queryArgs: { sort: `${Constants.LAST_MODIFIED_AT} ${Constants.DESC_ORDER}` } })
    const getAllPaymentsResponseObject = await query.execute();
    if (getAllPaymentsResponseObject?.body) {
      getAllPaymentsResponse = getAllPaymentsResponseObject.body;
    }
  }
  return getAllPaymentsResponse;
}

const updateOrderAddress = async (orderId: string, orderVersion: number, actions: any[]) => {
  const client = await getClient();
  let orderUpdateResponse = null;
  if (client && orderId && orderVersion && actions && actions.length) {
    const query = client.orders().withId({ ID: orderId }).post({
      body: {
        version: orderVersion,
        actions: actions,
      },
    });
    orderUpdateResponse = await query.execute();
  }
  return orderUpdateResponse;
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
  getAllPayments,
  updateOrderAddress
};
