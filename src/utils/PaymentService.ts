import { PtsV2PaymentsCapturesPost201Response, PtsV2PaymentsPost201Response, PtsV2PaymentsReversalsPost201Response } from 'cybersource-rest-client';

import { Constants } from '../constants/constants';
import { CustomMessages } from '../constants/customMessages';
import { FunctionConstant } from '../constants/functionConstant';
import { PayerAuthData } from '../models/PayerAuthDataModel';
import { Token } from '../models/TokenModel';
import createSearchRequest from '../service/payment/CreateTransactionSearchRequest';
import getTransaction from '../service/payment/GetTransactionData';
import getTransientTokenData from '../service/payment/GetTransientTokenData';
import {
  ActionResponseType, ActionType,
  AddressType,
  AmountPlannedType,
  ApplicationsType,
  CardAddressGroupType,
  CustomerTokensType,
  CustomerType,
  CustomTokenType,
  PaymentCustomFieldsType,
  PaymentTransactionType,
  PaymentType,
  VisaUpdateType,
} from '../types/Types';
import multiMid from '../utils/config/MultiMid';

import paymentAuthReversal from './../service/payment/PaymentAuthorizationReversal';
import paymentAuthorization from './../service/payment/PaymentAuthorizationService';
import paymentRefund from './../service/payment/PaymentRefundService';
import commercetoolsApi from './../utils/api/CommercetoolsApi';
import paymentActions from './PaymentActions';
import paymentHandler from './PaymentHandler';
import paymentUtils from './PaymentUtils';
import paymentValidator from './PaymentValidator';
import tokenHelper from './helpers/TokenHelper';
/**
 * Process the response for Order Management service based on payment response and transaction details.
 * 
 * @param {any} paymentResponse - Payment response object.
 * @param {PaymentTransactionType} transactionDetail - Transaction details.
 * @param {string} captureId - Capture ID.
 * @param {number} pendingAmount - Pending amount.
 * @returns {ActionResponseType} - Object containing actions and errors.
 */
const getOMServiceResponse = (paymentResponse: PtsV2PaymentsCapturesPost201Response, transactionDetail: Partial<PaymentTransactionType>, captureId: string, pendingAmount: number): ActionResponseType => {
  let setCustomField: Partial<ActionType>;
  let paymentFailure: Partial<ActionType> | null = null;
  let setCustomType: Partial<ActionType> | null = null;
  let response: ActionResponseType = paymentUtils.getEmptyResponse();
  try {
    if (paymentResponse && transactionDetail) {
      if (Constants.API_STATUS_PENDING === paymentResponse.status || Constants.API_STATUS_REVERSED === paymentResponse.status) {
        setCustomField = paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_SUCCESS);
        if (captureId && 0 <= pendingAmount) {
          setCustomType = setTransactionCustomType(captureId, pendingAmount);
        }
        paymentFailure = null;
      } else {
        setCustomField = paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE);
        paymentFailure = paymentUtils.failureResponse(paymentResponse, transactionDetail);
      }
      const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);
      response = paymentActions.createResponse(setTransaction, setCustomField, paymentFailure, setCustomType);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_OM_SERVICE_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + captureId, CustomMessages.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_OM_SERVICE_RESPONSE, '', exception, '', '', '');
  }
  return response;
};
/**
 * Calculates the pending capture amount based on the refund payment object.
 * 
 * @param {PaymentType} refundPaymentObj - Refund payment object.
 * @returns {number} - Pending capture amount.
 */
const getCapturedAmount = (refundPaymentObj: PaymentType): number => {
  let refundTransaction: readonly Partial<PaymentTransactionType>[];
  let capturedAmount = 0;
  let refundedAmount = 0.0;
  let pendingCaptureAmount = 0;
  try {
    if (refundPaymentObj) {
      const fractionDigits = refundPaymentObj.amountPlanned.fractionDigits;
      refundTransaction = refundPaymentObj.transactions;
      const indexValue = refundTransaction.findIndex((transaction, index) => {
        if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type) {
          return true;
        }
        return index;
      });
      if (0 <= indexValue) {
        for (let transaction of refundTransaction) {
          if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.amount?.centAmount) {
            capturedAmount = capturedAmount + Number(transaction.amount.centAmount);
          }
          if (Constants.CT_TRANSACTION_TYPE_REFUND === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.amount?.centAmount) {
            refundedAmount = refundedAmount + Number(transaction.amount.centAmount);
          }
        }
        pendingCaptureAmount = capturedAmount - refundedAmount;
        pendingCaptureAmount = paymentUtils.convertCentToAmount(pendingCaptureAmount, fractionDigits);
      }
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CAPTURED_AMOUNT, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_CAPTURED_AMOUNT, '', exception, '', '', '');
  }
  return pendingCaptureAmount;
};
/**
 * Calculates the pending authorized amount based on the capture payment object.
 * 
 * @param {PaymentType} capturePaymentObj - Capture payment object.
 * @returns {number} - Pending authorized amount.
 */
