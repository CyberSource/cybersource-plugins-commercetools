package com.cybersource.commercetools.mapping.transformer.fieldgroup

import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.mapping.model.CustomPayment
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.types.CustomFields
import spock.lang.Specification

class MerchantDefinedDataFieldGroupTransformerSpecification extends Specification {

    def testObj = new MerchantDefinedDataFieldGroupTransformer()

    Payment paymentMock = Mock()
    CustomFields customFieldsMock = Mock()

    def 'should create a merchant defined data field group when merchant defined values present'() {
        given:
        customFieldsMock.fieldsJsonMap >> ['cs_merchantDefinedData_mddField_1':null, 'other_field':null, 'cs_merchantDefinedData_mddField_11':null]
        customFieldsMock.getFieldAsString('cs_merchantDefinedData_mddField_1') >> 'custom value 1'
        customFieldsMock.getFieldAsString('cs_merchantDefinedData_mddField_11') >> 'custom value 11'
        paymentMock.custom >> customFieldsMock
        def customPayment = new CustomPayment(paymentMock)
        def paymentDetails = new PaymentDetails(customPayment)

        when:
        def result = testObj.configure(paymentDetails)

        then:
        result.size() == 1
        result[0].extraFields.size() == 2
        result[0].extraFields['mddField_1'] == 'custom value 1'
        result[0].extraFields['mddField_11'] == 'custom value 11'
    }

    def 'should not create a merchant defined data field group when merchant defined values absent'() {
        given:
        customFieldsMock.fieldsJsonMap >> ['other_field':null]
        paymentMock.custom >> customFieldsMock
        def customPayment = new CustomPayment(paymentMock)
        def paymentDetails = new PaymentDetails(customPayment)

        when:
        def result = testObj.configure(paymentDetails)

        then:
        result.isEmpty()
    }

}
