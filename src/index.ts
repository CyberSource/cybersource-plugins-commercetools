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
import { ApiError, errorHandler, PaymentProcessingError, ValidationError } from './utils/ErrorHandler';
import paymentActions from './utils/PaymentActions';
import paymentHandler from './utils/PaymentHandler';
import paymentUtils from './utils/PaymentUtils';
import paymentValidator from './utils/PaymentValidator';
import commercetoolsApi from './utils/api/CommercetoolsApi';
import { createCustomTypes, createExtension } from './utils/config/ResourceHandler';
import authenticationHelper from './utils/helpers/AuthenticationHelper';
import networkTokenHelper from './utils/helpers/NetworkTokenHelper';
import syncHelper from './utils/helpers/SyncHelper';
import webhookHelper from './utils/helpers/WebhookHelper';

let errorMessage = '';
let successMessage = '';
let orderSuccessMessage = '';
let orderErrorMessage = '';
let port: number;

dotenv.config();

const safeTimingSafeEqual = (left: string, right: string): boolean => {
  if (!left || !right) {
    return false;
  }

  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

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

  const authHeader = req?.headers['authorization'];
  const whitelistUrls = process.env.PAYMENT_GATEWAY_WHITELIST_URLS;
  const requestUrl = req.url;

  let notificationBody: NotificationBodyType;
  let parsedUrl;
  let whitelistUrlArray: string[] = [];

  if (requestUrl) {
    parsedUrl = url.parse(requestUrl, true);
  }

  if (Constants.STRING_GCP === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
    if (Constants.STATIC_FILE_REGEX.test(parsedUrl?.pathname || '') || '/' === parsedUrl?.pathname) {
      app.server.emit('request', req, res);
      return;
    }
  }

  if ('/netTokenNotification' === parsedUrl?.pathname) {
    if ('GET' === req.method) {
      res.statusCode = Constants.HTTP_OK_STATUS_CODE;
      res.end();
      return;
    }

    if ('POST' !== req.method) {
      errorHandler.logError(new ValidationError(CustomMessages.ERROR_MSG_UNHANDLED_REQUEST_METHOD, '', FunctionConstant.FUNC_AUTHENTICATION), __filename, '');
      res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
      res.end();
      return;
    }

    if (Constants.STRING_GCP === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
      let rawGcpBody = paymentUtils.sanitizeUserInput((req as any).body);

      const decryptResult = await webhookHelper.decryptNotificationPayload(rawGcpBody, true);

      if (!decryptResult) {
        res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
        res.end();
        return;
      }

      notificationBody = decryptResult.notificationBody;
      await webhookHelper.validateAndProcessNetTokenNotification(notificationBody, req, res, decryptResult.wasDecrypted);

      return;
    }

    try {
      const parsed = await webhookHelper.parseRequestBody(req);

      const decryptResult = await webhookHelper.decryptNotificationPayload(parsed, false);

      if (!decryptResult) {
        res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
        res.end();
        return;
      }

      notificationBody = decryptResult.notificationBody;
      await webhookHelper.validateAndProcessNetTokenNotification(notificationBody, req, res, decryptResult.wasDecrypted);
    } catch (err) {
      errorHandler.logError(new ValidationError(CustomMessages.ERROR_MSG_INVALID_NOTIFICATION_DATA, '', FunctionConstant.FUNC_AUTHENTICATION), __filename, '');
      res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
      res.end();
    }

    return;
  }
  if ('/fraudNotification' === parsedUrl?.pathname) {
    if ('GET' === req.method) {
      res.statusCode = Constants.HTTP_OK_STATUS_CODE;
      res.end();
      return;
    }

    if ('POST' !== req.method) {
      errorHandler.logError(new ValidationError(CustomMessages.ERROR_MSG_UNHANDLED_REQUEST_METHOD, '', FunctionConstant.FUNC_AUTHENTICATION), __filename, '');
      res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
      res.end();
      return;
    }

    if (Constants.STRING_GCP === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
      await handleFraudNotification(webhookHelper.sanitizeNotificationData((req as any).body), res);
      return;
    }

    let fraudBody = '';

    req.on('data', (chunk: { toString: () => string }) => {
      fraudBody += chunk.toString();
    });

    req.on('end', async () => {
      let notificationData: NotificationBodyType;

      try {
        notificationData = webhookHelper.sanitizeNotificationData(JSON.parse(fraudBody));
      } catch {
        errorHandler.logError(new ValidationError(CustomMessages.ERROR_MSG_INVALID_NOTIFICATION_DATA, '', 'handleFraudNotification'), __filename, '');
        res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
        res.end();
        return;
      }

      await handleFraudNotification(notificationData, res);
    });

    return;
  }
  if (whitelistUrls) {
    whitelistUrlArray = whitelistUrls.split(Constants.REGEX_COMMA);

    for (const element of whitelistUrlArray) {
      if (Constants.REGEX_SINGLE_SLASH + element === parsedUrl?.pathname || (parsedUrl && parsedUrl.pathname?.includes(Constants.REGEX_SINGLE_SLASH + element + '?'))) {
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

    return;
  }

  const pathName = parsedUrl?.pathname;

  if (authHeader && pathName && Constants.EXTENSION_SERVICE_END_POINTS.includes(pathName)) {
    const base64Credentials = authHeader.split(' ')[1];
    const expectedValue = process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE || '';
    const credentialMatch = safeTimingSafeEqual(base64Credentials || '', expectedValue);

    credentialMatch ? handleRequest(req, res) : route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, Constants.CONTENT_TYPE_JSON, JSON.stringify({ message: CustomMessages.ERROR_MSG_INVALID_AUTHENTICATION_CREDENTIALS }));

    return;
  }

  if (
    Constants.PAYMENT_CREATE_DESTINATION_URL === requestUrl ||
    Constants.PAYMENT_UPDATE_DESTINATION_URL === requestUrl ||
    Constants.CUSTOMER_UPDATE_DESTINATION_URL === requestUrl ||
    Constants.CAPTURE_CONTEXT_DESTINATION_URL === requestUrl ||
    Constants.CHECKOUT_SESSION_DESTINATION_URL === requestUrl ||
    Constants.REFRESH_SAVED_TOKENS_DESTINATION_URL === requestUrl
  ) {
    const encodedCredentials = authHeader.split(' ')[1];
    const decrypt = authenticationHelper.decryption(encodedCredentials);
    const expectedVal = process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE || '';
    const decryptMatch = safeTimingSafeEqual(decrypt || '', expectedVal);

    decryptMatch ? handleRequest(req, res) : route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, Constants.CONTENT_TYPE_JSON, JSON.stringify({ message: CustomMessages.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));

    return;
  }

  route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, Constants.CONTENT_TYPE_JSON, JSON.stringify({ message: CustomMessages.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
}

const handleRequest = async (req: any, res: any): Promise<void> => {
  const parsedUrl = paymentUtils.sanitizeAndValidateUrl(req);
  const pathName = paymentValidator.validateWhiteListEndPoints(parsedUrl?.pathname || '') ? parsedUrl?.pathname : '';

  const methodHandlers: Record<string, Record<string, (req: any, res: any) => Promise<void>>> = {
    GET: {
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
      '/testConnection': handleTestConnection,
    },
    POST: {
      '/api/extension/payment/update': handlePaymentUpdate,
      '/api/extension/payment/create': handlePaymentCreate,
      '/api/extension/customer/update': handleCustomerUpdate,
      '/netTokenNotification': handlePostNetTokenNotification,
      '/captureContext': handleCaptureContext,
      '/refreshSavedTokens': handleRefreshSavedTokens,
    },
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
    const handleRequestMessage = 'GET' === req.method ? CustomMessages.ERROR_MSG_GET_REQUEST : CustomMessages.ERROR_MSG_POST_REQUEST;

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
  const doc = new JSDOM(htmlData);
  const bodyContent = doc.window.document.body.innerHTML;
  const sanitizedBody = paymentUtils.sanitizeHtml(bodyContent);

  let sanitizedHtmlData = '';
  const nonce = crypto.randomBytes(16).toString('base64');

  if (Constants.STRING_GCP === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
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
    orderNo: '',
  };
  const requestId = paymentUtils.validatePaymentId(paymentUtils.sanitizeUserInput(req?.query?.id));

  try {
    if (requestId && Constants.STR_STRING === typeof requestId) {
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
    errorMessage,
    successMessage,
    refundErrorMessage: CustomMessages.ERROR_MSG_REFUND_AMOUNT,
    captureErrorMessage: CustomMessages.ERROR_MSG_CAPTURE_AMOUNT,
    orderNo: paymentDetailsApiResponse.orderNo,
  };

  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, Constants.CONTENT_TYPE_JSON, JSON.stringify(paymentDetailsPage));
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

  let sanitizedHtmlData = '';
  const nonce = crypto.randomBytes(16).toString('base64');

  if (Constants.STRING_GCP === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
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

  const orderPage: {
    count: number;
    orderList: Payment[];
    total: number;
    moment: any;
    amountConversion: any;
    orderErrorMessage: string;
    orderSuccessMessage: string;
  } = {
    count: 0,
    orderList: [],
    total: 0,
    moment,
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
  } catch {
    orderErrorMessage = CustomMessages.ERROR_MSG_NO_ORDER_DETAILS;
  }

  orderPage.orderErrorMessage = orderErrorMessage;
  orderPage.orderSuccessMessage = orderSuccessMessage;

  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, Constants.CONTENT_TYPE_JSON, JSON.stringify(orderPage));
};
/**
 * Handles the payment create endpoint.
 *
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */
const handlePaymentCreate = async (req: any, res: any): Promise<void> => {
  let response: any = paymentUtils.getEmptyResponse();

  try {
    const requestObj = await paymentUtils.getRequestPayload(req);

    if (null !== requestObj && Constants.STR_OBJECT === typeof requestObj) {
      response = await apiHandler.paymentCreateApi(requestObj);
    }
  } catch (exception) {
    const paymentId = req?.body?.resource?.obj?.id ? req.body.resource.obj.id : '';

    errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_CREATE_PAYMENT_API, exception, FunctionConstant.FUNC_HANDLE_PAYMENT_CREATE), __filename, encodeURI(paymentId));
  }

  res.end(JSON.stringify(response));
};

const handlePaymentUpdate = async (req: any, res: any): Promise<void> => {
  let response = paymentUtils.getEmptyResponse();
  try {
    const requestObj = await paymentUtils.getRequestPayload(req);
    if (requestObj && Constants.STR_OBJECT === typeof requestObj) {
      response = await apiHandler.paymentUpdateApi(requestObj);
    }
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_UPDATE_PAYMENT_API, exception, FunctionConstant.FUNC_HANDLE_PAYMENT_UPDATE), __filename, '');
    response = paymentUtils.invalidOperationResponse();
  }
  res.end(JSON.stringify(paymentUtils.validateActionResponse(response)));
};

