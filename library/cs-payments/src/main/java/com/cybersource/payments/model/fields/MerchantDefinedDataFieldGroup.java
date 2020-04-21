package com.cybersource.payments.model.fields;

public class MerchantDefinedDataFieldGroup extends AbstractFieldGroup {

  @Override
  public String getFieldGroupPrefix() {
    return "merchantDefinedData_";
  }

}
