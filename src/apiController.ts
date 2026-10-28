import { Payment, TransactionDraft } from '@commercetools/platform-sdk';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { CustomMessages } from './constants/customMessages';
import { FunctionConstant } from './constants/functionConstant';
import { Constants } from './constants/paymentConstants';
import captureContext from './service/payment/CaptureContextService';
import { ActionResponseType, AmountPlannedType, CustomerTokensType } from './types/Types';
import { ApiError, errorHandler, PaymentProcessingError } from './utils/ErrorHandler';
import paymentActions from './utils/PaymentActions';
import paymentHandler from './utils/PaymentHandler';
import paymentUtils from './utils/PaymentUtils';
import commercetoolsApi from './utils/api/CommercetoolsApi';
import multiMid from './utils/config/MultiMid';
import networkTokenHelper from './utils/helpers/NetworkTokenHelper';
import orderManagementHelper from './utils/helpers/OrderManagementHelper';
import paymentHelper from './utils/helpers/PaymentHelper';
import syncHelper from './utils/helpers/SyncHelper';
import webhookHelper from './utils/helpers/WebhookHelper';
import keyVerification from './service/payment/GetPublicKeys';

const buildErrorResponse = (exception: unknown, fallbackMessage: string): { errorMessage: string; successMessage: string } => {
  const errorMessage = exception instanceof Error && exception.message ? exception.message : fallbackMessage;
  return {
    errorMessage,
    successMessage: '',
  };
};

const runSavedCardPreflightRefresh = async (selectedSavedToken: string): Promise<void> => {
  if (!selectedSavedToken) {
    return;
  }
  const tokenOwnerCustomer = await commercetoolsApi.getCustomerBySavedToken(selectedSavedToken);
  if (tokenOwnerCustomer?.custom?.fields?.isv_tokens?.length) {
    const originalTokens = tokenOwnerCustomer.custom.fields.isv_tokens;
    const refreshedTokens = await networkTokenHelper.refreshNetworkTokenCards(originalTokens, tokenOwnerCustomer);
    const changed = JSON.stringify(originalTokens) !== JSON.stringify(refreshedTokens);
    if (changed) {
      await commercetoolsApi.updateCustomerToken(refreshedTokens, tokenOwnerCustomer, tokenOwnerCustomer?.custom?.fields?.isv_failedTokens || [], tokenOwnerCustomer?.custom?.fields?.isv_customerId || null);
    }
  }
};
/**
 * Allowed fields for the CustomerTokensType schema.
 * Only these string fields are expected in a valid token object.
 */
const ALLOWED_TOKEN_FIELDS: (keyof CustomerTokensType)[] = ['value', 'paymentToken', 'instrumentIdentifier', 'cardType', 'cardName', 'cardNumber', 'cardExpiryMonth', 'cardExpiryYear', 'addressId', 'timestamp', 'address', 'paymentMethod', 'accountNumber', 'routingNumber', 'accountType'];

/**
 * Validates the parsed token object against the expected CustomerTokensType schema.
 * Ensures the object is a plain object, contains only allowed fields,
 * and that required fields (paymentToken, value) are non-empty strings.
 *
 * @param {any} tokenObj - The parsed token object to validate.
 * @returns {boolean} - True if the object conforms to the expected schema.
 */
const isValidTokenSchema = (tokenObj: any): tokenObj is Partial<CustomerTokensType> => {
  if (!tokenObj || 'object' !== typeof tokenObj || Array.isArray(tokenObj)) {
    return false;
  }
  const tokenKeys = Object.keys(tokenObj);
  for (const key of tokenKeys) {
    if (!ALLOWED_TOKEN_FIELDS.includes(key as keyof CustomerTokensType)) {
      return false;
    }
  }
  if (!tokenObj.paymentToken || 'string' !== typeof tokenObj.paymentToken || 0 === tokenObj.paymentToken.trim().length) {
    return false;
  }
  if (!tokenObj.value || 'string' !== typeof tokenObj.value || 0 === tokenObj.value.trim().length) {
    return false;
  }
  for (const key of tokenKeys) {
    if ('address' !== key && undefined !== tokenObj[key] && 'string' !== typeof tokenObj[key]) {
      return false;
    }
  }
  return true;
};

