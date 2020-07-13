package isv.commercetools.reference.application.factory.payment

import io.sphere.sdk.carts.Cart
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.reference.application.config.ExtensionConfiguration
import isv.commercetools.reference.application.feature.FeatureFlag
import isv.commercetools.reference.application.feature.FeatureName
import isv.commercetools.reference.application.service.cart.CartRetriever
import spock.lang.Specification
import spock.lang.Unroll

class FeatureFlagPaymentDetailsFactorySpecification extends Specification {

    FeatureFlagPaymentDetailsFactory testObj

    CartRetriever cartRetrieverMock = Mock()

    CustomPayment paymentMock = Mock()
    Cart cartMock = Mock()

    def featureConfiguration = new ExtensionConfiguration()

    def 'setup'() {
        testObj = new FeatureFlagPaymentDetailsFactory(featureConfiguration, cartRetrieverMock)
    }

    @Unroll
    def 'should create payment details without cart'() {
        given:
        featureConfiguration.features = [(FeatureName.DECISION_MANAGER):decisionManagerFlag]

        when:
        def result = testObj.paymentDetailsWithoutCart(paymentMock)

        then:
        0 * cartRetrieverMock.retrieveCart(_)

        and:
        result.customPayment == paymentMock
        result.cart == null
        result.overrides.enableDecisionManager == expectedDecisionManagerOverrride

        where:
        decisionManagerFlag    | expectedDecisionManagerOverrride
        null                   | Optional.empty()
        new FeatureFlag(true)  | Optional.of(true)
        new FeatureFlag(false) | Optional.of(false)
    }

    @Unroll
    def 'should create payment details with cart'() {
        given:
        featureConfiguration.features = [(FeatureName.DECISION_MANAGER):decisionManagerFlag]

        when:
        def result = testObj.paymentDetailsWithCart(paymentMock)

        then:
        1 * cartRetrieverMock.retrieveCart(paymentMock) >> cartMock

        and:
        result.customPayment == paymentMock
        result.cart == cartMock
        result.overrides.enableDecisionManager == expectedDecisionManagerOverrride

        where:
        decisionManagerFlag                 | expectedDecisionManagerOverrride
        null                                | Optional.empty()
        new FeatureFlag(true)               | Optional.of(true)
        new FeatureFlag(false)              | Optional.of(false)
    }

}
