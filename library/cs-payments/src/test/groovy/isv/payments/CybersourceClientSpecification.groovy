package isv.payments

import com.cybersource.ws.client.ClientException
import com.cybersource.ws.client.FaultException
import isv.payments.exception.PaymentException
import isv.payments.model.CybersourceRequest
import isv.payments.transformer.RequestToMapTransformer
import spock.lang.Specification
import spock.lang.Unroll

class CybersourceClientSpecification extends Specification {

    def propsMock = Mock(Properties)
    def delegateMock = Mock(CybersourceClient.CybersourceClientDelegate)
    def transformerMock = Mock(RequestToMapTransformer)
    def testObj = new CybersourceClient(propsMock, delegateMock, transformerMock)

    def 'Should make a map-based request to Cybersource and return the map'() {
        given:
        def cybersourceReq = Mock(CybersourceRequest)
        def resultMap = [someResult:'someValue']

        transformerMock.transform(cybersourceReq) >> [someTransformedMap:'someValue']

        when:
        def result = testObj.makeRequest(cybersourceReq)
        then:
        1 * delegateMock.runTransaction(_, _) >> resultMap

        and:
        result == resultMap
    }

    def 'Should make an object-based request to Cybersource and return the map'() {
        given:
        def resultMap = [someResult:'someValue']

        when:
        def result = testObj.makeRequest([someProvidedMap:'someValue'])

        then:
        1 * delegateMock.runTransaction(_, _) >> resultMap

        and:
        result == resultMap
    }

    @Unroll
    def 'Should throw a PaymentException if something goes wrong'() {
        given:
        def cybersourceReq = Mock(CybersourceRequest)
        transformerMock.transform(cybersourceReq) >> [someTransformedMap:'someValue']

        when:
        testObj.makeRequest(cybersourceReq)
        then:
        1 * delegateMock.runTransaction(_, _) >> { throw exception }
        and:
        thrown(PaymentException)

        where:
        exception << [Mock(FaultException), Mock(ClientException)]
    }
}
