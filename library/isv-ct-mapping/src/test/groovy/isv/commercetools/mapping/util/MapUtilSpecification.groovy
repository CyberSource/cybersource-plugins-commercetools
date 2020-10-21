package isv.commercetools.mapping.util

import spock.lang.Specification

class MapUtilSpecification extends Specification {

    def 'should add non-null value to map'() {
        given:
        def map = [:]

        when:
        MapUtil.putIfNotNull(map, 'key', 'value')

        then:
        map.key == 'value'
    }

    def 'should not add null value to map'() {
        given:
        def map = [:]

        when:
        MapUtil.putIfNotNull(map, 'key', null)

        then:
        map.containsKey('key') == false
    }

}
