package isv.payments.model.fields;

public class VisaCheckoutResponseFieldGroup extends AbstractFieldGroup {

    private String cardType;

    @Override
    public String getFieldGroupPrefix() {
        return "vcReply_";
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }
}
