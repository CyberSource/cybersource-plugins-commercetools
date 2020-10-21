package isv.commercetools.mapping.transformer

import isv.commercetools.mapping.model.PaymentDetails
import isv.commercetools.mapping.transformer.fieldgroup.FieldGroupTransformer
import isv.payments.model.fields.RequestServiceFieldGroup
import spock.lang.Specification

class RequestTransformerSpecification extends Specification {

    RequestTransformer testObj

    FieldGroupTransformer fieldGroupTransformerMock1 = Mock()
    FieldGroupTransformer fieldGroupTransformerMock2 = Mock()
    RequestServiceFieldGroup fieldGroupMock1 = Mock()
    RequestServiceFieldGroup fieldGroupMock2 = Mock()
    RequestServiceFieldGroup fieldGroupMock3 = Mock()
    PaymentDetails paymentDetailsMock = Mock()

    def setup() {
        testObj = new RequestTransformer([fieldGroupTransformerMock1, fieldGroupTransformerMock2])

        fieldGroupTransformerMock1.configure(paymentDetailsMock) >> [fieldGroupMock1]
        fieldGroupTransformerMock2.configure(paymentDetailsMock) >> [fieldGroupMock2, fieldGroupMock3]
    }

    def 'should configure field groups using transformers'() {
        when:
        def result = testObj.configureFieldGroups(paymentDetailsMock)

        then:
        result == [fieldGroupMock1, fieldGroupMock2, fieldGroupMock3]
    }

    def 'should create payment service request with field groups'() {
        when:
        def result = testObj.transform(paymentDetailsMock)

        then:
        result.fieldGroups == [fieldGroupMock1, fieldGroupMock2, fieldGroupMock3]
    }

}
