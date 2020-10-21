package isv.commercetools.config

import Invokers.ApiClient
import Invokers.Pair
import com.cybersource.authsdk.core.ConfigException
import com.cybersource.authsdk.core.MerchantConfig
import isv.commercetools.sync.RequestStubBuilder
import isv.commercetools.sync.payment.config.PaymentServiceClientConfigurationProperties
import org.springframework.beans.BeanInstantiationException
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary

@Configuration
@ConfigurationProperties('testconfiguration')
class TestConfiguration {

    @Bean
    RequestStubBuilder getRequestBuilder() {
        new RequestStubBuilder()
    }

    @Bean
    @Primary
    ApiClient testPaymentServiceClient(PaymentServiceClientConfigurationProperties appConfig) throws ConfigException {
        Map paymentServiceClientConfig = appConfig.client
        if (paymentServiceClientConfig.isEmpty()) {
            throw new BeanInstantiationException(Properties, 'No payment service client configuration provided')
        }
        Properties properties = new Properties()
        properties.putAll(paymentServiceClientConfig)

        new ApiClient(new MerchantConfig(properties)) {
            @Override
            String buildUrl(String path, List<Pair> queryParams) {
                super.buildUrl(path, queryParams).replace('https://', 'http://')
            }
        }
    }
}
