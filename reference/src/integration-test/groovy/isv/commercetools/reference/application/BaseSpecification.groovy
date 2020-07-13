package isv.commercetools.reference.application

import isv.commercetools.reference.application.helper.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

@ActiveProfiles(['dev'])
class BaseSpecification extends Specification {

    @Autowired
    TestRestTemplate testRestTemplate

    @Autowired
    CardinalHelper cardinalHelper

    @Autowired
    CommerceToolsHelper commerceToolsHelper

    @Autowired
    TokenHelper tokenHelper

    @Autowired
    RequestBuilder requestBuilder

    @Autowired
    CybersourceHelper cybersourceHelper

    String paymentCreateUrl = '/api/extension/payment/create'
    String paymentUpdateUrl = '/api/extension/payment/update'

}
