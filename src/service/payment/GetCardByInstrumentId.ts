import restApi from 'cybersource-rest-client';

import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { InstrumentIdResponse } from '../../types/Types';
import { errorHandler, PaymentProcessingError } from '../../utils/ErrorHandler';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Retrieves card information by instrument identifier.
 * @param {string} instrumentIdentifier - The instrument identifier.
 * @param {string} merchantId - The merchant ID.
 * @returns {Promise<InstrumentIdResponse>} A promise that resolves with instrument ID response.
 */
const getCardByInstrumentResponse = async (instrumentIdentifier: string | undefined, merchantId: string): Promise<InstrumentIdResponse> => {
  const getCardResponse = {
    httpCode: 0,
    instrumentIdentifier: '',
    state: '',
    cardPrefix: '',
    cardSuffix: '',
    expirationMonth: '',
    expirationYear: '',

    cardNumber: '',
    tokenizedCardNumber: '',
    paymentInstrumentId: '',
    text: '',
    bankAccount: undefined as any,
  };
  const opts: any = [];
  try {
    if (instrumentIdentifier) {
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_CARD_BY_INSTRUMENT_RESPONSE, null, null, merchantId);
      const apiClient = new restApi.ApiClient();
      const getCardApiInstance = configObject && new restApi.InstrumentIdentifierApi(configObject, apiClient);
      const startTime = new Date().getTime();
      return await new Promise<InstrumentIdResponse>(function (resolve, reject) {
        if (getCardApiInstance) {
          getCardApiInstance.getInstrumentIdentifier(instrumentIdentifier, opts, (error: any, data: any, response: any) => {
            const endTime = new Date().getTime();
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CARD_BY_INSTRUMENT_RESPONSE, Constants.LOG_DEBUG, 'InstrumentId : ' + instrumentIdentifier, 'InstrumentIdResponse = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
            if (data) {
              getCardResponse.httpCode = response[Constants.STRING_RESPONSE_STATUS];
              getCardResponse.instrumentIdentifier = data?.id;
              getCardResponse.state = data?.tokenizedCard?.state;

              getCardResponse.text = response?.text || '';
              getCardResponse.bankAccount = data?.bankAccount || undefined;
              getCardResponse.cardNumber = data?.card?.number || '';
              getCardResponse.tokenizedCardNumber = data?.tokenizedCard?.number || '';
              getCardResponse.cardPrefix = getCardResponse.cardNumber || getCardResponse.tokenizedCardNumber;
              getCardResponse.cardSuffix = data?.card?.suffix || data?.tokenizedCard?.card?.suffix || '';
              getCardResponse.expirationMonth = data?.card?.expirationMonth || data?.tokenizedCard?.card?.expirationMonth || '';
              getCardResponse.expirationYear = data?.card?.expirationYear || data?.tokenizedCard?.card?.expirationYear || '';

              resolve(getCardResponse);
            } else if (error) {
              getCardResponse.httpCode = error.status;
              reject(getCardResponse);
            } else {
              reject(getCardResponse);
            }
          });
        }
      }).catch((error: any) => {
        return error;
      });
    } else {
      return getCardResponse;
    }
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_SERVICE_PROCESS, exception, FunctionConstant.FUNC_GET_CARD_BY_INSTRUMENT_RESPONSE), __filename, '');
    return getCardResponse;
  }
};

const getPaymentInstrumentIdByInstrumentIdentifier = async (instrumentIdentifier: string | undefined, merchantId: string): Promise<string> => {
  if (!instrumentIdentifier) {
    return '';
  }

  try {
    const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_CARD_BY_INSTRUMENT_RESPONSE, null, null, merchantId);
    const apiClient = new restApi.ApiClient();
    const apiInstance = configObject && new restApi.InstrumentIdentifierApi(configObject, apiClient);

    return await new Promise<string>((resolve) => {
      if (!apiInstance) {
        resolve('');
        return;
      }

      apiInstance.getInstrumentIdentifierPaymentInstrumentsList(instrumentIdentifier, undefined, 0, 1, (error: any, data: any, response: any) => {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CARD_BY_INSTRUMENT_RESPONSE, Constants.LOG_DEBUG, 'InstrumentId : ' + instrumentIdentifier, 'InstrumentIdentifier paymentInstruments response = ' + paymentUtils.maskData(JSON.stringify(response)));

        if (error || !data) {
          resolve('');
          return;
        }

        const paymentInstrumentId = data?._embedded?.paymentInstruments?.[0]?.id || data?.paymentInstruments?.[0]?.id || '';

        resolve(paymentInstrumentId || '');
      });
    });
  } catch {
    return '';
  }
};

export default { getCardByInstrumentResponse, getPaymentInstrumentIdByInstrumentIdentifier };
