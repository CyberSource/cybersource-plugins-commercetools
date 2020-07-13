package isv.commercetools.reference.application.config;

import isv.commercetools.reference.application.feature.FeatureFlag;
import isv.commercetools.reference.application.feature.FeatureName;
import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("commercetools.extension")
public class ExtensionConfiguration {

    private Map<FeatureName,FeatureFlag> features;
    private Map<String,String> security;

    public Map<FeatureName, FeatureFlag> getFeatures() {
        return features;
    }

    public void setFeatures(Map<FeatureName, FeatureFlag> features) {
        this.features = features;
    }

    public Map<String, String> getSecurity() {
        return security;
    }

    public void setSecurity(Map<String, String> security) {
        this.security = security;
    }
}
