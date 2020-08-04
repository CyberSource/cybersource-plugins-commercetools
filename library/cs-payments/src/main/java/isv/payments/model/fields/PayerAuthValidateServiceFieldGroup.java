package isv.payments.model.fields;

public class PayerAuthValidateServiceFieldGroup extends AbstractFieldGroup {

    private boolean run;
    private String authenticationTransactionID;

    @Override
    public String getFieldGroupPrefix() {
        return "payerAuthValidateService_";
    }

    public boolean isRun() {
        return run;
    }

    public void setRun(boolean run) {
        this.run = run;
    }

    public String getAuthenticationTransactionID() {
        return authenticationTransactionID;
    }

    public void setAuthenticationTransactionID(String authenticationTransactionID) {
        this.authenticationTransactionID = authenticationTransactionID;
    }
}
