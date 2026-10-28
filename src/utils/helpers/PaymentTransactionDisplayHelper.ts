
export type TransactionLike = {
  type?: string;
  transactionType?: string;
  state?: string;
  status?: string;
  interactionId?: string | number | null;
  [key: string]: unknown;
};

export const filterTransactionsForDisplay = (
  transactions: TransactionLike[] | null | undefined,
  logger?: (message: string) => void
): TransactionLike[] => {
  if (!Array.isArray(transactions) || !transactions.length) {
    return [];
  }

  const normalizedTransactions = transactions.filter(
    (transaction): transaction is TransactionLike => !!transaction && typeof transaction === 'object'
  );

  return normalizedTransactions.filter((transaction) => {
    const transactionType = String(transaction?.type || transaction?.transactionType || '').trim();
    const interactionId = String(transaction?.interactionId || '').trim();

    const isAuthorization = transactionType === 'Authorization';
    if (!isAuthorization) {
      return true;
    }

    if (!interactionId) {
      return true;
    }

    const hasMatchingSuccessfulCharge = normalizedTransactions.some((otherTransaction) => {
      const otherType = String(otherTransaction?.type || otherTransaction?.transactionType || '').trim();
      const otherInteractionId = String(otherTransaction?.interactionId || '').trim();
      const otherState = String(otherTransaction?.state || otherTransaction?.status || '').trim();

      return (
        otherType === 'Charge' &&
        !!otherInteractionId &&
        interactionId === otherInteractionId &&
        otherState === 'Success'
      );
    });

    if (hasMatchingSuccessfulCharge) {
      logger?.(
        '[PaymentTransactionDisplayHelper] Hiding Authorization row from display because a successful Charge row shares interactionId=' +
          interactionId
      );
      return false;
    }

    return true;
  });
};

export default {
  filterTransactionsForDisplay,
};

