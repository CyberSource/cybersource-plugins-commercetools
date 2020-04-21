package com.cybersource.commercetools.reference.application.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@ConfigurationProperties("cybersource")
@Configuration
public class CybersourceConfigurationProperties {

  private Map<String,String> client;

  public Map<String, String> getClient() {
    return client;
  }

  public void setClient(Map<String, String> client) {
    this.client = client;
  }

}
