import crypto from 'crypto';
import fs from 'fs';
import http from 'http';
import path from 'path';
import url from 'url';

import { Payment } from '@commercetools/platform-sdk';
import dotenv from 'dotenv';
import { JSDOM } from 'jsdom';
import moment from 'moment';
import serverless from 'serverless-http';

import apiHandler from './apiController';
import { AppHandler } from './app/AppHandler';
import { RouterHandler } from './app/RouterHandler';
import { CustomMessages } from './constants/customMessages';
import { FunctionConstant } from './constants/functionConstant';
import { Constants } from './constants/paymentConstants';
import { testApiConnection } from './testConnection';
import { NotificationBodyType } from './types/Types';
import { ApiError, AuthenticationError, errorHandler, PaymentProcessingError, SystemError, ValidationError } from './utils/ErrorHandler';
import paymentActions from './utils/PaymentActions';
import paymentHandler from './utils/PaymentHandler';
import paymentUtils from './utils/PaymentUtils';
import paymentValidator from './utils/PaymentValidator'
import commercetoolsApi from './utils/api/CommercetoolsApi';
import { createCustomTypes, createExtension } from './utils/config/ResourceHandler';
import authenticationHelper from './utils/helpers/AuthenticationHelper';
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
    console.log(`Extension started in port ${app.port || ''}`);
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
  let isWhitelisted = false;
  let isValidNotification = false;
  const authHeader = req?.headers['authorization'];
  const whitelistUrls = process.env.PAYMENT_GATEWAY_WHITELIST_URLS;
  const requestUrl = req.url;
  let notificationBody: NotificationBodyType;
  let parsedUrl;
  let whitelistUrlArray: string[] = [];
  if (requestUrl) {
    parsedUrl = url.parse(requestUrl, true);
  }
  if (process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT === Constants.STRING_GCP) {
    if ((req.url && Constants.STATIC_FILE_REGEX.test(req.url)) || parsedUrl?.pathname === '/') {
      app.server.emit('request', req, res);
      return;
    }
  }
  if ('/netTokenNotification' === parsedUrl?.pathname) {
    if ('GET' === req.method) {
      res.statusCode = Constants.HTTP_OK_STATUS_CODE;
      res.end();
    } else if ('POST' === req.method) {
      if (process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT === Constants.STRING_GCP) {
        notificationBody = (req as any).body;
        const vcSignature = req?.headers['v-c-signature'];
        if (vcSignature && notificationBody) {
          isValidNotification = await authenticationHelper.authenticateNetToken(vcSignature, notificationBody);
          if (isValidNotification) {
            await handlePostNetTokenNotification(notificationBody, res);
          }
        }
        if (!isValidNotification) {
          errorHandler.logError(new AuthenticationError(CustomMessages.ERROR_MSG_SIGNATURE_DOES_NOT_MATCH, '', FunctionConstant.FUNC_AUTHENTICATION), __filename, '');
          res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
          res.end();
        }
      }
      else {
        let body = '';
        req.on('data', (chunk: { toString: () => string }) => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          notificationBody = JSON.parse(body);
          const vcSignature = req?.headers['v-c-signature'];
          if (vcSignature && notificationBody) {
            isValidNotification = await authenticationHelper.authenticateNetToken(vcSignature, notificationBody);
            if (isValidNotification) {
              await handlePostNetTokenNotification(notificationBody, res);
            }
          }
          if (!isValidNotification) {
            errorHandler.logError(new AuthenticationError(CustomMessages.ERROR_MSG_SIGNATURE_DOES_NOT_MATCH, '', FunctionConstant.FUNC_AUTHENTICATION), __filename, '');
            res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
            res.end();
          }
        });
      }
    } else {
      errorHandler.logError(new ValidationError(CustomMessages.ERROR_MSG_UNHANDLED_REQUEST_METHOD, '', FunctionConstant.FUNC_AUTHENTICATION), __filename, '');
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
        route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, Constants.CONTENT_TYPE_JSON, JSON.stringify({ message: CustomMessages.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
      } else {
        route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, Constants.CONTENT_TYPE_JSON, JSON.stringify({ message: CustomMessages.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
      }
    } else {
      const pathName = parsedUrl?.pathname;
      if (authHeader && pathName && Constants.EXTENSION_SERVICE_END_POINTS.includes(pathName)) {
        const base64Credentials = authHeader.split(' ')[1];
        base64Credentials === process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE
          ? handleRequest(req, res)
          : route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, Constants.CONTENT_TYPE_JSON, JSON.stringify({ message: CustomMessages.ERROR_MSG_INVALID_AUTHENTICATION_CREDENTIALS }));
      } else if (Constants.PAYMENT_CREATE_DESTINATION_URL === requestUrl || Constants.PAYMENT_UPDATE_DESTINATION_URL === requestUrl || Constants.CUSTOMER_UPDATE_DESTINATION_URL === requestUrl || '/captureContext' === requestUrl) {
        const encodedCredentials = authHeader.split(' ')[1];
        const decrypt = authenticationHelper.decryption(encodedCredentials);
        decrypt && decrypt === process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE ? handleRequest(req, res) : route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, Constants.CONTENT_TYPE_JSON, JSON.stringify({ message: CustomMessages.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
      } else {
        route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, Constants.CONTENT_TYPE_JSON, JSON.stringify({ message: CustomMessages.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
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
  const parsedUrl = paymentUtils.sanitizeAndValidateUrl(req);
  const pathName = paymentValidator.validateWhiteListEndPoints(parsedUrl?.pathname || '') ? parsedUrl?.pathname : '';
  const methodHandlers: Record<string, Record<string, (req: any, res: any) => Promise<void>>> = {
    'GET': {
      '/orders': handleOrders,
      '/orderData': (_req, res) => handleOrdersData(parsedUrl, res),
      '/capture': (_req, res) => handleCapture(parsedUrl, res),
      '/refund': (_req, res) => handleRefund(parsedUrl, res),
      '/authReversal': (_req, res) => handleAuthReversal(parsedUrl, res),
      '/paymentDetails': (_req, res) => handlePaymentDetails(parsedUrl, res),
      '/paymentData': (_req, res) => handlePaymentsData(parsedUrl, res),
      '/sync': handleSync,
      '/decisionSync': handleDecisionSync,
      '/configureExtension': handleConfigureExtensions,
      '/generateHeader': handleGenerateHeader,
      '/testConnection': handleTestConnection
    },
    'POST': {
      '/api/extension/payment/update': handlePaymentUpdate,
      '/api/extension/payment/create': handlePaymentCreate,
      '/api/extension/customer/update': handleCustomerUpdate,
      '/netTokenNotification': handlePostNetTokenNotification,
      '/captureContext': handleCaptureContext
    }
  };
  if (!pathName) {
    return route.sendResponse(res, Constants.HTTP_NOT_FOUND_STATUS_CODE, Constants.CONTENT_TYPE_TEXT_PLAIN, CustomMessages.ERROR_MSG_NOT_FOUND);
  }
  const handler = methodHandlers[req.method]?.[pathName];
  if (handler) {
    try {
      await handler(req, res);
    } catch (exception) {
      errorHandler.logError(new ApiError(CustomMessages.ERROR_MSG_API_EXECUTION, exception, FunctionConstant.FUNC_REQUEST_HANDLER), __filename, '');
      return route.sendResponse(res, 500, Constants.CONTENT_TYPE_TEXT_PLAIN, CustomMessages.ERROR_MSG_INTERNAL_SERVER_ERROR);
    }
  } else {
    const handleRequestMessage = req.method === 'GET' ? CustomMessages.ERROR_MSG_GET_REQUEST : CustomMessages.ERROR_MSG_POST_REQUEST;
    errorHandler.logError(new ValidationError(handleRequestMessage, '', FunctionConstant.FUNC_REQUEST_HANDLER), __filename, '');
    return route.sendResponse(res, Constants.HTTP_NOT_FOUND_STATUS_CODE, Constants.CONTENT_TYPE_TEXT_PLAIN, CustomMessages.ERROR_MSG_NOT_FOUND);
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
  let sanitizedHtmlData = '';
  const doc = new JSDOM(htmlData);
  const bodyContent = doc.window.document.body.innerHTML;
  const sanitizedBody = paymentUtils.sanitizeHtml(bodyContent);

  const nonce = crypto.randomBytes(16).toString('base64');
  if (process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT === Constants.STRING_GCP) {
    const gcpFuncName = process.env.PAYMENT_GATEWAY_GCP_FUNCTION_NAME || '';
    const setLinkScript = paymentUtils.getSetLinkScript('paymentDetails', nonce);
    sanitizedHtmlData = paymentUtils.injectScripts(sanitizedBody, gcpFuncName, nonce, setLinkScript);
  } else {
    sanitizedHtmlData = Constants.HTML_PREFIX + sanitizedBody + Constants.HTML_SUFFIX;
  }
  res.setHeader('Content-Security-Policy', `script-src 'self' 'nonce-${nonce}'`);
  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, Constants.CONTENT_TYPE_TEXT_HTML, sanitizedHtmlData);
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
    errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_MSG_PAYMENT_DETAILS_API, exception, FunctionConstant.FUNC_HANDLE_PAYMENTS_DATA), __filename, '');
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
  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, Constants.CONTENT_TYPE_JSON, response);
};

/**
 *  handles orders view.
 * 
 * @param {any} _req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handleOrders = async (_req: any, res: any): Promise<void> => {
  let htmlData = fs.readFileSync(path.join(__dirname, '/views/orders.html'), 'utf8');
  const doc = new JSDOM(htmlData);
  const bodyContent = doc.window.document.body.innerHTML;
  const sanitizedBody = paymentUtils.sanitizeHtml(bodyContent);
  let sanitizedHtmlData = '';
  const nonce = crypto.randomBytes(16).toString('base64');
  if (process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT === Constants.STRING_GCP) {
    const gcpFuncName = process.env.PAYMENT_GATEWAY_GCP_FUNCTION_NAME || '';
    const setLinkScript = paymentUtils.getSetLinkScript('orders', nonce);
    sanitizedHtmlData = paymentUtils.injectScripts(sanitizedBody, gcpFuncName, nonce, setLinkScript);
  } else {
    sanitizedHtmlData = Constants.HTML_PREFIX + sanitizedBody + Constants.HTML_SUFFIX;
  }
  res.setHeader('Content-Security-Policy', `script-src 'self' 'nonce-${nonce}'`);
  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, Constants.CONTENT_TYPE_TEXT_HTML, sanitizedHtmlData);
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
  const orderPage: { count: number; orderList: Payment[]; total: number; moment: any; amountConversion: any; orderErrorMessage: string; orderSuccessMessage: string } = {
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
  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, Constants.CONTENT_TYPE_JSON, response);
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
    const requestObj = await paymentUtils.getRequestPayload(req);
    if (null !== requestObj && typeof requestObj === Constants.STR_OBJECT) {
      const paymentObj = requestObj;
      response = await apiHandler.paymentCreateApi(paymentObj);
    } else {
      errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_EMPTY_PAYMENT_DATA, '', FunctionConstant.FUNC_HANDLE_PAYMENT_CREATE), __filename, '');
      response = paymentUtils.getEmptyResponse();
    }
  } catch (exception) {
    const paymentId = req?.body?.resource?.obj?.id ? req.body.resource.obj.id : '';
    errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_CREATE_PAYMENT_API, exception, FunctionConstant.FUNC_HANDLE_PAYMENT_CREATE), __filename, encodeURI(paymentId));
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
    const requestObj = await paymentUtils.getRequestPayload(req);
    if (null !== requestObj && typeof requestObj === Constants.STR_OBJECT) {
      const updatePaymentObj = requestObj;
      updateResponse = await apiHandler.paymentUpdateApi(updatePaymentObj);
    }
  } catch (exception) {
    const paymentId = req?.body?.resource?.obj?.id ? req.body.resource.obj.id : '';
    errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_UPDATE_PAYMENT_API, exception, FunctionConstant.FUNC_HANDLE_PAYMENT_UPDATE), __filename, encodeURI(paymentId));
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
  const requestObj = await paymentUtils.getRequestPayload(req);
  if (null !== requestObj && typeof requestObj === Constants.STR_OBJECT) {
    const customerObj = requestObj;
    try {
      response = await apiHandler.customerUpdateApi(customerObj);
    } catch (exception) {
      const customerId = req?.body?.resource?.obj?.id ? req.body.resource.obj.id : '';
      errorHandler.logError(new SystemError(CustomMessages.EXCEPTION_UPDATE_CUSTOMER_API, exception, FunctionConstant.FUNC_HANDLE_CUSTOMER_UPDATE), __filename, encodeURI(customerId));
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
  let viewData = paymentUtils.getApiPath('orders');
  let authReverseApiResponse = {
    errorMessage: '',
    successMessage: '',
  };
  try {
    if (req?.query?.id) {
      const authId = paymentUtils.validatePaymentId(req.query.id);
      if ('' !== authId && typeof authId === Constants.STR_STRING) {
        paymentId = authId;
        authReverseApiResponse = await apiHandler.orderManagementApi(paymentId, undefined, Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION);
        errorMessage = authReverseApiResponse.errorMessage;
        successMessage = authReverseApiResponse.successMessage;
        if (paymentUtils.validateId(paymentId)) {
          viewData = paymentUtils.getApiPath(`paymentDetails?id=${encodeURIComponent(paymentId)}`);
        }
      }
    } else {
      orderErrorMessage = CustomMessages.ERROR_MSG_CANNOT_PROCESS;
    }
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_REVERSAL_SERVICE, exception, FunctionConstant.FUNC_HANDLE_AUTH_REVERSAL), __filename, '');
    orderErrorMessage = CustomMessages.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  route.sendResponse(res, Constants.HTTP_REDIRECT_STATUS_CODE, '', '', { header: 'Location', view: viewData });
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
  let viewData = paymentUtils.getApiPath('orders');
  let captureApiResponse = {
    errorMessage: '',
    successMessage: '',
  };
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
        if (paymentUtils.validateId(paymentId)) {
          viewData = paymentUtils.getApiPath(`paymentDetails?id=${encodeURIComponent(paymentId)}`);
        }
      }
    } else {
      orderErrorMessage = CustomMessages.ERROR_MSG_CANNOT_PROCESS;
    }
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_CAPTURE_SERVICE, exception, FunctionConstant.FUNC_HANDLE_CAPTURE), __filename, '');
    orderErrorMessage = CustomMessages.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  route.sendResponse(res, Constants.HTTP_REDIRECT_STATUS_CODE, '', '', { header: 'Location', view: viewData });
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
  let viewData = paymentUtils.getApiPath('orders');
  let refundApiResponse = {
    errorMessage: '',
    successMessage: '',
  };
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
        if (paymentUtils.validateId(paymentId)) {
          viewData = paymentUtils.getApiPath(`paymentDetails?id=${encodeURIComponent(paymentId)}`);
        }
      }
    } else {
      orderErrorMessage = CustomMessages.ERROR_MSG_CANNOT_PROCESS;
    }
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_REFUND_SERVICE, exception, FunctionConstant.FUNC_HANDLE_REFUND), __filename, '');
    orderErrorMessage = CustomMessages.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.statusCode = Constants.HTTP_REDIRECT_STATUS_CODE;
  res.setHeader('Location', paymentUtils.validateRedirectPaths(viewData));
  res.end();
};

/**
 * Handles network tokenization post endpoint.
 * 
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handlePostNetTokenNotification = async (req: NotificationBodyType, res: any): Promise<void> => {
  res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
  let response = {
    errorMessage: '',
    successMessage: '',
  };
  let notificationData = req;
  try {
    if (notificationData && typeof notificationData === Constants.STR_OBJECT) {
      const notification = notificationData;
      response = await apiHandler.notificationApi(notification);
      if (response?.successMessage) {
        res.statusCode = Constants.HTTP_OK_STATUS_CODE;
        paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION, Constants.LOG_INFO, '', response.successMessage);
      } else {
        errorHandler.logError(new ApiError(response.errorMessage, '', FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION), __filename, '');
      }
    }
  } catch (exception) {
    errorHandler.logError(new ApiError(CustomMessages.ERROR_MSG_API_EXECUTION, exception, FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION), __filename, '');
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
  const redirectPath = paymentUtils.getApiPath('orders');
  res.setHeader('Location', redirectPath)
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
  if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_RUN_SYNC)) {
    await syncHelper.getMissingPaymentDetails();
  }
  orderSuccessMessage = syncResponse.message;
  orderErrorMessage = syncResponse.error;
  const redirectPath = paymentUtils.getApiPath('orders');
  res.statusCode = Constants.HTTP_REDIRECT_STATUS_CODE;
  res.setHeader('Location', redirectPath);
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
  await createExtension();
  await createCustomTypes();
  orderSuccessMessage = CustomMessages.SUCCESS_MSG_EXTENSION_CREATION;
  const redirectPath = paymentUtils.getApiPath('orders');
  res.statusCode = Constants.HTTP_REDIRECT_STATUS_CODE;
  res.setHeader('Location', redirectPath);
  await res.end();
};

/**
 * Generates and sends a header value after encrypting it.
 *
 * @async
 * @function handleGenerateHeader
 * @param {any} _req - The incoming request object.
 * @param {any} res - The response object used to send the header.
 * @returns {Promise<void>} Resolves when the header has been set and response sent.
 */
const handleGenerateHeader = async (_req: any, res: any): Promise<void> => {
  let headerValue: any;
  let response: any;
  if (process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE) {
    headerValue = authenticationHelper.encryption(process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE);
    response = headerValue;
    res.setHeader('Content-Security-Policy', "script-src 'self'");
    res.end(response);
  }
}

/**
 * Handles the capture context by processing the request data and calling the capture API.
 *
 * @async
 * @function handleCaptureContext
 * @param {any} req - The incoming request object.
 * @param {any} res - The response object used to send the response.
 * @returns {Promise<void>} Resolves when the response has been sent.
 */
const handleCaptureContext = async (req: any, res: any): Promise<void> => {
  let response = '';
  let requestObj;
  if (process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT === Constants.STRING_GCP) {
    requestObj = req?.body;
  }
  else {
    const body = await paymentUtils.collectRequestData(req);
    requestObj = JSON.parse(body);
  }
  if (null !== requestObj && typeof requestObj === Constants.STR_OBJECT) {
    try {
      response = await apiHandler.captureContextApi(requestObj);
    } catch (exception) {
      errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_CAPTURE_CONTEXT, exception, FunctionConstant.FUNC_HANDLE_CAPTURE_CONTEXT), __filename, '');
    }
  }
  const captureContextResponse = JSON.stringify(response);
  res.end(captureContextResponse);
};

const handleTestConnection = async (_req: any, res: any): Promise<void> => {
  let testApiResponse = '';
  try {
    let isEndPointLimitViolated = authenticationHelper.rateLimitEndpointAccess();
    if (!isEndPointLimitViolated) {
      testApiResponse = await testApiConnection();
    } else {
      testApiResponse = CustomMessages.ERROR_MSG_LIMIT_REACHED;
    }
  } catch (exception) {
    errorHandler.logError(new ApiError(CustomMessages.ERROR_MSG_API_EXECUTION, exception, FunctionConstant.FUNC_HANDLE_TEST_CONNECTION), __filename, '');
  }
  res.end(testApiResponse);
};

if (Constants.STRING_GCP === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
  exports.handler = (req: any, res: any) => {
    const corsOrigin = '*';
    res.set('Access-Control-Allow-Origin', corsOrigin);
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    authentication(req, res);
  };
}

if (Constants.STRING_AWS === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
  exports.handler = serverless(app.server);
}

