package isv.commercetools.reference.application

import groovy.json.JsonSlurper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import spock.lang.Unroll

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@SuppressWarnings('DuplicateListLiteral')
class ValidationSpecification extends MockExternalServicesBaseSpecification {

    @Unroll
    def 'Controller - Create (#testCase.file: #testCase.errors.size() errors)'() {
        when:
        def response = testRestTemplate.postForEntity(
                paymentCreateUrl,
                requestBuilder.withFileAndTemplateValues("/input/payment/validation/create/controller/${testCase.file}", [:]),
                Map
        )

        then:
        validateErrors(response, testCase)

        where:
        testCase << [
                [
                        file:'tooManyTransactions.json',
                        errors:[
                                [code:'InvalidInput', message:'Cannot process this payment as it has existing transactions'],
                        ]
                ],
                [
                        file:'noPaymentMethod.json',
                        errors:[
                                [code:'RequiredField', message:'paymentMethodInfo.method is required'],
                        ]
                ],
                [
                        file:'invalidPaymentMethod.json',
                        errors:[
                                [code:'InvalidInput', message:'Unrecognized payment method: IOU'],
                        ]
                ],
        ]
    }

    @Unroll
    def 'Controller - Update (#testCase.file: #testCase.errors.size() errors)'() {
        when:
        def response = testRestTemplate.postForEntity(
                paymentUpdateUrl,
                requestBuilder.withFileAndTemplateValues("/input/payment/validation/update/controller/${testCase.file}", [:]),
                Map
        )

        then:
        validateErrors(response, testCase)

        where:
        testCase << [
                [
                        file:'multipleInitialTransactions.json',
                        errors:[
                                [code:'InvalidInput', message:'Cannot process this payment as it has multiple transactions with Initial state'],
                        ]
                ],
        ]
    }

    @Unroll
    def 'Service - PayerAuth Enrol Check (#testCase.file: #testCase.errors.size() errors)'() {
        when:
        def response = testRestTemplate.postForEntity(
                paymentCreateUrl,
                requestBuilder.withFileAndTemplateValues("/input/payment/validation/create/payerAuth/${testCase.file}", [:]),
                Map
        )

        then:
        validateErrors(response, testCase)

        where:
        testCase << [
                [
                        file:'missingBillingAddressFields.json',
                        errors:[
                                [code:'RequiredField', message:'Billing address street is required'],
                                [code:'RequiredField', message:'Billing address city is required'],
                                [code:'RequiredField', message:'Billing address post code is required'],
                                [code:'RequiredField', message:'Billing address state is required'],
                                [code:'RequiredField', message:'Billing address country is required'],
                                [code:'RequiredField', message:'Token is required'],
                        ]
                ],
                [
                        file:'missingAuthCheckFields.json',
                        errors:[
                                [code:'RequiredField', message:'Billing first name is required'],
                                [code:'RequiredField', message:'Billing last name is required'],
                                [code:'RequiredField', message:'Billing email is required'],
                                [code:'RequiredField', message:'Payer authentication accept header is required'],
                                [code:'RequiredField', message:'Payer authentication user agent header is required'],
                        ]
                ],
                [
                        file:'negativePayment.json',
                        errors:[
                                [code:'InvalidInput', message:'Payment amount must be greater than zero'],
                        ]
                ],
        ]
    }

    @Unroll
    def "Service - Authorization (No Payer Auth) (#testCase.file: #testCase.errors.size() errors)"() {
        when:
        def response = testRestTemplate.postForEntity(
                paymentUpdateUrl,
                requestBuilder.withFileAndTemplateValues("/input/payment/validation/update/authNoPayerAuth/${testCase.file}",
                        ['enrolmentCheckDataTypeId':commerceToolsHelper.typeIdForKey('cybersource_payer_authentication_enrolment_check')]),
                Map
        )

        then:
        validateErrors(response, testCase)

        where:
        testCase << [
                [
                        file:'missingBillingAddressFields.json',
                        errors:[
                                [code:'RequiredField', message:'Billing address street is required'],
                                [code:'RequiredField', message:'Billing address city is required'],
                                [code:'RequiredField', message:'Billing address post code is required'],
                                [code:'RequiredField', message:'Billing address state is required'],
                                [code:'RequiredField', message:'Billing address country is required'],
                                [code:'RequiredField', message:'Token is required'],
                        ]
                ],
                [
                        file:'negativePayment.json',
                        errors:[
                                [code:'InvalidInput', message:'Payment amount must be greater than zero'],
                        ]
                ],
                [
                        file:'enrolmentDataExists.json',
                        errors:[
                                [code:'InvalidOperation', message:'Unexpected payer authentication enrolment data present'],
                        ]
                ],
                [
                        file:'alreadyHasSuccessfulAuth.json',
                        errors:[
                                [code:'InvalidInput', message:'Cannot process this payment as SUCCESS AUTHORIZATION transaction exists'],
                        ]
                ],
        ]
    }

