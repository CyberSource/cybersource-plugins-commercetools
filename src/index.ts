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
let error,
  message = Constants.EMPTY_STRING;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  let ordercount = Constants.VAL_ZERO;
  let total = Constants.VAL_ZERO;
  let ordersList: any;
  error = Constants.EMPTY_STRING;
  message = Constants.EMPTY_STRING;
  ordersList = await commercetoolsApi.getorders();
  if (null != ordersList) {
    ordercount = ordersList.count;
    orderResult = ordersList.results;
    total = ordersList.total;
  }
  res.render('orders', {
    count: ordercount,
    orderlist: orderResult,
    total: total,
    moment: moment,
    amountConversion: paymentService.convertCentToAmount,
  });
});

app.get('/paymentdetails', async (req, res) => {
  let paymentId;
  let paymentDetails: any;
  let convertedPaymentId = Constants.EMPTY_STRING;
  let pendingCaptureAmount = 0.0;
  let authReversalFlag = false;
  if ('id' in req.query) {
    paymentId = req.query.id;
    convertedPaymentId = paymentId.replace(/\s+/g, Constants.EMPTY_STRING);
    paymentDetails = await commercetoolsApi.retrievePayment(convertedPaymentId);
    if (null != paymentDetails) {
      const refundTransaction = paymentDetails.transactions;
      if (null != refundTransaction) {
        refundTransaction.forEach((transaction) => {
          if (
            'CancelAuthorization' == transaction.type &&
            'Success' == transaction.state
          ) {
            authReversalFlag = true;
          }
        });
        if (!authReversalFlag) {
          pendingCaptureAmount =
            paymentService.getCapturedAmount(paymentDetails);
        }
      }
    }
  }
  res.render('paymentdetails', {
    id: convertedPaymentId,
    payments: paymentDetails,
    captureAmount: pendingCaptureAmount,
    amountConversion: paymentService.convertCentToAmount,
    error: error,
    message: message,
  });
});

app.post('/api/extension/payment/create', async (req, res) => {
  let response = {};
  let actions = [];
  let paymentObj: any;
  let microFormKeys: any;
  let paymentMethod = Constants.EMPTY_STRING;
  if (
    Constants.BODY in req &&
    Constants.RESOURCE in req.body &&
    Constants.OBJ in req.body.resource
  ) {
    paymentObj = req.body.resource.obj;
    paymentMethod = paymentObj.paymentMethodInfo.method;
    if (
      paymentMethod == Constants.CREDIT_CARD ||
      paymentMethod == Constants.CC_PAYER_AUTHENTICATION
    ) {
      microFormKeys = await flexKeys.keys();
      if (null != microFormKeys) {
        actions = paymentService.fieldMapper(microFormKeys);
        response = {
          actions: actions,
          errors: [],
        };
      } else {
        response = paymentService.invalidOperationResponse();
      }
    } else {
      response = paymentService.getEmptyResponse();
    }
  } else {
    console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    response = paymentService.getEmptyResponse();
  }
  res.send(response);
});

app.post('/api/extension/payment/update', async (req, res) => {
  let updateResponse: any;
  let updatePaymentObj: any;
  let updateTransactions: any;
  let paymentMethod = Constants.EMPTY_STRING;
  if (
    Constants.BODY in req &&
    Constants.RESOURCE in req.body &&
    Constants.OBJ in req.body.resource
  ) {
    updatePaymentObj = req.body.resource.obj;
    paymentMethod = updatePaymentObj.paymentMethodInfo.method;
    if (Constants.CC_PAYER_AUTHENTICATION == paymentMethod) {
      if (
        null ==
        updatePaymentObj.custom.fields.isv_merchantDefinedData_mddField_1
      ) {
        updateResponse = await paymentHandler.getPayerAuthSetUpResponse(
          updatePaymentObj
        );
      }
      if (
        null ==
          updatePaymentObj.custom.fields.isv_payerAuthenticationTransactionId &&
        null !=
          updatePaymentObj.custom.fields.isv_merchantDefinedData_mddField_1
      ) {
        updateResponse = await paymentHandler.getPayerAuthEnrollResponse(
          updatePaymentObj
        );
      }
    }
    if (0 < updatePaymentObj.transactions.length) {
      updateTransactions = updatePaymentObj.transactions.pop();
      if (Constants.AUTHORIZATION == updateTransactions.type) {
        updateResponse = await paymentHandler.authorizationHandler(
          updatePaymentObj,
          updateTransactions
        );
      } else {
        updateResponse = await paymentHandler.orderManagementHandler(
          req.body.resource.id,
          updatePaymentObj,
          updateTransactions
        );
      }
    }
  } else {
    console.log(Constants.ERROR_MSG_COMMERCETOOLS_CONNECT);
    updateResponse = paymentService.getEmptyResponse();
  }
  res.send(updateResponse);
});

