package isv.commercetools.sync;

import Model.TssV2TransactionsPost201Response;
import Model.TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries;
import isv.commercetools.sync.cybersource.CsTransactionSearchService;
import isv.commercetools.sync.cybersource.request.CsTransactionSearch;
import isv.commercetools.sync.cybersource.request.CsTransactionSearchPagination;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Orchestrates the synchronization of Commercetools transactions and Cybersource transactions.
 */
public class SynchronizationRunner {

  private static final Logger LOGGER = LoggerFactory.getLogger(SynchronizationRunner.class);

  private final CsTransactionSearchService csTransactionSearchService;
  private final TransactionSynchronizer transactionSynchronizer;

  public SynchronizationRunner(
    CsTransactionSearchService csTransactionSearchService,
    TransactionSynchronizer transactionSynchronizer
  ) {
    this.csTransactionSearchService = csTransactionSearchService;
    this.transactionSynchronizer = transactionSynchronizer;
  }

  /***
   * Creates a paginated search of Cybersource using the given CsTransactionSearch and attempts synchronization in batches.
   * @param transactionSearch A configured CsTransactionSearch
   */
  public void synchronize(CsTransactionSearch transactionSearch) {
    var paginatedSearch = new CsTransactionSearchPagination(transactionSearch);
    var result = csTransactionSearchService.doRequest(paginatedSearch.next());
    LOGGER.info("Running synchronization - {} results found", result.getTotalCount());
    while (result.getCount() > 0) {
      LOGGER.info("Synchronizing... Processed: {}/{}", result.getOffset(), result.getTotalCount());
      syncTransactions(result);
      result = csTransactionSearchService.doRequest(paginatedSearch.next());
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
