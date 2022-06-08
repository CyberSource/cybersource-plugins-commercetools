import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import moment from 'moment';
import path from 'path';

import flexKeys from './service/payment/FlexKeys';
import commercetoolsApi from './utils/api/CommercetoolsApi';
import paymentHandler from './utils/PaymentHandler';
import paymentService from './utils/PaymentService';
import { Constants } from './constants';

dotenv.config();
const app = express();
const port = process.env.CONFIG_PORT;
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

app.listen(port, () => {
  console.log(`Application running on port:${port}`);
});

app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');

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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.GET_ORDERS, Constants.LOG_ERROR, exceptionData);
    orderErrorMessage = Constants.ERROR_MSG_NO_ORDER_DETAILS;
  }
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
  let cartDetails: any;
  let cartData: any;
  let exceptionData: any;
  let refundTransaction: any;
  let selectedLocale: any;
  let locale: any;
  let authReversalFlag = false;
  let convertedPaymentId = Constants.STRING_EMPTY;
  let pendingCaptureAmount = Constants.VAL_FLOAT_ZERO;
  let refundErrorMessage = Constants.ERROR_MSG_REFUND_AMOUNT;
  orderErrorMessage = Constants.STRING_EMPTY;
  orderSuccessMessage = Constants.STRING_EMPTY;
  try {
    if (Constants.STRING_ID in req.query) {
      paymentId = req.query.id;
      convertedPaymentId = paymentId.replace(/\s+/g, Constants.STRING_EMPTY);
      cartDetails = await commercetoolsApi.retrieveCartByPaymentId(convertedPaymentId);
      cartData = cartDetails.results[Constants.VAL_ZERO];
      if (null != cartData && Constants.STRING_LOCALE in cartData && null != cartData.locale) {
        selectedLocale = cartData.locale.split(Constants.REGEX_HYPHEN);
        locale = selectedLocale[Constants.VAL_ZERO];
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
          }
        }
      } else {
        errorMessage = Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS;
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
    paymentService.logData(path.parse(path.parse(path.basename(__filename)).name).name, Constants.GET_PAYMENT_DETAILS, Constants.LOG_ERROR, exceptionData);
    orderErrorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
    res.redirect('/orders');
  }
  res.render('paymentdetails', {
    id: convertedPaymentId,
    payments: paymentDetails,
    cart: cartData,
    captureAmount: pendingCaptureAmount,
    amountConversion: paymentService.convertCentToAmount,
    roundOff: paymentService.roundOff,
    locale: locale,
    errorMessage: errorMessage,
    successMessage: successMessage,
    refundErrorMessage: refundErrorMessage,
  });
});

app.post('/api/extension/payment/create', async (req, res) => {
  let paymentObj: any;
  let microFormKeys: any;
  let response: any;
  let actions: any;
  let exceptionData: any;
  let paymentMethod = Constants.STRING_EMPTY;
  try {
    if (Constants.STRING_BODY in req && Constants.STRING_RESOURCE in req.body && Constants.STRING_OBJ in req.body.resource) {
      paymentObj = req.body.resource.obj;
      paymentMethod = paymentObj.paymentMethodInfo.method;
      if (paymentMethod == Constants.CREDIT_CARD || paymentMethod == Constants.CC_PAYER_AUTHENTICATION) {
        if (null != paymentObj && Constants.STRING_CUSTOM in paymentObj && Constants.STRING_FIELDS in paymentObj.custom && Constants.ISV_SAVED_TOKEN in paymentObj.custom.fields && Constants.STRING_EMPTY != paymentObj.custom.fields.isv_savedToken) {
          actions = paymentService.fieldMapper(paymentObj.custom.fields);
          response = {
            actions: actions,
            errors: [],
          };
        } else {
          microFormKeys = await flexKeys.keys();
          if (null != microFormKeys) {
            actions = paymentService.fieldMapper(microFormKeys);
            response = {
              actions: actions,
              errors: [],
            };
          } else {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_CREATE, Constants.LOG_INFO, Constants.ERROR_MSG_FLEX_TOKEN_KEYS);
            response = paymentService.invalidOperationResponse();
          }
        }
      } else if (paymentMethod == Constants.APPLE_PAY) {
        if (Constants.STRING_CUSTOM in paymentObj && Constants.STRING_FIELDS in paymentObj.custom) {
          response = await paymentHandler.applePaySessionHandler(paymentObj.custom.fields);
        }
      } else {
        response = paymentService.getEmptyResponse();
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_CREATE, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
      response = paymentService.getEmptyResponse();
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_CREATE, Constants.LOG_ERROR, exceptionData);
    response = paymentService.invalidOperationResponse();
  }
  res.send(response);
});

