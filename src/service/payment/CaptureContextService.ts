import { Cart, Payment } from '@commercetools/platform-sdk';
import restApi, { UnifiedCheckoutV1CaptureContextApi } from 'cybersource-rest-client';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { CaptureContextAddresses } from '../../types/Types';
import { errorHandler, PaymentProcessingError } from '../../utils/ErrorHandler';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Resolves and validates locale and country for capture context.
 * @param {string | undefined} inputLocale - The input locale string (e.g., 'en-US').
 * @param {string} paramCountry - The country passed as a parameter.
 * @param {Cart | null} cartObj - The cart object containing address information.
 * @param {string} cartId - The cart ID for logging purposes.
 * @returns {{ locale: string; country: string } | null} Resolved locale and country, or null if validation fails.
 */

const resolveLocaleAndCountry = (inputLocale: string | undefined, paramCountry: string, cartObj: Cart | null, cartId: string): { locale: string; country: string } | null => {
  if (!inputLocale) {

    return null;
  }

  const multiShipCountry = Constants.SHIPPING_MODE_MULTIPLE === cartObj?.shippingMode && cartObj?.shipping?.length
    ? cartObj.shipping[0]?.shippingAddress?.country
    : '';
  const resolvedCountry = cartObj?.billingAddress?.country || cartObj?.shippingAddress?.country || multiShipCountry || paramCountry;

  if (!resolvedCountry) {
    return null;
  }
  let formattedLocale = inputLocale.replace('-', '_');

  if (Constants.REGEX_TWO_LETTER_LOCALE.test(formattedLocale)) {
    const countryCode = resolvedCountry.toUpperCase();

    if (!countryCode) {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_WARN, cartId, Constants.COUNTRY_REQUIRED_FOR_LOCALE_FORMATTING_WARNING);
      return null;
    }

    formattedLocale = formattedLocale + '_' + countryCode;
  }

  return { locale: formattedLocale, country: resolvedCountry };
};

/**
 * Generates the capture context by calling /uc/v1/sessions (UC v1).
 * @param {Cart | null} cartObj - The cart object for payment.
 * @param {string} country - The country of the customer.
 * @param {string} locale - The locale of the customer.
 * @param {string} currencyCode - The currency code.
 * @param {string} merchantId - The merchant ID.
 * @param {string} service - The service type ('Payments' or 'MyAccounts').
 * @param {{ completeType?: string; enable3DS?: boolean; challengeCode04?: boolean; isSavedCard?: boolean }} [overrides] - Optional frontend overrides for completeMandate.
 * @param {string} [ipAddress] - Optional IP address of the client device.
 * @param {Record<string, unknown>} [unifiedCheckoutFields] - Extra fields for layout rendering.
 * @param {CaptureContextAddresses} [captureContextAddresses] - Direct address field overrides.
 * @param {string} [cyberSourceCustomerId] - Optional CyberSource customer ID for MyAccounts flow.
 * @returns {Promise<string>} A promise that resolves with the generated capture context signature.
 */
