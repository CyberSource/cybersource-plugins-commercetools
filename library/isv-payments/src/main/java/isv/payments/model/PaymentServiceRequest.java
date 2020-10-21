package isv.payments.model;

import isv.payments.model.fields.RequestServiceFieldGroup;
import java.util.ArrayList;
import java.util.List;

public class PaymentServiceRequest {

  private final List<RequestServiceFieldGroup> fieldGroups = new ArrayList<>();

  public PaymentServiceRequest(List<RequestServiceFieldGroup> fieldGroups) {
    this.fieldGroups.addAll(fieldGroups);
  }

  public List<RequestServiceFieldGroup> getFieldGroups() {
    return fieldGroups;
  }
}
