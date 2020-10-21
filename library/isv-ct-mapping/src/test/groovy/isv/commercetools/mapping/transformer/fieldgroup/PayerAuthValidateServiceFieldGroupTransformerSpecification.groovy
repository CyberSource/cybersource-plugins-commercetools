package isv.commercetools.mapping.transformer.fieldgroup

import io.sphere.sdk.models.Reference
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.types.CustomFields
import io.sphere.sdk.types.Type
import isv.commercetools.mapping.constants.EnrolmentCheckDataConstants
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentDetails
import isv.commercetools.mapping.types.TypeCache
import spock.lang.Specification

class PayerAuthValidateServiceFieldGroupTransformerSpecification extends Specification {

    def testObj = new PayerAuthValidateServiceFieldGroupTransformer()

    Payment ctPaymentMock = Mock()
    Type typeMock = Mock()
    CustomFields enrolmentDataMock = Mock()
    Reference<Type> enrolmentDataTypeReferenceMock = Mock()

    def setup() {
        enrolmentDataMock.type >> enrolmentDataTypeReferenceMock
        enrolmentDataTypeReferenceMock.id >> 'enrolmentTypeId'
        typeMock.id >> 'enrolmentTypeId'
        typeMock.key >> EnrolmentCheckDataConstants.TYPE_KEY
        TypeCache.populate([typeMock])
    }

    def 'should transform payment to payer auth field group for card that requires authentication'() {
        given: 'we have a payment'
        ctPaymentMock.interfaceInteractions >> [enrolmentDataMock]
        enrolmentDataMock.getFieldAsBoolean(EnrolmentCheckDataConstants.AUTHENTICATION_REQUIRED) >> true
        enrolmentDataMock.getFieldAsString(EnrolmentCheckDataConstants.AUTHENTICATION_TRANSACTION_ID) >> 'authentication transaction id'

        def customPayment = new CustomPayment(ctPaymentMock)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct payer authentication values'
        result.size() == 1
        result[0].authenticationTransactionID == 'authentication transaction id'
        result[0].run == true
    }

    def 'should transform payment to payer auth field group for card that does not require authentication'() {
        given: 'we have a payment'
        ctPaymentMock.interfaceInteractions >> [enrolmentDataMock]
        enrolmentDataMock.getFieldAsBoolean(EnrolmentCheckDataConstants.AUTHENTICATION_REQUIRED) >> false

        def customPayment = new CustomPayment(ctPaymentMock)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has no payer authentication values'
        result.isEmpty()
    }

    def 'should fail to  transform a payment when enrolment data is missing'() {
        given: 'we have a payment'
        ctPaymentMock.interfaceInteractions >> []

        def customPayment = new CustomPayment(ctPaymentMock)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        testObj.configure(paymentDetails)

        then: 'it has no payer authentication values'
        thrown(NoSuchElementException)
    }
}