app.post('/api/extension/payment/update', async (req, res) => {
  let updateResponse: any;
  let updatePaymentObj: any;
  let updateTransactions: any;
  let exceptionData: any;
  let paymentMethod = Constants.STRING_EMPTY;
  let paymentResponse = {
    httpCode: null,
    status: null,
    transactionId: null,
  };
  try {
    if (Constants.STRING_BODY in req && Constants.STRING_RESOURCE in req.body && Constants.STRING_OBJ in req.body.resource) {
      updatePaymentObj = req.body.resource.obj;
      paymentMethod = updatePaymentObj.paymentMethodInfo.method;
      if (Constants.CC_PAYER_AUTHENTICATION == paymentMethod && Constants.VAL_ZERO == updatePaymentObj.transactions.length) {
        if (null != updatePaymentObj && Constants.STRING_CUSTOM in updatePaymentObj && Constants.STRING_FIELDS in updatePaymentObj.custom && !(Constants.ISV_CARDINAL_REFERENCE_ID in updatePaymentObj.custom.fields)) {
          updateResponse = await paymentHandler.getPayerAuthSetUpResponse(updatePaymentObj);
        } else if (
          Constants.STRING_CUSTOM in updatePaymentObj &&
          Constants.STRING_FIELDS in updatePaymentObj.custom &&
          !(Constants.ISV_PAYER_AUTHENTICATION_TRANSACTION_ID in updatePaymentObj.custom.fields) &&
          Constants.ISV_CARDINAL_REFERENCE_ID in updatePaymentObj.custom.fields &&
          Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_cardinalReferenceId
        ) {
          updateResponse = await paymentHandler.getPayerAuthEnrollResponse(updatePaymentObj);
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
          updateResponse = await paymentHandler.getPayerAuthValidateResponse(updatePaymentObj);
        }
      }
      if (Constants.VAL_ZERO < updatePaymentObj.transactions.length) {
        updateTransactions = updatePaymentObj.transactions.pop();
        if (
          null != updateTransactions &&
          Constants.TYPE_ID_TYPE in updateTransactions &&
          (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION == updateTransactions.type ||
            (Constants.CT_TRANSACTION_TYPE_CHARGE == updateTransactions.type &&
              ((Constants.STRING_CUSTOM in updatePaymentObj && Constants.STRING_FIELDS in updatePaymentObj.custom && Constants.ISV_SALE_ENABLED in updatePaymentObj.custom.fields && updatePaymentObj.custom.fields.isv_saleEnabled) || paymentMethod == Constants.ECHECK)))
        ) {
          if (Constants.CT_TRANSACTION_STATE_SUCCESS == updateTransactions.state || Constants.CT_TRANSACTION_STATE_FAILURE == updateTransactions.state || Constants.CT_TRANSACTION_STATE_PENDING == updateTransactions.state) {
            updateResponse = paymentService.getEmptyResponse();
          } else if (Constants.CC_PAYER_AUTHENTICATION == paymentMethod && Constants.STRING_CUSTOM in updatePaymentObj && Constants.STRING_FIELDS in updatePaymentObj.custom && Constants.ISV_PAYER_AUTHENTICATION_REQUIRED in updatePaymentObj.custom.fields) {
            paymentResponse.httpCode = updatePaymentObj.custom.fields.isv_payerEnrollHttpCode;
            paymentResponse.status = updatePaymentObj.custom.fields.isv_payerEnrollStatus;
            paymentResponse.transactionId = updatePaymentObj.custom.fields.isv_payerEnrollTransactionId;
            updateResponse = paymentService.getAuthResponse(paymentResponse, updateTransactions);
            if (null != paymentResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status) {
              updateResponse = await paymentHandler.getPayerAuthReversalHandler(updatePaymentObj, paymentResponse, updateTransactions, updateResponse);
            }
          } else {
            updateResponse = await paymentHandler.authorizationHandler(updatePaymentObj, updateTransactions);
          }
        } else {
          updateResponse = await paymentHandler.orderManagementHandler(req.body.resource.id, updatePaymentObj, updateTransactions);
        }
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_UPDATE, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_PAYMENT_UPDATE, Constants.LOG_ERROR, exceptionData);
    updateResponse = paymentService.invalidOperationResponse();
  }
  res.send(updateResponse);
});

app.post('/api/extension/customer/update', async (req, res) => {
  let response: any;
  let tokensToUpdate: any;
  let exceptionData: any;
  let microFormKeys: any;
  let actions: any;
  let customerInfo: any;
  let customFields: any;
  try {
    if (
      Constants.STRING_BODY in req &&
      Constants.STRING_RESOURCE in req.body &&
      Constants.STRING_OBJ in req.body.resource &&
      Constants.STRING_CUSTOM in req.body.resource.obj &&
      Constants.STRING_FIELDS in req.body.resource.obj.custom &&
      Constants.ISV_CAPTURE_CONTEXT_SIGNATURE in req.body.resource.obj.custom.fields &&
      Constants.STRING_EMPTY == req.body.resource.obj.custom.fields.isv_tokenCaptureContextSignature
    ) {
      microFormKeys = await flexKeys.keys();
      if (null != microFormKeys) {
        actions = paymentService.fieldMapper(microFormKeys);
        response = {
          actions: actions,
          errors: [],
        };
      }
    } else if (
      Constants.STRING_BODY in req &&
      Constants.STRING_RESOURCE in req.body &&
      Constants.STRING_OBJ in req.body.resource &&
      Constants.STRING_CUSTOM in req.body.resource.obj &&
      Constants.STRING_FIELDS in req.body.resource.obj.custom &&
      Constants.ISV_ADDRESS_ID in req.body.resource.obj.custom.fields &&
      Constants.STRING_EMPTY != req.body.resource.obj.custom.fields.isv_addressId
    ) {
      response = await paymentHandler.addCardHandler(req.body.resource.id, req.body.resource.obj.addresses, req.body.resource.obj);
    } else if (
      Constants.STRING_BODY in req &&
      Constants.STRING_RESOURCE in req.body &&
      Constants.STRING_ID in req.body.resource &&
      Constants.STRING_OBJ in req.body.resource &&
      Constants.STRING_CUSTOM in req.body.resource.obj &&
      Constants.STRING_FIELDS in req.body.resource.obj.custom &&
      Constants.ISV_TOKENS in req.body.resource.obj.custom.fields &&
      Constants.STRING_EMPTY != req.body.resource.obj.custom.fields.isv_tokens &&
      Constants.VAL_ZERO < req.body.resource.obj.custom.fields.isv_tokens.length
    ) {
      customFields = req.body.resource.obj.custom.fields;
      tokensToUpdate = JSON.parse(customFields.isv_tokens[Constants.VAL_ZERO]);
      if (Constants.STRING_DELETE == customFields.isv_tokenAction) {
        response = await paymentHandler.deleteCardHandler(tokensToUpdate, req.body.resource.id);
      } else if (Constants.STRING_UPDATE == customFields.isv_tokenAction) {
        response = await paymentHandler.updateCardHandler(tokensToUpdate, req.body.resource.id, req.body.resource.obj);
      } else {
        response = paymentService.getUpdateTokenActions(customFields.isv_tokens, customFields.isv_failedTokens, true);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CUSTOMER_UPDATE, Constants.LOG_ERROR, exceptionData);
  }
  if (null == response) {
    customerInfo = await commercetoolsApi.getCustomer(req.body.resource.id);
    if (
      null != customerInfo &&
      Constants.STRING_CUSTOM in customerInfo &&
      Constants.STRING_FIELDS in customerInfo.custom &&
      Constants.ISV_TOKENS in customerInfo.custom.fields &&
      Constants.STRING_EMPTY != customerInfo.custom.fields.isv_tokens &&
      Constants.VAL_ZERO < customerInfo.custom.fields.isv_tokens.length
    ) {
      response = paymentService.getUpdateTokenActions(customerInfo.custom.fields.isv_tokens, customerInfo.custom.fields.isv_failedTokens, true);
    }
  }
  res.send(response);
});

app.get('/capture', async (req, res) => {
  let paymentId: any;
  let capturePaymentObj: any;
  let transactionResponse: any;
  let transactionObject: any;
  let latestTransaction: any;
  let exceptionData: any;
  errorMessage = Constants.STRING_EMPTY;
  successMessage = Constants.STRING_EMPTY;
  try {
    if (Constants.STRING_QUERY in req && Constants.STRING_ID in req.query && null != req.query.id) {
      paymentId = req.query.id;
      capturePaymentObj = await commercetoolsApi.retrievePayment(paymentId);
      if (null != capturePaymentObj) {
        transactionObject = {
          paymentId: paymentId,
          version: capturePaymentObj.version,
          amount: capturePaymentObj.amountPlanned,
          type: Constants.CT_TRANSACTION_TYPE_CHARGE,
          state: Constants.CT_TRANSACTION_STATE_INITIAL,
        };
        transactionResponse = await commercetoolsApi.addTransaction(transactionObject);
        if (null != transactionResponse && Constants.STRING_TRANSACTIONS in transactionResponse) {
          latestTransaction = transactionResponse.transactions.pop();
          if (null != latestTransaction && Constants.CT_TRANSACTION_TYPE_CHARGE == latestTransaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == latestTransaction.state) {
            successMessage = Constants.SUCCESS_MSG_CAPTURE_SERVICE;
          } else {
            errorMessage = Constants.ERROR_MSG_CAPTURE_SERVICE;
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
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.GET_CAPTURE, Constants.LOG_ERROR, exceptionData);
    orderErrorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
    res.redirect('/orders');
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
  let pendingCaptureAmount: number;
  errorMessage = Constants.STRING_EMPTY;
  successMessage = Constants.STRING_EMPTY;
  try {
    if (Constants.STRING_QUERY in req && Constants.REFUND_ID in req.query && null != req.query.refundId && Constants.REFUND_AMOUNT in req.query) {
      paymentId = req.query.refundId;
      refundAmount = Number(req.query.refundAmount);
      refundPaymentObj = await commercetoolsApi.retrievePayment(paymentId);
      if (null != refundPaymentObj) {
        pendingCaptureAmount = paymentService.getCapturedAmount(refundPaymentObj);
        if (Constants.VAL_ZERO == refundAmount) {
          errorMessage = Constants.ERROR_MSG_REFUND_GREATER_THAN_ZERO;
          successMessage = Constants.STRING_EMPTY;
        } else if (refundAmount > pendingCaptureAmount) {
          errorMessage = Constants.ERROR_MSG_REFUND_EXCEEDS_CAPTURE_AMOUNT;
          successMessage = Constants.STRING_EMPTY;
        } else {
          refundPaymentObj.amountPlanned.centAmount = paymentService.convertAmountToCent(refundAmount);
          transactionObject = {
            paymentId: paymentId,
            version: refundPaymentObj.version,
            amount: refundPaymentObj.amountPlanned,
            type: Constants.CT_TRANSACTION_TYPE_REFUND,
            state: Constants.CT_TRANSACTION_STATE_INITIAL,
          };
          addTransaction = await commercetoolsApi.addTransaction(transactionObject);
          if (null != addTransaction && Constants.STRING_TRANSACTIONS in addTransaction) {
            latestTransaction = addTransaction.transactions.pop();
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
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.GET_REFUND, Constants.LOG_ERROR, exceptionData);
    orderErrorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
    res.redirect('/orders');
  }
  res.redirect(`/paymentdetails?id=${paymentId}`);
});

app.get('/authReversal', async (req, res) => {
  let paymentId: any;
  let authReversalObj: any;
  let addTransaction: any;
  let transactionObject: any;
  let latestTransaction: any;
  let exceptionData: any;
  errorMessage = Constants.STRING_EMPTY;
  successMessage = Constants.STRING_EMPTY;
  try {
    if (Constants.STRING_QUERY in req && Constants.STRING_ID in req.query && null != req.query.id) {
      paymentId = req.query.id;
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
        if (null != addTransaction && Constants.STRING_TRANSACTIONS in addTransaction) {
          latestTransaction = addTransaction.transactions.pop();
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
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.GET_AUTH_REVERSAL, Constants.LOG_ERROR, exceptionData);
    orderErrorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
    res.redirect('/orders');
  }
  res.redirect(`/paymentdetails?id=${req.query.id}`);
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

app.get('/configurePlugin', async (req, res) => {
  let scriptResponse: any;
  let url: any;
  let getCustomType: any;
  let typeObj: any;
  for (let extension of Constants.ISV_PAYMENT_EXTENSIONS) {
    if (Constants.PAYMENT_CREATE_KEY == extension.key) {
      url = Constants.PAYMENT_CREATE_DESTINATION_URL;
    } else if (Constants.PAYMENT_UPDATE_KEY == extension.key) {
      url = Constants.PAYMENT_UPDATE_DESTINATION_URL;
    } else if (Constants.CUSTOMER_UPDATE_KEY == extension.key) {
      url = Constants.CUSTOMER_CREATE_DESTINATION_URL;
    }
    extension.destination.url = process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + url;
    extension.destination.authentication.headerValue = Constants.AUTHENTICATION_SCHEME + process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE;
    scriptResponse = await commercetoolsApi.addExtensions(extension);
    if (null != scriptResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE != parseInt(scriptResponse.statusCode)) {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CONFIGURE_PLUGIN, Constants.LOG_INFO, Constants.ERROR_MSG_CREATE_EXTENSION + Constants.STRING_SEMICOLON + extension.key + Constants.STRING_HYPHEN + scriptResponse.message);
    }
  }
  for (let customType of Constants.CUSTOM_TYPES) {
    scriptResponse = await commercetoolsApi.addCustomTypes(customType);
    if (null != scriptResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE != scriptResponse.statusCode) {
      if (
        Constants.HTTP_CODE_FOUR_HUNDRED == scriptResponse.statusCode &&
        Constants.HTTP_CODE_FOUR_HUNDRED == scriptResponse.body.statusCode &&
        Constants.STRING_ERRORS in scriptResponse.body &&
        Constants.STRING_DUPLICATE_FIELD == scriptResponse.body.errors[Constants.VAL_ZERO].code
      ) {
        getCustomType = await commercetoolsApi.getCustomType(customType.key);
        if (null != getCustomType && Constants.HTTP_CODE_TWO_HUNDRED == getCustomType.statusCode) {
          typeObj = getCustomType.body;
          paymentHandler.updateCustomField(customType.fieldDefinitions, typeObj.fieldDefinitions, typeObj.id, typeObj.version);
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CONFIGURE_PLUGIN, Constants.LOG_INFO, Constants.ERROR_MSG_CREATE_CUSTOM_TYPE + Constants.REGEX_HYPHEN + customType.key + Constants.STRING_HYPHEN + scriptResponse.message);
      }
    }
  }
  orderSuccessMessage = Constants.SUCCESS_MSG_SCRIPT_PLUGIN;
  res.redirect('/orders');
});
