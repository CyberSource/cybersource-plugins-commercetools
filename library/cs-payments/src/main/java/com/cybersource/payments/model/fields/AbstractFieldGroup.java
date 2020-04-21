package com.cybersource.payments.model.fields;

import java.util.HashMap;
import java.util.Map;

public abstract class AbstractFieldGroup implements RequestServiceFieldGroup {

  private Map<String,String> extraFields = new HashMap<>();

  @Override
  public abstract String getFieldGroupPrefix();

  @Override
  public Map<String,String> getExtraFields() {
    return extraFields;
  }

  public void setExtraFields(Map<String, String> extraFields) {
    this.extraFields = extraFields;
  }
}
