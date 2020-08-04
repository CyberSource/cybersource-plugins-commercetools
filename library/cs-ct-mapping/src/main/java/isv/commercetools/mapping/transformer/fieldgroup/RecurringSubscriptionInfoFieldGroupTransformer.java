package isv.commercetools.mapping.transformer.fieldgroup;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.RecurringSubscriptionInfoFieldGroup;
import java.util.ArrayList;
import java.util.List;

/**
 * Configures RecurringSubscriptionInfoFieldGroup for payment
 */
public class RecurringSubscriptionInfoFieldGroupTransformer implements FieldGroupTransformer<RecurringSubscriptionInfoFieldGroup> {

    private static final String NO_SCHEDULE = "on-demand";

    @Override
    public List<RecurringSubscriptionInfoFieldGroup> configure(PaymentDetails paymentDetails) {
        var fieldGroups = new ArrayList<RecurringSubscriptionInfoFieldGroup>();
        var fieldGroup = new RecurringSubscriptionInfoFieldGroup();

        if (isNotBlank(paymentDetails.getCustomPayment().getTokenAlias())) {
            fieldGroup.setFrequency(NO_SCHEDULE);
            fieldGroups.add(fieldGroup);
        }

        var savedToken = paymentDetails.getCustomPayment().getSavedToken();
        if (isNotBlank(savedToken)) {
            fieldGroup.setSubscriptionID(savedToken);
            fieldGroups.add(fieldGroup);
        }

        return fieldGroups;
    }

}