import fetch from 'node-fetch';
import path from 'path';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createClient } from '@commercetools/sdk-client';
import { Constants } from '../../constants';
import paymentService from './../PaymentService';

const getClient = () => {
  let client: any;
  let projectKey: any;
  let authMiddleware: any;
  let exceptionData: any;
  try {
    projectKey = process.env.CT_PROJECT_KEY;
    authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
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
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_COMMERCETOOLS_CONNECT + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_COMMERCETOOLS_CONNECT + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_COMMERCETOOLS_CONNECT + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CLIENT, Constants.LOG_ERROR, exceptionData);
  }
  return client;
};

const retrieveCartByAnonymousId = async (anonymousId) => {
  let anonymousIdResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != anonymousId) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.carts
          .parse({
            where: [`${Constants.ANONYMOUS_ID} = "${anonymousId}"`, `${Constants.ACTIVE_CART_STATE}`],
            sort: [{ by: Constants.LAST_MODIFIED_AT, direction: Constants.DESC_ORDER }],
          })
          .build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_GET,
        };
        anonymousIdResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_ANONYMOUS_ID, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_ANONYMOUS_ID, Constants.LOG_INFO, Constants.ERROR_MSG_CART_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_ANONYMOUS_ID, Constants.LOG_ERROR, exceptionData);
  }
  if (null != anonymousIdResponse) {
    anonymousIdResponse = anonymousIdResponse.body;
  }
  return anonymousIdResponse;
};

const retrieveCartByCustomerId = async (customerId) => {
  let customerIdResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != customerId) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.carts
          .parse({
            where: [`${Constants.CUSTOMER_ID} = "${customerId}"`, `${Constants.ACTIVE_CART_STATE}`],
            sort: [{ by: Constants.LAST_MODIFIED_AT, direction: Constants.DESC_ORDER }],
          })
          .build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_GET,
        };
        customerIdResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_CUSTOMER_ID, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_CUSTOMER_ID, Constants.LOG_INFO, Constants.ERROR_MSG_CART_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_CUSTOMER_ID, Constants.LOG_ERROR, exceptionData);
  }
  if (null != customerIdResponse) {
    customerIdResponse = customerIdResponse.body;
  }
  return customerIdResponse;
};

const retrieveCartByPaymentId = async (paymentId) => {
  let paymentIdResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != paymentId) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.carts.parse({ where: [`paymentInfo(payments(id="${paymentId}"))`] }).build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_GET,
        };
        paymentIdResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_PAYMENT_ID, Constants.LOG_ERROR, exceptionData);
  }
  if (null != paymentIdResponse) {
    paymentIdResponse = paymentIdResponse.body;
  }
  return paymentIdResponse;
};

const retrievePaymentByCustomerId = async (paymentId, startTime, endTime) => {
  let paymentIdResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != paymentId) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.payments
          .parse({
            where: [`customer(id="${paymentId}")`, `createdAt > "${startTime}" and createdAt < "${endTime}"`, `custom(fields(isv_tokenAlias is defined))`, `custom(fields(isv_token is defined))`],
          })
          .build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_GET,
        };
        paymentIdResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_PAYMENT_ID, Constants.LOG_ERROR, exceptionData);
  }
  if (null != paymentIdResponse) {
    paymentIdResponse = paymentIdResponse.body;
  }
  return paymentIdResponse;
};

const retrievePayment = async (paymentId) => {
  let paymentResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    client = getClient();
    if (null != client) {
      requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      uri = requestBuilder.payments.byId(paymentId).build();
      channelsRequest = {
        uri: uri,
        method: Constants.HTTP_METHOD_GET,
      };
      paymentResponse = await client.execute(channelsRequest);
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_PAYMENT, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_PAYMENT, Constants.LOG_ERROR, exceptionData);
  }
  if (null != paymentResponse) {
    paymentResponse = paymentResponse.body;
  }
  return paymentResponse;
};

