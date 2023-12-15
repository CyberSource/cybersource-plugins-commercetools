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
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CLIENT, Constants.LOG_ERROR, null, exceptionData);
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
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_ANONYMOUS_ID, Constants.LOG_INFO, Constants.LOG_ANONYMOUS_ID + anonymousId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_ANONYMOUS_ID, Constants.LOG_INFO, Constants.LOG_ANONYMOUS_ID + anonymousId, Constants.ERROR_MSG_CART_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_ANONYMOUS_ID, Constants.LOG_ERROR, Constants.LOG_ANONYMOUS_ID + anonymousId, exceptionData);
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
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_CUSTOMER_ID, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_CUSTOMER_ID, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_CART_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_CUSTOMER_ID, Constants.LOG_ERROR, Constants.LOG_CUSTOMER_ID + customerId, exceptionData);
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
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_PAYMENT_ID, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentId, exceptionData);
  }
  if (null != paymentIdResponse) {
    paymentIdResponse = paymentIdResponse.body;
  }
  return paymentIdResponse;
};

const retrieveOrderByCartId = async (cartId) => {
  let paymentIdResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != cartId) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.orders.parse({ where: [`cart(id="${cartId}")`] }).build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_GET,
        };
        paymentIdResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_ORDER_BY_CART_ID, Constants.LOG_INFO, Constants.LOG_CART_ID + cartId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_ORDER_BY_CART_ID, Constants.LOG_INFO, Constants.LOG_CART_ID + cartId, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_ORDER_BY_CART_ID, Constants.LOG_ERROR, Constants.LOG_CART_ID + cartId, exceptionData);
  }
  if (null != paymentIdResponse) {
    paymentIdResponse = paymentIdResponse.body;
  }
  return paymentIdResponse;
};

const retrieveOrderByPaymentId = async (paymentId) => {
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
        uri = requestBuilder.orders.parse({ where: [`paymentInfo(payments(id="${paymentId}"))`] }).build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_GET,
        };
        paymentIdResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_ORDER_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_ORDER_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_ORDER_BY_PAYMENT_ID, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentId, exceptionData);
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
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_PAYMENT, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_PAYMENT, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentId, exceptionData);
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
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_TRANSACTION, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + transactionObject.paymentId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_TRANSACTION, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + transactionObject.paymentId, Constants.ERROR_MSG_FETCH_TRANSACTIONS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_ADD_TRANSACTION + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_ADD_TRANSACTION + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_ADD_TRANSACTION + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_TRANSACTION, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + transactionObject.paymentId, exceptionData);
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
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_ORDERS, Constants.LOG_INFO, null, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_ORDERS, Constants.LOG_ERROR, null, exceptionData);
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
        if (visaCheckoutData.shipToFieldGroup.hasOwnProperty('email') === true && Constants.VAL_ZERO != Object.keys(visaCheckoutData.shipToFieldGroup.email).length) {
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
      if (null != visaCheckoutData && null != visaCheckoutData.billTo && Constants.STRING_FULL == process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE) {
        actions.push({
          action: Constants.SET_BILLING_ADDRESS,
          address: {
            firstName: visaCheckoutData.billTo.firstName,
            lastName: visaCheckoutData.billTo.lastName,
            streetName: visaCheckoutData.billTo.address1,
            streetNumber: visaCheckoutData.billTo.buildingNumber,
            postalCode: visaCheckoutData.billTo.postalCode,
            city: visaCheckoutData.billTo.locality,
            region: visaCheckoutData.billTo.administrativeArea,
            country: visaCheckoutData.billTo.country,
            phone: visaCheckoutData.billTo.phoneNumber,
            email: visaCheckoutData.billTo.email,
          },
        });
      }
      if (null != visaCheckoutData && null != visaCheckoutData.shipTo && Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING) {
        const cartDetail = await getCartById(cartId);
        if (null != cartDetail) {
          if ('Single' == cartDetail.shippingMode) {
            actions.push({
              action: Constants.SET_SHIPPING_ADDRESS,
              address: {
                firstName: visaCheckoutData.shipTo.firstName,
                lastName: visaCheckoutData.shipTo.lastName,
                streetName: visaCheckoutData.shipTo.address1,
                streetNumber: visaCheckoutData.shipTo.buildingNumber,
                postalCode: visaCheckoutData.shipTo.postalCode,
                city: visaCheckoutData.shipTo.locality,
                region: visaCheckoutData.shipTo.administrativeArea,
                country: visaCheckoutData.shipTo.country,
                phone: visaCheckoutData.shipTo.phoneNumber,
                email: visaCheckoutData.shipTo.email,
              },
            });
          }
        }
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
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_UPDATE_CART);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CART_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_EMPTY_CART);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CART_UPDATE + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CART_UPDATE + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CART_UPDATE + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CART_BY_PAYMENT_ID, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentId, exceptionData);
  }
  if (null != orderResponse) {
    orderResponse = orderResponse.body;
  }
  return orderResponse;
};

