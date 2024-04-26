import fs from 'fs';
import https from 'https';
import path from 'path';

import axios from 'axios';

import { Constants } from '../constants';
import addTokenService from '../service/payment/AddTokenService';
import createSearchRequest from '../service/payment/CreateTransactionSearchRequest';
import webhookSubscriptionService from '../service/payment/CreateWebhookSubscription';
import conversion from '../service/payment/DecisionSyncService';
import deleteToken from '../service/payment/DeleteTokenService';
import deleteWebhookSubscription from '../service/payment/DeleteWebhookSubscriptionService';
import getTransientTokenData from '../service/payment/GetTransientTokenData';
import getWebhookSubscriptionDetails from '../service/payment/GetWebhookSubscriptionDetails';
import keyGeneration from '../service/payment/KeyGeneration';
import updateToken from '../service/payment/UpdateTokenService';
import { actionResponseType, addressType, customerTokensType, customerType, customTokenType, instrumentIdResponse, midCredentialsType, paymentCustomFieldsType, paymentTransactionType, paymentType, reportResponseType } from '../types/Types';

import paymentAuthReversal from './../service/payment/PaymentAuthorizationReversal';
import paymentCapture from './../service/payment/PaymentCaptureService';
import paymentService from './../utils/PaymentService';
import paymentUtils from './../utils/PaymentUtils';
import commercetoolsApi from './../utils/api/CommercetoolsApi';
import multiMid from './config/MultiMid';

const authorizationHandler = async (updatePaymentObj: paymentType, updateTransactions: paymentTransactionType) => {
  let authResponse: actionResponseType = paymentUtils.getEmptyResponse();
  let cardTokens: customTokenType = {
    customerTokenId: '',
    paymentInstrumentId: '',
  };
  let customerInfo: customerType | null = null;
  let paymentInstrumentToken = '';
  let isError = false;
  let cartObj;
  try {
    if (updatePaymentObj && updateTransactions) {
      cartObj = await paymentUtils.getCartObject(updatePaymentObj);
      if (cartObj && cartObj?.count && 0 < cartObj.count && cartObj?.results) {
        if (updatePaymentObj?.customer?.id) {
          customerInfo = await commercetoolsApi.getCustomer(updatePaymentObj.customer.id);
          if (updatePaymentObj.custom?.fields?.isv_savedToken) {
            paymentInstrumentToken = updatePaymentObj.custom.fields.isv_savedToken;
          }
          cardTokens = await paymentService.getCardTokens(customerInfo, paymentInstrumentToken);
        }
        const orderNo = await paymentUtils.getOrderId(cartObj?.results[0]?.id, updatePaymentObj?.id);
        const paymentMethod = updatePaymentObj.paymentMethodInfo.method;
        const serviceResponse = await paymentAuthHandler(paymentMethod, updatePaymentObj, customerInfo, cartObj.results[0], updateTransactions, cardTokens, orderNo);
        if (serviceResponse?.authResponse) {
          authResponse = serviceResponse.authResponse;
          isError = serviceResponse.isError;
        }
        const paymentResponse = serviceResponse.paymentResponse;
        if (Constants.CREDIT_CARD === paymentMethod) {
          authResponse = await paymentService.setCustomerTokenData(cardTokens, paymentResponse, authResponse, isError, updatePaymentObj, cartObj.results[0]);
        }
        const customFields = updatePaymentObj?.custom?.fields;
        authResponse = await setTokenNullHandler(customFields, authResponse, paymentMethod);
        if (paymentResponse && Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
          authResponse = await paymentService.checkAuthReversalTriggered(updatePaymentObj, cartObj.results[0], paymentResponse, authResponse);
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthorizationHandler', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_EMPTY_CART);
        isError = true;
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthorizationHandler', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
      isError = true;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAuthorizationHandler', Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, updatePaymentObj.id, 'PaymentId : ', '');
    isError = true;
  }
  if (isError) {
    authResponse = paymentUtils.invalidInputResponse();
  }
  return authResponse;
};

const setTokenNullHandler = async (customFields: paymentCustomFieldsType | undefined, authResponse: actionResponseType, paymentMethod: string) => {
  const isv_tokenVerificationContext = '';
  const isv_tokenCaptureContextSignature = '';
  const isv_securityCode = 0;
  if ((customFields?.isv_savedToken && customFields?.isv_tokenVerificationContext) || (Constants.CREDIT_CARD !== paymentMethod && Constants.CC_PAYER_AUTHENTICATION !== paymentMethod && customFields?.isv_tokenVerificationContext)) {
    authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenVerificationContext }));
  }
  if (customFields?.isv_tokenCaptureContextSignature) {
    authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenCaptureContextSignature }));
  }
  if (customFields?.isv_securityCode) {
    authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_securityCode }));
  }
  return authResponse;
};