const getAuthorizedAmount = (capturePaymentObj: PaymentType): number => {
  let capturedAmount = 0.0;
  let pendingAuthorizedAmount = 0;
  try {
    if (capturePaymentObj) {
      const captureTransaction = capturePaymentObj.transactions;
      const fractionDigits = capturePaymentObj.amountPlanned.fractionDigits;
      const indexValue = captureTransaction.findIndex((transaction, index) => {
        if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === transaction.type) {
          return true;
        }
        return index;
      });
      if (0 <= indexValue) {
        const authorizedAmount = Number(captureTransaction[indexValue]?.amount?.centAmount);
        captureTransaction.forEach((transaction) => {
          if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state) {
            capturedAmount = capturedAmount + Number(transaction?.amount?.centAmount);
          }
        });
        pendingAuthorizedAmount = authorizedAmount - capturedAmount;
        pendingAuthorizedAmount = paymentUtils.convertCentToAmount(pendingAuthorizedAmount, fractionDigits);
      }
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTHORIZED_AMOUNT, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_AUTHORIZED_AMOUNT, '', exception, '', '', '');
  }
  return pendingAuthorizedAmount;
};
const setTransactionCustomType = (transactionId: string, pendingAmount: number): Partial<ActionType> | null => {
  const returnResponse = {
    action: 'setTransactionCustomType',
    type: {
      key: 'isv_transaction_data',
      typeId: Constants.TYPE_ID_TYPE,
    },
    fields: {
      isv_availableCaptureAmount: 0,
    },
    transactionId: '',
  };
  paymentValidator.setObjectValue(returnResponse, 'transactionId', transactionId, '', Constants.STR_STRING, false);
  paymentValidator.setObjectValue(returnResponse.fields, 'isv_availableCaptureAmount', pendingAmount, '', 'number', false);
  if (!returnResponse.fields.isv_availableCaptureAmount || !returnResponse.transactionId) {
    paymentUtils.logData(__filename, 'FuncSetTransactionCustomType', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
  }
  return returnResponse;
};
/**
 * Retrieves the credit card authorization response.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @param {CustomerType | null} customerInfo - Customer information.
 * @param {any} cartObj - Cart object.
 * @param {PaymentTransactionType} updateTransactions - Updated transaction details.
 * @param {CustomTokenType} cardTokens - Card tokens.
 * @param {string} orderNo - Order number.
 * @returns {Promise<{ isError: boolean, paymentResponse: any, authResponse: ActionResponseType }>} - Object containing error flag, payment response, and authorization response.
 */
const getPaymentResponse = async (updatePaymentObj: PaymentType, customerInfo: Partial<CustomerType> | null, cartObj: any, updateTransactions: Partial<PaymentTransactionType>, cardTokens: CustomTokenType, orderNo: string): Promise<{ isError: boolean, paymentResponse: any, authResponse: ActionResponseType }> => {
  let authResponse: ActionResponseType = paymentUtils.getEmptyResponse();
  let isSaveToken = false;
  let isError = false;
  let paymentResponse;
  let isv_applePaySessionData = '';
  let paymentId = updatePaymentObj?.id || '';
  try {
    const evaluateTokenCreationResponse = await evaluateTokenCreation(customerInfo, updatePaymentObj, FunctionConstant.FUNC_GET_PAYMENT_RESPONSE);
    if (!evaluateTokenCreationResponse.isError) {
      isSaveToken = evaluateTokenCreationResponse.isSaveToken;
      if (updatePaymentObj?.custom?.fields?.isv_transientToken && (Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE || paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING))) {
        cartObj = await updateCartWithUCAddress(updatePaymentObj, cartObj);
      }
      paymentResponse = await paymentAuthorization.getAuthorizationResponse(updatePaymentObj, cartObj, Constants.STRING_CARD, cardTokens, isSaveToken, false, orderNo);
      if (paymentResponse && updatePaymentObj && paymentResponse?.httpCode) {
        authResponse = getAuthResponse(paymentResponse, updateTransactions);
        if (authResponse && authResponse?.actions && authResponse['actions'].length) {
          if (Constants.APPLE_PAY === updatePaymentObj.paymentMethodInfo.method) {
            const cardDetails = await getCartData(paymentResponse, updatePaymentObj);
            if (cardDetails) {
              const actions = paymentActions.cardDetailsActions(cardDetails);
              paymentValidator.validateActionsAndPush(actions, authResponse.actions);
            }
            if (updatePaymentObj?.custom?.fields?.isv_applePaySessionData) {
              authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_applePaySessionData }));
            }
          }
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYMENT_RESPONSE, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_SERVICE_PROCESS);
          isError = true;
        }
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYMENT_RESPONSE, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        isError = true;
      }
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_PAYMENT_RESPONSE, CustomMessages.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, paymentId, 'PaymentId : ', '');
    isError = true;
  }
  return { isError, paymentResponse, authResponse };
};
/**
 * Checks whether to create a token.
 * 
 * @param {CustomerType | null} customerInfo - Customer information.
 * @param {PaymentType | null} paymentObj - Payment object.
 * @param {string} functionName - Name of the calling function.
 * @returns {Promise<{ isSaveToken: boolean, isError: boolean }>} - Object containing flag indicating whether to save the token and error flag.
 */
const evaluateTokenCreation = async (customerInfo: Partial<CustomerType> | null, paymentObj: PaymentType | null, functionName: string): Promise<{ isSaveToken: boolean, isError: boolean }> => {
  let cardRate = 0;
  let cardRateCount = 0;
  const tokenCreateObj = {
    isSaveToken: false,
    isError: false,
  };
  let customerId = customerInfo?.id || '';
  try {
    if (FunctionConstant.FUNC_HANDLE_CARD_ADDITION === functionName || ((FunctionConstant.FUNC_GET_PAYMENT_RESPONSE === functionName || FunctionConstant.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE === functionName || FunctionConstant.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE === functionName) && paymentObj?.custom?.fields?.isv_tokenAlias)) {
      if (customerInfo && paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER)) {
        const validInputForRateLimiter = paymentValidator.isValidRateLimiterInput();
        if (validInputForRateLimiter) {
          cardRate = Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME);
          cardRateCount = Number(process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE);
          if (!tokenCreateObj.isError) {
            const startTime = paymentUtils.getDate(null, false) as Date;
            startTime.setHours(startTime.getHours() - cardRate);
            const limiterResponse = await tokenHelper.getRateLimiterTokenCount(customerInfo, paymentUtils.getDate(startTime, true, null, null) as string, paymentUtils.getDate(Date.now(), true, null, null) as string);
            if (limiterResponse && cardRateCount <= limiterResponse) {
              tokenCreateObj.isSaveToken = true;
            }
          }
        } else {
          tokenCreateObj.isError = true;
          paymentUtils.logData(__filename, 'FuncEvaluateTokenCreation', Constants.LOG_ERROR, 'CustomerId : ' + customerInfo.id, CustomMessages.ERROR_MSG_INVALID_RATE_LIMITER_CONFIGURATIONS);
        }
      }
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, 'FuncEvaluateTokenCreation', '', exception, customerId, 'CustomerId', '');
  }
  return tokenCreateObj;
};
/**
 * Retrieves the response for Click to Pay.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @param {any} cartObj - Cart object.
 * @param {PaymentTransactionType} updateTransactions - Updated transactions.
 * @param {CustomTokenType} customerTokenId - Customer token ID.
 * @param {string} orderNo - Order number.
 * @returns {Promise<{ isError: boolean, paymentResponse: any, authResponse: ActionResponseType }>} - Response containing error flag, payment response, and authentication response.
 */
const getClickToPayResponse = async (updatePaymentObj: PaymentType, cartObj: any, updateTransactions: Partial<PaymentTransactionType>, customerTokenId: CustomTokenType, orderNo: string): Promise<{ isError: boolean, paymentResponse: any, authResponse: ActionResponseType }> => {
  let authResponse: ActionResponseType = paymentUtils.getEmptyResponse();
  let actions: Partial<ActionType>[] = [];
  let isError = false;
  let paymentId = updatePaymentObj?.id || '';
  let paymentResponse;
  try {
    if (updatePaymentObj?.custom?.fields?.isv_transientToken && (Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE || paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING))) {
      cartObj = await updateCartWithUCAddress(updatePaymentObj, cartObj);
    }
    paymentResponse = await paymentAuthorization.getAuthorizationResponse(updatePaymentObj, cartObj, 'visa', customerTokenId, false, false, orderNo);
    if (paymentResponse && paymentResponse.httpCode) {
      authResponse = getAuthResponse(paymentResponse, updateTransactions);
      if (authResponse) {
        const visaCheckoutData = await getCartData(paymentResponse, updatePaymentObj);
        if (visaCheckoutData) {
          actions = paymentActions.cardDetailsActions(visaCheckoutData);
          paymentValidator.validateActionsAndPush(actions, authResponse.actions);
          if (!updatePaymentObj?.custom?.fields?.isv_transientToken) {
            const cartUpdate = await commercetoolsApi.updateCartByPaymentId(cartObj.id, paymentId, cartObj.version, visaCheckoutData);
            const clickToPayUpdateMessage = cartUpdate ? CustomMessages.SUCCESS_MSG_UPDATE_CLICK_TO_PAY_CARD_DETAILS : CustomMessages.ERROR_MSG_UPDATE_CART;
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CLICK_TO_PAY_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + paymentId, clickToPayUpdateMessage);
          }
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CLICK_TO_PAY_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_UPDATE_CLICK_TO_PAY_DATA);
        }
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CLICK_TO_PAY_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        isError = true;
      }
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CLICK_TO_PAY_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
      isError = true;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_CLICK_TO_PAY_RESPONSE, CustomMessages.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, paymentId, 'PaymentId : ', '');
    isError = true;
  }
  return { isError, paymentResponse, authResponse };
};
/**
 * Retrieves the response for Google Pay.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @param {any} cartObj - Cart object.
 * @param {PaymentTransactionType} updateTransactions - Updated transactions.
 * @param {CustomTokenType} customerTokens - Customer tokens.
 * @param {string} orderNo - Order number.
 * @returns {Promise<{ isError: boolean, paymentResponse: any, authResponse: ActionResponseType }>} - Response containing error flag, payment response, and authentication response.
 */
