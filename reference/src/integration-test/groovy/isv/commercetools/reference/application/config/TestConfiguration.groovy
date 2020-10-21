package isv.commercetools.reference.application.config

import org.springframework.boot.test.web.client.LocalHostUriTemplateHandler
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment

@Configuration
class TestConfiguration {

    @Bean
    TestRestTemplate testRestTemplate(Environment environment) {
        configureTestRestTemplate(environment).withBasicAuth('isv-ct-extension', 'Passw0rd')
    }

    @Bean
    TestRestTemplate badAuthTestRestTemplate(Environment environment) {
        configureTestRestTemplate(environment).withBasicAuth('isv-ct-extension', 'wrong')
    }

    @Bean
    TestRestTemplate noAuthTestRestTemplate(Environment environment) {
        configureTestRestTemplate(environment)
    }

    TestRestTemplate configureTestRestTemplate(Environment environment) {
        TestRestTemplate testRestTemplate = new TestRestTemplate()
        testRestTemplate.uriTemplateHandler = new LocalHostUriTemplateHandler(environment)
        testRestTemplate
    }

}
