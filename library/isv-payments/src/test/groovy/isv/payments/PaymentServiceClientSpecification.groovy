package isv.payments

import com.cybersource.ws.client.ClientException
import com.cybersource.ws.client.FaultException
import isv.payments.exception.PaymentException
import isv.payments.model.PaymentServiceRequest
import isv.payments.transformer.RequestToMapTransformer
import spock.lang.Specification
import spock.lang.Unroll

class PaymentServiceClientSpecification extends Specification {

    def propsMock = Mock(Properties)
    def delegateMock = Mock(PaymentServiceClient.PaymentServiceClientDelegate)
    def transformerMock = Mock(RequestToMapTransformer)
    def testObj = new PaymentServiceClient(propsMock, delegateMock, transformerMock)

    def 'Should make an object-based request to payment service and return the map'() {
        given:
        def paymentServiceRequest = Mock(PaymentServiceRequest)
        def resultMap = [someResult:'someValue']

        transformerMock.transform(paymentServiceRequest) >> [someTransformedMap:'someValue']

        when:
        def result = testObj.makeRequest(paymentServiceRequest)
        then:
        1 * delegateMock.runTransaction(_, _) >> resultMap

        and:
        result == resultMap
    }

    def 'Should make a map-based request to payment service and return the map'() {
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
        def paymentServiceRequest = Mock(PaymentServiceRequest)
        transformerMock.transform(paymentServiceRequest) >> [someTransformedMap:'someValue']

        when:
        testObj.makeRequest(paymentServiceRequest)
        then:
        1 * delegateMock.runTransaction(_, _) >> { throw exception }
        and:
        thrown(PaymentException)

        where:
        exception << [Mock(FaultException), Mock(ClientException)]
    }
}
