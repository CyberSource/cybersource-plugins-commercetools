package com.cybersource.commercetools.mapping.transformer.fieldgroup

import com.cybersource.commercetools.mapping.model.CybersourceIds
import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.mapping.model.CustomPayment
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.PaymentMethodInfo
import io.sphere.sdk.types.CustomFields
import spock.lang.Specification
import spock.lang.Unroll

class BaseFieldGroupTransformerSpecification extends Specification {

    BaseFieldGroupTransformer testObj

    def setup() {
        def cybersourceIds = new CybersourceIds()
        cybersourceIds.merchantId = 'someMerchantId'
        cybersourceIds.developerId = 'someDeveloperId'
        testObj = new BaseFieldGroupTransformer(cybersourceIds)
    }

    @Unroll
    def 'should transform payment to base field group'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)
        def customFieldsMock = Mock(CustomFields)
        def paymentMethodInfo = Mock(PaymentMethodInfo)
        paymentMethodInfo.method >> paymentMethod

        ctPayment.id >> 'someRefCode'
        ctPayment.custom >> customFieldsMock
        ctPayment.paymentMethodInfo >> paymentMethodInfo
        customFieldsMock.getFieldAsString('cs_deviceFingerprintId') >> 'fingerprint id'

        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct base values'
        result.size() == 1
        result[0].merchantID == 'someMerchantId'
        result[0].developerID == 'someDeveloperId'
        result[0].partnerSolutionID == '0RX6X1BO'
        result[0].merchantReferenceCode == 'someRefCode'
        result[0].deviceFingerprintID == 'fingerprint id'
        result[0].paymentSolution == paymentSolution

        where:
        paymentMethod  | paymentSolution
        'visaCheckout' | 'visacheckout'
        'anythingelse' | null
        'creditCard'   | null
    }

}
