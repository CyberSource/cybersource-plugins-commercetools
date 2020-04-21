package com.cybersource.payments.model.fields;

public class CreditServiceFieldGroup extends AbstractFieldGroup {

    private boolean run;
    private String captureRequestID;

    @Override
    public String getFieldGroupPrefix() {
        return "ccCreditService_";
    }

    public String getCaptureRequestID() {
        return captureRequestID;
    }

    public void setCaptureRequestID(String captureRequestID) {
        this.captureRequestID = captureRequestID;
    }

    public boolean isRun() {
        return run;
    }

    public void setRun(boolean run) {
        this.run = run;
    }


}