/**
 * Verifies that the token identified by paymentToken belongs to the customer
 * by fetching the customer's authoritative isv_tokens from the server-side
 * commercetools API and validating the paymentToken against that source.
 *
 * @param {string} paymentToken - The paymentToken to verify ownership of.
 * @param {string} customerId - The customer ID to fetch authoritative data for.
 * @returns {Promise<boolean>} - True if the paymentToken is found in the customer's server-side tokens.
 */
const isTokenOwnedByCustomer = async (paymentToken: string, customerId: string): Promise<boolean> => {
  if (!paymentToken || !customerId) {
    return false;
  }
  const customerInfo = await commercetoolsApi.getCustomer(customerId);
  const serverTokens = customerInfo?.custom?.fields?.isv_tokens;
  if (!serverTokens || !Array.isArray(serverTokens) || 0 === serverTokens.length) {
    return false;
  }
  for (const tokenStr of serverTokens) {
    try {
      const token = JSON.parse(tokenStr);
      if (token && token.paymentToken === paymentToken) {
        return true;
      }
    } catch {
      continue;
    }
  }
  return false;
};

/**
 * Handles the creation of payment.
 *
 * @param {Payment} paymentObj - The payment object containing payment information.
 * @returns {Promise<ActionResponseType>} - A promise resolving to an action response type.
 */
const paymentCreateApi = async (paymentObj: Payment): Promise<ActionResponseType> => {
  let response: ActionResponseType = paymentUtils.getEmptyResponse();
  const captureContextSignature = paymentObj?.custom?.fields?.isv_tokenCaptureContextSignature;
  if (captureContextSignature) {
    const verifiedCaptureContext = await keyVerification.getPublicKeys(captureContextSignature, paymentObj);
    if (!verifiedCaptureContext) {
      return response;
    }
  }
  if (paymentObj?.custom?.fields?.isv_transientToken || paymentObj?.custom?.fields?.isv_token) {
    response = await paymentHelper.createCompletionTransactions(paymentObj);
  }
  return response;
};

/**
 * Handles the update of a payment.
 *
 * @param {Payment} paymentObj - The payment object containing payment information.
 * @returns {Promise<ActionResponseType>} - A promise resolving to an action response type.
 */
const paymentUpdateApi = async (paymentObj: Payment): Promise<ActionResponseType> => {
  if (paymentObj?.id && paymentObj.paymentMethodInfo?.method && paymentObj.transactions?.length) {
    return paymentHelper.processTransaction(paymentObj);
  }
  return paymentUtils.getEmptyResponse();
};

/**
 * Handles the update of a customer.
 *
 * @param {any} customerObj - The customer object containing customer information.
 * @returns {Promise<ActionResponseType>} - A promise resolving to an action response type.
 */
