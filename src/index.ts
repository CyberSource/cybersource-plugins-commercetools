import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import moment from 'moment';
import path from 'path';
import serverless from 'serverless-http';
import flexKeys from './service/payment/FlexKeys';
import commercetoolsApi from './utils/api/CommercetoolsApi';
import paymentHandler from './utils/PaymentHandler';
import paymentService from './utils/PaymentService';
import { Constants } from './constants';
import resourceHandler from './utils/config/ResourceHandler';
import captureContext from './service/payment/CaptureContextService';
import keyVerification from './service/payment/getPublicKeys';

dotenv.config();
const app = express();
var port: any;
if (Constants.STRING_AZURE == process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
  port = process.env.FUNCTIONS_HTTPWORKER_PORT;
} else {
  port = process.env.CONFIG_PORT;
}
let errorMessage = Constants.STRING_EMPTY;
let successMessage = Constants.STRING_EMPTY;
let orderSuccessMessage = Constants.STRING_EMPTY;
let orderErrorMessage = Constants.STRING_EMPTY;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views/css')));
app.use(express.static(path.join(__dirname, 'views/javascript')));
app.use(express.static(path.join(__dirname, 'views/images')));
app.all('*', authentication);
app.listen(port, () => {
  console.log(`Application running on port:${port}`);
});

app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');

function authentication(req, res, next) {
  let decrypt: any;
  let authHeader = req.headers.authorization;
  let whitelistFlag = false;
  let whitelistUrl: any;
  let whitelistUrlArray: any;
  whitelistUrl = process.env.PAYMENT_GATEWAY_WHITELIST_URLS;
  if (undefined !== whitelistUrl && Constants.STRING_EMPTY !== whitelistUrl) {
    whitelistUrlArray = whitelistUrl.split(Constants.REGEX_COMMA);
  }
  if (!authHeader) {
    if (req.url === '/' || req.url === '/orders' || req.url.includes('/paymentdetails?') || req.url.includes('/capture?') || req.url.includes('/refund?') || req.url.includes('/authReversal?') || req.url === '/decisionSync' || req.url === '/sync' || req.url === '/configureExtension' || req.url === '/generateHeader') {
      res.setHeader(Constants.STRING_WWW_AUTHENTICATE, Constants.AUTHENTICATION_SCHEME);
    } else {
      whitelistFlag = true;
    }
    return res.status(Constants.VAL_FOUR_HUNDRED_AND_ONE).json({ message: Constants.ERROR_MSG_MISSING_AUTHORIZATION_HEADER });
  }
  else {
    if (req.url === '/' || req.url === '/orders' || req.url.includes('/paymentdetails?') || req.url.includes('/capture?') || req.url.includes('/refund?') || req.url.includes('/authReversal?') || req.url === '/decisionSync' || req.url === '/sync' || req.url === '/configureExtension' || req.url === '/generateHeader') {
      const base64Credentials = req.headers.authorization.split(Constants.STRING_EMPTY_SPACE)[Constants.VAL_ONE];
      if (base64Credentials === process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE) {
        return next();
      } else {
        res.setHeader(Constants.STRING_WWW_AUTHENTICATE, Constants.AUTHENTICATION_SCHEME);
        return res.status(Constants.VAL_FOUR_HUNDRED_AND_ONE).json({ message: Constants.ERROR_MSG_INVALID_AUTHENTICATION_CREDENTIALS });
      }
    } else {
      if (req.url === '/api/extension/payment/create' || req.url === '/api/extension/payment/update' || req.url === '/api/extension/customer/update' || req.url === '/captureContext') {
        const encodedCredentials = authHeader.split(Constants.STRING_EMPTY_SPACE)[Constants.VAL_ONE];
        decrypt = paymentService.decryption(encodedCredentials);
        if (null !== decrypt && decrypt === process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE) {
          return next();
        } else {
          return res.status(Constants.VAL_FOUR_HUNDRED_AND_ONE).json({ message: Constants.ERROR_MSG_INVALID_AUTHENTICATION_CREDENTIALS });
        }
      } else {
        whitelistFlag = true;
      }
    }
  }
  if (whitelistFlag) {
    if (undefined !== whitelistUrl && Constants.STRING_EMPTY !== whitelistUrl) {
      whitelistUrlArray = whitelistUrl.split(Constants.REGEX_COMMA);
      if (null !== whitelistUrlArray) {
        for (let whitelistElement of whitelistUrlArray) {
          if (req.url === Constants.REGEX_SINGLE_SLASH + whitelistElement || (req.url.includes(Constants.REGEX_SINGLE_SLASH + whitelistElement + '?'))) {
            return next();
          }
        }
      }
    }
  }
}

