package com.cybersource.commercetools.reference.application.helper

import com.cybersource.commercetools.reference.application.model.CreateTokenResponse
import groovy.text.SimpleTemplateEngine
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Component

@Component
class RequestBuilder {

    @Autowired
    CommerceToolsHelper commerceToolsHelper

    @Autowired
    TokenHelper tokenHelper

    SimpleTemplateEngine templateEngine = new SimpleTemplateEngine()

    def noPayerAuthPaymentCreateRequest(CreateTokenResponse createTokenResponse, String customerId = 'customer-with-accept-address') {
        def binding = [
                'token':createTokenResponse.token,
                'maskedPan':createTokenResponse.maskedPan,
                'cardType':tokenHelper.cardName(createTokenResponse.cardType),
                'customerId':customerId,
        ]
        buildEntity('/input/payment/nopayerauth/paymentCreate.json', binding)
    }

    def noPayerAuthPaymentUpdateRequest(CreateTokenResponse createTokenResponse, String amount, String customerId = 'customer-with-accept-address') {
        def binding = [
                'token':createTokenResponse.token,
                'maskedPan':createTokenResponse.maskedPan,
                'cardType':tokenHelper.cardName(createTokenResponse.cardType),
                'amount':amount,
                'customerId':customerId,
        ]

        buildEntity('/input/payment/nopayerauth/paymentUpdate.json', binding)
    }

    def noPayerAuthAnonymousPaymentCreateRequest(CreateTokenResponse createTokenResponse) {
        def binding = [
                'token':createTokenResponse.token,
                'maskedPan':createTokenResponse.maskedPan,
                'cardType':tokenHelper.cardName(createTokenResponse.cardType),
        ]
        buildEntity('/input/payment/nopayerauth/paymentCreateForAnonymousUser.json', binding)
    }

    def noPayerAuthAnonymousPaymentUpdateRequest(CreateTokenResponse createTokenResponse) {
        def binding = [
                'token':createTokenResponse.token,
                'maskedPan':createTokenResponse.maskedPan,
                'cardType':tokenHelper.cardName(createTokenResponse.cardType),
        ]

        buildEntity('/input/payment/nopayerauth/paymentUpdateForAnonymousUser.json', binding)
    }

    def payerAuthPaymentCreateRequest(String responseJwt, CreateTokenResponse createTokenResponse) {
        def binding = payerAuthPaymentCreateBinding(responseJwt, createTokenResponse)
        buildEntity('/input/payment/payerauth/paymentCreate.json', binding)
    }

    def invalidPaymentCreateRequest() {
        buildEntity('/input/payment/payerauth/paymentCreateWithoutRequiredFields.json', [:])
    }

    def payerAuthPaymentUpdateRequest(String requestJwt, String responseJwt, String paReq, CreateTokenResponse createTokenResponse, Map enrolmentCheckFields) {
        def binding = payerAuthPaymentUpdateBinding(requestJwt, responseJwt, paReq, createTokenResponse, enrolmentCheckFields)
        buildEntity('/input/payment/payerauth/paymentUpdate.json', binding)
    }

    def paymentUpdateWithoutAuthenticationRequest(String requestJwt, CreateTokenResponse createTokenResponse, Map enrolmentCheckFields) {
        def binding = payerAuthPaymentUpdateBinding(requestJwt, null, null, createTokenResponse, enrolmentCheckFields)
        buildEntity('/input/payment/payerauth/paymentUpdateWithoutAuthentication.json', binding)
    }

    def payerAuthAnonymousPaymentCreateRequest(String responseJwt, CreateTokenResponse createTokenResponse) {
        def binding = payerAuthPaymentCreateBinding(responseJwt, createTokenResponse)
        buildEntity('/input/payment/payerauth/paymentCreateForAnonymousUser.json', binding)
    }

    def payerAuthAnonymousPaymentUpdateRequest(String requestJwt, String responseJwt, String paReq, CreateTokenResponse createTokenResponse, Map enrolmentCheckFields) {
        def binding = payerAuthPaymentUpdateBinding(requestJwt, responseJwt, paReq, createTokenResponse, enrolmentCheckFields)
        buildEntity('/input/payment/payerauth/paymentUpdateForAnonymousUser.json', binding)
    }

    def payerAuthPaymentCreateBinding(String responseJwt, CreateTokenResponse createTokenResponse) {
        [
                'requestJwt':responseJwt,
                'token':createTokenResponse.token,
                'maskedPan':createTokenResponse.maskedPan,
                'cardType':tokenHelper.cardName(createTokenResponse.cardType),
        ]
    }

    def payerAuthPaymentUpdateBinding(String requestJwt, String responseJwt, String paReq, CreateTokenResponse createTokenResponse, Map enrolmentCheckFields) {
        def enrolmentCheckData = enrolmentCheckFields.collect { "\"${it.key}\": \"${escapeQuotes(it.value)}\"" }.join(',\n')
        [
                'requestJwt':requestJwt,
                'responseJwt':responseJwt,
                'paReq':paReq,
                'token':createTokenResponse.token,
                'maskedPan':createTokenResponse.maskedPan,
                'cardType':tokenHelper.cardName(createTokenResponse.cardType),
                'enrolmentCheckData':enrolmentCheckData,
                'enrolmentCheckDataTypeId':commerceToolsHelper.typeIdForKey('cybersource_payer_authentication_enrolment_check'),
        ]
    }

    def paymentCaptureRequest(String interactionId) {
        buildEntity('/input/payment/capture/paymentUpdate.json', [interactionId:interactionId])
    }

    def paymentReversalRequest(String interactionId) {
        buildEntity('/input/payment/reversal/paymentUpdate.json', [interactionId:interactionId])
    }

    def paymentPartialRefundRequest(String interactionId) {
        buildEntity('/input/payment/refund/paymentUpdateForPartialRefund.json', [interactionId:interactionId])
    }

    def paymentRemainingRefundRequest(String interactionId) {
        buildEntity('/input/payment/refund/paymentUpdateForRemainingRefund.json', [interactionId:interactionId])
    }

    def noActionRequiredPayload() {
        buildEntity('/input/payment/noActionRequiredPayload.json', [:])
    }

    def withFileAndTemplateValues(String file, Map templateFields) {
        buildEntity(file, templateFields)
    }

    private buildEntity(String inputPayloadFilePath, Map bindings) {
        def payloadTemplate = getClass().getResource(inputPayloadFilePath).text
        def payload = templateEngine.createTemplate(payloadTemplate).make(bindings).toString()
        def headers = new HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON
        new HttpEntity<>(payload, headers)
    }

    private escapeQuotes(Object value) {
        if (value instanceof String) {
            value.replaceAll('"', '\\\\"')
        } else {
            value
        }
    }
}
