package com.cybersource.payments.model.fields;

import java.math.BigDecimal;

public class LineItemFieldGroup extends AbstractFieldGroup {

  private final int index;
  private long quantity;
  private BigDecimal unitPrice;
  private String productSKU;
  private String productCode;
  private String productName;
  private String productRisk;

  public LineItemFieldGroup(int index) {
    super();
    this.index = index;
  }

  @Override
  public String getFieldGroupPrefix() {
    return "item_" + index + "_";
  }

  public long getQuantity() {
    return quantity;
  }

  public void setQuantity(long quantity) {
    this.quantity = quantity;
  }

  public BigDecimal getUnitPrice() {
    return unitPrice;
  }

  public void setUnitPrice(BigDecimal unitPrice) {
    this.unitPrice = unitPrice;
  }

  public String getProductSKU() {
    return productSKU;
  }

  public void setProductSKU(String productSKU) {
    this.productSKU = productSKU;
  }

  public String getProductCode() {
    return productCode;
  }

  public void setProductCode(String productCode) {
    this.productCode = productCode;
  }

  public String getProductName() {
    return productName;
  }

  public void setProductName(String productName) {
    this.productName = productName;
  }

  public String getProductRisk() {
    return productRisk;
  }

  public void setProductRisk(String productRisk) {
    this.productRisk = productRisk;
  }
}
