import fs from 'fs';
import http from 'http';
import path from 'path';
import url from 'url';

import dotenv from 'dotenv';
import { JSDOM } from 'jsdom';
import moment from 'moment';
import serverless from 'serverless-http';

import apiHandler from './apiController';
import { AppHandler } from './app/AppHandler';
import { RouterHandler } from './app/RouterHandler';
import { Constants } from './constants/constants';
import { CustomMessages } from './constants/customMessages';
import { PaymentType } from './types/Types';
import paymentActions from './utils/PaymentActions';
import paymentHandler from './utils/PaymentHandler';
import paymentUtils from './utils/PaymentUtils';
import paymentValidator from './utils/PaymentValidator'
import commercetoolsApi from './utils/api/CommercetoolsApi';
import resourceHandler from './utils/config/ResourceHandler';
import syncHelper from './utils/helpers/SyncHelper';

let errorMessage = '';
let successMessage = '';
let orderSuccessMessage = '';
let orderErrorMessage = '';
let port: number;
dotenv.config();

if ('azure' === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
  port = Number(process.env.FUNCTIONS_HTTPWORKER_PORT);
} else {
  port = Number(process.env.CONFIG_PORT);
}

const middlewareFunctions = [authentication];
const app = new AppHandler(middlewareFunctions);
const route = new RouterHandler();
app.listen(port, (err: any) => {
  if (err) {
    console.log('Error in starting the extension :', err);
  } else {
    console.log(`Extension started in port ${port}`);
  }
});

