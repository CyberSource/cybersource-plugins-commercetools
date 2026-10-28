import fs from 'fs';
import os from 'os';
import path from 'path';
import url from 'url';
import { CartPagedQueryResponse, Customer, Payment, Transaction } from '@commercetools/platform-sdk';
import axios from 'axios';
import { PtsV2PaymentsCapturesPost201Response, PtsV2PaymentsPost201Response, PtsV2PaymentsRefundPost201Response, PtsV2PaymentsReversalsPost201Response } from 'cybersource-rest-client';
import createDOMPurify from 'dompurify';
import { stringify } from 'flatted';
import { JSDOM } from 'jsdom';
import cache from 'memory-cache';
import forge from 'node-forge';
import winston from 'winston';
import { format } from 'winston';
import 'winston-daily-rotate-file';
import { CustomMessages } from '../constants/customMessages';
import { FunctionConstant } from '../constants/functionConstant';
import { Constants } from '../constants/paymentConstants';
import { Token } from '../models/TokenModel';
import { ActionResponseType, ActionType, AddressType, AmountPlannedType, CertificateResponseType, CustomerCustomType, CustomerTokensType, ErrorType, LoggerConfigType, PaymentCustomFieldsType, PaymentTransactionType } from '../types/Types';
import { errorHandler, PaymentProcessingError, SystemError, ValidationError } from './ErrorHandler';
import paymentValidator from './PaymentValidator';
import commercetoolsApi from './api/CommercetoolsApi';

const { combine, printf } = format;

/**
 * Handles logging info and errors.
 *
 * @param {string} filePath - Path of the file with filename.
 * @param {string} method - Name of the method.
 * @param {string} type - Log type (e.g., 'info', 'error').
 * @param {string} id - Identifier.
 * @param {string} logMessage - Log message.
 */
const logData = (filePath: string, method: string, type: string, id: string, logMessage: string, consolidatedTime?: string): void => {
  let loggingFormat: winston.Logform.Format;
  let logger: winston.Logger;
  let fileName = path.parse(path.basename(filePath)).name;
  let newDate = getDate(Date.now(), true);
  const sanitizedLogMessage = logMessage.replace(/[\r\n]/g, ' ');
  loggingFormat = printf(({ label, methodName, level, message }) => {
    return `[${newDate}] [${label}] [${methodName}] [${level.toUpperCase()}]` + (id ? ` [${id}]` : '') + (consolidatedTime ? ` [Execution Time: ${consolidatedTime}] Ms` : '') + ` : ${message}`;
  });
  if (Constants.STRING_AZURE !== process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT && Constants.STRING_AWS !== process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
    logger = winston.createLogger({
      level: type,
      format: combine(loggingFormat),
      transports: [
        new winston.transports.DailyRotateFile({
          filename: 'src/loggers/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
    const loggerConfig = {
      label: fileName,
      methodName: method,
      level: type,
      message: sanitizedLogMessage,
    } as Partial<LoggerConfigType>;
    if (id) {
      loggerConfig.id = encodeURI(id);
    }
    if (consolidatedTime) {
      loggerConfig.consolidatedTime = `${consolidatedTime} Ms`;
    }
    logger.log(sanitizeLogData(loggerConfig) as LoggerConfigType);
  }
};

const getDate = (dateInput: Date | string | number | null = null, isReturnTypeString: boolean, modifyMonth: number | null = null, setMonth: number | null = null): any => {
  let currentDate: any = new Date();
  if (dateInput) {
    currentDate = new Date(dateInput);
  }
  if (setMonth !== null) {
    currentDate.setMonth(setMonth);
  }
  if (null !== modifyMonth) {
    currentDate = currentDate.getMonth() + modifyMonth;
  }
  if (currentDate && isReturnTypeString) {
    currentDate = currentDate.toISOString();
  }
  return currentDate;
};

/**
 * Set custom field mapper.
 *
 * @param {PaymentCustomFieldsType} fields - Custom fields object.
 * @returns {ActionType[]} - Array of actions.
 */
const setCustomFieldMapper = (fields: Partial<PaymentCustomFieldsType>): Partial<ActionType>[] => {
  const actions: Partial<ActionType>[] = [];
  let keys: readonly string[];
  keys = Object.keys(fields);
  if (keys) {
    keys.forEach((key) => {
      const value = fields[key as keyof PaymentCustomFieldsType];
      if (value !== undefined) {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: key,
          value: value,
        });
      }
    });
  }
  return actions;
};

/**
 * Set custom fields to null.
 *
 * @param {PaymentCustomFieldsType | CustomerCustomType} fields - Custom fields object.
 * @returns {ActionType[]} - Array of actions.
 */
const setCustomFieldToNull = (fields: Partial<PaymentCustomFieldsType> | Partial<CustomerCustomType>): Partial<ActionType>[] => {
  const actions: Partial<ActionType>[] = [];
  let keys: string[];
  keys = Object.keys(fields);
  if (keys) {
    keys.forEach((key) => {
      actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: key,
        value: null,
      });
    });
  }
  return actions;
};

/**
 * Set transaction ID for a payment.
 *
 * @param {any} paymentResponse - Payment response object.
 * @param {PaymentTransactionType} transactionDetail - Transaction details object.
 * @returns {{ action: string, interactionId: string, transactionId: string }} - Transaction ID data.
 */

const getTransactionIdFromResponse = (paymentResponse: PtsV2PaymentsPost201Response | PtsV2PaymentsCapturesPost201Response | PtsV2PaymentsReversalsPost201Response | PtsV2PaymentsRefundPost201Response | any): string => {
  return paymentResponse?.transactionId || paymentResponse?.data?.id || paymentResponse?.id || paymentResponse?.text?.id || '';
};

const setTransactionId = (paymentResponse: PtsV2PaymentsPost201Response | PtsV2PaymentsCapturesPost201Response | PtsV2PaymentsReversalsPost201Response | PtsV2PaymentsRefundPost201Response, transactionDetail: Partial<PaymentTransactionType>) => {
  const transactionIdData = {
    action: 'changeTransactionInteractionId',
    interactionId: '',
    transactionId: '',
  };
  paymentValidator.setObjectValue(transactionIdData, 'interactionId', { transactionId: getTransactionIdFromResponse(paymentResponse) }, 'transactionId', Constants.STR_STRING, false);
  paymentValidator.setObjectValue(transactionIdData, 'transactionId', transactionDetail, 'id', Constants.STR_STRING, false);
  if (!transactionIdData.interactionId || !transactionIdData.transactionId) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_EMPTY_TRANSACTION_DETAILS, '', FunctionConstant.FUNC_SET_TRANSACTION_ID), __filename, '');
  }
  return transactionIdData;
};

/**
 * Change the state of a transaction.
 *
 * @param {PaymentTransactionType} transactionDetail - Transaction details object.
 * @param {string} state - New state to change to.
 * @returns {{ action: string, state: string, transactionId: string }} - Change state data.
 */
const changeState = (transactionDetail: Partial<PaymentTransactionType>, state: string) => {
  let changeStateData = {
    action: Constants.CHANGE_TRANSACTION_STATE,
    state: '',
    transactionId: '',
  };
  if (transactionDetail && state && transactionDetail?.id) {
    changeStateData.state = state;
    changeStateData.transactionId = transactionDetail.id;
  }
  return changeStateData;
};
/**
 * Generate failure response data for a payment transaction.
 *
 * @param {any} paymentResponse - Payment response object.
 * @param {PaymentTransactionType} transactionDetail - Transaction details object.
 * @returns {{ action: string, type: { key: string }, fields: { reasonCode: string, transactionId: string }}} - Failure response data.
 */
