package isv.commercetools.reference.application.config;

import isv.cardinal.service.CardinalService;
import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.flex.service.KeyService;
import isv.payments.PaymentServiceClient;
import java.util.Map;
import java.util.Properties;
import org.springframework.beans.BeanInstantiationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PaymentServiceConfiguration {

    private final CardinalClientConfigurationProperties cardinalClientConfigurationProperties;

    public PaymentServiceConfiguration(CardinalClientConfigurationProperties cardinalClientConfigurationProperties) {
        this.cardinalClientConfigurationProperties = cardinalClientConfigurationProperties;
    }

    /***
     * The Simple Order SDK requires a Properties object containing configuration values for each request.
     * We are building this properties object using the PaymentServiceConfiguration ConfigurationProperties class, which is being loaded
     * from the application.yaml. You can find the list of values in the payment service documentation
     * @param appConfig The PaymentServiceConfigurationProperties object for payment service configuration
     * @return Properties object containing payment service client configuration values.
     */
    @Bean
    public Properties paymentServiceProperties(PaymentServiceConfigurationProperties appConfig) {
        Map paymentServiceConfig = appConfig.getClient();
        if (paymentServiceConfig.isEmpty()) {
            throw new BeanInstantiationException(Properties.class, "No payment service client configuration provided");
        }
        Properties properties = new Properties();
        properties.putAll(paymentServiceConfig);
        return properties;
    }

    @Bean
    public PaymentServiceClient paymentServiceClient(Properties paymentServiceProperties) {
        return new PaymentServiceClient(paymentServiceProperties);
    }

    /**
     * The service that will be used to create one time keys for tokenisation.
     * @param paymentServiceProperties payment service properties to configure connection
     * @param targetOrigins Domain(s) where the client calling this service are accessible
     * @param connectTimeout Timeout for connecting to payment service
     * @return
     */
    @Bean
    public KeyService keyService(
        Properties paymentServiceProperties,
        @Value("${isv.payments.flex.targetOrigins}") String targetOrigins,
        @Value("${isv.payments.flex.connectTimeout}") int connectTimeout
    ) {
        return new KeyService(paymentServiceProperties, targetOrigins, connectTimeout);
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
    public PaymentServiceIds paymentServiceIds(Properties paymentServiceProperties) {
        var paymentServiceIds = new PaymentServiceIds();
        paymentServiceIds.setMerchantId(paymentServiceProperties.getProperty("merchantID"));
        paymentServiceIds.setDeveloperId(paymentServiceProperties.getProperty("developerID"));
        return paymentServiceIds;
    }

}