const addTransaction = async (transactionObject) => {
  let transactionResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != transactionObject) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.payments.byId(transactionObject.paymentId).build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_POST,
          body: JSON.stringify({
            version: transactionObject.version,
            actions: [
              {
                action: Constants.ADD_TRANSACTION,
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
        transactionResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_TRANSACTION, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_TRANSACTION, Constants.LOG_INFO, Constants.ERROR_MSG_FETCH_TRANSACTIONS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_ADD_TRANSACTION + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_ADD_TRANSACTION + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_ADD_TRANSACTION + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_TRANSACTION, Constants.LOG_ERROR, exceptionData);
  }
  if (null != transactionResponse) {
    transactionResponse = transactionResponse.body;
  }
  return transactionResponse;
};

const getOrders = async () => {
  let orderResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    client = getClient();
    if (null != client) {
      requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      uri = requestBuilder.payments
        .parse({
          sort: [{ by: Constants.LAST_MODIFIED_AT, direction: Constants.DESC_ORDER }],
        })
        .build();
      channelsRequest = {
        uri: uri,
        method: Constants.HTTP_METHOD_GET,
      };
      orderResponse = await client.execute(channelsRequest);
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_ORDERS, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_ORDERS, Constants.LOG_ERROR, exceptionData);
  }
  if (null != orderResponse) {
    orderResponse = orderResponse.body;
  }
  return orderResponse;
};

const updateCartByPaymentId = async (cartId, paymentId, cartVersion, visaCheckoutData) => {
  let orderResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let cartData: any;
  let shippingEmail: any;
  let uri: string;
  let actions = [] as any;
  try {
    if (null != cartId && null != cartVersion && null != visaCheckoutData && Constants.VAL_ZERO != Object.keys(visaCheckoutData).length) {
      if (null != visaCheckoutData.billToFieldGroup && Constants.VAL_ZERO != Object.keys(visaCheckoutData.billToFieldGroup).length) {
        actions.push({
          action: Constants.SET_BILLING_ADDRESS,
          address: {
            firstName: visaCheckoutData.billToFieldGroup.firstName,
            lastName: visaCheckoutData.billToFieldGroup.lastName,
            streetName: visaCheckoutData.billToFieldGroup.address1,
            streetNumber: visaCheckoutData.billToFieldGroup.address2,
            postalCode: visaCheckoutData.billToFieldGroup.postalCode,
            city: visaCheckoutData.billToFieldGroup.locality,
            region: visaCheckoutData.billToFieldGroup.administrativeArea,
            country: visaCheckoutData.billToFieldGroup.country,
            phone: visaCheckoutData.billToFieldGroup.phoneNumber,
            email: visaCheckoutData.billToFieldGroup.email,
          },
        });
      }
      if (null != visaCheckoutData.shipToFieldGroup && Constants.VAL_ZERO != Object.keys(visaCheckoutData.shipToFieldGroup).length) {
        if (visaCheckoutData.shipToFieldGroup.hasOwnProperty(Constants.STRING_EMAIL) === true && Constants.VAL_ZERO != Object.keys(visaCheckoutData.shipToFieldGroup.email).length) {
          shippingEmail = visaCheckoutData.shipToFieldGroup.email;
        } else {
          cartData = await retrieveCartByPaymentId(paymentId);
          shippingEmail = cartData.results[Constants.VAL_ZERO].shippingAddress.email;
        }
        actions.push({
          action: Constants.SET_SHIPPING_ADDRESS,
          address: {
            firstName: visaCheckoutData.shipToFieldGroup.firstName,
            lastName: visaCheckoutData.shipToFieldGroup.lastName,
            streetName: visaCheckoutData.shipToFieldGroup.address1,
            streetNumber: visaCheckoutData.shipToFieldGroup.address2,
            postalCode: visaCheckoutData.shipToFieldGroup.postalCode,
            city: visaCheckoutData.shipToFieldGroup.locality,
            region: visaCheckoutData.shipToFieldGroup.administrativeArea,
            country: visaCheckoutData.shipToFieldGroup.country,
            phone: visaCheckoutData.shipToFieldGroup.phoneNumber,
            email: shippingEmail,
          },
        });
      }
      if (null != actions && Constants.VAL_ZERO != actions.length) {
        client = getClient();
        if (null != client) {
          requestBuilder = createRequestBuilder({
            projectKey: process.env.CT_PROJECT_KEY,
          });
          uri = requestBuilder.carts.byId(cartId).build();
          channelsRequest = {
            uri: uri,
            method: Constants.HTTP_METHOD_POST,
            body: JSON.stringify({
              version: cartVersion,
              actions: actions,
            }),
          };
          orderResponse = await client.execute(channelsRequest);
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.ERROR_MSG_UPDATE_CART);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_CART);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CART_UPDATE + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CART_UPDATE + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CART_UPDATE + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CART_BY_PAYMENT_ID, Constants.LOG_ERROR, exceptionData);
  }
  if (null != orderResponse) {
    orderResponse = orderResponse.body;
  }
  return orderResponse;
};