const customerUpdateApi = async (customerObj: any): Promise<ActionResponseType> => {
  let response: ActionResponseType = paymentUtils.getEmptyResponse();

  try {
    if (customerObj) {
      const { isv_addressId, isv_tokens, isv_tokenAction, isv_failedTokens } = customerObj?.custom?.fields;

      const isv_token = customerObj?.custom?.fields?.isv_token;
      const selectedAddressId = customerObj?.custom?.fields?.isv_selectedAddressId;

      const hasNewUcSaveCardToken = Boolean(isv_token) && Boolean(isv_addressId) && !isv_tokenAction;

      if (hasNewUcSaveCardToken) {
        if (customerObj?.addresses) {
          if (isv_token && isv_token.trim()) {
            response = await paymentHelper.processMyAccountsUcTokenSave(customerObj, isv_token, selectedAddressId);
          } else {
            paymentUtils.logData(__filename, 'customerUpdateApi', Constants.LOG_WARN, customerObj?.id || '', '[MyAccounts] No UC completion token supplied. Skipping token save.');
            response = paymentUtils.getEmptyResponse();
          }
        } else {
          paymentUtils.logData(__filename, 'customerUpdateApi', Constants.LOG_WARN, '', '[UC MyAccount SaveCard] No billing address available.');
        }
      } else if (isv_tokens && 0 < isv_tokens?.length) {
        if (isv_tokenAction) {
          const tokensToUpdate = JSON.parse(customerObj.custom.fields.isv_tokens[0]);

          if (Constants.ISV_TOKEN_ACTION_DELETE === isv_tokenAction || Constants.ISV_TOKEN_ACTION_UPDATE === isv_tokenAction) {
            if (!isValidTokenSchema(tokensToUpdate) || !(await isTokenOwnedByCustomer(tokensToUpdate.paymentToken as string, customerObj.id))) {
              paymentUtils.logData(__filename, FunctionConstant.FUNC_CUSTOMER_UPDATE_API, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_INVALID_TOKEN_DATA);

              return response;
            }
          }
          switch (isv_tokenAction) {
            case Constants.ISV_TOKEN_ACTION_DELETE:
              response = await paymentHandler.handleCardDeletion(tokensToUpdate, customerObj.id);
              break;

            case Constants.ISV_TOKEN_ACTION_UPDATE:
              response = await paymentHandler.handleUpdateCard(tokensToUpdate, customerObj.id, customerObj);
              break;

            default:
              response = paymentActions.getUpdateTokenActions(isv_tokens, isv_failedTokens, true, customerObj, null);
          }
        } else {
          response = paymentUtils.getEmptyResponse();
        }
      }
    }
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_UPDATE_CUSTOMER_API, exception, FunctionConstant.FUNC_CUSTOMER_UPDATE_API), __filename, '');
  }

  return response;
};



/**
 * Retrieves payment details and cart details via API.
 *
 * @param {string} paymentId - The ID of the payment to retrieve details for.
 * @returns {Promise<{
 *   paymentId: string;
 *   locale: string;
 *   pendingAuthorizedAmount: number;
 *   pendingCaptureAmount: number;
 *   errorMessage: string;
 *   paymentDetails: Payment;
 *   cartData: any;
 *   orderNo: string;
 * }>} - A promise resolving to an object containing payment details.
 */
const paymentDetailsApi = async (paymentId: string) => {
  let isAuthReversed = false;
  const paymentDetailsResponse = {
    paymentId: '',
    locale: '',
    pendingAuthorizedAmount: 0,
    pendingCaptureAmount: 0,
    errorMessage: CustomMessages.ERROR_MSG_EMPTY_PAYMENT_DATA,
    paymentDetails: {},
    cartData: {},
    orderNo: '',
  };
  let paymentDetails: Payment | null = null;
  let refundTransaction: readonly TransactionDraft[];
  try {
    if (Constants.STR_STRING === typeof paymentId && paymentId) {
      paymentDetailsResponse.paymentId = paymentId.replace(Constants.FORMAT_PAYMENT_ID_REGEX, '');
      const cartDetails = await commercetoolsApi.queryCartById(paymentDetailsResponse.paymentId, Constants.PAYMENT_ID);
      if (cartDetails?.count) {
        const cartData = cartDetails?.results[0];
        if (cartData && cartData?.locale) {
          paymentDetailsResponse.cartData = cartData;
          paymentDetailsResponse.locale = cartData.locale;
        }
      }
      paymentDetails = await commercetoolsApi.retrievePayment(paymentDetailsResponse.paymentId);
      if (paymentDetails) {
        paymentDetailsResponse.errorMessage = '';
        paymentDetailsResponse.orderNo = await paymentUtils.getOrderId(cartDetails?.results[0]?.id, paymentDetails?.id);
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
              paymentDetailsResponse.pendingCaptureAmount = orderManagementHelper.getCapturedAmount(paymentDetails);
              paymentDetailsResponse.pendingAuthorizedAmount = orderManagementHelper.getAuthorizedAmount(paymentDetails);
            }
          }
        }
      } else {
        errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS, '', FunctionConstant.FUNC_PAYMENT_DETAILS_API), __filename, 'PaymentId :' + encodeURI(paymentDetailsResponse?.paymentId) || '');
      }
    }
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_MSG_PAYMENT_DETAILS_API, exception, FunctionConstant.FUNC_PAYMENT_DETAILS_API), __filename, encodeURI(paymentDetailsResponse?.paymentId));
  }
  return paymentDetailsResponse;
};

