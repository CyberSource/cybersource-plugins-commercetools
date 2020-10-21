package isv.commercetools.sync.isv.request;

import Model.CreateSearchRequest;

/**
 * Manages the state of a paginated search using the provided IsvTransactionSearch
 */
public class IsvTransactionSearchPagination {

  private final IsvTransactionSearch transactionSearch;

  private int currentPage;

  public IsvTransactionSearchPagination(IsvTransactionSearch transactionSearch) {
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
