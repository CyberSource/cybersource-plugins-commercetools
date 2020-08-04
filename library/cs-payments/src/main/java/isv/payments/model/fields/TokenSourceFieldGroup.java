package isv.payments.model.fields;

public class TokenSourceFieldGroup extends AbstractFieldGroup {

  private String transientToken;

  @Override
  public String getFieldGroupPrefix() {
    return "tokenSource_";
  }

  public String getTransientToken() {
    return transientToken;
  }

  public void setTransientToken(String transientToken) {
    this.transientToken = transientToken;
  }
}