const failureResponse = (
  paymentResponse: PtsV2PaymentsPost201Response | PtsV2PaymentsCapturesPost201Response | PtsV2PaymentsReversalsPost201Response | PtsV2PaymentsRefundPost201Response | any,
  transactionDetail: Partial<PaymentTransactionType>,
): { action: string; type: { key: string }; fields: { reasonCode: string; transactionId: string } } => {
  const failureResponseData = {
    action: Constants.ADD_INTERFACE_INTERACTION,
    type: {
      key: 'isv_payment_failure',
    },
    fields: {
      reasonCode: '',
      transactionId: '',
    },
  };
  if (paymentResponse && transactionDetail && transactionDetail?.id) {
    failureResponseData.fields.reasonCode = `${paymentResponse.httpCode}`;
    failureResponseData.fields.transactionId = transactionDetail.id;
  }
  return failureResponseData;
};

/**
 * Convert cent amount to its corresponding amount with the specified fraction digits.
 *
 * @param {number} amount - The cent amount to be converted.
 * @param {number} fractionDigits - The number of fraction digits.
 * @returns {number} - The converted amount.
 */
const convertCentToAmount = (amount: number, fractionDigits: number): number => {
  if (amount) amount = Number((amount / Math.pow(10, fractionDigits)).toFixed(fractionDigits)) * 1;
  return amount;
};

/**
 * Convert an amount to its corresponding cent value with the specified fraction digits.
 *
 * @param {number} amount - The amount to be converted.
 * @param {number} fractionDigits - The number of fraction digits.
 * @returns {number} - The converted cent value.
 */
const convertAmountToCent = (amount: number, fractionDigits: number): number => {
  let cent = 0;
  if (amount && 'number' === typeof fractionDigits) {
    const amountArray = amount.toString().split('.');
    amount = Number(amountArray[0]);
    if (2 === amountArray.length && fractionDigits) {
      amount = Number(amountArray[0] + '.' + amountArray[1].substring(0, fractionDigits));
    }
    cent = Math.round(amount * Math.pow(10, fractionDigits));
  }
  return cent;
};

/**
 * Round off the amount to the specified number of fraction digits.
 *
 * @param {number} amount - The amount to be rounded off.
 * @param {number} fractionDigits - The number of fraction digits.
 * @returns {number} - The rounded off value.
 */
