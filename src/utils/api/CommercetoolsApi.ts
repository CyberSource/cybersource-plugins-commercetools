import fetch from 'node-fetch';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createClient } from '@commercetools/sdk-client';
import { Constants } from '../../constants';

function getClient() {
  let client: any;
  try {
    const projectKey = process.env.CT_PROJECT_KEY;
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
  } catch (error) {
    console.log(Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS, error);
  }
  return client;
}

const retrieveCartByAnonymousId = async (anonymousId) => {
  let anonymousIdResponse: any;
  try {
    const client = getClient();
    if (null != client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.carts
        .parse({
          where: [
            `${Constants.ANONYMOUS_ID} = "${anonymousId}"`,
            `${Constants.ACTIVE_CART_STATE}`,
          ],
        })
        .build();
      const channelsRequest = {
        uri: uri,
        method: 'GET',
      };
      anonymousIdResponse = await client.execute(channelsRequest);
    } else {
      console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (error) {
    console.log(Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS, error);
  }
  if (null != anonymousIdResponse) {
    anonymousIdResponse = anonymousIdResponse.body;
  }
  return anonymousIdResponse;
};

const retrieveCartByCustomerId = async (customerId) => {
  let customerIdResponse: any;
  try {
    const client = getClient();
    if (null != client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.carts
        .parse({
          where: [
            `${Constants.CUSTOMER_ID} = "${customerId}"`,
            `${Constants.ACTIVE_CART_STATE}`,
          ],
        })
        .build();
      const channelsRequest = {
        uri: uri,
        method: Constants.HTTP_METHOD_GET,
      };
      customerIdResponse = await client.execute(channelsRequest);
    } else {
      console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (error) {
    console.log(Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS, error);
  }
  if (null != customerIdResponse) {
    customerIdResponse = customerIdResponse.body;
  }
  return customerIdResponse;
};

const retrieveCartByPaymentId = async (paymentId) => {
  let paymentIdResponse: any;
  try {
    const client = getClient();
    if (null != client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.carts
        .parse({ where: [`paymentInfo(payments(id="${paymentId}"))`] })
        .build();
      const channelsRequest = {
        uri: uri,
        method: Constants.HTTP_METHOD_GET,
      };
      paymentIdResponse = await client.execute(channelsRequest);
    } else {
      console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (error) {
    console.log(Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS, error);
  }
  if (null != paymentIdResponse) {
    paymentIdResponse = paymentIdResponse.body;
  }
  return paymentIdResponse;
};

const retrievePayment = async (paymentId) => {
  let paymentResponse: any;
  try {
    const client = getClient();
    if (null != client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.payments.byId(paymentId).build();
      const channelsRequest = {
        uri: uri,
        method: Constants.HTTP_METHOD_GET,
      };
      paymentResponse = await client.execute(channelsRequest);
    } else {
      console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (error) {
    console.log(Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS, error);
  }
  if (null != paymentResponse) {
    paymentResponse = paymentResponse.body;
  }
  return paymentResponse;
};

const addTransaction = async (transactionObject) => {
  let transactionResonse: any;
  try {
    const client = getClient();
    if (null != client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.payments
        .byId(transactionObject.paymentId)
        .build();
      const channelsRequest = {
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
  } catch (error) {
    console.log(Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS, error);
  }
  if (null != transactionResonse) {
    transactionResonse = transactionResonse.body;
  }
  return transactionResonse;
};

const getorders = async () => {
  let orderResponse: any;
  try {
    const client = getClient();
    if (null != client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.payments
        .parse({
          sort: [
            { by: Constants.LAST_MODIFIED_AT, direction: Constants.DESC_ORDER },
          ],
        })
        .build();
      const channelsRequest = {
        uri: uri,
        method: Constants.HTTP_METHOD_GET,
      };
      orderResponse = await client.execute(channelsRequest);
    } else {
      console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    }
  } catch (error) {
    console.log(Constants.ERROR_MSG_FETCHING_ORDER_DETAILS, error);
  }
  if (null != orderResponse) {
    orderResponse = orderResponse.body;
  }
  return orderResponse;
};

const updateCartbyPaymentId = async (cart, visaCheckoutData) => {
  let orderResponse: any;
  try {
    const client = getClient();
    if (null != client) {
      const requestBuilder = createRequestBuilder({
        projectKey: process.env.CT_PROJECT_KEY,
      });
      const uri = requestBuilder.carts.byId(cart.id).build();
      const channelsRequest = {
        uri: uri,
        method: Constants.HTTP_METHOD_POST,
        body: JSON.stringify({
          version: cart.version,
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
  } catch (error) {
    console.log(Constants.ERROR_MSG_FETCHING_ORDER_DETAILS, error);
  }
  if (null != orderResponse) {
    orderResponse = orderResponse.body;
  }
  return orderResponse;
};

export default {
  retrieveCartByAnonymousId,
  retrieveCartByCustomerId,
  retrieveCartByPaymentId,
  retrievePayment,
  addTransaction,
  getorders,
  updateCartbyPaymentId,
};
