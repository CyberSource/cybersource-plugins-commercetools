package isv.commercetools.sync.cybersource.request;

/**
 * Represents a transaction search in Cybersource. Implementations should contain extra fields in order to
 * create a valid CreateSearchRequest such as a query string, sort string, etc.
 */
public interface CsTransactionSearch {

  Model.CreateSearchRequest buildRequest(int offset);
  int getBatchSize();

}
