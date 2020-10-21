package isv.payments.model.fields;

public class SubscriptionCreateServiceFieldGroup extends AbstractFieldGroup {

  private boolean run;

  @Override
  public String getFieldGroupPrefix() {
    return "paySubscriptionCreateService_";
  }

  public boolean isRun() {
    return run;
  }

  public void setRun(boolean run) {
    this.run = run;
  }
}