app.get('/generateHeader', async (req, res) => {
  let headerValue: any;
  let response: any;
  headerValue = paymentService.encryption(process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE);
  response = headerValue;
  res.setHeader('Content-Security-Policy', "script-src 'self'");
  res.send(response);
});

app.get('/orders', async (req, res) => {
  let orderResult: any;
  let ordersList: any;
  let exceptionData: any;
  let orderCount = Constants.VAL_ZERO;
  let total = Constants.VAL_ZERO;
  errorMessage = Constants.STRING_EMPTY;
  successMessage = Constants.STRING_EMPTY;
  try {
    ordersList = await commercetoolsApi.getOrders();
    if (null != ordersList) {
      orderCount = ordersList.count;
      orderResult = ordersList.results;
      total = ordersList.total;
    } else {
      orderErrorMessage = Constants.ERROR_MSG_NO_ORDER_DETAILS;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.GET_ORDERS, Constants.LOG_ERROR, null, exceptionData);
    orderErrorMessage = Constants.ERROR_MSG_NO_ORDER_DETAILS;
  }
  res.setHeader('Content-Security-Policy', "script-src 'self'");
  res.render('orders', {
    count: orderCount,
    orderList: orderResult,
    total: total,
    moment: moment,
    amountConversion: paymentService.convertCentToAmount,
    orderErrorMessage: orderErrorMessage,
    orderSuccessMessage: orderSuccessMessage,
  });
});

app.get('/paymentdetails', async (req, res) => {
  let paymentId: any;
  let paymentDetails: any;
  let requestId: any;
  let cartDetails: any;
  let cartData: any;
  let exceptionData: any;
  let refundTransaction: any;
  let cartLocale: any;
  let authReversalFlag = false;
  let convertedPaymentId = Constants.STRING_EMPTY;
  let pendingCaptureAmount = Constants.VAL_FLOAT_ZERO;
  let pendingAuthorizedAmount = Constants.VAL_FLOAT_ZERO;
  let captureErrorMessage = Constants.ERROR_MSG_CAPTURE_AMOUNT;
  let refundErrorMessage = Constants.ERROR_MSG_REFUND_AMOUNT;
  orderErrorMessage = Constants.STRING_EMPTY;
  orderSuccessMessage = Constants.STRING_EMPTY;
  try {
    if (Constants.STRING_ID in req.query) {
      requestId = req.query.id;
      if (null != requestId && typeof requestId === 'string') {
        paymentId = requestId;
        convertedPaymentId = paymentId.replace(/\s+/g, Constants.STRING_EMPTY);
        cartDetails = await commercetoolsApi.retrieveCartByPaymentId(convertedPaymentId);
        cartData = cartDetails.results[Constants.VAL_ZERO];
        if (null != cartData && Constants.STRING_LOCALE in cartData && null != cartData.locale) {
          cartLocale = cartData.locale;
        }
        paymentDetails = await commercetoolsApi.retrievePayment(convertedPaymentId);
        if (null != paymentDetails) {
          refundTransaction = paymentDetails.transactions;
          if (null != refundTransaction) {
            refundTransaction.forEach((transaction) => {
              if (Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
                authReversalFlag = true;
              }
            });
            if (!authReversalFlag) {
              pendingCaptureAmount = paymentService.getCapturedAmount(paymentDetails);
              pendingAuthorizedAmount = paymentService.getAuthorizedAmount(paymentDetails);
            }
          }
        } else {
          errorMessage = Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS;
        }
      } else {
        errorMessage = Constants.ERROR_MSG_EMPTY_PAYMENT_DATA;
      }
    } else {
      errorMessage = Constants.ERROR_MSG_EMPTY_PAYMENT_DATA;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.parse(path.basename(__filename)).name).name, Constants.GET_PAYMENT_DETAILS, Constants.LOG_ERROR, null, exceptionData);
    orderErrorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
    res.redirect('/orders');
  }
  res.setHeader('Content-Security-Policy', "script-src 'self'");
  res.render('paymentdetails', {
    id: convertedPaymentId,
    payments: paymentDetails,
    cart: cartData,
    captureAmount: pendingCaptureAmount,
    authorizedAmount: pendingAuthorizedAmount,
    amountConversion: paymentService.convertCentToAmount,
    roundOff: paymentService.roundOff,
    locale: cartLocale,
    errorMessage: errorMessage,
    successMessage: successMessage,
    refundErrorMessage: refundErrorMessage,
    captureErrorMessage: captureErrorMessage,
  });
});

