package com.cybersource.payments.model.fields;

public class VisaCheckoutDataServiceFieldGroup extends AbstractFieldGroup {

    private boolean run;

    @Override
    public String getFieldGroupPrefix() {
        return "getVisaCheckoutDataService_";
    }

    public boolean isRun() {
        return run;
    }

    public void setRun(boolean run) {
        this.run = run;
    }
}
