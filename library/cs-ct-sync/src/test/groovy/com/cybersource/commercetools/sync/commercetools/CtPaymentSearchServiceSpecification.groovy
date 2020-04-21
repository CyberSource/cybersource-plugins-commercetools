package com.cybersource.commercetools.sync.commercetools

import io.sphere.sdk.client.SphereClient
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.queries.PaymentByIdGet
import spock.lang.Specification

import java.util.concurrent.CompletableFuture
import java.util.concurrent.CompletionStage

class CtPaymentSearchServiceSpecification extends Specification {

    def sphereClientMock = Mock(SphereClient)
    CtPaymentSearchService testObj = new CtPaymentSearchService(sphereClientMock)

    def 'should return a payment if one exists'() {
        given:
        def paymentMock = Mock(Payment)
        def completionStageMock = Mock(CompletionStage)
        def completableFutureMock = Mock(CompletableFuture)
        completionStageMock.toCompletableFuture() >> completableFutureMock
        completableFutureMock.get() >> paymentMock

        when:
        def result = testObj.findPaymentByPaymentId('somePayment')

        then:
        1 * sphereClientMock.execute {
            (it as PaymentByIdGet).httpRequestIntent().path == '/payments/somePayment'
        } >> completionStageMock

        result.get() == paymentMock
    }

    def 'should return an empty optional if no payment found'() {
        given:
        def completionStageMock = Mock(CompletionStage)
        def completableFutureMock = Mock(CompletableFuture)
        completionStageMock.toCompletableFuture() >> completableFutureMock
        completableFutureMock.get() >> null

        when:
        def result = testObj.findPaymentByPaymentId('somePayment')

        then:
        1 * sphereClientMock.execute {
            (it as PaymentByIdGet).httpRequestIntent().path == '/payments/somePayment'
        } >> completionStageMock

        result == Optional.empty()
    }
}
