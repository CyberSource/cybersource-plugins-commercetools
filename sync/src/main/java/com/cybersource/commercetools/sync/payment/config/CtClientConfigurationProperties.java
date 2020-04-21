package com.cybersource.commercetools.sync.payment.config;

import io.sphere.sdk.client.SphereClientConfig;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
@ConfigurationProperties("commercetools")
public class CtClientConfigurationProperties {

  private String projectKey;
  private String authUrl;
  private String apiUrl;
  private Map<String, CtClientConfiguration> clientConfig;

  public SphereClientConfig configBuilder() {
    return SphereClientConfig.of(
      projectKey,
      clientConfig.get("payment").getClientId(),
      clientConfig.get("payment").getSecret(),
      authUrl,
      apiUrl);
  }

  public void setProjectKey(String projectKey) {
    this.projectKey = projectKey;
  }

  public void setAuthUrl(String authUrl) {
    this.authUrl = authUrl;
  }

  public void setApiUrl(String apiUrl) {
    this.apiUrl = apiUrl;
  }

  public String getProjectKey() {
    return projectKey;
  }

  public String getAuthUrl() {
    return authUrl;
  }

  public String getApiUrl() {
    return apiUrl;
  }

  public Map<String, CtClientConfiguration> getClientConfig() {
    return clientConfig;
  }

  public void setClientConfig(Map<String, CtClientConfiguration> clientConfig) {
    this.clientConfig = clientConfig;
  }
}