const setCustomerTokens = async (tokenCustomerId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId) => {
  let tokenResponse: any;
  let customerInfo: any;
  let client: any;
  let tokenData: any;
  let isvTokens: any;
  let mappedTokens: any;
  let exceptionData: any;
  let failedTokens: any;
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
          addressId: addressId,
          timeStamp: new Date(Date.now()).toISOString(),
        };
        stringTokenData = JSON.stringify(tokenData);
        if (
          null != customerInfo &&
          Constants.STRING_CUSTOM in customerInfo &&
          Constants.STRING_FIELDS in customerInfo.custom &&
          Constants.ISV_TOKENS in customerInfo.custom.fields &&
          Constants.STRING_EMPTY != customerInfo.custom.fields.isv_tokens &&
          Constants.VAL_ZERO < customerInfo.custom.fields.isv_tokens.length
        ) {
          failedTokens = customerInfo.custom.fields.isv_failedTokens;
          isvTokens = customerInfo.custom.fields.isv_tokens;
          mappedTokens = isvTokens.map((item) => item);
          length = mappedTokens.length;
          mappedTokens[length] = stringTokenData;
          tokenResponse = await setCustomType(customerId, mappedTokens, failedTokens);
        } else {
          if (null != customerInfo && Constants.STRING_CUSTOM in customerInfo && Constants.STRING_FIELDS in customerInfo.custom) {
            failedTokens = customerInfo.custom.fields.isv_failedTokens;
          }
          tokenArray = [stringTokenData];
          tokenResponse = await setCustomType(customerId, tokenArray, failedTokens);
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKENS, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + updatePaymentObj.customer.id, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKENS, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + updatePaymentObj.customer.id, Constants.ERROR_MSG_CUSTOMER_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKENS, Constants.LOG_ERROR, Constants.LOG_CUSTOMER_ID + updatePaymentObj.customer.id, exceptionData);
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
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CUSTOMER, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CUSTOMER, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_CUSTOMER_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CUSTOMER, Constants.LOG_ERROR, Constants.LOG_CUSTOMER_ID + customerId, exceptionData);
  }
  if (null != customerResponse) {
    customerResponse = customerResponse.body;
  }
  return customerResponse;
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
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + decisionUpdateObject.id, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + decisionUpdateObject.id, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_DECISION_SYNC + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_DECISION_SYNC + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_DECISION_SYNC + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + decisionUpdateObject.id, exceptionData);
  }
};

const updateSync = async (syncUpdateObject) => {
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
        await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_SYNC, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + syncUpdateObject.id, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_SYNC, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + syncUpdateObject.id, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_SYNC, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + syncUpdateObject.id, exceptionData);
  }
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
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_VISA_CARD_DETAILS, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + visaUpdateObject.id, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_VISA_CARD_DETAILS, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + visaUpdateObject.id, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_VISA_CARD_DETAILS, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + visaUpdateObject.id, exceptionData);
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
        if (syncUpdateObject.securityCodePresent) {
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
        }
        syncAddTransactionResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_ADD_TRANSACTION, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + syncUpdateObject.id, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_ADD_TRANSACTION, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + syncUpdateObject.id, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_ADD_TRANSACTION, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + syncUpdateObject.id, exceptionData);
  }
  if (null != syncAddTransactionResponse) {
    syncAddTransactionResponse = syncAddTransactionResponse.body;
  }
  return syncAddTransactionResponse;
};

