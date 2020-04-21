package com.cybersource.commercetools.mapping

import com.cybersource.cardinal.service.CardinalService
import com.cybersource.commercetools.mapping.model.CustomPayment
import com.cybersource.commercetools.mapping.transformer.payerauth.PayerAuthValidateResponseTransformer
import com.cybersource.payments.exception.PaymentException
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.SignatureException
import io.sphere.sdk.commands.UpdateAction
import spock.lang.Specification
import spock.lang.Unroll

class PayerAuthEnrolmentCheckResponseTransformerSpecification extends Specification {

    PayerAuthEnrolmentCheckResponseTransformer testObj

    CardinalService cardinalServiceMock = Mock()
    PayerAuthenticationResponseToActionMapper responseToActionMapperMock = Mock()
    PayerAuthValidateResponseTransformer payerAuthValidateResponseTransformerMock = Mock()

    CustomPayment paymentMock = Mock()
    UpdateAction enrolmentCheckActionMock = Mock()
    UpdateAction validateActionMock = Mock()

    def setup() {
        testObj = new PayerAuthEnrolmentCheckResponseTransformer(cardinalServiceMock, responseToActionMapperMock, payerAuthValidateResponseTransformerMock)

        paymentMock.payerAuthenticationRequestJwt >> 'request jwt'
    }

    def 'should transform response for card that requires authentication'() {
        given:
        def extractedResponse
        1 * cardinalServiceMock.validateJWTAndExtractReferenceId('request jwt') >> 'request reference id'
        1 * responseToActionMapperMock.mapResponseToActions(_) >> { args ->
            extractedResponse = args[0]
            [enrolmentCheckActionMock]
        }
        1 * payerAuthValidateResponseTransformerMock.transform(_) >> [validateActionMock]

        when:
        testObj.transform([
                'reasonCode':'475',
                'payerAuthEnrollReply_acsURL':'acs url',
                'payerAuthEnrollReply_paReq':'pa req payload',
                'payerAuthEnrollReply_authenticationTransactionID':'authentication transaction id',
                'payerAuthEnrollReply_proofXML':'proof xml',
                'payerAuthEnrollReply_xid':'xid value',
                'payerAuthEnrollReply_specificationVersion':'spec version',
                'payerAuthEnrollReply_veresEnrolled':'veres enrolled value',
                'payerAuthEnrollReply_commerceIndicator':'commerce indicator',
                'payerAuthEnrollReply_eci':'eci value',
        ], paymentMock)

        then:
        extractedResponse.authenticationRequired == true
        extractedResponse.authorizationAllowed == true
        extractedResponse.requestReferenceId == 'request reference id'
        extractedResponse.acsUrl == 'acs url'
        extractedResponse.paReq == 'pa req payload'
        extractedResponse.authenticationTransactionId == 'authentication transaction id'
        extractedResponse.proofXml == 'proof xml'
        extractedResponse.xid == 'xid value'
        extractedResponse.specificationVersion == 'spec version'
        extractedResponse.veresEnrolled == 'veres enrolled value'
        extractedResponse.commerceIndicator == 'commerce indicator'
        extractedResponse.eci == 'eci value'
    }

    def 'should transform response for card that does not require authentication'() {
        given:
        def extractedResponse
        1 * cardinalServiceMock.validateJWTAndExtractReferenceId('request jwt') >> 'request reference id'
        1 * responseToActionMapperMock.mapResponseToActions(_) >> { args ->
            extractedResponse = args[0]
            [enrolmentCheckActionMock]
        }
        1 * payerAuthValidateResponseTransformerMock.transform(_) >> [validateActionMock]

        when:
        testObj.transform([
                'reasonCode':'100',
                'payerAuthEnrollReply_authenticationTransactionID':'authentication transaction id',
                'payerAuthEnrollReply_proofXML':'proof xml',
                'payerAuthEnrollReply_xid':'xid value',
                'payerAuthEnrollReply_specificationVersion':'spec version',
                'payerAuthEnrollReply_veresEnrolled':'veres enrolled value',
                'payerAuthEnrollReply_commerceIndicator':'commerce indicator',
                'payerAuthEnrollReply_eci':'eci value',
        ], paymentMock)

        then:
        extractedResponse.authenticationRequired == false
        extractedResponse.authorizationAllowed == true
        extractedResponse.requestReferenceId == 'request reference id'
        extractedResponse.acsUrl == null
        extractedResponse.paReq == null
        extractedResponse.authenticationTransactionId == 'authentication transaction id'
        extractedResponse.proofXml == 'proof xml'
        extractedResponse.xid == 'xid value'
        extractedResponse.specificationVersion == 'spec version'
        extractedResponse.veresEnrolled == 'veres enrolled value'
        extractedResponse.commerceIndicator == 'commerce indicator'
        extractedResponse.eci == 'eci value'
    }

    def 'should transform response for unknown reason code'() {
        given:
        def extractedResponse
        1 * responseToActionMapperMock.mapResponseToActions(_) >> { args ->
            extractedResponse = args[0]
            [enrolmentCheckActionMock]
        }
        1 * payerAuthValidateResponseTransformerMock.transform(_) >> [validateActionMock]

        when:
        testObj.transform([
                'reasonCode':'476',
                'payerAuthEnrollReply_authenticationTransactionID':'authentication transaction id',
        ], paymentMock)

        then:
        extractedResponse.authenticationRequired == false
        extractedResponse.authorizationAllowed == false
    }

    @Unroll
    def 'should throw exception when JWT parsing fails'() {
        given:
        1 * cardinalServiceMock.validateJWTAndExtractReferenceId('request jwt') >> { throw expectedException }

        when:
        testObj.transform([
                'reasonCode':'100',
                'payerAuthEnrollReply_authenticationTransactionID':'authentication transaction id',
        ], paymentMock)

        then:
        def exception = thrown(PaymentException)
        exception.message == message

        where:
        expectedException                              | message
        new ExpiredJwtException(null, null, 'expired') | 'io.jsonwebtoken.ExpiredJwtException: expired'
        new MalformedJwtException('malformed')         | 'io.jsonwebtoken.MalformedJwtException: malformed'
        new SignatureException('signature')            | 'io.jsonwebtoken.SignatureException: signature'
        new IllegalArgumentException('illegal')        | 'java.lang.IllegalArgumentException: illegal'
    }

}
