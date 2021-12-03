import fetch from 'node-fetch';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createClient } from '@commercetools/sdk-client';
import { Constants } from '../../constants';

function getClient() {
  let client: any;
  let projectKey: any;
  let authMiddleware: any;
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
    console.log(
      Constants.EXCEPTION_MSG_COMMERCETOOLS_CONNECT,
      JSON.stringify(exception)
    );
  }
  return client;
}

const retrieveCartByAnonymousId = async (anonymousId) => {
  let anonymousIdResponse: any;
  let client: any;
  let requestBuilder: any;
  let uri: string;
  let channelsRequest: any;
  try {
    if (null != anonymousId) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.carts
          .parse({
            where: [
              `${Constants.ANONYMOUS_ID} = "${anonymousId}"`,
              `${Constants.ACTIVE_CART_STATE}`,
            ],
          })
          .build();
        channelsRequest = {
          uri: uri,
          method: 'GET',
        };
        anonymousIdResponse = await client.execute(channelsRequest);
      } else {
        console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      console.log(Constants.ERROR_MSG_CART_DETAILS);
    }
  } catch (exception) {
    console.log(
      Constants.EXCEPTION_MSG_CART_DETAILS,
      JSON.stringify(exception)
    );
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
  let uri: string;
  let channelsRequest: any;
  try {
    if (null != customerId) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.carts
          .parse({
            where: [
              `${Constants.CUSTOMER_ID} = "${customerId}"`,
              `${Constants.ACTIVE_CART_STATE}`,
            ],
          })
          .build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_GET,
        };
        customerIdResponse = await client.execute(channelsRequest);
      } else {
        console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      console.log(Constants.ERROR_MSG_CART_DETAILS);
    }
  } catch (exception) {
    console.log(
      Constants.EXCEPTION_MSG_CART_DETAILS,
      JSON.stringify(exception)
    );
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
  let uri: string;
  let channelsRequest: any;
  try {
    if (null != paymentId) {
      client = getClient();
      if (null != client) {
        requestBuilder = createRequestBuilder({
          projectKey: process.env.CT_PROJECT_KEY,
        });
        uri = requestBuilder.carts
          .parse({ where: [`paymentInfo(payments(id="${paymentId}"))`] })
          .build();
        channelsRequest = {
          uri: uri,
          method: Constants.HTTP_METHOD_GET,
        };
        paymentIdResponse = await client.execute(channelsRequest);
      } else {
        console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      console.log(Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    console.log(
      Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS,
      JSON.stringify(exception)
    );
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
  let uri: string;
  let channelsRequest: any;
  try {
    if (null != paymentId) {
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
        console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      console.log(Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    console.log(
      Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS,
      JSON.stringify(exception)
    );
  }
  if (null != paymentResponse) {
    paymentResponse = paymentResponse.body;
  }
  return paymentResponse;
};

const addTransaction = async (transactionObject) => {
  let transactionResonse: any;
  let client: any;
  let requestBuilder: any;
  let uri: string;
  let channelsRequest: any;
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
        transactionResonse = await client.execute(channelsRequest);
      } else {
        console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      console.log(Constants.ERROR_MSG_FETCH_TRANSACTIONS);
    }
  } catch (exception) {
    console.log(
      Constants.EXCEPTION_MSG_ADD_TRANSACTION,
      JSON.stringify(exception)
    );
  }
  if (null != transactionResonse) {
    transactionResonse = transactionResonse.body;
  }
  return transactionResonse;
};

const getorders = async () => {
  let orderResponse: any;
  let client: any;
  let requestBuilder: any;
  let uri: string;
  let channelsRequest: any;
  try {
    client = getClient();
    if (null != client) {
      requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      uri = requestBuilder.payments
        .parse({
          sort: [
            { by: Constants.LAST_MODIFIED_AT, direction: Constants.DESC_ORDER },
          ],
        })
        .build();
      channelsRequest = {
        uri: uri,
        method: Constants.HTTP_METHOD_GET,
      };
      orderResponse = await client.execute(channelsRequest);
    } else {
      console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (exception) {
    console.log(
      Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS,
      JSON.stringify(exception)
    );
  }
  if (null != orderResponse) {
    orderResponse = orderResponse.body;
  }
  return orderResponse;
};

const updateCartbyPaymentId = async (cartId, cartVersion, visaCheckoutData) => {
  let orderResponse: any;
  let client: any;
  let requestBuilder: any;
  let uri: string;
  let channelsRequest: any;
  try {
    if (null != cartId && null != cartVersion && null != visaCheckoutData) {
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
            actions: [
              {
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
              },
            ],
          }),
        };
        orderResponse = await client.execute(channelsRequest);
      } else {
        console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      console.log(Constants.ERROR_MSG_EMPTY_CART);
    }
  } catch (exception) {
    console.log(Constants.EXCEPTION_MSG_CART_UPDATE, JSON.stringify(exception));
  }
  if (null != orderResponse) {
    orderResponse = orderResponse.body;
  }
  return orderResponse;
};

const setCustomerTokens = async (paymentInstrumentId, updatePaymentObj) => {
  let tokenResponse: any;
  let customerInfo: any;
  let client: any;
  let tokenData: any;
  let stringTokenData: string;
  let isvTokens: any;
  let mappedTokens: any;
  let length: number;
  let tokenArray: Array<string>;
  let customerId = null;
  try {
    if (
      null != paymentInstrumentId &&
      null != updatePaymentObj &&
      Constants.STRING_CUSTOMER in updatePaymentObj &&
      Constants.STRING_ID in updatePaymentObj.customer
    ) {
      customerId = updatePaymentObj.customer.id;
      client = getClient();
      if (null != client && null != customerId) {
        customerInfo = await getCustomer(customerId);
        tokenData = {
          alias: updatePaymentObj.custom.fields.isv_tokenAlias,
          value: paymentInstrumentId,
          cardType: updatePaymentObj.custom.fields.isv_cardType,
          cardName: updatePaymentObj.custom.fields.isv_cardType,
          cardNumber: updatePaymentObj.custom.fields.isv_maskedPan,
          cardExpiryMonth: updatePaymentObj.custom.fields.isv_cardExpiryMonth,
          cardExpiryYear: updatePaymentObj.custom.fields.isv_cardExpiryYear,
        };
        stringTokenData = JSON.stringify(tokenData);
        if (
          null != customerInfo &&
          Constants.STRING_CUSTOM in customerInfo &&
          Constants.STRING_FIELDS in customerInfo.custom &&
          Constants.ISV_TOKENS in customerInfo.custom.fields
        ) {
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
        console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      console.log(Constants.ERROR_MSG_CUSTOMER_DETAILS);
    }
  } catch (exception) {
    console.log(
      Constants.EXCEPTION_MSG_CUSTOMER_UPDATE,
      JSON.stringify(exception)
    );
  }
  return tokenResponse;
};

const getCustomer = async (customerId) => {
  let customerResponse: any;
  let client: any;
  let requestBuilder: any;
  let uri: string;
  let channelsRequest: any;
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
        console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      console.log(Constants.ERROR_MSG_CUSTOMER_DETAILS);
    }
  } catch (exception) {
    console.log(
      Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS,
      JSON.stringify(exception)
    );
  }
  if (null != customerResponse) {
    customerResponse = customerResponse.body;
  }
  return customerResponse;
};

const setCustomType = async (customerId, fieldsdata) => {
  let customResponse: any;
  let customerInfo: any;
  try {
    if (null != customerId && null != fieldsdata) {
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
                action: 'setCustomType',
                type: {
                  key: 'isv_payments_customer_tokens',
                  typeId: 'type',
                },
                fields: {
                  isv_tokens: fieldsdata,
                },
              },
            ],
          }),
        };
        customResponse = await client.execute(channelsRequest);
      } else {
        console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      console.log(Constants.ERROR_MSG_CUSTOMER_DETAILS);
    }
  } catch (exception) {
    console.log(
      Constants.EXCEPTION_MSG_FETCH_ORDER_DETAILS,
      JSON.stringify(exception)
    );
  }
  if (null != customResponse) {
    customResponse = customResponse.body;
  }
  return customResponse;
};

const updateDecisionSync = async (decisionUpdateObject) => {
  let client: any;
  let requestBuilder: any;
  let uri: string;
  let channelsRequest: any;
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
        console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
      }
    } else {
      console.log(Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
    }
  } catch (exception) {
    console.log(Constants.EXCEPTION_MSG_DECISON_SYNC, exception);
  }
};

export default {
  retrieveCartByAnonymousId,
  retrieveCartByCustomerId,
  retrieveCartByPaymentId,
  retrievePayment,
  addTransaction,
  getorders,
  updateCartbyPaymentId,
  setCustomerTokens,
  updateDecisionSync,
};
