package com.cybersource.commercetools.reference.application.config;

import com.cybersource.commercetools.reference.application.config.model.CtClientDefinition;
import io.sphere.sdk.client.SphereClientConfig;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.Optional;

@Configuration
@ConfigurationProperties("commercetools")
public class CtClientConfigurationProperties {

    private String projectKey;
    private String authUrl;
    private String apiUrl;
    private Map<String, CtClientDefinition> clientConfig;

    public Optional<SphereClientConfig> configBuilder(String clientConfigName) {
        return clientConfig != null && clientConfig.containsKey(clientConfigName)
                ? Optional.of(createSphereClientConfig(clientConfigName))
                : Optional.empty();
    }

    private SphereClientConfig createSphereClientConfig(String clientConfigName) {
        return SphereClientConfig.of(
                    projectKey,
                    clientConfig.get(clientConfigName).getClientId(),
                    clientConfig.get(clientConfigName).getSecret(),
                    authUrl,
                    apiUrl);
    }

    public String getProjectKey() {
        return projectKey;
    }

    public void setProjectKey(String projectKey) {
        this.projectKey = projectKey;
    }

    public String getAuthUrl() {
        return authUrl;
    }

    public void setAuthUrl(String authUrl) {
        this.authUrl = authUrl;
    }

    public String getApiUrl() {
        return apiUrl;
    }

    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }

    public Map<String, CtClientDefinition> getClientConfig() {
        return clientConfig;
    }

    public void setClientConfig(Map<String, CtClientDefinition> clientConfig) {
        this.clientConfig = clientConfig;
    }
}