const addCustomTypes = async (customType) => {
  let customeTypeResponse: any;
  let exceptionData: any;
  let data: any;
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
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CUSTOM_TYPES, Constants.LOG_INFO, null, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOM_TYPE + Constants.STRING_FULLCOLON + customType.key + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOM_TYPE + Constants.STRING_FULLCOLON + customType.key + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOM_TYPE + Constants.STRING_FULLCOLON + customType.key + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CUSTOM_TYPES, Constants.LOG_ERROR, null, exceptionData);
    data = exception;
    if (Constants.HTTP_CODE_FOUR_HUNDRED == data.statusCode && Constants.HTTP_CODE_FOUR_HUNDRED == data.body.statusCode && Constants.STRING_ERRORS in data.body && Constants.STRING_DUPLICATE_FIELD == data.body.errors[Constants.VAL_ZERO].code) {
      customeTypeResponse = data;
    }
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
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_EXTENSIONS, Constants.LOG_INFO, null, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_ADD_EXTENSION + Constants.STRING_FULLCOLON + extension.key + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_ADD_EXTENSION + Constants.STRING_FULLCOLON + extension.key + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_ADD_EXTENSION + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_EXTENSIONS, Constants.LOG_ERROR, null, exceptionData);
  }
  return customeTypeResponse;
};

const getCustomType = async (key) => {
  let customTypeResponse: any;
  let exceptionData: any;
  try {
    const client = getClient();
    if (null != client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.types.byKey(key).build();
      const channelsRequest = {
        uri: uri,
        method: Constants.HTTP_METHOD_GET,
      };
      customTypeResponse = await client.execute(channelsRequest);
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CUSTOM_TYPES, Constants.LOG_INFO, null, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    customTypeResponse = exception;
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOM_TYPE + Constants.STRING_FULLCOLON + key + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOM_TYPE + Constants.STRING_FULLCOLON + key + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOM_TYPE + Constants.STRING_FULLCOLON + key + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CUSTOM_TYPES, Constants.LOG_ERROR, null, exceptionData);
  }
  return customTypeResponse;
};

const setCustomType = async (customerId, fieldsData, failedTokenData) => {
  let customResponse: any;
  let customerInfo: any;
  let exceptionData: any;
  try {
    if (null != customerId) {
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
                  isv_failedTokens: failedTokenData,
                },
              },
            ],
          }),
        };
        customResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOM_TYPE, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOM_TYPE, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_CREATE_CUSTOM_TYPE);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOM_TYPE, Constants.LOG_ERROR, Constants.LOG_CUSTOMER_ID + customerId, exceptionData);
  }
  if (null != customResponse) {
    customResponse = customResponse.body;
  }
  return customResponse;
};

const addCustomField = async (typeId, version, fieldDefinition) => {
  let customResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != typeId && null != version && null != fieldDefinition) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.types.byId(typeId).build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_POST,
          body: JSON.stringify({
            version: version,
            actions: [
              {
                action: Constants.ADD_FIELD_DEFINITION,
                fieldDefinition: fieldDefinition,
              },
            ],
          }),
        };
        customResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CUSTOM_FIELD, Constants.LOG_INFO, null, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CUSTOM_FIELD, Constants.LOG_INFO, null, Constants.ERROR_MSG_UPDATE_CUSTOM_TYPE);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CUSTOM_FIELD, Constants.LOG_ERROR, null, exceptionData);
  }
  if (null != customResponse) {
    customResponse = customResponse.body;
  }
  return customResponse;
};

const updateAvailableAmount = async (paymentId, version, transactionId, pendingAmount) => {
  let exceptionData: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let uri: string;
  let updateResponse: any;
  try {
    if (null != paymentId && null != version && null != transactionId && null != pendingAmount) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.payments.byId(paymentId).build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_POST,
          body: JSON.stringify({
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
          }),
        };
        updateResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_AVAILABLE_AMOUNT, Constants.LOG_INFO, null, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_AVAILABLE_AMOUNT, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOM_TYPE + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOM_TYPE + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOM_TYPE + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_AVAILABLE_AMOUNT, Constants.LOG_ERROR, null, exceptionData);
  }
  if (null != updateResponse) {
    updateResponse = updateResponse.body;
  }
  return updateResponse;
};

