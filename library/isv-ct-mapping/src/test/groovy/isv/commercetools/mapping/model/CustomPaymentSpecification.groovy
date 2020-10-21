package isv.commercetools.mapping.model

import io.sphere.sdk.models.Reference
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.PaymentMethodInfo
import io.sphere.sdk.types.CustomFields
import io.sphere.sdk.types.Type
import isv.commercetools.mapping.constants.EnrolmentCheckDataConstants
import isv.commercetools.mapping.constants.PaymentCustomFieldConstants
import isv.commercetools.mapping.types.TypeCache
import spock.lang.Specification

class CustomPaymentSpecification extends Specification {

    Payment paymentMock = Mock()
    Type enrolmentDataTypeMock = Mock()
    CustomFields enrolmentDataMock = Mock()
    Reference<Type> enrolmentDataTypeReferenceMock = Mock()
    CustomFields customFieldsMock = Mock()
    PaymentMethodInfo paymentMethodInfoMock = Mock()

    def testObj = new CustomPayment(paymentMock)

    def setup() {
        enrolmentDataTypeMock.key >> EnrolmentCheckDataConstants.TYPE_KEY
        enrolmentDataTypeMock.id >> 'enrolment data type id'

        enrolmentDataMock.type >> enrolmentDataTypeReferenceMock
        enrolmentDataTypeReferenceMock.id >> 'enrolment data type id'

        TypeCache.populate([enrolmentDataTypeMock])
    }

    def 'should return empty when interaction is missing'() {
        given:
        paymentMock.interfaceInteractions >> []

        when:
        def result = testObj.enrolmentData

        then:
        result.customFields.isEmpty()
    }

    def 'should return enrolment data interaction'() {
        given:
        paymentMock.interfaceInteractions >> [enrolmentDataMock]

        when:
        def result = testObj.enrolmentData

        then:
        result.customFields.get() == enrolmentDataMock
    }

    def 'should return authentication transaction id'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.PAYER_AUTH_AUTHENTICATION_TRANSACTION_ID) >> 'tx id'

        when:
        def result = testObj.payerAuthenticationTransactionId

        then:
        result == 'tx id'
    }

    def 'should return null authentication transaction id when no custom fields'() {
        given:
        paymentMock.custom >> null
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.PAYER_AUTH_AUTHENTICATION_TRANSACTION_ID) >> 'tx id'

        when:
        def result = testObj.payerAuthenticationTransactionId

        then:
        result == null
    }

    def 'should return payer auth authentication required flag'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsBoolean(PaymentCustomFieldConstants.PAYER_AUTH_AUTHENTICATION_REQUIRED) >> true

        when:
        def result = testObj.isPayerAuthenticationRequired()

        then:
        result == true
    }

    def 'should return null authentication required flag when no custom fields'() {
        given:
        paymentMock.custom >> null
        customFieldsMock.getFieldAsBoolean(PaymentCustomFieldConstants.PAYER_AUTH_AUTHENTICATION_REQUIRED) >> true

        when:
        def result = testObj.isPayerAuthenticationRequired()

        then:
        result == null
    }

    def 'should return payment id'() {
        given:
        paymentMock.id >> 'payment id'

        when:
        def result = testObj.id

        then:
        result == 'payment id'
    }

    def 'should return payment method'() {
        given:
        paymentMock.paymentMethodInfo >> paymentMethodInfoMock
        paymentMethodInfoMock.method >> 'payment method'

        when:
        def result = testObj.paymentMethod

        then:
        result == 'payment method'
    }

    def 'should return user agent header'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.PAYER_AUTH_USER_AGENT_HEADER) >> 'user agent header value'

        when:
        def result = testObj.payerAuthenticationUserAgentHeader

        then:
        result == 'user agent header value'
    }

    def 'should return accept header'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.PAYER_AUTH_ACCEPT_HEADER) >> 'accept header value'

        when:
        def result = testObj.payerAuthenticationAcceptHeader

        then:
        result == 'accept header value'
    }

    def 'should return request jwt'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.PAYER_AUTH_REQUEST_JWT) >> 'request jwt'

        when:
        def result = testObj.payerAuthenticationRequestJwt

        then:
        result == 'request jwt'
    }

    def 'should return response jwt'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.PAYER_AUTH_RESPONSE_JWT) >> 'response jwt'

        when:
        def result = testObj.payerAuthenticationResponseJwt

        then:
        result == 'response jwt'
    }

    def 'should return acs url'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.PAYER_AUTH_ACS_URL) >> 'acs url'

        when:
        def result = testObj.payerAuthenticationAcsUrl

        then:
        result == 'acs url'
    }

    def 'should return payer auth payload'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.PAYER_AUTH_PA_REQ) >> 'pa req'

        when:
        def result = testObj.payerAuthenticationPaReq

        then:
        result == 'pa req'
    }

    def 'should return device fingerprint id'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.DEVICE_FINGERPRINT_ID) >> 'fingerprint id'

        when:
        def result = testObj.deviceFingerprintId

        then:
        result == 'fingerprint id'
    }

    def 'should return customer ip address'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.CUSTOMER_IP_ADDRESS) >> 'ip address'

        when:
        def result = testObj.customerIpAddress

        then:
        result == 'ip address'
    }

    def 'should return masked card number'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.MASKED_CARD_NUMBER) >> 'card number'

        when:
        def result = testObj.maskedCardNumber

        then:
        result == 'card number'
    }

    def 'should return card expiry month'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.CARD_EXPIRY_MONTH) >> 'card expiry month'

        when:
        def result = testObj.cardExpiryMonth

        then:
        result == 'card expiry month'
    }

    def 'should return card expiry year'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.CARD_EXPIRY_YEAR) >> 'card expiry year'

        when:
        def result = testObj.cardExpiryYear

        then:
        result == 'card expiry year'
    }

    def 'should return card type'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.CARD_TYPE) >> 'card type'

        when:
        def result = testObj.cardType

        then:
        result == 'card type'
    }

    def 'should return token'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.TOKEN) >> 'token'

        when:
        def result = testObj.token

        then:
        result == 'token'
    }

    def 'should return token alias'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.TOKEN_ALIAS) >> 'token alias'

        when:
        def result = testObj.tokenAlias

        then:
        result == 'token alias'
    }

    def 'should return saved token'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.SAVED_TOKEN) >> 'saved token'

        when:
        def result = testObj.savedToken

        then:
        result == 'saved token'
    }

    def 'should return token verification context'() {
        given:
        paymentMock.custom >> customFieldsMock
        customFieldsMock.getFieldAsString(PaymentCustomFieldConstants.TOKEN_VERIFICATION_CONTEXT) >> 'token verification context'

        when:
        def result = testObj.tokenVerificationContext

        then:
        result == 'token verification context'
    }

}
