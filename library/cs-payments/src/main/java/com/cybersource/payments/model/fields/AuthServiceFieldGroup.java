package com.cybersource.payments.model.fields;

public class AuthServiceFieldGroup extends AbstractFieldGroup {

  private boolean run;

  @Override
  public String getFieldGroupPrefix() {
    return "ccAuthService_";
  }

  public boolean isRun() {
    return run;
  }

  public void setRun(boolean run) {
    this.run = run;
  }
}
