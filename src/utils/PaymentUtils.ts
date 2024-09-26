import crypto from 'crypto';
import path from 'path';

import axios from 'axios';
import { PtsV2PaymentsCapturesPost201Response, PtsV2PaymentsPost201Response, PtsV2PaymentsRefundPost201Response, PtsV2PaymentsReversalsPost201Response } from 'cybersource-rest-client';
import createDOMPurify from 'dompurify';
import { stringify } from 'flatted';
import { JSDOM } from 'jsdom';
import winston from 'winston';
import { format } from 'winston';
import 'winston-daily-rotate-file';

import { Constants } from '../constants/constants';
import { CustomMessages } from '../constants/customMessages';
import { FunctionConstant } from '../constants/functionConstant';
import { Token } from '../models/TokenModel';
import { ActionType, AddressType, AmountPlannedType, CertificateResponseType, CustomerCustomType, CustomerTokensType, CustomerType, ErrorType, PaymentCustomFieldsType, PaymentTransactionType, PaymentType, TransactionObjectType } from '../types/Types';

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
const logData = (filePath: string, method: string, type: string, id: string, logMessage: string): void => {
  let loggingFormat: winston.Logform.Format;
  let logger: winston.Logger;
  let fileName = path.parse(path.basename(filePath)).name;
  let newDate = getDate(Date.now(), true);
  if (id) {
    loggingFormat = printf(({ label, methodName, level, message }) => {
      return `[${newDate}] [${label}] [${methodName}] [${level.toUpperCase()}] [${id}] : ${message}`;
    });
  } else {
    loggingFormat = printf(({ label, methodName, level, message }) => {
      return `[${newDate}] [${label}] [${methodName}] [${level.toUpperCase()}]  : ${message}`;
    });
  }
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
    if (id) {
      logger.log({
        label: fileName,
        methodName: method,
        level: type,
        id: id,
        message: logMessage,
      });
    } else {
      logger.log({
        label: fileName,
        methodName: method,
        level: type,
        message: logMessage,
      });
    }
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
 * Log exceptions.
 * 
 * @param {string} fileName - Log file name.
 * @param {string} functionName - Name of the function where the exception occurred.
 * @param {string} exceptionMsg - Exception message.
 * @param {any} exception - The exception object.
 * @param {string} id - Resource ID.
 * @param {string} resourceType - Type of the resource.
 * @param {string} key - Key related to the exception (optional).
 */
const logExceptionData = (fileName: string, functionName: string, exceptionMsg: string, exception: any, id: string, resourceType: string, key: string) => {
  let exceptionData: string;
  if (typeof exception === Constants.STR_STRING) {
    exceptionData = exceptionMsg + Constants.STRING_HYPHEN + exception.toUpperCase();
  } else if (exception instanceof Error) {
    if (exceptionMsg) {
      exceptionData =
        FunctionConstant.FUNC_ADD_CUSTOM_TYPES === functionName || FunctionConstant.FUNC_ADD_EXTENSIONS === functionName || 'FuncGetCustomTypes' === functionName
          ? exceptionMsg + Constants.STRING_FULL_COLON + key + Constants.STRING_HYPHEN + exception.message
          : exceptionMsg + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = FunctionConstant.FUNC_ADD_CUSTOM_TYPES === functionName || FunctionConstant.FUNC_ADD_EXTENSIONS === functionName || 'FuncGetCustomTypes' === functionName ? exceptionMsg + Constants.STRING_FULL_COLON + key + Constants.STRING_HYPHEN + exception : exception.message;
    }
  } else {
    exceptionData = exceptionMsg ? exceptionMsg + Constants.STRING_HYPHEN + exception : JSON.stringify(exception);
  }
  if (CustomMessages.EXCEPTION_MERCHANT_SECRET_KEY_REQUIRED === exceptionData || CustomMessages.EXCEPTION_MERCHANT_KEY_ID_REQUIRED === exceptionData) {
    exceptionData = CustomMessages.EXCEPTION_MSG_ENV_VARIABLE_NOT_SET;
  }
  id ? logData(fileName, functionName, Constants.LOG_ERROR, resourceType + id, exceptionData) : logData(fileName, functionName, Constants.LOG_ERROR, '', exceptionData);
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
  try {
    keys = Object.keys(fields);
    if (keys) {
      keys.forEach((key) => {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: key,
          value: fields[key as keyof PaymentCustomFieldsType],
        });
      });
    } else {
      logData(__filename, 'FuncSetCustomFieldMapper', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_EMPTY_CUSTOM_FIELDS);
    }
  } catch (exception) {
    logExceptionData(__filename, 'FuncSetCustomFieldMapper', '', exception, '', '', '');
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
  try {
    keys = Object.keys(fields);
    if (keys) {
      keys.forEach((key) => {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: key,
          value: null,
        });
      });
    } else {
      logData(__filename, 'FuncSetCustomFieldToNull', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_EMPTY_CUSTOM_FIELDS);
    }
  } catch (exception) {
    logExceptionData(__filename, 'FuncSetCustomFieldToNull', '', exception, '', '', '');
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
    logData(__filename, FunctionConstant.FUNC_SET_TRANSACTION_ID, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
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
  const changeStateData = {
    action: 'changeTransactionState',
    state: '',
    transactionId: '',
  };
  if (transactionDetail && state && transactionDetail?.id) {
    changeStateData.state = state;
    changeStateData.transactionId = transactionDetail.id;
  } else {
    logData(__filename, FunctionConstant.FUNC_CHANGE_STATE, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
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
  } else {
    logData(__filename, 'FUNC_FAILURE_RESPONSE', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
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
    if (2 === amountArray.length && fractionDigits) amount = Number(amountArray[0] + '.' + amountArray[1].substring(0, fractionDigits));
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
  if (amount && fractionDigits) value = Math.round(amount * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
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
const getRefundResponseObject = (transaction: Partial<PaymentTransactionType>, pendingTransactionAmount: number): { captureId: string, transactionId: string, pendingTransactionAmount: number } => {
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
  let orderObj = null;
  let orderNo = '';
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
 * Encrypts the provided data using AES-GCM encryption.
 * 
 * @param {string} data - The data to be encrypted.
 * @returns {string} - The encrypted data encoded in Base64.
 */
const encryption = (data: string): string => {
  let baseEncodedData = '';
  let encryptionInfo;
  try {
    if (data && process.env.CT_CLIENT_SECRET) {
      const key = process.env.CT_CLIENT_SECRET;
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv(Constants.HEADER_ENCRYPTION_ALGORITHM, key, iv);
      encryptionInfo = cipher.update(data, Constants.UNICODE_ENCODING_SYSTEM, Constants.ENCODING_BASE_SIXTY_FOUR);
      encryptionInfo += cipher.final(Constants.ENCODING_BASE_SIXTY_FOUR);
      const authTag = cipher.getAuthTag();
      const encryptStringData = iv.toString(Constants.HEX) + Constants.STRING_FULL_COLON + encryptionInfo.toString() + Constants.STRING_FULL_COLON + authTag.toString(Constants.HEX);
      baseEncodedData = Buffer.from(encryptStringData).toString(Constants.ENCODING_BASE_SIXTY_FOUR);
    }
  } catch (exception) {
    logExceptionData(__filename, 'FuncEncryption', '', exception, '', '', '');
  }
  return baseEncodedData;
};
/**
 * Decrypts the provided encoded credentials using AES-GCM decryption.
 * 
 * @param {string} encodedCredentials - The encoded credentials to be decrypted.
 * @returns {string} - The decrypted data.
 */
const decryption = (encodedCredentials: string): string => {
  let decryptedData = '';
  let dataArray = [];
  try {
    if (encodedCredentials && process.env.CT_CLIENT_SECRET) {
      const data = Buffer.from(encodedCredentials, Constants.ENCODING_BASE_SIXTY_FOUR).toString('ascii');
      dataArray = data.split(Constants.STRING_FULL_COLON);
      const ivBuff = Buffer.from(dataArray[0], Constants.HEX);
      const encryptedData = dataArray[1];
      const authTagBuff = Buffer.from(dataArray[2], Constants.HEX);
      const decipher = crypto.createDecipheriv(Constants.HEADER_ENCRYPTION_ALGORITHM, process.env.CT_CLIENT_SECRET, ivBuff);
      decipher.setAuthTag(authTagBuff);
      decryptedData = decipher.update(encryptedData, Constants.ENCODING_BASE_SIXTY_FOUR, Constants.UNICODE_ENCODING_SYSTEM);
      decryptedData += decipher.final(Constants.UNICODE_ENCODING_SYSTEM);
    }
  } catch (exception) {
    logExceptionData(__filename, FunctionConstant.FUNC_DECRYPTION, '', exception, '', '', '');
  }
  return decryptedData;
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
            logData(__filename, FunctionConstant.FUNC_GET_CERTIFICATES_DATA, Constants.LOG_ERROR, '', stringify(response));
            reject(certificateResponse);
          }
        })
        .catch(function (exception: string) {
          logData(__filename, FunctionConstant.FUNC_GET_CERTIFICATES_DATA, Constants.LOG_ERROR, '', exception);
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
 * @param {PaymentType} paymentObj - The payment object.
 * @returns {Promise<any>} - A promise containing the cart object.
 */
const getCartObject = async (paymentObj: PaymentType): Promise<any> => {
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
 * @param {CustomerType} customerObj - The customer object.
 * @param {string} paymentInstrumentId - The payment instrument ID.
 * @param {string} instrumentIdentifier - The instrument identifier.
 * @param {string} customerTokenId - The customer token ID.
 * @param {AddressType | null} billToFields - The billing address fields.
 * @returns {CustomerTokensType} - The token data.
 */
const createTokenData = async (customFields: Partial<CustomerCustomType>, customerObj: Partial<CustomerType>, paymentInstrumentId: string, instrumentIdentifier: string, customerTokenId: string, billToFields: AddressType | null) => {
  const address = Constants.UC_ADDRESS === customerObj.custom?.fields?.isv_addressId ? billToFields : {};
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
  const transactionObject: Partial<TransactionObjectType> = {
    amount: amountPlanned,
    state: transactionState,
  };
  if (version) {
    transactionObject.version = version;
  }
  if (transactionType) {
    transactionObject.type = transactionType;
  }
  if (interactionId) {
    transactionObject.interactionId = interactionId;
  }
  if (timeStamp) {
    transactionObject.timestamp = timeStamp;
  }
  return transactionObject;
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
 * Validates the headers in network tokenization webhook notification.
 * 
 * @param {any} signature - The signature string.
 * @param {any} notification - The notification object.
 * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating whether the notification is valid.
 */
const authenticateNetToken = async (signature: any, notification: any): Promise<boolean> => {
  let isValidNotification = false;
  try {
    if (notification && Constants.STR_OBJECT === typeof notification && signature && Constants.STR_STRING === typeof signature) {
      const payloadBody = notification?.payload;
      const signatureInfo = signature.split(';');
      if (Array.isArray(signatureInfo) && 3 === signatureInfo.length) {
        const timeStamp = signatureInfo[0].split('=')[1].trim();
        const keyId = signatureInfo[1].split('=')[1].trim();
        const sign = signatureInfo[2].split('sig=')[1].trim();
        const getCustomObjectSubscriptions = await commercetoolsApi.retrieveCustomObjectByContainer(Constants.CUSTOM_OBJECT_CONTAINER);
        if (0 < getCustomObjectSubscriptions?.results?.length) {
          const subscriptionData = await getCustomObjectSubscriptions?.results[0]?.value?.find((customObject: any) => notification?.webhookId === customObject?.webhookId && keyId === customObject?.keyId);
          if (timeStamp && keyId && sign && payloadBody && subscriptionData?.key) {
            const payload = `${timeStamp}.${JSON.stringify(payloadBody)}`;
            const decodedKey = Buffer.from(subscriptionData.key, Constants.ENCODING_BASE_SIXTY_FOUR);
            const hmac = crypto.createHmac(Constants.ENCODING_SHA_TWO_FIFTY_SIX, decodedKey);
            const generatedSignature = hmac.update(payload).digest(Constants.ENCODING_BASE_SIXTY_FOUR);
            if (generatedSignature === sign) {
              isValidNotification = true;
            }
          }
        }
      }
    }
  } catch (exception) {
    logExceptionData(__filename, 'FunAuthenticateNetToken', '', exception, '', '', '');
  }
  return isValidNotification;
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
    (requestBody?.resource?.obj) ? requestObj = requestBody?.resource?.obj : logData(__filename, 'FuncGetRequestObj', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_INVALID_REQUEST);
  } else {
    logData(__filename, 'FuncGetRequestObj', Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_INVALID_REQUEST);
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
 * @param {CustomerCustomType} customFields - Custom fields related to the token.
 * @param {string} paymentInstrumentId - The payment instrument ID.
 * @param {string} customerTokenId - The customer token ID.
 * @param {string} addressId - The address ID.
 * @param {AddressType | null} billToFields - Optional bill to fields.
 * @returns {CustomerTokensType} - The updated parsed token object.
 */
const updateParsedToken = (token: string, customFields: Partial<CustomerCustomType>, paymentInstrumentId: string, customerTokenId: string, addressId: string, billToFields?: AddressType | null): Partial<CustomerTokensType> => {
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
}

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
    logData(__filename, functionName, Constants.LOG_ERROR, idValue, errorMessage + error.response.text);
  } else {
    typeof error === Constants.STR_OBJECT ? (errorData = JSON.stringify(error)) : (errorData = error);
    logData(__filename, functionName, Constants.LOG_ERROR, idValue, errorMessage + errorData);
  }
};

const toBoolean = (value: string | undefined): boolean => value?.toLowerCase() === 'true';

const getInteractionId = (updatePaymentObj: PaymentType) => {
  let interactionId = '';
  for (let transaction of updatePaymentObj.transactions) {
    if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.interactionId) {
      interactionId = transaction.interactionId;
      break;
    }
  }
  return interactionId;
}
const validatePaymentId = (paymentId: string) => {
  let validatedId = ''
  const paymentIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (paymentIdRegex.test(paymentId)) {
    validatedId = paymentId;
  }
  return validatedId;
}

export default {
  logData,
  logExceptionData,
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
  encryption,
  decryption,
  getCertificatesData,
  getCartObject,
  createTokenData,
  createFailedTokenData,
  createTransactionObject,
  prepareApiHeaders,
  collectRequestData,
  authenticateNetToken,
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
  getInteractionId,
  validatePaymentId
};
