package isv.payments.model.fields;

public class PayerAuthEnrollServiceFieldGroup extends AbstractFieldGroup {

    private boolean run;
    private String referenceID;
    private String transactionMode;
    private String httpAccept;
    private String httpUserAgent;

    @Override
    public String getFieldGroupPrefix() {
        return "payerAuthEnrollService_";
    }

    public boolean isRun() {
        return this.run;
    }

    public void setRun(boolean run) {
        this.run = run;
    }

    public String getReferenceID() {
        return referenceID;
    }

    public void setReferenceID(String referenceID) {
        this.referenceID = referenceID;
    }

    public String getTransactionMode() {
        return transactionMode;
    }

    public void setTransactionMode(String transactionMode) {
        this.transactionMode = transactionMode;
    }

    public String getHttpAccept() {
        return httpAccept;
    }

    public void setHttpAccept(String httpAccept) {
        this.httpAccept = httpAccept;
    }

    public String getHttpUserAgent() {
        return httpUserAgent;
    }

    public void setHttpUserAgent(String httpUserAgent) {
        this.httpUserAgent = httpUserAgent;
    }

}
