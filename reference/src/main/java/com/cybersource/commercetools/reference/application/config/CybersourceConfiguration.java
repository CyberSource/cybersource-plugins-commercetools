package com.cybersource.commercetools.reference.application.config;

import com.cybersource.cardinal.service.CardinalService;
import com.cybersource.commercetools.mapping.model.CybersourceIds;
import com.cybersource.flex.sdk.FlexServiceFactory;
import com.cybersource.flex.sdk.authentication.CyberSourceFlexCredentials;
import com.cybersource.flex.sdk.authentication.Environment;
import com.cybersource.flex.sdk.exception.FlexException;
import com.cybersource.flex.service.KeyService;
import com.cybersource.payments.CybersourceClient;
import org.springframework.beans.BeanInstantiationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.Map;
import java.util.Properties;

@Configuration
public class CybersourceConfiguration {

    private final CardinalClientConfigurationProperties cardinalClientConfigurationProperties;

    public CybersourceConfiguration(CardinalClientConfigurationProperties cardinalClientConfigurationProperties) {
        this.cardinalClientConfigurationProperties = cardinalClientConfigurationProperties;
    }

    /***
     * The Cybersource Simple Order SDK requires a Properties object containing cybersource configuration values for each request.
     * We are building this properties object using the CybersourceConfiguration ConfigurationProperties class, which is being loaded
     * from the application.yaml. You can find the list of values in {@link com.cybersource.ws.client.MerchantConfig}
     * @param appConfig The ConfigurationProperties object for Cybersource configuration
     * @return Properties object containing Cybersource client configuration values.
     */
    @Bean
    public Properties cybersourceProperties(CybersourceConfigurationProperties appConfig) {
        Map csConfig = appConfig.getClient();
        if (csConfig.isEmpty()) {
            throw new BeanInstantiationException(Properties.class, "No Cybersource client configuration provided");
        }
        Properties properties = new Properties();
        properties.putAll(csConfig);
        return properties;
    }

    @Bean
    public CybersourceClient cybersourceClient(Properties cybersourceProperties) {
        return new CybersourceClient(cybersourceProperties);
    }

    /**
     * The service that will be used to create one time keys for tokenisation.
     * @param merchantId Cybersource Merchant ID from properties
     * @param environment Cybersource environment from properties
     * @param sharedSecretId Cybersource shared secret ID from properties
     * @param sharedSecretValue Cybersource shared secret value from properties
     * @return
     * @throws FlexException
     */
    @Bean
    @SuppressWarnings("PMD.UseVarargs")
    public KeyService keyService(
            @Value("${cybersource.client.merchantID}") String merchantId,
            @Value("${cybersource.client.environment}") String environment,
            @Value("${cybersource.client.sharedSecret.id}") String sharedSecretId,
            @Value("${cybersource.client.sharedSecret.value}") char[] sharedSecretValue
    ) throws FlexException {
        var credentials = new CyberSourceFlexCredentials();
        credentials.setEnvironment(Environment.valueOf(environment));
        credentials.setMid(merchantId);
        credentials.setKeyId(sharedSecretId);
        credentials.setSharedSecret(sharedSecretValue);
        Arrays.fill(sharedSecretValue, '0');

        var flexService = FlexServiceFactory.createInstance(credentials);
        return new KeyService(flexService);
    }

    @Bean
    public CardinalService cardinalService() {
        byte[] apiKey = cardinalClientConfigurationProperties.getApiKey().getBytes();

        var cardinalService = new CardinalService(
                apiKey,
                cardinalClientConfigurationProperties.getApiIdentifier(),
                cardinalClientConfigurationProperties.getOrgUnitId(),
                cardinalClientConfigurationProperties.getTtlMillis());

        cardinalClientConfigurationProperties.setApiKey(null);

        return cardinalService;
    }

    @Bean
    public CybersourceIds cybersourceIds(Properties cybersourceProperties) {
        var cybersourceIds = new CybersourceIds();
        cybersourceIds.setMerchantId(cybersourceProperties.getProperty("merchantID"));
        cybersourceIds.setDeveloperId(cybersourceProperties.getProperty("developerID"));
        return cybersourceIds;
    }

}
