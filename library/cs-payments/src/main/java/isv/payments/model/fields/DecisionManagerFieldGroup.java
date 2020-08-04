package isv.payments.model.fields;

public class DecisionManagerFieldGroup extends AbstractFieldGroup {

    private boolean enabled;

    @Override
    public String getFieldGroupPrefix() {
        return "decisionManager_";
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