    @Unroll
    def "Service - Visa Checkout Authorization (#testCase.file: #testCase.errors.size() errors)"() {
        when:
        def response = testRestTemplate.postForEntity(
                paymentUpdateUrl,
                requestBuilder.withFileAndTemplateValues("/input/payment/validation/update/visaCheckout/${testCase.file}",
                        ['enrolmentCheckDataTypeId':commerceToolsHelper.typeIdForKey('cybersource_payer_authentication_enrolment_check')]),
                Map
        )

        then:
        validateErrors(response, testCase)

        where:
        testCase << [
                [
                        file:'enrolmentDataExists.json',
                        errors:[
                                [code:'InvalidOperation', message:'Unexpected payer authentication enrolment data present']
                        ]
                ],
                [
                        file:'negativePayment.json',
                        errors:[
                                [code:'InvalidInput', message:'Payment amount must be greater than zero'],
                        ]
                ],
                [
                        file:'noToken.json',
                        errors:[
                                [code:'RequiredField', message:'Token is required'],
                        ]
                ],
                [
                        file:'alreadyHasSuccessfulAuth.json',
                        errors:[
                                [code:'InvalidInput', message:'Cannot process this payment as SUCCESS AUTHORIZATION transaction exists'],
                        ]
                ],
        ]
    }

    @Unroll
    def "Service - Authorization (Payer Auth) - authentication enrol bad signature / bad reference ID"() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard('4000000000000002', 'Visa')

        and: 'valid request JWT created'
        def requestJwt = cardinalHelper.retrieveJwt()

        and: 'bad response JWT created'
        def responseJwt
        if (useOldJwt) {
            responseJwt = cardinalHelper.retrieveJwt()
        } else {
            responseJwt = 'fake response JWT'
        }

        when: 'payment is updated with invalid data'
        def enrolmentCheckFields = [
                authenticationRequired:true,
                authenticationTransactionId:'auth tx id',
                cardinalReferenceId:'reference id',
        ]

        def response = testRestTemplate.postForEntity(
                paymentUpdateUrl,
                requestBuilder.payerAuthPaymentUpdateRequest(requestJwt, responseJwt, 'paReq', createTokenResponse, enrolmentCheckFields),
                String
        )

        then: 'validation errors in response'
        response.statusCode == HttpStatus.BAD_REQUEST
        def responseBody = new JsonSlurper().parseText(response.body)
        responseBody.errors.size() == 1
        responseBody.errors[0].code == 'InvalidInput'
        responseBody.errors[0].message == expectedMessage

