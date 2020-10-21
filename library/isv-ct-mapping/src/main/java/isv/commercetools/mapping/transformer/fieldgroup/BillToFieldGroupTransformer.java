package isv.commercetools.mapping.transformer.fieldgroup;

import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.BillToFieldGroup;
import java.util.ArrayList;
import java.util.List;

/**
 * Populates BillToFieldGroup from cart
 */
public class BillToFieldGroupTransformer implements FieldGroupTransformer<BillToFieldGroup> {

    private final AddressFieldGroupPopulator addressFieldGroupPopulator = new AddressFieldGroupPopulator();

    @Override
    public List<BillToFieldGroup> configure(PaymentDetails paymentDetails) {
        var fieldGroups = new ArrayList<BillToFieldGroup>();
        var billToFields = new BillToFieldGroup();
        var billingAddress = paymentDetails.getCart().getBillingAddress();
        addressFieldGroupPopulator.populateFieldGroup(billingAddress, billToFields);
        billToFields.setEmail(billingAddress.getEmail());
        billToFields.setIpAddress(paymentDetails.getCustomPayment().getCustomerIpAddress());
        fieldGroups.add(billToFields);

        return fieldGroups;
    }

}
