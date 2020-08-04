package isv.commercetools.reference.application.controller.response

import io.sphere.sdk.commands.UpdateAction
import isv.commercetools.api.extension.model.ExtensionError
import isv.commercetools.api.extension.model.ExtensionOutput
import org.springframework.http.HttpStatus
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

class ResponseBuilderSpecification extends Specification {

    ResponseBuilder testObj = new ResponseBuilder()

    @Shared
    ExtensionError errorMock1 = Mock()

    @Shared
    ExtensionError errorMock2 = Mock()

    @Shared
    UpdateAction actionMock1 = Mock()

    @Shared
    UpdateAction actionMock2 = Mock()

    @Unroll
    def 'should build failure response with statusCode #statusCode when #desc'() {
        when:
        def result = testObj.buildFailureResponse(actions)

        then:
        result.statusCode == statusCode
        result.body?.errors == errorsOut
        result.body?.actions == actionsOut

        where:
        desc              | actions                  | statusCode                       | errorsOut                | actionsOut
        'errors exist'    | [errorMock1, errorMock2] | HttpStatus.BAD_REQUEST           | [errorMock1, errorMock2] | []
        'errors is empty' | []                       | HttpStatus.BAD_REQUEST           | []                       | []
        'errors is null'  | null                     | HttpStatus.INTERNAL_SERVER_ERROR | null                     | null
    }

    @Unroll
    def 'should build success response with statusCode #statusCode when #desc'() {
        when:
        def result = testObj.buildSuccessResponse(actions)

        then:
        result.statusCode == statusCode
        result.body?.errors == errorsOut
        result.body?.actions == actionsOut

        where:
        desc                | actions                    | statusCode                       | errorsOut | actionsOut
        'actions exist'     | [actionMock1, actionMock2] | HttpStatus.OK                    | []        | [actionMock1, actionMock2]
        'actions are empty' | []                         | HttpStatus.OK                    | []        | []
        'actions are null'  | null                       | HttpStatus.INTERNAL_SERVER_ERROR | null      | null
    }

    def 'should build success response wrapping existing ExtensionOutput'() {
        when:
        def output = Mock(ExtensionOutput)
        def result = testObj.buildSuccessResponse(output)

        then:
        result.statusCode == HttpStatus.OK
        result.body == output
    }

    def 'should build failure response wrapping existing ExtensionOutput'() {
        when:
        def output = Mock(ExtensionOutput)
        def result = testObj.buildFailureResponse(output)

        then:
        result.statusCode == HttpStatus.BAD_REQUEST
        result.body == output
    }
}
