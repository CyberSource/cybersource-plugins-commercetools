import path from 'path';

import { Constants } from '../constants';
import createSearchRequest from '../service/payment/CreateTransactionSearchRequest';
import getTransaction from '../service/payment/GetTransactionData';
import getTransientTokenData from '../service/payment/GetTransientTokenData';
import paymentAuthSetUp from '../service/payment/PayerAuthenticationSetupService';
import {
  actionResponseType,
  actionType,
  addressType,
  addTransactionType,
  amountPlannedType,
  applicationsType,
  consumerAuthenticationInformationType,
  customerTokensType,
  customerType,
  customTokenType,
  paymentCustomFieldsType,
  paymentTransactionType,
  paymentType,
  pgAddressGroupType,
  reportSyncType,
  tokenCreateFlagType,
  visaUpdateType,
} from '../types/Types';

import paymentAuthReversal from './../service/payment/PaymentAuthorizationReversal';
import paymentAuthorization from './../service/payment/PaymentAuthorizationService';
import paymentRefund from './../service/payment/PaymentRefundService';
import commercetoolsApi from './../utils/api/CommercetoolsApi';
import paymentUtils from './PaymentUtils';
import multiMid from './config/MultiMid';

const cardDetailsActions = (cardDetails: pgAddressGroupType) => {
  let actions: actionType[] = [];
  try {
    if (cardDetails?.cardFieldGroup) {
      if (cardDetails.cardFieldGroup?.prefix && cardDetails.cardFieldGroup?.suffix) {
        const cardPrefix = cardDetails.cardFieldGroup.prefix;
        const cardSuffix = cardDetails.cardFieldGroup.suffix;
        const maskedPan = cardPrefix.concat(Constants.CLICK_TO_PAY_CARD_MASK, cardSuffix);
        const isv_maskedPan = maskedPan;
        actions = paymentUtils.setCustomFieldMapper({ isv_maskedPan });
      }
      if (cardDetails.cardFieldGroup?.expirationMonth) {
        const isv_cardExpiryMonth = cardDetails.cardFieldGroup.expirationMonth;
        actions.push(...paymentUtils.setCustomFieldMapper({ isv_cardExpiryMonth }));
      }
      if (cardDetails.cardFieldGroup?.expirationYear) {
        const isv_cardExpiryYear = cardDetails.cardFieldGroup.expirationYear;
        actions.push(...paymentUtils.setCustomFieldMapper({ isv_cardExpiryYear }));
      }
      if (cardDetails.cardFieldGroup?.type) {
        const isv_cardType = cardDetails.cardFieldGroup.type;
        actions.push(...paymentUtils.setCustomFieldMapper({ isv_cardType }));
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncCardDetailsAction', Constants.LOG_INFO, '', Constants.ERROR_MSG_CLICK_TO_PAY_DATA);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncCardDetailsAction', '', exception, '', '', '');
  }
  return actions;
};

const payerAuthActions = (response: consumerAuthenticationInformationType) => {
  let action: actionType[] = [];
  try {
    if (response) {
      const isv_payerAuthenticationRequired = response?.isv_payerAuthenticationRequired;
      const isv_payerAuthenticationTransactionId = response?.isv_payerAuthenticationTransactionId;
      const isv_payerAuthenticationAcsUrl = response?.acsurl;
      const isv_payerAuthenticationPaReq = response?.isv_payerAuthenticationPaReq;
      const isv_stepUpUrl = response?.stepUpUrl;
      const isv_responseJwt = response?.isv_responseJwt;
      action = paymentUtils.setCustomFieldMapper({
        isv_payerAuthenticationRequired,
        isv_payerAuthenticationTransactionId,
        isv_payerAuthenticationAcsUrl,
        isv_payerAuthenticationPaReq,
        isv_stepUpUrl,
        isv_responseJwt,
      });
      action.push({
        action: Constants.ADD_INTERFACE_INTERACTION,
        type: { key: 'isv_payments_payer_authentication_enrolment_check' },
        fields: {
          authorizationAllowed: true,
          authenticationRequired: true,
          xid: response.xid,
          paReq: response.pareq,
          acsUrl: response.acsurl,
          authenticationTransactionId: response.authenticationTransactionId,
          veresEnrolled: response.veresEnrolled,
          cardinalReferenceId: response.cardinalId,
          proofXml: response.proofXml,
          specificationVersion: response.specificationVersion,
          directoryServerTransactionId: response.directoryServerTransactionId,
        },
      });
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPayerAuthActions', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncPayerAuthActions', '', exception, '', '', '');
  }
  return action;
};

const payerEnrollActions = (response: any, updatePaymentObj: paymentType) => {
  const action: actionResponseType = { actions: [], errors: [] };
  let consumerErrorData: actionType[] = [];
  let isv_payerAuthenticationTransactionId = '';
  const isv_cardinalReferenceId = '';
  const isv_deviceDataCollectionUrl = '';
  const isv_requestJwt = '';
  const isv_responseJwt = '';
  const isv_stepUpUrl = '';
  let isv_payerEnrollStatus = '';
  const isv_payerAuthenticationPaReq = '';
  let isv_payerAuthenticationRequired = false;
  const isv_tokenCaptureContextSignature = '';
  const isv_tokenVerificationContext = '';
  try {
    if (response) {
      const isv_payerEnrollTransactionId = response.transactionId;
      const isv_payerEnrollHttpCode = response.httpCode;
      isv_payerEnrollStatus = response.status;
      action.actions = paymentUtils.setCustomFieldMapper({ isv_payerEnrollTransactionId, isv_payerEnrollHttpCode, isv_payerEnrollStatus });
      const customFields = updatePaymentObj?.custom?.fields;
      if (Constants.HTTP_SUCCESS_STATUS_CODE === response.httpCode && Constants.API_STATUS_AUTHORIZED === response.status && response.data) {
        isv_payerAuthenticationTransactionId = response.data.consumerAuthenticationInformation?.authenticationTransactionId;
        action.actions.push(...paymentUtils.setCustomFieldMapper({ isv_payerAuthenticationTransactionId }));
      }
      if (customFields?.isv_tokenCaptureContextSignature) {
        action.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenCaptureContextSignature }));
      }
      if (customFields?.isv_savedToken && customFields?.isv_tokenVerificationContext && customFields.isv_tokenVerificationContext) {
        action.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenVerificationContext }));
      }
      isv_payerAuthenticationRequired = Constants.API_STATUS_PENDING_AUTHENTICATION === response.status ? true : updatePaymentObj?.custom?.fields.isv_payerAuthenticationRequired ? true : false;
      action.actions.push(...paymentUtils.setCustomFieldMapper({ isv_payerAuthenticationRequired }));

      if (Constants.HTTP_SUCCESS_STATUS_CODE === response?.httpCode && response?.data && response.data?.errorInformation && 0 < Object.keys(response.data.errorInformation)?.length && Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED === response.data.errorInformation?.reason) {
        isv_payerEnrollStatus = response.data.errorInformation.reason;
        action.actions.push(...paymentUtils.setCustomFieldMapper({ isv_payerEnrollStatus }));
        if (customFields?.isv_payerAuthenticationRequired) {
          consumerErrorData = paymentUtils.setCustomFieldToNull({
            isv_payerAuthenticationTransactionId,
            isv_cardinalReferenceId,
            isv_deviceDataCollectionUrl,
            isv_requestJwt,
            isv_responseJwt,
            isv_stepUpUrl,
            isv_payerAuthenticationPaReq,
          } as paymentCustomFieldsType);
          consumerErrorData.forEach((i) => {
            action.actions.push(i);
          });
        } else {
          consumerErrorData = paymentUtils.setCustomFieldToNull({
            isv_cardinalReferenceId,
            isv_deviceDataCollectionUrl,
            isv_requestJwt,
          } as paymentCustomFieldsType);
          consumerErrorData.forEach((i) => {
            action.actions.push(i);
          });
        }
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPayerEnrollActions', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncPayerEnrollActions', '', exception, '', '', '');
  }
  return action;
};

const getUpdateTokenActions = (isvTokens: string[], existingFailedTokensMap: string[] | undefined, isError: boolean, customerObj: customerType, address: addressType | null, customerTokenId?: string) => {
  let returnResponse: actionResponseType = paymentUtils.getEmptyResponse();
  let fields = {};
  let isv_customerId: string;
  const customTypePresent = customerObj?.custom?.type?.id ? true : false;
  if (customTypePresent) {
    returnResponse = {
      actions: [
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: 'isv_tokens',
          value: JSON.parse(JSON.stringify(isvTokens)),
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: 'isv_tokenUpdated',
          value: !isError,
        },
      ],
      errors: [],
    };
    if (customerTokenId) {
      isv_customerId = customerTokenId;
      returnResponse.actions.push(
        ...paymentUtils.setCustomFieldMapper({
          isv_customerId,
        })
      );
    }
    if (existingFailedTokensMap) {
      returnResponse.actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: Constants.ISV_FAILED_TOKENS,
        value: existingFailedTokensMap,
      });
    }
    if (customerObj?.custom && customerObj.custom.fields?.isv_tokenAction) {
      returnResponse.actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: 'isv_tokenAction',
        value: '',
      });
      if (customerObj.custom.fields?.isv_cardNewExpiryYear)
        returnResponse.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: 'isv_cardNewExpiryYear',
          value: '',
        });
      if (customerObj.custom.fields?.isv_cardNewExpiryMonth)
        returnResponse.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: 'isv_cardNewExpiryMonth',
          value: '',
        });
    }
    if (customerObj?.custom && customerObj.custom.fields?.isv_tokenAlias) {
      returnResponse.actions.push(
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: 'isv_tokenAlias',
          value: '',
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: 'isv_cardType',
          value: '',
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: 'isv_cardExpiryYear',
          value: '',
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: 'isv_cardExpiryMonth',
          value: '',
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_ADDRESS_ID,
          value: '',
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: 'isv_currencyCode',
          value: '',
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: 'isv_deviceFingerprintId',
          value: '',
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_TOKEN,
          value: '',
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: 'isv_maskedPan',
          value: '',
        }
      );
    }
    if (address) {
      returnResponse.actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: Constants.ISV_ADDRESS_ID,
        value: '',
      });
    }
  } else {
    if (customerTokenId) {
      fields = {
        isv_tokens: isvTokens,
        isv_tokenUpdated: !isError,
        isv_customerId: customerTokenId,
        isv_failedTokens: existingFailedTokensMap,
      };
    } else {
      fields = {
        isv_tokens: isvTokens,
        isv_tokenUpdated: !isError,
        isv_failedTokens: existingFailedTokensMap,
      };
      returnResponse = {
        actions: [
          {
            action: 'setCustomType',
            type: {
              key: 'isv_payments_customer_tokens',
              typeId: Constants.TYPE_ID_TYPE,
            },
            fields: fields,
          },
        ],
        errors: [],
      };
    }
    returnResponse = {
      actions: [
        {
          action: 'setCustomType',
          type: {
            key: 'isv_payments_customer_tokens',
            typeId: Constants.TYPE_ID_TYPE,
          },
          fields: {
            isv_tokens: isvTokens,
            isv_tokenUpdated: !isError,
            isv_failedTokens: existingFailedTokensMap,
          },
        },
      ],
      errors: [],
    };
  }
  if (null !== address && undefined !== address) {
    returnResponse.actions.push({
      action: 'addAddress',
      address: {
        firstName: address.firstName,
        lastName: address.lastName,
        country: address.country,
        streetName: address.address1,
        streetNumber: address.buildingNumber,
        postalCode: address.postalCode,
        city: address.locality,
        region: address.administrativeArea,
        email: address.email,
      },
    });
  }
  return returnResponse;
};