const getGooglePayResponse = async (updatePaymentObj: PaymentType, cartObj: any, updateTransactions: Partial<PaymentTransactionType>, customerTokens: CustomTokenType, orderNo: string): Promise<{ isError: boolean, paymentResponse: any, authResponse: ActionResponseType }> => {
  let authResponse: ActionResponseType = paymentUtils.getEmptyResponse();
  let paymentResponse;
  let actions: Partial<ActionType>[] = [];
  let isError = false;
  const cardDetails: Partial<CardAddressGroupType> = {
    cardFieldGroup: {
      prefix: '',
      suffix: '',
      expirationMonth: '',
      expirationYear: '',
      type: '',
    },
  };
  let paymentId = updatePaymentObj?.id || '';
  try {
    if (updatePaymentObj?.custom?.fields?.isv_transientToken && (Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE || paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING))) {
      cartObj = await updateCartWithUCAddress(updatePaymentObj, cartObj);
    }
    paymentResponse = await paymentAuthorization.getAuthorizationResponse(updatePaymentObj, cartObj, 'googlePay', customerTokens, false, false, orderNo);
    if (paymentResponse && paymentResponse?.httpCode) {
      authResponse = getAuthResponse(paymentResponse, updateTransactions);
      if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
        if (paymentResponse?.data?.paymentInformation?.tokenizedCard && paymentResponse.data.paymentInformation.tokenizedCard?.expirationMonth) {
          cardDetails.cardFieldGroup = paymentResponse.data.paymentInformation.tokenizedCard;
        } else if (paymentResponse?.data?.paymentInformation?.card && paymentResponse.data.paymentInformation.card?.expirationMonth) {
          cardDetails.cardFieldGroup = paymentResponse.data.paymentInformation.card;
        }
        actions = paymentActions.cardDetailsActions(cardDetails);
        paymentValidator.validateActionsAndPush(actions, authResponse.actions);
      }
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_GOOGLE_PAY_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
      isError = true;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_GOOGLE_PAY_RESPONSE, CustomMessages.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, paymentId, 'PaymentId : ', '');
    isError = true;
  }
  return { isError, paymentResponse, authResponse };
};
/**
 * Retrieves transaction summaries.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @param {number} retryCount - Retry count.
 * @returns {Promise<any>} - Object containing transaction summaries and a flag indicating if history is present.
 */
const getTransactionSummaries = async (updatePaymentObj: PaymentType, retryCount: number): Promise<any> => {
  let transactionSummaryObject: any;
  let errorData = '';
  let paymentId = updatePaymentObj.id || '';
  const query = Constants.PAYMENT_GATEWAY_CLIENT_REFERENCE_CODE + paymentId + Constants.STRING_AND + Constants.STRING_SYNC_QUERY;
  const midId = updatePaymentObj?.custom?.fields?.isv_merchantId ? updatePaymentObj.custom.fields.isv_merchantId : '';
  try {
    const authMid = await multiMid.getMidCredentials(midId);
    return await new Promise(function (resolve, reject) {
      setTimeout(async () => {
        const transactionDetail = await createSearchRequest.getTransactionSearchResponse(query, Constants.STRING_SYNC_SORT, authMid);
        const validTransactionSummary = paymentValidator.isValidTransactionSummaries(transactionDetail, updatePaymentObj, retryCount);
        if (validTransactionSummary) {
          transactionSummaryObject = {
            summaries: transactionDetail?.data?._embedded?.transactionSummaries,
            historyPresent: true,
          };
          resolve(transactionSummaryObject);
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_SUMMARIES, Constants.LOG_ERROR, 'PaymentId : ' + updatePaymentObj.id, CustomMessages.ERROR_MSG_RETRY_TRANSACTION_SEARCH);
          reject(transactionSummaryObject);
        }
      }, 1500);
    }).catch((error) => {
      if (error) {
        errorData = typeof error === Constants.STR_OBJECT ? (errorData = JSON.stringify(error)) : error;
      }
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_SUMMARIES, Constants.LOG_ERROR, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_RETRY_TRANSACTION_SEARCH + errorData);
      return transactionSummaryObject;
    });
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_SUMMARIES, CustomMessages.EXCEPTION_MSG_TRANSACTION_SEARCH, exception, paymentId, 'PaymentId : ', '');
  }
  return transactionSummaryObject;
};

/**
 * Handles authorization reversal response for the given payment update.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @param {any} cartObj - Cart object.
 * @param {any} paymentResponse - Payment response.
 * @param {ActionResponseType} updateActions - Updated actions.
 * @returns {Promise<ActionResponseType>} - Updated actions response.
 */
const handleAuthReversalResponse = async (updatePaymentObj: PaymentType, cartObj: any, paymentResponse: PtsV2PaymentsReversalsPost201Response | any, updateActions: ActionResponseType): Promise<ActionResponseType> => {
  const reversalAction = {
    action: 'addTransaction',
    transaction: {
      type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
      timestamp: paymentUtils.getDate(Date.now(), true),
      amount: {
        type: '',
        currencyCode: '',
        centAmount: 0,
        fractionDigits: 0,
      },
      state: '',
      interactionId: null,
    },
  };
  const authReversalResponse = await paymentAuthReversal.getAuthReversalResponse(updatePaymentObj, cartObj, paymentResponse.transactionId);
  if (authReversalResponse && Constants.HTTP_SUCCESS_STATUS_CODE === authReversalResponse.httpCode && Constants.API_STATUS_REVERSED === authReversalResponse.status) {
    reversalAction.transaction.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
  } else {
    reversalAction.transaction.state = Constants.CT_TRANSACTION_STATE_FAILURE;
  }
  reversalAction.transaction.amount = updatePaymentObj.amountPlanned;
  reversalAction.transaction.interactionId = authReversalResponse?.transactionId;
  updateActions.actions.push(reversalAction);
  return updateActions;
};
/**
 * Checks if an authorization reversal is triggered for the given payment update.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @param {any} cartObj - Cart object.
 * @param {any} paymentResponse - Payment response.
 * @param {ActionResponseType} updateActions - Updated actions.
 * @returns {Promise<ActionResponseType>} - Updated actions response.
 */