/**
 * Handles the ordermanagement services for a payment.
 *
 * @param {string} paymentId - The ID of the payment to manage transactions for.
 * @param {number | undefined} transactionAmount - The amount of the transaction.
 * @param {string} transactionType - The type of the transaction (charge, refund, or authorization reversal).
 * @returns {Promise<{
 *   errorMessage: string;
 *   successMessage: string;
 * }>} - A promise resolving to an object containing the API response.
 */
const orderManagementApi = async (
  paymentId: string,
  transactionAmount: number | undefined,
  transactionType: string,
): Promise<{
  errorMessage: string;
  successMessage: string;
}> => {
  let pendingAmount;
  let paymentObject: Payment | null = null;
  let amountPlanned = {} as AmountPlannedType;

  const apiResponse = {
    errorMessage: '',
    successMessage: '',
  };

  try {
    if (paymentId) {
      paymentObject = await commercetoolsApi.retrievePayment(paymentId);

      if (paymentObject) {
        const fractionDigits = paymentObject?.amountPlanned?.fractionDigits;

        switch (transactionType) {
          case Constants.CT_TRANSACTION_TYPE_CHARGE:
            pendingAmount = orderManagementHelper.getAuthorizedAmount(paymentObject);
            break;

          case Constants.CT_TRANSACTION_TYPE_REFUND:
            pendingAmount = orderManagementHelper.getCapturedAmount(paymentObject);
            break;
        }

        if (Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION === transactionType) {
          amountPlanned = { ...paymentObject.amountPlanned };

          const transactionObject = paymentUtils.createTransactionObject(paymentObject.version, amountPlanned, transactionType, Constants.CT_TRANSACTION_STATE_INITIAL, undefined, undefined);

          const addTransaction = await commercetoolsApi.addTransaction(transactionObject, paymentId);

          if (addTransaction && addTransaction.transactions?.length) {
            const transactionLength = addTransaction.transactions.length;
            const latestTransaction = addTransaction.transactions[transactionLength - 1];

            if (latestTransaction && Constants.CT_TRANSACTION_STATE_SUCCESS === latestTransaction.state) {
              if (latestTransaction?.type) {
                apiResponse.successMessage = paymentUtils.handleOmSuccessMessage(latestTransaction.type);
              }
            } else {
              apiResponse.errorMessage = paymentUtils.handleOMErrorMessage(2, transactionType);
            }
          } else {
            apiResponse.errorMessage = CustomMessages.ERROR_MSG_ADD_TRANSACTION_DETAILS;
          }
        } else if (0 === transactionAmount) {
          apiResponse.errorMessage = paymentUtils.handleOMErrorMessage(0, transactionType);
        } else if (transactionAmount !== undefined && transactionAmount < 0) {
          apiResponse.errorMessage = paymentUtils.handleOMErrorMessage(0, transactionType);
        } else if (pendingAmount && transactionAmount && transactionAmount > pendingAmount) {
          apiResponse.errorMessage = paymentUtils.handleOMErrorMessage(1, transactionType);
        } else {
          amountPlanned = { ...paymentObject.amountPlanned };

          if (transactionAmount !== undefined) {
            amountPlanned.centAmount = paymentUtils.convertAmountToCent(transactionAmount, fractionDigits);
          }

          const transactionObject = paymentUtils.createTransactionObject(paymentObject.version, amountPlanned, transactionType, Constants.CT_TRANSACTION_STATE_INITIAL, undefined, undefined);

          const addTransaction = await commercetoolsApi.addTransaction(transactionObject, paymentId);

          if (addTransaction && addTransaction.transactions?.length) {
            const transactionLength = addTransaction.transactions.length;
            const latestTransaction = addTransaction.transactions[transactionLength - 1];

            if (latestTransaction && Constants.CT_TRANSACTION_STATE_SUCCESS === latestTransaction.state) {
              if (latestTransaction?.type) {
                apiResponse.successMessage = paymentUtils.handleOmSuccessMessage(latestTransaction.type);
              }
            } else {
              apiResponse.errorMessage = paymentUtils.handleOMErrorMessage(2, transactionType);
            }
          } else {
            apiResponse.errorMessage = CustomMessages.ERROR_MSG_ADD_TRANSACTION_DETAILS;
          }
        }
      } else {
        apiResponse.errorMessage = CustomMessages.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS;
      }
    }
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_API_EXECUTION, exception, FunctionConstant.FUNC_ORDER_MANAGEMENT_API), __filename, '');
  }

  return apiResponse;
};

