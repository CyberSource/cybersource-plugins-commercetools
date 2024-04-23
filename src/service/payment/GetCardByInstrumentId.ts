import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { instrumentIdResponse } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

const getCardByInstrumentResponse = async (instrumentIdentifier: string | undefined, merchantId: string): Promise<instrumentIdResponse> => {
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
  let errorData: string;
  try {
    const configObject = await prepareFields.getConfigObject('FuncGetCardByInstrumentResponse', null, null, merchantId);
    if (instrumentIdentifier) {
      const apiClient = new restApi.ApiClient();
      const getCardApiInstance = new restApi.InstrumentIdentifierApi(configObject, apiClient);
      return await new Promise<instrumentIdResponse>(function (resolve, reject) {
        getCardApiInstance.getInstrumentIdentifier(instrumentIdentifier, opts, (error: any, data: any, response: any) => {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetCardByInstrumentResponse', Constants.LOG_INFO, 'InstrumentId : ' + instrumentIdentifier, 'InstrumentIdResponse = ' + JSON.stringify(response));
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
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetCardByInstrumentResponse', Constants.LOG_ERROR, '', error.response.text);
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetCardByInstrumentResponse', Constants.LOG_ERROR, '', errorData);
            }
            getCardResponse.httpCode = error.status;
            reject(getCardResponse);
          } else {
            reject(getCardResponse);
          }
        });
      }).catch((error: any) => {
        return error;
      });
    } else {
      return getCardResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetCardByInstrumentResponse', '', exception, '', '', '');
    return getCardResponse;
  }
};

export default { getCardByInstrumentResponse };
