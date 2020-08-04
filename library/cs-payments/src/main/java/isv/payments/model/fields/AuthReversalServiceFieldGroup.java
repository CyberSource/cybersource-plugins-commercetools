package isv.payments.model.fields;

public class AuthReversalServiceFieldGroup extends AbstractFieldGroup {

    private boolean run;
    private String authRequestID;

    @Override
    public String getFieldGroupPrefix() {
        return "ccAuthReversalService_";
    }

    public String getAuthRequestID() {
        return authRequestID;
    }

    public void setAuthRequestID(String authRequestID) {
        this.authRequestID = authRequestID;
    }

    public boolean isRun() {
        return run;
    }

    public void setRun(boolean run) {
        this.run = run;
    }


}