const getCartById = async (cartId) => {
  let cartResponse: any;
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  try {
    if (null != cartId) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.carts
          .byId(cartId)

          .build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_GET,
        };
        cartResponse = await client.execute(channelsRequest);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_ANONYMOUS_ID, Constants.LOG_INFO, 'CartId : ' + cartId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_ANONYMOUS_ID, Constants.LOG_INFO, 'CartId : ' + cartId, Constants.ERROR_MSG_CART_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CART_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RETRIEVE_CART_BY_ANONYMOUS_ID, Constants.LOG_ERROR, 'CartId : ' + cartId, exceptionData);
  }
  if (null != cartResponse) {
    cartResponse = cartResponse.body;
  }
  return cartResponse;
};

const addCustomerAddress = async (customerId, addressObj) => {
  let client: any;
  let requestBuilder: any;
  let channelsRequest: any;
  let exceptionData: any;
  let uri: string;
  let actions = [] as any;
  let customerResponse: any;
  let customerData: any;
  try {
    if (null != customerId && Constants.STRING_EMPTY != customerId) {
      customerData = await getCustomer(customerId);
      if(customerData){
        if ('FULL' == process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE) {
          actions.push({
            action: "addAddress",
            address: {
              firstName: addressObj.firstName,
              lastName: addressObj.lastName,
              streetName: addressObj.address1,
              city: addressObj.locality,
              postalCode: addressObj.postalCode,
              region: addressObj.administrativeArea,
              country: addressObj.country,
              email: addressObj.email,
              phone: addressObj.phoneNumber
            }
          })
        } else {
          actions.push({
            action: "addAddress",
            address: {
              firstName: addressObj.firstName,
              lastName: addressObj.lastName,
              streetName: addressObj.streetName,
              city: addressObj.city,
              postalCode: addressObj.postalCode,
              region: addressObj.buildingNumber,
              country: addressObj.country,
              email: addressObj.email,
              phone: addressObj.phone
            }
          })
        }
        if (null != actions && Constants.VAL_ZERO < actions.length) {
          client = getClient();
          if (null != client) {
            requestBuilder = createRequestBuilder({
              projectKey: process.env.CT_PROJECT_KEY,
            });
            uri = requestBuilder.customers.byId(customerId).build();
            channelsRequest = {
              uri: uri,
              method: Constants.HTTP_METHOD_POST,
              body: JSON.stringify({
                version: customerData.version,
                actions: actions,
              }),
            };
            customerResponse = await client.execute(channelsRequest);
          } else {
            paymentService.logData(path.parse(path.basename(__filename)).name, 'FuncAddCustomerAddress', Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
          }
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, 'FuncAddCustomerAddress', Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_CUSTOMER_UPDATE);
        }
      }else {
        paymentService.logData(path.parse(path.basename(__filename)).name, 'FuncAddCustomerAddress', Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_CUSTOMER_DETAILS);
      }
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE_ADDRESS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE_ADDRESS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE_ADDRESS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, 'FuncAddCustomerAddress', Constants.LOG_ERROR, Constants.LOG_CUSTOMER_ID + customerId, exceptionData);
  }
  if(customerResponse){
    customerResponse = customerResponse.body;
  }
  return customerResponse;
};



export default {
  retrieveCartByAnonymousId,
  retrieveCartByCustomerId,
  retrieveCartByPaymentId,
  retrieveOrderByCartId,
  retrieveOrderByPaymentId,
  retrievePayment,
  addTransaction,
  getOrders,
  updateCartByPaymentId,
  setCustomerTokens,
  getCustomer,
  getCustomType,
  setCustomType,
  updateDecisionSync,
  updateSync,
  syncVisaCardDetails,
  syncAddTransaction,
  addCustomTypes,
  addExtensions,
  addCustomField,
  updateAvailableAmount,
  getCartById,
  addCustomerAddress
};
