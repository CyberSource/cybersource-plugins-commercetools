package isv.commercetools.reference.application.feature

import isv.commercetools.reference.application.config.ExtensionConfiguration
import spock.lang.Specification

class FeatureFlagsEndpointSpecification extends Specification {

    FeatureFlagsEndpoint testObj

    FeatureFlag featureFlagMock = Mock()

    def featureConfiguration = new ExtensionConfiguration()

    def 'setup'() {
        testObj = new FeatureFlagsEndpoint(featureConfiguration)
    }

    def 'should get features'() {
        given:
        featureConfiguration.features = [(FeatureName.DECISION_MANAGER):featureFlagMock]

        when:
        def result = testObj.features()

        then:
        result == [(FeatureName.DECISION_MANAGER):featureFlagMock]
    }

    def 'should get feature'() {
        given:
        featureConfiguration.features = [(FeatureName.DECISION_MANAGER):featureFlagMock]

        when:
        def result = testObj.feature(FeatureName.DECISION_MANAGER)

        then:
        result == featureFlagMock
    }

    def 'should configure feature'() {
        given:
        featureConfiguration.features = [:]

        when:
        testObj.configureFeature(FeatureName.DECISION_MANAGER, true)

        then:
        featureConfiguration.features.size() == 1
        featureConfiguration.features[FeatureName.DECISION_MANAGER].enabled == true
    }

    def 'should remove feature'() {
        given:
        featureConfiguration.features = [(FeatureName.DECISION_MANAGER):featureFlagMock]
        when:
        testObj.deleteFeature(FeatureName.DECISION_MANAGER)

        then:
        featureConfiguration.features.isEmpty()
    }

}
