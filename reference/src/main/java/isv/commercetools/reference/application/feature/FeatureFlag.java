package isv.commercetools.reference.application.feature;

public class FeatureFlag {

    private final boolean enabled;

    public FeatureFlag(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isEnabled() {
        return enabled;
    }

}
