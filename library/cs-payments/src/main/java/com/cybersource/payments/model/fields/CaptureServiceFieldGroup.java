package com.cybersource.payments.model.fields;

public class CaptureServiceFieldGroup extends AbstractFieldGroup {

  private boolean run;
  private String authRequestID;

  @Override
  public String getFieldGroupPrefix() {
    return "ccCaptureService_";
  }

  public boolean isRun() {
    return run;
  }

  public void setRun(boolean run) {
    this.run = run;
  }

  public String getAuthRequestID() {
    return authRequestID;
  }

  public void setAuthRequestID(String authRequestID) {
    this.authRequestID = authRequestID;
  }

}