/**
 * Handles generation of capture context.
 *
 * @param {object} requestObj - The request object containing either cart details or country, locale, and currency information.
 * @returns {Promise<string>} - A promise resolving to the capture context response.
 */
const captureContextApi = async (requestObj: any): Promise<any> => {
  let cartId = requestObj?.cartId || '';
  let clientReferenceCode = requestObj?.clientReferenceCode || '';
  let response;
  let captureContextResponse;
  const merchantId = requestObj?.merchantId ? requestObj.merchantId : '';
  const overrides: { completeType?: string; enable3DS?: boolean; challengeCode04?: boolean; isSavedCard?: boolean } = {};

  if (undefined !== requestObj?.challengeCode04) {
    overrides.challengeCode04 = true === requestObj.challengeCode04 || 'true' === requestObj.challengeCode04;
  }

  if (undefined !== requestObj?.isSavedCard) {
    overrides.isSavedCard = true === requestObj.isSavedCard || 'true' === requestObj.isSavedCard;
  }

  const unifiedCheckoutFields = {
    ...(requestObj?.customFields || requestObj || {}),
    ...(requestObj?.paymentInstrumentId ? { paymentInstrumentId: requestObj.paymentInstrumentId } : {}),
    ...(requestObj?.paymentToken ? { paymentToken: requestObj.paymentToken } : {}),
    ...(requestObj?.savedToken ? { savedToken: requestObj.savedToken } : {}),
    ...(requestObj?.isv_savedToken ? { isv_savedToken: requestObj.isv_savedToken } : {}),
  };

  try {
    const ipAddress = requestObj?.ipAddress || requestObj?.headers?.['x-forwarded-for'] || requestObj?.headers?.['remote_addr'] || '';
    const selectedSavedToken = paymentUtils.resolveSavedTokenFromUnifiedFields(unifiedCheckoutFields);
    if (overrides?.isSavedCard || !!selectedSavedToken) {
      await runSavedCardPreflightRefresh(selectedSavedToken);
    }

    await webhookHelper.activateUnifiedCheckoutWebhookStatus(merchantId || process.env.PAYMENT_GATEWAY_MERCHANT_ID || '');

    if (requestObj?.cartId) {
      const cartDetails = await commercetoolsApi.getCartById(cartId);
      if (cartDetails && cartDetails?.id) {
        const fallbackLocale = requestObj?.locale || '';
        const fallbackCountry = requestObj?.country || '';
        const fallbackCurrency = requestObj?.currency || '';
        captureContextResponse = await captureContext.generateCaptureContext(cartDetails, fallbackCountry, fallbackLocale, fallbackCurrency, merchantId, 'Payments', overrides, ipAddress, unifiedCheckoutFields, undefined, undefined, clientReferenceCode);
      }
    } else if (requestObj?.country && requestObj?.locale && requestObj?.currency) {
      const country = requestObj.country;
      const locale = requestObj.locale;
      const currencyCode = requestObj.currency;
      captureContextResponse = await captureContext.generateCaptureContext(null, country, locale, currencyCode, merchantId, 'MyAccounts', overrides, ipAddress, unifiedCheckoutFields, { billTo: requestObj?.billTo, shipTo: requestObj?.shipTo }, undefined, clientReferenceCode);
    }
    let jwtToProcess = captureContextResponse;
    if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED) && captureContextResponse) {
      const responseMleCredentials = multiMid.getKeyCredentials(merchantId || process.env.PAYMENT_GATEWAY_MERCHANT_ID || '');
      const hasMerchantResponseMleConfig = Boolean(responseMleCredentials?.responseMlePrivateKeyFile || responseMleCredentials?.responseMlePrivateKeyUrl);
      const responseMlePrivateKeyFile = hasMerchantResponseMleConfig ? responseMleCredentials.responseMlePrivateKeyFile : process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE;
      const responseMlePrivateKeyPassword = hasMerchantResponseMleConfig ? responseMleCredentials.responseMlePrivateKeyPassword : process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD;
      const isEncrypted = captureContextResponse.includes('encryptedResponse') || ('string' === typeof captureContextResponse && 5 === captureContextResponse.split('.').length);
      if (isEncrypted && responseMlePrivateKeyFile && responseMlePrivateKeyPassword) {
        const decryptedJwt = await paymentUtils.decryptResponseMlePayload(captureContextResponse, responseMlePrivateKeyFile, responseMlePrivateKeyPassword, merchantId || process.env.PAYMENT_GATEWAY_MERCHANT_ID || 'default');

        if (decryptedJwt) {
          jwtToProcess = decryptedJwt;
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_CAPTURE_CONTEXT_API, Constants.LOG_WARN, 'CartId : ' + cartId, '[CaptureContext] Failed to decrypt Response MLE payload. Proceeding with original response.');
        }
      }
    }
    let decodedCaptureContext;
    try {
      decodedCaptureContext = jwt.decode(jwtToProcess);
      if (!decodedCaptureContext) {
        throw new Error('jwt.decode returned null');
      }
    } catch (decodeError) {
      try {
        if (!jwtToProcess) {
          throw new Error('jwtToProcess is undefined');
        }
        decodedCaptureContext = jwtDecode(jwtToProcess);
      } catch (fallbackDecodeError) {
        const decodeErrorMsg = decodeError instanceof Error ? decodeError.message : String(decodeError);
        const fallbackErrorMsg = fallbackDecodeError instanceof Error ? fallbackDecodeError.message : String(fallbackDecodeError);
        const jwtPreview = jwtToProcess ? jwtToProcess.substring(0, 200) + '...' : 'jwtToProcess is undefined';
        paymentUtils.logData(__filename, FunctionConstant.FUNC_CAPTURE_CONTEXT_API, Constants.LOG_ERROR, 'CartId : ' + cartId, '[CaptureContext JWT Decode Error] decoders failed. jwt.decode: ' + decodeErrorMsg + ' | jwt-decode: ' + fallbackErrorMsg + '. JWT (first 200 chars): ' + jwtPreview,);
        decodedCaptureContext = undefined;
      }
    }

    if (jwtToProcess && decodedCaptureContext) {
      const clientLibrary = decodedCaptureContext?.data?.clientLibrary || decodedCaptureContext?.ctx?.[0]?.data?.clientLibrary;
      const clientLibraryIntegrity = decodedCaptureContext?.data?.clientLibraryIntegrity || decodedCaptureContext?.ctx?.[0]?.data?.clientLibraryIntegrity;
      let captureContextClientRefCode = decodedCaptureContext?.data?.clientReferenceInformation?.code || decodedCaptureContext?.ctx?.[0]?.data?.clientReferenceInformation?.code || '';
      if (!captureContextClientRefCode && clientReferenceCode) {
        captureContextClientRefCode = clientReferenceCode;
      }
      if (clientLibrary && clientLibraryIntegrity) {
        response = {
          captureContextData: jwtToProcess,
          clientLibrary: clientLibrary,
          clientLibraryIntegrity: clientLibraryIntegrity,
          captureContextClientRefCode: captureContextClientRefCode,
        };
      }
    }
    if (!response) {
      errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_CAPTURE_CONTEXT, '', FunctionConstant.FUNC_CAPTURE_CONTEXT_API), __filename, 'CartId : ' + cartId);
      response = buildErrorResponse('', CustomMessages.ERROR_MSG_CAPTURE_CONTEXT);
    }
  } catch (exception) {
    const errorResponse = buildErrorResponse(exception, CustomMessages.EXCEPTION_MSG_CAPTURE_CONTEXT_API);
    errorHandler.logError(new PaymentProcessingError(errorResponse.errorMessage, exception, FunctionConstant.FUNC_CAPTURE_CONTEXT_API), __filename, '');
    response = errorResponse;
  }
  return response;
};

