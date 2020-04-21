package com.cybersource.commercetools.config

import com.cybersource.commercetools.sync.RequestStubBuilder
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties('testconfiguration')
class TestConfiguration {

    @Bean
    RequestStubBuilder getRequestBuilder() {
        new RequestStubBuilder()
    }
}