/**
 * Handles the customer update endpoint.
 *
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */

const handleCustomerUpdate = async (req: any, res: any): Promise<void> => {
  let response: any = paymentUtils.getEmptyResponse();

  const requestObj = await paymentUtils.getRequestPayload(req);

  if (!requestObj || Constants.STR_OBJECT !== typeof requestObj) {
    res.end(JSON.stringify(response));
    return;
  }

  const requestActions = Array.isArray(requestObj.actions) ? requestObj.actions : [];

  const hasNewUcToken = Constants.STR_STRING === typeof requestObj?.custom?.fields?.isv_token && 0 < requestObj.custom.fields.isv_token.trim().length;
  const isTokenFieldUpdateRequest =
    !hasNewUcToken &&
    (requestActions.some((action: any) => Constants.SET_CUSTOM_FIELD === action?.action && Constants.ISV_TOKENS === action?.name) ||
      (Array.isArray(requestObj?.custom?.fields?.isv_tokens) && requestObj.custom.fields.isv_tokens.length > 0 && !requestObj?.custom?.fields?.isv_tokenAction && !requestObj?.custom?.fields?.isv_addressId));

  if (isTokenFieldUpdateRequest) {
    res.end(JSON.stringify(paymentUtils.getEmptyResponse()));
    return;
  }

  try {
    response = await apiHandler.customerUpdateApi(requestObj);
  } catch (exception) {
    const customerId = req?.body?.resource?.obj?.id ? req.body.resource.obj.id : '';

    paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_CUSTOMER_UPDATE, Constants.LOG_ERROR, 'CustomerId: ' + customerId, CustomMessages.EXCEPTION_UPDATE_CUSTOMER_API + ': ' + (exception instanceof Error ? exception.message : String(exception)));
  }

  if (null === response || undefined === response || (0 === response?.actions?.length && 0 === response?.errors?.length)) {
    const customerInfo = await commercetoolsApi.getCustomer(requestObj.id);

    if (customerInfo?.custom?.fields?.isv_tokens && customerInfo.custom.fields.isv_tokens.length > 0) {
      const customerId = customerInfo?.id || '';
      const originalTokenCount = customerInfo.custom.fields.isv_tokens.length;

      try {
        const refreshedTokens = await networkTokenHelper.refreshNetworkTokenCards(customerInfo.custom.fields.isv_tokens, customerInfo);

        response = paymentActions.getUpdateTokenActions(refreshedTokens, customerInfo.custom.fields.isv_failedTokens, true, customerInfo, null);
      } catch (error) {
        paymentUtils.logData(__filename, 'HandleSavedCardLoadingEndpoint', Constants.LOG_WARN, 'CustomerId: ' + customerId, 'Network Token refresh failed during saved card loading. Error: ' + (error instanceof Error ? error.message : String(error)) + '. Returning original ' + originalTokenCount + ' tokens.');
        response = paymentActions.getUpdateTokenActions(customerInfo.custom.fields.isv_tokens, customerInfo.custom.fields.isv_failedTokens, true, customerInfo, null);
      }
    }
  }

  res.end(JSON.stringify(response));
};


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

      if (Constants.STR_STRING === typeof authId && '' !== authId) {
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
 * Handles the refresh status endpoint.
 *
 * @param {any} req - The incoming HTTP request object.
 * @param {any} res - The server response object.
 * @returns {Promise<void>} - A promise resolving to void.
 */

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

      // if (Constants.STR_STRING === typeof captureId && '' !== captureId && Number.isFinite(requestAmount) && 0 < requestAmount) {
      if ('' !== captureId && typeof captureId === Constants.STR_STRING && typeof requestAmount === 'number') {
        paymentId = captureId;

        captureApiResponse = await apiHandler.orderManagementApi(paymentId, requestAmount, Constants.CT_TRANSACTION_TYPE_CHARGE);

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

      if (Constants.STR_STRING === typeof refundId && '' !== refundId && 'number' === typeof requestAmount) {
        paymentId = refundId;

        refundApiResponse = await apiHandler.orderManagementApi(paymentId, requestAmount, Constants.CT_TRANSACTION_TYPE_REFUND);

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

  const redirectPath = paymentUtils.validateRedirectPaths(viewData);

  if (Constants.STR_STRING === typeof redirectPath && redirectPath.startsWith('/')) {
    res.setHeader('Location', redirectPath);
  } else {
    res.setHeader('Location', '/orders');
  }

  res.end();
};

const handlePostNetTokenNotification = async (req: NotificationBodyType, res: any): Promise<void> => {
  res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;

  let response = {
    errorMessage: '',
    successMessage: '',
  };

  const notificationData = req;

  const isUcOrderEvent = Constants.UC_ORDER_TRANSACTION_RESULT_EVENT === (notificationData as any)?.eventType;
  try {
    const webhookEventType = String((notificationData as any)?.eventType || '');
    const maskedWebhookPayload = paymentUtils.maskData(JSON.stringify(notificationData || {}));
    paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION, Constants.LOG_INFO, '', 'Incoming webhook payload received. eventType=' + webhookEventType + ', payload=' + maskedWebhookPayload);
  } catch (logException) {
    errorHandler.logError(new ApiError(CustomMessages.ERROR_MSG_API_EXECUTION, logException, FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION), __filename, '');
  }

  try {
    if (notificationData && Constants.STR_OBJECT === typeof notificationData) {
      response = await apiHandler.notificationApi(notificationData);

      try {
        const webhookEventType = String((notificationData as any)?.eventType || '');
        const maskedNotificationResponse = paymentUtils.maskData(JSON.stringify(response || {}));
        paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION, Constants.LOG_INFO, '', 'Webhook notification processing response. eventType=' + webhookEventType + ', response=' + maskedNotificationResponse);
      } catch (responseLogException) {
        errorHandler.logError(new ApiError(CustomMessages.ERROR_MSG_API_EXECUTION, responseLogException, FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION), __filename, '');
      }

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

  if (isUcOrderEvent) {
    await paymentUtils.performUCStatusValidation(notificationData);
  }
};
const handleFraudNotification = async (notificationData: NotificationBodyType, res: any): Promise<void> => {
  res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;

  let response = {
    errorMessage: '',
    successMessage: '',
  };

  try {
    if (notificationData && Constants.STR_OBJECT === typeof notificationData) {
      const sanitizedNotificationForLog = paymentUtils.sanitizeUserInput(notificationData);
      paymentUtils.logData(__filename, 'handleFraudNotification', Constants.LOG_INFO, '', '[INCOMING FRAUD NOTIFICATION WEBHOOK] ' + JSON.stringify(sanitizedNotificationForLog));

      response = await apiHandler.fraudNotificationApi(notificationData);

      const sanitizedResponseForLog = paymentUtils.sanitizeUserInput(response);
      paymentUtils.logData(__filename, 'handleFraudNotification', Constants.LOG_INFO, '', 'Fraud webhook API response: ' + JSON.stringify(sanitizedResponseForLog));

      if (response?.successMessage) {
        res.statusCode = Constants.HTTP_OK_STATUS_CODE;

        paymentUtils.logData(__filename, 'handleFraudNotification', Constants.LOG_INFO, '', String(paymentUtils.sanitizeUserInput(response.successMessage)));
      } else {
        errorHandler.logError(new ApiError(response.errorMessage, '', 'handleFraudNotification'), __filename, '');
      }
    }
  } catch (exception) {
    errorHandler.logError(new ApiError(CustomMessages.ERROR_MSG_API_EXECUTION, exception, 'handleFraudNotification'), __filename, '');
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
  res.setHeader('Location', paymentUtils.getApiPath('orders'));
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

  res.statusCode = Constants.HTTP_REDIRECT_STATUS_CODE;
  res.setHeader('Location', paymentUtils.getApiPath('orders'));
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

  res.statusCode = Constants.HTTP_REDIRECT_STATUS_CODE;
  res.setHeader('Location', paymentUtils.getApiPath('orders'));
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
  if (process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE) {
    const headerValue = authenticationHelper.encryption(process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE);

    res.setHeader('Content-Security-Policy', "script-src 'self'");
    res.end(headerValue);
  }
};
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
  let response: any = '';
  let requestObj;

  try {
    if (Constants.STRING_GCP === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
      requestObj = paymentUtils.sanitizeUserInput(req?.body);
    } else {
      const body = await paymentUtils.collectRequestData(req);
      requestObj = paymentUtils.sanitizeUserInput(JSON.parse(body));
    }

    if (requestObj && Constants.STR_OBJECT === typeof requestObj) {
      let ip = '';

      if (req.headers && req.headers['x-forwarded-for']) {
        ip = Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : req.headers['x-forwarded-for'].split(',')[0].trim();
      } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
      } else if (req.socket && req.socket.remoteAddress) {
        ip = req.socket.remoteAddress;
      } else if (req.info && req.info.remoteAddress) {
        ip = req.info.remoteAddress;
      }

      requestObj.ipAddress = ip;
      response = await apiHandler.captureContextApi(requestObj);
    }
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_CAPTURE_CONTEXT, exception, FunctionConstant.FUNC_HANDLE_CAPTURE_CONTEXT), __filename, '');
  }

  const responsePayload = response && Constants.STR_OBJECT === typeof response ? response : response || {};

  if ((responsePayload as any)?.errorMessage) {
    res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
  }
  res.setHeader('Content-Type', 'application/json');
  const safeJson = paymentUtils.encodeJsonForHtmlContext(responsePayload);
  res.end(safeJson);
};