const roundOff = (amount: number, fractionDigits: number): number => {
  let value = 0;
  if (amount && fractionDigits) {
    value = Math.round(amount * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
  }
  return value;
};

/**
 * Get an empty response object with empty actions and errors arrays.
 *
 * @returns {
 * actions: Partial<ActionType>[];
 * errors: ErrorType[];
 * }
 *  }} - An empty response object.
 */
const getEmptyResponse = (): { actions: Partial<ActionType>[]; errors: ErrorType[] } => {
  return {
    actions: [],
    errors: [],
  };
};

/**
 * Get an invalid operation response object with an empty actions array and an error object indicating an invalid operation.
 *
 * @returns {object} - An invalid operation response object.
 */
const invalidOperationResponse = (): { actions: Partial<ActionType>[]; errors: ErrorType[] } => {
  return {
    actions: [],
    errors: [
      {
        code: 'InvalidOperation',
        message: CustomMessages.ERROR_MSG_INVALID_OPERATION,
      },
    ],
  };
};

/**
 * Get an invalid input response object with an empty actions array and an error object indicating invalid input.
 *
 * @returns {object} - An invalid input response object.
 */
const invalidInputResponse = (): { actions: Partial<ActionType>[]; errors: ErrorType[] } => {
  return {
    actions: [],
    errors: [
      {
        code: Constants.INVALID_INPUT,
        message: CustomMessages.ERROR_MSG_INVALID_INPUT,
      },
    ],
  };
};

/**
 * Get a refund response object with details about the refund, including capture ID, transaction ID, and pending transaction amount.
 *
 * @param {PaymentTransactionType} transaction - The transaction object.
 * @param {number} pendingTransactionAmount - The pending transaction amount.
 * @returns {Promise<Object>} - A refund response object.
 */
const getRefundResponseObject = (transaction: Transaction, pendingTransactionAmount: number): { captureId: string; transactionId: string; pendingTransactionAmount: number } => {
  const refundResponseAmountObject = {
    captureId: '',
    transactionId: '',
    pendingTransactionAmount: 0,
  };
  if (transaction?.interactionId && transaction?.id) {
    refundResponseAmountObject.captureId = transaction.interactionId;
    refundResponseAmountObject.transactionId = transaction.id;
    refundResponseAmountObject.pendingTransactionAmount = pendingTransactionAmount;
  }
  return refundResponseAmountObject;
};

/**
 * Get the order ID based on either the cart ID or the payment ID.
 *
 * @param {string} cartId - The cart ID.
 * @param {string} paymentId - The payment ID.
 * @returns {Promise<string>} - The order ID.
 */
const getOrderId = async (cartId: string, paymentId: string): Promise<string> => {
  let orderNo = '';
  let orderObj = null;
  if (cartId) {
    orderObj = await commercetoolsApi.queryOrderById(cartId, Constants.CART_ID);
    if (orderObj && 0 < orderObj.count && orderObj.results[0]?.orderNumber) {
      orderNo = orderObj.results[0].orderNumber;
    }
  }
  if ('' === orderNo && paymentId) {
    orderObj = await commercetoolsApi.queryOrderById(paymentId, Constants.PAYMENT_ID);
    if (orderObj && 0 < orderObj.count && orderObj.results[0]?.orderNumber) {
      orderNo = orderObj.results[0].orderNumber;
    }
  }
  return orderNo;
};

/**
 * Retrieves data from the specified URL.
 *
 * @param {string} url - The URL to fetch the data from.
 * @returns {Promise<{ status: number; data: any }>} - A promise containing the status and data from the request.
 */
const getCertificatesData = async (url: string): Promise<{ status: number; data: any }> => {
  const certificateResponse = {
    status: 0,
    data: null,
  };
  let result: Promise<typeof certificateResponse> | typeof certificateResponse = certificateResponse;
  if (url) {
    result = new Promise<typeof certificateResponse>((resolve, reject) => {
      axios
        .get(url)
        .then(function (response: CertificateResponseType) {
          if (response.data) {
            certificateResponse.data = response.data;
            certificateResponse.status = response.status;
            resolve(certificateResponse);
          } else {
            certificateResponse.status = response.status;
            logData(__filename, FunctionConstant.FUNC_GET_CERTIFICATES_DATA, Constants.LOG_DEBUG, '', stringify(response));
            reject(certificateResponse);
          }
        })
        .catch(function (exception: string) {
          errorHandler.logError(new SystemError(CustomMessages.ERROR_MSG_FETCH_CERTIFICATE, exception, FunctionConstant.FUNC_GET_CERTIFICATES_DATA), __filename, '');
          reject(certificateResponse);
        });
    }).catch((error) => {
      return error;
    });
  }
  return result as Promise<typeof certificateResponse> | typeof certificateResponse;
};

/**
 * Retrieves the cart object associated with a payment.
 *
 * @param {Payment} paymentObj - The payment object.
 * @returns {Promise<any>} - A promise containing the cart object.
 */
const getCartObject = async (paymentObj: Payment): Promise<CartPagedQueryResponse> => {
  let cartObj = null;
  cartObj = await commercetoolsApi.queryCartById(paymentObj.id, Constants.PAYMENT_ID);
  if (null === cartObj || (cartObj && 0 === cartObj.count)) {
    if (paymentObj?.customer?.id) {
      cartObj = await commercetoolsApi.queryCartById(paymentObj.customer.id, Constants.CUSTOMER_ID);
    } else if (paymentObj?.anonymousId) {
      cartObj = await commercetoolsApi.queryCartById(paymentObj.anonymousId, Constants.ANONYMOUS_ID);
    }
  }
  return cartObj;
};

/**
 * Creates token data based on the provided parameters.
 *
 * @param {CustomerCustomType} customFields - Custom fields associated with the customer.
 * @param {Customer} customerObj - The customer object.
 * @param {string} paymentInstrumentId - The payment instrument ID.
 * @param {string} instrumentIdentifier - The instrument identifier.
 * @param {string} customerTokenId - The customer token ID.
 * @param {AddressType | null} billToFields - The billing address fields.
 * @returns {CustomerTokensType} - The token data.
 */
const createTokenData = async (customFields: Partial<CustomerCustomType>, customerObj: Customer, paymentInstrumentId: string, instrumentIdentifier: string, customerTokenId: string, billToFields: Partial<AddressType> | null) => {
  const resolvedAddressId = customFields?.isv_addressId || customerObj.custom?.fields?.isv_addressId || '';
  const address = Constants.UC_ADDRESS === resolvedAddressId ? billToFields : null;
  return new Token(customFields, customerTokenId, paymentInstrumentId, instrumentIdentifier, customFields?.isv_addressId, address);
};

/**
 * Creates data for failed tokens based on the provided custom fields and address ID.
 *
 * @param {CustomerCustomType} customFields - Custom fields associated with the customer.
 * @param {string} addressId - The address ID.
 * @returns {Promise<string[]>} - The updated list of failed tokens.
 */
const createFailedTokenData = async (customFields: Partial<CustomerCustomType>, addressId: string): Promise<string[]> => {
  let existingFailedTokens: string[] = [];
  const failedTokens = new Token(customFields, '', '', '', addressId, '');
  if (customFields?.isv_failedTokens && customFields?.isv_failedTokens.length) {
    existingFailedTokens = customFields.isv_failedTokens;
    const failedTokenLength = customFields.isv_failedTokens.length;
    existingFailedTokens[failedTokenLength] = JSON.stringify(failedTokens);
  } else {
    existingFailedTokens = [JSON.stringify(failedTokens)];
  }
  return existingFailedTokens;
};

/**
 * Creates a transaction object based on the provided parameters.
 *
 * @param {number | undefined} version - The version of the transaction.
 * @param {AmountPlannedType} amountPlanned - The planned amount for the transaction.
 * @param {string | undefined} transactionType - The type of the transaction.
 * @param {string} transactionState - The state of the transaction.
 * @param {string | undefined} interactionId - The interaction ID associated with the transaction.
 * @param {string | undefined} timeStamp - The timestamp of the transaction.
 * @returns {TransactionObjectType} - The created transaction object.
 */
const createTransactionObject = (version: number | undefined, amountPlanned: AmountPlannedType, transactionType: string | undefined, transactionState: string, interactionId: string | undefined, timeStamp: string | undefined) => {
  return {
    amount: amountPlanned,
    state: transactionState,
    ...(version && { version }),
    ...(transactionType && { type: transactionType }),
    ...(interactionId && { interactionId }),
    ...(timeStamp && { timestamp: timeStamp }),
  };
};

/**
 * Prepares headers and parameters for making requests to the CyberSource API.
 *
 * @param {any} pathParams - The path parameters.
 * @param {any} headerParams - The header parameters.
 * @param {any} queryParams - The query parameters.
 * @param {any} postBody - The request body.
 * @param {any} formParams - The form parameters.
 * @param {any} returnType - The return type of the API call.
 * @param {any[]} authNames - The authentication names.
 * @param {string[]} contentTypes - The content types.
 * @param {string[]} accepts - The accept types.
 * @returns {object} - Headers and parameters for the API call.
 */
const prepareApiHeaders = (pathParams: any, headerParams: any, queryParams: any, postBody: any, formParams: any, returnType: any, authNames: any[], contentTypes: string[], accepts: string[]) => {
  return {
    pathParams: pathParams,
    headerParams: headerParams,
    queryParams: queryParams,
    postBody: postBody,
    formParams: formParams,
    returnType: returnType,
    authNames: authNames,
    contentTypes: contentTypes,
    accepts: accepts,
  };
};

/**
 * Collects data from an incoming HTTP request.
 *
 * @param {any} request - The incoming HTTP request object.
 * @returns {Promise<string>} - A promise that resolves with the collected data from the request.
 */
const collectRequestData = (request: any): Promise<string> => {
  return new Promise((resolve) => {
    const data: any[] | Uint8Array[] = [];
    request.on('data', (dataChunk: any) => {
      data.push(dataChunk);
    });
    request.on('end', () => {
      const dataStr = Buffer.concat(data).toString();
      resolve(dataStr);
    });
  });
};
/**
 * Sanitizes HTML content to prevent XSS attacks.
 *
 * @param {string} htmlData - The HTML content to sanitize.
 * @returns {string} - The sanitized HTML content.
 */
function sanitizeHtml(htmlData: string): string {
  const { window } = new JSDOM('');
  const DOMPurifyInstance = createDOMPurify(window);
  const config = {
    WHOLE_DOCUMENT: true,
    ALLOWED_TAGS: ['html', 'head', 'meta', 'title', 'body', 'h1', 'h2', 'div', 'p', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'ul', 'li', 'ol', 'br', 'script', 'link', 'em'],
    ALLOWED_ATTR: ['charset', 'name', 'content', 'http-equiv', 'type', 'rel', 'href', 'class', 'id', 'role', 'src'],
  };
  const domElement = new JSDOM(htmlData);
  const bodyContent = domElement.window.document.body.innerHTML;
  const sanitizedBodyContent = DOMPurifyInstance.sanitize(bodyContent, config);
  return sanitizedBodyContent;
}

/**
 * Counts the number of tokens within a specified time interval.
 *
 * @param {string[]} tokens - Array of token strings.
 * @param {string} startTime - Start time of the interval.
 * @param {string} endTime - End time of the interval.
 * @returns {number} - Number of tokens within the interval.
 */
const countTokenForGivenInterval = (tokens: string[], startTime: string, endTime: string): number => {
  let count = 0;
  let tokenToCompare;
  tokens.forEach((token) => {
    tokenToCompare = JSON.parse(token);
    if (tokenToCompare.timestamp > startTime && tokenToCompare.timestamp < endTime) {
      count++;
    }
  });
  return count;
};

/**
 * Extracts the request object from the request body.
 *
 * @param {any} body - The request body.
 * @returns {any} - The request object.
 */
const getRequestObj = (body: any): any => {
  let requestObj;
  if (body) {
    const requestBody = JSON.parse(body.toString());
    requestBody?.resource?.obj ? (requestObj = requestBody?.resource?.obj) : errorHandler.logError(new ValidationError(CustomMessages.ERROR_MSG_INVALID_REQUEST, '', FunctionConstant.FUNC_GET_REQUEST_OBJ), __filename, '');
  }
  return requestObj;
};

/**
 * Extracts the token ID from the input element.
 *
 * @param {any} inputElement - The input element containing the token ID.
 * @returns {string} - The extracted token ID.
 */
const extractTokenValue = (inputElement: any): string => {
  let tokenId = '';
  if (inputElement) {
    const tokenArray = inputElement.split('/');
    tokenId = tokenArray[tokenArray.length - 1];
  }
  return tokenId;
};

/**
 * Updates the parsed token object with new values.
 *
 * @param {string} token - The token object in string format.
 * @param {Partial<CustomerCustomType>} customFields - Custom fields related to the token.
 * @param {string} paymentInstrumentId - The payment instrument ID.
 * @param {string} customerTokenId - The customer token ID.
 * @param {string} addressId - The address ID.
 * @param {Partial<AddressType>| null} billToFields - Optional bill to fields.
 * @returns {Partial<CustomerTokensType>} - The updated parsed token object.
 */
const updateParsedToken = (token: string, customFields: Partial<CustomerCustomType>, paymentInstrumentId: string, customerTokenId: string, addressId: string, billToFields?: Partial<AddressType> | null): Partial<CustomerTokensType> => {
  let parsedToken = {} as Partial<CustomerTokensType>;
  if (token && customerTokenId && paymentInstrumentId && customFields.isv_cardExpiryMonth && customFields.isv_cardExpiryYear && addressId) {
    parsedToken = JSON.parse(token);
    parsedToken.value = customerTokenId;
    parsedToken.paymentToken = paymentInstrumentId;
    parsedToken.cardExpiryMonth = customFields.isv_cardExpiryMonth;
    parsedToken.cardExpiryYear = customFields.isv_cardExpiryYear;
    parsedToken.addressId = addressId;
    if (Constants.UC_ADDRESS === customFields.isv_addressId && null !== billToFields) {
      parsedToken.address = billToFields;
    }
  }
  return parsedToken;
};

/**
 * Generates error messages based on the error code and transaction type.
 *
 * @param {number} errorCode - The error code.
 * @param {string} transactionType - The transaction type.
 * @returns {string} - The error message.
 */
const handleOMErrorMessage = (errorCode: number, transactionType: string): string => {
  let errorMessage = '';
  if (0 === errorCode) {
    switch (transactionType) {
      case Constants.CT_TRANSACTION_TYPE_CHARGE:
        errorMessage = CustomMessages.ERROR_MSG_CAPTURE_AMOUNT_GREATER_THAN_ZERO;
        break;
      case Constants.CT_TRANSACTION_TYPE_REFUND:
        errorMessage = CustomMessages.ERROR_MSG_REFUND_GREATER_THAN_ZERO;
        break;
    }
  } else if (1 === errorCode) {
    switch (transactionType) {
      case Constants.CT_TRANSACTION_TYPE_CHARGE:
        errorMessage = CustomMessages.ERROR_MSG_CAPTURE_EXCEEDS_AUTHORIZED_AMOUNT;
        break;
      case Constants.CT_TRANSACTION_TYPE_REFUND:
        errorMessage = CustomMessages.ERROR_MSG_REFUND_EXCEEDS_CAPTURE_AMOUNT;
        break;
    }
  } else if (2 === errorCode) {
    switch (transactionType) {
      case Constants.CT_TRANSACTION_TYPE_CHARGE:
        errorMessage = CustomMessages.ERROR_MSG_CAPTURE_SERVICE;
        break;
      case Constants.CT_TRANSACTION_TYPE_REFUND:
        errorMessage = CustomMessages.ERROR_MSG_REFUND_SERVICE;
        break;
      case Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION:
        errorMessage = CustomMessages.ERROR_MSG_REVERSAL_SERVICE;
        break;
    }
  }
  return errorMessage;
};

/**
 * Handles success messages based on the transaction type.
 *
 * @param {string} transactionType - The type of transaction.
 * @returns {string} The corresponding success message.
 */
const handleOmSuccessMessage = (transactionType: string) => {
  let successMessage = '';
  switch (transactionType) {
    case Constants.CT_TRANSACTION_TYPE_CHARGE:
      successMessage = CustomMessages.SUCCESS_MSG_CAPTURE_SERVICE;
      break;
    case Constants.CT_TRANSACTION_TYPE_REFUND:
      successMessage = CustomMessages.SUCCESS_MSG_REFUND_SERVICE;
      break;
    case Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION:
      successMessage = CustomMessages.SUCCESS_MSG_REVERSAL_SERVICE;
  }
  return successMessage;
};

/**
 * Logs error messages based on the error and function name.
 *
 * @param {any} error - The error object to log.
 * @param {string} functionName - The name of the function where the error occurred.
 * @param {string} id - An identifier related to the operation.
 * @returns {void}
 */
const logErrorMessage = (error: any, functionName: string, id: string) => {
  let errorData = '';
  let idValue = '';
  let errorMessage = '';
  if (id) {
    switch (functionName) {
      case FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE:
        idValue = 'CustomerId : ' + id;
        break;
      case FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT:
      case FunctionConstant.FUNC_CREATE_CHECKOUT_SESSION:
        idValue = 'CartId : ' + id;
        break;
      default:
        idValue = 'PaymentId : ' + id;
    }
  }
  switch (functionName) {
    case FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT:
      errorMessage = CustomMessages.ERROR_MSG_CAPTURE_CONTEXT + Constants.STRING_HYPHEN;
      break;
    case FunctionConstant.FUNC_CREATE_CHECKOUT_SESSION:
      errorMessage = CustomMessages.ERROR_MSG_CHECKOUT_SESSION + Constants.STRING_HYPHEN;
      break;
  }
  if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
    errorHandler.logError(new PaymentProcessingError(errorMessage, error.response.text, functionName), __filename, idValue);
  } else {
    typeof error === Constants.STR_OBJECT ? (errorData = JSON.stringify(error)) : (errorData = error);
    errorHandler.logError(new PaymentProcessingError(errorMessage + errorData, '', functionName), __filename, idValue);
  }
};

