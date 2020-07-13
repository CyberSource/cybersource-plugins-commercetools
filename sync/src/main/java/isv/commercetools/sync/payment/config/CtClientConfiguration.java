package isv.commercetools.sync.payment.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class CtClientConfiguration {
  private String clientId;
  private String secret;

  public void setClientId(String clientId) {
    this.clientId = clientId;
  }

  public void setSecret(String secret) {
    this.secret = secret;
  }

  public String getClientId() {
    return clientId;
  }

  public String getSecret() {
    return secret;
  }

}
