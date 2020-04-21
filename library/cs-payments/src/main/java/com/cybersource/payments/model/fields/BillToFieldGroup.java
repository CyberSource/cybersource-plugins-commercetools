package com.cybersource.payments.model.fields;

public class BillToFieldGroup extends AddressFieldGroup {

  private String email;
  private String ipAddress;

  @Override
  public String getFieldGroupPrefix() {
    return "billTo_";
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getIpAddress() {
    return ipAddress;
  }

  public void setIpAddress(String ipAddress) {
    this.ipAddress = ipAddress;
  }

}