/**
 * Converts a string value to a boolean.
 *
 * @param {string | undefined} value - The string value to convert.
 * @returns {boolean} True if the value is "true", otherwise false.
 */
const toBoolean = (value: string | undefined): boolean => value?.toLowerCase() === 'true';

/**
 * Retrieves the interaction ID from the payment update object.
 *
 * @param {Payment} updatePaymentObj - The payment update object.
 * @returns {string} The interaction ID if found, otherwise an empty string.
 */
const getInteractionId = (updatePaymentObj: Payment) => {
  let interactionId = '';

  const allowedAuthorizationStates = [Constants.CT_TRANSACTION_STATE_SUCCESS, Constants.CT_TRANSACTION_STATE_INITIAL];

  for (let transaction of updatePaymentObj.transactions) {
    if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === transaction.type && allowedAuthorizationStates.includes(String(transaction?.state || '')) && transaction?.interactionId) {
      interactionId = transaction.interactionId;
      break;
    }
  }
  return interactionId;
};

/**
 * Validates a payment ID against a UUID format.
 *
 * @param {string} paymentId - The payment ID to validate.
 * @returns {string} The validated payment ID if valid, otherwise an empty string.
 */
const sanitizeUserInput = (input: any): any => {
  return sanitizeLogData(input);
};

const validatePaymentId = (paymentId: any): string => {
  let validatedId = '';
  const paymentIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const sanitizedPaymentId = sanitizeUserInput(paymentId);
  const normalizedPaymentId = typeof sanitizedPaymentId === Constants.STR_STRING ? sanitizedPaymentId.trim() : '';
  if (paymentIdRegex.test(normalizedPaymentId)) {
    validatedId = normalizedPaymentId;
  }
  return validatedId;
};
const decryptUCWebhookPayload = async (encData: string, privateKeyPem: string): Promise<string> => {
  try {
    const jose = await (new Function('return import("jose")')() as Promise<typeof import('jose')>);
    const key = await jose.importPKCS8(privateKeyPem, 'RSA-OAEP-256');
    const { plaintext } = await jose.compactDecrypt(encData, key);
    return new TextDecoder().decode(plaintext);
  } catch (err) {
    logData(__filename, FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION, Constants.LOG_ERROR, '', '[UC Webhook] Decryption failed: ' + (err instanceof Error ? err.message : String(err)));
    throw err;
  }
};
const resolveSavedTokenFromUnifiedFields = (unifiedCheckoutFields: Record<string, unknown>): string => {
  return typeof (unifiedCheckoutFields as any)?.paymentInstrumentId === 'string'
    ? (unifiedCheckoutFields as any).paymentInstrumentId.trim()
    : typeof (unifiedCheckoutFields as any)?.paymentToken === 'string'
      ? (unifiedCheckoutFields as any).paymentToken.trim()
      : typeof (unifiedCheckoutFields as any)?.savedToken === 'string'
        ? (unifiedCheckoutFields as any).savedToken.trim()
        : typeof (unifiedCheckoutFields as any)?.isv_savedToken === 'string'
          ? (unifiedCheckoutFields as any).isv_savedToken.trim()
          : '';
};
const resolveBillToValue = (primaryValue?: string | null): string => {
  const normalizedPrimaryValue = primaryValue?.trim();
  return normalizedPrimaryValue || '';
};
const resolveCaptureContextValue = (primaryValue?: string | null, fallbackValue?: string | null): string => {
  const normalizedPrimaryValue = resolveBillToValue(primaryValue);
  return normalizedPrimaryValue || resolveBillToValue(fallbackValue);
};


/**
 * Maps a raw CyberSource/UC transaction status to the normalized status vocabulary used
 * on the commercetools payment's isv_authorizationStatus custom field.
 */
