package isv.commercetools.reference.application.config;

import Invokers.ApiClient;
import com.cybersource.authsdk.core.ConfigException;
import com.cybersource.authsdk.core.MerchantConfig;
import isv.cardinal.service.CardinalService;
import isv.commercetools.mapping.model.CybersourceIds;
import isv.flex.service.KeyService;
import isv.payments.CybersourceClient;
import java.util.Map;
import java.util.Properties;
import org.springframework.beans.BeanInstantiationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
     * @param cybersourceProperties Cybersource properties to configure connection
     * @param targetOrigins Domain(s) where the client calling this service are accessible
     * @return
     * @throws ConfigException
     */
    @Bean
    public KeyService keyService(
        Properties cybersourceProperties,
        @Value("${cybersource.flex.targetOrigins}") String targetOrigins,
        @Value("${cybersource.flex.connectTimeout}") int connectTimeout
    ) throws ConfigException {
        var apiClient = new ApiClient(new MerchantConfig(cybersourceProperties));
        apiClient.setConnectTimeout(connectTimeout);
        return new KeyService(apiClient, targetOrigins);
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