const getAuthResponse = (paymentResponse: any, transactionDetail: paymentTransactionType | null) => {
  let response: actionResponseType = paymentUtils.getEmptyResponse();
  let setCustomField: actionType;
  try {
    if (paymentResponse) {
      if (
        Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse?.httpCode &&
        transactionDetail &&
        (Constants.API_STATUS_AUTHORIZED === paymentResponse?.status || Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse?.status || Constants.API_STATUS_PENDING === paymentResponse?.status)
      ) {
        const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);
        setCustomField =
          Constants.CT_TRANSACTION_TYPE_CHARGE === transactionDetail.type && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status
            ? paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE)
            : paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_SUCCESS);
        response = createResponse(setTransaction, setCustomField, null, null);
      } else if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse?.httpCode && (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === paymentResponse?.status || Constants.API_STATUS_PENDING_REVIEW === paymentResponse?.status) && transactionDetail) {
        const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);
        setCustomField = paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_PENDING);
        response = createResponse(setTransaction, setCustomField, null, null);
      } else if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse?.httpCode && Constants.API_STATUS_COMPLETED === paymentResponse?.status) {
        const isv_requestJwt = paymentResponse.accessToken;
        const isv_cardinalReferenceId = paymentResponse.referenceId;
        const isv_deviceDataCollectionUrl = paymentResponse.deviceDataCollectionUrl;
        const actions = paymentUtils.setCustomFieldMapper({
          isv_requestJwt,
          isv_cardinalReferenceId,
          isv_deviceDataCollectionUrl,
        } as paymentCustomFieldsType);
        response = {
          actions: actions,
          errors: [],
        };
      } else if (
        Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse?.httpCode &&
        Constants.API_STATUS_PENDING_AUTHENTICATION === paymentResponse?.status &&
        paymentResponse?.data &&
        0 < Object.keys(paymentResponse?.data).length &&
        paymentResponse?.data?.consumerAuthenticationInformation &&
        0 < Object.keys(paymentResponse?.data?.consumerAuthenticationInformation).length
      ) {
        const payerAuthenticationData = {
          isv_payerAuthenticationPaReq: paymentResponse.data.consumerAuthenticationInformation?.pareq,
          isv_payerAuthenticationTransactionId: paymentResponse.data.consumerAuthenticationInformation?.authenticationTransactionId,
          stepUpUrl: paymentResponse.data.consumerAuthenticationInformation?.stepUpUrl,
          isv_responseJwt: paymentResponse.data.consumerAuthenticationInformation?.accessToken,
          isv_payerAuthenticationRequired: true,
          xid: paymentResponse.data.consumerAuthenticationInformation?.xid,
          pareq: paymentResponse.data.consumerAuthenticationInformation?.pareq,
          cardinalId: paymentResponse.cardinalReferenceId,
          proofXml: paymentResponse.data.consumerAuthenticationInformation?.proofXml,
          veresEnrolled: paymentResponse.data.consumerAuthenticationInformation?.veresEnrolled,
          specificationVersion: paymentResponse.data.consumerAuthenticationInformation.specificationVersion,
          acsurl: paymentResponse.data.consumerAuthenticationInformation?.acsUrl,
          authenticationTransactionId: paymentResponse.data.consumerAuthenticationInformation?.authenticationTransactionId,
          directoryServerTransactionId: paymentResponse.data.consumerAuthenticationInformation?.directoryServerTransactionId,
        };
        const actions = payerAuthActions(payerAuthenticationData);
        response = {
          actions: actions,
          errors: [],
        };
      } else {
        if (null === transactionDetail) {
          response = paymentUtils.getEmptyResponse();
        } else {
          const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);
          setCustomField = paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE);
          const paymentFailure = paymentUtils.failureResponse(paymentResponse, transactionDetail);
          response = createResponse(setTransaction, setCustomField, paymentFailure, null);
        }
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetAuthResponse', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetAuthResponse', '', exception, '', '', '');
  }
  return response;
};

const createResponse = (setTransaction: actionType, setCustomField: actionType, paymentFailure: actionType | null, setCustomType: actionType | null) => {
  const actions: actionType[] = [];
  let returnResponse: actionResponseType = paymentUtils.getEmptyResponse();
  try {
    if (setTransaction && setCustomField) {
      actions.push(setTransaction);
      actions.push(setCustomField);
    }
    if (paymentFailure) {
      actions.push(paymentFailure);
    }
    if (setCustomType) {
      actions.push(setCustomType);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncCreateResponse', '', exception, '', '', '');
  }
  returnResponse = {
    actions: actions,
    errors: [],
  };
  return returnResponse;
};

const getOMServiceResponse = (paymentResponse: any, transactionDetail: paymentTransactionType, captureId: string, pendingAmount: number) => {
  let setCustomField: actionType;
  let paymentFailure: actionType | null = null;
  let setCustomType: actionType | null = null;
  let response: actionResponseType = paymentUtils.getEmptyResponse();
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
      response = createResponse(setTransaction, setCustomField, paymentFailure, setCustomType);
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetOMServiceResponse', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetOMServiceResponse', '', exception, '', '', '');
  }
  return response;
};

const getCapturedAmount = (refundPaymentObj: paymentType) => {
  let refundTransaction: readonly paymentTransactionType[];
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
          if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state) {
            capturedAmount = capturedAmount + Number(transaction?.amount?.centAmount);
          }
          if (Constants.CT_TRANSACTION_TYPE_REFUND === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state) {
            refundedAmount = refundedAmount + Number(transaction?.amount?.centAmount);
          }
        }
        pendingCaptureAmount = capturedAmount - refundedAmount;
        pendingCaptureAmount = paymentUtils.convertCentToAmount(pendingCaptureAmount, fractionDigits);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetCapturedAmount', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetCapturedAmount', '', exception, '', '', '');
  }
  return pendingCaptureAmount;
};

const getAuthorizedAmount = (capturePaymentObj: paymentType) => {
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
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetAuthorizedAmount', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_OPERATION);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetAuthorizedAmount', '', exception, '', '', '');
  }
  return pendingAuthorizedAmount;
};

const addRefundAction = (amount: amountPlannedType, orderResponse: any, state: string) => {
  let refundAction: addTransactionType | null = null;
  try {
    if (amount && orderResponse) {
      refundAction = {
        action: 'addTransaction',
        transaction: {
          type: Constants.CT_TRANSACTION_TYPE_REFUND,
          timestamp: new Date(Date.now()).toISOString(),
          amount: amount,
          state: state,
          interactionId: orderResponse.transactionId,
        },
      };
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddRefundAction', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAddRefundAction', '', exception, '', '', '');
  }
  return refundAction;
};

const setTransactionCustomType = (transactionId: string, pendingAmount: number) => {
  let returnResponse: actionType | null = null;
  try {
    if (transactionId && typeof pendingAmount === 'number') {
      returnResponse = {
        action: 'setTransactionCustomType',
        type: {
          key: 'isv_transaction_data',
          typeId: Constants.TYPE_ID_TYPE,
        },
        fields: {
          isv_availableCaptureAmount: pendingAmount,
        },
        transactionId: transactionId,
      };
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSetTransactionCustomType', Constants.LOG_INFO, '', Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncSetTransactionCustomType', '', exception, '', '', '');
  }
  return returnResponse;
};

const getCreditCardResponse = async (updatePaymentObj: paymentType, customerInfo: customerType | null, cartObj: any, updateTransactions: paymentTransactionType, cardTokens: customTokenType, orderNo: string) => {
  let authResponse: actionResponseType = paymentUtils.getEmptyResponse();
  let notSaveToken = false;
  const payerAuthMandateFlag = false;
  let isError = false;
  let paymentResponse;
  try {
    const tokenCreateResponse = await tokenCreateFlag(customerInfo, updatePaymentObj, 'FuncGetCreditCardResponse');
    if (!tokenCreateResponse.isError) {
      notSaveToken = tokenCreateResponse.notSaveToken;
      if (updatePaymentObj?.custom?.fields?.isv_transientToken && (Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE || Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING)) {
        cartObj = await updateCartWithUCAddress(updatePaymentObj, cartObj);
      }
      paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, Constants.STRING_CARD, cardTokens, notSaveToken, payerAuthMandateFlag, orderNo);
      if (paymentResponse && updatePaymentObj && paymentResponse && paymentResponse?.httpCode) {
        authResponse = getAuthResponse(paymentResponse, updateTransactions);
        if (authResponse && authResponse?.actions?.length) {
          if (Constants.APPLE_PAY === updatePaymentObj.paymentMethodInfo.method) {
            const cardDetails = await getTransaction.getTransactionData(paymentResponse, updatePaymentObj);
            if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode && cardDetails && Constants.HTTP_OK_STATUS_CODE === cardDetails.httpCode && cardDetails?.cardFieldGroup) {
              const actions = cardDetailsActions(cardDetails);
              if (actions && actions?.length) {
                actions.forEach((i) => {
                  authResponse.actions.push(i);
                });
              }
            }
            if (updatePaymentObj?.custom?.fields?.isv_applePaySessionData) {
              authResponse.actions.push({
                action: Constants.SET_CUSTOM_FIELD,
                name: 'isv_applePaySessionData',
                value: null,
              });
            }
          }
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetCreditCardResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
          isError = true;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetCreditCardResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
        isError = true;
      }
    } else {
      isError = true;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetCreditCardResponse', Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, updatePaymentObj.id, 'PaymentId : ', '');
    isError = true;
  }
  return { isError, paymentResponse, authResponse };
};