const paymentAuthHandler = async (paymentMethod: string, updatePaymentObj: paymentType, customerInfo: customerType | null, cartInfo: any, updateTransactions: paymentTransactionType, cardTokens: customTokenType, orderNo: string) => {
  let serviceResponse: { readonly isError: boolean; readonly paymentResponse: any; readonly authResponse: actionResponseType };
  switch (paymentMethod) {
    case Constants.CREDIT_CARD: {
      serviceResponse = await paymentService.getCreditCardResponse(updatePaymentObj, customerInfo, cartInfo, updateTransactions, cardTokens, orderNo);
      break;
    }
    case Constants.CLICK_TO_PAY: {
      serviceResponse = await paymentService.getClickToPayResponse(updatePaymentObj, cartInfo, updateTransactions, cardTokens, orderNo);
      break;
    }
    case Constants.GOOGLE_PAY: {
      serviceResponse = await paymentService.getGooglePayResponse(updatePaymentObj, cartInfo, updateTransactions, cardTokens, orderNo);
      break;
    }
    case Constants.APPLE_PAY: {
      serviceResponse = await paymentService.getCreditCardResponse(updatePaymentObj, customerInfo, cartInfo, updateTransactions, cardTokens, orderNo);
      break;
    }
    case Constants.ECHECK: {
      serviceResponse = await paymentService.getCreditCardResponse(updatePaymentObj, customerInfo, cartInfo, updateTransactions, cardTokens, orderNo);
      break;
    }
    default: {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPaymentAuthHandler', Constants.LOG_INFO, updatePaymentObj.id, Constants.ERROR_MSG_NO_PAYMENT_METHODS);
      return { paymentResponse: null, authResponse: null, isError: true };
    }
  }
  return serviceResponse;
};

const payerAuthReversalHandler = async (updatePaymentObj: paymentType, paymentResponse: any, updateActions: actionResponseType) => {
  let cartObj;
  if (updatePaymentObj && updateActions && paymentResponse && Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
    cartObj = await paymentUtils.getCartObject(updatePaymentObj);
    if (cartObj && cartObj?.results && 0 < cartObj?.results?.length) {
      updateActions = await paymentService.checkAuthReversalTriggered(updatePaymentObj, cartObj?.results[0], paymentResponse, updateActions);
    }
  } else {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPayerAuthReversalHandler', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
  }
  return updateActions;
};

const applePaySessionHandler = async (fields: paymentCustomFieldsType) => {
  let serviceResponse: actionResponseType = paymentUtils.getEmptyResponse();
  let httpsAgent: https.Agent = new https.Agent({
    rejectUnauthorized: true,
    cert: '',
    key: '',
  });
  let isError = false;
  try {
    if (process.env.PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH && process.env.PAYMENT_GATEWAY_APPLE_PAY_KEY_PATH && process.env.PAYMENT_GATEWAY_APPLE_PAY_DOMAIN_NAME && process.env.PAYMENT_GATEWAY_APPLE_PAY_MERCHANT_ID) {
      const certificateString = process.env.PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH;
      const keyString = process.env.PAYMENT_GATEWAY_APPLE_PAY_KEY_PATH;
      if (Constants.STRING_AWS === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT || Constants.STRING_AZURE === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
        const certData = await paymentUtils.getCertificatesData(certificateString);
        const keyData = await paymentUtils.getCertificatesData(keyString);
        if (Constants.HTTP_OK_STATUS_CODE === certData?.status && certData.data && Constants.HTTP_OK_STATUS_CODE === keyData.status && keyData.data) {
          httpsAgent = new https.Agent({
            rejectUnauthorized: true,
            cert: certData.data,
            key: keyData.data,
          });
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncApplePaySessionHandler', Constants.LOG_ERROR, '', Constants.ERROR_MSG_ACCESSING_CERTIFICATES);
          isError = true;
        }
      } else {
        httpsAgent = new https.Agent({
          rejectUnauthorized: true,
          cert: fs.readFileSync(certificateString),
          key: fs.readFileSync(keyString),
        });
      }
      const domainName = process.env.PAYMENT_GATEWAY_APPLE_PAY_DOMAIN_NAME;
      const body = {
        merchantIdentifier: process.env.PAYMENT_GATEWAY_APPLE_PAY_MERCHANT_ID,
        domainName: domainName,
        displayName: fields.isv_applePayDisplayName,
        initiative: Constants.PAYMENT_GATEWAY_APPLE_PAY_INITIATIVE,
        initiativeContext: domainName,
      };
      const applePaySession = await axios.post(fields.isv_applePayValidationUrl, body, {
        httpsAgent,
      });
      const isv_applePaySessionData = JSON.stringify(applePaySession.data);
      serviceResponse.actions = paymentUtils.setCustomFieldMapper({ isv_applePaySessionData });
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncApplePaySessionHandler', Constants.LOG_ERROR, '', Constants.ERROR_MSG_APPLE_PAY_CERTIFICATES);
      isError = true;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncApplePaySessionHandler', Constants.EXCEPTION_MSG_SERVICE_PROCESS, exception, '', '', '');
    isError = true;
  }
  if (isError) {
    serviceResponse = paymentUtils.invalidInputResponse();
  }
  return serviceResponse;
};

const orderManagementChargeHandler = async (updatePaymentObj: paymentType, orderNo: string, updateTransactions: paymentTransactionType) => {
  let authId = '';
  let orderResponse;
  try {
    for (let transaction of updatePaymentObj.transactions) {
      if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.interactionId) {
        authId = transaction.interactionId;
        break;
      }
    }
    authId
      ? (orderResponse = await paymentCapture.captureResponse(updatePaymentObj, updateTransactions, authId, orderNo))
      : paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncOrderManagementCaptureHandler', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_CAPTURE_FAILURE);
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncOrderManagementCaptureHandler', '', exception, updatePaymentObj.id, 'PaymentId : ', '');
  }
  return orderResponse;
};

