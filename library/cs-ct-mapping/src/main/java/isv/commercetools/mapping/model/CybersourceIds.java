package isv.commercetools.mapping.model;

public class CybersourceIds {

    private String merchantId;
    private String developerId;
    private static final String PARTNER_SOLUTION_ID = "0RX6X1BO";

    public String getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId;
    }

    public String getDeveloperId() {
        return developerId;
    }

    public void setDeveloperId(String developerId) {
        this.developerId = developerId;
    }

    public String getPartnerSolutionId() {
        return PARTNER_SOLUTION_ID;
    }

}
