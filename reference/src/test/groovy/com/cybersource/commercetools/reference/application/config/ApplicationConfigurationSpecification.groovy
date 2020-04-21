package com.cybersource.commercetools.reference.application.config

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.MapperFeature
import com.fasterxml.jackson.databind.SerializationFeature
import spock.lang.Specification

class ApplicationConfigurationSpecification extends Specification {

    def testObj

    def setup() {
        testObj = new ApplicationConfiguration()
    }

    def "should configure object mapper with commercetools customisations"() {
        when:
        def objectMapper = testObj.objectMapper()

        then:
        objectMapper.registeredModuleIds.contains('io.sphere.sdk.json.LocaleModule')
        objectMapper.registeredModuleIds.contains('com.fasterxml.jackson.module.paramnames.ParameterNamesModule')
        objectMapper.registeredModuleIds.contains('com.fasterxml.jackson.datatype.jsr310.JavaTimeModule')
        objectMapper.registeredModuleIds.contains('io.sphere.sdk.json.DateTimeDeserializationModule')
        objectMapper.registeredModuleIds.contains('io.sphere.sdk.json.DateTimeSerializationModule')
        objectMapper.registeredModuleIds.contains('io.sphere.sdk.json.JavaMoneyModule')
        objectMapper.registeredModuleIds.contains('io.sphere.sdk.json.SphereEnumModule')
        ! objectMapper.isEnabled(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
        ! objectMapper.isEnabled(SerializationFeature.FAIL_ON_EMPTY_BEANS)
        ! objectMapper.isEnabled(MapperFeature.USE_GETTERS_AS_SETTERS)
    }

}