const generateCaptureContext = async (
  cartObj: Cart | null,
  country: string,
  locale: string,
  currencyCode: string,
  merchantId: string,
  service: string,
  overrides?: { completeType?: string; challengeCode04?: boolean; isSavedCard?: boolean },
  ipAddress?: string,
  unifiedCheckoutFields?: Record<string, unknown>,
  captureContextAddresses?: CaptureContextAddresses,
  cyberSourceCustomerId?: string,
  clientReferenceCode?: string,
): Promise<string> => {
  let isv_tokenCaptureContextSignature = '';
  let cartId = cartObj?.id || '';
  let referenceCode = clientReferenceCode || '';
  let cartIdLog = 'CartId : ' + cartId + ', ReferenceCode : ' + referenceCode;
  const clientVersion = process.env.PAYMENT_GATEWAY_UC_CLIENT_VERSION?.trim();
  if (clientVersion && !prepareFields.validateUnifiedCheckoutClientVersion(clientVersion)) {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_INVALID_UC_CLIENT_VERSION);
  }

  try {
    if (('Payments' === service && cartObj) || ('MyAccounts' === service && country && locale && currencyCode)) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, null, null, merchantId);
      const targetOrigins = prepareFields.getTargetOrigins(unifiedCheckoutFields);
      const requestObj: Record<string, any> = {
        targetOrigins: targetOrigins,
        transientTokenResponseOptions: { includeCardPrefix: false },
      };
      if (clientVersion) {
        requestObj.clientVersion = clientVersion;
      }
      if ('Payments' === service && cartObj) {
        const orderInformation: Record<string, any> = prepareFields.getOrderInformation(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, null, null, cartObj, null, null, service, currencyCode);
        const cartBillTo = prepareFields.getCartCaptureContextBillTo(cartObj);
        const cartShipTo = prepareFields.getCartCaptureContextShipTo(cartObj);
        const billTo = prepareFields.buildCaptureContextBillTo(captureContextAddresses?.billTo || undefined, cartBillTo);
        if (0 < Object.keys(billTo).length) {
          orderInformation.billTo = billTo;
        }
        const shipTo = prepareFields.buildCaptureContextShipTo(captureContextAddresses?.shipTo || cartShipTo, captureContextAddresses?.billTo || cartBillTo);
        if (0 < Object.keys(shipTo).length) {
          orderInformation.shipTo = shipTo;
        }
        const clientReferenceInformation = prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, referenceCode, undefined);
        let deviceInformation = {};
        if (ipAddress) {
          deviceInformation = { ipAddress };
        } else {
          deviceInformation = prepareFields.getDeviceInformation(null, null, service);
        }
        const captureMandate = prepareFields.getCaptureMandate(service, unifiedCheckoutFields);
        requestObj.data = { orderInformation, clientReferenceInformation, deviceInformation };
        if (Object.keys(captureMandate).length > 0) {
          requestObj.captureMandate = captureMandate;
        }
        const completeMandate = prepareFields.getCompleteMandate(service, overrides);
        if (Object.keys(completeMandate).length > 0) {
          requestObj.completeMandate = completeMandate;
        }
        if (overrides?.challengeCode04) {
          if (!requestObj.data) requestObj.data = {};
          requestObj.data.consumerAuthenticationInformation = { challengeCode: '04' };
        }
        const localeAndCountry = resolveLocaleAndCountry(cartObj.locale || locale, country, cartObj, cartId);
        if (!localeAndCountry) {
          return isv_tokenCaptureContextSignature;
        }
        requestObj.locale = localeAndCountry.locale;
        requestObj.country = localeAndCountry.country;
        requestObj.allowedPaymentTypes = prepareFields.getAllowedPaymentMethods(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, unifiedCheckoutFields);
        const paymentConfigurations = prepareFields.getPaymentConfigurations();
        if (overrides?.isSavedCard) {
          const paymentInstrumentId = paymentUtils.resolveSavedTokenFromUnifiedFields(unifiedCheckoutFields || {});
          if (paymentInstrumentId) {
            paymentConfigurations.TMS_TOKEN = paymentConfigurations.TMS_TOKEN || {};
            paymentConfigurations.TMS_TOKEN.paymentInstruments = [{ id: `${paymentInstrumentId}` }];
            requestObj.data = requestObj.data || {};
          } else {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_WARN, cartId, Constants.SAVED_CARD_NO_PAYMENT_INSTRUMENT_WARNING);
          }
        }

        if (Object.keys(paymentConfigurations).length > 0) {
          requestObj.paymentConfigurations = paymentConfigurations;
        }
      } else if ('MyAccounts' === service) {
        if (!locale) {
        }
        const localeAndCountry = resolveLocaleAndCountry(locale, country, cartObj, cartId);
        if (!localeAndCountry) {
          return isv_tokenCaptureContextSignature;
        }
        requestObj.locale = localeAndCountry.locale;
        requestObj.country = localeAndCountry.country;
        requestObj.allowedPaymentTypes = prepareFields.getAllowedPaymentMethods(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, unifiedCheckoutFields);
        const orderInformation: Record<string, any> = prepareFields.getOrderInformation(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, null, null, cartObj, null, null, service, currencyCode);
        const billTo = prepareFields.buildCaptureContextBillTo(captureContextAddresses?.billTo || undefined);
        if (0 < Object.keys(billTo).length) {
          orderInformation.billTo = billTo;
        }

        const captureMandate = prepareFields.getCaptureMandate(service, unifiedCheckoutFields);
        const completeMandate = prepareFields.getCompleteMandate(service, overrides);
        const clientReferenceInformation = prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, referenceCode, undefined);
        requestObj.data = { orderInformation, clientReferenceInformation };
        if (Object.keys(captureMandate).length > 0) {
          requestObj.captureMandate = captureMandate;
        }
        if (Object.keys(completeMandate).length > 0) {
          requestObj.completeMandate = completeMandate;
        }
        requestObj.buttonType = 'SAVE_CARD';
        if (cyberSourceCustomerId && cyberSourceCustomerId.trim()) {
          const paymentConfigurations = prepareFields.getPaymentConfigurations();
          paymentConfigurations.TMS_TOKEN = paymentConfigurations.TMS_TOKEN || {};
          paymentConfigurations.TMS_TOKEN.customer = {
            id: cyberSourceCustomerId,
          };
          requestObj.paymentConfigurations = paymentConfigurations;
        }
      }

      const metaDataSource = { custom: { fields: { isv_metadata: unifiedCheckoutFields?.[Constants.ISV_METADATA] } } } as unknown as Payment;
      const merchantDefinedInformation = prepareFields.getMetaData(metaDataSource);
      if (merchantDefinedInformation.length) {
        if (!requestObj.data) {
          requestObj.data = {};
        }
        requestObj.data.merchantDefinedInformation = merchantDefinedInformation;

      }
      if (prepareFields.getEnableMoto(unifiedCheckoutFields)) {
        if (!requestObj.data) {
          requestObj.data = {};
        }
        requestObj.data.processingInformation = {
          commerceIndicator: 'moto'
        };
      }

      const requestObjCopy = JSON.parse(JSON.stringify(requestObj));
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_DEBUG, cartId, 'Capture Context Request = ' + paymentUtils.maskData(JSON.stringify(requestObjCopy)));
      if (configObject) {
        const unifiedCheckoutApi = new UnifiedCheckoutV1CaptureContextApi(configObject, apiClient);
        const startTime = new Date().getTime();
        return await new Promise<string>((resolve, reject) => {
          unifiedCheckoutApi.generateUnifiedCheckoutV1CaptureContext(requestObj, (error: any, data: any, response: any) => {
            const endTime = new Date().getTime();
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_DEBUG, cartIdLog, 'Capture Context Response = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
            if (data) {
              isv_tokenCaptureContextSignature = data;
              resolve(isv_tokenCaptureContextSignature);
            } else if (error) {
              paymentUtils.logData(__filename, FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_ERROR, cartIdLog, 'Capture Context Error = ' + JSON.stringify(error) + ' Response body = ' + JSON.stringify(response?.body || response?.text));
              reject(isv_tokenCaptureContextSignature);
            } else {
              paymentUtils.logData(__filename, FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_ERROR, cartIdLog, 'Capture Context empty response. Response = ' + JSON.stringify(response));
              reject(isv_tokenCaptureContextSignature);
            }
          });
        }).catch((error) => {
          return error;
        });
      }
    }
    return isv_tokenCaptureContextSignature;
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_CAPTURE_CONTEXT, exception, FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT), __filename, '');
    return isv_tokenCaptureContextSignature;
  }
};

export default { generateCaptureContext };
