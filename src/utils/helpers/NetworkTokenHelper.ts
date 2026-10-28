import { Customer } from '@commercetools/platform-sdk';

import { Constants } from '../../constants/paymentConstants';
import { CustomerTokensType } from '../../types/Types';
import paymentUtils from '../PaymentUtils';
import { PaymentInstrumentDetailsResponse } from '../../service/payment/GetPaymentInstrumentDetails';
import paymentInstrumentDetailsService from '../../service/payment/GetPaymentInstrumentDetails';

type RefreshableToken = Partial<CustomerTokensType> & {
  isNetworkToken?: boolean | string;
  paymentInstrumentId?: string;
};

const isNetworkToken = (card: RefreshableToken): boolean => {
  if (typeof card?.isNetworkToken === 'boolean') {
    const result = card.isNetworkToken;
    return result;
  }
  if (typeof card?.isNetworkToken === 'string') {
    const result = 'true' === card.isNetworkToken.toLowerCase();
    return result;
  }
  const hasInstrumentIdentifier = !!card?.instrumentIdentifier;
  return hasInstrumentIdentifier;
};

const isTokenValid = (response: PaymentInstrumentDetailsResponse | null): boolean => {
  if (!response) {
    return false;
  }

  if (Constants.HTTP_OK_STATUS_CODE !== response.httpCode) {
    return false;
  }

  if (!response.paymentInstrumentId) {
    return false;
  }

  const paymentInstrumentState = response.paymentInstrumentState ? response.paymentInstrumentState.toUpperCase() : '';
  const networkTokenState = response.networkTokenState ? response.networkTokenState.toUpperCase() : '';
  const invalidStates = ['CLOSED', 'DELETED', 'EXPIRED', 'INACTIVE', 'SUSPENDED'];

  if (paymentInstrumentState && invalidStates.includes(paymentInstrumentState)) {
    return false;
  }

  if (networkTokenState && invalidStates.includes(networkTokenState)) {
    return false;
  }

  if (paymentInstrumentState && 'ACTIVE' !== paymentInstrumentState && !networkTokenState) {
    return false;
  }

  return true;
};

const updateCardIfChanged = (card: RefreshableToken, response: PaymentInstrumentDetailsResponse): RefreshableToken => {
  const updatedCard: RefreshableToken = { ...card };
  const currentCardNumber = card.cardNumber || '';
  const currentLast4 = currentCardNumber ? currentCardNumber.slice(-4) : '';
  const responseLast4 = response.cardSuffix || '';
  let updateCount = 0;

  if (currentCardNumber && responseLast4 && currentLast4 !== responseLast4) {
    updatedCard.cardNumber = `${currentCardNumber.slice(0, Math.max(0, currentCardNumber.length - 4))}${responseLast4}`;
    updateCount++;
  }

  if (response.expirationMonth && card.cardExpiryMonth !== response.expirationMonth) {
    updatedCard.cardExpiryMonth = response.expirationMonth;
    updateCount++;
  }

  if (response.expirationYear && card.cardExpiryYear !== response.expirationYear) {
    updatedCard.cardExpiryYear = response.expirationYear;
    updateCount++;
  }

  if (updateCount === 0) {
  }

  return updatedCard;
};

const getPaymentInstrumentDetails = async (paymentInstrumentId: string, merchantId: string): Promise<PaymentInstrumentDetailsResponse> => {
  return await paymentInstrumentDetailsService.getPaymentInstrumentDetails(paymentInstrumentId, merchantId);
};

const refreshNetworkTokenCards = async (savedCards: string[] = [], customerObj?: Partial<Customer> | null): Promise<string[]> => {
  const refreshedCards: string[] = [];
  const customerId = customerObj?.id || '';
  const merchantId = customerObj?.custom?.fields?.isv_merchantId || process.env.PAYMENT_GATEWAY_MERCHANT_ID || '';
  let processedCount = 0;
  let keptCount = 0;
  let removedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const savedCard of savedCards) {
    if (!savedCard) {
      continue;
    }

    let parsedCard: RefreshableToken | null = null;
    try {
      parsedCard = JSON.parse(savedCard);
      processedCount++;
    } catch (error) {
      errorCount++;
      paymentUtils.logData(__filename, 'FuncRefreshNetworkTokenCards', Constants.LOG_WARN, 'CustomerId: ' + customerId, '[TMS API REFRESH] Skipping unparsable saved card token. ParseError: ' + (error instanceof Error ? error.message : String(error)));
      refreshedCards.push(savedCard);
      keptCount++;
      continue;
    }

    if (!parsedCard || !isNetworkToken(parsedCard)) {
      refreshedCards.push(savedCard);
      keptCount++;
      continue;
    }

    const paymentInstrumentId = parsedCard.paymentToken || parsedCard.paymentInstrumentId || '';
    if (!paymentInstrumentId) {
      refreshedCards.push(savedCard);
      keptCount++;
      continue;
    }

    try {
      const paymentInstrumentDetails = await getPaymentInstrumentDetails(paymentInstrumentId, merchantId);

      if (!isTokenValid(paymentInstrumentDetails)) {
        removedCount++;
        continue;
      }

      const cardBeforeUpdate = { ...parsedCard };
      const updatedCard = updateCardIfChanged(parsedCard, paymentInstrumentDetails);
      const wasUpdated = JSON.stringify(cardBeforeUpdate) !== JSON.stringify(updatedCard);

      if (wasUpdated) {
        updatedCount++;
      } else {
        keptCount++;
      }

      const updatedCardString = JSON.stringify(updatedCard);
      refreshedCards.push(updatedCardString);
    } catch (error) {
      errorCount++;
      paymentUtils.logData(__filename, 'FuncRefreshNetworkTokenCards', Constants.LOG_WARN, 'CustomerId: ' + customerId, '[TMS API REFRESH] Error refreshing PaymentInstrumentId=' + paymentInstrumentId + '. Error: ' + (error instanceof Error ? error.message : String(error)) + '. Keeping card as-is.');
      refreshedCards.push(savedCard);
      keptCount++;
    }
  }
  return refreshedCards;
};

export default {
  refreshNetworkTokenCards,
  isNetworkToken,
  isTokenValid,
  updateCardIfChanged,
  getPaymentInstrumentDetails,
};
