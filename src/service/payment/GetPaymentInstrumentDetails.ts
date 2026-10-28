import restApi from 'cybersource-rest-client';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { errorHandler, PaymentProcessingError } from '../../utils/ErrorHandler';
import paymentUtils from '../../utils/PaymentUtils';

export type PaymentInstrumentDetailsResponse = {
  httpCode: number;
  paymentInstrumentId: string;
  paymentInstrumentState: string;
  networkTokenState: string;
  cardSuffix: string;
  expirationMonth: string;
  expirationYear: string;
};

const getPaymentInstrumentDetails = async (paymentInstrumentId: string, merchantId: string): Promise<PaymentInstrumentDetailsResponse> => {
  const defaultResponse: PaymentInstrumentDetailsResponse = {
    httpCode: 0,
    paymentInstrumentId: '',
    paymentInstrumentState: '',
    networkTokenState: '',
    cardSuffix: '',
    expirationMonth: '',
    expirationYear: '',
  };

  try {
    if (!paymentInstrumentId) {
      return defaultResponse;
    }

    const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_CARD_BY_INSTRUMENT_RESPONSE, null, null, merchantId);
    const apiClient = new restApi.ApiClient();
    const paymentInstrumentApi = configObject && new restApi.PaymentInstrumentApi(configObject, apiClient);
    const startTime = Date.now();

    return await new Promise<PaymentInstrumentDetailsResponse>((resolve) => {
      if (!paymentInstrumentApi) {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CARD_BY_INSTRUMENT_RESPONSE, Constants.LOG_ERROR, 'PaymentInstrumentId: ' + paymentInstrumentId, '[TMS API CALL] PaymentInstrumentApi initialization failed for MerchantId=' + merchantId);
        resolve(defaultResponse);
        return;
      }

      paymentInstrumentApi.getPaymentInstrument(paymentInstrumentId, null, (error: any, data: any, response: any) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        if (data) {
          const tokenizedCard = data?.embedded?.instrumentIdentifier?.tokenizedCard;
          const tokenizedCardDetails = tokenizedCard?.card || {};
          const result = {
            httpCode: response?.status || Constants.HTTP_OK_STATUS_CODE,
            paymentInstrumentId: data?.id || paymentInstrumentId,
            paymentInstrumentState: data?.state || '',
            networkTokenState: tokenizedCard?.state || '',
            cardSuffix: tokenizedCardDetails?.suffix || '',
            expirationMonth: tokenizedCardDetails?.expirationMonth || tokenizedCard?.expirationMonth || data?.card?.expirationMonth || '',
            expirationYear: tokenizedCardDetails?.expirationYear || tokenizedCard?.expirationYear || data?.card?.expirationYear || '',
          };
          resolve(result);
          return;
        }

        if (error) {
          const httpCode = error?.status || response?.status || Constants.HTTP_SERVER_ERROR_STATUS_CODE;
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CARD_BY_INSTRUMENT_RESPONSE, Constants.LOG_WARN, 'PaymentInstrumentId: ' + paymentInstrumentId, '[TMS API ERROR] GET /tms/v1/paymentinstruments failed. httpCode=' + httpCode + ', message=' + (error?.message || 'unknown') + ', duration=' + duration + 'ms');

          resolve({
            ...defaultResponse,
            httpCode: httpCode,
          });
          return;
        }
        resolve(defaultResponse);
      });
    });
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_SERVICE_PROCESS, exception, FunctionConstant.FUNC_GET_CARD_BY_INSTRUMENT_RESPONSE), __filename, '');
    return defaultResponse;
  }
};

export default { getPaymentInstrumentDetails };
