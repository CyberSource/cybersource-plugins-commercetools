package isv.payments;

import com.cybersource.ws.client.Client;
import com.cybersource.ws.client.ClientException;
import com.cybersource.ws.client.FaultException;
import isv.payments.exception.PaymentException;
import isv.payments.model.PaymentServiceRequest;
import isv.payments.transformer.RequestToMapTransformer;
import java.util.Map;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PaymentServiceClient {

  private static final Logger LOGGER = LoggerFactory.getLogger(PaymentServiceClient.class);
  private final Properties properties;
  private final RequestToMapTransformer transformer;
  private final PaymentServiceClientDelegate clientDelegate;

  /***
   * @param configProperties Properties to configure the payment service client, see
   *                                    the Simple Order API Client Developer Guide
   *                                    for what is required
   */
  public PaymentServiceClient(Properties configProperties) {
    this.properties = configProperties;
    this.clientDelegate = new PaymentServiceClientDelegate();
    this.transformer = new RequestToMapTransformer();
  }

  /**
   * Used to replace inner classes with mocks for testing purposes
   */
  protected PaymentServiceClient(Properties configProperties, PaymentServiceClientDelegate clientDelegate, RequestToMapTransformer transformer) {
    this.properties = configProperties;
    this.clientDelegate = clientDelegate;
    this.transformer = transformer;

  }

  public Map makeRequest(PaymentServiceRequest request) throws PaymentException {
    var transformedRequest = transformer.transform(request);
    return makeRequest(transformedRequest);
  }

  public Map makeRequest(Map requestMap) throws PaymentException {
    try {
      LOGGER.trace(String.format("Payment service Request: %s", requestMap.toString()));
      var result = clientDelegate.runTransaction(requestMap, properties);
      LOGGER.trace(String.format("Payment service Response: %s", result.toString()));
      return result;
    } catch (FaultException | ClientException e) {
      throw new PaymentException(e);
    }
  }

  private class PaymentServiceClientDelegate {
    protected Map runTransaction(Map<String, String> request, Properties props)
            throws FaultException, ClientException {
      return Client.runTransaction(request, props);
    }
  }

}