const checkAuthReversalTriggered = async (updatePaymentObj: PaymentType, cartObj: any, paymentResponse: PtsV2PaymentsPost201Response, updateActions: ActionResponseType): Promise<ActionResponseType> => {
  let transactionSummaries;
  let transactionDetail;
  let isAuthReversalTriggered = false;
  let applications: Partial<ApplicationsType>[];
  let returnAction = {
    action: 'addTransaction',
    transaction: {
      type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
      timestamp: paymentUtils.getDate(Date.now(), true),
      amount: {
        type: '',
        currencyCode: '',
        centAmount: 0,
        fractionDigits: 0,
      },
      state: '',
      interactionId: null,
    },
  };
  let paymentId = updatePaymentObj.id || '';
  try {
    for (let i = 0; i < Constants.PAYMENT_GATEWAY_TRANSACTION_SUMMARIES_MAX_RETRY; i++) {
      //Retries to get the response, if there is no proper response received
      transactionDetail = await getTransactionSummaries(updatePaymentObj, i + 1);
      if (transactionDetail) {
        transactionSummaries = transactionDetail.summaries;
        if (true === transactionDetail.historyPresent) {
          break;
        }
      }
    }
    if (transactionSummaries) {
      for (let element of transactionSummaries) {
        applications = element.applicationInformation.applications;
        for (let application of applications) {
          if (Constants.ECHECK !== updatePaymentObj.paymentMethodInfo.method && updatePaymentObj?.custom?.fields?.isv_saleEnabled && Constants.STRING_SYNC_AUTH_NAME === application?.name && application.reasonCode) {
            try {
              updateActions = await paymentActions.handleAuthApplication(updatePaymentObj, application, updateActions, element);
            } catch (exception) {
              paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_CHECK_AUTH_REVERSAL_TRIGGERED, CustomMessages.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, paymentId, 'PaymentId : ', '');
            }
          }
          if (Constants.STRING_SYNC_AUTH_REVERSAL_NAME === application.name) {
            if (Constants.APPLICATION_RCODE === application.rCode && Constants.APPLICATION_RFLAG === application.rFlag) {
              isAuthReversalTriggered = true;
              returnAction.transaction.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
            } else {
              returnAction.transaction.state = Constants.CT_TRANSACTION_STATE_FAILURE;
            }
            returnAction.transaction.amount = updatePaymentObj.amountPlanned;
            returnAction.transaction.interactionId = element.id;
            updateActions.actions.push(returnAction);
          }
        }
      }
    }
    if (!isAuthReversalTriggered) {
      updateActions = await handleAuthReversalResponse(updatePaymentObj, cartObj, paymentResponse, updateActions);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_CHECK_AUTH_REVERSAL_TRIGGERED, CustomMessages.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, paymentId, 'PaymentId : ', '');
  }
  return updateActions;
};
/**
 * Retrieves the refund response for the given payment update.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @param {PaymentTransactionType} updateTransactions - Updated transactions.
 * @param {string} orderNo - Order number.
 * @returns {Promise<ActionResponseType>} - Refund actions response.
 */
const getRefundResponse = async (updatePaymentObj: PaymentType, updateTransactions: Partial<PaymentTransactionType>, orderNo: string): Promise<ActionResponseType> => {
  let refundAmount: number;
  let refundActions: ActionResponseType = paymentUtils.getEmptyResponse();
  let refundResponseObject = {
    captureId: '',
    transactionId: '',
    pendingTransactionAmount: 0
  };
  let iterateRefundAmount = 0;
  let pendingTransactionAmount = 0;
  let transactionState = Constants.CT_TRANSACTION_STATE_FAILURE;
  let refundAction;
  let amountToBeRefunded = 0;
  let setAction: Partial<ActionType> | null;
  let iterateRefund = 0;
  let availableCaptureAmount = 0;
  let chargeAmount = 0;
  let pendingAmount = 0;
  let paymentId = updatePaymentObj?.id || '';
  try {
    const validTransaction = paymentValidator.isValidTransaction(updatePaymentObj, updateTransactions);
    if (updateTransactions.amount?.centAmount && validTransaction) {
      refundAmount = updateTransactions?.amount?.centAmount as number;
      iterateRefundAmount = refundAmount;
      if (refundAmount) {
        for (let transaction of updatePaymentObj.transactions) {
          if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.amount && transaction?.interactionId && transaction?.id) {
            if (refundAmount === transaction.amount.centAmount && !(Constants.STRING_CUSTOM in transaction)) {
              pendingAmount = transaction.amount.centAmount - refundAmount;
              break;
            } else if (transaction?.custom?.fields?.isv_availableCaptureAmount && refundAmount === transaction.custom.fields.isv_availableCaptureAmount) {
              pendingAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmount;
              break;
            }
            refundResponseObject = paymentUtils.getRefundResponseObject(transaction, pendingAmount);
          }
        }
        if (!refundResponseObject.captureId) {
          for (let transaction of updatePaymentObj.transactions) {
            refundResponseObject.captureId = '';
            const successfulChargeTransaction = paymentValidator.isSuccessFulChargeTransaction(transaction);
            if (successfulChargeTransaction) {
              availableCaptureAmount = transaction?.custom?.fields?.isv_availableCaptureAmount || 0;
              chargeAmount = availableCaptureAmount || transaction?.amount?.centAmount || 0;
              amountToBeRefunded = Math.min(iterateRefundAmount, chargeAmount);
              updateTransactions.amount.centAmount = amountToBeRefunded;
              refundResponseObject = paymentUtils.getRefundResponseObject(transaction, amountToBeRefunded);
              pendingTransactionAmount = chargeAmount - amountToBeRefunded;
              iterateRefundAmount -= amountToBeRefunded;
              iterateRefund++;
              const orderResponse = await paymentRefund.getRefundData(updatePaymentObj, refundResponseObject.captureId, updateTransactions, orderNo);
              if (orderResponse && orderResponse.httpCode) {
                if (1 === iterateRefund && 0 === iterateRefundAmount) {
                  refundActions = getOMServiceResponse(orderResponse, updateTransactions, refundResponseObject.transactionId, pendingTransactionAmount);
                } else {
                  if (Constants.API_STATUS_PENDING === orderResponse.status) {
                    transactionState = Constants.CT_TRANSACTION_STATE_SUCCESS;
                    setAction = setTransactionCustomType(refundResponseObject.transactionId, pendingTransactionAmount);
                  } else {
                    setAction = paymentUtils.failureResponse(orderResponse, updateTransactions);
                  }
                  if (setAction) {
                    refundActions.actions.push(setAction);
                  }
                  const amount = {
                    type: updateTransactions.amount?.type,
                    currencyCode: updateTransactions.amount?.currencyCode,
                    fractionDigits: updateTransactions.amount?.fractionDigits,
                    centAmount: amountToBeRefunded,
                  } as AmountPlannedType
                  refundAction = paymentActions.addRefundAction(amount, orderResponse, transactionState);
                  if (refundAction) {
                    refundActions.actions.push(refundAction);
                  }
                }
              }
            }
          }
        } else if (refundResponseObject?.captureId) {
          const orderResponse = await paymentRefund.getRefundData(updatePaymentObj, refundResponseObject.captureId, updateTransactions, orderNo);
          if (orderResponse && orderResponse.httpCode) {
            refundActions = getOMServiceResponse(orderResponse, updateTransactions, refundResponseObject.transactionId, pendingTransactionAmount);
          }
        }
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_REFUND_RESPONSE, Constants.LOG_ERROR, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
      }
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_REFUND_RESPONSE, CustomMessages.EXCEPTION_MSG_SERVICE_PROCESS, exception, paymentId, 'PaymentId : ', '')
  }
  return refundActions;
};
/**
 * Retrieves card tokens from customer information.
 * 
 * @param {CustomerType | null} customerInfo - Customer information.
 * @param {string} isvSavedToken - Saved token.
 * @returns {Promise<CustomTokenType>} - Card tokens.
 */
