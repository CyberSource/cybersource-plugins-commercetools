package isv.commercetools.reference.application.service.cart

import io.sphere.sdk.carts.Cart
import io.sphere.sdk.client.SphereClient
import io.sphere.sdk.customers.Customer
import io.sphere.sdk.models.Reference
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.queries.PagedQueryResult
import isv.commercetools.mapping.model.CustomPayment
import isv.payments.exception.PaymentException
import spock.lang.Specification
import spock.lang.Unroll

import java.util.concurrent.CompletableFuture
import java.util.concurrent.CompletionStage

class CartRetrieverSpecification extends Specification {

    CartRetriever testObj

    CustomPayment customPaymentMock = Mock()
    Payment paymentMock = Mock()
    Cart cartMock = Mock()
    SphereClient paymentSphereClientMock = Mock()
    CompletionStage<Cart> completionStageMock = Mock()
    CompletableFuture<Cart> completableFutureMock = Mock()
    PagedQueryResult<Cart> queryResultMock = Mock()
    Reference<Customer> customerMock = Mock()

    def setup() {
        testObj = new CartRetriever(paymentSphereClientMock)

        customPaymentMock.id >> 'paymentId'
        customPaymentMock.basePayment >> paymentMock
    }

    @Unroll
    def 'should retrieve cart for #userType'() {
        given: 'payment has user details'
        if (anonymous) {
            paymentMock.anonymousId >> 'anonymous_id'
        } else {
            paymentMock.customer >> customerMock
            customerMock.id >> 'customer_id'
        }

        and: 'ct client will return single result'
        def query
        1 * paymentSphereClientMock.execute(_) >> { args ->
            query = args[0]
            completionStageMock
        }
        completionStageMock.toCompletableFuture() >> completableFutureMock
        completableFutureMock.get() >> queryResultMock
        queryResultMock.results >> [cartMock]
        queryResultMock.count >> 1

        when:
        def result = testObj.retrieveCart(customPaymentMock)

        then: 'cart is returned'
        result == cartMock

        and: 'correct query was used'
        query.httpRequestIntent().path == expectedPathPrefix +
                '&where=' + URLEncoder.encode('cartState="Active"', 'UTF-8') +
                '&sort=' + URLEncoder.encode('lastModifiedAt desc', 'UTF-8')

        where:
        userType         | anonymous | expectedPathPrefix
        'anonymous user' | true      | '/carts?where=' + URLEncoder.encode('anonymousId="anonymous_id"', 'UTF-8')
        'logged in user' | false     | '/carts?where=' + URLEncoder.encode('customerId="customer_id"', 'UTF-8')
    }

    def 'should throw exception when cart not found'() {
        given: 'payment has user details'
        paymentMock.customer >> customerMock
        customerMock.id >> 'customer_id'

        and: 'ct client will return no results'
        1 * paymentSphereClientMock.execute(_) >> completionStageMock
        completionStageMock.toCompletableFuture() >> completableFutureMock
        completableFutureMock.get() >> queryResultMock
        queryResultMock.count >> 0

        when:
        testObj.retrieveCart(customPaymentMock)

        then: 'exception thrown'
        def paymentException = thrown(PaymentException)
        paymentException.message == 'Could not find cart for payment paymentId'
    }

    def 'should throw exception when too many carts found'() {
        given: 'payment has user details'
        paymentMock.customer >> customerMock
        customerMock.id >> 'customer_id'

        and: 'ct client will return no results'
        1 * paymentSphereClientMock.execute(_) >> completionStageMock
        completionStageMock.toCompletableFuture() >> completableFutureMock
        completableFutureMock.get() >> queryResultMock
        queryResultMock.count >> 2

        when:
        testObj.retrieveCart(customPaymentMock)

        then: 'exception thrown'
        def paymentException = thrown(PaymentException)
        paymentException.message == 'Found 2 carts for payment paymentId'
    }

}