app.post('/api/extension/payment/create', async (req, res) => {
  let paymentObj: any;
  let requestObj: any;
  let microFormKeys: any;
  let response: any;
  let actions: any;
  let exceptionData: any;
  let paymentMethod = Constants.STRING_EMPTY;
  let verifiedCaptureContext;
  try {
    if (req?.body?.resource?.obj) {
      requestObj = req.body.resource.obj;
      if (null != requestObj && typeof requestObj === 'object') {
        paymentObj = requestObj;
        paymentMethod = paymentObj.paymentMethodInfo.method;
        if (null != paymentObj && paymentObj?.custom?.fields?.isv_transientToken) {
          response = paymentService.getEmptyResponse();
        } else if (Constants.CREDIT_CARD == paymentMethod || Constants.CC_PAYER_AUTHENTICATION == paymentMethod) {
          if (null != paymentObj && Constants.STRING_CUSTOM in paymentObj && Constants.STRING_FIELDS in paymentObj.custom && Constants.ISV_SAVED_TOKEN in paymentObj.custom.fields && Constants.STRING_EMPTY != paymentObj.custom.fields.isv_savedToken) {
            actions = paymentService.fieldMapper(paymentObj.custom.fields);
            response = {
              actions: actions,
              errors: [],
            };
          } else {
            microFormKeys = await flexKeys.keys(paymentObj);
            if (null != microFormKeys) {
              verifiedCaptureContext = await keyVerification.getPublicKeys(microFormKeys.isv_tokenCaptureContextSignature, paymentObj);
              if (verifiedCaptureContext) {
                actions = paymentService.fieldMapper(microFormKeys);
                response = {
                  actions: actions,
                  errors: [],
                };
              } else {
                paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_CREATE, Constants.LOG_INFO, null, Constants.ERROR_MSG_INVALID_CAPTURE_CONTEXT);
                response = paymentService.getEmptyResponse();
              }
            } else {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_CREATE, Constants.LOG_INFO, null, Constants.ERROR_MSG_FLEX_TOKEN_KEYS);
              response = paymentService.invalidOperationResponse();
            }
          }
        } else if (Constants.APPLE_PAY == paymentMethod) {
          if (Constants.STRING_CUSTOM in paymentObj && Constants.STRING_FIELDS in paymentObj.custom) {
            response = await paymentHandler.applePaySessionHandler(paymentObj.custom.fields);
          }
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_CREATE, Constants.LOG_INFO, null, Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
          response = paymentService.getEmptyResponse();
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_CREATE, Constants.LOG_INFO, null, Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
        response = paymentService.getEmptyResponse();
      }
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_CREATE, Constants.LOG_ERROR, null, exceptionData);
    response = paymentService.invalidOperationResponse();
  }
  res.send(response);
});

