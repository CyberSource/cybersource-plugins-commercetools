import fs from 'fs';
import http from 'http';
import path from 'path';
import url from 'url';

import dotenv from 'dotenv';
import { JSDOM } from 'jsdom';
import moment from 'moment';
import serverless from 'serverless-http';

import apiHandler from './apiHandler';
import { AppHandler } from './app/AppHandler';
import { RouterHandler } from './app/RouterHandler';
import { Constants } from './constants';
import { paymentType } from './types/Types';
import paymentHandler from './utils/PaymentHandler';
import paymentService from './utils/PaymentService';
import paymentUtils from './utils/PaymentUtils';
import commercetoolsApi from './utils/api/CommercetoolsApi';
import resourceHandler from './utils/config/ResourceHandler';

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

async function authentication(req: http.IncomingMessage, res: http.ServerResponse) {
  let notificationBody: any;
  let isWhitelisted = false;
  let isValidNotification = false;
  const authHeader: string = req?.headers['authorization'] as string;
  const whitelistUrls: string | undefined = process.env.PAYMENT_GATEWAY_WHITELIST_URLS;
  const requestUrl = req.url as string;
  const parsedUrl = url.parse(requestUrl, true);
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
        const vcSignature = req?.headers['v-c-signature'] as string;
        if (vcSignature && notificationBody) {
          isValidNotification = await paymentUtils.authenticateNetToken(vcSignature, notificationBody);
          if (isValidNotification) {
            await handlePostNetTokenNotification(notificationBody, res);
          }
        }
        if (!isValidNotification) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthentication', Constants.LOG_INFO, '', Constants.ERROR_MSG_SIGNATURE_DOES_NOT_MATCH);
          res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
          res.end();
        }
      });
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthentication', Constants.LOG_INFO, '', Constants.ERROR_MSG_UNHANDLED_REQUEST_METHOD);
      res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
      res.end();
    }
  } else {
    if (whitelistUrls) {
      whitelistUrlArray = whitelistUrls.split(Constants.REGEX_COMMA);
      for (let element of whitelistUrlArray) {
        if (parsedUrl?.pathname === Constants.REGEX_SINGLE_SLASH + element || parsedUrl.pathname?.includes(Constants.REGEX_SINGLE_SLASH + element + '?')) {
          isWhitelisted = true;
          break;
        }
      }
    }
    if (isWhitelisted) {
      requestHandler(req, res);
      return;
    }
    if (!authHeader) {
      const pathName = parsedUrl?.pathname as string;
      if (Constants.EXTENSION_SERVICE_END_POINTS.includes(pathName)) {
        res.setHeader('WWW-Authenticate', Constants.AUTHENTICATION_SCHEME);
        route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, 'application/json', JSON.stringify({ message: Constants.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
      } else {
        route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, 'application/json', JSON.stringify({ message: Constants.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
      }
    } else {
      const pathName = parsedUrl?.pathname as string;
      if (authHeader && Constants.EXTENSION_SERVICE_END_POINTS.includes(pathName)) {
        const base64Credentials = authHeader.split(' ')[1];
        base64Credentials === process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE
          ? requestHandler(req, res)
          : route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, 'application/json', JSON.stringify({ message: Constants.ERROR_MSG_INVALID_AUTHENTICATION_CREDENTIALS }));
      } else if ('/api/extension/payment/create' === requestUrl || '/api/extension/payment/update' === requestUrl || '/api/extension/customer/update' === requestUrl) {
        const encodedCredentials = authHeader.split(' ')[1];
        const decrypt = paymentUtils.decryption(encodedCredentials);
        decrypt && decrypt === process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE ? requestHandler(req, res) : route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, 'application/json', JSON.stringify({ message: Constants.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
      } else {
        route.sendResponse(res, Constants.HTTP_UNAUTHORIZED_STATUS_CODE, 'application/json', JSON.stringify({ message: Constants.ERROR_MSG_MISSING_AUTHORIZATION_HEADER }));
      }
    }
  }
}

const requestHandler = async (req: any, res: any) => {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;
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
      default: {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRequestHandler', Constants.LOG_INFO, '', Constants.ERROR_MSG_GET_REQUEST);
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
      default: {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRequestHandler', Constants.LOG_INFO, '', Constants.ERROR_MSG_POST_REQUEST);
        res.end(Constants.ERROR_MSG_NOT_FOUND);
        break;
      }
    }
  } else {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRequestHandler', Constants.LOG_INFO, '', Constants.ERROR_MSG_UNHANDLED_REQUEST_METHOD);
    res.end(Constants.ERROR_MSG_UNHANDLED_REQUEST_METHOD);
  }
};

const handlePaymentDetails = async (_req: any, res: any) => {
  const htmlData = fs.readFileSync(path.join(__dirname, '/views/paymentDetails.html'), 'utf8');
  const doc = new JSDOM(htmlData);
  const bodyContent = doc.window.document.body.innerHTML;
  const sanitizedBody = paymentUtils.sanitizeHtml(bodyContent);
  const sanitizedHtmlData = Constants.HTML_PREFIX + sanitizedBody + Constants.HTML_SUFFIX;
  res.setHeader('Content-Security-Policy', "script-src 'self'");
  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, 'text/html', sanitizedHtmlData);
};

const handlePaymentsData = async (req: any, res: any) => {
  orderErrorMessage = '';
  orderSuccessMessage = '';
  let paymentDetailsApiResponse = {
    paymentId: '',
    cartLocale: '',
    pendingAuthorizedAmount: 0,
    pendingCaptureAmount: 0,
    errorMessage: '',
    paymentDetails: {},
    cartData: {},
  };
  try {
    const requestId = req?.query?.id;
    if (requestId && typeof requestId === 'string') {
      const paymentId = requestId;
      paymentDetailsApiResponse = await apiHandler.paymentDetailsApi(paymentId);
      if (paymentDetailsApiResponse.errorMessage) {
        errorMessage = paymentDetailsApiResponse.errorMessage;
      }
    } else {
      errorMessage = Constants.ERROR_MSG_EMPTY_PAYMENT_DATA;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncHandlePaymentsData', '', exception, '', '', '');
    orderErrorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
    res.writeHead(Constants.HTTP_REDIRECT_STATUS_CODE, { Location: '/orders' });
  }
  const paymentDetailsPage = {
    id: paymentDetailsApiResponse.paymentId,
    payments: paymentDetailsApiResponse.paymentDetails,
    cart: paymentDetailsApiResponse.cartData,
    captureAmount: paymentDetailsApiResponse.pendingCaptureAmount,
    authorizedAmount: paymentDetailsApiResponse.pendingAuthorizedAmount,
    amountConversion: paymentUtils.convertCentToAmount,
    roundOff: paymentUtils.roundOff,
    locale: paymentDetailsApiResponse.cartLocale,
    errorMessage: errorMessage,
    successMessage: successMessage,
    refundErrorMessage: Constants.ERROR_MSG_REFUND_AMOUNT,
    captureErrorMessage: Constants.ERROR_MSG_CAPTURE_AMOUNT,
  };
  const response = JSON.stringify(paymentDetailsPage);
  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, 'application/json', response);
};

const handleOrders = async (_req: any, res: any) => {
  const htmlData = fs.readFileSync(path.join(__dirname, '/views/orders.html'), 'utf8');
  const doc = new JSDOM(htmlData);
  const bodyContent = doc.window.document.body.innerHTML;
  const sanitizedBody = paymentUtils.sanitizeHtml(bodyContent);
  const sanitizedHtmlData = Constants.HTML_PREFIX + sanitizedBody + Constants.HTML_SUFFIX;
  res.setHeader('Content-Security-Policy', "script-src 'self'");
  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, 'text/html', sanitizedHtmlData);
};

const handleOrdersData = async (_req: any, res: any) => {
  errorMessage = '';
  successMessage = '';
  const orderPage: { count: number; orderList: paymentType[]; total: number; moment: any; amountConversion: any; orderErrorMessage: string; orderSuccessMessage: string } = {
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
      orderErrorMessage = Constants.ERROR_MSG_NO_ORDER_DETAILS;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncHandleOrdersData', '', exception, '', '', '');
    orderErrorMessage = Constants.ERROR_MSG_NO_ORDER_DETAILS;
  }
  orderPage.orderErrorMessage = orderErrorMessage;
  orderPage.orderSuccessMessage = orderSuccessMessage;
  const response = JSON.stringify(orderPage);
  route.sendResponse(res, Constants.HTTP_OK_STATUS_CODE, 'application/json', response);
};

const handlePaymentCreate = async (req: any, res: any) => {
  let response;
  try {
    const body = await paymentUtils.collectRequestData(req);
    const requestObj = await paymentUtils.getRequestObj(body);
    if (null !== requestObj && typeof requestObj === 'object') {
      const paymentObj = requestObj;
      response = await apiHandler.paymentCreateApi(paymentObj);
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncHandlePaymentCreate', Constants.LOG_INFO, '', Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
      response = paymentUtils.getEmptyResponse();
    }
  } catch (exception) {
    const paymentId = req?.body?.resource?.obj?.id ? req.body.resource.obj.id : '';
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncHandlePaymentCreate', '', exception, paymentId, 'PaymentId', '');
    response = paymentUtils.invalidOperationResponse();
  }
  const paymentCreateResponse = JSON.stringify(response);
  res.end(paymentCreateResponse);
};

const handlePaymentUpdate = async (req: any, res: any) => {
  let updateResponse: any = paymentUtils.getEmptyResponse();
  try {
    const body = await paymentUtils.collectRequestData(req);
    const requestObj = await paymentUtils.getRequestObj(body);
    if (null !== requestObj && typeof requestObj === 'object') {
      const updatePaymentObj = requestObj;
      updateResponse = await apiHandler.paymentUpdateApi(updatePaymentObj);
    }
  } catch (exception) {
    const paymentId = req?.body?.resource?.obj?.id ? req.body.resource.obj.id : '';
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncHandlePaymentUpdate', '', exception, paymentId, 'PaymentId : ', '');
    updateResponse = paymentUtils.invalidOperationResponse();
  }
  const paymentUpdateResponse = JSON.stringify(updateResponse);
  res.end(paymentUpdateResponse);
};

const handleCustomerUpdate = async (req: any, res: any) => {
  let response: any = paymentUtils.invalidInputResponse();
  const body = await paymentUtils.collectRequestData(req);
  const requestObj = await paymentUtils.getRequestObj(body);
  try {
    if (null !== requestObj && typeof requestObj === 'object') {
      const customerObj = requestObj;
      response = await apiHandler.customerUpdateApi(customerObj);
    }
  } catch (exception) {
    const customerId = req?.body?.resource?.obj?.id ? req.body.resource.obj.id : '';
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncHandleCustomerUpdate', '', exception, customerId, 'CustomerId : ', '');
  }
  //If an exception or an error occurs, return the received customer object back
  if (null === response || undefined === response || (0 === response?.actions?.length && 0 === response?.errors?.length)) {
    if (null !== requestObj && typeof requestObj === 'object') {
      const customerObj = requestObj;
      const customerInfo = await commercetoolsApi.getCustomer(customerObj.id);
      if (customerInfo?.custom?.fields?.isv_tokens && 0 < customerInfo.custom.fields.isv_tokens.length) {
        response = paymentService.getUpdateTokenActions(customerInfo.custom.fields.isv_tokens, customerInfo.custom.fields.isv_failedTokens, true, customerInfo, null);
      }
    }
  }
  const customerUpdateResponse = JSON.stringify(response);
  res.end(customerUpdateResponse);
};

const handleAuthReversal = async (req: any, res: any) => {
  let paymentId: string;
  let authReverseApiResponse = {
    errorMessage: '',
    successMessage: '',
  };
  let viewData = '/orders';
  try {
    if (req?.query?.id) {
      const authId = req.query.id;
      if ('' !== authId && typeof authId === 'string') {
        paymentId = authId;
        authReverseApiResponse = await apiHandler.orderManagementApi(paymentId, undefined, Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION);
        errorMessage = authReverseApiResponse.errorMessage;
        successMessage = authReverseApiResponse.successMessage;
        viewData = `/paymentDetails?id=${paymentId}`;
      }
    } else {
      orderErrorMessage = Constants.ERROR_MSG_CANNOT_PROCESS;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncHandleAuthReversal', '', exception, '', '', '');
    orderErrorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.writeHead(Constants.HTTP_REDIRECT_STATUS_CODE, { Location: viewData });
  res.end();
};

const handleCapture = async (req: any, res: any) => {
  let paymentId: string;
  let captureApiResponse = {
    errorMessage: '',
    successMessage: '',
  };
  let viewData = '/orders';
  try {
    if (req?.query?.captureId && req.query?.captureAmount) {
      const captureId = req.query.captureId;
      const requestAmount = Number(req.query.captureAmount);
      if ('' !== captureId && typeof captureId === 'string' && typeof requestAmount === 'number') {
        paymentId = captureId;
        const captureAmount = requestAmount;
        captureApiResponse = await apiHandler.orderManagementApi(paymentId, captureAmount, Constants.CT_TRANSACTION_TYPE_CHARGE);
        errorMessage = captureApiResponse.errorMessage;
        successMessage = captureApiResponse.successMessage;
        viewData = `/paymentDetails?id=${paymentId}`;
      }
    } else {
      orderErrorMessage = Constants.ERROR_MSG_CANNOT_PROCESS;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncHandleCapture', '', exception, '', '', '');
    orderErrorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.writeHead(Constants.HTTP_REDIRECT_STATUS_CODE, { Location: viewData });
  res.end();
};

const handleRefund = async (req: any, res: any) => {
  let paymentId: string;
  let refundApiResponse = {
    errorMessage: '',
    successMessage: '',
  };
  let viewData = '/orders';
  try {
    if (req?.query?.refundId && req.query?.refundAmount) {
      const refundId = req.query.refundId;
      const requestAmount = Number(req.query.refundAmount);
      if ('' !== refundId && typeof refundId === 'string' && null !== requestAmount && typeof requestAmount === 'number') {
        paymentId = refundId;
        const refundAmount = requestAmount;
        refundApiResponse = await apiHandler.orderManagementApi(paymentId, refundAmount, Constants.CT_TRANSACTION_TYPE_REFUND);
        errorMessage = refundApiResponse.errorMessage;
        successMessage = refundApiResponse.successMessage;
        viewData = `/paymentDetails?id=${paymentId}`;
      }
    } else {
      orderErrorMessage = Constants.ERROR_MSG_CANNOT_PROCESS;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncHandleRefund', '', exception, '', '', '');
    orderErrorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.writeHead(Constants.HTTP_REDIRECT_STATUS_CODE, { Location: viewData });
  res.end();
};

const handlePostNetTokenNotification = async (req: any, res: any) => {
  let response = {
    errorMessage: '',
    successMessage: '',
  };
  let notificationData = req;
  res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
  try {
    if (notificationData && typeof notificationData === 'object') {
      const notification = notificationData;
      response = await apiHandler.notificationApi(notification);
      if (response?.successMessage) {
        res.statusCode = Constants.HTTP_OK_STATUS_CODE;
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncHandlePostNetTokenNotification', Constants.LOG_INFO, '', response.successMessage);
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncHandlePostNetTokenNotification', Constants.LOG_INFO, '', response.errorMessage);
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncHandlePostNetTokenNotification', '', exception, '', '', '');
  }
  res.end();
};

const handleDecisionSync = async (_req: any, res: any) => {
  const decisionSyncResponse = await paymentHandler.reportHandler();
  orderSuccessMessage = decisionSyncResponse.message;
  orderErrorMessage = decisionSyncResponse.error;
  res.writeHead(Constants.HTTP_REDIRECT_STATUS_CODE, { Location: '/orders' });
  res.end();
};

const handleSync = async (_req: any, res: any) => {
  const syncResponse = await paymentHandler.syncHandler();
  orderSuccessMessage = syncResponse.message;
  orderErrorMessage = syncResponse.error;
  res.writeHead(Constants.HTTP_REDIRECT_STATUS_CODE, { Location: '/orders' });
  await res.end();
};

const handleConfigureExtensions = async (_req: any, res: any) => {
  await resourceHandler.ensureExtension();
  await resourceHandler.ensureCustomTypes();
  orderSuccessMessage = Constants.SUCCESS_MSG_EXTENSION_CREATION;
  res.writeHead(Constants.HTTP_REDIRECT_STATUS_CODE, { Location: '/orders' });
  await res.end();
};

if(Constants.STRING_AWS === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT){
  exports.handler = serverless(app.server);
}