const setCustomerTokens = async (tokenCustomerId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj) => {
  let tokenResponse: any;
  let customerInfo: any;
  let client: any;
  let tokenData: any;
  let isvTokens: any;
  let mappedTokens: any;
  let exceptionData: any;
  let stringTokenData: string;
  let length: number;
  let tokenArray: Array<string>;
  let customerId = null;
  try {
    if (null != paymentInstrumentId && null != instrumentIdentifier && null != updatePaymentObj && Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer) {
      customerId = updatePaymentObj.customer.id;
      client = getClient();
      if (null != client && null != customerId) {
        customerInfo = await getCustomer(customerId);
        tokenData = {
          alias: updatePaymentObj.custom.fields.isv_tokenAlias,
          value: tokenCustomerId,
          paymentToken: paymentInstrumentId,
          instrumentIdentifier: instrumentIdentifier,
          cardType: updatePaymentObj.custom.fields.isv_cardType,
          cardName: updatePaymentObj.custom.fields.isv_cardType,
          cardNumber: updatePaymentObj.custom.fields.isv_maskedPan,
          cardExpiryMonth: updatePaymentObj.custom.fields.isv_cardExpiryMonth,
          cardExpiryYear: updatePaymentObj.custom.fields.isv_cardExpiryYear,
        };
        stringTokenData = JSON.stringify(tokenData);
        if (null != customerInfo && Constants.STRING_CUSTOM in customerInfo && Constants.STRING_FIELDS in customerInfo.custom && Constants.ISV_TOKENS in customerInfo.custom.fields) {
          isvTokens = customerInfo.custom.fields.isv_tokens;
          mappedTokens = isvTokens.map((item) => item);
          length = mappedTokens.length;
          mappedTokens.set(length, stringTokenData);
          tokenResponse = await setCustomType(customerId, mappedTokens);
        } else {
          tokenArray = [stringTokenData];
          tokenResponse = await setCustomType(customerId, tokenArray);
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKENS, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKENS, Constants.LOG_INFO, Constants.ERROR_MSG_CUSTOMER_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKENS, Constants.LOG_ERROR, exceptionData);
  }
  return tokenResponse;
};

const getCustomer = async (customerId) => {
  let customerResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != customerId) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.customers.byId(customerId).build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_GET,
        };
        customerResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CUSTOMER, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CUSTOMER, Constants.LOG_INFO, Constants.ERROR_MSG_CUSTOMER_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CUSTOMER, Constants.LOG_ERROR, exceptionData);
  }
  if (null != customerResponse) {
    customerResponse = customerResponse.body;
  }
  return customerResponse;
};

const setCustomType = async (customerId, fieldsData) => {
  let customResponse: any;
  let customerInfo: any;
  let exceptionData: any;
  try {
    if (null != customerId && null != fieldsData) {
      const client = getClient();
      if (null != client) {
        const requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        customerInfo = await getCustomer(customerId);
        const uri = requestBuilder.customers.byId(customerId).build();
        const channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_POST,
          body: JSON.stringify({
            version: customerInfo.version,
            actions: [
              {
                action: Constants.SET_CUSTOM_TYPE,
                type: {
                  key: Constants.ISV_PAYMENTS_CUSTOMER_TOKENS,
                  typeId: Constants.TYPE_ID_TYPE,
                },
                fields: {
                  isv_tokens: fieldsData,
                },
              },
            ],
          }),
        };
        customResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOM_TYPE, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOM_TYPE, Constants.LOG_INFO, Constants.ERROR_MSG_CUSTOMER_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOM_TYPE, Constants.LOG_ERROR, exceptionData);
  }
  if (null != customResponse) {
    customResponse = customResponse.body;
  }
  return customResponse;
};

const updateDecisionSync = async (decisionUpdateObject) => {
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != decisionUpdateObject) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.payments.byId(decisionUpdateObject.id).build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_POST,
          body: JSON.stringify({
            version: decisionUpdateObject.version,
            actions: [
              {
                action: Constants.CHANGE_TRANSACTION_STATE,
                transactionId: decisionUpdateObject.transactionId,
                state: decisionUpdateObject.state,
              },
            ],
          }),
        };
        await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_INFO, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_DECISION_SYNC + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_DECISION_SYNC + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_DECISION_SYNC + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_ERROR, exceptionData);
  }
};

