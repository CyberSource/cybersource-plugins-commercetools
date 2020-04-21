package com.cybersource.payments.model;

import com.cybersource.payments.model.fields.RequestServiceFieldGroup;

import java.util.ArrayList;
import java.util.List;

public class CybersourceRequest {

  private final List<RequestServiceFieldGroup> fieldGroups = new ArrayList<>();

  public CybersourceRequest(List<RequestServiceFieldGroup> fieldGroups) {
    this.fieldGroups.addAll(fieldGroups);
  }

  public List<RequestServiceFieldGroup> getFieldGroups() {
    return fieldGroups;
  }
}
