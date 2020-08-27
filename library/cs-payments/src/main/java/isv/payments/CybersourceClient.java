package isv.payments;

import com.cybersource.ws.client.Client;
import com.cybersource.ws.client.ClientException;
import com.cybersource.ws.client.FaultException;
import isv.payments.exception.PaymentException;
import isv.payments.model.CybersourceRequest;
import isv.payments.transformer.RequestToMapTransformer;
import java.util.Map;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CybersourceClient {

  private static final Logger LOGGER = LoggerFactory.getLogger(CybersourceClient.class);
  private final Properties properties;
  private final RequestToMapTransformer transformer;
  private final CybersourceClientDelegate clientDelegate;

  /***
   * @param cybersourceConfigProperties Properties to configure the cybersource client, see
   *                                    the CyberSource Simple Order API Client Developer Guide
   *                                    for what is required
   */
  public CybersourceClient(Properties cybersourceConfigProperties) {
    this.properties = cybersourceConfigProperties;
    this.clientDelegate = new CybersourceClientDelegate();
    this.transformer = new RequestToMapTransformer();
  }

  /**
   * Used to replace inner classes with mocks for testing purposes
   */
  protected CybersourceClient(Properties cybersourceConfigProperties, CybersourceClientDelegate clientDelegate, RequestToMapTransformer transformer) {
    this.properties = cybersourceConfigProperties;
    this.clientDelegate = clientDelegate;
    this.transformer = transformer;

  }

  public Map makeRequest(CybersourceRequest request) throws PaymentException {
    var transformedRequest = transformer.transform(request);
    return makeRequest(transformedRequest);
  }

  public Map makeRequest(Map requestMap) throws PaymentException {
    try {
      LOGGER.trace(String.format("Cybersource Request: %s", requestMap.toString()));
      var result = clientDelegate.runTransaction(requestMap, properties);
      LOGGER.trace(String.format("Cybersource Response: %s", result.toString()));
      return result;
    } catch (FaultException | ClientException e) {
      throw new PaymentException(e);
    }
  }

  private class CybersourceClientDelegate {
    protected Map runTransaction(Map<String, String> request, Properties props)
            throws FaultException, ClientException {
      return Client.runTransaction(request, props);
    }
  }

}