        where:
        description          | useOldJwt | expectedMessage
        'bad signature'      | false     | 'Invalid response JWT'
        'wrong reference id' | true      | 'Reference id mismatch detected'
    }

    def "Service - Authorization (Payer Auth) - authentication enrol response"() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard('4000000000000002', 'Visa')

        and: 'valid request JWT created'
        def requestJwt = cardinalHelper.retrieveJwt()

        when: 'payment is updated with invalid data'
        def enrolmentCheckFields = [:]
        def response = testRestTemplate.postForEntity(
                paymentUpdateUrl,
                requestBuilder.paymentUpdateWithoutAuthenticationRequest(requestJwt, createTokenResponse, enrolmentCheckFields),
                String
        )

        then: 'validation errors in response'
        response.statusCode == HttpStatus.BAD_REQUEST
        def responseBody = new JsonSlurper().parseText(response.body)
        responseBody.errors.size() == 3
        responseBody.errors.each { assert it.code == 'InvalidOperation' }
        responseBody.errors.message == [
                'Payer authentication enrolment flag missing',
                'Payer authentication enrolment request reference id missing',
                'Payer authentication enrolment authentication transaction id missing',
        ]
    }

    @Unroll
    def "Service - Authorization (Payer Auth) (#testCase.file: #testCase.errors.size() errors)"() {
        when:
        def response = testRestTemplate.postForEntity(
                paymentUpdateUrl,
                requestBuilder.withFileAndTemplateValues("/input/payment/validation/update/authWithPayerAuth/${testCase.file}", [
                        'requestJwt':'something',
                        'responseJwt':'something',
                        'paReq':'something',
                        'token':'something',
                        'maskedPan':'something',
                        'cardType':'VISA',
                        'enrolmentCheckDataTypeId':commerceToolsHelper.typeIdForKey('cybersource_payer_authentication_enrolment_check'),
                ]),
                Map
        )

        then:
        validateErrors(response, testCase)

        where:
        testCase << [
                [
                        file:'missingBillingAddressFields.json',
                        errors:[
                                [code:'RequiredField', message:'Billing address street is required'],
                                [code:'RequiredField', message:'Billing address city is required'],
                                [code:'RequiredField', message:'Billing address post code is required'],
                                [code:'RequiredField', message:'Billing address state is required'],
                                [code:'RequiredField', message:'Billing address country is required'],
                                [code:'RequiredField', message:'Token is required'],
                                [code:'InvalidInput', message:'Invalid response JWT'],
                        ]
                ],
                [
                        file:'negativePayment.json',
                        errors:[
                                [code:'InvalidInput', message:'Payment amount must be greater than zero'],
                                [code:'InvalidInput', message:'Invalid response JWT'],
                        ]
                ],
                [
                        file:'missingAuthCheckFields.json',
                        errors:[
                                [code:'RequiredField', message:'Billing first name is required'],
                                [code:'RequiredField', message:'Billing last name is required'],
                                [code:'RequiredField', message:'Billing email is required'],
                                [code:'RequiredField', message:'Payer authentication accept header is required'],
                                [code:'RequiredField', message:'Payer authentication user agent header is required'],
                                [code:'InvalidInput', message:'Invalid response JWT'],
                        ]
                ],
                [
                        file:'authorizationNotAllowed.json',
                        errors:[
                                [code:'InvalidOperation', message:'Payment cannot be authorized due to previous failure.'],
                                [code:'InvalidInput', message:'Invalid response JWT'],
                        ]
                ],
                [
                        file:'alreadyHasSuccessfulAuth.json',
                        errors:[
                                [code:'InvalidInput', message:'Cannot process this payment as SUCCESS AUTHORIZATION transaction exists'],
                                [code:'InvalidInput', message:'Invalid response JWT'],
                        ]
                ],

        ]
    }

    @Unroll
    def "Service - Capture (#testCase.file: #testCase.errors.size() errors)"() {
        when:
        def response = testRestTemplate.postForEntity(
                paymentUpdateUrl,
                requestBuilder.withFileAndTemplateValues("/input/payment/validation/update/capture/${testCase.file}", [:]),
                Map
        )

        then:
        validateErrors(response, testCase)

        where:
        testCase << [
                [
                        file:'noSuccessAuthOnCapture.json',
                        errors:[
                                [code:'InvalidInput', message:'Cannot process this payment as no SUCCESS AUTHORIZATION transaction exists'],
                        ]
                ],
                [
                        file:'alreadyHasSuccessfulChargeOnCapture.json',
                        errors:[
                                [code:'InvalidInput', message:'Cannot process this payment as SUCCESS CHARGE transaction exists'],
                        ]
                ],
        ]
    }

    @Unroll
    def "Service - Reversal (#testCase.file: #testCase.errors.size() errors)"() {
        when:
        def response = testRestTemplate.postForEntity(
                paymentUpdateUrl,
                requestBuilder.withFileAndTemplateValues("/input/payment/validation/update/reversal/${testCase.file}", [:]),
                Map
        )

        then:
        validateErrors(response, testCase)

        where:
        testCase << [
                [
                        file:'noSuccessAuthOnReversal.json',
                        errors:[
                                [code:'InvalidInput', message:'Cannot process this payment as no SUCCESS AUTHORIZATION transaction exists'],
                        ]
                ],
                [
                        file:'alreadyHasSuccessfulCancelAuthOnReversal.json',
                        errors:[
                                [code:'InvalidInput', message:'Cannot process this payment as SUCCESS CANCEL_AUTHORIZATION transaction exists'],
                        ]
                ],
                [
                        file:'wrongReversalAmount.json',
                        errors:[
                                [code:'InvalidInput', message:'Cancel Authorization amount does not equal Authorization amount'],
                        ]
                ],
        ]
    }

    @Unroll
    def "Service - Refund (#testCase.file: #testCase.errors.size() errors)"() {
        when:
        def response = testRestTemplate.postForEntity(
                paymentUpdateUrl,
                requestBuilder.withFileAndTemplateValues("/input/payment/validation/update/refund/${testCase.file}", [:]),
                Map
        )

        then:
        validateErrors(response, testCase)

        where:
        testCase << [
                [
                        file:'noSuccessAuthOrChargeOnReversal.json',
                        errors:[
                                [code:'InvalidInput', message:'Cannot process this payment as no SUCCESS AUTHORIZATION transaction exists'],
                                [code:'InvalidInput', message:'Cannot process this payment as no SUCCESS CHARGE transaction exists'],
                        ]
                ],
                [
                        file:'refundAmountExceedsCaptureAmount.json',
                        errors:[
                                [code:'InvalidInput', message:'Sum of refunds exceeds charge'],
                        ]
                ],
        ]
    }

    private void validateErrors(ResponseEntity response, Map testCase) {
        response.statusCode == HttpStatus.BAD_REQUEST
        testCase.errors.each { expectedError ->
            def foundError = response.body.errors.find { responseError ->
                responseError.code == expectedError.code && responseError.message == expectedError.message
            }
            assert foundError != null
        }
        assert response.body.errors.size() == testCase.errors.size()
    }

}
