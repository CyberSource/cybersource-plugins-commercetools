package isv.commercetools.mapping.transformer.response

import io.sphere.sdk.json.SphereJsonUtils
import isv.commercetools.mapping.exception.MappingException
import isv.payments.model.fields.BaseFieldGroup
import isv.payments.model.fields.BillToFieldGroup
import spock.lang.Specification

class PaymentServiceResponseToFieldGroupTransformerSpecification extends Specification {

    PaymentServiceResponseToFieldGroupTransformer testObj

    def 'setup'() {
        testObj = new PaymentServiceResponseToFieldGroupTransformer(SphereJsonUtils.newObjectMapper())
    }

    def 'Should correctly transform a map to a field group'() {
        given:
        Map<String,Object> inputMap = [
                'billTo_country':'GB',
                'billTo_street1':'someStreet',
                'shipTo_street1':'badStreet',
                'reasonCode':'100',
        ]
        when:
        def result = testObj.transform(inputMap, 'billTo_', BillToFieldGroup)

        then:
        result instanceof BillToFieldGroup
        result.extraFields.isEmpty()

        def castedResult = (BillToFieldGroup) result
        castedResult.street1 == 'someStreet'
        castedResult.country == 'GB'
    }

    def 'should handle no prefix'() {
        given:
        Map<String,Object> inputMap = [
                'billTo_street1':'someStreet',
                'shipTo_street1':'badStreet',
                'merchantID':'someMerchant',
                'somethingElse_merchantID':'badMerchant',
        ]
        when:
        def result = testObj.transform(inputMap, '', BaseFieldGroup)

        then:
        result instanceof BaseFieldGroup
        result.extraFields.isEmpty()

        def castedResult = (BaseFieldGroup) result
        castedResult.merchantID == 'someMerchant'
    }

    def 'Should return an empty object if nothing could be mapped'() {
        given:
        Map<String,Object> inputMap = [
                'notReal_value':'test',
                'moreMadeUpStuff_value':'test',
        ]
        when:
        def result = testObj.transform(inputMap, '', BaseFieldGroup)

        then:
        result instanceof BaseFieldGroup
        result.extraFields.isEmpty()
    }

    def 'Should throw an error if class provided does not extend RequestServiceFieldGroup'() {
        when:
        testObj.transform([:], '', String)

        then:
        thrown MappingException
    }
}
