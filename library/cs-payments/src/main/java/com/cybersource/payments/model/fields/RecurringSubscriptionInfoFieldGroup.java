package com.cybersource.payments.model.fields;

public class RecurringSubscriptionInfoFieldGroup extends AbstractFieldGroup {

  private String subscriptionID;

  @Override
  public String getFieldGroupPrefix() {
    return "recurringSubscriptionInfo_";
  }

  public String getSubscriptionID() {
    return subscriptionID;
  }

  public void setSubscriptionID(String subscriptionID) {
    this.subscriptionID = subscriptionID;
  }
}
