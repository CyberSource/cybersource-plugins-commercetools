package isv.payments.transformer

import isv.payments.model.PaymentServiceRequest
import isv.payments.model.fields.*
import spock.lang.Specification

class RequestToMapTransformerSpecification extends Specification {

    private RequestToMapTransformer testObj = new RequestToMapTransformer()

    def 'should transform field groups into a map with correct prefixes and including extra fields'() {
        given:
        AuthServiceFieldGroup authFields = new AuthServiceFieldGroup()
        authFields.run = true
        authFields.extraFields.put('someOtherField', 'yes')

        BillToFieldGroup billToFields = new BillToFieldGroup()
        billToFields.city = 'brisbane'

        def captureServiceFields = new CaptureServiceFieldGroup()
        captureServiceFields.run = false

        def request = new PaymentServiceRequest([authFields, billToFields, captureServiceFields])

        when:
        def result = testObj.transform(request)

        then:
        result.size() == 4
        result['ccAuthService_run'] == 'true'
        result['ccAuthService_someOtherField'] == 'yes'
        result['ccCaptureService_run'] == 'false'
        result['billTo_city'] == 'brisbane'
    }

    def 'should skip null or empty fields'() {
        given:
        BaseFieldGroup baseFieldGroup = new BaseFieldGroup()
        baseFieldGroup.developerID = ''
        baseFieldGroup.partnerSolutionID = null
        baseFieldGroup.merchantID = 'some merchant id'

        def request = new PaymentServiceRequest([baseFieldGroup])

        when:
        def result = testObj.transform(request)

        then:
        result.size() == 1
        result['merchantID'] == 'some merchant id'
    }

    def 'Should skip over any inaccessible fields without errors'() {
        given:
        AuthServiceFieldGroup authFields = new AuthServiceFieldGroup()
        authFields.run = true

        def request = new PaymentServiceRequest([authFields, new BadFieldGroup()])

        when:
        def result = testObj.transform(request)

        then:
        result.size() == 1
        result['ccAuthService_run'] == 'true'
    }

    def 'Should correctly transform non-string values to string values'() {
        given:
        def request = new PaymentServiceRequest([new NotStringGroup()])

        when:
        def result = testObj.transform(request)

        then:
        result.size() == 3
        result['nonString_bigDecimal'] == '10.05'
        result['nonString_bool'] == 'true'
        result['nonString_number'] == '123'
    }

    @SuppressWarnings(['UnusedPrivateField', 'GetterMethodCouldBeProperty'])
    class BadFieldGroup extends AbstractFieldGroup {

        private String privateField = 'someValue'

        @Override
        String getFieldGroupPrefix() {
            'bad_'
        }
    }

    @SuppressWarnings(['UnusedPrivateField', 'GetterMethodCouldBeProperty'])
    class NotStringGroup extends AbstractFieldGroup {

        private BigDecimal bigDecimal = BigDecimal.valueOf(10.05d)
        private boolean bool = true
        private int number = 123

        @Override
        String getFieldGroupPrefix() {
            'nonString_'
        }

        BigDecimal getBigDecimal() {
            bigDecimal
        }

        boolean getBool() {
            bool
        }

        int getNumber() {
            number
        }
    }
}
