package com.cybersource.commercetools.mapping.types

import io.sphere.sdk.types.Type
import spock.lang.Specification

class TypeCacheSpecification extends Specification {

    Type typeMock1 = Mock()
    Type typeMock2 = Mock()

    def setup() {
        typeMock1.key >> 'key 1'
        typeMock2.key >> 'key 2'
        typeMock1.id >> 'id 1'
        typeMock2.id >> 'id 2'
    }

    def 'should return correct type when populated'() {
        given:
        TypeCache.populate([typeMock1, typeMock2])

        when:
        def key1 = TypeCache.key('id 1')
        def key2 = TypeCache.key('id 2')

        then:
        key1 == 'key 1'
        key2 == 'key 2'
    }

}
