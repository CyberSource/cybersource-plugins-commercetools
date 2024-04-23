import crypto from 'crypto';
import path from 'path';

import axios from 'axios';
import createDOMPurify from 'dompurify';
import { stringify } from 'flatted';
import { JSDOM } from 'jsdom';
import winston from 'winston';
import { format } from 'winston';
import 'winston-daily-rotate-file';

import { Constants } from '../constants';
import { actionType, addressType, amountPlannedType, certificateResponseType, customerCustomType, customerTokensType, customerType, paymentCustomFieldsType, paymentTransactionType, paymentType, transactionObjectType } from '../types/Types';

import commercetoolsApi from './../utils/api/CommercetoolsApi';

const { combine, printf } = format;

const logData = (fileName: string, methodName: string, type: string, id: string, message: string | unknown) => {
  let loggingFormat: winston.Logform.Format;
  let logger: winston.Logger;
  if (id) {
    loggingFormat = printf(({ label, methodName, level, message }) => {
      return `[${new Date(Date.now()).toISOString()}] [${label}] [${methodName}] [${level.toUpperCase()}] [${id}] : ${message}`;
    });
  } else {
    loggingFormat = printf(({ label, methodName, level, message }) => {
      return `[${new Date(Date.now()).toISOString()}] [${label}] [${methodName}] [${level.toUpperCase()}]  : ${message}`;
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
        methodName: methodName,
        level: type,
        id: id,
        message: message as string,
      });
    } else {
      logger.log({
        label: fileName,
        methodName: methodName,
        level: type,
        message: message as string,
      });
    }
  }
};

const getFileName = () => {
  const date = new Date().toISOString().split('T')[0];
  return Constants.STRING_MY_REQUESTS + date + '.log';
};

const exceptionLog = (fileName: string, functionName: string, exceptionMsg: string, exception: string | Error | unknown, id: string, resourceType: string, key: string) => {
  let exceptionData: string;
  if (typeof exception === 'string') {
    exceptionData = exceptionMsg + Constants.STRING_HYPHEN + exception.toUpperCase();
  } else if (exception instanceof Error) {
    if (exceptionMsg) {
      exceptionData =
        'FuncAddCustomTypes' === functionName || 'FuncAddExtensions' === functionName || 'FuncGetCustomTypes' === functionName
          ? exceptionMsg + Constants.STRING_FULL_COLON + key + Constants.STRING_HYPHEN + exception.message
          : exceptionMsg + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = 'FuncAddCustomTypes' === functionName || 'FuncAddExtensions' === functionName || 'FuncGetCustomTypes' === functionName ? exceptionMsg + Constants.STRING_FULL_COLON + key + Constants.STRING_HYPHEN + exception : exception.message;
    }
  } else {
    exceptionData = exceptionMsg ? exceptionMsg + Constants.STRING_HYPHEN + exception : JSON.stringify(exception);
  }
  if (Constants.EXCEPTION_MERCHANT_SECRET_KEY_REQUIRED === exceptionData || Constants.EXCEPTION_MERCHANT_KEY_ID_REQUIRED === exceptionData) {
    exceptionData = Constants.EXCEPTION_MSG_ENV_VARIABLE_NOT_SET;
  }
  id ? logData(fileName, functionName, Constants.LOG_ERROR, resourceType + id, exceptionData) : logData(fileName, functionName, Constants.LOG_ERROR, '', exceptionData);
};

const setCustomFieldMapper = (fields: paymentCustomFieldsType) => {
  const actions: actionType[] = [];
  let keys: readonly string[];
  try {
    keys = Object.keys(fields);
    if (keys) {
      keys.forEach((key) => {
        actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: key,
          value: fields[key as keyof paymentCustomFieldsType],
        });
      });
    } else {
      logData(path.parse(path.basename(__filename)).name, 'FuncSetCustomFieldMapper', Constants.LOG_INFO, '', Constants.ERROR_MSG_EMPTY_CUSTOM_FIELDS);
    }
  } catch (exception) {
    exceptionLog(path.parse(path.basename(__filename)).name, 'FuncSetCustomFieldMapper', '', exception, '', '', '');
  }
  return actions;
};