const updateSync = async (syncUpdateObject) => {
  let updateSyncResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != syncUpdateObject) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.payments.byId(syncUpdateObject.id).build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_POST,
          body: JSON.stringify({
            version: syncUpdateObject.version,
            actions: [
              {
                action: Constants.CHANGE_TRANSACTION_STATE,
                transactionId: syncUpdateObject.transactionId,
                state: syncUpdateObject.state,
              },
              {
                action: Constants.CHANGE_TRANSACTION_INTERACTION_ID,
                transactionId: syncUpdateObject.transactionId,
                interactionId: syncUpdateObject.interactionId,
              },
            ],
          }),
        };
        updateSyncResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_SYNC, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_SYNC, Constants.LOG_INFO, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_SYNC, Constants.LOG_ERROR, exceptionData);
  }
  if (null != updateSyncResponse) {
    updateSyncResponse = updateSyncResponse.body;
  }
  return updateSyncResponse;
};

const syncVisaCardDetails = async (visaUpdateObject) => {
  let syncVisaCardDetailsResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != visaUpdateObject) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.payments.byId(visaUpdateObject.id).build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_POST,
          body: JSON.stringify({
            version: visaUpdateObject.version,
            actions: visaUpdateObject.actions,
          }),
        };
        syncVisaCardDetailsResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_VISA_CARD_DETAILS, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_VISA_CARD_DETAILS, Constants.LOG_INFO, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_VISA_CARD_DETAILS, Constants.LOG_ERROR, exceptionData);
  }
  if (null != syncVisaCardDetailsResponse) {
    syncVisaCardDetailsResponse = syncVisaCardDetailsResponse.body;
  }
  return syncVisaCardDetailsResponse;
};

const syncAddTransaction = async (syncUpdateObject) => {
  let syncAddTransactionResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != syncUpdateObject) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.payments.byId(syncUpdateObject.id).build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_POST,
          body: JSON.stringify({
            version: syncUpdateObject.version,
            actions: [
              {
                action: Constants.ADD_TRANSACTION,
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
        syncAddTransactionResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_ADD_TRANSACTION, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_ADD_TRANSACTION, Constants.LOG_INFO, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_ADD_TRANSACTION, Constants.LOG_ERROR, exceptionData);
  }
  if (null != syncAddTransactionResponse) {
    syncAddTransactionResponse = syncAddTransactionResponse.body;
  }
  return syncAddTransactionResponse;
};

const addCustomTypes = async (customType) => {
  let customeTypeResponse: any;
  let exceptionData: any;
  try {
    const client = getClient();
    if (null != client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.types.build();
      const channelsRequest = {
        uri: uri,
        method: Constants.HTTP_METHOD_POST,
        body: JSON.stringify(customType),
      };
      customeTypeResponse = await client.execute(channelsRequest);
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CUSTOM_TYPES, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOM_TYPE + Constants.STRING_SEMICOLON + customType.key + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOM_TYPE + Constants.STRING_SEMICOLON + customType.key + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOM_TYPE + Constants.STRING_SEMICOLON + customType.key + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CUSTOM_TYPES, Constants.LOG_ERROR, exceptionData);
  }
  return customeTypeResponse;
};

const addExtensions = async (extension) => {
  let customeTypeResponse: any;
  let exceptionData: any;
  try {
    const client = getClient();
    if (null != client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.extensions.build();
      const channelsRequest = {
        uri: uri,
        method: Constants.HTTP_METHOD_POST,
        body: JSON.stringify(extension),
      };
      customeTypeResponse = await client.execute(channelsRequest);
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_EXTENSIONS, Constants.LOG_INFO, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_ADD_EXTENSION + Constants.STRING_SEMICOLON + extension.key + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_ADD_EXTENSION + Constants.STRING_SEMICOLON + extension.key + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_ADD_EXTENSION + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_EXTENSIONS, Constants.LOG_ERROR, exceptionData);
  }
  return customeTypeResponse;
};

export default {
  retrieveCartByAnonymousId,
  retrieveCartByCustomerId,
  retrieveCartByPaymentId,
  retrievePayment,
  addTransaction,
  getOrders,
  updateCartByPaymentId,
  setCustomerTokens,
  getCustomer,
  setCustomType,
  updateDecisionSync,
  updateSync,
  syncVisaCardDetails,
  syncAddTransaction,
  retrievePaymentByCustomerId,
  addCustomTypes,
  addExtensions,
};