const normalizeUCWebhookStatus = (status: string): string => {
  const normalizedStatus = status ? status.toString().toUpperCase() : '';
  const statusMap: Record<string, string> = {
    AUTHORIZED: 'SUCCESS',
    AUTHORIZED_PENDING_REVIEW: 'PENDING_REVIEW',
    COMPLETED: 'SUCCESS',
    REVIEW: 'PENDING',
    PENDING: 'PENDING',
    DECLINED: 'FAILURE',
    FAILED: 'FAILURE',
    REVERSED: 'CANCELLED',
    CANCELLED: 'CANCELLED',
  };
  return statusMap[normalizedStatus] || normalizedStatus;
};

/**
 * Picks the first populated status field out of the UC webhook's transactionResult, trying
 * status, responseStatus.status, decisionStatus, and transactionStatus in that order.
 */
const extractUCWebhookStatus = (transactionResult: any): string => {
  const statusCandidates = [transactionResult?.status, transactionResult?.responseStatus?.status, transactionResult?.decisionStatus, transactionResult?.transactionStatus].filter(
    (status) => undefined !== status && null !== status && '' !== String(status).trim(),
  ) as string[];
  return statusCandidates[0] || '';
};

/**
 * Looks up the payment by UC interaction id, retrying once after a delay to allow for
 * eventual-consistency lag between the UC webhook firing and the payment being persisted.
 */
const retrieveUCPaymentWithRetry = async (detailsId: string): Promise<any> => {
  await new Promise((resolve) => setTimeout(resolve, 8000));
  let payment = await commercetoolsApi.retrievePaymentByInteractionId(detailsId);
  if (!payment) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    payment = await commercetoolsApi.retrievePaymentByInteractionId(detailsId);
  }
  return payment;
};


const performUCStatusValidation = async (notificationData: any): Promise<void> => {
  try {
    const rawPayload = notificationData?.payload;
    const transactionResult = rawPayload?.transactionResult || rawPayload;
    const webhookStatus = extractUCWebhookStatus(transactionResult);
    const detailsId = transactionResult?.details?.id || transactionResult?.id;

    if (!detailsId) {
      logData(__filename, FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION, Constants.LOG_WARN, '', '[UC Webhook] No detailsId found in UC notification');
    } else {
      const payment = await retrieveUCPaymentWithRetry(detailsId);

      if (!payment || !payment.transactions || 0 === payment.transactions.length) {
        logData(__filename, FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION, Constants.LOG_WARN, detailsId, '[UC Webhook] No transactions found for detailsId');
      } else {
        const matchedTxn = payment.transactions.find((txn: any) => txn.interactionId === detailsId);

        if (!matchedTxn) {
          logData(__filename, FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION, Constants.LOG_WARN, detailsId, '[UC Webhook] No matching transaction found for detailsId');
        } else {
          const normalizedWebhookStatus = normalizeUCWebhookStatus(webhookStatus);
          const currentPaymentStatus = String(payment?.custom?.fields?.isv_authorizationStatus || '');
          const normalizedCurrentPaymentStatus = normalizeUCWebhookStatus(currentPaymentStatus);

          if (normalizedWebhookStatus && normalizedCurrentPaymentStatus !== normalizedWebhookStatus) {
            await commercetoolsApi.updatePaymentCustomFields(payment.id, payment.version, {
              isv_authorizationStatus: normalizedWebhookStatus,
              isv_responseDateAndTime: getDate(Date.now(), true),
            });
          }
        }
      }
    }

  } catch (error) {
    logData(__filename, FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION, Constants.LOG_ERROR, '', 'UC Webhook exception in status validation: ' + (error instanceof Error ? error.message : String(error)));
  }
  return;
};


const logRateLimitException = (requestCount: number): void => {
  const timestamp = new Date().toISOString();
  logData(__filename, 'logRateLimitException', Constants.LOG_WARN, '', `Rate limit exceeded. requestCount=${requestCount}, timestamp=${timestamp}`);
};

const maskData = (obj: any) => {
  let result = '{}';
  if (obj === undefined || obj === null || '' === obj) {
  } else {
    try {
      const logData: any = 'string' === typeof obj ? JSON.parse(obj) : obj;
      if (logData !== null && logData !== undefined) {
        replaceChar(logData);
        result = JSON.stringify(logData);
      }
    } catch {
      result = '{}';
    }
  }
  return result;
};
const replaceChar = (logData: any) => {
  if (logData === null || logData === undefined || 'object' !== typeof logData) {
    return;
  }

  const replaceCharacterRegex = /./g;
  const payload = ['email', 'lastName', 'firstName', 'expirationYear', 'expirationMonth', 'phoneNumber', 'cvv', 'securityCode', 'address1', 'postalCode', 'locality', 'address2', 'ipAddress'];
  Object.keys(logData).forEach((key) => {
    if ('object' === typeof logData[key] && null !== logData[key] && logData[key] !== undefined) {
      replaceChar(logData[key]);
    } else {
      if (payload.includes(key) && null !== logData[key] && logData[key] !== undefined && 'string' === typeof logData[key]) {
        logData[key] = logData[key].replace(replaceCharacterRegex, 'x');
      }
    }
  });
};
const setCertificatecache = async (url: string, keyPass: string, merchantId: string, keyAlias: string) => {
  try {
    const certificateFromCache = cache.get(`cert-${merchantId}`);
    const filePath = path.resolve(__dirname, '../certificates/test.p12');

    let currentFileLastModifiedTime: Date;
    let fileModifiedTimeInMs: number;

    try {
      const stats = await fs.promises.stat(filePath);
      currentFileLastModifiedTime = stats.mtime;
      fileModifiedTimeInMs = fs.statSync(filePath).mtimeMs;
    } catch (statError) {
      currentFileLastModifiedTime = new Date();
      fileModifiedTimeInMs = Date.now();
    }

    const cacheKey = merchantId + '_mleCertFromMerchantConfig';
    if (certificateFromCache) {
      setCache(certificateFromCache, currentFileLastModifiedTime);
      setMLECache(certificateFromCache, fileModifiedTimeInMs, cacheKey, keyAlias);
    } else {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
      });
      if (Constants.HTTP_OK_STATUS_CODE === response.status && response.data) {
        const p12Buffer = response.data;
        const p12Der = forge.util.binary.raw.encode(new Uint8Array(p12Buffer));
        const p12Asn1 = forge.asn1.fromDer(p12Der);
        const certificate = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, keyPass);
        setCache(certificate, currentFileLastModifiedTime);
        setMLECache(certificate, fileModifiedTimeInMs, cacheKey, keyAlias);
        cache.put(`cert-${merchantId}`, certificate);
      } else {
        errorHandler.logError(new SystemError(CustomMessages.ERROR_MSG_FETCH_CERTIFICATE, '', FunctionConstant.FUNC_SET_CERTIFICATE_CACHE), __filename, '');
      }
    }
  } catch (exception: any) {
    if (typeof exception === Constants.STR_OBJECT && exception.message) {
      errorHandler.logError(new PaymentProcessingError(exception.message, exception, FunctionConstant.FUNC_SET_CERTIFICATE_CACHE), __filename, '');
    } else {
      errorHandler.logError(new PaymentProcessingError('', exception, FunctionConstant.FUNC_SET_CERTIFICATE_CACHE), __filename, '');
    }
  }
};
const setMLECache = (mleCert: any, timeStamp: Number, cacheKey: string, keyAlias: string) => {
  try {
    const certBags = mleCert.getBags({
      bagType: forge.pki.oids.certBag,
    });

    if (!certBags || !certBags[forge.pki.oids.certBag] || certBags[forge.pki.oids.certBag].length === 0) {
      throw new Error('No certificate found in P12');
    }

    const lowerKeyAlias = (keyAlias || 'cybersource_sjc_us').toLowerCase();

    let certObject = null;

    for (const bag of certBags[forge.pki.oids.certBag]) {
      const certObj = bag.cert;

      let commonName = null;

      if (certObj.subject?.attributes) {
        for (const attr of certObj.subject.attributes) {
          if (attr.name === 'commonName' || attr.shortName === 'CN') {
            commonName = attr.value;
            break;
          }
        }
      }

      if (commonName && commonName.toLowerCase() === lowerKeyAlias) {
        certObject = certObj;
        break;
      }
    }

    const cacheEntry = {
      mleCert: certObject,
      fileLastModifiedTime: timeStamp,
    };
    cache.put(cacheKey, cacheEntry);
  } catch (exception: any) {
    if (typeof exception === Constants.STR_OBJECT && exception.message) {
      errorHandler.logError(new PaymentProcessingError(exception.message, exception, FunctionConstant.FUNC_SET_MLE_CACHE), __filename, '');
    } else {
      errorHandler.logError(new PaymentProcessingError('', exception, FunctionConstant.FUNC_SET_MLE_CACHE), __filename, '');
    }
  }
};