const setCustomFieldToNull = (fields: paymentCustomFieldsType | customerCustomType) => {
  const actions: actionType[] = [];
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
      logData(path.parse(path.basename(__filename)).name, 'FuncSetCustomFieldToNull', Constants.LOG_INFO, '', Constants.ERROR_MSG_EMPTY_CUSTOM_FIELDS);
    }
  } catch (exception) {
    exceptionLog(path.parse(path.basename(__filename)).name, 'FuncSetCustomFieldToNull', '', exception, '', '', '');
  }
  return actions;
};

const setTransactionId = (paymentResponse: any, transactionDetail: paymentTransactionType) => {
  const transactionIdData = {
    action: 'changeTransactionInteractionId',
    interactionId: '',
    transactionId: '',
  };
  try {
    if (paymentResponse && transactionDetail && transactionDetail?.id) {
      transactionIdData.interactionId = paymentResponse.transactionId;
      transactionIdData.transactionId = transactionDetail.id;
    } else {
      logData(path.parse(path.basename(__filename)).name, 'FuncSetTransactionId', Constants.LOG_INFO, '', Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    exceptionLog(path.parse(path.basename(__filename)).name, 'FuncSetTransactionId', '', exception, '', '', '');
  }
  return transactionIdData;
};

const changeState = (transactionDetail: paymentTransactionType, state: string) => {
  const changeStateData = {
    action: 'changeTransactionState',
    state: '',
    transactionId: '',
  };
  try {
    if (transactionDetail && state && transactionDetail?.id) {
      changeStateData.state = state;
      changeStateData.transactionId = transactionDetail.id;
    } else {
      logData(path.parse(path.basename(__filename)).name, 'FuncChangeState', Constants.LOG_INFO, '', Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    exceptionLog(path.parse(path.basename(__filename)).name, 'FuncChangeState', '', exception, '', '', '');
  }
  return changeStateData;
};

const failureResponse = (paymentResponse: any, transactionDetail: paymentTransactionType) => {
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
  try {
    if (paymentResponse && transactionDetail && transactionDetail?.id) {
      failureResponseData.fields.reasonCode = `${paymentResponse.httpCode}`;
      failureResponseData.fields.transactionId = transactionDetail.id;
    } else {
      logData(path.parse(path.basename(__filename)).name, 'FuncFailureResponse', Constants.LOG_INFO, '', Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
    }
  } catch (exception) {
    exceptionLog(path.parse(path.basename(__filename)).name, 'FuncFailureResponse', '', exception, '', '', '');
  }
  return failureResponseData;
};

const convertCentToAmount = (amount: number, fractionDigits: number) => {
  if (amount) {
    amount = Number((amount / Math.pow(10, fractionDigits)).toFixed(fractionDigits)) * 1;
  }
  return amount;
};

const convertAmountToCent = (amount: number, fractionDigits: number) => {
  let cent = 0;
  if (amount) {
    const amountArray = amount.toString().split('.');
    amount = Number(amountArray[0]);
    if (2 === amountArray.length && fractionDigits) {
      amount = Number(amountArray[0] + '.' + amountArray[1].substring(0, fractionDigits));
    }
    cent = Math.round(amount * Math.pow(10, fractionDigits));
  }
  return cent;
};

const roundOff = (amount: number, fractionDigits: number) => {
  let value = 0;
  if (amount) {
    value = Math.round(amount * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
  }
  return value;
};

const getEmptyResponse = () => {
  return {
    actions: [],
    errors: [],
  };
};

const invalidOperationResponse = () => {
  return {
    actions: [],
    errors: [
      {
        code: 'InvalidOperation',
        message: Constants.ERROR_MSG_INVALID_OPERATION,
      },
    ],
  };
};

const invalidInputResponse = () => {
  return {
    actions: [],
    errors: [
      {
        code: Constants.INVALID_INPUT,
        message: Constants.ERROR_MSG_INVALID_INPUT,
      },
    ],
  };
};

const getRefundResponseObject = async (transaction: paymentTransactionType, pendingTransactionAmount: number) => {
  const refundResponseAmountObject = {
    captureId: '',
    transactionId: '',
    pendingTransactionAmount: 0,
  };
  try {
    if (transaction?.interactionId && transaction?.id) {
      refundResponseAmountObject.captureId = transaction.interactionId;
      refundResponseAmountObject.transactionId = transaction.id;
      refundResponseAmountObject.pendingTransactionAmount = pendingTransactionAmount;
    }
  } catch (exception) {
    exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetRefundResponseObject', '', exception, '', '', '');
  }
  return refundResponseAmountObject;
};

const getOrderId = async (cartId: string, paymentId: string) => {
  let orderObj = null;
  let orderNo = '';
  if (cartId) {
    orderObj = await commercetoolsApi.queryOrderById(cartId, Constants.CART_ID);
    if (orderObj && 0 < orderObj.count && orderObj.results[0]?.orderNumber) {
      orderNo = orderObj.results[0].orderNumber;
    }
  }
  if ('' === orderNo) {
    orderObj = await commercetoolsApi.queryOrderById(paymentId, Constants.PAYMENT_ID);
    if (orderObj && 0 < orderObj.count && orderObj.results[0]?.orderNumber) {
      orderNo = orderObj.results[0].orderNumber;
    }
  }
  return orderNo;
};

const encryption = (data: string) => {
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
    exceptionLog(path.parse(path.basename(__filename)).name, 'FuncEncryption', '', exception, '', '', '');
  }
  return baseEncodedData;
};

const decryption = (encodedCredentials: string) => {
  let decryptedData = '';
  let dataArray = [];
  try {
    if (encodedCredentials) {
      const data = Buffer.from(encodedCredentials, Constants.ENCODING_BASE_SIXTY_FOUR).toString('ascii');
      dataArray = data.split(Constants.STRING_FULL_COLON);
      const ivBuff = Buffer.from(dataArray[0], Constants.HEX);
      const encryptedData = dataArray[1];
      const authTagBuff = Buffer.from(dataArray[2], Constants.HEX);
      const decipher = crypto.createDecipheriv(Constants.HEADER_ENCRYPTION_ALGORITHM, process.env.CT_CLIENT_SECRET as string, ivBuff);
      decipher.setAuthTag(authTagBuff);
      decryptedData = decipher.update(encryptedData, Constants.ENCODING_BASE_SIXTY_FOUR, Constants.UNICODE_ENCODING_SYSTEM);
      decryptedData += decipher.final(Constants.UNICODE_ENCODING_SYSTEM);
    }
  } catch (exception) {
    exceptionLog(path.parse(path.basename(__filename)).name, 'FuncDecryption', '', exception, '', '', '');
  }
  return decryptedData;
};

const getCertificatesData = async (url: string) => {
  const certificateResponse = {
    status: 0,
    data: null,
  };
  if (url) {
    return new Promise<typeof certificateResponse>((resolve, reject) => {
      axios
        .get(url)
        .then(function (response: certificateResponseType) {
          if (response.data) {
            certificateResponse.data = response.data;
            certificateResponse.status = response.status;
            resolve(certificateResponse);
          } else {
            certificateResponse.status = response.status;
            logData(path.parse(path.basename(__filename)).name, 'FuncGetCertificatesData', Constants.LOG_ERROR, '', stringify(response));
            reject(certificateResponse);
          }
        })
        .catch(function (exception: string) {
          logData(path.parse(path.basename(__filename)).name, 'FuncGetCertificatesData', Constants.LOG_ERROR, '', exception);
          reject(certificateResponse);
        });
    }).catch((error) => {
      return error;
    });
  }
  return certificateResponse;
};

const getCartObject = async (paymentObj: paymentType) => {
  let cartObj = null;
  try {
    cartObj = await commercetoolsApi.queryCartById(paymentObj.id, Constants.PAYMENT_ID);
    if (null === cartObj || (cartObj && 0 === cartObj.count)) {
      if (paymentObj?.customer?.id) {
        cartObj = await commercetoolsApi.queryCartById(paymentObj.customer.id, Constants.CUSTOMER_ID);
      } else {
        if (paymentObj?.anonymousId) {
          cartObj = await commercetoolsApi.queryCartById(paymentObj.anonymousId, Constants.ANONYMOUS_ID);
        }
      }
    }
  } catch (exception) {
    exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetCartObject', '', exception, paymentObj.id, 'PaymentId : ', '');
  }
  return cartObj;
};

const createTokenData = async (customFields: customerCustomType, customerObj: customerType, paymentInstrumentId: string, instrumentIdentifier: string, customerTokenId: string, billToFields: addressType | null) => {
  const address = Constants.UC_ADDRESS === customerObj.custom?.fields?.isv_addressId ? billToFields : {};
  return {
    alias: customFields.isv_tokenAlias,
    value: customerTokenId,
    paymentToken: paymentInstrumentId,
    instrumentIdentifier: instrumentIdentifier,
    cardType: customFields.isv_cardType,
    cardName: customFields.isv_cardType,
    cardNumber: customFields.isv_maskedPan,
    cardExpiryMonth: customFields.isv_cardExpiryMonth,
    cardExpiryYear: customFields.isv_cardExpiryYear,
    addressId: customFields.isv_addressId,
    address: address,
    timeStamp: new Date(Date.now()).toISOString(),
  } as customerTokensType;
};

const createFailedTokenData = async (customFields: customerCustomType, addressId: string) => {
  let existingFailedTokens: string[] = [];
  try {
    const failedTokens = {
      alias: customFields.isv_tokenAlias,
      cardType: customFields.isv_cardType,
      cardName: customFields.isv_cardType,
      cardNumber: customFields.isv_maskedPan,
      cardExpiryMonth: customFields.isv_cardExpiryMonth,
      cardExpiryYear: customFields.isv_cardExpiryYear,
      addressId: addressId,
      timeStamp: new Date(Date.now()).toISOString(),
    } as customerTokensType;
    if (customFields?.isv_failedTokens && customFields?.isv_failedTokens.length) {
      existingFailedTokens = customFields.isv_failedTokens;
      const failedTokenLength = customFields.isv_failedTokens.length;
      existingFailedTokens[failedTokenLength] = JSON.stringify(failedTokens);
    } else {
      existingFailedTokens = [JSON.stringify(failedTokens)];
    }
  } catch (exception) {
    exceptionLog(path.parse(path.basename(__filename)).name, 'FuncCreateFailedTokenData', '', exception, '', '', '');
  }
  return existingFailedTokens;
};

const createTransactionObject = (version: number | undefined, amountPlanned: amountPlannedType, transactionType: string | undefined, transactionState: string, interactionId: string | undefined, timeStamp: string | undefined) => {
  const transactionObject: transactionObjectType = {
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

const prepareCybsApiHeaders = (pathParams: any, headerParams: any, queryParams: any, postBody: any, formParams: any, returnType: any, authNames: any[], contentTypes: string[], accepts: string[]) => {
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

const collectRequestData = (request: any) => {
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

const authenticateNetToken = async (signature: any, notification: any) => {
  let isValidNotification = false;
  try {
    if (notification && 'object' === typeof notification && signature && 'string' === typeof signature) {
      const payloadBody = notification?.payload;
      const signatureInfo = signature.split(';');
      if (Array.isArray(signatureInfo) && 3 === signatureInfo.length) {
        const timeStamp = signatureInfo[0].split('=')[1].trim();
        const keyId = signatureInfo[1].split('=')[1].trim();
        const sign = signatureInfo[2].split('sig=')[1].trim();
        const getCustomObjectSubscriptions = await commercetoolsApi.retrieveCustomObjectByContainer(Constants.CUSTOM_OBJECT_CONTAINER);
        if (0 < getCustomObjectSubscriptions?.results?.length) {
          const subscriptionData = await getCustomObjectSubscriptions?.results[0]?.value?.find((customObject: any) => notification?.webhookId === customObject?.subscriptionId && keyId === customObject?.keyId);
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
    exceptionLog(path.parse(path.basename(__filename)).name, 'FunAuthenticateNetToken', '', exception, '', '', '');
  }
  return isValidNotification;
};

function sanitizeHtml(htmlData: string) {
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

const tokenCountForInterval = (tokens: string[], startTime: string, endTime: string) => {
  let count = 0;
  let tokenToCompare;
  tokens.forEach((token) => {
    tokenToCompare = JSON.parse(token);
    if (tokenToCompare.timeStamp > startTime && tokenToCompare.timeStamp < endTime) {
      count++;
    }
  });
  return count;
};

const getRequestObj = (body: any) => {
  let requestObj;
  if (body) {
    const requestBody = JSON.parse(body.toString());
    if (requestBody?.resource?.obj) {
      requestObj = requestBody?.resource?.obj;
    } else {
      logData(path.parse(path.basename(__filename)).name, 'FuncGetRequestObj', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_REQUEST);
    }
  } else {
    logData(path.parse(path.basename(__filename)).name, 'FuncGetRequestObj', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_REQUEST);
  }
  return requestObj;
};

const extractTokenValue = (inputElement: any) => {
  let tokenId = '';
  if (inputElement) {
    const tokenArray = inputElement.split('/');
    tokenId = tokenArray[tokenArray.length - 1];
  }
  return tokenId;
};

const updateParsedToken = (token: string, customFields: customerCustomType, paymentInstrumentId: string, customerTokenId: string, addressId: string, billToFields?: addressType | null) => {
  let parsedToken = {} as customerTokensType;
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

const handleOMErrorMessage = (errorCode: number, transactionType: string) => {
  let errorMessage = '';
  if (0 === errorCode) {
    if (Constants.CT_TRANSACTION_TYPE_CHARGE === transactionType) {
      errorMessage = Constants.ERROR_MSG_CAPTURE_AMOUNT_GREATER_THAN_ZERO;
    } else if (Constants.CT_TRANSACTION_TYPE_REFUND == transactionType) {
      errorMessage = Constants.ERROR_MSG_REFUND_GREATER_THAN_ZERO;
    }
  } else if (1 === errorCode) {
    if (Constants.CT_TRANSACTION_TYPE_CHARGE === transactionType) {
      errorMessage = Constants.ERROR_MSG_CAPTURE_EXCEEDS_AUTHORIZED_AMOUNT;
    } else if (Constants.CT_TRANSACTION_TYPE_REFUND == transactionType) {
      errorMessage = Constants.ERROR_MSG_REFUND_EXCEEDS_CAPTURE_AMOUNT;
    }
  } else if (2 === errorCode) {
    if (Constants.CT_TRANSACTION_TYPE_CHARGE === transactionType) {
      errorMessage = Constants.ERROR_MSG_CAPTURE_SERVICE;
    } else if (Constants.CT_TRANSACTION_TYPE_REFUND == transactionType) {
      errorMessage = Constants.ERROR_MSG_REFUND_SERVICE;
    } else if (Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION === transactionType) {
      errorMessage = Constants.ERROR_MSG_REVERSAL_SERVICE;
    }
  }
  return errorMessage;
};

export default {
  logData,
  getFileName,
  exceptionLog,
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
  prepareCybsApiHeaders,
  collectRequestData,
  authenticateNetToken,
  sanitizeHtml,
  tokenCountForInterval,
  getRequestObj,
  extractTokenValue,
  updateParsedToken,
  handleOMErrorMessage,
};
