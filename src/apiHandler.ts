import path from 'path';

import { Constants } from './constants';
import captureContext from './service/payment/CaptureContextService';
import flexKeys from './service/payment/FlexKeys';
import getCardByInstrument from './service/payment/GetCardByInstrumentId';
import keyVerification from './service/payment/GetPublicKeys';
import { actionResponseType, paymentTransactionType, paymentType } from './types/Types';
import paymentHandler from './utils/PaymentHandler';
import paymentService from './utils/PaymentService';
import paymentUtils from './utils/PaymentUtils';
import commercetoolsApi from './utils/api/CommercetoolsApi';

const paymentCreateApi = async (paymentObj: paymentType) => {
  let response: actionResponseType = paymentUtils.getEmptyResponse();
  try {
    if (paymentObj?.paymentMethodInfo?.method) {
      const paymentMethod = paymentObj.paymentMethodInfo.method;
      if (paymentObj?.custom?.fields?.isv_transientToken) {
        //For Unified Checkout
        response = paymentUtils.getEmptyResponse();
      } else if (Constants.CREDIT_CARD === paymentMethod || Constants.CC_PAYER_AUTHENTICATION === paymentMethod) {
        if (paymentObj?.custom?.fields?.isv_savedToken) {
          const actions = paymentUtils.setCustomFieldMapper(paymentObj.custom.fields);
          response.actions = actions;
        } else {
          const microFormKeys = await flexKeys.keys(paymentObj);
          if (microFormKeys?.isv_tokenCaptureContextSignature) {
            const verifiedCaptureContext = await keyVerification.getPublicKeys(microFormKeys.isv_tokenCaptureContextSignature, paymentObj);
            if (verifiedCaptureContext) {
              const actions = paymentUtils.setCustomFieldMapper(microFormKeys);
              response.actions = actions;
            } else {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPaymentCreateApi', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_CAPTURE_CONTEXT);
            }
          } else {
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPaymentCreateApi', Constants.LOG_INFO, '', Constants.ERROR_MSG_FLEX_TOKEN_KEYS);
            response = paymentUtils.invalidOperationResponse();
          }
        }
      } else if (Constants.APPLE_PAY === paymentMethod) {
        if (paymentObj?.custom?.fields && paymentObj.custom.fields.isv_applePayValidationUrl && paymentObj.custom.fields.isv_applePayDisplayName) {
          response = await paymentHandler.applePaySessionHandler(paymentObj.custom.fields);
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPaymentCreateApi', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_INPUT);
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPaymentCreateApi', Constants.LOG_INFO, '', Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncPaymentCreateApi', Constants.EXCEPTION_CREATE_PAYMENT_API, exception, '', '', '');
  }
  return response;
};

const paymentUpdateApi = async (paymentObj: paymentType) => {
  let updateResponse: actionResponseType = paymentUtils.getEmptyResponse();
  const paymentResponse = {
    httpCode: 0,
    status: '',
    transactionId: '',
  };
  try {
    if (paymentObj?.id && paymentObj?.paymentMethodInfo?.method && paymentObj?.transactions) {
      const updatePaymentId = paymentObj.id;
      const paymentMethod = paymentObj.paymentMethodInfo.method;
      const transactionLength = paymentObj.transactions?.length;
      if (paymentObj?.custom?.fields) {
        const paymentCustomFields = paymentObj.custom.fields;
        if (Constants.CC_PAYER_AUTHENTICATION === paymentMethod && 0 === transactionLength) {
          if (!paymentCustomFields?.isv_cardinalReferenceId) {
            updateResponse = await paymentService.getPayerAuthSetUpResponse(paymentObj);
          } else if (!paymentCustomFields?.isv_payerAuthenticationTransactionId && paymentCustomFields?.isv_cardinalReferenceId) {
            updateResponse = await paymentService.getPayerAuthEnrollResponse(paymentObj);
          } else if (paymentCustomFields?.isv_payerAuthenticationTransactionId && paymentCustomFields.isv_payerAuthenticationRequired && paymentCustomFields.isv_payerEnrollStatus && paymentCustomFields.isv_payerEnrollTransactionId) {
            paymentResponse.httpCode = Number(paymentCustomFields.isv_payerEnrollHttpCode);
            paymentResponse.status = paymentCustomFields.isv_payerEnrollStatus;
            paymentResponse.transactionId = paymentCustomFields.isv_payerEnrollTransactionId;
            updateResponse = await paymentService.getPayerAuthValidateResponse(paymentObj);
          }
        }
        // Processing the payment for all the payment methods
        if (0 < transactionLength) {
          const updateTransactions = paymentObj?.transactions[transactionLength - 1];
          if (
            1 === transactionLength &&
            updateTransactions &&
            (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === updateTransactions.type || (Constants.CT_TRANSACTION_TYPE_CHARGE === updateTransactions.type && (paymentCustomFields?.isv_saleEnabled || Constants.ECHECK === paymentMethod)))
          ) {
            if (Constants.CT_TRANSACTION_STATE_SUCCESS === updateTransactions.state || Constants.CT_TRANSACTION_STATE_FAILURE === updateTransactions.state || Constants.CT_TRANSACTION_STATE_PENDING === updateTransactions.state) {
              updateResponse = paymentUtils.getEmptyResponse();
            } else if (Constants.CC_PAYER_AUTHENTICATION === paymentMethod && 'isv_payerAuthenticationRequired' in paymentCustomFields && paymentCustomFields?.isv_payerEnrollStatus && paymentCustomFields?.isv_payerEnrollTransactionId) {
              paymentResponse.httpCode = Number(paymentCustomFields.isv_payerEnrollHttpCode);
              paymentResponse.status = paymentCustomFields.isv_payerEnrollStatus;
              paymentResponse.transactionId = paymentCustomFields.isv_payerEnrollTransactionId;
              updateResponse = paymentService.getAuthResponse(paymentResponse, updateTransactions);
              if (updateResponse?.actions && 0 < updateResponse.actions?.length && paymentCustomFields.isv_securityCode) {
                const isv_securityCode = 0;
                updateResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_securityCode }));
              }
              if (paymentResponse && Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
                updateResponse = await paymentHandler.payerAuthReversalHandler(paymentObj, paymentResponse, updateResponse);
              }
            } else {
              updateResponse = await paymentHandler.authorizationHandler(paymentObj, updateTransactions);
            }
          } else {
            updateResponse = await paymentHandler.orderManagementHandler(updatePaymentId, paymentObj, updateTransactions);
          }
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPaymentUpdateApi', Constants.LOG_INFO, '', Constants.ERROR_MSG_EMPTY_PAYMENT_DATA);
        updateResponse = paymentUtils.getEmptyResponse();
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncPaymentUpdateApi', Constants.EXCEPTION_UPDATE_PAYMENT_API, exception, '', '', '');
  }
  return updateResponse;
};

const customerUpdateApi = async (customerObj: any) => {
  let response: actionResponseType = paymentUtils.invalidInputResponse();
  try {
    if (customerObj) {
      if ('' === customerObj?.custom?.fields?.isv_tokenCaptureContextSignature) {
        const paymentObj = customerObj;
        const microFormKeys = await flexKeys.keys(paymentObj);
        if (microFormKeys) {
          const actions = paymentUtils.setCustomFieldMapper(microFormKeys);
          response.actions = actions;
          response.errors = [];
        }
      } else if (customerObj?.custom?.fields?.isv_addressId) {
        if (customerObj?.addresses) {
          const customerAddress = customerObj.addresses;
          response = await paymentHandler.addCardHandler(customerObj.id, customerAddress, customerObj);
        }
      } else if (customerObj?.custom?.fields?.isv_tokens && 0 < customerObj.custom.fields.isv_tokens?.length) {
        const tokensToUpdate = JSON.parse(customerObj.custom.fields.isv_tokens[0]);
        if ('delete' === customerObj.custom.fields.isv_tokenAction) {
          response = await paymentHandler.deleteCardHandler(tokensToUpdate, customerObj.id);
        } else if ('update' === customerObj.custom.fields.isv_tokenAction) {
          response = await paymentHandler.updateCardHandler(tokensToUpdate, customerObj.id, customerObj);
        } else {
          response = paymentService.getUpdateTokenActions(customerObj.custom.fields.isv_tokens, customerObj?.custom?.fields?.isv_failedTokens, true, customerObj, null);
        }
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncCustomerUpdateApi', Constants.EXCEPTION_UPDATE_CUSTOMER_API, exception, '', '', '');
  }
  return response;
};

const paymentDetailsApi = async (paymentId: string) => {
  let paymentDetails: paymentType | null = null;
  let refundTransaction: readonly paymentTransactionType[];
  let isAuthReversed = false;
  const paymentDetailsResponse = {
    paymentId: '',
    cartLocale: '',
    pendingAuthorizedAmount: 0,
    pendingCaptureAmount: 0,
    errorMessage: '',
    paymentDetails: {},
    cartData: {},
  };
  try {
    paymentDetailsResponse.errorMessage = Constants.ERROR_MSG_EMPTY_PAYMENT_DATA;
    if (typeof paymentId === 'string' && paymentId) {
      paymentDetailsResponse.paymentId = paymentId.replace(Constants.FORMAT_PAYMENT_ID_REGEX, '');
      const cartDetails = await commercetoolsApi.queryCartById(paymentDetailsResponse.paymentId, Constants.PAYMENT_ID);
      if (cartDetails && 0 < cartDetails?.count) {
        const cartData = cartDetails?.results[0];
        if (cartData && cartData?.locale) {
          paymentDetailsResponse.cartData = cartData;
          paymentDetailsResponse.cartLocale = cartData.locale;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPaymentDetailsApi', Constants.LOG_INFO, 'PaymentId : ' + paymentDetailsResponse.paymentId, Constants.ERROR_MSG_CART_DETAILS);
      }
      paymentDetails = await commercetoolsApi.retrievePayment(paymentDetailsResponse.paymentId);
      if (paymentDetails) {
        paymentDetailsResponse.errorMessage = '';
        if (paymentDetails?.transactions) {
          paymentDetailsResponse.paymentDetails = paymentDetails;
          refundTransaction = paymentDetails.transactions;
          if (refundTransaction && 0 < refundTransaction?.length) {
            for (let transaction of refundTransaction) {
              if (Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state) {
                isAuthReversed = true;
                break;
              }
            }
            if (!isAuthReversed) {
              paymentDetailsResponse.pendingCaptureAmount = paymentService.getCapturedAmount(paymentDetails);
              paymentDetailsResponse.pendingAuthorizedAmount = paymentService.getAuthorizedAmount(paymentDetails);
            }
          }
        } else {
          paymentDetailsResponse.errorMessage = Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS;
        }
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncPaymentDetailsApi', '', exception, '', '', '');
  }
  return paymentDetailsResponse;
};

const orderManagementApi = async (paymentId: string, transactionAmount: number | undefined, transactionType: string) => {
  let paymentObject: paymentType | null = null;
  const apiResponse = {
    errorMessage: '',
    successMessage: '',
  };
  let pendingAmount;
  try {
    if (paymentId) {
      paymentObject = await commercetoolsApi.retrievePayment(paymentId);
      if (paymentObject) {
        const fractionDigits = paymentObject?.amountPlanned?.fractionDigits;
        if (Constants.CT_TRANSACTION_TYPE_CHARGE === transactionType) {
          pendingAmount = paymentService.getAuthorizedAmount(paymentObject);
        } else if (Constants.CT_TRANSACTION_TYPE_REFUND === transactionType) {
          pendingAmount = paymentService.getCapturedAmount(paymentObject);
        }
        if (0 === transactionAmount) {
          apiResponse.errorMessage = paymentUtils.handleOMErrorMessage(0, transactionType);
        } else if (pendingAmount && transactionAmount && transactionAmount > pendingAmount) {
          apiResponse.errorMessage = paymentUtils.handleOMErrorMessage(1, transactionType);
        } else {
          if (transactionAmount) {
            paymentObject.amountPlanned.centAmount = paymentUtils.convertAmountToCent(transactionAmount, fractionDigits);
          }
          const transactionObject = paymentUtils.createTransactionObject(paymentObject.version, paymentObject.amountPlanned, transactionType, Constants.CT_TRANSACTION_STATE_INITIAL, undefined, undefined);
          const addTransaction = await commercetoolsApi.addTransaction(transactionObject, paymentId);
          if (addTransaction && 0 < addTransaction.transactions?.length) {
            const transactionLength = addTransaction.transactions.length;
            const latestTransaction = addTransaction.transactions[transactionLength - 1];
            if (latestTransaction) {
              if (Constants.CT_TRANSACTION_STATE_SUCCESS === latestTransaction.state) {
                if (Constants.CT_TRANSACTION_TYPE_CHARGE === latestTransaction.type) {
                  apiResponse.successMessage = Constants.SUCCESS_MSG_CAPTURE_SERVICE;
                } else if (Constants.CT_TRANSACTION_TYPE_REFUND === latestTransaction.type) {
                  apiResponse.successMessage = Constants.SUCCESS_MSG_REFUND_SERVICE;
                } else if (Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION === latestTransaction.type) {
                  apiResponse.successMessage = Constants.SUCCESS_MSG_REVERSAL_SERVICE;
                }
              } else {
                apiResponse.errorMessage = paymentUtils.handleOMErrorMessage(2, transactionType);
              }
            }
          } else {
            apiResponse.errorMessage = Constants.ERROR_MSG_ADD_TRANSACTION_DETAILS;
          }
        }
      } else {
        apiResponse.errorMessage = Constants.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS;
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncCaptureApi', '', exception, '', '', '');
  }
  return apiResponse;
};

const captureContextApi = async (requestObj: any) => {
  let cartId = requestObj?.cartId || '';
  let response = '';
  try {
    const merchantId = requestObj?.merchantId ? requestObj.merchantId : '';
    if (requestObj?.cartId) {
      const cartDetails = await commercetoolsApi.getCartById(cartId);
      if (cartDetails && cartDetails?.id) {
        const captureContextResponse = await captureContext.generateCaptureContext(cartDetails, '', '', '', merchantId, 'Payments');
        response = captureContextResponse;
      }
    } else if (requestObj?.country && requestObj?.locale && requestObj?.currency) {
      const country = requestObj.country;
      const locale = requestObj.locale;
      const currencyCode = requestObj.currency;
      const captureContextResponse = await captureContext.generateCaptureContext(null, country, locale, currencyCode, merchantId, 'MyAccounts');
      response = captureContextResponse;
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncCaptureContextApi', Constants.LOG_INFO, '', Constants.ERROR_MSG_CAPTURE_CONTEXT);
    }
    if ('' === response) {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncCaptureContextApi', Constants.LOG_INFO, 'CartId : ' + cartId, Constants.ERROR_MSG_CAPTURE_CONTEXT);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncCaptureContextApi', '', exception, '', '', '');
  }
  return response;
};

const notificationApi = async (notification: any) => {
  let instrumentIdResponse;
  let updateTokenResponse;
  let instrumentIdentifier = '';
  let customerTokenId = '';
  let merchantId = '';
  const notificationApiResponse = {
    errorMessage: '',
    successMessage: '',
  };
  try {
    if ('tms.networktoken.updated' === notification?.eventType && notification?.payload && notification?.payload[0]?.data) {
      for (let element of notification.payload) {
        instrumentIdentifier = paymentUtils.extractTokenValue(element.data._links.instrumentIdentifiers[0].href);
        customerTokenId = paymentUtils.extractTokenValue(element.data._links.customers[0].href);
        merchantId = element?.organizationId;
        if (merchantId) {
          if (0 < instrumentIdentifier?.length) {
            instrumentIdResponse = await getCardByInstrument.getCardByInstrumentResponse(instrumentIdentifier, merchantId);
            if (Constants.HTTP_OK_STATUS_CODE === instrumentIdResponse?.httpCode && Constants.STRING_ACTIVE === instrumentIdResponse?.state) {
              updateTokenResponse = await paymentHandler.networkTokenHandler(customerTokenId, instrumentIdResponse);
              if (Constants.HTTP_OK_STATUS_CODE === updateTokenResponse?.statusCode) {
                notificationApiResponse.successMessage = Constants.SUCCESS_MSG_UPDATED_CUSTOMER_TOKEN;
              } else {
                notificationApiResponse.errorMessage = Constants.ERROR_MSG_UNABLE_TO_UPDATE_CUSTOMER_TOKEN;
                paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncNotificationApi', Constants.LOG_INFO, '', JSON.stringify(updateTokenResponse));
              }
            } else {
              notificationApiResponse.errorMessage = Constants.ERROR_MSG_INVALID_INSTRUMENT_ID_RESPONSE;
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncNotificationApi', Constants.LOG_INFO, '', JSON.stringify(instrumentIdResponse));
            }
          } else {
            notificationApiResponse.errorMessage = Constants.ERROR_MSG_INVALID_INSTRUMENT_IDENTIFIER;
          }
        }
      }
    } else {
      notificationApiResponse.errorMessage = Constants.ERROR_MSG_INVALID_NOTIFICATION_DATA;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncNotificationApi', '', exception, '', '', '');
  }
  return notificationApiResponse;
};

export default {
  paymentCreateApi,
  paymentUpdateApi,
  customerUpdateApi,
  paymentDetailsApi,
  captureContextApi,
  notificationApi,
  orderManagementApi,
};
