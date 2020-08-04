package isv.commercetools.reference.application.feature;

import isv.commercetools.reference.application.config.ExtensionConfiguration;
import java.util.Map;
import org.springframework.boot.actuate.endpoint.annotation.DeleteOperation;
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.boot.actuate.endpoint.annotation.Selector;
import org.springframework.boot.actuate.endpoint.annotation.WriteOperation;
import org.springframework.stereotype.Component;

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
