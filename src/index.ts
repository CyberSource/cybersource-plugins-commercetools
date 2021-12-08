import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import moment from 'moment';
import path from 'path';

import flexKeys from './service/payment/FlexKeys';
import commercetoolsApi from './utils/api/CommercetoolsApi';
import paymentHandler from './utils//PaymentHandler';
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

app.post('/sunriseSpa', (req, res) => {
  res.send(`<script>window.parent.postMessage({
    'messageType': 'validationCallback',
    'message': '${req.body.TransactionId}'
}, "*");</script>`);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.GET_ORDERS, Constants.LOG_ERROR, exceptionData);
    orderErrorMessage = Constants.ERROR_MSG_NO_ORDER_DETAILS;
  }
  res.render('orders', {
    count: orderCount,
    orderlist: orderResult,
    total: total,
    moment: moment,
    amountConversion: paymentService.convertCentToAmount,
    orderErrorMessage: orderErrorMessage,
    orderSuccessMessage: orderSuccessMessage,
  });
});

app.get('/paymentDetails', async (req, res) => {
  let paymentId: any;
  let paymentDetails: any;
  let cartDetails: any;
  let cartData: any;
  let exceptionData: any;
  let refundTransaction: any;
  let convertedPaymentId = Constants.STRING_EMPTY;
  let pendingCaptureAmount = Constants.VAL_FLOAT_ZERO;
  let authReversalFlag = false;
  orderErrorMessage = Constants.STRING_EMPTY;
  orderSuccessMessage = Constants.STRING_EMPTY;
  try {
    if (Constants.STRING_ID in req.query) {
      paymentId = req.query.id;
      convertedPaymentId = paymentId.replace(/\s+/g, Constants.STRING_EMPTY);
      cartDetails = await commercetoolsApi.retrieveCartByPaymentId(convertedPaymentId);
      cartData = cartDetails.results[Constants.VAL_ZERO];
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
    errorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.render('paymentDetails', {
    id: convertedPaymentId,
    payments: paymentDetails,
    cart: cartData,
    captureAmount: pendingCaptureAmount,
    amountConversion: paymentService.convertCentToAmount,
    errorMessage: errorMessage,
    successMessage: successMessage,
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
        if (Constants.ISV_SAVED_TOKEN in paymentObj.custom.fields) {
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
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CREATE, Constants.LOG_INFO, response);
          } else {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CREATE, Constants.LOG_INFO, Constants.ERROR_MSG_FLEX_TOKEN_KEYS);
            response = paymentService.invalidOperationResponse();
          }
        }
      } else {
        response = paymentService.getEmptyResponse();
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CREATE, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CREATE, Constants.LOG_ERROR, exceptionData);
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
  try {
    if (Constants.STRING_BODY in req && Constants.STRING_RESOURCE in req.body && Constants.STRING_OBJ in req.body.resource) {
      updatePaymentObj = req.body.resource.obj;
      paymentMethod = updatePaymentObj.paymentMethodInfo.method;
      if (Constants.CC_PAYER_AUTHENTICATION == paymentMethod && Constants.VAL_ZERO == updatePaymentObj.transactions.length) {
        if (!(Constants.ISV_MDD_1 in updatePaymentObj.custom.fields)) {
          updateResponse = await paymentHandler.getPayerAuthSetUpResponse(updatePaymentObj);
        } else if (!(Constants.ISV_PAYER_AUTHETICATION_TRANSACTION_ID in updatePaymentObj.custom.fields) && Constants.ISV_MDD_1 in updatePaymentObj.custom.fields) {
          updateResponse = await paymentHandler.getPayerAuthEnrollResponse(updatePaymentObj);
        }
      }
      if (Constants.VAL_ZERO < updatePaymentObj.transactions.length) {
        updateTransactions = updatePaymentObj.transactions.pop();
        if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION == updateTransactions.type) {
          if (Constants.CT_TRANSACTION_STATE_SUCCESS == updateTransactions.state || Constants.CT_TRANSACTION_STATE_FAILURE == updateTransactions.state) {
            updateResponse = paymentService.getEmptyResponse();
          } else {
            updateResponse = await paymentHandler.authorizationHandler(updatePaymentObj, updateTransactions);
          }
        } else {
          updateResponse = await paymentHandler.orderManagementHandler(req.body.resource.id, updatePaymentObj, updateTransactions);
        }
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_UPDATE, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_UPDATE, Constants.LOG_ERROR, exceptionData);
    updateResponse = paymentService.invalidOperationResponse();
  }
  res.send(updateResponse);
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
      transactionObject = {
        paymentId: paymentId,
        version: capturePaymentObj.version,
        amount: capturePaymentObj.amountPlanned,
        type: Constants.CT_TRANSACTION_TYPE_CHARGE,
        state: Constants.CT_TRANSACTION_STATE_INITIAL,
      };
      transactionResponse = await commercetoolsApi.addTransaction(transactionObject);
      if (null != transactionResponse) {
        latestTransaction = transactionResponse.transactions.pop();
        if (Constants.CT_TRANSACTION_TYPE_CHARGE == latestTransaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == latestTransaction.state) {
          successMessage = Constants.SUCCESS_MSG_CAPTURE_SERVICE;
        } else {
          errorMessage = Constants.ERROR_MSG_CAPTURE_SERVICE;
        }
      } else {
        errorMessage = Constants.ERROR_MSG_ADD_TRANSACTION_DETAILS;
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
    errorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.redirect(`/paymentDetails?id=${paymentId}`);
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
          if (null != addTransaction) {
            latestTransaction = addTransaction.transactions.pop();
            if (Constants.CT_TRANSACTION_TYPE_REFUND == latestTransaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == latestTransaction.state) {
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
    errorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.redirect(`/paymentDetails?id=${paymentId}`);
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
        if (null != addTransaction) {
          latestTransaction = addTransaction.transactions.pop();
          if (Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION == latestTransaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == latestTransaction.state) {
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
    errorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.redirect(`/paymentDetails?id=${req.query.id}`);
});

app.get('/decisionSync', async (req, res) => {
  let decisionSyncResponse: any;
  decisionSyncResponse = await paymentHandler.reportHandler();
  orderSuccessMessage = decisionSyncResponse.message;
  orderErrorMessage = decisionSyncResponse.error;
  res.redirect('/orders');
});
