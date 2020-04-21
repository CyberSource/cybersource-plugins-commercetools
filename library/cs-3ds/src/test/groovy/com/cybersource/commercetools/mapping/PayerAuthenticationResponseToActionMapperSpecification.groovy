package com.cybersource.commercetools.mapping

import com.cybersource.commercetools.model.PayerAuthenticationResponse
import spock.lang.Specification

class PayerAuthenticationResponseToActionMapperSpecification extends Specification {

    PayerAuthenticationResponseToActionMapper testObj

    PayerAuthenticationResponse responseMock = Mock()

    def setup() {
        testObj = new PayerAuthenticationResponseToActionMapper()
    }

    def 'should map response for enrolled card'() {
        given:
        responseMock.requestReferenceId >> 'request reference id'
        responseMock.authenticationTransactionId >> 'authentication transaction id'
        responseMock.authenticationRequired >> true
        responseMock.authorizationAllowed >> true
        responseMock.paReq >> 'pa req payload'
        responseMock.acsUrl >> 'acs url'
        responseMock.proofXml >> 'proof xml'
        responseMock.veresEnrolled >> 'enrolled result'
        responseMock.specificationVersion >> 'spec version'
        responseMock.xid >> 'xid value'

        when:
        def result = testObj.mapResponseToActions(responseMock)

        then:
        result.size() == 5
        result[0].type.key == 'cybersource_payer_authentication_enrolment_check'
        result[0].fields.size() == 8
        result[0].fields.authenticationTransactionId.textValue() == 'authentication transaction id'
        result[0].fields.cardinalReferenceId.textValue() == 'request reference id'
        result[0].fields.authenticationRequired.booleanValue() == true
        result[0].fields.authorizationAllowed.booleanValue() == true
        result[0].fields.proofXml.textValue() == 'proof xml'
        result[0].fields.veresEnrolled.textValue() == 'enrolled result'
        result[0].fields.specificationVersion.textValue() == 'spec version'
        result[0].fields.xid.textValue() == 'xid value'
        result[1].name == 'cs_payerAuthenticationRequired'
        result[1].value.booleanValue() == true
        result[2].name == 'cs_payerAuthenticationTransactionId'
        result[2].value.textValue() == 'authentication transaction id'
        result[3].name == 'cs_payerAuthenticationAcsUrl'
        result[3].value.textValue() == 'acs url'
        result[4].name == 'cs_payerAuthenticationPaReq'
        result[4].value.textValue() == 'pa req payload'
    }

    def 'should transform response for non-enrolled card'() {
        given:
        responseMock.requestReferenceId >> 'request reference id'
        responseMock.authenticationTransactionId >> 'authentication transaction id'
        responseMock.commerceIndicator >> 'commerce indicator'
        responseMock.eci >> 'eci value'
        responseMock.proofXml >> 'proof xml'
        responseMock.specificationVersion >> 'spec version'
        responseMock.veresEnrolled >> 'enrolled result'
        responseMock.authenticationRequired >> false
        responseMock.authorizationAllowed >> true

        when:
        def result = testObj.mapResponseToActions(responseMock)

        then:
        result.size() == 3
        result[0].type.key == 'cybersource_payer_authentication_enrolment_check'
        result[0].fields.size() == 9
        result[0].fields.authenticationTransactionId.textValue() == 'authentication transaction id'
        result[0].fields.cardinalReferenceId.textValue() == 'request reference id'
        result[0].fields.authenticationRequired.booleanValue() == false
        result[0].fields.authorizationAllowed.booleanValue() == true
        result[0].fields.eci.textValue() == 'eci value'
        result[0].fields.proofXml.textValue() == 'proof xml'
        result[0].fields.specificationVersion.textValue() == 'spec version'
        result[0].fields.veresEnrolled.textValue() == 'enrolled result'
        result[0].fields.commerceIndicator.textValue() == 'commerce indicator'
        result[1].name == 'cs_payerAuthenticationRequired'
        result[1].value.booleanValue() == false
        result[2].name == 'cs_payerAuthenticationTransactionId'
        result[2].value.textValue() == 'authentication transaction id'
    }

    def 'should transform response for rejected frictionless card'() {
        given:
        responseMock.requestReferenceId >> 'request reference id'
        responseMock.authenticationTransactionId >> 'authentication transaction id'
        responseMock.commerceIndicator >> 'commerce indicator'
        responseMock.eci >> 'eci value'
        responseMock.proofXml >> 'proof xml'
        responseMock.specificationVersion >> 'spec version'
        responseMock.veresEnrolled >> 'enrolled result'
        responseMock.authenticationRequired >> false
        responseMock.authorizationAllowed >> false

        when:
        def result = testObj.mapResponseToActions(responseMock)

        then:
        result.size() == 3
        result[0].type.key == 'cybersource_payer_authentication_enrolment_check'
        result[0].fields.size() == 9
        result[0].fields.authenticationTransactionId.textValue() == 'authentication transaction id'
        result[0].fields.cardinalReferenceId.textValue() == 'request reference id'
        result[0].fields.authenticationRequired.booleanValue() == false
        result[0].fields.authorizationAllowed.booleanValue() == false
        result[0].fields.eci.textValue() == 'eci value'
        result[0].fields.proofXml.textValue() == 'proof xml'
        result[0].fields.specificationVersion.textValue() == 'spec version'
        result[0].fields.veresEnrolled.textValue() == 'enrolled result'
        result[0].fields.commerceIndicator.textValue() == 'commerce indicator'
        result[1].name == 'cs_payerAuthenticationRequired'
        result[1].value.booleanValue() == false
        result[2].name == 'cs_payerAuthenticationTransactionId'
        result[2].value.textValue() == 'authentication transaction id'
    }

}