const orderManagementAuthReversalHandler = async (updatePaymentObj: paymentType, cartObj: any) => {
  let authReversalId = '';
  let orderResponse;
  try {
    for (let transaction of updatePaymentObj.transactions) {
      if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.interactionId) {
        authReversalId = transaction.interactionId;
        break;
      }
    }
    authReversalId
      ? (orderResponse = await paymentAuthReversal.authReversalResponse(updatePaymentObj, cartObj, authReversalId))
      : paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncOrderManagementAuthReverseHandler', Constants.LOG_INFO, 'PaymentId : ' + updatePaymentObj.id, Constants.ERROR_MSG_REVERSAL_FAILURE);
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncOrderManagementAuthReverseHandler', '', exception, updatePaymentObj.id, 'PaymentId : ', '');
  }
  return orderResponse;
};

const orderManagementHandler = async (paymentId: string, updatePaymentObj: paymentType, updateTransactions: paymentTransactionType) => {
  let orderResponse;
  let serviceResponse: actionResponseType = paymentUtils.getEmptyResponse();
  let isError = false;
  let cartObj;
  try {
    if (updatePaymentObj && updateTransactions) {
      cartObj = await paymentUtils.getCartObject(updatePaymentObj);
      if (cartObj?.results[0]?.id) {
        const orderNo = await paymentUtils.getOrderId(cartObj.results[0].id, paymentId);
        if (Constants.CT_TRANSACTION_TYPE_CHARGE === updateTransactions.type && Constants.CT_TRANSACTION_STATE_INITIAL === updateTransactions.state) {
          orderResponse = await orderManagementChargeHandler(updatePaymentObj, orderNo, updateTransactions);
        } else if (Constants.CT_TRANSACTION_TYPE_REFUND === updateTransactions.type && Constants.CT_TRANSACTION_STATE_INITIAL === updateTransactions.state) {
          serviceResponse = await paymentService.getRefundResponse(updatePaymentObj, updateTransactions, orderNo);
        } else if (Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION === updateTransactions.type && Constants.CT_TRANSACTION_STATE_INITIAL === updateTransactions.state) {
          orderResponse = await orderManagementAuthReversalHandler(updatePaymentObj, cartObj.results[0]);
        }
        if (orderResponse && orderResponse.httpCode) {
          serviceResponse = paymentService.getOMServiceResponse(orderResponse, updateTransactions, '', 0);
        } else if (serviceResponse && 0 < serviceResponse?.actions?.length) {
          isError = false;
        } else {
          isError = true;
        }
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncOrderManagementHandler', Constants.LOG_INFO, 'PaymentId : ' + paymentId, Constants.ERROR_MSG_SERVICE_PROCESS);
      isError = true;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncOrderManagementHandler', Constants.EXCEPTION_MSG_SERVICE_PROCESS, exception, paymentId, 'PaymentId : ', '');
    isError = true;
  }
  if (isError) {
    serviceResponse = paymentUtils.invalidInputResponse();
  }
  return serviceResponse;
};

const updateCardHandler = async (tokens: customerTokensType, customerId: string, customerObj: customerType) => {
  let returnResponse: actionResponseType = paymentUtils.getEmptyResponse();
  let parsedTokens: customerTokensType;
  let addressData: addressType | null = null;
  const isError = false;
  let finalTokenIndex = -1;
  let updateServiceResponse: any;
  try {
    if (customerId) {
      const customerInfo = await commercetoolsApi.getCustomer(customerId);
      if (customerObj?.addresses && 0 < customerObj?.addresses.length) {
        customerObj.addresses.forEach((address) => {
          if (tokens.addressId === address.id) {
            addressData = address;
          }
        });
      }
      if (customerObj?.custom?.fields?.isv_cardNewExpiryMonth && customerObj?.custom?.fields?.isv_cardNewExpiryYear) {
        updateServiceResponse = await updateToken.updateTokenResponse(tokens, customerObj?.custom?.fields?.isv_cardNewExpiryMonth, customerObj?.custom?.fields?.isv_cardNewExpiryYear, addressData);
        if (
          updateServiceResponse &&
          Constants.HTTP_OK_STATUS_CODE === updateServiceResponse?.httpCode &&
          updateServiceResponse?.card &&
          0 < Object.keys(updateServiceResponse.card).length &&
          updateServiceResponse?.card?.expirationMonth &&
          updateServiceResponse?.card?.expirationYear
        ) {
          if (customerInfo && customerInfo?.custom?.fields?.isv_tokens && customerInfo.custom.fields?.isv_tokens?.length) {
            const existingTokens = customerInfo.custom.fields.isv_tokens;
            existingTokens.forEach((token, tokenIndex) => {
              const newToken = JSON.parse(token);
              if (newToken.paymentToken === tokens.paymentToken) {
                finalTokenIndex = tokenIndex;
              }
            });
            if (-1 < finalTokenIndex) {
              parsedTokens = JSON.parse(existingTokens[finalTokenIndex]);
              parsedTokens.cardExpiryMonth = updateServiceResponse?.card.expirationMonth;
              parsedTokens.cardExpiryYear = updateServiceResponse?.card.expirationYear;
              parsedTokens.addressId = tokens.addressId;
              existingTokens[finalTokenIndex] = JSON.stringify(parsedTokens);
              returnResponse = paymentService.getUpdateTokenActions(existingTokens, customerObj?.custom?.fields?.isv_failedTokens, isError, customerObj, null);
            } else {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateCardHandler', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_NO_TOKENS_UPDATE);
            }
          } else {
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateCardHandler', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_NO_TOKENS_UPDATE);
          }
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateCardHandler', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_SERVICE_PROCESS);
        }
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncUpdateCardHandler', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_CUSTOMER_DETAILS);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncUpdateCardHandler', Constants.EXCEPTION_MSG_CUSTOMER_UPDATE, exception, customerId, 'CustomerId : ', '');
  }
  return returnResponse;
};

const deleteCardHandler = async (updateCustomerObj: customerTokensType, customerId: string) => {
  let customerTokenHandlerResponse: actionResponseType = paymentUtils.getEmptyResponse();
  let deletedTokenIndex = -1;
  if (customerId && updateCustomerObj) {
    const customerObj = await commercetoolsApi.getCustomer(customerId);
    const tokenManagementResponse = await deleteToken.deleteCustomerToken(updateCustomerObj);
    if (tokenManagementResponse && Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE === tokenManagementResponse.httpCode) {
      if (customerObj && customerObj?.custom?.fields?.isv_tokens && customerObj?.custom?.fields?.isv_tokens?.length) {
        const existingTokensMap = customerObj.custom.fields.isv_tokens.map((item: any) => item);
        existingTokensMap.forEach((token: any, tokenIndex: number) => {
          const parsedToken = JSON.parse(token);
          if (tokenManagementResponse.deletedToken === parsedToken.paymentToken) {
            deletedTokenIndex = tokenIndex;
          }
        });
        if (-1 < deletedTokenIndex) {
          existingTokensMap.splice(deletedTokenIndex, 1);
          customerTokenHandlerResponse = paymentService.getUpdateTokenActions(existingTokensMap, customerObj?.custom?.fields?.isv_failedTokens, true, customerObj, null);
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteCardHandler', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_NO_TOKENS_DELETE);
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteCardHandler', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_NO_TOKENS_DELETE);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteCardHandler', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_SERVICE_PROCESS);
    }
  } else {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteCardHandler', Constants.LOG_INFO, 'CustomerId : ' + customerId, Constants.ERROR_MSG_CUSTOMER_DETAILS);
  }
  const isv_tokenAction = ''
  customerTokenHandlerResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenAction }));
  return customerTokenHandlerResponse;
};

const addCardHandler = async (customerId: string, addressObj: readonly addressType[], customerObj: customerType) => {
  let customerTokenResponse: actionResponseType = paymentUtils.getEmptyResponse();
  let parsedTokens: customerTokensType;
  let notSaveToken = false;
  let billToFields: addressType | null = null;
  let existingTokens: string[] = [];
  let existingFailedTokens: string[] = [];
  let newTokenFlag = false;
  let tokensExists = false;
  let finalTokenIndex = -1;
  let addressIdField = '';
  try {
    const tokenCreateResponse = await paymentService.tokenCreateFlag(customerObj, null, 'FuncAddCardHandler');
    if (!tokenCreateResponse.isError) {
      notSaveToken = tokenCreateResponse.notSaveToken;
      const customFields = customerObj?.custom?.fields;
      if (!notSaveToken && customerObj?.custom?.fields?.isv_addressId && customerObj?.custom?.fields?.isv_token) {
        const cardTokens = await paymentService.getCardTokens(customerObj, '');
        if (Constants.UC_ADDRESS === customerObj?.custom?.fields?.isv_addressId) {
          const ucAddressData = await getTransientTokenData.transientTokenDataResponse(customerObj, 'MyAccounts');
          if (Constants.HTTP_OK_STATUS_CODE === ucAddressData?.httpCode) {
            billToFields = ucAddressData.data.orderInformation.billTo;
          }
        } else {
          addressObj.forEach((address) => {
            if (customFields?.isv_addressId === address.id) {
              billToFields = address;
            }
          });
        }
        const cardResponse = await addTokenService.addTokenResponse(customerId, customerObj, billToFields, cardTokens);
        if (
          Constants.HTTP_SUCCESS_STATUS_CODE === cardResponse.httpCode &&
          Constants.API_STATUS_AUTHORIZED === cardResponse.status &&
          cardResponse?.data?.tokenInformation &&
          cardResponse?.data?.tokenInformation?.paymentInstrument &&
          cardResponse?.data?.tokenInformation?.instrumentIdentifier &&
          cardResponse?.data?.tokenInformation?.paymentInstrument?.id.length
        ) {
          const customerTokenId = cardResponse?.data?.tokenInformation?.customer && cardTokens && 0 < cardResponse?.data?.tokenInformation?.customer?.id?.length ? cardResponse.data.tokenInformation.customer.id : cardTokens.customerTokenId;
          const paymentInstrumentId = cardResponse.data.tokenInformation.paymentInstrument.id;
          const instrumentIdentifier = cardResponse.data.tokenInformation.instrumentIdentifier.id;
          if (customFields?.isv_tokens && customFields.isv_tokens.length) {
            existingTokens = customFields.isv_tokens;
            existingTokens.forEach((token, tokenIndex) => {
              const newToken = JSON.parse(token);
              if (newToken.cardNumber === customFields?.isv_maskedPan && newToken.value === customerTokenId && newToken.instrumentIdentifier === instrumentIdentifier) {
                finalTokenIndex = tokenIndex;
              }
            });
            if (-1 < finalTokenIndex && customFields?.isv_tokenAlias && customFields?.isv_cardExpiryMonth && customFields?.isv_cardExpiryYear && undefined !== customFields?.isv_addressId) {
              parsedTokens = paymentUtils.updateParsedToken(existingTokens[finalTokenIndex], customFields, paymentInstrumentId, customerTokenId, customFields?.isv_addressId);
              if (0 < Object.keys(parsedTokens).length) {
                existingTokens[finalTokenIndex] = JSON.stringify(parsedTokens);
              }
            } else {
              newTokenFlag = true;
              tokensExists = true;
            }
          } else {
            newTokenFlag = true;
          }
          if (newTokenFlag && customFields?.isv_tokenAlias && customFields?.isv_cardType && customFields?.isv_maskedPan && customFields?.isv_cardExpiryMonth && customFields?.isv_cardExpiryYear) {
            const tokenData = await paymentUtils.createTokenData(customFields, customerObj, paymentInstrumentId, instrumentIdentifier, customerTokenId, billToFields);
            if (tokensExists) {
              finalTokenIndex = existingTokens.length;
              existingTokens[finalTokenIndex] = JSON.stringify(tokenData);
            } else {
              existingTokens = [JSON.stringify(tokenData)];
            }
            customerTokenResponse = paymentService.getUpdateTokenActions(existingTokens, customFields.isv_failedTokens, true, customerObj, null, customerTokenId);
          } else {
            customerTokenResponse = paymentService.getUpdateTokenActions(existingTokens, customFields?.isv_failedTokens, false, customerObj, null, customerTokenId);
          }
        } else {
          if (Constants.UC_ADDRESS === customFields?.isv_addressId) {
            addressIdField = '';
          } else if (customFields?.isv_addressId) {
            addressIdField = customFields.isv_addressId;
          }
          if (customFields?.isv_tokenAlias && customFields.isv_cardType && customFields.isv_maskedPan && customFields.isv_cardExpiryMonth && customFields.isv_cardExpiryYear) {
            existingFailedTokens = await paymentUtils.createFailedTokenData(customFields, addressIdField);
          }
          if (customerObj?.custom?.fields?.isv_tokens && customerObj.custom.fields.isv_tokens?.length) {
            existingTokens = customerObj.custom.fields.isv_tokens;
          }
          customerTokenResponse = paymentService.getUpdateTokenActions(existingTokens, existingFailedTokens, true, customerObj, null);
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddCardHandler', Constants.LOG_ERROR, 'CustomerId : ' + customerId, Constants.ERROR_MSG_SERVICE_PROCESS);
        }
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAddCardHandler', Constants.LOG_ERROR, 'CustomerId : ' + customerId, Constants.ERROR_MSG_INVALID_INPUT);
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAddCardHandler', Constants.EXCEPTION_MSG_ADDING_A_CARD, exception, customerId, 'CustomerId : ', '');
  }
  return customerTokenResponse;
};

const reportHandler = async () => {
  let conversionDetails;
  let conversionDetailsData;
  let isDecisionSynced = false;
  let isConversionPresent = false;
  const decisionSyncResponse: reportResponseType = {
    message: '',
    error: '',
  };
  try {
    if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_DECISION_SYNC) {
      const decisionSyncArray = await multiMid.getAllMidDetails();
      decisionSyncArray.push({
        merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
        merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
        merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
      });
      if (process.env.PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID) {
        const decisionSyncMids = process.env.PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID;
        const decisionMidsArray = decisionSyncMids.split(Constants.REGEX_COMMA);
        if (decisionMidsArray && 0 < decisionMidsArray.length) {
          for (let decisionElement of decisionSyncArray) {
            if (decisionElement.merchantId && decisionMidsArray.includes(decisionElement.merchantId)) {
              conversionDetails = await conversion.conversionDetails(decisionElement);
              if (conversionDetails && Constants.HTTP_OK_STATUS_CODE === conversionDetails.status) {
                conversionDetailsData = conversionDetails?.data;
                isConversionPresent = await paymentService.decisionSyncService(conversionDetailsData);
                if (isConversionPresent) {
                  isDecisionSynced = true;
                }
              }
            }
          }
        }
        isDecisionSynced ? (decisionSyncResponse.message = Constants.SUCCESS_MSG_DECISION_SYNC_SERVICE) : (decisionSyncResponse.error = Constants.ERROR_MSG_NO_SYNC_DETAILS);
      } else {
        decisionSyncResponse.error = Constants.ERROR_MSG_ENABLE_DECISION_SYNC_MIDS;
      }
    } else {
      decisionSyncResponse.error = Constants.ERROR_MSG_ENABLE_DECISION_SYNC;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncReportHandler', Constants.EXCEPTION_MSG_CONVERSION_DETAILS, exception, '', '', '');
    decisionSyncResponse.error = Constants.ERROR_MSG_SYNC_PAYMENT_DETAILS;
  }
  return decisionSyncResponse;
};

const syncHandler = async () => {
  let createSearchResponse;
  let transactionSummaries;
  let paymentDetails: paymentType | null;
  let updateSyncResponse;
  let syncPresent = false;
  const syncResponse = {
    message: '',
    error: '',
  };
  const midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  let multiMidArray;
  try {
    if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_RUN_SYNC) {
      multiMidArray = await multiMid.getAllMidDetails();
      multiMidArray.push(midCredentials);
      for (let midElement of multiMidArray) {
        createSearchResponse = await createSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, Constants.STRING_SYNC_SORT, midElement);
        if (createSearchResponse && Constants.HTTP_SUCCESS_STATUS_CODE === createSearchResponse?.httpCode && createSearchResponse?.data && createSearchResponse.data?._embedded && createSearchResponse.data._embedded?.transactionSummaries) {
          transactionSummaries = createSearchResponse.data._embedded.transactionSummaries;
          for (let element of transactionSummaries) {
            paymentDetails = await commercetoolsApi.retrievePayment(element.clientReferenceInformation.code);
            if (paymentDetails && Constants.STRING_TRANSACTIONS in paymentDetails) {
              updateSyncResponse = await paymentService.retrieveSyncResponse(paymentDetails, element);
              if (updateSyncResponse) {
                syncPresent = true;
              }
            }
          }
        }
      }
      syncPresent ? (syncResponse.message = Constants.SUCCESS_MSG_SYNC_SERVICE) : (syncResponse.error = Constants.ERROR_MSG_NO_SYNC_DETAILS);
    } else {
      syncResponse.error = Constants.ERROR_MSG_ENABLE_SYNC;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncSyncHandler', Constants.EXCEPTION_MSG_SYNC_DETAILS, exception, '', '', '');
    syncResponse.error = Constants.ERROR_MSG_SYNC_PAYMENT_DETAILS;
  }
  return syncResponse;
};

const networkTokenHandler = async (customerTokenId: string, retrieveTokenDetailsResponse: instrumentIdResponse) => {
  let parsedTokens = [];
  let response;
  let stringifiedTokens = [];
  if (Constants.HTTP_OK_STATUS_CODE === retrieveTokenDetailsResponse?.httpCode) {
    const fetchedCustomers = await commercetoolsApi.retrieveCustomerByCustomField('isv_customerId', customerTokenId);
    const customerObj = fetchedCustomers?.results[0];
    if (customerObj && customerObj?.custom && customerObj.custom?.fields) {
      const existingTokens = customerObj.custom.fields.isv_tokens;
      parsedTokens = await existingTokens.map((token: any) => {
        return JSON.parse(token);
      });
      const tokenToUpdateIndex = parsedTokens.findIndex((card: any) => card.instrumentIdentifier === retrieveTokenDetailsResponse.instrumentIdentifier);
      if (-1 < tokenToUpdateIndex) {
        parsedTokens[tokenToUpdateIndex].cardExpiryMonth = retrieveTokenDetailsResponse.expirationMonth;
        parsedTokens[tokenToUpdateIndex].cardExpiryYear = retrieveTokenDetailsResponse.expirationYear;
        parsedTokens[tokenToUpdateIndex].cardNumber = parsedTokens[tokenToUpdateIndex].cardNumber.slice(0, -4) + retrieveTokenDetailsResponse.cardSuffix;
        stringifiedTokens = parsedTokens.map((token: any) => {
          return JSON.stringify(token);
        });
        response = await commercetoolsApi.updateCustomerToken(stringifiedTokens, customerObj, null);
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncNetworkTokenHandler', Constants.LOG_INFO, 'CustomerId : ' + '', Constants.ERROR_MSG_CUSTOMER_WITH_INSTRUMENT_ID_NOT_FOUND);
      response = null;
    }
  } else {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncNetworkTokenHandler', Constants.LOG_INFO, 'CustomerId : ' + '', Constants.ERROR_MSG_INSTRUMENT_ID_RESPONSE);
  }
  return response;
};

const webhookSubscriptionHandler = async (midCredentials: midCredentialsType) => {
  const createSubscriptionResponseObject = {
    httpCode: 0,
    merchantId: '',
    key: '',
    keyId: '',
    keyExpiration: '',
    subscriptionId: '',
    subscriptionPresent: false,
  };
  let responseForKeyGeneration: any;
  let responseForSubscription: any;
  let responseForGetSubscription;
  let subscriptionObject;
  let deleteWebhookResponse = {
    httpCode: 0,
  };
  try {
    if (midCredentials?.merchantId && midCredentials?.merchantKeyId && midCredentials?.merchantSecretKey && process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL) {
      responseForGetSubscription = await getWebhookSubscriptionDetails.getWebhookSubscriptionResponse(midCredentials);
      responseForKeyGeneration = await keyGeneration.keyGenerationResponse(midCredentials);
      if (Constants.HTTP_SUCCESS_STATUS_CODE === responseForKeyGeneration?.httpCode) {
        createSubscriptionResponseObject.httpCode = responseForKeyGeneration?.httpCode;
        createSubscriptionResponseObject.merchantId = responseForKeyGeneration.organizationId;
        createSubscriptionResponseObject.key = responseForKeyGeneration.key;
        createSubscriptionResponseObject.keyId = responseForKeyGeneration.keyId;
        createSubscriptionResponseObject.keyExpiration = responseForKeyGeneration.keyExpiration;
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncWebhookSubscriptionHandler', Constants.LOG_INFO, '', JSON.stringify(responseForGetSubscription));
      }
      if (responseForGetSubscription) {
        subscriptionObject = await paymentService.verifySubscription(responseForGetSubscription, midCredentials.merchantId);
        if (!subscriptionObject.isSubscribed && !subscriptionObject.presentInCustomObject) {
          responseForSubscription = await webhookSubscriptionService.webhookSubscriptionResponse(midCredentials);
          if (responseForSubscription && Constants.HTTP_SUCCESS_STATUS_CODE === responseForSubscription?.httpCode && responseForSubscription?.webhookId) {
            createSubscriptionResponseObject.subscriptionId = responseForSubscription.webhookId;
          } else {
            createSubscriptionResponseObject.httpCode = responseForSubscription?.httpCode;
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncWebhookSubscriptionHandler', Constants.LOG_INFO, '', JSON.stringify(responseForSubscription));
          }
        } else if ((subscriptionObject?.isSubscribed && subscriptionObject?.webhookId && !subscriptionObject.presentInCustomObject) || !subscriptionObject.urlVerified) {
          deleteWebhookResponse = await deleteWebhookSubscription.deleteWebhookSubscriptionResponse(midCredentials, subscriptionObject.webhookId);
          if (Constants.HTTP_OK_STATUS_CODE === deleteWebhookResponse?.httpCode) {
            responseForSubscription = await webhookSubscriptionService.webhookSubscriptionResponse(midCredentials);
            if (responseForSubscription && Constants.HTTP_SUCCESS_STATUS_CODE === responseForSubscription?.httpCode && responseForSubscription?.webhookId) {
              createSubscriptionResponseObject.subscriptionId = responseForSubscription.webhookId;
            } else {
              createSubscriptionResponseObject.httpCode = responseForSubscription?.httpCode;
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncWebhookSubscriptionHandler', Constants.LOG_INFO, '', JSON.stringify(createSubscriptionResponseObject));
            }
          } else {
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncWebhookSubscriptionHandler', Constants.LOG_INFO, '', Constants.ERROR_MSG_DELETE_SUBSCRIPTION);
          }
        } else if (subscriptionObject?.isSubscribed && subscriptionObject?.presentInCustomObject && subscriptionObject?.key && subscriptionObject.keyId && subscriptionObject.webhookId) {
          createSubscriptionResponseObject.subscriptionPresent = true;
          createSubscriptionResponseObject.key = subscriptionObject.key;
          createSubscriptionResponseObject.keyId = subscriptionObject.keyId;
          createSubscriptionResponseObject.keyExpiration = subscriptionObject.keyExpiration;
          createSubscriptionResponseObject.merchantId = subscriptionObject.merchantId;
          createSubscriptionResponseObject.subscriptionId = subscriptionObject.webhookId;
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncWebhookSubscriptionHandler', Constants.LOG_INFO, '', Constants.ERROR_MSG_SUBSCRIPTION_ALREADY_EXIST);
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncWebhookSubscriptionHandler', Constants.LOG_INFO, '', Constants.ERROR_MSG_PROCESSING_SUBSCRIPTION);
        }
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncWebhookSubscriptionHandler', Constants.LOG_INFO, '', Constants.ERROR_MSG_PROCESSING_SUBSCRIPTION);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncWebhookSubscriptionHandler', '', exception, '', '', '');
  }
  return createSubscriptionResponseObject;
};
export default {
  authorizationHandler,
  payerAuthReversalHandler,
  applePaySessionHandler,
  orderManagementHandler,
  updateCardHandler,
  deleteCardHandler,
  reportHandler,
  syncHandler,
  addCardHandler,
  setTokenNullHandler,
  paymentAuthHandler,
  orderManagementChargeHandler,
  orderManagementAuthReversalHandler,
  networkTokenHandler,
  webhookSubscriptionHandler,
};