/**
 * Handles network token update notifications.
 *
 * @param {object} notification - The notification object received.
 * @returns {Promise<{
 *   errorMessage: string;
 *   successMessage: string;
 * }>} - A promise resolving to the notification API response.
 */
const notificationApi = async (notification: any): Promise<{ errorMessage: string; successMessage: string }> => {
  const notificationApiResponse = {
    errorMessage: '',
    successMessage: '',
  };
  if (Constants.NETWORK_TOKEN_EVENT === notification?.eventType && notification?.payload && notification.payload[0]?.data) {
    notificationApiResponse.successMessage = 'Network token webhook acknowledged.';
  } else if (Constants.UC_ORDER_TRANSACTION_RESULT_EVENT === notification?.eventType) {
    notificationApiResponse.successMessage = 'UC order transaction result acknowledged.';
  } else {
    notificationApiResponse.errorMessage = CustomMessages.ERROR_MSG_INVALID_NOTIFICATION_DATA;
    paymentUtils.logData(__filename, FunctionConstant.FUNC_NOTIFICATION_API, Constants.LOG_ERROR, '', 'Invalid notification data received.');
  }
  return notificationApiResponse;
};

/**
 * Handles fraud/DM webhook notifications from CyberSource.
 * Processes review decisions (accept/reject) and DM profile rejections.
 * Updates CT payment transaction states accordingly.
 *
 * @param {any} notification - The fraud webhook notification body.
 * @returns {Promise<{ errorMessage: string; successMessage: string; }>} - The response.
 */
