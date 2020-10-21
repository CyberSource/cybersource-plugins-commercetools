package isv.commercetools.mapping.transformer.payerauth

import com.neovisionaries.i18n.CountryCode
import io.sphere.sdk.carts.Cart
import io.sphere.sdk.models.Address
import io.sphere.sdk.models.Reference
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.PaymentMethodInfo
import io.sphere.sdk.types.CustomFields
import io.sphere.sdk.types.Type
import io.sphere.sdk.utils.MoneyImpl
import isv.commercetools.mapping.constants.EnrolmentCheckDataConstants
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentServiceIds
import isv.commercetools.mapping.model.PaymentDetails
import isv.commercetools.mapping.transformer.fieldgroup.*
import isv.commercetools.mapping.types.TypeCache
import isv.payments.model.fields.PayerAuthValidateServiceFieldGroup
import spock.lang.Specification

class AuthorizationWithPayerAuthRequestTransformerSpecification extends Specification {

    AuthorizationWithPayerAuthRequestTransformer testObj

    Payment ctPaymentMock = Mock()
    Cart cartMock = Mock()
    Type typeMock = Mock()
    CustomFields enrolmentDataMock = Mock()
    CustomFields customFieldsMock = Mock()
    Reference<Type> enrolmentDataTypeReferenceMock = Mock()
    PaymentMethodInfo paymentMethodInfoMock = Mock()

    Address shippingAddress = Address.of(CountryCode.GB)
    Address billingAddress = Address.of(CountryCode.GB)

    def setup() {
        def paymentServiceIds = new PaymentServiceIds()
        paymentServiceIds.merchantId = 'someMerchantId'
        testObj = new AuthorizationWithPayerAuthRequestTransformer(paymentServiceIds)

        enrolmentDataMock.type >> enrolmentDataTypeReferenceMock
        enrolmentDataTypeReferenceMock.id >> 'enrolmentTypeId'
        typeMock.id >> 'enrolmentTypeId'
        typeMock.key >> EnrolmentCheckDataConstants.TYPE_KEY
        TypeCache.populate([typeMock])

        ctPaymentMock.paymentMethodInfo >> paymentMethodInfoMock
        paymentMethodInfoMock.method >> 'creditCard'
        ctPaymentMock.amountPlanned >> MoneyImpl.of(BigDecimal.valueOf(10.05d), 'GBP')
        ctPaymentMock.custom >> customFieldsMock
        customFieldsMock.fieldsJsonMap >> [:]

        cartMock.lineItems >> []
        cartMock.shippingAddress >> shippingAddress
        cartMock.billingAddress >> billingAddress
    }

    def 'should configure base field group transformers'() {
        when:
        def paymentServiceIds = new PaymentServiceIds()
        testObj = new AuthorizationWithPayerAuthRequestTransformer(paymentServiceIds)

        then:
        testObj.fieldGroupTransformers.size() == 12
        testObj.fieldGroupTransformers[0] instanceof BaseFieldGroupTransformer
        testObj.fieldGroupTransformers[0].paymentServiceIds == paymentServiceIds
        testObj.fieldGroupTransformers[1] instanceof AuthServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[2] instanceof BillToFieldGroupTransformer
        testObj.fieldGroupTransformers[3] instanceof ShipToFieldGroupTransformer
        testObj.fieldGroupTransformers[4] instanceof PurchaseTotalsFieldGroupTransformer
        testObj.fieldGroupTransformers[5] instanceof TokenSourceFieldGroupTransformer
        testObj.fieldGroupTransformers[6] instanceof LineItemFieldGroupTransformer
        testObj.fieldGroupTransformers[7] instanceof MerchantDefinedDataFieldGroupTransformer
        testObj.fieldGroupTransformers[8] instanceof DecisionManagerFieldGroupTransformer
        testObj.fieldGroupTransformers[9] instanceof SubscriptionCreateServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[10] instanceof SubscriptionUpdateServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[11] instanceof RecurringSubscriptionInfoFieldGroupTransformer
    }

    def 'should populate payer auth field group for card that requires authentication'() {
        given: 'we have a payment'
        ctPaymentMock.interfaceInteractions >> [enrolmentDataMock]
        ctPaymentMock.transactions >> []
        enrolmentDataMock.getFieldAsBoolean(EnrolmentCheckDataConstants.AUTHENTICATION_REQUIRED) >> true
        enrolmentDataMock.getFieldAsString(EnrolmentCheckDataConstants.AUTHENTICATION_TRANSACTION_ID) >> 'authentication transaction id'

        def customPayment = new CustomPayment(ctPaymentMock)
        def paymentDetails = new PaymentDetails(customPayment, cartMock)

        when: 'we transform it'
        def result = testObj.transform(paymentDetails)

        then: 'it has the correct payer authentication values'
        def payerAuthValidateFieldGroup = result.fieldGroups.find {
            it instanceof PayerAuthValidateServiceFieldGroup
        } as PayerAuthValidateServiceFieldGroup
        payerAuthValidateFieldGroup != null
    }

    def 'should not populate payer auth field group for card that does not require authentication'() {
        given: 'we have a payment'
        ctPaymentMock.interfaceInteractions >> [enrolmentDataMock]
        ctPaymentMock.transactions >> []
        enrolmentDataMock.getFieldAsBoolean(EnrolmentCheckDataConstants.AUTHENTICATION_REQUIRED) >> false

        def customPayment = new CustomPayment(ctPaymentMock)
        def paymentDetails = new PaymentDetails(customPayment, cartMock)

        when: 'we transform it'
        def result = testObj.transform(paymentDetails)

        then: 'it has no payer authentication values'
        def payerAuthValidateFieldGroup = result.fieldGroups.find {
            it instanceof PayerAuthValidateServiceFieldGroup
        } as PayerAuthValidateServiceFieldGroup
        payerAuthValidateFieldGroup == null
    }

}
