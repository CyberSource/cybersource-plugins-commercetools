package com.cybersource.commercetools.mapping.transformer.fieldgroup

import com.cybersource.commercetools.mapping.model.PaymentDetails
import spock.lang.Specification

class VisaCheckoutDataServiceFieldGroupTransformerSpecification extends Specification {

    def 'Should be set to run'() {
        when:
        def result = new VisaCheckoutDataServiceFieldGroupTransformer().configure(Mock(PaymentDetails))

        then:
        result.size() == 1
        result[0].run
    }
}