/**
 * Authentication function for handling incoming HTTP requests.
 * 
 * @param {http.IncomingMessage} req - The incoming HTTP request object.
 * @param {http.ServerResponse} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
async function authentication(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  let notificationBody: any;
  let isWhitelisted = false;
  let isValidNotification = false;
  const authHeader = req?.headers['authorization'];
  let parsedUrl;
  const whitelistUrls = process.env.PAYMENT_GATEWAY_WHITELIST_URLS;
  const requestUrl = req.url;
  if (requestUrl) {
    parsedUrl = url.parse(requestUrl, true);
  }
  let whitelistUrlArray: string[] = [];
  if ('/netTokenNotification' === parsedUrl?.pathname) {
    if ('GET' === req.method) {
      res.statusCode = Constants.HTTP_OK_STATUS_CODE;
      res.end();
    } else if ('POST' === req.method) {
      let body = '';
      req.on('data', (chunk: { toString: () => string }) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        notificationBody = JSON.parse(body);
        const vcSignature = req?.headers['v-c-signature'];
        if (vcSignature && notificationBody) {
          isValidNotification = await paymentUtils.authenticateNetToken(vcSignature, notificationBody);
          if (isValidNotification) {
            await handlePostNetTokenNotification(notificationBody, res);
          }
        }
        if (!isValidNotification) {
          paymentUtils.logData(__filename, 'FuncAuthentication', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_SIGNATURE_DOES_NOT_MATCH);
          res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
          res.end();
        }
      });
    } else {
      paymentUtils.logData(__filename, 'FuncAuthentication', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_UNHANDLED_REQUEST_METHOD);
      res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
      res.end();
    }
  } else {
    if (whitelistUrls) {
      whitelistUrlArray = whitelistUrls.split(Constants.REGEX_COMMA);
      for (let element of whitelistUrlArray) {
        if (parsedUrl?.pathname === Constants.REGEX_SINGLE_SLASH + element || (parsedUrl && parsedUrl.pathname?.includes(Constants.REGEX_SINGLE_SLASH + element + '?'))) {
          isWhitelisted = true;
          break;
        }
      }
    }
    if (isWhitelisted) {
      handleRequest(req, res);
      return;
    }
    if (!authHeader) {
      const pathName = parsedUrl?.pathname;
      if (pathName && Constants.EXTENSION_SERVICE_END_POINTS.includes(pathName)) {
        res.setHeader('WWW-Authenticate', Constants.AUTHENTICATION_SCHEME);
        route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, 'application/json', JSON.stringify({ message: CustomMessages.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
      } else {
        route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, 'application/json', JSON.stringify({ message: CustomMessages.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
      }
    } else {
      const pathName = parsedUrl?.pathname;
      if (authHeader && pathName && Constants.EXTENSION_SERVICE_END_POINTS.includes(pathName)) {
        const base64Credentials = authHeader.split(' ')[1];
        base64Credentials === process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE
          ? handleRequest(req, res)
          : route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, 'application/json', JSON.stringify({ message: CustomMessages.ERROR_MSG_INVALID_AUTHENTICATION_CREDENTIALS }));
      } else if (Constants.PAYMENT_CREATE_DESTINATION_URL === requestUrl || Constants.PAYMENT_UPDATE_DESTINATION_URL === requestUrl || Constants.CUSTOMER_UPDATE_DESTINATION_URL === requestUrl || '/captureContext' === requestUrl) {
        const encodedCredentials = authHeader.split(' ')[1];
        const decrypt = paymentUtils.decryption(encodedCredentials);
        decrypt && decrypt === process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE ? handleRequest(req, res) : route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, 'application/json', JSON.stringify({ message: CustomMessages.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
      } else {
        route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, 'application/json', JSON.stringify({ message: CustomMessages.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
      }
    }
  }
}

/**
 * Handles incoming HTTP requests based on their method and URL path.
 * 
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handleRequest = async (req: any, res: any): Promise<void> => {
  const parsedUrl = url.parse(req.url, true);
  const pathName = paymentValidator.validateWhiteListEndPoints(parsedUrl.pathname || '') ? parsedUrl.pathname : '';
  if (pathName) {
    if ('GET' === req.method) {
      switch (pathName) {
        case '/orders': {
          await handleOrders(req, res);
          break;
        }
        case '/orderData': {
          await handleOrdersData(parsedUrl, res);
          break;
        }
        case '/capture': {
          await handleCapture(parsedUrl, res);
          break;
        }
        case '/refund': {
          await handleRefund(parsedUrl, res);
          break;
        }
        case '/authReversal': {
          await handleAuthReversal(parsedUrl, res);
          break;
        }
        case '/paymentDetails': {
          await handlePaymentDetails(parsedUrl, res);
          break;
        }
        case '/paymentData': {
          await handlePaymentsData(parsedUrl, res);
          break;
        }
        case '/sync': {
          await handleSync(req, res);
          break;
        }
        case '/decisionSync': {
          await handleDecisionSync(req, res);
          break;
        }
        case '/configureExtension': {
          await handleConfigureExtensions(req, res);
          break;
        }
        case '/generateHeader': {
          await handlegenerateHeader(req, res);
          break;
        }
        default: {
          paymentUtils.logData(__filename, 'FuncRequestHandler', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_GET_REQUEST);
          res.end('not found');
          break;
        }
      }
    } else if ('POST' === req.method) {
      switch (pathName) {
        case '/api/extension/payment/update': {
          await handlePaymentUpdate(req, res);
          break;
        }
        case '/api/extension/payment/create': {
          await handlePaymentCreate(req, res);
          break;
        }
        case '/api/extension/customer/update': {
          await handleCustomerUpdate(req, res);
          break;
        }
        case '/netTokenNotification': {
          await handlePostNetTokenNotification(req, res);
          break;
        }
        case '/captureContext': {
          await handleCaptureContext(req, res);
          break;
        }
        default: {
          paymentUtils.logData(__filename, 'FuncRequestHandler', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_POST_REQUEST);
          res.end(CustomMessages.ERROR_MSG_NOT_FOUND);
        }
      }
    } else {
      paymentUtils.logData(__filename, 'FuncRequestHandler', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_UNHANDLED_REQUEST_METHOD);
      res.end(CustomMessages.ERROR_MSG_UNHANDLED_REQUEST_METHOD);
    }
  } else {
    paymentUtils.logData(__filename, 'FuncRequestHandler', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_POST_REQUEST);
    res.end(CustomMessages.ERROR_MSG_NOT_FOUND);
  }
};


/**
 * handles payment details view.
 * 
 * @param {any} _req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handlePaymentDetails = async (_req: any, res: any): Promise<void> => {
  const htmlData = fs.readFileSync(path.join(__dirname, '/views/paymentDetails.html'), 'utf8');
  const doc = new JSDOM(htmlData);
  const bodyContent = doc.window.document.body.innerHTML;
  const sanitizedBody = paymentUtils.sanitizeHtml(bodyContent);
  const sanitizedHtmlData = Constants.HTML_PREFIX + sanitizedBody + Constants.HTML_SUFFIX;
  res.setHeader('Content-Security-Policy', "script-src 'self'");
  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, 'text/html', sanitizedHtmlData);
};

/**
 * Retrieves and handles payment data.
 * 
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handlePaymentsData = async (req: any, res: any): Promise<void> => {
  orderErrorMessage = '';
  orderSuccessMessage = '';
  let paymentDetailsApiResponse = {
    paymentId: '',
    locale: '',
    pendingAuthorizedAmount: 0,
    pendingCaptureAmount: 0,
    errorMessage: '',
    paymentDetails: {},
    cartData: {},
    orderNo: ''
  };
  const requestId = paymentUtils.validatePaymentId(req?.query?.id);
  try {
    if (requestId && typeof requestId === Constants.STR_STRING) {
      const paymentId = requestId;
      paymentDetailsApiResponse = await apiHandler.paymentDetailsApi(paymentId);
      if (paymentDetailsApiResponse.errorMessage) {
        errorMessage = paymentDetailsApiResponse.errorMessage;
      }
    } else {
      errorMessage = CustomMessages.ERROR_MSG_EMPTY_PAYMENT_DATA;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, 'FuncHandlePaymentsData', '', exception, '', '', '');
    orderErrorMessage = CustomMessages.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
    res.statusCode = Constants.HTTP_REDIRECT_STATUS_CODE;
    res.setHeader('Location', '/orders');
  }
  const paymentDetailsPage = {
    id: paymentDetailsApiResponse.paymentId,
    payments: paymentDetailsApiResponse.paymentDetails,
    cart: paymentDetailsApiResponse.cartData,
    captureAmount: paymentDetailsApiResponse.pendingCaptureAmount,
    authorizedAmount: paymentDetailsApiResponse.pendingAuthorizedAmount,
    locale: paymentDetailsApiResponse.locale,
    errorMessage: errorMessage,
    successMessage: successMessage,
    refundErrorMessage: CustomMessages.ERROR_MSG_REFUND_AMOUNT,
    captureErrorMessage: CustomMessages.ERROR_MSG_CAPTURE_AMOUNT,
    orderNo: paymentDetailsApiResponse.orderNo
  };
  const response = JSON.stringify(paymentDetailsPage);
  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, 'application/json', response);
};

/**
 *  handles orders view.
 * 
 * @param {any} _req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handleOrders = async (_req: any, res: any): Promise<void> => {
  const htmlData = fs.readFileSync(path.join(__dirname, '/views/orders.html'), 'utf8');
  const doc = new JSDOM(htmlData);
  const bodyContent = doc.window.document.body.innerHTML;
  const sanitizedBody = paymentUtils.sanitizeHtml(bodyContent);
  const sanitizedHtmlData = Constants.HTML_PREFIX + sanitizedBody + Constants.HTML_SUFFIX;
  res.setHeader('Content-Security-Policy', "script-src 'self'");
  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, 'text/html', sanitizedHtmlData);
};

/**
 * Retrieves and handles orders data.
 * 
 * @param {any} _req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handleOrdersData = async (_req: any, res: any): Promise<void> => {
  errorMessage = '';
  successMessage = '';
  const orderPage: { count: number; orderList: PaymentType[]; total: number; moment: any; amountConversion: any; orderErrorMessage: string; orderSuccessMessage: string } = {
    count: 0,
    orderList: [],
    total: 0,
    moment: moment,
    amountConversion: paymentUtils.convertCentToAmount,
    orderErrorMessage: '',
    orderSuccessMessage: '',
  };
  try {
    const ordersList = await commercetoolsApi.getOrders();
    if (ordersList && 0 <= ordersList?.count && 0 <= ordersList?.total) {
      orderPage.count = ordersList.count;
      orderPage.orderList = ordersList.results;
      orderPage.total = ordersList.total;
    } else {
      orderErrorMessage = CustomMessages.ERROR_MSG_NO_ORDER_DETAILS;
    }
  } catch (exception) {
    orderErrorMessage = CustomMessages.ERROR_MSG_NO_ORDER_DETAILS;
  }
  orderPage.orderErrorMessage = orderErrorMessage;
  orderPage.orderSuccessMessage = orderSuccessMessage;
  const response = JSON.stringify(orderPage);
  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, 'application/json', response);
};

/**
 * Handles the payment create endpoint.
 * 
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handlePaymentCreate = async (req: any, res: any): Promise<void> => {
  let response;
  try {
    const body = await paymentUtils.collectRequestData(req);
    const requestObj = await paymentUtils.getRequestObj(body);
    if (null !== requestObj && typeof requestObj === Constants.STR_OBJECT) {
      const paymentObj = requestObj;
      response = await apiHandler.paymentCreateApi(paymentObj);
    } else {
      paymentUtils.logData(__filename, 'FuncHandlePaymentCreate', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_EMPTY_PAYMENT_DATA);
      response = paymentUtils.getEmptyResponse();
    }
  } catch (exception) {
    const paymentId = req?.body?.resource?.obj?.id ? req.body.resource.obj.id : '';
    paymentUtils.logExceptionData(__filename, 'FuncHandlePaymentCreate', '', exception, paymentId, 'PaymentId', '');
    response = paymentUtils.invalidOperationResponse();
  }
  const paymentCreateResponse = JSON.stringify(response);
  res.end(paymentCreateResponse);
};

/**
 * Handles the payment update endpoint.
 * 
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handlePaymentUpdate = async (req: any, res: any): Promise<void> => {
  let updateResponse: any = paymentUtils.getEmptyResponse();
  try {
    const body = await paymentUtils.collectRequestData(req);
    const requestObj = await paymentUtils.getRequestObj(body);
    if (null !== requestObj && typeof requestObj === Constants.STR_OBJECT) {
      const updatePaymentObj = requestObj;
      updateResponse = await apiHandler.paymentUpdateApi(updatePaymentObj);
    }
  } catch (exception) {
    const paymentId = req?.body?.resource?.obj?.id ? req.body.resource.obj.id : '';
    paymentUtils.logExceptionData(__filename, 'FuncHandlePaymentUpdate', '', exception, paymentId, 'PaymentId : ', '');
    updateResponse = paymentUtils.invalidOperationResponse();
  }
  const paymentUpdateResponse = JSON.stringify(updateResponse);
  res.end(paymentUpdateResponse);
};

/**
 * Handles the payment create endpoint.
 * 
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handleCustomerUpdate = async (req: any, res: any): Promise<void> => {
  let response: any = paymentUtils.invalidInputResponse();
  const body = await paymentUtils.collectRequestData(req);
  const requestObj = await paymentUtils.getRequestObj(body);
  if (null !== requestObj && typeof requestObj === Constants.STR_OBJECT) {
    const customerObj = requestObj;
    try {
      response = await apiHandler.customerUpdateApi(customerObj);
    } catch (exception) {
      const customerId = req?.body?.resource?.obj?.id ? req.body.resource.obj.id : '';
      paymentUtils.logExceptionData(__filename, 'FuncHandleCustomerUpdate', '', exception, customerId, 'CustomerId : ', '');
    }
  }
  //If an exception or an error occurs, return the received customer object back
  if (null === response || undefined === response || (0 === response?.actions?.length && 0 === response?.errors?.length) && null !== requestObj && typeof requestObj === Constants.STR_OBJECT) {
    const customerObj = requestObj;
    const customerInfo = await commercetoolsApi.getCustomer(customerObj.id);
    if (customerInfo?.custom?.fields?.isv_tokens && 0 < customerInfo.custom.fields.isv_tokens.length) {
      response = paymentActions.getUpdateTokenActions(customerInfo.custom.fields.isv_tokens, customerInfo.custom.fields.isv_failedTokens, true, customerInfo, null);
    }
  }
  const customerUpdateResponse = JSON.stringify(response);
  res.end(customerUpdateResponse);
}

/**
 * Handles the authorization reversal endpoint.
 * 
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handleAuthReversal = async (req: any, res: any): Promise<void> => {
  let paymentId: string;
  let authReverseApiResponse = {
    errorMessage: '',
    successMessage: '',
  };
  let viewData = '/orders';
  try {
    if (req?.query?.id) {
      const authId = paymentUtils.validatePaymentId(req.query.id);
      if ('' !== authId && typeof authId === Constants.STR_STRING) {
        paymentId = authId;
        authReverseApiResponse = await apiHandler.orderManagementApi(paymentId, undefined, Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION);
        errorMessage = authReverseApiResponse.errorMessage;
        successMessage = authReverseApiResponse.successMessage;
        viewData = `/paymentDetails?id=${paymentId}`;
      }
    } else {
      orderErrorMessage = CustomMessages.ERROR_MSG_CANNOT_PROCESS;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, 'FuncHandleAuthReversal', '', exception, '', '', '');
    orderErrorMessage = CustomMessages.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.statusCode = Constants.HTTP_REDIRECT_STATUS_CODE;
  res.setHeader('Location', viewData);
  res.end();
};

/**
 * Handles the capture endpoint.
 * 
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handleCapture = async (req: any, res: any): Promise<void> => {
  let paymentId: string;
  let captureApiResponse = {
    errorMessage: '',
    successMessage: '',
  };
  let viewData = '/orders';
  try {
    if (req?.query?.captureId && req.query?.captureAmount) {
      const captureId = paymentUtils.validatePaymentId(req.query.captureId);
      const requestAmount = Number(req.query.captureAmount);
      if ('' !== captureId && typeof captureId === Constants.STR_STRING && typeof requestAmount === 'number') {
        paymentId = captureId;
        const captureAmount = requestAmount;
        captureApiResponse = await apiHandler.orderManagementApi(paymentId, captureAmount, Constants.CT_TRANSACTION_TYPE_CHARGE);
        errorMessage = captureApiResponse.errorMessage;
        successMessage = captureApiResponse.successMessage;
        viewData = `/paymentDetails?id=${paymentId}`;
      }
    } else {
      orderErrorMessage = CustomMessages.ERROR_MSG_CANNOT_PROCESS;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, 'FuncHandleCapture', '', exception, '', '', '');
    orderErrorMessage = CustomMessages.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.statusCode = Constants.HTTP_REDIRECT_STATUS_CODE;
  res.setHeader('Location', viewData);
  res.end();
};

/**
 * Handles the refund endpoint.
 * 
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handleRefund = async (req: any, res: any): Promise<void> => {
  let paymentId: string;
  let refundApiResponse = {
    errorMessage: '',
    successMessage: '',
  };
  let viewData = '/orders';
  try {
    if (req?.query?.refundId && req.query?.refundAmount) {
      const refundId = paymentUtils.validatePaymentId(req.query.refundId);
      const requestAmount = Number(req.query.refundAmount);
      if ('' !== refundId && typeof refundId === Constants.STR_STRING && null !== requestAmount && typeof requestAmount === 'number') {
        paymentId = refundId;
        const refundAmount = requestAmount;
        refundApiResponse = await apiHandler.orderManagementApi(paymentId, refundAmount, Constants.CT_TRANSACTION_TYPE_REFUND);
        errorMessage = refundApiResponse.errorMessage;
        successMessage = refundApiResponse.successMessage;
        viewData = `/paymentDetails?id=${paymentId}`;
      }
    } else {
      orderErrorMessage = CustomMessages.ERROR_MSG_CANNOT_PROCESS;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, 'FuncHandleRefund', '', exception, '', '', '');
    orderErrorMessage = CustomMessages.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.statusCode = Constants.HTTP_REDIRECT_STATUS_CODE;
  res.setHeader('Location', viewData);
  res.end();
};

/**
 * Handles network tokenization post endpoint.
 * 
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handlePostNetTokenNotification = async (req: any, res: any): Promise<void> => {
  let response = {
    errorMessage: '',
    successMessage: '',
  };
  let notificationData = req;
  res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
  try {
    if (notificationData && typeof notificationData === Constants.STR_OBJECT) {
      const notification = notificationData;
      response = await apiHandler.notificationApi(notification);
      if (response?.successMessage) {
        res.statusCode = Constants.HTTP_OK_STATUS_CODE;
        paymentUtils.logData(__filename, 'FuncHandlePostNetTokenNotification', Constants.LOG_INFO, '', response.successMessage);
      } else {
        paymentUtils.logData(__filename, 'FuncHandlePostNetTokenNotification', Constants.LOG_INFO, '', response.errorMessage);
      }
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, 'FuncHandlePostNetTokenNotification', '', exception, '', '', '');
  }
  res.end();
};

/**
 * Handles the decision synchronization endpoint.
 * 
 * @param {any} _req - The incoming HTTP request object (not used).
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handleDecisionSync = async (_req: any, res: any): Promise<void> => {
  const decisionSyncResponse = await paymentHandler.handleReport();
  orderSuccessMessage = decisionSyncResponse.message;
  orderErrorMessage = decisionSyncResponse.error;
  res.statusCode = Constants.HTTP_REDIRECT_STATUS_CODE;
  res.setHeader('Location', '/orders');
  res.end();
};

/**
 * Handles the runsync endpoint.
 * 
 * @param {any} _req - The incoming HTTP request object (not used).
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handleSync = async (_req: any, res: any): Promise<void> => {
  const syncResponse = await paymentHandler.handleSync();
  if (process.env.PAYMENT_GATEWAY_RUN_SYNC) {
    await syncHelper.getMissingPaymentDetails();
  }
  orderSuccessMessage = syncResponse.message;
  orderErrorMessage = syncResponse.error;
  res.statusCode = Constants.HTTP_REDIRECT_STATUS_CODE;
  res.setHeader('Location', '/orders');
  await res.end();
};

/**
 * Handles the configuration of extensions endpoint.
 * 
 * @param {any} _req - The incoming HTTP request object (not used).
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handleConfigureExtensions = async (_req: any, res: any): Promise<void> => {
  await resourceHandler.ensureExtension();
  await resourceHandler.ensureCustomTypes();
  orderSuccessMessage = CustomMessages.SUCCESS_MSG_EXTENSION_CREATION;
  res.statusCode = Constants.HTTP_REDIRECT_STATUS_CODE;
  res.setHeader('Location', '/orders');
  await res.end();
};


const handlegenerateHeader = async (_req: any, res: any): Promise<void> => {
  let headerValue: any;
  let response: any;
  if (process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE) {
    headerValue = paymentUtils.encryption(process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE);
    response = headerValue;
    res.setHeader('Content-Security-Policy', "script-src 'self'");
    res.end(response);
  }
}

const handleCaptureContext = async (req: any, res: any): Promise<void> => {
  let response = '';
  const body = await paymentUtils.collectRequestData(req);
  const requestObj = JSON.parse(body);
  try {
    if (null !== requestObj && typeof requestObj === Constants.STR_OBJECT) {
      response = await apiHandler.captureContextApi(requestObj);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, 'FuncHandleCaptureContext', '', exception, '', '', '');
  }
  const captureContextResponse = JSON.stringify(response);
  res.end(captureContextResponse);
}

if (Constants.STRING_AWS === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
  exports.handler = serverless(app.server);
}

