package isv.commercetools.sync.payment.config;

import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("isv.payments")
public class PaymentServiceClientConfigurationProperties {
  private Map<String,String> client;

  public Map<String, String> getClient() {
    return client;
  }

  public void setClient(Map<String, String> client) {
    this.client = client;
  }

}