const tokenCreateFlag = async (customerInfo: customerType | null, paymentObj: paymentType | null, functionName: string) => {
  let cardRate = 0;
  let cardRateCount = 0;
  const tokenCreateObj = {
    notSaveToken: false,
    isError: false,
  };
  try {
    if ('FuncAddCardHandler' === functionName || (('FuncGetCreditCardResponse' === functionName || 'FuncGetPayerAuthEnrollResponse' === functionName || 'FuncGetPayerAuthValidateResponse' === functionName) && paymentObj?.custom?.fields?.isv_tokenAlias)) {
      if (customerInfo && Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER) {
        if (
          Number.isInteger(Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME)) &&
          0 < Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME) &&
          Number.isInteger(Number(process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE)) &&
          0 < Number(process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE)
        ) {
          cardRate = Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME);
          cardRateCount = Number(process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE);
        } else {
          tokenCreateObj.isError = true;
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncTokenCreateFlag', Constants.LOG_ERROR, 'CustomerId : ' + customerInfo.id, Constants.ERROR_MSG_INVALID_RATE_LIMITER_CONFIGURATIONS);
        }
        if (!tokenCreateObj.isError) {
          const startTime = new Date();
          startTime.setHours(startTime.getHours() - cardRate);
          const limiterResponse = await rateLimiterAddToken(customerInfo, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
          if (limiterResponse && cardRateCount <= limiterResponse) {
            tokenCreateObj.notSaveToken = true;
          }
        }
      }
    }
  } catch (exception) {
    let customerId = '';
    if (customerInfo?.id) {
      customerId = customerInfo.id;
    }
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncTokenCreateFlag', '', exception, customerId, 'CustomerId', '');
  }
  return tokenCreateObj;
};

