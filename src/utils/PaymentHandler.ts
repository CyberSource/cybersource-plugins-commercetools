import jwtDecode from 'jwt-decode';

import paymentAuthorization from './../service/payment/PaymentAuthorizationService';
import paymentService from './../utils/PaymentService';
import commercetoolsApi from './../utils/api/CommercetoolsApi';
import paymentCapture from './../service/payment/PaymentCaptureService';
import paymentRefund from './../service/payment/PaymentRefundService';
import paymentAuthReversal from './../service/payment/PaymentAuthorizationReversal';
import clickToPay from '../service/payment/ClickToPayDetails';
import payerAuthEnroll from '../service/payment/PayerAuthenticationEnrollService';
import paymentAuthSetUp from '../service/payment/PayerAuthenticationSetupService';
import { Constants } from '../constants';

const authorizationHandler = async (updatePaymentObj, updateTransactions) => {
  let authResponse: any;
  let paymentResponse: any;
  let cartUpdate: any;
  let visaCheckoutData: any;
  let actions: any;
  let paymentMethod: string;
  let service: string;
  let cartObj: any;
  let errorFlag = false;
  try {
    const transactionObj =
      paymentService.transactionDetails(updateTransactions);
    if (Constants.CUSTOMER in updatePaymentObj) {
      cartObj = await commercetoolsApi.retrieveCartByCustomerId(
        updatePaymentObj.customer.id
      );
    } else {
      cartObj = await commercetoolsApi.retrieveCartByAnonymousId(
        updatePaymentObj.anonymousId
      );
    }
    if (null != cartObj) {
      paymentMethod = updatePaymentObj.paymentMethodInfo.method;
      switch (paymentMethod) {
        case Constants.CREDIT_CARD: {
          paymentResponse = await paymentAuthorization.getAuthorizationResponse(
            updatePaymentObj,
            cartObj.results[Constants.VAL_ZERO],
            Constants.CARD
          );
          authResponse = paymentService.getAuthResponse(
            paymentResponse,
            transactionObj
          );
          authResponse.actions.push({
            action: Constants.SET_CUSTOM_FIELD,
            name: Constants.ISV_CAPTURE_CONTEXT_SIGNATURE,
            value: null,
          });
          break;
        }
        case Constants.CC_PAYER_AUTHENTICATION: {
          if (updatePaymentObj.custom.fields.isv_payerAuthenticationRequired) {
            service = Constants.VALIDATION;
          } else {
            service = Constants.CARD;
          }
          paymentResponse = await paymentAuthorization.getAuthorizationResponse(
            updatePaymentObj,
            cartObj.results[Constants.VAL_ZERO],
            service
          );
          authResponse = paymentService.getAuthResponse(
            paymentResponse,
            transactionObj
          );
          authResponse.actions.push(
            {
              action: Constants.SET_CUSTOM_FIELD,
              name: Constants.ISV_CAPTURE_CONTEXT_SIGNATURE,
              value: null,
            },
            {
              action: Constants.SET_CUSTOM_FIELD,
              name: Constants.ISV_MDD_1,
              value: null,
            },
            {
              action: Constants.SET_CUSTOM_FIELD,
              name: Constants.ISV_MDD_2,
              value: null,
            }
          );
          if (Constants.VALIDATION == service) {
            authResponse.actions.push({
              action: Constants.SET_CUSTOM_FIELD,
              name: Constants.ISV_MDD_3,
              value: null,
            });
          }
          break;
        }
        case Constants.VISA_CHECKOUT: {
          paymentResponse = await paymentAuthorization.getAuthorizationResponse(
            updatePaymentObj,
            cartObj.results[Constants.VAL_ZERO],
            Constants.VISA
          );
          authResponse = paymentService.getAuthResponse(
            paymentResponse,
            transactionObj
          );
          visaCheckoutData = await clickToPay.getVisaCheckoutData(
            paymentResponse
          );
          if (
            Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
            Constants.HTTP_CODE_TWO_HUNDRED == visaCheckoutData.httpCode &&
            null != visaCheckoutData.cardFieldGroup
          ) {
            actions = paymentService.visaCardDetailsAction(visaCheckoutData);
            actions.forEach((i) => {
              authResponse.actions.push(i);
            });
            cartUpdate = await commercetoolsApi.updateCartbyPaymentId(
              cartObj.results[0],
              visaCheckoutData
            );
            if (null != cartUpdate) {
              console.log(Constants.SUCCESS_MSG_CART_UPDATE);
            }
          }
          break;
        }
        default: {
          console.log(Constants.ERROR_MSG_NO_PAYMENTS);
          errorFlag = true;
          break;
        }
      }
    } else {
      console.log(Constants.ERROR_MSG_NO_CART);
      errorFlag = true;
    }
  } catch (error) {
    console.log(Constants.ERROR_MSG_AUTHORIZING_PAYMENT, error);
    errorFlag = true;
  }
  if (errorFlag) {
    authResponse = paymentService.invalidInputResponse();
  }
  return authResponse;
};

const getPayerAuthSetUpResponse = async (updatePaymentObj) => {
  let jtiToken: any;
  let setUpServiceResponse: any;
  let setUpActionResponse: any;
  let errorFlag = false;
  try {
    if (Constants.ISV_TOKEN in updatePaymentObj.custom.fields) {
      jtiToken = jwtDecode(updatePaymentObj.custom.fields.isv_token);
      setUpServiceResponse = await paymentAuthSetUp.getPayerAuthSetupResponse(
        updatePaymentObj.id,
        jtiToken.jti
      );
      setUpActionResponse = paymentService.getAuthResponse(
        setUpServiceResponse,
        null
      );
    } else {
      console.log(Constants.ERROR_MSG_NO_CARD_DETAILS);
      errorFlag = true;
    }
  } catch (error) {
    console.log(Constants.ERROR_MSG_AUTHORIZING_PAYMENT, error);
    errorFlag = true;
  }
  if (errorFlag) {
    setUpActionResponse = paymentService.invalidInputResponse();
  }
  return setUpActionResponse;
};

