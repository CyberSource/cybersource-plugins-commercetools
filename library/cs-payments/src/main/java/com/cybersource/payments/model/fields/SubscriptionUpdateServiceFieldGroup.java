package com.cybersource.payments.model.fields;

public class SubscriptionUpdateServiceFieldGroup extends AbstractFieldGroup {

  private boolean run;

  @Override
  public String getFieldGroupPrefix() {
    return "paySubscriptionUpdateService_";
  }

  public boolean isRun() {
    return run;
  }

  public void setRun(boolean run) {
    this.run = run;
  }
}