app.get('/capture', async (req, res) => {
  let capturePaymentObj: any;
  let transactionResponse: any;
  let transactionObject: any;
  let latestTransaction: any;
  let captureFlag = false;
  const paymentId = req.query.id;
  try {
    capturePaymentObj = await commercetoolsApi.retrievePayment(paymentId);
    transactionObject = {
      paymentId: paymentId,
      version: capturePaymentObj.version,
      amount: capturePaymentObj.amountPlanned,
      type: Constants.CHARGE,
      state: Constants.INITIAL,
    };
    transactionResponse = await commercetoolsApi.addTransaction(
      transactionObject
    );
    if (transactionResponse) {
      latestTransaction = transactionResponse.transactions.pop();
      if (
        Constants.CHARGE == latestTransaction.type &&
        Constants.SUCCESS == latestTransaction.state
      ) {
        captureFlag = true;
        message = Constants.SUCCESS_MSG_CAPTURE;
        error = Constants.EMPTY_STRING;
      }
    }
    if (!captureFlag) {
      message = Constants.EMPTY_STRING;
      error = Constants.ERROR_MSG_CAPTURE_SERVICE;
    }
  } catch (e) {
    console.log(Constants.ERROR_STRING, e);
  }
  res.redirect(`/paymentdetails?id=${paymentId}`);
});

app.get('/refund', async (req, res) => {
  let refundPaymentObj: any;
  let addTransaction: any;
  let transactionObject: any;
  let latestTransaction: any;
  let refundFlag = false;
  let pendingCaptureAmount = Constants.VAL_FLOAT_ZERO;
  var paymentId = req.query.refundId;
  var refundAmount = Number(req.query.refundAmount);
  refundPaymentObj = await commercetoolsApi.retrievePayment(paymentId);
  pendingCaptureAmount = paymentService.getCapturedAmount(refundPaymentObj);
  if (Constants.VAL_ZERO == refundAmount) {
    error = Constants.ERROR_MSG_REFUND_GREATER_THAN_ZERO;
    message = Constants.EMPTY_STRING;
  } else if (refundAmount > pendingCaptureAmount) {
    error = Constants.ERROR_MSG_REFUND_EXCEEDS_CAPTURE_AMOUNT;
    message = Constants.EMPTY_STRING;
  } else {
    refundPaymentObj.amountPlanned.centAmount =
      paymentService.convertAmountToCent(refundAmount);
    transactionObject = {
      paymentId: paymentId,
      version: refundPaymentObj.version,
      amount: refundPaymentObj.amountPlanned,
      type: Constants.REFUND,
      state: Constants.INITIAL,
    };
    addTransaction = await commercetoolsApi.addTransaction(transactionObject);
    if (null != addTransaction) {
      latestTransaction = addTransaction.transactions.pop();
      if (
        Constants.REFUND == latestTransaction.type &&
        Constants.SUCCESS == latestTransaction.state
      ) {
        refundFlag = true;
        message = Constants.SUCCESS_MSG_REFUND;
        error = Constants.EMPTY_STRING;
      }
    }
    if (!refundFlag) {
      message = Constants.EMPTY_STRING;
      error = Constants.ERROR_MSG_REFUND_SERVICE;
    }
  }
  res.redirect(`/paymentdetails?id=${paymentId}`);
});

app.get('/authReversal', async (req, res) => {
  let authReversalObj: any;
  let addTransaction: any;
  let transactionObject: any;
  let latestTransaction: any;
  let authReversalFlag = false;
  var paymentId = req.query.id;
  authReversalObj = await commercetoolsApi.retrievePayment(paymentId);
  transactionObject = {
    paymentId: paymentId,
    version: authReversalObj.version,
    amount: authReversalObj.amountPlanned,
    type: Constants.CANCEL_AUTHORIZATION,
    state: Constants.INITIAL,
  };
  addTransaction = await commercetoolsApi.addTransaction(transactionObject);
  if (null != addTransaction) {
    latestTransaction = addTransaction.transactions.pop();
    if (
      Constants.CANCEL_AUTHORIZATION == latestTransaction.type &&
      Constants.SUCCESS == latestTransaction.state
    ) {
      authReversalFlag = true;
      message = Constants.SUCCESS_MSG_REVERSAL;
      error = Constants.EMPTY_STRING;
    }
  }
  if (!authReversalFlag) {
    message = Constants.EMPTY_STRING;
    error = Constants.ERROR_MSG_REVERSAL_SERVICE;
  }
  res.redirect(`/paymentdetails?id=${req.query.id}`);
});