const getPayerAuthEnrollResponse = async (updatePaymentObj) => {
  let jtiToken: any;
  let enrollResponse: any;
  let enrollServiceResponse: any;
  let cartObj: any;
  let cardinalReferenceId: null;
  let errorFlag = false;
  try {
    if (
      Constants.ISV_TOKEN in updatePaymentObj.custom.fields &&
      Constants.ISV_MDD_1 in updatePaymentObj.custom.fields
    ) {
      jtiToken = jwtDecode(updatePaymentObj.custom.fields.isv_token);
      cardinalReferenceId =
        updatePaymentObj.custom.fields.isv_merchantDefinedData_mddField_1;
      if (Constants.CUSTOMER in updatePaymentObj) {
        cartObj = await commercetoolsApi.retrieveCartByCustomerId(
          updatePaymentObj.customer.id
        );
      } else {
        cartObj = await commercetoolsApi.retrieveCartByAnonymousId(
          updatePaymentObj.anonymousId
        );
      }
      if (null != cartObj) {
        enrollServiceResponse = await payerAuthEnroll.enrolmentCheck(
          updatePaymentObj,
          cartObj.results[Constants.VAL_ZERO],
          jtiToken.jti,
          cardinalReferenceId
        );
        enrollResponse = paymentService.getAuthResponse(
          enrollServiceResponse,
          null
        );
      } else {
        console.log(Constants.ERROR_MSG_NO_CART);
        errorFlag = true;
      }
    } else {
      console.log(Constants.ERROR_MSG_NO_TRANSACTION_DETAILS);
      errorFlag = true;
    }
  } catch (error) {
    console.log(Constants.ERROR_MSG_AUTHORIZING_PAYMENT, error);
    errorFlag = true;
  }
  if (errorFlag) {
    enrollResponse = paymentService.invalidInputResponse();
  }
  return enrollResponse;
};

const orderManagementHandler = async (
  paymentId,
  updatePaymentObj,
  updateTransactions
) => {
  let authId = null;
  let captureId = null;
  let cartObj: any;
  let orderResponse: any;
  let transactionObj: any;
  let serviceResponse: any;
  let authReversalId = null;
  let errorFlag = false;
  try {
    cartObj = await commercetoolsApi.retrieveCartByPaymentId(paymentId);
    if (null != cartObj) {
      transactionObj = paymentService.transactionDetails(updateTransactions);
      if (Constants.CHARGE == updateTransactions.type) {
        updatePaymentObj.transactions.forEach((transaction) => {
          if (
            Constants.AUTHORIZATION == transaction.type &&
            Constants.SUCCESS == transaction.state
          ) {
            authId = transaction.interactionId;
          }
        });
        if (null != authId) {
          orderResponse = await paymentCapture.captureResponse(
            updatePaymentObj,
            cartObj.results[Constants.VAL_ZERO],
            authId
          );
          serviceResponse = paymentService.getServiceResponse(
            orderResponse,
            transactionObj
          );
        } else {
          console.log(Constants.ERROR_MSG_CAPTURE_FAILURE);
          errorFlag = true;
        }
      } else if (Constants.REFUND == updateTransactions.type) {
        updatePaymentObj.transactions.forEach((transaction) => {
          if (
            Constants.CHARGE == transaction.type &&
            Constants.SUCCESS == transaction.state
          ) {
            captureId = transaction.interactionId;
          }
        });
        if (null != captureId) {
          orderResponse = await paymentRefund.refundResponse(
            updatePaymentObj,
            captureId,
            updateTransactions
          );
          serviceResponse = paymentService.getServiceResponse(
            orderResponse,
            transactionObj
          );
        } else {
          console.log(Constants.ERROR_MSG_REFUND_FAILURE);
          errorFlag = true;
        }
      } else if (Constants.CANCEL_AUTHORIZATION == updateTransactions.type) {
        authReversalId =
          updatePaymentObj.transactions[Constants.VAL_ZERO].interactionId;
        if (null != authReversalId) {
          orderResponse = await paymentAuthReversal.authReversalResponse(
            updatePaymentObj,
            cartObj.results[Constants.VAL_ZERO],
            authReversalId
          );
          serviceResponse = paymentService.getServiceResponse(
            orderResponse,
            transactionObj
          );
        } else {
          console.log(Constants.ERROR_MSG_REVERSAL_FAILURE);
          errorFlag = true;
        }
      } else {
        console.log(Constants.ERROR_MSG_NO_TRANSACTION, paymentId);
        errorFlag = true;
      }
    } else {
      console.log(Constants.ERROR_MSG_NO_CART);
      errorFlag = true;
    }
  } catch (error) {
    console.log(Constants.ERROR_MSG_AUTHORIZING_PAYMENT, error);
    errorFlag = true;
  }
  if (errorFlag) {
    serviceResponse = paymentService.invalidInputResponse();
  }
  return serviceResponse;
};

export default {
  authorizationHandler,
  getPayerAuthEnrollResponse,
  orderManagementHandler,
  getPayerAuthSetUpResponse,
};