const fraudNotificationApi = async (notification: any): Promise<{ errorMessage: string; successMessage: string }> => {
  const response = {
    errorMessage: '',
    successMessage: '',
  };
  try {
    const eventType = notification?.eventType;
    let payload = notification?.payload;
    let payloadArray = [];
    if (Array.isArray(payload)) {
      payloadArray = payload;
    } else if (payload && 'object' === typeof payload) {
      payloadArray = [payload];
    }
    if (!eventType || !payloadArray.length) {
      response.errorMessage = CustomMessages.ERROR_MSG_INVALID_NOTIFICATION_DATA;
      return response;
    }
    const informationalFraudEvents = ['risk.profile.decision.review', 'risk.profile.decision.monitor', 'risk.casemanagement.addnote'];
    const isFraudEvent = [Constants.FRAUD_REVIEW_ACCEPT_EVENT, Constants.FRAUD_REVIEW_REJECT_EVENT, Constants.FRAUD_DM_REJECT_EVENT, ...informationalFraudEvents].includes(eventType);
    if (!isFraudEvent) {
      response.errorMessage = CustomMessages.ERROR_MSG_INVALID_NOTIFICATION_DATA;
      return response;
    }
    if (informationalFraudEvents.includes(eventType)) {
      response.successMessage = 'Fraud management event acknowledged.';
      return response;
    }
    const conversionDetails = [];
    for (const element of payloadArray) {
      const data = element?.data || element;
      if (data) {
        let newDecision = '';
        if ('ACCEPT' === data.reviewerDecision || Constants.FRAUD_REVIEW_ACCEPT_EVENT === eventType) {
          newDecision = Constants.HTTP_STATUS_DECISION_ACCEPT;
        } else if ('REJECT' === data.reviewerDecision || Constants.FRAUD_REVIEW_REJECT_EVENT === eventType || Constants.FRAUD_DM_REJECT_EVENT === eventType) {
          newDecision = Constants.HTTP_STATUS_DECISION_REJECT;
        }
        const merchantReferenceNumber = data?.clientReferenceInformation?.code || data?.merchantReferenceNumber || data?.referenceNumber || '';
        const requestId = data?.id || '';
        if (merchantReferenceNumber || requestId) {
          conversionDetails.push({
            merchantReferenceNumber,
            requestId,
            newDecision,
            fullElement: data,
          });
        }
      }
    }
    if (0 < conversionDetails.length) {
      const isUpdated = await syncHelper.updateDecisionSyncService(conversionDetails);
      if (isUpdated) {
        response.successMessage = CustomMessages.SUCCESS_MSG_DECISION_SYNC_SERVICE;
      } else {
        response.errorMessage = 'No matching pending transactions found for fraud notification';
      }
    } else {
      response.errorMessage = CustomMessages.ERROR_MSG_INVALID_NOTIFICATION_DATA;
    }
  } catch (exception) {
    errorHandler.logError(new ApiError('Exception processing fraud notification', exception, 'fraudNotificationApi'), __filename, '');
    response.errorMessage = 'Exception processing fraud notification';
  }
  return response;
};
/**
 * Refreshes network tokens for a customer by validating each saved token with CyberSource TMS API.
 * Removes expired/deleted tokens and updates card details (expiry, suffix) from CyberSource response.
 *
 * @param {string} customerId - The Commercetools customer ID.
 * @returns {Promise<{ errorMessage: string; successMessage: string; processedCount: number; removedCount: number; updatedCount: number; }>} - Response with refresh summary.
 */