const getPayerAuthSetUpResponse = async (updatePaymentObj: paymentType) => {
  let setUpActionResponse: actionResponseType = paymentUtils.getEmptyResponse();
  let cardTokens: customTokenType = {
    customerTokenId: '',
    paymentInstrumentId: '',
  };
  let paymentInstrumentToken = '';
  let customFields: paymentCustomFieldsType;
  let isError = false;
  try {
    if (updatePaymentObj?.custom?.fields) {
      customFields = updatePaymentObj.custom.fields;
      if (customFields?.isv_token || customFields?.isv_savedToken || customFields?.isv_transientToken) {
        if (updatePaymentObj?.customer?.id) {
          const customerInfo = await commercetoolsApi.getCustomer(updatePaymentObj?.customer?.id);
          if (customFields?.isv_savedToken) {
            paymentInstrumentToken = customFields.isv_savedToken;
          }
          cardTokens = await getCardTokens(customerInfo, paymentInstrumentToken);
        }
        if ((Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE || Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING) && customFields?.isv_transientToken) {
          const cartObj = await paymentUtils.getCartObject(updatePaymentObj);
          if (cartObj && cartObj.count) {
            await updateCartWithUCAddress(updatePaymentObj, cartObj.results[0]);
          }
        }
        const setUpServiceResponse = await paymentAuthSetUp.payerAuthSetupResponse(updatePaymentObj, cardTokens.customerTokenId);
        if (setUpServiceResponse && setUpServiceResponse.httpCode) {
          setUpActionResponse = getAuthResponse(setUpServiceResponse, null);
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetPayerAuthSetUpResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
          isError = true;
        }
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetPayerAuthSetUpResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
      isError = true;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetPayerAuthSetUpResponse', Constants.EXCEPTION_MSG_PAYER_AUTH, exception, updatePaymentObj.id, 'PaymentId : ', '');
    isError = true;
  }
  if (isError) {
    setUpActionResponse = paymentUtils.invalidInputResponse();
  }
  return setUpActionResponse;
};

const processPayerAuthEnrollTokens = async (updatePaymentObj: paymentType, tokenCreateResponse: tokenCreateFlagType, customFields: paymentCustomFieldsType, cardinalReferenceId: string, cartObj: any, cardTokens: customTokenType, orderNo: string) => {
  let enrollResponse: actionResponseType = paymentUtils.invalidInputResponse();
  let notSaveToken = false;
  let payerAuthMandateFlag = false;
  notSaveToken = tokenCreateResponse.notSaveToken;
  if (Constants.HTTP_SUCCESS_STATUS_CODE === customFields?.isv_payerEnrollHttpCode && Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED === customFields?.isv_payerEnrollStatus) {
    payerAuthMandateFlag = true;
  }
  const enrollServiceResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj.results[0], Constants.STRING_ENROLL_CHECK, cardTokens, notSaveToken, payerAuthMandateFlag, orderNo);
  enrollServiceResponse.cardinalReferenceId = cardinalReferenceId;
  enrollResponse = payerEnrollActions(enrollServiceResponse, updatePaymentObj);
  const enrollAuthResponse = getAuthResponse(enrollServiceResponse, null);
  if (enrollAuthResponse && enrollAuthResponse.actions.length) {
    enrollAuthResponse.actions.forEach((i) => {
      enrollResponse.actions.push(i);
    });
  }
  enrollResponse = await setCustomerTokenData(cardTokens, enrollServiceResponse, enrollResponse, false, updatePaymentObj, cartObj.results[0]);
  return enrollResponse;
};

const getPayerAuthEnrollResponse = async (updatePaymentObj: paymentType) => {
  let enrollResponse: actionResponseType = paymentUtils.invalidInputResponse();
  let orderNo = null;
  let cardTokens: customTokenType = { customerTokenId: '', paymentInstrumentId: '' };
  let customFields: paymentCustomFieldsType;
  let customerInfo: customerType | null = null;
  let paymentInstrumentToken = '';
  let isError = false;
  try {
    if (updatePaymentObj?.custom?.fields) {
      customFields = updatePaymentObj.custom.fields;
      if (customFields?.isv_cardinalReferenceId && (customFields?.isv_token || customFields?.isv_savedToken || customFields?.isv_transientToken)) {
        const cardinalReferenceId = customFields.isv_cardinalReferenceId;
        const cartObj = await paymentUtils.getCartObject(updatePaymentObj);
        if (cartObj && cartObj?.count) {
          if (updatePaymentObj.customer?.id) {
            if (customFields?.isv_savedToken) {
              paymentInstrumentToken = customFields.isv_savedToken;
            }
            if (updatePaymentObj.customer.id) {
              customerInfo = await commercetoolsApi.getCustomer(updatePaymentObj.customer.id);
              cardTokens = await getCardTokens(customerInfo, paymentInstrumentToken);
            }
          }
          const cartId = cartObj?.results[0]?.id;
          orderNo = await paymentUtils.getOrderId(cartId, updatePaymentObj?.id);
          const tokenCreateResponse = await tokenCreateFlag(customerInfo, updatePaymentObj, 'FuncGetPayerAuthEnrollResponse');
          enrollResponse = !tokenCreateResponse.isError ? await processPayerAuthEnrollTokens(updatePaymentObj, tokenCreateResponse, customFields, cardinalReferenceId, cartObj, cardTokens, orderNo) : paymentUtils.getEmptyResponse();
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetPayerAuthEnrollResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_EMPTY_CART);
          isError = true;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetPayerAuthEnrollResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
        isError = true;
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetPayerAuthEnrollResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
      isError = true;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetPayerAuthEnrollResponse', Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, updatePaymentObj.id, 'PaymentId : ', '');
    isError = true;
  }
  if (isError) {
    enrollResponse = paymentUtils.invalidInputResponse();
  }
  return enrollResponse;
};

const getPayerAuthValidateResponse = async (updatePaymentObj: paymentType) => {
  let authResponse: actionResponseType = paymentUtils.getEmptyResponse();
  let cardTokens: customTokenType = { customerTokenId: '', paymentInstrumentId: '' };
  let customerInfo: customerType | null = null;
  let notSaveToken = false;
  let paymentInstrumentToken = '';
  let isError = false;
  let tokenCreateResponse = {
    notSaveToken: false,
    isError: false,
  };
  try {
    if (updatePaymentObj && updatePaymentObj?.custom && (updatePaymentObj.custom?.fields?.isv_token || updatePaymentObj.custom?.fields?.isv_savedToken || updatePaymentObj.custom?.fields?.isv_transientToken)) {
      const cartObj = await paymentUtils.getCartObject(updatePaymentObj);
      if (cartObj && 0 < cartObj?.count) {
        if (updatePaymentObj.customer?.id) {
          if (updatePaymentObj.custom?.fields?.isv_savedToken) {
            paymentInstrumentToken = updatePaymentObj.custom.fields.isv_savedToken;
          }
          if (updatePaymentObj.customer.id) {
            customerInfo = await commercetoolsApi.getCustomer(updatePaymentObj.customer.id);
            cardTokens = await getCardTokens(customerInfo, paymentInstrumentToken);
          }
        }
        const cartId = cartObj?.results[0]?.id;
        const orderNo = await paymentUtils.getOrderId(cartId, updatePaymentObj?.id);
        tokenCreateResponse = await tokenCreateFlag(customerInfo, updatePaymentObj, 'FuncGetPayerAuthValidateResponse');
        if (!tokenCreateResponse.isError) {
          notSaveToken = tokenCreateResponse.notSaveToken;
          const paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj.results[0], Constants.VALIDATION, cardTokens, notSaveToken, false, orderNo);
          if (paymentResponse && paymentResponse.httpCode) {
            authResponse = payerEnrollActions(paymentResponse, updatePaymentObj);
            if (authResponse) {
              if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse?.httpCode && !paymentResponse?.data?.errorInformation && paymentResponse?.data?.consumerAuthenticationInformation) {
                authResponse = await payerAuthValidateActions(authResponse, paymentResponse);
              }
              if (
                Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse?.httpCode &&
                paymentResponse?.data?.errorInformation &&
                0 < paymentResponse?.data?.errorInformation.length &&
                Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED === paymentResponse.data.errorInformation?.reason
              ) {
                const isv_payerEnrollStatus = paymentResponse.data.errorInformation.reason;
                const isv_payerEnrollHttpCode = paymentResponse.httpCode;
                authResponse.actions.push(
                  ...paymentUtils.setCustomFieldMapper({
                    isv_payerEnrollStatus,
                    isv_payerEnrollHttpCode,
                  })
                );
              }
            } else {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetPayerAuthValidateResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
              isError = true;
            }
          } else {
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetPayerAuthValidateResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
            isError = true;
          }
          authResponse = await setCustomerTokenData(cardTokens, paymentResponse, authResponse, false, updatePaymentObj, cartObj.results[0]);
        } else {
          isError = true;
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetPayerAuthValidateResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
        isError = true;
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetPayerAuthValidateResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
      authResponse = paymentUtils.getEmptyResponse();
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetPayerAuthValidateResponse', Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, updatePaymentObj.id, 'PaymentId : ', '');
    isError = true;
  }
  if (isError) {
    authResponse = paymentUtils.invalidInputResponse();
  }
  return authResponse;
};

const getClickToPayResponse = async (updatePaymentObj: paymentType, cartObj: any, updateTransactions: paymentTransactionType, customerTokenId: customTokenType, orderNo: string) => {
  let authResponse: actionResponseType = paymentUtils.getEmptyResponse();
  let actions: readonly actionType[] = [];
  let isError = false;
  let paymentResponse;
  try {
    paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, 'visa', customerTokenId, false, false, orderNo);
    if (paymentResponse && paymentResponse.httpCode) {
      authResponse = getAuthResponse(paymentResponse, updateTransactions);
      if (authResponse) {
        const visaCheckoutData = await getTransaction.getTransactionData(paymentResponse, updatePaymentObj);
        if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode && Constants.HTTP_OK_STATUS_CODE === visaCheckoutData.httpCode && visaCheckoutData?.cardFieldGroup && 0 < visaCheckoutData.cardFieldGroup.length) {
          actions = cardDetailsActions(visaCheckoutData);
          if (actions && 0 < actions?.length) {
            actions.forEach((i) => {
              authResponse.actions.push(i);
            });
          }
          const cartUpdate = await commercetoolsApi.updateCartByPaymentId(cartObj.id, updatePaymentObj.id, cartObj.version, visaCheckoutData);
          cartUpdate
            ? paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetClickToPayResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.SUCCESS_MSG_UPDATE_CLICK_TO_PAY_CARD_DETAILS)
            : paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetClickToPayResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_UPDATE_CART);
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetClickToPayResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_UPDATE_CLICK_TO_PAY_DATA);
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetClickToPayResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
        isError = true;
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetClickToPayResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
      isError = true;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetClickToPayResponse', Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, updatePaymentObj.id, 'PaymentId : ', '');
    isError = true;
  }
  return { isError, paymentResponse, authResponse };
};

const getGooglePayResponse = async (updatePaymentObj: paymentType, cartObj: any, updateTransactions: paymentTransactionType, customerTokens: customTokenType, orderNo: string) => {
  let authResponse: actionResponseType = paymentUtils.getEmptyResponse();
  let paymentResponse;
  let actions: readonly actionType[] = [];
  const payerAuthMandateFlag = false;
  let isError = false;
  const cardDetails: pgAddressGroupType = {
    cardFieldGroup: {
      prefix: '',
      suffix: '',
      expirationMonth: '',
      expirationYear: '',
      type: '',
    },
  };
  try {
    if (updatePaymentObj?.custom?.fields?.isv_transientToken && (Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE || Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING)) {
      cartObj = await updateCartWithUCAddress(updatePaymentObj, cartObj);
    }
    paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, 'googlePay', customerTokens, false, payerAuthMandateFlag, orderNo);
    if (paymentResponse && paymentResponse?.httpCode && paymentResponse?.httpCode) {
      authResponse = getAuthResponse(paymentResponse, updateTransactions);
      if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
        if (paymentResponse?.data?.paymentInformation?.tokenizedCard && paymentResponse.data.paymentInformation.tokenizedCard?.expirationMonth) {
          cardDetails.cardFieldGroup = paymentResponse.data.paymentInformation.tokenizedCard;
        } else if (paymentResponse?.data?.paymentInformation?.card && paymentResponse.data.paymentInformation.card?.expirationMonth) {
          cardDetails.cardFieldGroup = paymentResponse.data.paymentInformation.card;
        }
        if (cardDetails?.cardFieldGroup) {
          actions = cardDetailsActions(cardDetails);
          if (actions && 0 < actions?.length) {
            actions.forEach((i) => {
              authResponse.actions.push(i);
            });
          }
        }
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncgetGooglePayResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
      isError = true;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncgetGooglePayResponse', Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, updatePaymentObj.id, 'PaymentId : ', '');
    isError = true;
  }
  return { isError, paymentResponse, authResponse };
};

const getTransactionSummaries = async (updatePaymentObj: paymentType, retryCount: number) => {
  let transactionSummaryObject: any;
  let errorData: string;
  try {
    const query = Constants.PAYMENT_GATEWAY_CLIENT_REFERENCE_CODE + updatePaymentObj.id + Constants.STRING_AND + Constants.STRING_SYNC_QUERY;
    const midId = updatePaymentObj?.custom?.fields?.isv_merchantId ? updatePaymentObj.custom.fields.isv_merchantId : '';
    const authMid = await multiMid.getMidCredentials(midId);
    return await new Promise(function (resolve, reject) {
      setTimeout(async () => {
        const transactionDetail = await createSearchRequest.getTransactionSearchResponse(query, Constants.STRING_SYNC_SORT, authMid);
        if (
          transactionDetail &&
          Constants.HTTP_SUCCESS_STATUS_CODE === transactionDetail.httpCode &&
          transactionDetail?.data?._embedded?.transactionSummaries &&
          ((Constants.CC_PAYER_AUTHENTICATION === updatePaymentObj.paymentMethodInfo.method && 2 <= transactionDetail?.data?.totalCount && 3 === retryCount) ||
            (1 === transactionDetail?.data?.totalCount && updatePaymentObj?.custom?.fields?.isv_saleEnabled) ||
            (1 < transactionDetail?.data?.totalCount && Constants.CC_PAYER_AUTHENTICATION !== updatePaymentObj.paymentMethodInfo.method))
        ) {
          transactionSummaryObject = {
            summaries: transactionDetail?.data?._embedded?.transactionSummaries,
            historyPresent: true,
          };
          resolve(transactionSummaryObject);
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetTransactionSummaries', Constants.LOG_ERROR, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_RETRY_TRANSACTION_SEARCH);
          reject(transactionSummaryObject);
        }
      }, 1500);
    }).catch((error) => {
      errorData = typeof error === 'object' ? (errorData = JSON.stringify(error)) : error;
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetTransactionSummaries', Constants.LOG_ERROR, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_RETRY_TRANSACTION_SEARCH + errorData);
      return transactionSummaryObject;
    });
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetTransactionSummaries', Constants.EXCEPTION_MSG_TRANSACTION_SEARCH, exception, updatePaymentObj.id, 'PaymentId : ', '');
  }
  return transactionSummaryObject;
};

const handleAuthApplication = async (updatePaymentObj: paymentType, application: applicationsType, updateActions: actionResponseType, element: any) => {
  const authAction = {
    action: 'addTransaction',
    transaction: {},
  };
  let transactionState = Constants.CT_TRANSACTION_STATE_FAILURE;
  if (Constants.CYBS_SUCCESS_REASON_CODE === application?.reasonCode) {
    transactionState = Constants.CT_TRANSACTION_STATE_SUCCESS;
  }
  authAction.transaction = paymentUtils.createTransactionObject(undefined, updatePaymentObj.amountPlanned, Constants.CT_TRANSACTION_TYPE_AUTHORIZATION, transactionState, element.id, new Date(Date.now()).toISOString());
  updateActions.actions.push(authAction);
  return updateActions;
};

const handleAuthReversalResponse = async (updatePaymentObj: paymentType, cartObj: any, paymentResponse: any, updateActions: actionResponseType) => {
  const reversalAction = {
    action: 'addTransaction',
    transaction: {
      type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
      timestamp: new Date(Date.now()).toISOString(),
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
  const authReversalResponse = await paymentAuthReversal.authReversalResponse(updatePaymentObj, cartObj, paymentResponse.transactionId);
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

const checkAuthReversalTriggered = async (updatePaymentObj: paymentType, cartObj: any, paymentResponse: any, updateActions: actionResponseType) => {
  let transactionSummaries;
  let transactionDetail;
  let authReversalTriggered = false;
  let applications: applicationsType[];
  let returnAction = {
    action: 'addTransaction',
    transaction: {
      type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
      timestamp: new Date(Date.now()).toISOString(),
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
  try {
    for (let i = 0; i < 3; i++) {
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
            updateActions = await handleAuthApplication(updatePaymentObj, application, updateActions, element);
          }
          if (Constants.STRING_SYNC_AUTH_REVERSAL_NAME === application.name) {
            if (Constants.APPLICATION_RCODE === application.rCode && Constants.APPLICATION_RFLAG === application.rFlag) {
              authReversalTriggered = true;
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
    if (!authReversalTriggered) {
      updateActions = await handleAuthReversalResponse(updatePaymentObj, cartObj, paymentResponse, updateActions);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncCheckAuthReversalTriggered', Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, updatePaymentObj.id, 'PaymentId : ', '');
  }
  return updateActions;
};

const getRefundResponse = async (updatePaymentObj: paymentType, updateTransactions: paymentTransactionType, orderNo: string) => {
  let refundAmount: number;
  let refundActions: actionResponseType = paymentUtils.getEmptyResponse();
  let withEqualAmount = false;
  let refundResponseObject = {
    captureId: '',
    transactionId : '',
    pendingTransactionAmount : 0
  };
  let chargeAmount = 0;
  let iterateRefundAmount = 0;
  let pendingTransactionAmount = 0;
  let transactionState = Constants.CT_TRANSACTION_STATE_FAILURE;
  let refundAction;
  let amountToBeRefunded = 0;
  let setAction: actionType | null = null;
  let iterateRefund = 0;
  try {
    if (updatePaymentObj && updateTransactions && updateTransactions?.amount && undefined !== updateTransactions?.amount?.fractionDigits && 0 <= updateTransactions.amount.fractionDigits  && updateTransactions.amount?.type) {
      const paymentId = updatePaymentObj.id;
      refundAmount = updateTransactions?.amount?.centAmount;
      iterateRefundAmount = refundAmount;
      if (0 < refundAmount) {
        for (let transaction of updatePaymentObj.transactions) {
          if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.amount && transaction?.interactionId && transaction?.id) {
            if (refundAmount === transaction.amount.centAmount && !(Constants.STRING_CUSTOM in transaction)) {
              withEqualAmount = true;
              refundResponseObject = await paymentUtils.getRefundResponseObject(transaction, transaction.amount.centAmount - refundAmount);
              break;
            } else if (transaction?.custom?.fields?.isv_availableCaptureAmount && transaction.custom.fields.isv_availableCaptureAmount && refundAmount === transaction.custom.fields.isv_availableCaptureAmount) {
              withEqualAmount = true;
              refundResponseObject = await paymentUtils.getRefundResponseObject(transaction, transaction.custom.fields.isv_availableCaptureAmount - refundAmount);
              break;
            }
          }
        }
        if (!withEqualAmount) {
          for (let transaction of updatePaymentObj.transactions) {
            let amount = {
              type: '',
              currencyCode: '',
              centAmount: 0,
              fractionDigits: 0,
            };
            refundResponseObject.captureId = '';
            if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.amount && transaction?.interactionId && transaction?.id) {
              chargeAmount = transaction.amount.centAmount;
              if (0 !== iterateRefundAmount) {
                if (transaction?.custom && 0 !== transaction?.custom?.fields?.isv_availableCaptureAmount) {
                  chargeAmount = transaction.custom.fields.isv_availableCaptureAmount;
                }
                if (iterateRefundAmount === chargeAmount && 0 !== transaction?.custom?.fields?.isv_availableCaptureAmount) {
                  updateTransactions.amount.centAmount = chargeAmount;
                  refundResponseObject = await paymentUtils.getRefundResponseObject(transaction, chargeAmount);
                  amountToBeRefunded = chargeAmount;
                  iterateRefundAmount -= iterateRefundAmount;
                  iterateRefund++;
                } else if (iterateRefundAmount > chargeAmount && 0 !== transaction?.custom?.fields?.isv_availableCaptureAmount) {
                  updateTransactions.amount.centAmount = chargeAmount;
                  refundResponseObject = await paymentUtils.getRefundResponseObject(transaction, chargeAmount);
                  amountToBeRefunded = chargeAmount;
                  iterateRefundAmount -= chargeAmount;
                  iterateRefund++;
                } else if (iterateRefundAmount < chargeAmount && 0 !== transaction?.custom?.fields?.isv_availableCaptureAmount) {
                  updateTransactions.amount.centAmount = iterateRefundAmount;
                  refundResponseObject = await paymentUtils.getRefundResponseObject(transaction, iterateRefundAmount);
                  pendingTransactionAmount = chargeAmount - iterateRefundAmount;
                  amountToBeRefunded = iterateRefundAmount;
                  iterateRefundAmount -= iterateRefundAmount;
                  iterateRefund++;
                }
                if (refundResponseObject?.captureId) {
                  const orderResponse = await paymentRefund.refundResponse(updatePaymentObj, refundResponseObject.captureId, updateTransactions, orderNo);
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
                      amount.type = updateTransactions.amount?.type;
                      amount.currencyCode = updateTransactions.amount?.currencyCode;
                      amount.fractionDigits = updateTransactions.amount?.fractionDigits;
                      amount.centAmount = amountToBeRefunded;
                      refundAction = addRefundAction(amount, orderResponse, transactionState);
                      if (refundAction) {
                        refundActions.actions.push(refundAction);
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          if (withEqualAmount && refundResponseObject?.captureId) {
            const orderResponse = await paymentRefund.refundResponse(updatePaymentObj, refundResponseObject.captureId, updateTransactions, orderNo);
            if (orderResponse && orderResponse.httpCode) {
              refundActions = getOMServiceResponse(orderResponse, updateTransactions, refundResponseObject.transactionId, pendingTransactionAmount);
            }
          }
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetRefundResponse', Constants.LOG_INFO, 'PaymentId : ' + paymentId, Constants.ERROR_MSG_SERVICE_PROCESS);
      }
    } else {
      if (updatePaymentObj?.id) {
        const paymentId = updatePaymentObj.id;
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetRefundResponse', Constants.LOG_INFO, 'PaymentId : ' + paymentId, Constants.ERROR_MSG_SERVICE_PROCESS);
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetRefundResponse', Constants.LOG_INFO, '', Constants.ERROR_MSG_SERVICE_PROCESS);
      }
    }
  } catch (exception) {
    updatePaymentObj?.id
      ? paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetRefundResponse', Constants.EXCEPTION_MSG_SERVICE_PROCESS, exception, updatePaymentObj.id, 'PaymentId : ', '')
      : paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetRefundResponse', Constants.EXCEPTION_MSG_SERVICE_PROCESS, exception, '', '', '');
  }
  return refundActions;
};

const getCardTokens = async (customerInfo: customerType | null, isvSavedToken: string) => {
  let currentIndex = 0;
  const cardTokens: customTokenType = {
    customerTokenId: '',
    paymentInstrumentId: '',
  };
  if (customerInfo && customerInfo?.custom?.fields?.isv_tokens && 0 < customerInfo?.custom?.fields?.isv_tokens?.length) {
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

const setCustomerTokenData = async (cardTokens: customTokenType, paymentResponse: any, authResponse: actionResponseType, isError: boolean, updatePaymentObj: paymentType, cartObj: any) => {
  let customerTokenResponse: customerType | null = null;
  let customerInfo: customerType | null = null;
  let customerTokenId = '';
  let addressId = ''; 
  const paymentMethod = updatePaymentObj?.paymentMethodInfo.method;
  if (cartObj && cartObj?.billingAddress?.id) {
    addressId = cartObj.billingAddress.id;
  }
  if ('' === addressId && updatePaymentObj?.customer?.id) {
    if (updatePaymentObj.custom?.fields?.isv_token) {
      const customerId = updatePaymentObj.customer.id;
      customerInfo = await commercetoolsApi.getCustomer(customerId);
    } else if (cartObj && updatePaymentObj.custom?.fields?.isv_transientToken) {
      customerInfo = await addTokenAddressForUC(updatePaymentObj, cartObj);
    }
    if (customerInfo && customerInfo?.addresses && 0 < customerInfo.addresses?.length) {
      addressId = customerInfo.addresses[customerInfo.addresses.length - 1].id as string;
    } 
  }
  if (
    !isError &&
    updatePaymentObj?.customer?.id &&
    Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode &&
    Constants.API_STATUS_AUTHORIZED === paymentResponse.status &&
    (Constants.CREDIT_CARD === paymentMethod || Constants.CC_PAYER_AUTHENTICATION === paymentMethod) &&
    (undefined === updatePaymentObj?.custom?.fields?.isv_savedToken || null === updatePaymentObj.custom?.fields?.isv_savedToken || '' === updatePaymentObj?.custom?.fields?.isv_savedToken) &&
    updatePaymentObj?.custom?.fields?.isv_tokenAlias
  ) {
    if (paymentResponse?.data?.tokenInformation?.paymentInstrument && paymentResponse.data.tokenInformation.paymentInstrument?.id) {
      const tokenInfo = paymentResponse.data.tokenInformation;
      const isv_savedToken = paymentResponse.data.tokenInformation.paymentInstrument.id;
      authResponse.actions.push(...paymentUtils.setCustomFieldMapper({ isv_savedToken }));
      if (cardTokens && '' === cardTokens?.customerTokenId && tokenInfo?.customer && tokenInfo.customer?.id) {
        customerTokenId = tokenInfo.customer.id;
      } else if (cardTokens?.customerTokenId) {
        customerTokenId = cardTokens.customerTokenId;
      }
      const paymentInstrumentId = tokenInfo.paymentInstrument.id;
      const instrumentIdentifier = tokenInfo.instrumentIdentifier.id;
      customerTokenResponse = await processTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId);
      customerTokenResponse
        ? paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSetCustomerTokenData', Constants.LOG_INFO, 'CustomerId : ' + updatePaymentObj.customer.id, Constants.SUCCESS_MSG_CARD_TOKENS_UPDATE)
        : paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSetCustomerTokenData', Constants.LOG_INFO, 'CustomerId : ' + updatePaymentObj.customer.id, Constants.ERROR_MSG_TOKEN_UPDATE);
    }
  } else {
    const customFields = updatePaymentObj?.custom?.fields;
    if (
      updatePaymentObj?.customer?.id &&
      customFields &&
      Constants.API_STATUS_PENDING_AUTHENTICATION !== paymentResponse.status &&
      Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED !== paymentResponse.status &&
      (Constants.CREDIT_CARD === paymentMethod || Constants.CC_PAYER_AUTHENTICATION === paymentMethod) &&
      (undefined === customFields?.isv_savedToken || null === customFields?.isv_savedToken || '' === customFields?.isv_savedToken) &&
      customFields?.isv_tokenAlias
    ) {
      customerTokenResponse = await setCustomerFailedTokenData(updatePaymentObj, customFields, addressId);
      customerTokenResponse
        ? paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSetCustomerTokenData', Constants.LOG_INFO, 'CustomerId : ' + updatePaymentObj.customer.id, Constants.SUCCESS_MSG_CARD_TOKENS_UPDATE)
        : paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSetCustomerTokenData', Constants.LOG_INFO, 'CustomerId : ' + updatePaymentObj.customer.id, Constants.ERROR_MSG_TOKEN_UPDATE);
    }
  }
  return authResponse;
};

const processTokens = async (customerTokenId: string, paymentInstrumentId: string, instrumentIdentifier: string, updatePaymentObj: paymentType, addressId: string) => {
  let existingTokens: string[];
  let parsedTokens: customerTokensType;
  let updateTokenResponse: customerType | null = null;
  let finalTokenIndex = -1;
  let existingCardFlag = false;
  const customerId = updatePaymentObj?.customer?.id;
  const customFields = updatePaymentObj?.custom?.fields;
  if (customerId) {
    const customerInfo = await commercetoolsApi.getCustomer(customerId);
    if (customerInfo) {
      const customTypePresent = customerInfo?.custom?.type?.id ? true : false;
      if (customerInfo?.custom?.fields?.isv_tokens && 0 < customerInfo.custom.fields.isv_tokens?.length) {
        existingTokens = customerInfo.custom.fields.isv_tokens;
        existingTokens.forEach((token, tokenIndex) => {
          const newToken = JSON.parse(token);
          if (newToken.cardNumber === updatePaymentObj?.custom?.fields.isv_maskedPan && newToken.value === customerTokenId && newToken.instrumentIdentifier === instrumentIdentifier) {
            finalTokenIndex = tokenIndex;
          }
        });
        if (-1 < finalTokenIndex && customFields?.isv_tokenAlias && customFields?.isv_cardExpiryMonth && customFields?.isv_cardExpiryYear) {
          existingCardFlag = true;
          parsedTokens = paymentUtils.updateParsedToken(existingTokens[finalTokenIndex], customFields, paymentInstrumentId, customerTokenId, addressId);
          if (0 < Object.keys(parsedTokens).length) {
            existingTokens[finalTokenIndex] = JSON.stringify(parsedTokens);
            if (customTypePresent) {
              updateTokenResponse = await commercetoolsApi.updateCustomerToken(existingTokens, customerInfo, customerInfo?.custom?.fields?.isv_failedTokens);
            } else {
              updateTokenResponse = await commercetoolsApi.setCustomType(customerId, existingTokens, customerInfo?.custom?.fields?.isv_failedTokens, customerTokenId);
            }
          }
        }
      }
    }
  }
  if (!existingCardFlag) {
    updateTokenResponse = await commercetoolsApi.setCustomerTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId);
  }
  return updateTokenResponse;
};

const rateLimiterAddToken = async (customerObj: customerType | null, startTime: string, endTime: string) => {
  let existingTokens: string[];
  let existingFailedTokens: string[];
  let count = 0;
  if (customerObj?.custom?.fields?.isv_failedTokens && 0 < customerObj.custom.fields.isv_failedTokens?.length) {
    existingFailedTokens = customerObj.custom.fields.isv_failedTokens;
    count += paymentUtils.tokenCountForInterval(existingFailedTokens, startTime, endTime);
  }
  if (customerObj?.custom?.fields?.isv_tokens && 0 < customerObj.custom.fields.isv_tokens?.length) {
    existingTokens = customerObj.custom.fields.isv_tokens;
    count += paymentUtils.tokenCountForInterval(existingTokens, startTime, endTime);
  }
  return count;
};

const getApplicationsPresent = async (applications: applicationsType) => {
  const applicationResponse = {
    authPresent: false,
    authReasonCodePresent: false,
    capturePresent: false,
    captureReasonCodePresent: false,
    authReversalPresent: false,
    refundPresent: false,
  };
  if (applications) {
    if (applications.some((item: applicationsType) => Constants.STRING_SYNC_AUTH_NAME === item.name) || applications.some((item: applicationsType) => Constants.STRING_SYNC_ECHECK_DEBIT_NAME === item.name)) {
      applicationResponse.authPresent = true;
    }
    if (applications.some((item: applicationsType) => Constants.STRING_SYNC_AUTH_NAME === item.name && item.reasonCode && Constants.CYBS_SUCCESS_REASON_CODE === item.reasonCode)) {
      applicationResponse.authReasonCodePresent = true;
    }
    if (applications.some((item: applicationsType) => Constants.STRING_SYNC_ECHECK_DEBIT_NAME === item.name && null === item.reasonCode)) {
      if (applications.some((nextItem: applicationsType) => Constants.STRING_SYNC_DECISION_NAME === nextItem.name && Constants.CYBS_ERROR_REASON_CODE === nextItem.reasonCode)) {
        applicationResponse.authReasonCodePresent = true;
      }
    }
    if (applications.some((item: applicationsType) => Constants.STRING_SYNC_CAPTURE_NAME === item.name)) {
      applicationResponse.capturePresent = true;
    }
    if (applications.some((item: applicationsType) => Constants.STRING_SYNC_CAPTURE_NAME === item.name && item.reasonCode && Constants.CYBS_SUCCESS_REASON_CODE === item.reasonCode)) {
      applicationResponse.captureReasonCodePresent = true;
    }
    if (applications.some((item: applicationsType) => Constants.STRING_SYNC_AUTH_REVERSAL_NAME === item.name)) {
      applicationResponse.authReversalPresent = true;
    }
    if (applications.some((item: applicationsType) => Constants.STRING_SYNC_REFUND_NAME === item.name || Constants.STRING_SYNC_ECHECK_CREDIT_NAME === item.name)) {
      applicationResponse.refundPresent = true;
    }
  } else {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetApplicationsPresent', Constants.LOG_INFO, '', Constants.ERROR_MSG_APPLICATION_DETAILS);
  }
  return applicationResponse;
};

const updateCardDetails = async (payment: paymentType, paymentVersion: number, transactionId: string) => {
  let actions: readonly actionType[] = [];
  let syncVisaCardDetailsResponse: paymentType | null = null;
  const visaObject = {
    transactionId: '',
  };
  const updateResponse = {
    cartVersion: null,
    paymentVersion: null,
  };
  if (payment && paymentVersion) {
    visaObject.transactionId = transactionId;
    const visaCheckoutData = await getTransaction.getTransactionData(visaObject, payment);
    if (visaCheckoutData) {
      const cartDetails = await getCartDetailsByPaymentId(payment.id);
      if (cartDetails && 'Active' === cartDetails.cartState && cartDetails?.id && cartDetails?.version) {
        const visaResponse = await commercetoolsApi.updateCartByPaymentId(cartDetails.id, payment.id, cartDetails.version, visaCheckoutData);
        if (visaResponse) {
          updateResponse.cartVersion = visaResponse.version;
          actions = cardDetailsActions(visaCheckoutData);
          if (actions && actions?.length) {
            const visaUpdateObject = {
              actions: actions,
              id: payment.id,
              version: paymentVersion,
            };
            syncVisaCardDetailsResponse = await commercetoolsApi.syncVisaCardDetails(visaUpdateObject as visaUpdateType);
            if (syncVisaCardDetailsResponse) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateCardDetails', Constants.LOG_INFO, 'PaymentId : ' + payment.id, Constants.SUCCESS_MSG_UPDATE_CLICK_TO_PAY_CARD_DETAILS);
            }
          }
        }
      }
    }
  } else {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateCardDetails', Constants.LOG_INFO, 'PaymentId : ' + payment.id, Constants.ERROR_MSG_PAYMENT_DETAILS);
  }
};

const getCartDetailsByPaymentId = async (paymentId: string) => {
  let cartDetails;
  if (paymentId) {
    const cartResponse = await commercetoolsApi.queryCartById(paymentId, Constants.PAYMENT_ID);
    if (cartResponse && 0 < cartResponse?.count) {
      cartDetails = cartResponse.results[0];
    }
  } else {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetCartDetailsByPaymentId', Constants.LOG_INFO, 'PaymentId : ' + paymentId, Constants.ERROR_MSG_PAYMENT_DETAILS);
  }
  return cartDetails;
};

const isAuthReversalTriggered = async (paymentDetails: paymentType, query: string) => {
  let isAuthReverseTriggered = false;
  let applications: applicationsType[];
  let transactions: paymentTransactionType[];
  let paymentObj: paymentType | null = null;
  const mid = paymentDetails?.custom?.fields?.isv_merchantId ? paymentDetails.custom.fields.isv_merchantId : '';
  const authMid = await multiMid.getMidCredentials(mid);
  const transactionDetail = await createSearchRequest.getTransactionSearchResponse(query, Constants.STRING_SYNC_SORT, authMid);
  if (transactionDetail && Constants.HTTP_SUCCESS_STATUS_CODE === transactionDetail.httpCode && transactionDetail?.data?._embedded?.transactionSummaries) {
    const transactionSummaries = transactionDetail.data._embedded.transactionSummaries;
    for (let element of transactionSummaries) {
      applications = element.applicationInformation.applications;
      for (let application of applications) {
        paymentObj = null;
        if (Constants.STRING_SYNC_AUTH_REVERSAL_NAME === application.name) {
          paymentObj = await commercetoolsApi.retrievePayment(element.clientReferenceInformation.code);
          if (paymentObj && 0 < paymentObj?.transactions?.length) {
            transactions = paymentObj.transactions;
            if (applications && transactions && 0 < transactions?.length) {
              if (transactions.some((transaction: paymentTransactionType) => transaction.interactionId === element.id)) {
                if (Constants.APPLICATION_RCODE === application.rCode && Constants.APPLICATION_RFLAG === application.rFlag) {
                  isAuthReverseTriggered = true;
                }
              }
            }
          }
        }
      }
    }
  }
  return isAuthReverseTriggered;
};

const runSyncAddTransaction = async (syncUpdateObject: reportSyncType, reasonCode: string, authPresent: boolean, authReasonCodePresent: boolean) => {
  let updateSyncResponse: paymentType | null = null;
  let paymentDetails: paymentType | null;
  let authReversalTriggered = false;
  let refundAmount = 0.0;
  if (syncUpdateObject && reasonCode && syncUpdateObject?.id) {
    if (Constants.CYBS_SUCCESS_REASON_CODE === reasonCode && Constants.CT_TRANSACTION_TYPE_REFUND !== syncUpdateObject.type) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    } else if (Constants.CYBS_SUCCESS_REASON_CODE === reasonCode && Constants.CT_TRANSACTION_TYPE_REFUND === syncUpdateObject.type) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
      refundAmount = syncUpdateObject.amountPlanned.centAmount;
      updateSyncResponse = await runSyncUpdateCaptureAmount(updateSyncResponse, refundAmount);
    } else if (Constants.CYBS_ERROR_REASON_CODE === reasonCode && authPresent && authReasonCodePresent) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_PENDING;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    } else if (Constants.CYBS_FAILURE_REASON_CODE === reasonCode && authPresent && authReasonCodePresent) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
      const query = Constants.PAYMENT_GATEWAY_CLIENT_REFERENCE_CODE + syncUpdateObject.id + Constants.STRING_AND + Constants.STRING_SYNC_QUERY;
      paymentDetails = await commercetoolsApi.retrievePayment(syncUpdateObject?.id);
      if (paymentDetails) {
        authReversalTriggered = await isAuthReversalTriggered(paymentDetails, query);
      }
      if (!authReversalTriggered) {
        const authReversalObject = paymentUtils.createTransactionObject(updateSyncResponse?.version, syncUpdateObject.amountPlanned as amountPlannedType, Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION, Constants.CT_TRANSACTION_STATE_INITIAL, undefined, undefined);
        updateSyncResponse = await commercetoolsApi.addTransaction(authReversalObject, syncUpdateObject?.id);
      }
    } else if (((Constants.CYBS_ERROR_REASON_CODE === reasonCode || Constants.CYBS_FAILURE_REASON_CODE === reasonCode) && authPresent && !authReasonCodePresent) || (Constants.CYBS_SUCCESS_REASON_CODE !== reasonCode && '475' !== reasonCode)) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_FAILURE;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    }
  } else {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRunSyncAddTransaction', Constants.LOG_INFO, '', Constants.ERROR_MSG_FETCH_TRANSACTIONS);
  }
  return updateSyncResponse;
};

const runSyncUpdateCaptureAmount = async (updatePaymentObj: paymentType | null, amount: number) => {
  let refundAmount: number;
  let pendingTransactionAmount = 0;
  let updateTransactions: readonly paymentTransactionType[];
  let refundTriggered = false;
  let updateResponse: any;
  let captureTransactionAvailable = false;
  let paymentId = '';
  let paymentVersion = 0;
  if (updatePaymentObj && 0 < amount) {
    refundAmount = amount;
    updateTransactions = updatePaymentObj.transactions;
    paymentId = updatePaymentObj.id;
    paymentVersion = updatePaymentObj.version;
    for (let transaction of updateTransactions) {
      if (transaction?.id && Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.amount) {
        if (refundAmount === transaction.amount.centAmount && !transaction?.custom) {
          captureTransactionAvailable = true;
          refundTriggered = true;
          updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transaction?.id, transaction.amount.centAmount - refundAmount);
          break;
        } else if (transaction.custom?.fields && 0 <= transaction.custom.fields?.isv_availableCaptureAmount && refundAmount <= transaction.custom.fields.isv_availableCaptureAmount) {
          captureTransactionAvailable = true;
          refundTriggered = true;
          updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transaction?.id, transaction.custom.fields.isv_availableCaptureAmount - refundAmount);
          break;
        }
      }
    }
    if (!captureTransactionAvailable) {
      for (let transaction of updateTransactions) {
        if (transaction?.id && Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction.amount?.centAmount) {
          if (refundAmount <= transaction.amount.centAmount && !transaction?.custom) {
            pendingTransactionAmount = transaction.amount.centAmount - refundAmount;
            refundTriggered = true;
            updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transaction.id, pendingTransactionAmount);
            break;
          } else if (refundAmount <= transaction.amount.centAmount && transaction.custom?.fields?.isv_availableCaptureAmount && refundAmount <= transaction.custom.fields.isv_availableCaptureAmount) {
            pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmount;
            refundTriggered = true;
            updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transaction.id, pendingTransactionAmount);
            break;
          }
        }
      }
    }
    if (!refundTriggered) {
      for (let transaction of updateTransactions) {
        updateResponse = await processRunSyncUpdateCaptureAmount(transaction, paymentId, paymentVersion, refundAmount, pendingTransactionAmount);
        if (updateResponse) {
          paymentVersion = updateResponse.version;
        }
      }
    }
  } else {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSyncUpdateCaptureAmount', Constants.LOG_INFO, 'PaymentId : ' + paymentId, Constants.ERROR_MSG_PAYMENT_DETAILS);
  }
  return updateResponse;
};

const updateCustomField = async (customFields: any, getCustomObj: any, typeId: string, version: number) => {
  let fieldExist = false;
  let addCustomFieldResponse;
  try {
    if (customFields && getCustomObj && typeId && version) {
      for (let field of customFields) {
        fieldExist = false;
        getCustomObj.forEach((custom: any) => {
          if (field.name === custom.name) {
            fieldExist = true;
          }
        });
        if (!fieldExist) {
          addCustomFieldResponse = await commercetoolsApi.addCustomField(typeId, version, field);
          version = addCustomFieldResponse.version;
        }
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateCustomField', Constants.LOG_INFO, '', Constants.ERROR_MSG_UPDATE_CUSTOM_TYPE);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncUpdateCustomField', Constants.EXCEPTION_MSG_SYNC_DETAILS, exception, '', '', '');
  }
};

const updateCartWithUCAddress = async (updatePaymentObj: paymentType, cartObj: any) => {
  let transientTokenData: {
    readonly httpCode: number;
    readonly data: any;
    readonly status: string;
  };
  let message = '';
  let updatedCart;
  try {
    if (updatePaymentObj && cartObj && cartObj?.id && cartObj?.version) {
      transientTokenData = await getTransientTokenData.transientTokenDataResponse(updatePaymentObj, 'Payments');
      if (transientTokenData?.httpCode && Constants.HTTP_OK_STATUS_CODE === transientTokenData?.httpCode) {
        const orderInformation = transientTokenData.data.orderInformation;
        updatedCart = await commercetoolsApi.updateCartByPaymentId(cartObj.id, updatePaymentObj.id, cartObj.version, orderInformation);
        message = updatedCart ? Constants.SUCCESS_MSG_UC_ADDRESS_DETAILS : Constants.ERROR_MSG_UC_ADDRESS_DETAILS;
      } else {
        message = Constants.ERROR_MSG_TRANSIENT_TOKEN_DATA;
      }
    }
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetCreditCardResponse', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, message);
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncUpdateCartWithUCAddress', Constants.EXCEPTION_MSG_CART_UPDATE, exception, '', '', '');
  }
  return updatedCart;
};

const addTokenAddressForUC = async (updatePaymentObj: paymentType, cartObj: any) => {
  let transientTokenData: {
    readonly httpCode: number;
    readonly data: any;
    readonly status: string;
  };
  let customerAddress: customerType | null = null;
  try {
    if (updatePaymentObj && 'FULL' == process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE) {
      transientTokenData = await getTransientTokenData.transientTokenDataResponse(updatePaymentObj, 'Payments');
      if (transientTokenData.httpCode && Constants.HTTP_OK_STATUS_CODE === transientTokenData.httpCode && updatePaymentObj?.customer?.id) {
        const transientTokenDataObj = JSON.parse(transientTokenData.data);
        customerAddress = await commercetoolsApi.addCustomerAddress(updatePaymentObj.customer.id, transientTokenDataObj.orderInformation.billTo);
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddTokenAddressForUC', Constants.LOG_INFO, '', Constants.ERROR_MSG_UC_ADDRESS_DETAILS);
      }
    } else if (updatePaymentObj && ('NONE' === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE || 'PARTIAL' === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE)) {
      if (cartObj && cartObj?.billingAddress && updatePaymentObj?.customer?.id) {
        customerAddress = await commercetoolsApi.addCustomerAddress(updatePaymentObj.customer.id, cartObj.billingAddress);
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddTokenAddressForUC', Constants.LOG_INFO, '', Constants.ERROR_MSG_CUSTOMER_UPDATE);
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAddTokenAddressForUC', Constants.EXCEPTION_MSG_CUSTOMER_UPDATE_ADDRESS, exception, updatePaymentObj.id, 'PaymentId : ', '');
  }
  return customerAddress;
};

const payerAuthValidateActions = async (authResponse: actionResponseType, paymentResponse: any) => {
  authResponse.actions.push({
    action: Constants.ADD_INTERFACE_INTERACTION,
    type: {
      key: 'isv_payments_payer_authentication_validate_result',
    },
    fields: {
      cavv: paymentResponse.data.consumerAuthenticationInformation?.cavv,
      eciRaw: paymentResponse.data.consumerAuthenticationInformation?.eciRaw,
      paresStatus: paymentResponse.data.consumerAuthenticationInformation?.paresStatus,
      commerceIndicator: paymentResponse.data.consumerAuthenticationInformation?.indicator,
      authenticationResult: paymentResponse.data.consumerAuthenticationInformation?.authenticationResult,
      xid: paymentResponse.data.consumerAuthenticationInformation?.xid,
      cavvAlgorithm: paymentResponse.data.consumerAuthenticationInformation?.cavvAlgorithm,
      authenticationStatusMessage: paymentResponse.data.consumerAuthenticationInformation?.authenticationStatusMessage,
      eci: paymentResponse.data.consumerAuthenticationInformation?.eci,
      specificationVersion: paymentResponse.data.consumerAuthenticationInformation?.specificationVersion,
    },
  });
  return authResponse;
};

const setCustomerFailedTokenData = async (updatePaymentObj: paymentType, customFields: paymentCustomFieldsType, addressId: string) => {
  let existingTokens: string[] = [];
  let existingFailedTokensMap: string[] = [];
  let customerInfo: customerType | null = null;
  let customerTokenResponse: customerType | null = null;
  let failedTokenLength = 0;
  const customerId = updatePaymentObj?.customer?.id;
  if (customerId) {
    customerInfo = await commercetoolsApi.getCustomer(customerId);
  }
  if (customerInfo) {
    const failedToken = {
      alias: customFields.isv_tokenAlias,
      cardType: customFields.isv_cardType,
      cardName: customFields.isv_cardType,
      cardNumber: customFields.isv_maskedPan,
      cardExpiryMonth: customFields.isv_cardExpiryMonth,
      cardExpiryYear: customFields.isv_cardExpiryYear,
      addressId: addressId,
      timeStamp: new Date(Date.now()).toISOString(),
    };
    const customTypePresent = customerInfo?.custom?.type?.id ? true : false;
    if (customerInfo.custom?.fields?.isv_tokens) {
      const customerTokens = customerInfo.custom.fields;
      if (customerTokens?.isv_failedTokens && 0 < customerTokens.isv_failedTokens?.length) {
        const existingFailedTokens = customerTokens.isv_failedTokens;
        existingFailedTokensMap = existingFailedTokens.map((item) => item);
        failedTokenLength = customerTokens.isv_failedTokens.length;
        existingFailedTokensMap[failedTokenLength] = JSON.stringify(failedToken);
      } else {
        existingFailedTokensMap = [JSON.stringify(failedToken)];
      }
      existingTokens = customerInfo.custom.fields.isv_tokens;
    } else {
      existingFailedTokensMap = [JSON.stringify(failedToken)];
    }
    if (customerInfo?.custom?.fields?.isv_failedTokens && 0 < customerInfo?.custom?.fields?.isv_failedTokens?.length) {
      customerTokenResponse = await commercetoolsApi.updateCustomerToken(null, customerInfo, existingFailedTokensMap);
    } else {
      if (customTypePresent) {
        customerTokenResponse = await commercetoolsApi.updateCustomerToken(existingTokens, customerInfo, existingFailedTokensMap);
      } else {
        customerTokenResponse = await commercetoolsApi.setCustomType(customerId, existingTokens, existingFailedTokensMap);
      }
    }
  }
  return customerTokenResponse;
};

const processRunSyncUpdateCaptureAmount = async (transaction: paymentTransactionType, paymentId: string, paymentVersion: number, refundAmount: number, pendingTransactionAmount: number) => {
  let updateResponse;
  let transactionId = '';
  let refundAmountUsed = 0;
  if (transaction && transaction?.id && Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && 0 < refundAmount) {
    transactionId = transaction.id;
    if (transaction?.custom?.fields?.isv_availableCaptureAmount && transaction.custom.fields.isv_availableCaptureAmount && refundAmount <= transaction.custom.fields.isv_availableCaptureAmount && transaction?.id) {
      refundAmountUsed = refundAmount;
      pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmountUsed;
    } else if (transaction?.custom?.fields?.isv_availableCaptureAmount && transaction.custom.fields.isv_availableCaptureAmount && refundAmount >= transaction.custom.fields.isv_availableCaptureAmount && transaction?.id) {
      refundAmountUsed = Number(transaction.custom.fields.isv_availableCaptureAmount);
      pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmountUsed;
    } else if (transaction?.amount?.centAmount && refundAmount <= transaction.amount.centAmount && !transaction.custom && transaction?.id) {
      refundAmountUsed = refundAmount;
      pendingTransactionAmount = transaction.amount.centAmount - refundAmountUsed;
    } else if (transaction?.amount?.centAmount && refundAmount >= transaction.amount.centAmount && !transaction.custom && transaction?.id) {
      refundAmountUsed = transaction.amount.centAmount;
      pendingTransactionAmount = transaction.amount.centAmount - refundAmountUsed;
    }
  }
  if (transactionId) {
    updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transactionId, pendingTransactionAmount);
  }
  return updateResponse;
};

const retrieveSyncAmountDetails = async (paymentDetails: paymentType, element: any, applicationResponse: any) => {
  const syncAmountObject = {
    centAmount: 0,
    currencyCode: '',
  };
  const fractionDigits = paymentDetails.amountPlanned.fractionDigits;
  if (applicationResponse.authPresent || applicationResponse.capturePresent || applicationResponse.authReversalPresent) {
    if (element.orderInformation && element.orderInformation.amountDetails && element.orderInformation.amountDetails.currency) {
      syncAmountObject.currencyCode = element.orderInformation.amountDetails.currency;
    } else {
      syncAmountObject.currencyCode = paymentDetails.amountPlanned.currencyCode;
    }
    if (element.orderInformation && element.orderInformation.amountDetails && element.orderInformation.amountDetails.totalAmount) {
      syncAmountObject.centAmount = paymentUtils.convertAmountToCent(Number(element.orderInformation.amountDetails.totalAmount), fractionDigits);
    } else {
      syncAmountObject.centAmount = paymentDetails.amountPlanned.centAmount;
    }
    if (!applicationResponse.authReasonCodePresent) {
      if (applicationResponse.capturePresent && applicationResponse.captureReasonCodePresent) {
        syncAmountObject.centAmount = paymentUtils.convertAmountToCent(Number(element.orderInformation.amountDetails.totalAmount), fractionDigits);
        syncAmountObject.currencyCode = element.orderInformation.amountDetails.currency;
      } else {
        syncAmountObject.currencyCode = paymentDetails.amountPlanned.currencyCode;
        syncAmountObject.centAmount = paymentDetails.amountPlanned.centAmount;
      }
    }
  } else {
    syncAmountObject.currencyCode = element.orderInformation.amountDetails.currency;
    syncAmountObject.centAmount = paymentUtils.convertAmountToCent(Number(element.orderInformation.amountDetails.totalAmount), fractionDigits);
  }
  return syncAmountObject;
};

const retrieveSyncResponse = async (paymentDetails: paymentType, transactionElement: any) => {
  const syncUpdateObject: reportSyncType = {
    id: '',
    transactionId: '',
    version: 0,
    interactionId: '',
    amountPlanned: {
      currencyCode: '',
      centAmount: 0,
    },
    type: '',
    state: '',
    securityCodePresent: false,
  };
  let rowPresent = false;
  let updateSyncResponse;
  if (paymentDetails && transactionElement) {
    if (Constants.STRING_TRANSACTIONS in paymentDetails) {
      if ((Constants.CC_PAYER_AUTHENTICATION == paymentDetails.paymentMethodInfo.method || Constants.CREDIT_CARD == paymentDetails.paymentMethodInfo.method) && paymentDetails?.custom?.fields?.isv_securityCode && paymentDetails.custom.fields.isv_securityCode) {
        syncUpdateObject.securityCodePresent = true;
      }
      const transactions = paymentDetails.transactions;
      const applications = transactionElement.applicationInformation.applications;
      if (applications && transactions) {
        const applicationResponse = await getApplicationsPresent(applications);
        if (applicationResponse) {
          if (transactions.some((item: any) => item.interactionId == transactionElement.id)) {
            rowPresent = true;
          }
          if (!rowPresent) {
            syncUpdateObject.id = paymentDetails.id;
            syncUpdateObject.version = paymentDetails.version;
            syncUpdateObject.interactionId = transactionElement.id;
            const amountDetails = await retrieveSyncAmountDetails(paymentDetails, transactionElement, applicationResponse);
            syncUpdateObject.amountPlanned.currencyCode = amountDetails?.currencyCode;
            syncUpdateObject.amountPlanned.centAmount = amountDetails?.centAmount;
            if (applicationResponse.authPresent) {
              if (Constants.ECHECK == paymentDetails.paymentMethodInfo.method) {
                syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_CHARGE;
              } else {
                applicationResponse.capturePresent && applicationResponse.captureReasonCodePresent ? (syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_CHARGE) : (syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_AUTHORIZATION);
              }
              updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, transactionElement.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
              if (updateSyncResponse && (Constants.CLICK_TO_PAY == paymentDetails.paymentMethodInfo.method || Constants.APPLE_PAY == paymentDetails.paymentMethodInfo.method)) {
                await updateCardDetails(paymentDetails, updateSyncResponse.version, transactionElement.id);
              }
            } else if (applicationResponse.capturePresent) {
              if (paymentDetails?.custom?.fields?.isv_saleEnabled) {
                if (Constants.CT_TRANSACTION_TYPE_CHARGE === paymentDetails.transactions[0].type) {
                  const transactionObj = {
                    paymentId: paymentDetails.id,
                    version: paymentDetails.version,
                    transactionId: paymentDetails.transactions[0].id,
                    interactionId: transactionElement.id,
                  };
                  updateSyncResponse = await commercetoolsApi.changeTransactionInteractionId(transactionObj);
                }
              } else {
                syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_CHARGE;
                updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, transactionElement.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
              }
            } else if (applicationResponse.authReversalPresent) {
              syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION;
              updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, transactionElement.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
              if (updateSyncResponse?.transactions) {
                const authorizationTransaction = await updateSyncResponse.transactions.find((transaction: paymentTransactionType) => transaction.type === Constants.CT_TRANSACTION_TYPE_AUTHORIZATION && transaction.state === Constants.CT_TRANSACTION_STATE_FAILURE);
                const cancelAuthTransaction = await updateSyncResponse.transactions.find((transaction: paymentTransactionType) => transaction.type === Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION && transaction.state === Constants.CT_TRANSACTION_STATE_SUCCESS);
                if (authorizationTransaction && cancelAuthTransaction && authorizationTransaction?.id && Constants.CT_TRANSACTION_STATE_SUCCESS === cancelAuthTransaction?.state && Constants.CT_TRANSACTION_STATE_FAILURE === authorizationTransaction?.state) {
                  const updateTransactionObject = {
                    id: updateSyncResponse.id,
                    version: updateSyncResponse.version,
                    state: Constants.CT_TRANSACTION_STATE_SUCCESS,
                  };
                  commercetoolsApi.updateDecisionSync(updateTransactionObject, authorizationTransaction.id);
                }
              }
            } else if (applicationResponse.refundPresent) {
              syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_REFUND;
              updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, transactionElement.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
            }
          }
        }
      }
    }
  }
  return updateSyncResponse;
};

//Network Tokens
const verifySubscription = async (searchSubscriptionResponse: any, merchantId: string | undefined) => {
  let getCustomObjectSubscriptions: any;
  const verificationObject = {
    isSubscribed: false,
    presentInCustomObject: false,
    urlVerified: false,
    webhookId: '',
    key: '',
    keyId: '',
    keyExpiration: '',
    merchantId: '',
  };
  getCustomObjectSubscriptions = await commercetoolsApi.retrieveCustomObjectByContainer(Constants.CUSTOM_OBJECT_CONTAINER);
  if (getCustomObjectSubscriptions?.results) {
    const customObjectWebhookResponse = getCustomObjectSubscriptions?.results[0]?.value?.find((customObject: any) => customObject?.merchantId === merchantId && customObject?.subscriptionId === searchSubscriptionResponse.webhookId);
    if (searchSubscriptionResponse?.webhookId === customObjectWebhookResponse?.subscriptionId) {
      verificationObject.presentInCustomObject = true;
      verificationObject.key = customObjectWebhookResponse.key;
      verificationObject.keyId = customObjectWebhookResponse.keyId;
      verificationObject.keyExpiration = customObjectWebhookResponse.keyExpiration;
      verificationObject.webhookId = customObjectWebhookResponse.subscriptionId;
      verificationObject.merchantId = customObjectWebhookResponse.merchantId;
    }
  }
  if (searchSubscriptionResponse && Constants.HTTP_OK_STATUS_CODE === searchSubscriptionResponse.httpCode && searchSubscriptionResponse?.webhookId && searchSubscriptionResponse?.webhookUrl) {
    const subscribedUrl = process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + ':' + Constants.PAYMENT_GATEWAY_WEBHOOK_PORT + Constants.PAYMENT_GATEWAY_WEBHOOK_ENDPOINT;
    verificationObject.isSubscribed = true;
    if (subscribedUrl === searchSubscriptionResponse?.webhookUrl) {
      verificationObject.urlVerified = true;
    }
    verificationObject.webhookId = searchSubscriptionResponse?.webhookId;
  }
  return verificationObject;
};

const decisionSyncService = async (conversionDetails: any) => {
  let latestTransaction: paymentTransactionType;
  let paymentDetails = null;
  let conversionPresent = false;
  let decision = '';
  let decisionUpdateObject = {
    id: '',
    version: 0,
    state: '',
  };
  if (conversionDetails) {
    for (let element of conversionDetails) {
      paymentDetails = null;
      paymentDetails = await commercetoolsApi.retrievePayment(element.merchantReferenceNumber);
      if (paymentDetails && paymentDetails?.transactions && paymentDetails.transactions.length) {
        latestTransaction = paymentDetails.transactions[paymentDetails.transactions.length - 1];
        if ((Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === latestTransaction.type || Constants.CT_TRANSACTION_TYPE_CHARGE === latestTransaction.type) && Constants.CT_TRANSACTION_STATE_PENDING === latestTransaction.state && latestTransaction?.id) {
          conversionPresent = true;
          if (Constants.HTTP_STATUS_DECISION_ACCEPT === element.newDecision) {
            decision = Constants.CT_TRANSACTION_STATE_SUCCESS;
          } else if (Constants.HTTP_STATUS_DECISION_REJECT === element.newDecision) {
            decision = Constants.CT_TRANSACTION_STATE_FAILURE;
          }
          decisionUpdateObject.id = paymentDetails.id;
          decisionUpdateObject.version = paymentDetails.version;
          decisionUpdateObject.state = decision;
          await commercetoolsApi.updateDecisionSync(decisionUpdateObject, latestTransaction.id);
        }
      }
    }
  }
  return conversionPresent;
};

export default {
  tokenCreateFlag,
  cardDetailsActions,
  payerAuthActions,
  payerEnrollActions,
  getUpdateTokenActions,
  getAuthResponse,
  getOMServiceResponse,
  getCapturedAmount,
  getAuthorizedAmount,
  addRefundAction,
  setTransactionCustomType,
  getCreditCardResponse,
  getPayerAuthValidateResponse,
  getPayerAuthSetUpResponse,
  getPayerAuthEnrollResponse,
  getGooglePayResponse,
  getClickToPayResponse,
  updateCustomField,
  checkAuthReversalTriggered,
  getRefundResponse,
  getApplicationsPresent,
  updateCardDetails,
  runSyncAddTransaction,
  getCardTokens,
  setCustomerTokenData,
  rateLimiterAddToken,
  createResponse,
  processPayerAuthEnrollTokens,
  getTransactionSummaries,
  handleAuthApplication,
  handleAuthReversalResponse,
  processTokens,
  getCartDetailsByPaymentId,
  isAuthReversalTriggered,
  runSyncUpdateCaptureAmount,
  updateCartWithUCAddress,
  addTokenAddressForUC,
  payerAuthValidateActions,
  setCustomerFailedTokenData,
  processRunSyncUpdateCaptureAmount,
  retrieveSyncAmountDetails,
  retrieveSyncResponse,
  verifySubscription,
  decisionSyncService,
};