const getCardTokens = async (customerInfo: Partial<CustomerType> | null, isvSavedToken: string): Promise<CustomTokenType> => {
  let currentIndex = 0;
  const cardTokens: CustomTokenType = {
    customerTokenId: '',
    paymentInstrumentId: '',
  };
  if (customerInfo && customerInfo?.custom?.fields?.isv_tokens && 0 < customerInfo.custom.fields.isv_tokens?.length) {
    const existingTokens = customerInfo.custom.fields.isv_tokens;
    const tokenLength = customerInfo.custom.fields.isv_tokens.length;
    const existingTokensMap = existingTokens.map((item) => item);
    existingTokensMap.forEach((token) => {
      const newToken = JSON.parse(token);
      currentIndex++;
      if (isvSavedToken === newToken.paymentToken && cardTokens) {
        cardTokens.customerTokenId = newToken.value;
        cardTokens.paymentInstrumentId = newToken.paymentToken;
      }
      if (tokenLength === currentIndex && '' === cardTokens.customerTokenId) {
        cardTokens.customerTokenId = newToken.value;
      }
    });
  }
  return cardTokens;
};
/**
 * Retrieves the customer's address ID.
 * 
 * @param {any} cartObj - Cart object.
 * @returns {Promise<ActionResponseType>} - Address ID.
 */
const setCustomerTokenData = async (cardTokens: CustomTokenType, paymentResponse: PtsV2PaymentsPost201Response | any, authResponse: ActionResponseType, isError: boolean, updatePaymentObj: PaymentType, cartObj: any): Promise<ActionResponseType> => {
  let customerTokenResponse: Partial<CustomerType> | null = null;
  let customerInfo: Partial<CustomerType> | null = null;
  let customerTokenId = '';
  let addressId = '';
  let customerId = updatePaymentObj?.customer?.id || '';
  if (cartObj && cartObj?.billingAddress?.id) {
    addressId = cartObj.billingAddress.id;
  }
  if (!addressId && customerId) {
    if (updatePaymentObj.custom?.fields?.isv_token) {
      customerInfo = await commercetoolsApi.getCustomer(customerId);
    } else if (cartObj && updatePaymentObj.custom?.fields?.isv_transientToken) {
      customerInfo = await addTokenAddressForUC(updatePaymentObj, cartObj);
    }
    if (customerInfo?.addresses?.length) {
      addressId = customerInfo.addresses[customerInfo.addresses.length - 1].id as string;
    }
  }
  const processTokenData = paymentValidator.shouldProcessTokens(isError, paymentResponse, updatePaymentObj);
  if (processTokenData && paymentResponse?.data?.tokenInformation?.paymentInstrument?.id) {
    const tokenInfo = paymentResponse.data.tokenInformation;
    const isv_savedToken = paymentResponse.data.tokenInformation.paymentInstrument.id;
    authResponse.actions.push(...paymentUtils.setCustomFieldMapper({ isv_savedToken }));
    if (cardTokens && !cardTokens?.customerTokenId && tokenInfo?.customer && tokenInfo.customer?.id) {
      customerTokenId = tokenInfo.customer.id;
    } else if (cardTokens?.customerTokenId) {
      customerTokenId = cardTokens.customerTokenId;
    }
    const paymentInstrumentId = tokenInfo.paymentInstrument.id;
    const instrumentIdentifier = tokenInfo.instrumentIdentifier.id;
    customerTokenResponse = await processTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId);
    let logMessage = customerTokenResponse ? CustomMessages.SUCCESS_MSG_CARD_TOKENS_UPDATE : CustomMessages.ERROR_MSG_TOKEN_UPDATE
    paymentUtils.logData(__filename, FunctionConstant.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, 'CustomerId : ' + customerId || '', logMessage);
  } else {
    const customFields = updatePaymentObj?.custom?.fields as Partial<PaymentCustomFieldsType>;
    const processFailedTokenData = paymentValidator.shouldProcessFailedTokens(paymentResponse, updatePaymentObj)
    if (processFailedTokenData) {
      customerTokenResponse = await setCustomerFailedTokenData(updatePaymentObj, customFields, addressId);
      const responseMessage = customerTokenResponse ? CustomMessages.SUCCESS_MSG_CARD_TOKENS_UPDATE : CustomMessages.ERROR_MSG_TOKEN_UPDATE;
      paymentUtils.logData(__filename, FunctionConstant.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, 'CustomerId : ' + customerId || '', responseMessage);
    }
  }
  return authResponse;
};
/**
 * Checks if the provided token matches an existing token in the customer's tokens and process tokens accordingly.
 * 
 * @param {string} customerTokenId - Customer token ID.
 * @param {string} instrumentIdentifier - Instrument identifier.
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @param {string} addressId - Address ID.
 * @returns {Promise<CustomerType | null>} - Indicates if the token already exists.
 */
const processTokens = async (customerTokenId: string, paymentInstrumentId: string, instrumentIdentifier: string, updatePaymentObj: PaymentType, addressId: string): Promise<Partial<CustomerType> | null> => {
  let existingTokens: string[];
  let parsedTokens: Partial<CustomerTokensType>;
  let updateTokenResponse: Partial<CustomerType> | null = null;
  let finalTokenIndex = -1;
  let isExistingCardFlag = false;
  const customerId = updatePaymentObj?.customer?.id;
  const customFields = updatePaymentObj?.custom?.fields;
  if (customerId) {
    const customerInfo = await commercetoolsApi.getCustomer(customerId);
    if (customerInfo) {
      const customTypePresent = customerInfo?.custom?.type?.id ? true : false;
      if (customerInfo?.custom?.fields?.isv_tokens?.length) {
        existingTokens = customerInfo.custom.fields.isv_tokens;
        existingTokens.forEach((token, tokenIndex) => {
          const newToken = JSON.parse(token);
          if (newToken.cardNumber === updatePaymentObj?.custom?.fields.isv_maskedPan && newToken.value === customerTokenId && newToken.instrumentIdentifier === instrumentIdentifier) {
            finalTokenIndex = tokenIndex;
          }
        });
        if (-1 < finalTokenIndex && customFields?.isv_tokenAlias && customFields?.isv_cardExpiryMonth && customFields?.isv_cardExpiryYear) {
          isExistingCardFlag = true;
          parsedTokens = paymentUtils.updateParsedToken(existingTokens[finalTokenIndex], customFields, paymentInstrumentId, customerTokenId, addressId);
          if (0 < Object.keys(parsedTokens).length) {
            existingTokens[finalTokenIndex] = JSON.stringify(parsedTokens);
            if (customTypePresent) {
              updateTokenResponse = await commercetoolsApi.updateCustomerToken(existingTokens, customerInfo, customerInfo?.custom?.fields?.isv_failedTokens, customerTokenId);
            } else {
              updateTokenResponse = await commercetoolsApi.setCustomType(customerId, existingTokens, customerInfo?.custom?.fields?.isv_failedTokens, customerTokenId);
            }
          }
        }
      }
    }
  }
  if (!isExistingCardFlag) {
    updateTokenResponse = await commercetoolsApi.setCustomerTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId);
  }
  return updateTokenResponse;
};
/**
 * Checks the presence of different types of applications in a given array of applications.
 * 
 * @param {ApplicationsType[]} applications - Array of applications.
 * @returns {Object} - Object indicating the presence of different types of applications.
 */