app.post('/api/extension/payment/update', async (req, res) => {
  let updateResponse: any;
  let updatePaymentId: any;
  let requestObj: any;
  let updatePaymentObj: any;
  let updateTransactions: any;
  let exceptionData: any;
  let paymentMethod = Constants.STRING_EMPTY;
  let transactionLength = Constants.VAL_ZERO;
  let paymentResponse = {
    httpCode: null,
    status: null,
    transactionId: null,
  };
  try {
    if (req?.body?.resource?.obj) {
      requestObj = req.body.resource;
      if (null != requestObj && typeof requestObj === 'object') {
        updatePaymentObj = requestObj.obj;
        updatePaymentId = requestObj.id;
        paymentMethod = updatePaymentObj.paymentMethodInfo.method;
        transactionLength = updatePaymentObj.transactions.length;
        if (Constants.CC_PAYER_AUTHENTICATION == paymentMethod && Constants.VAL_ZERO == transactionLength) {
          if (null != updatePaymentObj && Constants.STRING_CUSTOM in updatePaymentObj && Constants.STRING_FIELDS in updatePaymentObj.custom && !(Constants.ISV_CARDINAL_REFERENCE_ID in updatePaymentObj.custom.fields)) {
            updateResponse = await paymentService.getPayerAuthSetUpResponse(updatePaymentObj);
          } else if (
            Constants.STRING_CUSTOM in updatePaymentObj &&
            Constants.STRING_FIELDS in updatePaymentObj.custom &&
            !(Constants.ISV_PAYER_AUTHENTICATION_TRANSACTION_ID in updatePaymentObj.custom.fields) &&
            Constants.ISV_CARDINAL_REFERENCE_ID in updatePaymentObj.custom.fields &&
            Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_cardinalReferenceId
          ) {
            updateResponse = await paymentService.getPayerAuthEnrollResponse(updatePaymentObj);
          } else if (
            Constants.CC_PAYER_AUTHENTICATION == paymentMethod &&
            Constants.STRING_CUSTOM in updatePaymentObj &&
            Constants.STRING_FIELDS in updatePaymentObj.custom &&
            Constants.ISV_PAYER_AUTHENTICATION_TRANSACTION_ID in updatePaymentObj.custom.fields &&
            Constants.ISV_PAYER_AUTHENTICATION_REQUIRED in updatePaymentObj.custom.fields &&
            updatePaymentObj.custom.fields.isv_payerAuthenticationRequired
          ) {
            paymentResponse.httpCode = updatePaymentObj.custom.fields.isv_payerEnrollHttpCode;
            paymentResponse.status = updatePaymentObj.custom.fields.isv_payerEnrollStatus;
            paymentResponse.transactionId = updatePaymentObj.custom.fields.isv_payerEnrollTransactionId;
            updateResponse = await paymentService.getPayerAuthValidateResponse(updatePaymentObj);
          }
        }
        if (Constants.VAL_ZERO < transactionLength) {
          updateTransactions = updatePaymentObj.transactions[transactionLength - Constants.VAL_ONE];
          if (
            Constants.VAL_ONE == transactionLength &&
            null != updateTransactions &&
            Constants.TYPE_ID_TYPE in updateTransactions &&
            (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION == updateTransactions.type ||
              (Constants.CT_TRANSACTION_TYPE_CHARGE == updateTransactions.type &&
                ((Constants.STRING_CUSTOM in updatePaymentObj && Constants.STRING_FIELDS in updatePaymentObj.custom && Constants.ISV_SALE_ENABLED in updatePaymentObj.custom.fields && updatePaymentObj.custom.fields.isv_saleEnabled) || Constants.ECHECK == paymentMethod)))
          ) {
            if (Constants.CT_TRANSACTION_STATE_SUCCESS == updateTransactions.state || Constants.CT_TRANSACTION_STATE_FAILURE == updateTransactions.state || Constants.CT_TRANSACTION_STATE_PENDING == updateTransactions.state) {
              updateResponse = paymentService.getEmptyResponse();
            } else if (Constants.CC_PAYER_AUTHENTICATION == paymentMethod && Constants.STRING_CUSTOM in updatePaymentObj && Constants.STRING_FIELDS in updatePaymentObj.custom && Constants.ISV_PAYER_AUTHENTICATION_REQUIRED in updatePaymentObj.custom.fields) {
              paymentResponse.httpCode = updatePaymentObj.custom.fields.isv_payerEnrollHttpCode;
              paymentResponse.status = updatePaymentObj.custom.fields.isv_payerEnrollStatus;
              paymentResponse.transactionId = updatePaymentObj.custom.fields.isv_payerEnrollTransactionId;
              updateResponse = paymentService.getAuthResponse(paymentResponse, updateTransactions);
              if (updatePaymentObj?.custom?.fields?.isv_securityCode && null != updatePaymentObj.custom.fields.isv_securityCode) {
                updateResponse.actions.push({
                  action: Constants.SET_CUSTOM_FIELD,
                  name: Constants.ISV_SECURITY_CODE,
                  value: null,
                });
              }
              if (null != paymentResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status) {
                updateResponse = await paymentHandler.getPayerAuthReversalHandler(updatePaymentObj, paymentResponse, updateTransactions, updateResponse);
              }
            } else {
              updateResponse = await paymentHandler.authorizationHandler(updatePaymentObj, updateTransactions);
            }
          } else {
            updateResponse = await paymentHandler.orderManagementHandler(updatePaymentId, updatePaymentObj, updateTransactions);
          }
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_UPDATE, Constants.LOG_INFO, null, Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
        updateResponse = paymentService.getEmptyResponse();
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_UPDATE, Constants.LOG_INFO, null, Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
      updateResponse = paymentService.getEmptyResponse();
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_UPDATE, Constants.LOG_ERROR, null, exceptionData);
    updateResponse = paymentService.invalidOperationResponse();
  }
  res.send(updateResponse);
});

app.post('/api/extension/customer/update', async (req, res) => {
  let response = paymentService.invalidInputResponse();
  let tokensToUpdate: any;
  let exceptionData: any;
  let microFormKeys: any;
  let actions: any;
  let customerInfo: any;
  let customFields: any;
  let requestObj: any;
  let customerObj: any;
  let customerAddress: any;
  let paymentObj: any;
  try {
    if (Constants.STRING_EMPTY == req?.body?.resource?.obj?.custom?.fields?.isv_tokenCaptureContextSignature) {
      requestObj = req.body.resource;
      if (null != requestObj && typeof requestObj === 'object') {
        paymentObj = requestObj.obj;
        microFormKeys = await flexKeys.keys(paymentObj);
        if (null != microFormKeys) {
          actions = paymentService.fieldMapper(microFormKeys);
          response = {
            actions: actions,
            errors: [],
          };
        }
      }
    } else if (req?.body?.resource?.obj?.custom?.fields?.isv_addressId) {
      requestObj = req.body.resource;
      if (null != requestObj && typeof requestObj === 'object') {
        customerObj = requestObj;
        customerAddress = customerObj.obj.addresses;
        response = await paymentHandler.addCardHandler(customerObj.id, customerAddress, customerObj.obj);
      }
    } else if (req?.body?.resource?.obj?.custom?.fields?.isv_tokens && Constants.VAL_ZERO < req.body.resource.obj.custom.fields.isv_tokens.length) {
      requestObj = req.body.resource;
      if (null != requestObj && typeof requestObj === 'object') {
        customerObj = requestObj;
        customFields = customerObj.obj.custom.fields;
        tokensToUpdate = JSON.parse(customFields.isv_tokens[Constants.VAL_ZERO]);
        if ('delete' == customFields.isv_tokenAction) {
          response = await paymentHandler.deleteCardHandler(tokensToUpdate, customerObj.id);
        } else if ('update' == customFields.isv_tokenAction) {
          response = await paymentHandler.updateCardHandler(tokensToUpdate, customerObj.id, customerObj.obj);
        } else {
          response = paymentService.getUpdateTokenActions(customFields.isv_tokens, customFields.isv_failedTokens, true, customerObj.obj, null);
        }
      }
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CUSTOMER_UPDATE, Constants.LOG_ERROR, null, exceptionData);
  }
  if (null == response || undefined == response || (0 == response?.actions?.length && 0 == response?.errors?.length)) {
    requestObj = req.body.resource;
    if (null != requestObj && typeof requestObj === 'object') {
      customerObj = requestObj;
      customerInfo = await commercetoolsApi.getCustomer(customerObj.id);
      if (null != customerInfo && customerInfo?.custom?.fields?.isv_tokens && Constants.STRING_EMPTY != customerInfo.custom.fields.isv_tokens && Constants.VAL_ZERO < customerInfo.custom.fields.isv_tokens.length) {
        response = paymentService.getUpdateTokenActions(customerInfo.custom.fields.isv_tokens, customerInfo.custom.fields.isv_failedTokens, true, customerInfo, null);
      }
    }
  }
  res.send(response);
});

app.get('/capture', async (req, res) => {
  let requestId: any;
  let requestAmount: any;
  let paymentId: any;
  let captureAmount: any;
  let capturePaymentObj: any;
  let addTransaction: any;
  let transactionObject: any;
  let latestTransaction: any;
  let exceptionData: any;
  let pendingAuthorizedAmount: number;
  let transactionLength = Constants.VAL_ZERO;
  let fractionDigits = Constants.VAL_ZERO;
  errorMessage = Constants.STRING_EMPTY;
  successMessage = Constants.STRING_EMPTY;
  try {
    if (req?.query?.captureId && req.query?.captureAmount) {
      requestId = req.query.captureId;
      requestAmount = Number(req.query.captureAmount);
      if (null != requestId && typeof requestId === 'string' && null != requestAmount && typeof requestAmount === 'number') {
        paymentId = requestId;
        captureAmount = requestAmount;
        capturePaymentObj = await commercetoolsApi.retrievePayment(paymentId);
        if (null != capturePaymentObj) {
          fractionDigits = capturePaymentObj.amountPlanned.fractionDigits;
          pendingAuthorizedAmount = paymentService.getAuthorizedAmount(capturePaymentObj);
          if (Constants.VAL_ZERO == captureAmount) {
            errorMessage = Constants.ERROR_MSG_CAPTURE_AMOUNT_GREATER_THAN_ZERO;
            successMessage = Constants.STRING_EMPTY;
          } else if (captureAmount > pendingAuthorizedAmount) {
            errorMessage = Constants.ERROR_MSG_CAPTURE_EXCEEDS_AUTHORIZED_AMOUNT;
            successMessage = Constants.STRING_EMPTY;
          } else {
            capturePaymentObj.amountPlanned.centAmount = paymentService.convertAmountToCent(captureAmount, fractionDigits);
            transactionObject = {
              paymentId: paymentId,
              version: capturePaymentObj.version,
              amount: capturePaymentObj.amountPlanned,
              type: Constants.CT_TRANSACTION_TYPE_CHARGE,
              state: Constants.CT_TRANSACTION_STATE_INITIAL,
            };
            addTransaction = await commercetoolsApi.addTransaction(transactionObject);
            if (null != addTransaction && Constants.STRING_TRANSACTIONS in addTransaction && Constants.VAL_ZERO < addTransaction.transactions.length) {
              transactionLength = addTransaction.transactions.length;
              latestTransaction = addTransaction.transactions[transactionLength - Constants.VAL_ONE];
              if (null != latestTransaction && Constants.CT_TRANSACTION_TYPE_CHARGE == latestTransaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == latestTransaction.state) {
                successMessage = Constants.SUCCESS_MSG_CAPTURE_SERVICE;
              } else {
                errorMessage = Constants.ERROR_MSG_CAPTURE_SERVICE;
              }
            } else {
              errorMessage = Constants.ERROR_MSG_ADD_TRANSACTION_DETAILS;
            }
          }
        } else {
          errorMessage = Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS;
        }
      } else {
        orderErrorMessage = Constants.ERROR_MSG_CANNOT_PROCESS;
        res.redirect('/orders');
        return;
      }
    } else {
      orderErrorMessage = Constants.ERROR_MSG_CANNOT_PROCESS;
      res.redirect('/orders');
      return;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.GET_CAPTURE, Constants.LOG_ERROR, null, exceptionData);
    orderErrorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
    res.redirect('/orders');
    return;
  }
  res.redirect(`/paymentdetails?id=${paymentId}`);
});

app.get('/refund', async (req, res) => {
  let paymentId: any;
  let refundAmount: any;
  let refundPaymentObj: any;
  let addTransaction: any;
  let transactionObject: any;
  let latestTransaction: any;
  let exceptionData: any;
  let requestId: any;
  let requestAmount: any;
  let pendingCaptureAmount: number;
  let transactionLength = Constants.VAL_ZERO;
  errorMessage = Constants.STRING_EMPTY;
  successMessage = Constants.STRING_EMPTY;
  let fractionDigits = Constants.VAL_ZERO;
  try {
    if (req?.query?.refundId && req.query?.refundAmount) {
      requestId = req.query.refundId;
      requestAmount = Number(req.query.refundAmount);
      if (null != requestId && typeof requestId === 'string' && null != requestAmount && typeof requestAmount === 'number') {
        paymentId = requestId;
        refundAmount = requestAmount;
        refundPaymentObj = await commercetoolsApi.retrievePayment(paymentId);
        if (null != refundPaymentObj) {
          fractionDigits = refundPaymentObj.amountPlanned.fractionDigits;
          pendingCaptureAmount = paymentService.getCapturedAmount(refundPaymentObj);
          if (Constants.VAL_ZERO == refundAmount) {
            errorMessage = Constants.ERROR_MSG_REFUND_GREATER_THAN_ZERO;
            successMessage = Constants.STRING_EMPTY;
          } else if (refundAmount > pendingCaptureAmount) {
            errorMessage = Constants.ERROR_MSG_REFUND_EXCEEDS_CAPTURE_AMOUNT;
            successMessage = Constants.STRING_EMPTY;
          } else {
            refundPaymentObj.amountPlanned.centAmount = paymentService.convertAmountToCent(refundAmount, fractionDigits);
            transactionObject = {
              paymentId: paymentId,
              version: refundPaymentObj.version,
              amount: refundPaymentObj.amountPlanned,
              type: Constants.CT_TRANSACTION_TYPE_REFUND,
              state: Constants.CT_TRANSACTION_STATE_INITIAL,
            };
            addTransaction = await commercetoolsApi.addTransaction(transactionObject);
            if (null != addTransaction && Constants.STRING_TRANSACTIONS in addTransaction && Constants.VAL_ZERO < addTransaction.transactions.length) {
              transactionLength = addTransaction.transactions.length;
              latestTransaction = addTransaction.transactions[transactionLength - Constants.VAL_ONE];
              if (null != latestTransaction && Constants.CT_TRANSACTION_TYPE_REFUND == latestTransaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == latestTransaction.state) {
                successMessage = Constants.SUCCESS_MSG_REFUND_SERVICE;
              } else {
                errorMessage = Constants.ERROR_MSG_REFUND_SERVICE;
              }
            } else {
              errorMessage = Constants.ERROR_MSG_ADD_TRANSACTION_DETAILS;
            }
          }
        } else {
          errorMessage = Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS;
        }
      } else {
        orderErrorMessage = Constants.ERROR_MSG_CANNOT_PROCESS;
        res.redirect('/orders');
        return;
      }
    } else {
      orderErrorMessage = Constants.ERROR_MSG_CANNOT_PROCESS;
      res.redirect('/orders');
      return;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.GET_REFUND, Constants.LOG_ERROR, null, exceptionData);
    orderErrorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
    res.redirect('/orders');
    return;
  }
  res.redirect(`/paymentdetails?id=${paymentId}`);
});

app.get('/authReversal', async (req, res) => {
  let paymentId: any;
  let requestId: any;
  let authReversalObj: any;
  let addTransaction: any;
  let transactionObject: any;
  let latestTransaction: any;
  let exceptionData: any;
  let transactionLength = Constants.VAL_ZERO;
  errorMessage = Constants.STRING_EMPTY;
  successMessage = Constants.STRING_EMPTY;
  try {
    if (req?.query && Constants.STRING_ID in req.query && null != req.query.id) {
      requestId = req.query.id;
      if (null != requestId && typeof requestId === 'string') {
        paymentId = requestId;
        authReversalObj = await commercetoolsApi.retrievePayment(paymentId);
        if (null != authReversalObj) {
          transactionObject = {
            paymentId: paymentId,
            version: authReversalObj.version,
            amount: authReversalObj.amountPlanned,
            type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
            state: Constants.CT_TRANSACTION_STATE_INITIAL,
          };
          addTransaction = await commercetoolsApi.addTransaction(transactionObject);
          if (null != addTransaction && Constants.STRING_TRANSACTIONS in addTransaction && Constants.VAL_ZERO < addTransaction.transactions.length) {
            transactionLength = addTransaction.transactions.length;
            latestTransaction = addTransaction.transactions[transactionLength - Constants.VAL_ONE];
            if (null != latestTransaction && Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION == latestTransaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == latestTransaction.state) {
              successMessage = Constants.SUCCESS_MSG_REVERSAL_SERVICE;
            } else {
              errorMessage = Constants.ERROR_MSG_REVERSAL_SERVICE;
            }
          } else {
            errorMessage = Constants.ERROR_MSG_ADD_TRANSACTION_DETAILS;
          }
        } else {
          errorMessage = Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS;
        }
      } else {
        orderErrorMessage = Constants.ERROR_MSG_CANNOT_PROCESS;
        res.redirect('/orders');
        return;
      }
    } else {
      orderErrorMessage = Constants.ERROR_MSG_CANNOT_PROCESS;
      res.redirect('/orders');
      return;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.GET_AUTH_REVERSAL, Constants.LOG_ERROR, null, exceptionData);
    orderErrorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
    res.redirect('/orders');
    return;
  }
  res.redirect(`/paymentdetails?id=${paymentId}`);
});

app.get('/decisionSync', async (req, res) => {
  let decisionSyncResponse: any;
  decisionSyncResponse = await paymentHandler.reportHandler();
  orderSuccessMessage = decisionSyncResponse.message;
  orderErrorMessage = decisionSyncResponse.error;
  res.redirect('/orders');
});

app.get('/sync', async (req, res) => {
  let syncResponse: any;
  syncResponse = await paymentHandler.syncHandler();
  orderSuccessMessage = syncResponse.message;
  orderErrorMessage = syncResponse.error;
  res.redirect('/orders');
});

app.get('/configureExtension', async (req, res) => {
  await resourceHandler.ensureExtension();
  await resourceHandler.ensureCustomTypes();
  orderSuccessMessage = Constants.SUCCESS_MSG_SCRIPT_PLUGIN;
  res.redirect('/orders');
});

app.post('/captureContext', async (req, res) => {
  let requestObj: any;
  let captureContextResponse = Constants.STRING_EMPTY;
  let response = Constants.STRING_EMPTY;
  let cartId: any;
  let cartDetails: any;
  let cartData: any;
  let merchantId = Constants.STRING_EMPTY;
  let country = Constants.STRING_EMPTY;
  let locale = Constants.STRING_EMPTY;
  let currencyCode = Constants.STRING_EMPTY;
  let logData: any;
  let exceptionData: any;
  try{
    if (req?.body) {
      requestObj = req.body;
      if (null != requestObj && typeof requestObj === 'object') {
        if (requestObj?.merchantId) {
          merchantId = requestObj.merchantId;
        }
        if (null != requestObj?.cartId && Constants.STRING_EMPTY != requestObj?.cartId) {
          cartId = requestObj.cartId;
          cartDetails = await commercetoolsApi.getCartById(cartId);
          if (null != cartDetails && undefined != cartDetails) {
            logData = Constants.STRING_CART_ID + cartDetails.id;
            captureContextResponse = await captureContext.generateCaptureContext(cartDetails, null, null, null, merchantId, Constants.SERVICE_PAYMENT);
            response = captureContextResponse;
          }
        } else if (Constants.STRING_EMPTY != requestObj?.country && Constants.STRING_EMPTY != requestObj?.locale && Constants.STRING_EMPTY != requestObj?.currency) {
          country = requestObj.country;
          locale = requestObj.locale;
          currencyCode = requestObj.currency;
          logData = null;
          captureContextResponse = await captureContext.generateCaptureContext(cartData, country, locale, currencyCode, merchantId, Constants.SERVICE_MY_ACCOUNTS);
          response = captureContextResponse;
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CAPTURE_CONTEXT_CREATE, Constants.LOG_INFO, null, Constants.ERROR_MSG_CAPTURE_CONTEXT);
        }
        if (Constants.STRING_EMPTY == captureContextResponse) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CAPTURE_CONTEXT_CREATE, Constants.LOG_INFO, logData, Constants.ERROR_MSG_CAPTURE_CONTEXT);
        }
      }
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = JSON.stringify(exception);
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, 'postCaptureContextCreate', Constants.LOG_ERROR, '', exceptionData);
  }
  res.setHeader('Content-Security-Policy', "script-src 'self'");
  res.send(response);
});

if (Constants.STRING_AWS == process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
  exports.handler = serverless(app);
}
