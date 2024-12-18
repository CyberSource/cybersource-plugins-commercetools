import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { InstrumentIdResponse } from '../../types/Types';
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
  };
  const opts: any = [];
  if (instrumentIdentifier) {
    const configObject = prepareFields.getConfigObject(FunctionConstant.FUNC_GET_CARD_BY_INSTRUMENT_RESPONSE, null, null, merchantId);
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
            getCardResponse.cardPrefix = data?.tokenizedCard?.number;
            getCardResponse.cardSuffix = data?.tokenizedCard?.card?.suffix;
            getCardResponse.expirationMonth = data.tokenizedCard?.card?.expirationMonth;
            getCardResponse.expirationYear = data.tokenizedCard?.card?.expirationYear;
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
};

export default { getCardByInstrumentResponse };
