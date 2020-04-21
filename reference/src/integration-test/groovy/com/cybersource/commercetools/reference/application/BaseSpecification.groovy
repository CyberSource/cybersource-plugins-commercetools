package com.cybersource.commercetools.reference.application

import com.cybersource.commercetools.reference.application.helper.CardinalHelper
import com.cybersource.commercetools.reference.application.helper.CommerceToolsHelper
import com.cybersource.commercetools.reference.application.helper.CybersourceHelper
import com.cybersource.commercetools.reference.application.helper.RequestBuilder
import com.cybersource.commercetools.reference.application.helper.TokenHelper
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
