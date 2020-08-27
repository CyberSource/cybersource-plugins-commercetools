package isv.commercetools.sync.cybersource.request;

import Model.CreateSearchRequest;

/**
 * Manages the state of a paginated search using the provided CsTransactionSearch
 */
public class CsTransactionSearchPagination {

  private final CsTransactionSearch transactionSearch;

  private int currentPage;

  public CsTransactionSearchPagination(CsTransactionSearch transactionSearch) {
    this.transactionSearch = transactionSearch;
    this.currentPage = 0;
  }

  public CreateSearchRequest next() {
    var req = transactionSearch.buildRequest(currentPage * transactionSearch.getBatchSize());
    currentPage++;
    return req;
  }

  public int getCurrentPage() {
    return currentPage;
  }
}
