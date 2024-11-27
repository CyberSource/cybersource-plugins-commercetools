import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import getTransientTokenData from '../../service/payment/GetTransientTokenData';
import { ActionResponseType, AddressType, CustomerType } from '../../types/Types';
import paymentActions from '../PaymentActions';
import paymentUtils from '../PaymentUtils';

const processValidCardResponse = async (customFields: any, cardTokens: any, cardResponse: any, customerObj: CustomerType, billToFields: AddressType | null): Promise<ActionResponseType> => {
    const { customerTokenId, paymentInstrumentId, instrumentIdentifier } = getTokenIds(cardResponse, cardTokens);
    let existingTokens = customFields?.isv_tokens || [];
    let existingFailedTokens: string[] = [];
    let finalTokenIndex = -1;
    const tokenIndex = existingTokens.findIndex((token: any) => {
        const parsedToken = JSON.parse(token);
        return parsedToken.cardNumber === customFields?.isv_maskedPan &&
            parsedToken.value === customerTokenId &&
            parsedToken.instrumentIdentifier === instrumentIdentifier;
    });
    if (0 <= tokenIndex) {
        finalTokenIndex = tokenIndex;
        const parsedTokens = paymentUtils.updateParsedToken(existingTokens[finalTokenIndex], customFields, paymentInstrumentId, customerTokenId, customFields?.isv_addressId, billToFields);
        existingTokens[finalTokenIndex] = JSON.stringify(parsedTokens);
    } else {
        const tokenData = await paymentUtils.createTokenData(customFields, customerObj, paymentInstrumentId, instrumentIdentifier, customerTokenId, billToFields);
        existingTokens.push(JSON.stringify(tokenData));
    }
    return paymentActions.getUpdateTokenActions(existingTokens, existingFailedTokens, true, customerObj, null, customerTokenId);
};

const getTokenIds = (cardResponse: any, cardTokens: any) => {
    const customerTokenId = cardResponse?.data?.tokenInformation?.customer?.id?.length ? cardResponse.data.tokenInformation.customer.id : cardTokens.customerTokenId;
    const paymentInstrumentId = cardResponse.data.tokenInformation.paymentInstrument.id;
    const instrumentIdentifier = cardResponse.data.tokenInformation.instrumentIdentifier.id;
    return { customerTokenId, paymentInstrumentId, instrumentIdentifier };
};

const processInvalidCardResponse = async (customFields: any, customerObj: CustomerType, customerId: string): Promise<ActionResponseType> => {
    let existingTokens = customerObj?.custom?.fields?.isv_tokens || [];
    let existingFailedTokens: string[] = [];
    const addressIdField = customFields?.isv_addressId === Constants.UC_ADDRESS ? '' : customFields.isv_addressId || '';
    if (customFields?.isv_tokenAlias && customFields.isv_cardType && customFields.isv_maskedPan && customFields.isv_cardExpiryMonth && customFields.isv_cardExpiryYear) {
        existingFailedTokens = await paymentUtils.createFailedTokenData(customFields, addressIdField);
    }
    const response = paymentActions.getUpdateTokenActions(existingTokens, existingFailedTokens, true, customerObj, null);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_PROCESS_INVALID_CARD_RESPONSE, Constants.LOG_ERROR, 'CustomerId : ' + customerId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
    return response;
};

const getBillToFields = async (customFields: any, addressObj: readonly AddressType[], customerObj: CustomerType): Promise<AddressType | null> => {
    let billToFields = null;
    if (Constants.UC_ADDRESS === customFields?.isv_addressId) {
        const ucAddressData = await getTransientTokenData.getTransientTokenDataResponse(customerObj, 'MyAccounts');
        if (Constants.HTTP_OK_STATUS_CODE === ucAddressData?.httpCode) {
            billToFields = ucAddressData.data.orderInformation.billTo;
        }
    } else {
        billToFields = addressObj.find(address => customFields?.isv_addressId === address.id) || null;
    }
    return billToFields;
};
/**
 * Counts the number of tokens added within a specific time interval.
 * 
 * @param {CustomerType | null} customerObj - Customer object.
 * @param {string} startTime - Start time of the interval.
 * @param {string} endTime - End time of the interval.
 * @returns {number} - Number of tokens added within the interval.
 */
const getRateLimiterTokenCount = async (customerObj: Partial<CustomerType> | null, startTime: string, endTime: string): Promise<number> => {
    let existingTokens: string[];
    let existingFailedTokens: string[];
    let count = 0;
    if (customerObj?.custom?.fields?.isv_failedTokens?.length) {
        existingFailedTokens = customerObj.custom.fields.isv_failedTokens;
        count += paymentUtils.countTokenForGivenInterval(existingFailedTokens, startTime, endTime);
    }
    if (customerObj?.custom?.fields?.isv_tokens?.length) {
        existingTokens = customerObj.custom.fields.isv_tokens;
        count += paymentUtils.countTokenForGivenInterval(existingTokens, startTime, endTime);
    }
    return count;
};

export default {
    processValidCardResponse,
    processInvalidCardResponse,
    getBillToFields,
    getRateLimiterTokenCount
}