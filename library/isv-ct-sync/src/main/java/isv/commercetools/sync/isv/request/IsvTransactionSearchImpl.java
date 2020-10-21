package isv.commercetools.sync.isv.request;

public class IsvTransactionSearchImpl implements IsvTransactionSearch {

  private final String query;
  private final String sort;
  private final int batchSize;

  public IsvTransactionSearchImpl(String query, String sort, int batchSize) {
    this.query = query;
    this.sort = sort;
    this.batchSize = batchSize;
  }

  @Override
  public Model.CreateSearchRequest buildRequest(int offset) {
    var request = new Model.CreateSearchRequest();
    request.save(false);
    request.query(query);
    request.offset(offset);
    request.limit(batchSize);
    request.sort(sort);
    return request;
  }

  @Override
  public int getBatchSize() {
    return this.batchSize;
  }

}
