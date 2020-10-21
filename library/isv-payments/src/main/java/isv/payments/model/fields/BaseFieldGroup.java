package isv.payments.model.fields;

public class BaseFieldGroup extends AbstractFieldGroup {

  private String merchantID;
  private String developerID;
  private String partnerSolutionID;
  private String merchantReferenceCode;
  private String deviceFingerprintID;
  private String paymentSolution;

  @Override
  public String getFieldGroupPrefix() {
    return "";
  }

  public String getMerchantID() {
    return merchantID;
  }

  public void setMerchantID(String merchantID) {
    this.merchantID = merchantID;
  }

  public String getDeveloperID() {
    return developerID;
  }

  public void setDeveloperID(String developerID) {
    this.developerID = developerID;
  }

  public String getPartnerSolutionID() {
    return partnerSolutionID;
  }

  public void setPartnerSolutionID(String partnerSolutionID) {
    this.partnerSolutionID = partnerSolutionID;
  }

  public String getMerchantReferenceCode() {
    return merchantReferenceCode;
  }

  public void setMerchantReferenceCode(String merchantReferenceCode) {
    this.merchantReferenceCode = merchantReferenceCode;
  }

  public String getDeviceFingerprintID() {
    return deviceFingerprintID;
  }

  public void setDeviceFingerprintID(String deviceFingerprintID) {
    this.deviceFingerprintID = deviceFingerprintID;
  }

  public String getPaymentSolution() {
    return paymentSolution;
  }

  public void setPaymentSolution(String paymentSolution) {
    this.paymentSolution = paymentSolution;
  }
}
