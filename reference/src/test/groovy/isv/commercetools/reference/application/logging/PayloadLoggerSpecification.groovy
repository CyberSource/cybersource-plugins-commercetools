package isv.commercetools.reference.application.logging

import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.Logger
import spock.lang.Specification

class PayloadLoggerSpecification extends Specification {

    PayloadLogger testObj
    Logger logger
    ObjectMapper objectMapperMock = Mock()

    def setup() {
        logger = Mock(Logger)
        testObj = new PayloadLogger(objectMapperMock, logger)
    }

    def "should log payload"() {
        given:
        objectMapperMock.writeValueAsString('payload') >> 'json payload'

        when:
        testObj.log('message', 'payload')

        then:
        1 * logger.debug('message:\njson payload')
    }

    def "should log error when payload cannot be converted to JSON"() {
        given:
        def expectedException = new JsonProcessingException('test')
        objectMapperMock.writeValueAsString('payload') >> { throw expectedException }

        when:
        testObj.log('message', 'payload')

        then:
        1 * logger.error('Could not convert input to JSON for logging', expectedException)
    }

}
