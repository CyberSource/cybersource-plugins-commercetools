package com.cybersource.commercetools.mapping.transformer.payerauth

import spock.lang.Specification

class PayerAuthValidateResponseTransformerSpecification extends Specification {

    def testObj

    def 'should result in empty list when payer auth validate data missing'() {
        given:
        testObj = new PayerAuthValidateResponseTransformer('prefix_', true)
        def cybersourceResponse = [:]

        when:
        def result = testObj.transform(cybersourceResponse)

        then:
        result.isEmpty()
    }

    def 'should not populate fields with missing values'() {
        given:
        testObj = new PayerAuthValidateResponseTransformer('prefix_', true)
        def cybersourceResponse = ['prefix_authenticationResult':'auth result']

        when:
        def result = testObj.transform(cybersourceResponse)

        then:
        result.size() == 1
        result[0].type.key == 'cybersource_payer_authentication_validate_result'
        result[0].fields.size() == 1
        result[0].fields.authenticationResult.textValue() == 'auth result'
    }

    def 'should populate all fields'() {
        given:
        testObj = new PayerAuthValidateResponseTransformer('prefix_', true)
        def cybersourceResponse = [
            'prefix_authenticationResult':'auth result',
            'prefix_authenticationStatusMessage':'status message',
            'prefix_directoryServerTransactionID':'dir tx id',
            'prefix_cavv':'cavv value',
            'prefix_cavvAlgorithm':'cavv algorithm',
            'prefix_ucafAuthenticationData':'aav value',
            'prefix_ucafCollectionIndicator':'aav indicator',
            'prefix_xid':'tx id',
            'prefix_specificationVersion':'spec version',
            'prefix_eci':'eci value',
            'prefix_eciRaw':'eci raw',
            'prefix_paresStatus':'pares status',
            'prefix_commerceIndicator':'commerce indicator',
        ]

        when:
        def result = testObj.transform(cybersourceResponse)

        then:
        result.size() == 1
        result[0].type.key == 'cybersource_payer_authentication_validate_result'
        result[0].fields.size() == 13
        result[0].fields.authenticationResult.textValue() == 'auth result'
        result[0].fields.authenticationStatusMessage.textValue() == 'status message'
        result[0].fields.directoryServerTransactionId.textValue() == 'dir tx id'
        result[0].fields.cavv.textValue() == 'cavv value'
        result[0].fields.cavvAlgorithm.textValue() == 'cavv algorithm'
        result[0].fields.ucafAuthenticationData.textValue() == 'aav value'
        result[0].fields.ucafCollectionIndicator.textValue() == 'aav indicator'
        result[0].fields.xid.textValue() == 'tx id'
        result[0].fields.specificationVersion.textValue() == 'spec version'
        result[0].fields.eci.textValue() == 'eci value'
        result[0].fields.eciRaw.textValue() == 'eci raw'
        result[0].fields.paresStatus.textValue() == 'pares status'
        result[0].fields.commerceIndicator.textValue() == 'commerce indicator'
    }

    def 'should populate fields when auth result present'() {
        given:
        testObj = new PayerAuthValidateResponseTransformer('prefix_', false)
        def cybersourceResponse = ['prefix_authenticationResult':'auth result']

        when:
        def result = testObj.transform(cybersourceResponse)

        then:
        result.size() == 1
        result[0].type.key == 'cybersource_payer_authentication_validate_result'
        result[0].fields.size() == 1
        result[0].fields.authenticationResult.textValue() == 'auth result'
    }

    def 'should not populate fields when auth result absent'() {
        given:
        testObj = new PayerAuthValidateResponseTransformer('prefix_', false)
        def cybersourceResponse = ['prefix_eci':'eci value']

        when:
        def result = testObj.transform(cybersourceResponse)

        then:
        result.isEmpty()
    }

}