const setCache = (certificate: any, timeStamp: Date) => {
  cache.put(Constants.CACHE_CERTIFICATE_LAST_MODIFIED_TIMESTAMP, timeStamp);
  cache.put(Constants.CACHE_CERTIFICATE_FROM_P12_FILE, certificate);
};
/**
 * Resolves the writable temporary directory for the current host.
 *
 * A hardcoded '/tmp' resolves to the current drive root on Windows hosts such as Azure Functions on a
 * Windows plan, where it is neither present nor writable. os.tmpdir() honours TMPDIR/TEMP on every host.
 *
 * @returns {string} - Path of a writable temporary directory.
 */
const getTempDirectory = (): string => {
  const temporaryDirectory = os.tmpdir();
  if (!fs.existsSync(temporaryDirectory)) {
    fs.mkdirSync(temporaryDirectory, { recursive: true });
  }
  return temporaryDirectory;
};

/**
 * Fetches PEM certificate from cloud URL and caches it.
 * Used for SHARED_SECRET JWT authentication with request MLE.
 *
 * @param url - URL to download PEM certificate from
 * @param merchantId - Merchant ID for cache key
 * @param keyAlias - Key alias to match in certificate (default: cybersource_sjc_us)
 */
const setPemCertificatecache = async (url: string, merchantId: string, _keyAlias?: string) => {
  try {
    const cacheKey = merchantId + '_mleCertFromPemConfig';
    const certificateFromCache = cache.get(cacheKey);
    if (certificateFromCache) {
      return;
    }
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
    });

    if (Constants.HTTP_OK_STATUS_CODE === response.status && response.data) {
      const pemBuffer = response.data;
      const pemString = pemBuffer.toString('utf8');
      const certs = extractPemCertificates(pemString);

      if (!certs || certs.length === 0) {
        errorHandler.logError(new SystemError('No valid PEM certificates found in downloaded file', '', FunctionConstant.FUNC_SET_PEM_CERTIFICATE_CACHE), __filename, '');
        return;
      }
      const pemFilePath = path.resolve(getTempDirectory(), 'requestMle.pem');
      fs.writeFileSync(pemFilePath, pemString, 'utf8');
      const cacheEntry = {
        mleCert: pemString,
        fileLastModifiedTime: Date.now(),
        filePath: pemFilePath,
      };
      cache.put(cacheKey, cacheEntry);
    }
  } catch (exception: any) {
    logData(__filename, FunctionConstant.FUNC_SET_PEM_CERTIFICATE_CACHE, Constants.LOG_ERROR, '', `Error downloading/caching PEM certificate: ${exception?.message || String(exception)}`);

    if (typeof exception === Constants.STR_OBJECT && exception.message) {
      errorHandler.logError(new PaymentProcessingError(exception.message, exception, FunctionConstant.FUNC_SET_PEM_CERTIFICATE_CACHE), __filename, '');
    } else {
      errorHandler.logError(new PaymentProcessingError('', exception, FunctionConstant.FUNC_SET_PEM_CERTIFICATE_CACHE), __filename, '');
    }
  }
};

/**
 * Loads P12 certificate file and converts it to PEM format for Request MLE.
 * Used for SHARED_SECRET JWT authentication with Request MLE using P12 files.
 *
 * @param p12FileName - Name of the P12 file (without path) in src/certificates
 * @param p12Password - Password to decrypt the P12 file
 * @param merchantId - Merchant ID for cache key
 * @returns Promise<string> - Path to the generated PEM file, or undefined if failed
 */
/**
 * Builds the merchant scoped temp file name used for a downloaded Response MLE P12,
 * so multi-MID merchants do not overwrite each other's certificate.
 */
const getResponseMleTempP12Name = (merchantId: string): string => `responseMle_${(merchantId || 'default').replace(/[^a-zA-Z0-9_-]/g, '_')}.p12`;

/**
 * Decrypts a Response MLE encrypted JWT using the private key from a P12 certificate.
 * When Response MLE is enabled, CyberSource wraps the JWT in {"encryptedResponse":"...JWE..."}
 * This function extracts and decrypts the JWE using the SDK's JWEUtility.
 *
 * @param {string} encryptedResponseBody - The response body containing {"encryptedResponse":"..."} or raw JWE
 * @param {string} p12FileName - Name of the P12 certificate file (without path)
 * @param {string} p12Password - Password for the P12 certificate
 * @param {string} merchantId - Merchant ID for caching/logging purposes
 * @returns {Promise<string | undefined>} - The decrypted JWT or undefined on error
 */

/**
 * Parses the JWE token out of a Response MLE webhook body, which may be either a raw JWE string
 * or a JSON wrapper of the form {"encryptedResponse": "...JWE..."}.
 */
const extractJweToken = (encryptedResponseBody: string, merchantId: string): string => {
  try {
    const parsed = JSON.parse(encryptedResponseBody);
    if (parsed.encryptedResponse && typeof parsed.encryptedResponse === 'string') {
      return parsed.encryptedResponse;
    }
  } catch (e) {
    logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_DEBUG, merchantId, 'Response body is not JSON, treating as raw JWE token');
  }
  return encryptedResponseBody;
};

/**
 * Resolves the Response MLE P12 certificate file path: the configured certificate file first,
 * then a merchant-scoped temp download, then the default merchant's temp download.
 */
const resolveResponseMleP12FilePath = (p12FileName: string, merchantId: string): string | undefined => {
  const normalizedP12FileName = p12FileName.trim().endsWith('.p12') ? p12FileName.trim() : `${p12FileName.trim()}.p12`;
  const certificateDirectory = path.join(__dirname, '../certificates');
  const localP12FilePath = path.resolve(path.join(certificateDirectory, normalizedP12FileName));
  const tmpP12FilePath = path.resolve(getTempDirectory(), getResponseMleTempP12Name(merchantId));
  const defaultTmpP12FilePath = path.resolve(getTempDirectory(), getResponseMleTempP12Name(process.env.PAYMENT_GATEWAY_MERCHANT_ID || 'default'));
  if (fs.existsSync(localP12FilePath)) {
    return localP12FilePath;
  }
  if (fs.existsSync(tmpP12FilePath)) {
    return tmpP12FilePath;
  }
  if (fs.existsSync(defaultTmpP12FilePath)) {
    return defaultTmpP12FilePath;
  }
  return undefined;
};

/**
 * Finds the private key bag inside a parsed P12 structure: first the standard pkcs8ShroudedKeyBag
 * type, then falling back to scanning all bag types for one carrying a `key`.
 */
const findP12PrivateKeyBag = (p12: any): any => {
  const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  if (keyBags && keyBags[forge.pki.oids.pkcs8ShroudedKeyBag] && (keyBags[forge.pki.oids.pkcs8ShroudedKeyBag] as any[]).length > 0) {
    return (keyBags[forge.pki.oids.pkcs8ShroudedKeyBag] as any[])[0];
  }
  const allBags = p12.getBags({});
  for (const bagType in allBags) {
    const bags = allBags[bagType] as any[];
    if (Array.isArray(bags)) {
      for (const bag of bags) {
        if (bag.key) {
          return bag;
        }
      }
    }
  }
  return null;
};

