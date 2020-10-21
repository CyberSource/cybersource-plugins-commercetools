package isv.commercetools.sync.isv.request;

/**
 * Represents a transaction search in the payment service. Implementations should contain extra fields in order to
 * create a valid CreateSearchRequest such as a query string, sort string, etc.
 */
public interface IsvTransactionSearch {

  Model.CreateSearchRequest buildRequest(int offset);
  int getBatchSize();

}
