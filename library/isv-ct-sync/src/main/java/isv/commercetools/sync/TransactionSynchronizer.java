package isv.commercetools.sync;

import Model.TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries;
import io.sphere.sdk.payments.Payment;
import isv.commercetools.sync.commercetools.CtPaymentSearchService;
import isv.commercetools.sync.commercetools.CtTransactionService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The TransactionSynchronizer will take a payment service transaction and attempt to find a Commercetools payment with the same ID as the
 * payment service transactions' MerchantReferenceCode. If the found Commercetools payment does not contain a relevant Transaction,
 * it will be updated to contain the transaction information.
 */
public class TransactionSynchronizer {

  private static final Logger LOGGER = LoggerFactory.getLogger(TransactionSynchronizer.class);

  private final CtPaymentSearchService ctPaymentSearchService;
  private final CtTransactionService ctTransactionService;


  public TransactionSynchronizer(
    CtPaymentSearchService ctPaymentSearchService,
    CtTransactionService ctTransactionService) {
    this.ctPaymentSearchService = ctPaymentSearchService;
    this.ctTransactionService = ctTransactionService;
  }

  public void synchronizeTransaction(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries isvTransaction) {
    if (ctTransactionService.canCreateCtTransaction(isvTransaction)) {
      Optional<Payment> ctPaymentOptional = findCtPaymentForIsvTransaction(isvTransaction);
      if (ctPaymentOptional.isEmpty()) {
        LOGGER.debug(String.format("No CT payment found for ISV transaction %s", isvTransaction.getId()));
      } else {
        Payment ctPayment = ctPaymentOptional.get();
        var applicationsToBeSynchronized = ctTransactionService.retrieveSynchronizableApplicationsForTransaction(isvTransaction);
        applicationsToBeSynchronized.forEach(application -> {
          if (!ctTransactionService.isvApplicationExistsOnPayment(ctPayment, isvTransaction, application)) {
            LOGGER.info(String.format("Creating new transaction for CT Payment %s", ctPayment.getId()));
            ctTransactionService.addCtTransactionFromIsvTransaction(isvTransaction, ctPayment, application);
          }
        });
      }
    }
  }

  private Optional<Payment> findCtPaymentForIsvTransaction(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries isvTransaction) {
    var paymentId = isvTransaction.getClientReferenceInformation().getCode();
    LOGGER.trace(String.format("Searching for CT payment: %s", paymentId));
    return ctPaymentSearchService.findPaymentByPaymentId(paymentId);
  }

}
