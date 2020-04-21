package com.cybersource.commercetools.mapping.transformer.fieldgroup;

import com.cybersource.payments.model.fields.DecisionManagerFieldGroup;
import com.cybersource.commercetools.mapping.model.PaymentDetails;

import java.util.ArrayList;
import java.util.List;

/**
 * Configures DecisionManagerFieldGroup to allow overriding of decision manager configuration
 */
public class DecisionManagerFieldGroupTransformer implements FieldGroupTransformer<DecisionManagerFieldGroup> {

    @Override
    public List<DecisionManagerFieldGroup> configure(PaymentDetails paymentDetails) {
        var fieldGroups = new ArrayList<DecisionManagerFieldGroup>();
        var decisionManagerFields = new DecisionManagerFieldGroup();
        var paymentOverrides = paymentDetails.getOverrides();
        var enableDecisionManager = paymentOverrides.getEnableDecisionManager();
        if (enableDecisionManager.isPresent()) {
            decisionManagerFields.setEnabled(enableDecisionManager.get());
            fieldGroups.add(decisionManagerFields);
        }
        return fieldGroups;
    }

}
