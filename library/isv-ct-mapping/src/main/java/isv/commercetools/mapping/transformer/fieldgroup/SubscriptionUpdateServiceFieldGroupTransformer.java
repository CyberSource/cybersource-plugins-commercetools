package isv.commercetools.mapping.transformer.fieldgroup;

import static org.apache.commons.lang.StringUtils.isNotBlank;

import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.SubscriptionUpdateServiceFieldGroup;
import java.util.ArrayList;
import java.util.List;

/**
 * Configures SubscriptionUpdateServiceFieldGroup to enable running of subscription update service
 */
public class SubscriptionUpdateServiceFieldGroupTransformer implements FieldGroupTransformer<SubscriptionUpdateServiceFieldGroup> {

    @Override
    public List<SubscriptionUpdateServiceFieldGroup> configure(PaymentDetails paymentDetails) {
        var fieldGroups = new ArrayList<SubscriptionUpdateServiceFieldGroup>();
        if (isNotBlank(paymentDetails.getCustomPayment().getSavedToken())) {
            var fieldGroup = new SubscriptionUpdateServiceFieldGroup();
            fieldGroup.setRun(true);
            fieldGroups.add(fieldGroup);
        }
        return fieldGroups;
    }

}