const getApplicationsPresent = async (applications: Partial<ApplicationsType>) => {
  if (!applications) {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_APPLICATIONS_PRESENT, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_APPLICATION_DETAILS);
  }
  const checkAuthPresent = applications.some((item: Partial<ApplicationsType>) => Constants.STRING_SYNC_AUTH_NAME === item.name) || applications.some((item: ApplicationsType) => Constants.STRING_SYNC_ECHECK_DEBIT_NAME === item.name);
  const checkAuthReasonCodePresent = applications.some((item: Partial<ApplicationsType>) => Constants.STRING_SYNC_AUTH_NAME === item.name && item.reasonCode && Constants.PAYMENT_GATEWAY_SUCCESS_REASON_CODE === item.reasonCode
    || Constants.STRING_SYNC_ECHECK_DEBIT_NAME === item.name && null === item.reasonCode && applications.some((nextItem: Partial<ApplicationsType>) => Constants.STRING_SYNC_DECISION_NAME === nextItem.name && Constants.PAYMENT_GATEWAY_ERROR_REASON_CODE === nextItem.reasonCode));
  const checkCapturePresent = applications.some((item: Partial<ApplicationsType>) => Constants.STRING_SYNC_CAPTURE_NAME === item.name);
  const captureReasonCodePresent = applications.some((item: Partial<ApplicationsType>) => Constants.STRING_SYNC_CAPTURE_NAME === item.name && item.reasonCode && Constants.PAYMENT_GATEWAY_SUCCESS_REASON_CODE === item.reasonCode);
  const checkAuthReversalPresent = applications.some((item: Partial<ApplicationsType>) => Constants.STRING_SYNC_AUTH_REVERSAL_NAME === item.name)
  const checkRefundPresent = applications.some((item: Partial<ApplicationsType>) => Constants.STRING_SYNC_REFUND_NAME === item.name || Constants.STRING_SYNC_ECHECK_CREDIT_NAME === item.name);
  return {
    authPresent: checkAuthPresent,
    authReasonCodePresent: checkAuthReasonCodePresent,
    capturePresent: checkCapturePresent,
    captureReasonCodePresent: captureReasonCodePresent,
    authReversalPresent: checkAuthReversalPresent,
    refundPresent: checkRefundPresent,
  }
};

/**
 * Updates card details for the payment using Visa checkout data.
 * 
 * @param {PaymentType} payment - The payment object.
 * @param {number} paymentVersion - The version of the payment.
 * @param {string} transactionId - The transaction ID.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
const updateCardDetails = async (payment: PaymentType, paymentVersion: number, transactionId: string): Promise<void> => {
  let actions: readonly Partial<ActionType>[] = [];
  let syncVisaCardDetailsResponse: PaymentType | null = null;
  const visaObject = {
    transactionId: '',
  };
  const updateResponse = {
    cartVersion: null,
    paymentVersion: null,
  };
  let paymentId = payment.id || '';
  if (payment && paymentVersion) {
    visaObject.transactionId = transactionId;
    const visaCheckoutData = await getCartData(visaObject, payment)
    if (visaCheckoutData) {
      const cartDetails = await getCartDetailsByPaymentId(paymentId);
      if (cartDetails && 'Active' === cartDetails.cartState && cartDetails?.id && cartDetails?.version) {
        const visaResponse = await commercetoolsApi.updateCartByPaymentId(cartDetails.id, paymentId, cartDetails.version, visaCheckoutData);
        if (visaResponse) {
          updateResponse.cartVersion = visaResponse.version;
          actions = paymentActions.cardDetailsActions(visaCheckoutData);
          if (actions && actions?.length) {
            const visaUpdateObject = {
              actions: actions,
              id: paymentId,
              version: paymentVersion,
            };
            syncVisaCardDetailsResponse = await commercetoolsApi.syncVisaCardDetails(visaUpdateObject as VisaUpdateType);
            if (syncVisaCardDetailsResponse) {
              paymentUtils.logData(__filename, 'FuncUpdateCardDetails', Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.SUCCESS_MSG_UPDATE_CLICK_TO_PAY_CARD_DETAILS);
            }
          }
        }
      }
    }
  } else {
    paymentUtils.logData(__filename, 'FuncUpdateCardDetails', Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_PAYMENT_DETAILS);
  }
};
/**
 * Retrieves cart details by payment ID.
 * 
 * @param {string} paymentId - The ID of the payment.
 * @returns {Promise<any>} - A promise that resolves with the cart details.
 */
const getCartDetailsByPaymentId = async (paymentId: string): Promise<any> => {
  let cartDetails;
  if (paymentId) {
    const cartResponse = await commercetoolsApi.queryCartById(paymentId, Constants.PAYMENT_ID);
    if (cartResponse && 0 < cartResponse?.count) {
      cartDetails = cartResponse.results[0];
    }
  } else {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CART_DETAILS_BY_PAYMENT_ID, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_PAYMENT_DETAILS);
  }
  return cartDetails;
};
/**
 * Updates custom fields for a given custom object type.
 * 
 * @param {any[]} customFields - Array of custom fields.
 * @param {any[]} getCustomObj - Array of existing custom fields.
 * @param {string} typeId - Custom object type ID.
 * @param {number} version - Version of the custom object.
 * @returns {Promise<void>}
 */
const updateCustomField = async (customFields: any, getCustomObj: any, typeId: string, version: number): Promise<void> => {
  let isExistingField = false;
  let addCustomFieldResponse;
  try {
    if (customFields && getCustomObj && typeId && version) {
      for (let field of customFields) {
        isExistingField = false;
        getCustomObj.forEach((custom: any) => {
          if (field.name === custom.name) {
            isExistingField = true;
          }
        });
        if (!isExistingField) {
          addCustomFieldResponse = await commercetoolsApi.addCustomField(typeId, version, field);
          version = addCustomFieldResponse.version;
        }
      }
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_CUSTOM_FIELDS, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_UPDATE_CUSTOM_TYPE);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_UPDATE_CUSTOM_FIELDS, CustomMessages.EXCEPTION_MSG_SYNC_DETAILS, exception, '', '', '');
  }
};
/**
 * Updates the cart with address details obtained from transient token data.
 * 
 * @param {PaymentType} updatePaymentObj - The payment object containing updated payment details.
 * @param {any} cartObj - The cart object to be updated.
 * @returns {Promise<any>} - The updated cart object.
 */
