import fs from 'fs';
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
import { ActionType, AddressType, AmountPlannedType, CertificateResponseType, CustomerCustomType, CustomerTokensType, ErrorType, LoggerConfigType, PaymentCustomFieldsType, PaymentTransactionType } from '../types/Types';

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
      message: logMessage,
    } as Partial<LoggerConfigType>;
    if (id) {
      loggerConfig.id = encodeURI(id);
    }
    if (consolidatedTime) {
      loggerConfig.consolidatedTime = `${consolidatedTime} Ms`
    }
    logger.log(loggerConfig as LoggerConfigType);
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
      actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: key,
        value: fields[key as keyof PaymentCustomFieldsType],
      });
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
const setTransactionId = (paymentResponse: PtsV2PaymentsPost201Response | PtsV2PaymentsCapturesPost201Response | PtsV2PaymentsReversalsPost201Response | PtsV2PaymentsRefundPost201Response, transactionDetail: Partial<PaymentTransactionType>) => {
  const transactionIdData = {
    action: 'changeTransactionInteractionId',
    interactionId: '',
    transactionId: '',
  };
  paymentValidator.setObjectValue(transactionIdData, 'interactionId', paymentResponse, 'transactionId', Constants.STR_STRING, false);
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
const failureResponse = (paymentResponse: PtsV2PaymentsPost201Response | PtsV2PaymentsCapturesPost201Response | PtsV2PaymentsReversalsPost201Response | PtsV2PaymentsRefundPost201Response | any, transactionDetail: Partial<PaymentTransactionType>): { action: string, type: { key: string }, fields: { reasonCode: string, transactionId: string } } => {
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
  if (amount)
    amount = Number((amount / Math.pow(10, fractionDigits)).toFixed(fractionDigits)) * 1;
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
const getEmptyResponse = (): { actions: Partial<ActionType>[], errors: ErrorType[] } => {
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
const invalidOperationResponse = (): { actions: Partial<ActionType>[], errors: ErrorType[] } => {
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
const invalidInputResponse = (): { actions: Partial<ActionType>[], errors: ErrorType[] } => {
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
const getRefundResponseObject = (transaction: Transaction, pendingTransactionAmount: number): { captureId: string, transactionId: string, pendingTransactionAmount: number } => {
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
  if (url) {
    return new Promise<typeof certificateResponse>((resolve, reject) => {
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
  return certificateResponse;
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
  const address = Constants.UC_ADDRESS === customerObj.custom?.fields?.isv_addressId ? billToFields : null;
  return new Token(customFields, customerTokenId, paymentInstrumentId, instrumentIdentifier, customFields?.isv_addressId, address)
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
  const failedTokens = new Token(customFields, '', '', '', addressId, '')
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
    ...(timeStamp && { timestamp: timeStamp })
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
};

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
    (requestBody?.resource?.obj) ? requestObj = requestBody?.resource?.obj : errorHandler.logError(new ValidationError(CustomMessages.ERROR_MSG_INVALID_REQUEST, '', FunctionConstant.FUNC_GET_REQUEST_OBJ), __filename, '');
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
  if (token && customFields?.isv_tokenAlias && customerTokenId && paymentInstrumentId && customFields.isv_cardExpiryMonth && customFields.isv_cardExpiryYear && addressId) {
    parsedToken = JSON.parse(token);
    parsedToken.alias = customFields.isv_tokenAlias;
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
  let successMessage = ''
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
    case FunctionConstant.FUNC_GET_FLEX_KEYS:
      errorMessage = CustomMessages.ERROR_MSG_FLEX_TOKEN_KEYS + Constants.STRING_HYPHEN;
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
  for (let transaction of updatePaymentObj.transactions) {
    if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.interactionId) {
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
const validatePaymentId = (paymentId: string): string => {
  let validatedId = ''
  const paymentIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (paymentIdRegex.test(paymentId)) {
    validatedId = paymentId;
  }
  return validatedId;
};

const logRateLimitException = (requestCount: number): void => {
  const timestamp = new Date().toISOString();
  console.log(`Rate limit exceeded: Time [${timestamp}], Requests [${requestCount}], Max Allowed [${Constants.RATE_LIMIT_TIME_WINDOW} in 1 minute].`);
};

const maskData = (obj: any) => {
  let logData = obj !== undefined && JSON.parse(obj);
  replaceChar(logData);
  return JSON.stringify(logData);
};


const replaceChar = (logData: any) => {
  const replaceCharacterRegex = /./g;
  const payload = ['email', 'lastName', 'firstName', 'expirationYear', 'expirationMonth', 'phoneNumber', 'cvv', 'securityCode', 'address1', 'postalCode', 'locality', 'address2', 'ipAddress'];
  Object.keys(logData).forEach(key => {
    if ('object' === typeof logData[key] && null !== logData[key] && logData[key] !== undefined) {
      replaceChar(logData[key]);
    } else {
      if (payload.includes(key) && null !== logData[key] && logData[key] !== undefined && "string" === typeof logData[key]) {
        logData[key] = logData[key].replace(replaceCharacterRegex, "x");
      }
    }
  });
};

const setCertificatecache = async (url: string, keyPass: string, merchantId: string) => {
  try {
    const certificateFromCache = cache.get(`cert-${merchantId}`);
    const filePath = path.resolve(__dirname, '../certificates/test.p12');
    const stats = await fs.promises.stat(filePath);
    const currentFileLastModifiedTime = stats.mtime;
    if (certificateFromCache) {
      setCache(certificateFromCache, currentFileLastModifiedTime);
    }
    else {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer'
      });
      if (Constants.HTTP_OK_STATUS_CODE === response.status && response.data) {
        const p12Buffer = response.data;
        const p12Der = forge.util.binary.raw.encode(new Uint8Array(p12Buffer));
        const p12Asn1 = forge.asn1.fromDer(p12Der);
        const certificate = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, keyPass);
        setCache(certificate, currentFileLastModifiedTime);
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

const setCache = (certificate: any, timeStamp: Date) => {
  cache.put("certificateLastModifideTimeStamp", timeStamp);
  cache.put("certificateFromP12File", certificate);
}

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
    query: {}
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
  if (!allowedPaths.some(path => paths.startsWith(path))) {
    paths = '/orders';
  }
  return paths;
}

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
}

const injectScripts = (html: string, gcpFuncName: string, nonce: string, setLinkScript: string) => {
  const scriptTag = `<script nonce="${nonce}">window.PAYMENT_GATEWAY_GCP_FUNCTION_NAME = "${gcpFuncName}";</script>`;
  // Inject both scripts right after <body>
  return Constants.HTML_PREFIX.replace('<body>', '<body>' + scriptTag + setLinkScript) + html + Constants.HTML_SUFFIX;
}

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
}

 /*
 * Sanitizes log data to prevent log forging attacks.
 *
 * @param { any } data - The data to sanitize for logging.
 * @returns { any } - The sanitized data.
 */
const sanitizeLogData = (data: any): any => {
  if (!data) {
    return data;
  }

  if (typeof data === 'string') {
    // Remove newlines, carriage returns, and other control characters that could be used for log forging
    return data.replace(/[\n\r\t\v\f\0]/g, '').replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  }

  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => sanitizeLogData(item));
    }

    const sanitizedData: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitizedData[key] = sanitizeLogData(data[key]);
      }
    }
    return sanitizedData;
  }

  return data;
};

/**
 * Gets the request payload from the request object.
 * Sanitizes the payload to prevent log forging attacks.
 *
 * @param {any} req - The request object.
 * @returns {Promise<any>} - The sanitized request payload.
 */
const getRequestPayload = async (req: any) => {
  if (process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT === Constants.STRING_GCP) {
    let rawRequest = req.body;
    // Sanitize the request payload to prevent log forging
    return sanitizeLogData(rawRequest.resource.obj);
  } else {
    const body = await collectRequestData(req);
    // getRequestObj already parses the body, but we need to sanitize it as well
    return sanitizeLogData(await getRequestObj(body));
  }
}


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
  validateId,
  getApiPath,
  injectScripts,
  getSetLinkScript,
  getRequestPayload
};