const decryptResponseMlePayload = async (
  encryptedResponseBody: string,
  p12FileName: string,
  p12Password: string,
  merchantId: string
): Promise<string | undefined> => {
  let result: string | undefined;
  try {
    do {
      if (!encryptedResponseBody) {
        break;
      }
  
      const jweToken = extractJweToken(encryptedResponseBody, merchantId);
      const p12FilePath = resolveResponseMleP12FilePath(p12FileName, merchantId);
      if (!p12FilePath) {
        break;
      }
      const p12Buffer = fs.readFileSync(p12FilePath);
      const p12Der = forge.util.binary.raw.encode(new Uint8Array(p12Buffer));
      const p12Asn1 = forge.asn1.fromDer(p12Der);
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, p12Password);
      const privateKeyBag: any = findP12PrivateKeyBag(p12);

      if (!privateKeyBag || !privateKeyBag.key) {
        logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, merchantId, 'No private key found in P12 file for Response MLE decryption');
      } else {
        const privatePem = forge.pki.privateKeyToPem(privateKeyBag.key);
        try {
          const JWEUtility = require('cybersource-rest-client/src/authentication/util/JWEUtility');
          result = await JWEUtility.decryptJWEUsingPrivateKey(privatePem, jweToken);
        } catch (decryptError) {
          const decryptErrorMsg = decryptError instanceof Error ? decryptError.message : String(decryptError);
          logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, merchantId, `JWE decryption failed using SDK JWEUtility: ${decryptErrorMsg}`);
          if (decryptErrorMsg.includes('key') || decryptErrorMsg.includes('decrypt')) {
            logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, merchantId, `[DIAGNOSTIC] JWE decryption error - possible causes: 1. Private key does not match the public key used to encrypt the JWE. 2. P12 password is incorrect - verify PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD. 3. Wrong certificate file - verify PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE matches the JWE kid.`);
          }
        }
      }
    } while (false);
  } catch (exception) {
    logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, merchantId, `Failed to decrypt Response MLE payload: ${exception instanceof Error ? exception.message : String(exception)}`);
  }
  return result;
};

/**
 * Builds a concatenated PEM string from all certificates in a P12 cert bag.
 */
const extractCertificatesAsPem = (certificates: any[]): string => {
  let pemContent = '';
  for (const bag of certificates) {
    if (bag.cert) {
      pemContent += forge.pki.certificateToPem(bag.cert) + '\n';
    }
  }
  return pemContent;
};


const loadP12CertificateForRequestMLE = async (p12FileName: string, p12Password: string, merchantId: string, cloudUrl?: string): Promise<string | undefined> => {
  try {
    const cacheKey = merchantId + '_mleCertFromP12RequestMLE';
    const certificateFromCache = cache.get(cacheKey);
    const tempFileMerchantId = (merchantId || 'default').replace(/[^a-zA-Z0-9_-]/g, '_');

    if (certificateFromCache) {
      if (certificateFromCache.filePath && fs.existsSync(certificateFromCache.filePath)) {
        return certificateFromCache.filePath;
      }
    }

    const certificateDirectory = path.join(__dirname, '../certificates');
    const p12FilePath = path.resolve(path.join(certificateDirectory, p12FileName));
    let p12Buffer: Buffer;
    let p12SourcePath: string = p12FilePath;
    if (fs.existsSync(p12FilePath)) {
      p12Buffer = fs.readFileSync(p12FilePath);
    } else if (cloudUrl) {
      try {
        const response = await axios({
          method: 'GET',
          url: cloudUrl,
          responseType: 'arraybuffer',
        });

        if (Constants.HTTP_OK_STATUS_CODE !== response.status || !response.data) {
          return undefined;
        }

        p12Buffer = response.data as Buffer;
        const tmpP12Path = path.resolve(getTempDirectory(), `requestMle_${tempFileMerchantId}.p12`);
        fs.writeFileSync(tmpP12Path, p12Buffer);
        p12SourcePath = tmpP12Path;
      } catch (downloadError: any) {
        logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, '', `Request MLE: Error downloading P12 from cloud: ${downloadError?.message || String(downloadError)}`);
        return undefined;
      }
    } else {
      logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, '', `P12 certificate file not found at: ${p12FilePath}`);
      return undefined;
    }
    const p12Der = forge.util.binary.raw.encode(new Uint8Array(p12Buffer));
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, p12Password);
    const certBags = p12.getBags({
      bagType: forge.pki.oids.certBag,
    });

    if (!certBags || !certBags[forge.pki.oids.certBag] || (certBags[forge.pki.oids.certBag] as any[]).length === 0) {
      logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, '', `No certificates found in P12 file: ${p12SourcePath}`);
      return undefined;
    }
    const certificates = certBags[forge.pki.oids.certBag] as any[];
    const pemContent = extractCertificatesAsPem(certificates);

    if (!pemContent) {
      logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, '', `Failed to extract certificates from P12 file`);
      return undefined;
    }
    const pemFilePath = path.resolve(getTempDirectory(), `requestMle_${tempFileMerchantId}.pem`);
    fs.writeFileSync(pemFilePath, pemContent, 'utf8');
    const cacheEntry = {
      mleCert: pemContent,
      fileLastModifiedTime: Date.now(),
      filePath: pemFilePath,
    };
    cache.put(cacheKey, cacheEntry);

    return pemFilePath;
  } catch (exception: any) {
    logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, '', `Error loading P12 certificate for Request MLE: ${exception?.message || String(exception)}`);

    if (typeof exception === Constants.STR_OBJECT && exception.message) {
      errorHandler.logError(new PaymentProcessingError(exception.message, exception, FunctionConstant.FUNC_GET_CONFIG_OBJECT), __filename, '');
    } else {
      errorHandler.logError(new PaymentProcessingError('', exception, FunctionConstant.FUNC_GET_CONFIG_OBJECT), __filename, '');
    }
    return undefined;
  }
};

/**
 * Extracts individual PEM certificates from a PEM file containing multiple certificates.
 * @param pemString - Raw PEM file content as string
 * @returns Array of individual PEM certificate strings
 */
const extractPemCertificates = (pemString: string): string[] => {
  const certs: string[] = [];
  const certRegex = /-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g;
  const matches = pemString.match(certRegex);

  if (matches) {
    certs.push(...matches);
  }

  return certs;
};

const sanitize = (input: any) => {
  if (typeof input === 'string') {
    return input.replace(/[\n\r]/g, '');
  }
  return input;
};

const validatePathname = (pathname: any) => {
  const validPathnamePattern = /^\/[a-zA-Z0-9\-/]+$/;
  return validPathnamePattern.test(pathname);
};

const sanitizeAndValidateUrl = (req: any) => {
  const originalUrl = url.parse(req.url, true);
  if (!validatePathname(originalUrl.pathname || '')) {
    errorHandler.logError(new ValidationError(CustomMessages.ERROR_MSG_INVALID_PATHNAME, '', FunctionConstant.FUNC_SANITIZE_AND_VALIDATE_URL), __filename, '');
    return null;
  }
  const sanitizedUrl: any = {
    ...originalUrl,
    pathname: sanitize(originalUrl.pathname || ''),
    query: {},
  };
  if (originalUrl.query) {
    Object.entries(originalUrl.query).forEach(([key, value]) => {
      sanitizedUrl.query[key] = sanitize(String(value));
    });
  }
  return sanitizedUrl;
};
/**
 * Validates if the given path is an allowed redirect path.
 * If the path is not in the allowed list, it defaults to "/orders".
 *
 * @param {string} path - The requested redirect path.
 * @returns {string} - The validated redirect path (either an allowed path or "/orders").
 */
const validateRedirectPaths = (paths: string) => {
  const allowedPaths = ['/orders', '/paymentDetails', `/${process.env.PAYMENT_GATEWAY_GCP_FUNCTION_NAME}`];
  if (!allowedPaths.some((path) => paths.startsWith(path))) {
    paths = '/orders';
  }
  return paths;
};

const validateId = (pathname: any) => {
  const validPathnamePattern = /^[a-zA-Z0-9_-]+$/;
  return validPathnamePattern.test(pathname);
};

const getApiPath = (endpoint: string) => {
  let funcName = '';
  if (process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT === Constants.STRING_GCP) {
    funcName = (process.env.PAYMENT_GATEWAY_GCP_FUNCTION_NAME || '').replace(/^\/+/, '');
  }
  return funcName ? `/${funcName}/${endpoint}` : `/${endpoint}`;
};

