package com.cybersource.commercetools.sync;

import Model.TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries;
import com.cybersource.commercetools.sync.commercetools.CtPaymentSearchService;
import com.cybersource.commercetools.sync.commercetools.CtTransactionService;
import io.sphere.sdk.payments.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

/**
 * The TransactionSynchronizer will take a Cybersource transaction and attempt to find a Commercetools payment with the same ID as the
 * Cybersource transactions' MerchantReferenceCode. If the found Commercetools payment does not contain a relevant Transaction,
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

  public void synchronizeTransaction(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries csTransaction) {
    if (ctTransactionService.canCreateCtTransaction(csTransaction)) {
      Optional<Payment> ctPaymentOptional = findCtPaymentForCsTransaction(csTransaction);
      if (ctPaymentOptional.isEmpty()) {
        LOGGER.debug(String.format("No CT payment found for CS transaction %s", csTransaction.getId()));
      } else {
        Payment ctPayment = ctPaymentOptional.get();
        var applicationsToBeSynchronized = ctTransactionService.retrieveSynchronizableApplicationsForTransaction(csTransaction);
        applicationsToBeSynchronized.forEach(application -> {
          if (!ctTransactionService.csApplicationExistsOnPayment(ctPayment, csTransaction, application)) {
            LOGGER.info(String.format("Creating new transaction for CT Payment %s", ctPayment.getId()));
            ctTransactionService.addCtTransactionFromCsTransaction(csTransaction, ctPayment, application);
          }
        });
      }
    }
  }

  private Optional<Payment> findCtPaymentForCsTransaction(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries csTransaction) {
    var paymentId = csTransaction.getClientReferenceInformation().getCode();
    LOGGER.trace(String.format("Searching for CT payment: %s", paymentId));
    return ctPaymentSearchService.findPaymentByPaymentId(paymentId);
  }

}
