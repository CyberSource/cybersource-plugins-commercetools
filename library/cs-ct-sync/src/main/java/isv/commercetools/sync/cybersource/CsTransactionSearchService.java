package isv.commercetools.sync.cybersource;

import Api.ConversionDetailsApi;
import Api.SearchTransactionsApi;
import Invokers.ApiClient;
import Invokers.ApiException;
import Model.CreateSearchRequest;
import Model.ReportingV3ConversionDetailsGet200Response;
import Model.TssV2TransactionsPost201Response;
import Model.TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries;
import isv.commercetools.sync.cybersource.request.CsTransactionSearchPagination;
import java.util.ArrayList;
import java.util.List;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Simplifies the searching of Cybersource transactions using the Cybersource SDK
 */
public class CsTransactionSearchService {

  private static final Logger LOGGER = LoggerFactory.getLogger(CsTransactionSearchService.class);
  private final SearchTransactionsApi searchApiClient;
  private final ConversionDetailsApi conversionDetailsApiClient;

  public CsTransactionSearchService(ApiClient transactionSearchApiClient,
      ApiClient conversionSearchApiClient) {
    this.searchApiClient = new SearchTransactionsApi(transactionSearchApiClient);
    this.conversionDetailsApiClient = new ConversionDetailsApi(conversionSearchApiClient);
  }

  public CsTransactionSearchService(SearchTransactionsApi searchApiClient,
      ConversionDetailsApi conversionDetailsApiClient) {
    this.searchApiClient = searchApiClient;
    this.conversionDetailsApiClient = conversionDetailsApiClient;
  }

  /**
   * Will collect the results of all pages of a CsTransactionSearchPagination into a single list.
   *
   * @param req Configured paginated search request
   * @return A list of the TransactionSummaries from several Cybersource search results
   */
  public List<TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries> getAllResultsForPaginatedSearch(
      CsTransactionSearchPagination req) {
    var totalSummaries = new ArrayList<TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries>();

    var result = doRequest(req.next()).getEmbedded();

    while (result != null) {
      LOGGER.trace(String.format("%s transactions found, Searching for more...",
          result.getTransactionSummaries().size()));
      totalSummaries.addAll(result.getTransactionSummaries());
      result = doRequest(req.next()).getEmbedded();
    }
    return totalSummaries;
  }

  /**
   * Executes a single search request
   *
   * @param req A single configured search request
   * @return The complete cybersource search result
   */
  public TssV2TransactionsPost201Response doRequest(CreateSearchRequest req) {
    TssV2TransactionsPost201Response result = null;
    try {
      result = searchApiClient.createSearch(req);
      LOGGER.trace(String.format("%s transactions found", result.getCount()));
    } catch (ApiException e) {
      LOGGER.error("Could not search for transactions", e);
    }
    return result;
  }

  public ReportingV3ConversionDetailsGet200Response conversionDetailsGet200Response(
      DateTime startDate, DateTime endTime, String orgId) {
    ReportingV3ConversionDetailsGet200Response result = null;
    try {
      result = conversionDetailsApiClient.getConversionDetail(startDate, endTime, orgId);
    } catch (ApiException ex) {
      LOGGER.error("Could not search for transactions", ex);
    }
    return result;
  }
}
