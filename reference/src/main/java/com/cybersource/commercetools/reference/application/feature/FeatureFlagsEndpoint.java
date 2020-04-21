package com.cybersource.commercetools.reference.application.feature;

import com.cybersource.commercetools.reference.application.config.ExtensionConfiguration;
import org.springframework.boot.actuate.endpoint.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Endpoint(id = "features")
public class FeatureFlagsEndpoint {

    private final ExtensionConfiguration extensionConfiguration;

    public FeatureFlagsEndpoint(ExtensionConfiguration extensionConfiguration) {
        this.extensionConfiguration = extensionConfiguration;
    }

    @ReadOperation
    public Map<FeatureName, FeatureFlag> features() {
        return extensionConfiguration.getFeatures();
    }

    @ReadOperation
    public FeatureFlag feature(@Selector FeatureName name) {
        return extensionConfiguration.getFeatures().get(name);
    }

    @WriteOperation
    public void configureFeature(@Selector FeatureName name, boolean enabled) {
        extensionConfiguration.getFeatures().put(name, new FeatureFlag(enabled));
    }

    @DeleteOperation
    public void deleteFeature(@Selector FeatureName name) {
        extensionConfiguration.getFeatures().remove(name);
    }

}
