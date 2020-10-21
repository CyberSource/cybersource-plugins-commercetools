package isv.commercetools.mapping.transformer.fieldgroup;

import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.PayerAuthValidateServiceFieldGroup;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Configures RecurringSubscriptionInfoFieldGroup for payment when card is enrolled
 */
public class PayerAuthValidateServiceFieldGroupTransformer implements FieldGroupTransformer<PayerAuthValidateServiceFieldGroup> {

    private static final Logger LOGGER = LoggerFactory.getLogger(PayerAuthValidateServiceFieldGroupTransformer.class);

    @Override
    public List<PayerAuthValidateServiceFieldGroup> configure(PaymentDetails paymentDetails) {
        var payerAuthValidateServiceFieldGroupList = new ArrayList<PayerAuthValidateServiceFieldGroup>();

        var enrolmentData = paymentDetails.getCustomPayment().getEnrolmentData();
        var authenticationRequired = enrolmentData.getAuthenticationRequired();

        if (authenticationRequired.get()) {
            LOGGER.debug("Card is enrolled so invoking PayerAuthValidateService");
            var authenticationTransactionId = enrolmentData.getAuthenticationTransactionId().get();
            PayerAuthValidateServiceFieldGroup payerAuthValidateServiceFieldGroup = new PayerAuthValidateServiceFieldGroup();
            payerAuthValidateServiceFieldGroup.setRun(true);
            payerAuthValidateServiceFieldGroup.setAuthenticationTransactionID(authenticationTransactionId);
            payerAuthValidateServiceFieldGroupList.add(payerAuthValidateServiceFieldGroup);

        } else {
            LOGGER.debug("Authentication not required so not invoking PayerAuthValidateService");
        }

        return payerAuthValidateServiceFieldGroupList;
    }
}
