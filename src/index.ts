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
app.use(express.static(path.join(__dirname, '/public')));

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
  let ordercount = Constants.VAL_ZERO;
  let total = Constants.VAL_ZERO;
  errorMessage = Constants.STRING_EMPTY;
  successMessage = Constants.STRING_EMPTY;
  try {
    ordersList = await commercetoolsApi.getorders();
    if (null != ordersList) {
      ordercount = ordersList.count;
      orderResult = ordersList.results;
      total = ordersList.total;
    } else {
      orderErrorMessage = Constants.ERROR_MSG_NO_ORDER_DETAILS;
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
    errorMessage = Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS;
  }
  res.render('orders', {
    count: ordercount,
    orderlist: orderResult,
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
  let convertedPaymentId = Constants.STRING_EMPTY;
  let pendingCaptureAmount = Constants.VAL_FLOAT_ZERO;
  let authReversalFlag = false;
  orderErrorMessage = Constants.STRING_EMPTY;
  orderSuccessMessage = Constants.STRING_EMPTY;
  try {
    if (Constants.STRING_ID in req.query) {
      paymentId = req.query.id;
      convertedPaymentId = paymentId.replace(/\s+/g, Constants.STRING_EMPTY);
      paymentDetails = await commercetoolsApi.retrievePayment(
        convertedPaymentId
      );
      if (null != paymentDetails) {
        const refundTransaction = paymentDetails.transactions;
        if (null != refundTransaction) {
          refundTransaction.forEach((transaction) => {
            if (
              Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION ==
                transaction.type &&
              Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state
            ) {
              authReversalFlag = true;
            }
          });
          if (!authReversalFlag) {
            pendingCaptureAmount =
              paymentService.getCapturedAmount(paymentDetails);
          }
        }
      } else {
        errorMessage = Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS;
      }
    } else {
      errorMessage = Constants.ERROR_MSG_EMPTY_PAYMENT_DATA;
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
    errorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.render('paymentdetails', {
    id: convertedPaymentId,
    payments: paymentDetails,
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
  let paymentMethod = Constants.STRING_EMPTY;
  try {
    if (
      Constants.STRING_BODY in req &&
      Constants.STRING_RESOURCE in req.body &&
      Constants.STRING_OBJ in req.body.resource
    ) {
      paymentObj = req.body.resource.obj;
      paymentMethod = paymentObj.paymentMethodInfo.method;
      if (
        paymentMethod == Constants.CREDIT_CARD ||
        paymentMethod == Constants.CC_PAYER_AUTHENTICATION
      ) {
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
          } else {
            console.log(Constants.ERROR_MSG_FLEX_TOKEN_KEYS);
            response = paymentService.invalidOperationResponse();
          }
        }
      } else {
        response = paymentService.getEmptyResponse();
      }
    } else {
      console.log(Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
      response = paymentService.getEmptyResponse();
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
    response = paymentService.invalidOperationResponse();
  }
  console.log('Create :', response);
  res.send(response);
});

app.post('/api/extension/payment/update', async (req, res) => {
  let updateResponse: any;
  let updatePaymentObj: any;
  let updateTransactions: any;
  let paymentMethod = Constants.STRING_EMPTY;
  try {
    if (
      Constants.STRING_BODY in req &&
      Constants.STRING_RESOURCE in req.body &&
      Constants.STRING_OBJ in req.body.resource
    ) {
      updatePaymentObj = req.body.resource.obj;
      paymentMethod = updatePaymentObj.paymentMethodInfo.method;
      if (
        Constants.CC_PAYER_AUTHENTICATION == paymentMethod &&
        Constants.VAL_ZERO == updatePaymentObj.transactions.length
      ) {
        if (!(Constants.ISV_MDD_1 in updatePaymentObj.custom.fields)) {
          console.log('Payer Auth');
          updateResponse = await paymentHandler.getPayerAuthSetUpResponse(
            updatePaymentObj
          );
        } else if (
          !(
            Constants.ISV_PAYER_AUTHETICATION_TRANSACTION_ID in
            updatePaymentObj.custom.fields
          ) &&
          Constants.ISV_MDD_1 in updatePaymentObj.custom.fields
        ) {
          console.log('Payer Auth Enrollment');
          updateResponse = await paymentHandler.getPayerAuthEnrollResponse(
            updatePaymentObj
          );
        }
      }
      if (Constants.VAL_ZERO < updatePaymentObj.transactions.length) {
        updateTransactions = updatePaymentObj.transactions.pop();
        if (
          Constants.CT_TRANSACTION_TYPE_AUTHORIZATION == updateTransactions.type
        ) {
          if (
            Constants.CT_TRANSACTION_STATE_SUCCESS ==
              updateTransactions.state ||
            Constants.CT_TRANSACTION_STATE_FAILURE == updateTransactions.state
          ) {
            updateResponse = paymentService.getEmptyResponse();
          } else {
            console.log('Auth');
            updateResponse = await paymentHandler.authorizationHandler(
              updatePaymentObj,
              updateTransactions
            );
          }
        } else {
          updateResponse = await paymentHandler.orderManagementHandler(
            req.body.resource.id,
            updatePaymentObj,
            updateTransactions
          );
        }
      }
    } else {
      console.log(Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
      updateResponse = paymentService.getEmptyResponse();
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
    updateResponse = paymentService.invalidOperationResponse();
  }
  console.log('UpdateResponse :', updateResponse);
  res.send(updateResponse);
});

app.get('/capture', async (req, res) => {
  let paymentId: any;
  let capturePaymentObj: any;
  let transactionResponse: any;
  let transactionObject: any;
  let latestTransaction: any;
  errorMessage = Constants.STRING_EMPTY;
  successMessage = Constants.STRING_EMPTY;
  try {
    if (Constants.STRING_QUERY in req && Constants.STRING_ID in req.query) {
      paymentId = req.query.id;
      capturePaymentObj = await commercetoolsApi.retrievePayment(paymentId);
      transactionObject = {
        paymentId: paymentId,
        version: capturePaymentObj.version,
        amount: capturePaymentObj.amountPlanned,
        type: Constants.CT_TRANSACTION_TYPE_CHARGE,
        state: Constants.CT_TRANSACTION_STATE_INITIAL,
      };
      transactionResponse = await commercetoolsApi.addTransaction(
        transactionObject
      );
      if (null != transactionResponse) {
        latestTransaction = transactionResponse.transactions.pop();
        if (
          Constants.CT_TRANSACTION_TYPE_CHARGE == latestTransaction.type &&
          Constants.CT_TRANSACTION_STATE_SUCCESS == latestTransaction.state
        ) {
          successMessage = Constants.SUCCESS_MSG_CAPTURE_SERVICE;
        } else {
          errorMessage = Constants.ERROR_MSG_CAPTURE_SERVICE;
        }
      } else {
        errorMessage = Constants.ERROR_MSG_ADD_TRANSACTION_DETAILS;
      }
    } else {
      errorMessage = Constants.ERROR_MSG_EMPTY_PAYMENT_DATA;
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
    errorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
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
  let pendingCaptureAmount: number;
  errorMessage = Constants.STRING_EMPTY;
  successMessage = Constants.STRING_EMPTY;
  try {
    if (
      Constants.STRING_QUERY in req &&
      Constants.REFUND_ID in req.query &&
      Constants.REFUND_AMOUNT in req.query
    ) {
      paymentId = req.query.refundId;
      refundAmount = Number(req.query.refundAmount);
      refundPaymentObj = await commercetoolsApi.retrievePayment(paymentId);
      if (null != refundPaymentObj) {
        pendingCaptureAmount =
          paymentService.getCapturedAmount(refundPaymentObj);
        if (Constants.VAL_ZERO == refundAmount) {
          errorMessage = Constants.ERROR_MSG_REFUND_GREATER_THAN_ZERO;
          successMessage = Constants.STRING_EMPTY;
        } else if (refundAmount > pendingCaptureAmount) {
          errorMessage = Constants.ERROR_MSG_REFUND_EXCEEDS_CAPTURE_AMOUNT;
          successMessage = Constants.STRING_EMPTY;
        } else {
          refundPaymentObj.amountPlanned.centAmount =
            paymentService.convertAmountToCent(refundAmount);
          transactionObject = {
            paymentId: paymentId,
            version: refundPaymentObj.version,
            amount: refundPaymentObj.amountPlanned,
            type: Constants.CT_TRANSACTION_TYPE_REFUND,
            state: Constants.CT_TRANSACTION_STATE_INITIAL,
          };
          addTransaction = await commercetoolsApi.addTransaction(
            transactionObject
          );
          if (null != addTransaction) {
            latestTransaction = addTransaction.transactions.pop();
            if (
              Constants.CT_TRANSACTION_TYPE_REFUND == latestTransaction.type &&
              Constants.CT_TRANSACTION_STATE_SUCCESS == latestTransaction.state
            ) {
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
      errorMessage = Constants.ERROR_MSG_EMPTY_PAYMENT_DATA;
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
    errorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.redirect(`/paymentdetails?id=${paymentId}`);
});

app.get('/authReversal', async (req, res) => {
  let paymentId: any;
  let authReversalObj: any;
  let addTransaction: any;
  let transactionObject: any;
  let latestTransaction: any;
  errorMessage = Constants.STRING_EMPTY;
  successMessage = Constants.STRING_EMPTY;
  try {
    if (Constants.STRING_QUERY in req && Constants.STRING_ID in req.query) {
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
        addTransaction = await commercetoolsApi.addTransaction(
          transactionObject
        );
        if (null != addTransaction) {
          latestTransaction = addTransaction.transactions.pop();
          if (
            Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION ==
              latestTransaction.type &&
            Constants.CT_TRANSACTION_STATE_SUCCESS == latestTransaction.state
          ) {
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
      errorMessage = Constants.ERROR_MSG_EMPTY_PAYMENT_DATA;
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
    errorMessage = Constants.EXCEPTION_MSG_FETCH_PAYMENT_DETAILS;
  }
  res.redirect(`/paymentdetails?id=${req.query.id}`);
});

app.get('/decisionsync', async (req, res) => {
  let decisionSyncResponse: any;
  orderSuccessMessage = Constants.STRING_EMPTY;
  orderErrorMessage = Constants.STRING_EMPTY;
  try {
    decisionSyncResponse = await paymentHandler.reportHandler();
    if (null != decisionSyncResponse) {
      orderErrorMessage = Constants.ERROR_MSG_NO_CONVERSION_DETAILS;
    } else {
      orderSuccessMessage = decisionSyncResponse.message;
      orderErrorMessage = decisionSyncResponse.error;
    }
  } catch (exception) {
    console.log(Constants.STRING_EXCEPTION, exception);
    orderSuccessMessage = Constants.STRING_EMPTY;
    orderErrorMessage = Constants.STRING_EMPTY;
  }
  res.redirect('/orders');
});
