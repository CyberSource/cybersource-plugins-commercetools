package com.cybersource.commercetools.api.extension.model

import io.sphere.sdk.commands.UpdateAction
import spock.lang.Specification

class ExtensionOutputSpecification extends Specification {

    ExtensionOutput testObj

    UpdateAction actionMock1 = Mock()
    UpdateAction actionMock2 = Mock()
    ExtensionError errorMock1 = Mock()
    ExtensionError errorMock2 = Mock()

    def setup() {
        testObj = new ExtensionOutput()
    }

    def 'should set actions'() {
        when:
        def result = testObj.withActions([actionMock1, actionMock2])

        then:
        result.actions == [actionMock1, actionMock2]
    }

    def 'should set errors'() {
        when:
        def result = testObj.withErrors([errorMock1, errorMock2])

        then:
        result.errors == [errorMock1, errorMock2]
    }

    def 'should add actions'() {
        when: 'one action added'
        def result = testObj.withAction(actionMock1)

        then: 'actions contains it'
        result.actions == [actionMock1]

        when: 'another action added'
        result = testObj.withAction(actionMock2)

        then: 'actions contains both'
        result.actions == [actionMock1, actionMock2]
    }

    def 'should add errors'() {
        when: 'one error added'
        def result = testObj.withError(errorMock1)

        then: 'errors contains it'
        result.errors == [errorMock1]

        when: 'another error added'
        result = testObj.withError(errorMock2)

        then: 'errors contains both'
        result.errors == [errorMock1, errorMock2]
    }

}