const handleRefreshSavedTokens = async (req: any, res: any): Promise<void> => {
  let response: any = {
    success: false,
    processedCount: 0,
    removedCount: 0,
    updatedCount: 0,
    errorMessage: '',
    successMessage: '',
  };

  try {
    let requestObj;
    if (Constants.STRING_GCP === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
      requestObj = paymentUtils.sanitizeUserInput(req?.body);
    } else {
      const body = await paymentUtils.collectRequestData(req);
      requestObj = paymentUtils.sanitizeUserInput(JSON.parse(body));
    }
    const customerId = requestObj?.customerId;
    if (!customerId) {
      res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
      response.errorMessage = 'customerId parameter is required';
      paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_REFRESH_SAVED_TOKENS, Constants.LOG_ERROR, '', 'Missing customerId in request body');
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
      return;
    }

    response = await apiHandler.refreshSavedTokensApi(customerId);
    response.success = !response.errorMessage;
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError('Error refreshing saved tokens', exception, FunctionConstant.FUNC_HANDLE_REFRESH_SAVED_TOKENS), __filename, '');
    response = {
      success: false,
      processedCount: 0,
      removedCount: 0,
      updatedCount: 0,
      errorMessage: CustomMessages.ERROR_MSG_API_EXECUTION || 'Failed to refresh tokens',
      successMessage: '',
    };
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
};

const handleTestConnection = async (_req: any, res: any): Promise<void> => {
  let testApiResponse = '';

  try {
    const isEndPointLimitViolated = authenticationHelper.rateLimitEndpointAccess();

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

    if ('OPTIONS' === req.method) {
      res.status(204).end();
      return;
    }

    authentication(req, res);
  };
}

if (Constants.STRING_AWS === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
  exports.handler = serverless(app.server);
}
