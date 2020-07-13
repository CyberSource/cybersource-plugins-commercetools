package isv.commercetools.reference.application.validation.rules.service

import io.sphere.sdk.json.SphereJsonUtils
import isv.commercetools.api.extension.model.ErrorCode
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.interactions.EnrolmentData
import spock.lang.Specification

class ExpectNoEnrollmentDataValidationRuleSpecification extends Specification {

    ExpectNoEnrollmentDataValidationRule testObj

    def paymentMock = Mock(CustomPayment)
    def enrolmentDataMock = Mock(EnrolmentData)

    def setup() {
        testObj = new ExpectNoEnrollmentDataValidationRule(SphereJsonUtils.newObjectMapper())

        paymentMock.enrolmentData >> enrolmentDataMock
    }

    def 'should return error when enrolment data is present'() {
        given:
        enrolmentDataMock.authenticationRequired >> Optional.of(false)

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 1
        result[0].code == ErrorCode.INVALID_OPERATION
        result[0].message == 'Unexpected payer authentication enrolment data present'
    }

    def 'should not return error when enrolment data is absent'() {
        given:
        enrolmentDataMock.authenticationRequired >> Optional.ofNullable(null)

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 0
    }

}
