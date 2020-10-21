package isv.commercetools.mapping.transformer.fieldgroup;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.SubscriptionCreateServiceFieldGroup;
import java.util.ArrayList;
import java.util.List;

/**
 * Configures SubscriptionCreateServiceFieldGroup to enable running of subscription create service
 */
public class SubscriptionCreateServiceFieldGroupTransformer implements FieldGroupTransformer<SubscriptionCreateServiceFieldGroup> {

    @Override
    public List<SubscriptionCreateServiceFieldGroup> configure(PaymentDetails paymentDetails) {
        var fieldGroups = new ArrayList<SubscriptionCreateServiceFieldGroup>();
        if (isNotBlank(paymentDetails.getCustomPayment().getTokenAlias())) {
            var fieldGroup = new SubscriptionCreateServiceFieldGroup();
            fieldGroup.setRun(true);
            fieldGroups.add(fieldGroup);
        }
        return fieldGroups;
    }

}