const refreshSavedTokensApi = async (customerId: string): Promise<{ errorMessage: string; successMessage: string; processedCount: number; removedCount: number; updatedCount: number }> => {
  const apiResponse = {
    errorMessage: '',
    successMessage: '',
    processedCount: 0,
    removedCount: 0,
    updatedCount: 0,
  };

  try {
    if (!customerId || 'string' !== typeof customerId || '' === customerId.trim()) {
      apiResponse.errorMessage = 'Missing or invalid customerId parameter';
      paymentUtils.logData(__filename, FunctionConstant.FUNC_REFRESH_SAVED_TOKENS_API, Constants.LOG_ERROR, '', 'refreshSavedTokensApi called with invalid customerId');
      return apiResponse;
    }
    const customerInfo = await commercetoolsApi.getCustomer(customerId);
    if (!customerInfo) {
      apiResponse.errorMessage = 'Customer not found';
      paymentUtils.logData(__filename, FunctionConstant.FUNC_REFRESH_SAVED_TOKENS_API, Constants.LOG_ERROR, 'CustomerId: ' + customerId, 'Customer not found in Commercetools');
      return apiResponse;
    }
    const originalTokens = customerInfo?.custom?.fields?.isv_tokens || [];
    if (!Array.isArray(originalTokens) || 0 === originalTokens.length) {
      apiResponse.successMessage = 'No saved tokens found for customer. Nothing to refresh.';
      apiResponse.processedCount = 0;
      apiResponse.removedCount = 0;
      apiResponse.updatedCount = 0;
      return apiResponse;
    }
    const refreshedTokens = await networkTokenHelper.refreshNetworkTokenCards(originalTokens, customerInfo);
    const originalCount = originalTokens.length;
    const finalCount = refreshedTokens.length;
    const removedCount = originalCount - finalCount;
    apiResponse.processedCount = originalCount;
    apiResponse.removedCount = removedCount;
    apiResponse.updatedCount = finalCount > 0 ? Math.max(0, originalCount - finalCount - (finalCount > 0 ? 0 : originalCount)) : 0;
    if (JSON.stringify(originalTokens) !== JSON.stringify(refreshedTokens)) {
      await commercetoolsApi.updateCustomerToken(refreshedTokens, customerInfo, customerInfo?.custom?.fields?.isv_failedTokens || null, null);
    }

    apiResponse.successMessage = `Network token refresh completed. Processed ${originalCount} tokens, removed ${removedCount} invalid tokens, ${finalCount} tokens remain valid.`;
  } catch (exception) {
    apiResponse.errorMessage = exception instanceof Error ? exception.message : 'Error refreshing saved tokens';
    errorHandler.logError(new PaymentProcessingError(apiResponse.errorMessage, exception, FunctionConstant.FUNC_REFRESH_SAVED_TOKENS_API), __filename, customerId);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_REFRESH_SAVED_TOKENS_API, Constants.LOG_ERROR, 'CustomerId: ' + customerId, apiResponse.errorMessage);
  }

  return apiResponse;
};

export default {
  paymentCreateApi,
  paymentUpdateApi,
  customerUpdateApi,
  paymentDetailsApi,
  captureContextApi,
  notificationApi,
  fraudNotificationApi,
  orderManagementApi,
  refreshSavedTokensApi,
  isValidTokenSchema,
  isTokenOwnedByCustomer,
};