const updateCartWithUCAddress = async (updatePaymentObj: PaymentType, cartObj: any): Promise<any> => {
  let transientTokenData: {
    readonly httpCode: number;
    readonly data: any;
    readonly status: string;
  };
  let message = '';
  let paymentId = updatePaymentObj.id || '';
  let cartId = cartObj?.id;
  let cartVersion = cartObj?.version || '';
  let updatedCart;
  try {
    if (updatePaymentObj && cartObj && cartId && cartVersion) {
      transientTokenData = await getTransientTokenData.getTransientTokenDataResponse(updatePaymentObj, 'Payments');
      if (transientTokenData?.httpCode && Constants.HTTP_OK_STATUS_CODE === transientTokenData?.httpCode) {
        let orderInformation = transientTokenData.data.orderInformation;
        if (!paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_EMAIL)) {
          orderInformation.billTo.email = cartObj?.billingAddress?.email;
        }
        updatedCart = await commercetoolsApi.updateCartByPaymentId(cartId, paymentId, cartObj.version, orderInformation);
        message = updatedCart ? CustomMessages.SUCCESS_MSG_UC_ADDRESS_DETAILS : CustomMessages.ERROR_MSG_UC_ADDRESS_DETAILS;
      } else {
        message = CustomMessages.ERROR_MSG_TRANSIENT_TOKEN_DATA;
      }
    }
    paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_CART_WITH_UC_ADDRESS, Constants.LOG_INFO, 'PaymentId : ' + paymentId, message);
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_UPDATE_CART_WITH_UC_ADDRESS, CustomMessages.EXCEPTION_MSG_CART_UPDATE, exception, '', '', '');
  }
  return updatedCart;
};
/**
 * Adds billing address for UC token.
 * 
 * @param {PaymentType} updatePaymentObj - The payment object containing updated payment details.
 * @param {any} cartObj - The cart object.
 * @returns {Promise<CustomerType | null>} - The updated customer address.
 */
const addTokenAddressForUC = async (updatePaymentObj: PaymentType, cartObj: any): Promise<Partial<CustomerType> | null> => {
  let transientTokenData: {
    readonly httpCode: number;
    readonly data: any;
    readonly status: string;
  };
  let customerAddress: Partial<CustomerType> | null = null;
  let customerId = updatePaymentObj?.customer?.id || '';
  let paymentId = updatePaymentObj?.id || '';
  try {
    if (updatePaymentObj && 'FULL' === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE) {
      transientTokenData = await getTransientTokenData.getTransientTokenDataResponse(updatePaymentObj, 'Payments');
      if (transientTokenData.httpCode && Constants.HTTP_OK_STATUS_CODE === transientTokenData.httpCode && customerId) {
        const transientTokenDataObj = transientTokenData.data;
        customerAddress = await commercetoolsApi.addCustomerAddress(customerId, transientTokenDataObj.orderInformation.billTo);
      } else {
        paymentUtils.logData(__filename, 'FuncAddTokenAddressForUC', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_UC_ADDRESS_DETAILS);
      }
    } else if (updatePaymentObj && ('NONE' === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE || 'PARTIAL' === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE)) {
      if (cartObj && cartObj?.billingAddress && customerId) {
        customerAddress = await commercetoolsApi.addCustomerAddress(customerId, cartObj.billingAddress);
      } else {
        paymentUtils.logData(__filename, 'FuncAddTokenAddressForUC', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_CUSTOMER_UPDATE);
      }
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, 'FuncAddTokenAddressForUC', CustomMessages.EXCEPTION_MSG_CUSTOMER_UPDATE_ADDRESS, exception, paymentId, 'PaymentId : ', '');
  }
  return customerAddress;
};
/**
 * Sets customer failed token data.
 * 
 * @param {PaymentType} updatePaymentObj - The payment object containing updated payment details.
 * @param {PaymentCustomFieldsType} customFields - The custom fields associated with the payment.
 * @param {string} addressId - The address ID.
 * @returns {Promise<CustomerType | null>} - The updated customer token response.
 */
const setCustomerFailedTokenData = async (updatePaymentObj: PaymentType, customFields: Partial<PaymentCustomFieldsType>, addressId: string): Promise<Partial<CustomerType> | null> => {
  let existingTokens: string[] = [];
  let existingFailedTokensMap: string[] = [];
  let customerInfo: Partial<CustomerType> | null = null;
  let customerTokenResponse: Partial<CustomerType> | null = null;
  let failedTokenLength = 0;
  const customerId = updatePaymentObj?.customer?.id;
  if (customerId) {
    customerInfo = await commercetoolsApi.getCustomer(customerId);
  }
  if (customerInfo) {
    const fields = customerInfo?.custom?.fields as any;
    const id = customerInfo?.custom?.type?.id;
    const failedToken = new Token(customFields, '', '', '', addressId, '');
    const isCustomTypePresent = id ? true : false;
    if (fields?.isv_tokens) {
      const customerTokens = fields;
      if (0 < customerTokens?.isv_failedTokens?.length) {
        const existingFailedTokens = customerTokens.isv_failedTokens;
        existingFailedTokensMap = existingFailedTokens.map((item: any) => item);
        failedTokenLength = customerTokens.isv_failedTokens.length;
        existingFailedTokensMap[failedTokenLength] = JSON.stringify(failedToken);
      } else {
        existingFailedTokensMap = [JSON.stringify(failedToken)];
      }
      existingTokens = fields.isv_tokens;
    } else {
      existingFailedTokensMap = [JSON.stringify(failedToken)];
    }
    if (0 < fields?.isv_failedTokens?.length) {
      customerTokenResponse = await commercetoolsApi.updateCustomerToken(null, customerInfo, existingFailedTokensMap, null);
    } else {
      customerTokenResponse = isCustomTypePresent ? await commercetoolsApi.updateCustomerToken(existingTokens, customerInfo, existingFailedTokensMap, null) :
        await commercetoolsApi.setCustomType(customerId, existingTokens, existingFailedTokensMap);
    }
  }
  return customerTokenResponse;
};

const processTransaction = async (paymentObj: PaymentType) => {
  let updateResponse = paymentUtils.getEmptyResponse();
  const paymentResponse = {
    httpCode: 0,
    status: '',
    transactionId: '',
  };
  const transactionLength = paymentObj.transactions?.length;
  const updatePaymentId = paymentObj.id;
  const paymentMethod = paymentObj.paymentMethodInfo?.method;
  const paymentCustomFields = paymentObj.custom?.fields;
  const updateTransactions = paymentObj?.transactions[transactionLength - 1];
  if (
    1 === transactionLength &&
    updateTransactions &&
    (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === updateTransactions.type || (Constants.CT_TRANSACTION_TYPE_CHARGE === updateTransactions.type && (paymentCustomFields?.isv_saleEnabled || Constants.ECHECK === paymentMethod)))
  ) {
    if ([Constants.CT_TRANSACTION_STATE_SUCCESS, Constants.CT_TRANSACTION_STATE_FAILURE, Constants.CT_TRANSACTION_STATE_PENDING].includes(updateTransactions.state as string)) {
      updateResponse = paymentUtils.getEmptyResponse();
    } else if (paymentCustomFields && Constants.CC_PAYER_AUTHENTICATION === paymentMethod && 'isv_payerAuthenticationRequired' in paymentCustomFields && paymentCustomFields?.isv_payerEnrollStatus && paymentCustomFields?.isv_payerEnrollTransactionId) {
      paymentResponse.httpCode = Number(paymentCustomFields.isv_payerEnrollHttpCode);
      paymentResponse.status = paymentCustomFields.isv_payerEnrollStatus;
      paymentResponse.transactionId = paymentCustomFields.isv_payerEnrollTransactionId;
      updateResponse = getAuthResponse(paymentResponse, updateTransactions);
      if (updateResponse?.actions && 0 < updateResponse.actions?.length && paymentCustomFields.isv_securityCode) {
        const isv_securityCode = 0;
        updateResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_securityCode }));
      }
      if (paymentResponse && Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
        updateResponse = await paymentHandler.handlePayerAuthReversal(paymentObj, paymentResponse, updateResponse);
      }
    } else {
      updateResponse = await paymentHandler.handleAuthorization(paymentObj, updateTransactions);
    }
  } else {
    updateResponse = await paymentHandler.handleOrderManagement(updatePaymentId, paymentObj, updateTransactions);
  }
  return updateResponse;
}

