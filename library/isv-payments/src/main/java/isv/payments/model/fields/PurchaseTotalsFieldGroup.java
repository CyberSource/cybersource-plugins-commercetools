package isv.payments.model.fields;

import java.math.BigDecimal;

public class PurchaseTotalsFieldGroup extends AbstractFieldGroup {

  private String currency;
  private BigDecimal grandTotalAmount;

  @Override
  public String getFieldGroupPrefix() {
    return "purchaseTotals_";
  }


  public String getCurrency() {
    return currency;
  }

  public void setCurrency(String currency) {
    this.currency = currency;
  }

  public BigDecimal getGrandTotalAmount() {
    return grandTotalAmount;
  }

  public void setGrandTotalAmount(BigDecimal grandTotalAmount) {
    this.grandTotalAmount = grandTotalAmount;
  }
}