const injectScripts = (html: string, gcpFuncName: string, nonce: string, setLinkScript: string) => {
  const scriptTag = `<script nonce="${nonce}">window.PAYMENT_GATEWAY_GCP_FUNCTION_NAME = "${gcpFuncName}";</script>`;
  return Constants.HTML_PREFIX.replace('<body>', '<body>' + scriptTag + setLinkScript) + html + Constants.HTML_SUFFIX;
};

const getSetLinkScript = (type: 'orders' | 'paymentDetails', nonce: string): string => {
  if (type === 'orders') {
    return `<script nonce="${nonce}">
      document.addEventListener('DOMContentLoaded', function () {
        const gcpFuncName = window.PAYMENT_GATEWAY_GCP_FUNCTION_NAME;
        function getHref(endpoint) {
          return gcpFuncName ? \`/\${gcpFuncName}/\${endpoint}\` : \`/\${endpoint}\`;
        }
        const runScript = document.getElementById('runScript');
        if (runScript) runScript.href = getHref('configureExtension');
        const decisionSync = document.getElementById('decisionSync');
        if (decisionSync) decisionSync.href = getHref('decisionSync');
        const sync = document.getElementById('sync');
        if (sync) sync.href = getHref('sync');
      });
    </script>`;
  }
  if (type === 'paymentDetails') {
    return `<script nonce="${nonce}">
      document.addEventListener('DOMContentLoaded', function () {
        const gcpFuncName = window.PAYMENT_GATEWAY_GCP_FUNCTION_NAME;
        function getHref(endpoint) {
          return gcpFuncName ? \`/\${gcpFuncName}/\${endpoint}\` : \`/\${endpoint}\`;
        }
        const backButton = document.getElementById('backButton');
        if (backButton) backButton.href = getHref('orders');
      });
    </script>`;
  }
  return '';
};

/*
 * Sanitizes log data to prevent log forging attacks.
 *
 * @param { any } data - The data to sanitize for logging.
 * @returns { any } - The sanitized data.
 */
const sanitizeLogData = (data: any): any => {
  let result = data;
  if (data && typeof data === 'string') {
    let sanitized = data.replace(/[\n\r\t\v\f\0]/g, '').replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    const sensitivePatterns = [/selectedAddressId\s*=\s*['"]?[^,\s'"]+['"]?/gi, /isv_addressId\s*=\s*['"]?[^,\s'"]+['"]?/gi, /addressId\s*=\s*['"]?[^,\s'"]+['"]?/gi, /address\s*=\s*['"]?[^,\s'"]+['"]?/gi, /addresses\s*=\s*\[.*?\]/gi, /addressObj\s*=\s*\{.*?\}/gi];
    sensitivePatterns.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, (match) => {
        const fieldName = match.split('=')[0].trim();
        return `${fieldName} = [REDACTED]`;
      });
    });
    result = sanitized;
  } else if (data && typeof data === 'object') {
    if (Array.isArray(data)) {
      result = data.map((item) => sanitizeLogData(item));
    } else {
      const sanitizedData: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          sanitizedData[key] = sanitizeLogData(data[key]);
        }
      }
      result = sanitizedData;
    }
  }
  return result;
};

/**
 * Gets the request payload from the request object.
 * Sanitizes the payload to prevent log forging attacks.
 *
 * @param {any} req - The request object.
 * @returns {Promise<any>} - The sanitized request payload.
 */
const getRequestPayload = async (req: any) => {
  let result: any;
  if (process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT === Constants.STRING_GCP) {
    const rawRequest = req.body;
    const rawBody = req.rawBody;

    if (rawRequest && 0 < Object.keys(rawRequest).length) {
      result = sanitizeLogData(rawRequest?.resource?.obj || rawRequest);
    } else if (rawBody) {
      try {
        const rawBodyString = Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : String(rawBody);
        const parsedBody = rawBodyString ? JSON.parse(rawBodyString) : null;
        result = sanitizeLogData(parsedBody?.resource?.obj || parsedBody);
      } catch (error) {
        errorHandler.logError(new ValidationError(CustomMessages.ERROR_MSG_INVALID_REQUEST, error, FunctionConstant.FUNC_GET_REQUEST_OBJ), __filename, '');
      }
    } else {
      try {
        const body = await collectRequestData(req);
        if (body) {
          const parsedBody = JSON.parse(body.toString());
          result = sanitizeLogData(parsedBody?.resource?.obj || parsedBody);
        }
      } catch (error) {
        errorHandler.logError(new ValidationError(CustomMessages.ERROR_MSG_INVALID_REQUEST, error, FunctionConstant.FUNC_GET_REQUEST_OBJ), __filename, '');
      }
      if (undefined === result) {
        result = sanitizeLogData(rawRequest?.resource?.obj || rawRequest);
      }
    }
  } else {
    const body = await collectRequestData(req);
    result = sanitizeLogData(await getRequestObj(body));
  }
  return result;
};

/**
 * Validates and sanitizes an action response before sending to commercetools
 * Ensures the response structure is valid and contains only expected fields
 *
 * @param response - The response object to validate
 * @returns Validated response object
 */
const validateActionResponse = (response: ActionResponseType): ActionResponseType => {
  let result: ActionResponseType;
  if (!response || typeof response !== 'object') {
    result = { actions: [], errors: [] };
  } else {
    const validatedActions = Array.isArray(response.actions) ? response.actions : [];
    const validatedErrors = Array.isArray(response.errors) ? response.errors : [];
    result = {
      actions: validatedActions,
      errors: validatedErrors,
    };
  }
  return result;
};
/**
 * Serializes a response payload to JSON, HTML-encodes characters that could be used to break out
 * of an HTML/script context, then sanitizes the result through DOMPurify with an empty allow-list
 * so no tag or attribute can survive. This prevents reflected XSS from untrusted data flowing into
 * the HTTP response body.
 *
 * @param {any} payload - The response payload to serialize.
 * @returns {string} - JSON string safe to write directly to the HTTP response body.
 */
const encodeJsonForHtmlContext = (payload: any): string => {
  const encodedJson = JSON.stringify(payload)
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/'/g, '\\u0027')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  const { window } = new JSDOM('');
  const DOMPurifyInstance = createDOMPurify(window);
  return DOMPurifyInstance.sanitize(encodedJson, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};
export default {
  logData,
  setCustomFieldMapper,
  setCustomFieldToNull,
  setTransactionId,
  changeState,
  failureResponse,
  convertCentToAmount,
  convertAmountToCent,
  roundOff,
  getEmptyResponse,
  invalidOperationResponse,
  invalidInputResponse,
  getRefundResponseObject,
  getOrderId,
  getCertificatesData,
  getCartObject,
  createTokenData,
  createFailedTokenData,
  createTransactionObject,
  prepareApiHeaders,
  collectRequestData,
  sanitizeHtml,
  countTokenForGivenInterval,
  getRequestObj,
  extractTokenValue,
  updateParsedToken,
  resolveSavedTokenFromUnifiedFields,
  resolveCaptureContextValue,
  handleOMErrorMessage,
  getDate,
  toBoolean,
  handleOmSuccessMessage,
  logErrorMessage,
  logRateLimitException,
  getInteractionId,
  validatePaymentId,
  maskData,
  setCertificatecache,
  sanitizeAndValidateUrl,
  validateRedirectPaths,
  setPemCertificatecache,
  loadP12CertificateForRequestMLE,
  decryptResponseMlePayload,
  getResponseMleTempP12Name,
  getTempDirectory,
  extractPemCertificates,
  validateId,
  getApiPath,
  injectScripts,
  getSetLinkScript,
  getRequestPayload,
  sanitizeUserInput,
  decryptUCWebhookPayload,
  performUCStatusValidation,
  normalizeUCWebhookStatus,
  extractUCWebhookStatus,
  extractJweToken,
  resolveResponseMleP12FilePath,
  findP12PrivateKeyBag,
  extractCertificatesAsPem,
  validateActionResponse,
  encodeJsonForHtmlContext
};
