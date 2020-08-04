package isv.payments.model.fields;

public class RecurringSubscriptionInfoFieldGroup extends AbstractFieldGroup {

  private String subscriptionID;
  private String frequency;

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

  public String getFrequency() {
    return frequency;
  }

  public void setFrequency(String frequency) {
    this.frequency = frequency;
  }
}
