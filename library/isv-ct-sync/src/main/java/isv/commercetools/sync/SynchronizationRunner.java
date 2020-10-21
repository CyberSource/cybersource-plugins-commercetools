package isv.commercetools.sync;

import Model.TssV2TransactionsPost201Response;
import Model.TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries;
import isv.commercetools.sync.isv.IsvTransactionSearchService;
import isv.commercetools.sync.isv.request.IsvTransactionSearch;
import isv.commercetools.sync.isv.request.IsvTransactionSearchPagination;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Orchestrates the synchronization of Commercetools transactions and payment service transactions.
 */
public class SynchronizationRunner {

  private static final Logger LOGGER = LoggerFactory.getLogger(SynchronizationRunner.class);

  private final IsvTransactionSearchService isvTransactionSearchService;
  private final TransactionSynchronizer transactionSynchronizer;

  public SynchronizationRunner(
    IsvTransactionSearchService isvTransactionSearchService,
    TransactionSynchronizer transactionSynchronizer
  ) {
    this.isvTransactionSearchService = isvTransactionSearchService;
    this.transactionSynchronizer = transactionSynchronizer;
  }

  /***
   * Creates a paginated search of the payment service using the given IsvTransactionSearch and attempts synchronization in batches.
   * @param transactionSearch A configured IsvTransactionSearch
   */
  public void synchronize(IsvTransactionSearch transactionSearch) {
    var paginatedSearch = new IsvTransactionSearchPagination(transactionSearch);
    var result = isvTransactionSearchService.doRequest(paginatedSearch.next());
    LOGGER.info("Running synchronization - {} results found", result.getTotalCount());
    while (result.getCount() > 0) {
      LOGGER.info("Synchronizing... Processed: {}/{}", result.getOffset(), result.getTotalCount());
      syncTransactions(result);
      result = isvTransactionSearchService.doRequest(paginatedSearch.next());
    }
    LOGGER.info("Synchronization complete");
  }

  private void syncTransactions(TssV2TransactionsPost201Response result) {
    result.getEmbedded().getTransactionSummaries()
      .stream()
      .filter(it -> getUUIDFromTransaction(it) != null)
      .forEach(transactionSynchronizer::synchronizeTransaction);
  }

  private UUID getUUIDFromTransaction(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries transaction) {
    var optionalMerchantRefId = Optional.ofNullable(transaction.getClientReferenceInformation().getCode()).orElse("");
    UUID resultUuid = null;
    try {
      resultUuid = UUID.fromString(optionalMerchantRefId);
    } catch (IllegalArgumentException e) {
      LOGGER.trace(String.format("Invalid UUID - %s, ignoring", optionalMerchantRefId));
    }
    return resultUuid;
  }
}
