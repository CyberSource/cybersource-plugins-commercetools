package isv.payments.model.fields;

public class ShipToFieldGroup extends AddressFieldGroup {

  @Override
  public String getFieldGroupPrefix() {
    return "shipTo_";
  }

}
