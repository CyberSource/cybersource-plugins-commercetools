package isv.payments.model.fields;

public class VisaCheckoutFieldGroup extends AbstractFieldGroup {

    private String orderID;

    @Override
    public String getFieldGroupPrefix() {
        return "vc_";
    }

    public String getOrderID() {
        return orderID;
    }

    public void setOrderID(String orderID) {
        this.orderID = orderID;
    }
}
