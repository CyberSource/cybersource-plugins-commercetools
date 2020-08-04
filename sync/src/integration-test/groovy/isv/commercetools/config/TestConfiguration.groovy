package isv.commercetools.config

import Invokers.ApiClient
import Invokers.Pair
import com.cybersource.authsdk.core.ConfigException
import com.cybersource.authsdk.core.MerchantConfig
import isv.commercetools.sync.RequestStubBuilder
import isv.commercetools.sync.payment.config.CsClientConfigurationProperties
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
    ApiClient testCybersourceClient(CsClientConfigurationProperties appConfig) throws ConfigException {
        Map csConfig = appConfig.client
        if (csConfig.isEmpty()) {
            throw new BeanInstantiationException(Properties, 'No Cybersource client configuration provided')
        }
        Properties properties = new Properties()
        properties.putAll(csConfig)

        new ApiClient(new MerchantConfig(properties)) {
            @Override
            String buildUrl(String path, List<Pair> queryParams) {
                super.buildUrl(path, queryParams).replace('https://', 'http://')
            }
        }
    }
}