const handleTokenCreation = async (customerObj: Partial<CustomerType>, addressObj: readonly AddressType[], isv_addressId: string | undefined): Promise<{ isSaveToken: boolean, cardTokens: any, billToFields: AddressType | null }> => {
  const tokenCreateResponse = await evaluateTokenCreation(customerObj, null, FunctionConstant.FUNC_HANDLE_CARD_ADDITION);
  let billToFields: AddressType | null = null;
  const isSaveToken = tokenCreateResponse.isSaveToken;
  const cardTokens = getCardTokens(customerObj, '');
  if (!tokenCreateResponse.isError) {
    if (Constants.UC_ADDRESS === isv_addressId) {
      const ucAddressData = await getTransientTokenData.getTransientTokenDataResponse(customerObj, 'MyAccounts');
      if (Constants.HTTP_OK_STATUS_CODE === ucAddressData?.httpCode) {
        billToFields = ucAddressData.data.orderInformation.billTo;
      }
    } else {
      addressObj.forEach((address) => {
        if (isv_addressId === address.id) {
          billToFields = address;
        }
      });
    }
  } else {
    paymentUtils.logData(__filename, 'FuncHandleTokenCreation', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_SERVICE_PROCESS);
  }
  return { isSaveToken, cardTokens, billToFields };
};

const getAuthResponse = (paymentResponse: PtsV2PaymentsPost201Response | any, transactionDetail: Partial<PaymentTransactionType> | null): ActionResponseType => {
  let response: ActionResponseType = paymentUtils.getEmptyResponse();
  let setCustomField: Partial<ActionType>;
  try {
    if (paymentResponse) {
      const { httpCode, data, status } = paymentResponse || {};
      const { consumerAuthenticationInformation } = data || {};
      const validPendingAuthenticationResponse = paymentValidator.isValidPendinAuthenticationResponse(httpCode, status, data, consumerAuthenticationInformation)
      if (Constants.HTTP_SUCCESS_STATUS_CODE === httpCode && transactionDetail && (Constants.API_STATUS_AUTHORIZED === status || Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === status || Constants.API_STATUS_PENDING === status)) {
        const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);
        setCustomField =
          Constants.CT_TRANSACTION_TYPE_CHARGE === transactionDetail.type && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === status
            ? paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE)
            : paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_SUCCESS);
        response = paymentActions.createResponse(setTransaction, setCustomField, null, null);
      } else if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse?.httpCode && (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === paymentResponse?.status || Constants.API_STATUS_PENDING_REVIEW === paymentResponse?.status) && transactionDetail) {
        const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);
        setCustomField = paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_PENDING);
        response = paymentActions.createResponse(setTransaction, setCustomField, null, null);
      } else if (Constants.HTTP_SUCCESS_STATUS_CODE === httpCode && Constants.API_STATUS_COMPLETED === status) {
        const isv_requestJwt = paymentResponse.accessToken;
        const isv_cardinalReferenceId = paymentResponse.referenceId;
        const isv_deviceDataCollectionUrl = paymentResponse.deviceDataCollectionUrl;
        const actions = paymentUtils.setCustomFieldMapper({ isv_requestJwt, isv_cardinalReferenceId, isv_deviceDataCollectionUrl });
        response.actions = actions;
      } else if (validPendingAuthenticationResponse) {
        const payerAuthenticationData = new PayerAuthData(consumerAuthenticationInformation, paymentResponse);
        const actions = paymentActions.payerAuthActions(payerAuthenticationData);
        response.actions = actions;
      } else {
        if (!transactionDetail) response = paymentUtils.getEmptyResponse();
        else {
          const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);
          setCustomField = paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE);
          const paymentFailure = paymentUtils.failureResponse(paymentResponse, transactionDetail);
          response = paymentActions.createResponse(setTransaction, setCustomField, paymentFailure, null);
        }
      }
      if (!('deviceDataCollectionUrl' in paymentResponse)) {
        paymentValidator.setObjectValue(response.actions, 'isv_AVSResponse', paymentResponse, 'text.processorInformation.avs.code', Constants.STR_STRING, true);
        paymentValidator.setObjectValue(response.actions, 'isv_CVVResponse', paymentResponse, 'text.processorInformation.cardVerification.resultCode', Constants.STR_STRING, true);
        paymentValidator.setObjectValue(response.actions, 'isv_responseCode', paymentResponse, 'text.processorInformation.responseCode', Constants.STR_STRING, true);
        paymentValidator.setObjectValue(response.actions, 'isv_responseDateAndTime', paymentResponse, 'text.submitTimeUtc', Constants.STR_STRING, true);
        paymentValidator.setObjectValue(response.actions, 'isv_ECI', paymentResponse, 'text.consumerAuthenticationInformation.ecommerceIndicator', Constants.STR_STRING, true);
        paymentValidator.setObjectValue(response.actions, 'isv_authorizationStatus', paymentResponse, 'status', Constants.STR_STRING, true);
        paymentValidator.setObjectValue(response.actions, 'isv_authorizationReasonCode', paymentResponse, 'httpCode', Constants.STR_STRING, true);
      }
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTH_RESPONSE, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_AUTH_RESPONSE, '', exception, '', '', '');
  }
  return response;
};

const getCartData = async (paymentResponse: any, updatePaymentObj: PaymentType) => {
  const maxAttempts = 3;
  const delayDuration = 1000;
  let cartDetails: any;
  let getTransactionDataResponse = await getTransaction.getTransactionData(paymentResponse, updatePaymentObj);
  if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode
    && getTransactionDataResponse
    && Constants.HTTP_OK_STATUS_CODE === getTransactionDataResponse.httpCode
    && getTransactionDataResponse?.cardFieldGroup) {
    cartDetails = getTransactionDataResponse;
  } else {
    for (let i = 0; i < maxAttempts; i++) {
      getTransactionDataResponse = await getTransaction.getTransactionData(paymentResponse, updatePaymentObj);
      await new Promise(resolve => setTimeout(resolve, delayDuration));
      if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode
        && getTransactionDataResponse
        && Constants.HTTP_OK_STATUS_CODE === getTransactionDataResponse.httpCode
        && getTransactionDataResponse?.cardFieldGroup) {
        cartDetails = getTransactionDataResponse;
        break;
      }
    }
  }
  return cartDetails;
};
export default {
  evaluateTokenCreation,
  getOMServiceResponse,
  getCapturedAmount,
  getAuthorizedAmount,
  setTransactionCustomType,
  getPaymentResponse,
  getGooglePayResponse,
  getClickToPayResponse,
  updateCustomField,
  checkAuthReversalTriggered,
  getRefundResponse,
  getApplicationsPresent,
  updateCardDetails,
  getCardTokens,
  setCustomerTokenData,
  getTransactionSummaries,
  handleAuthReversalResponse,
  processTokens,
  getCartDetailsByPaymentId,
  updateCartWithUCAddress,
  addTokenAddressForUC,
  setCustomerFailedTokenData,
  processTransaction,
  handleTokenCreation,
  getAuthResponse,
  getCartData
};
