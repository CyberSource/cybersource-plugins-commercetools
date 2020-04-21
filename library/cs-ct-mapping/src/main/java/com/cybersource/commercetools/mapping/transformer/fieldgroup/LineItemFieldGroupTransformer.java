package com.cybersource.commercetools.mapping.transformer.fieldgroup;

import com.cybersource.payments.model.fields.LineItemFieldGroup;
import com.cybersource.commercetools.mapping.model.PaymentDetails;
import io.sphere.sdk.carts.LineItem;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Populates LineItemFieldGroups from cart line items
 */
public class LineItemFieldGroupTransformer implements FieldGroupTransformer<LineItemFieldGroup> {

    @Override
    @SuppressWarnings("PMD.AvoidInstantiatingObjectsInLoops")
    public List<LineItemFieldGroup> configure(PaymentDetails paymentDetails) {
        var cart = paymentDetails.getCart();
        var lineItemFieldGroups = new ArrayList<LineItemFieldGroup>();
        for (int i = 0 ; i < cart.getLineItems().size() ; i++) {
            var lineItem = cart.getLineItems().get(i);
            var lineItemFieldGroup = new LineItemFieldGroup(i);
            lineItemFieldGroup.setQuantity(lineItem.getQuantity());
            lineItemFieldGroup.setUnitPrice(lineItem.getTotalPrice().getNumber().numberValue(BigDecimal.class));
            lineItemFieldGroup.setProductCode(customFieldValue(lineItem, "cs_productCode"));
            lineItemFieldGroup.setProductRisk(customFieldValue(lineItem, "cs_productRisk"));
            lineItemFieldGroup.setProductName(lineItem.getName().get(cart.getLocale()));
            lineItemFieldGroup.setProductSKU(lineItem.getVariant().getSku());
            lineItemFieldGroups.add(lineItemFieldGroup);
        }

        return lineItemFieldGroups;
    }

    private String customFieldValue(LineItem lineItem, String field) {
        String fieldValue = null;
        var customFields = lineItem.getCustom();
        if (customFields != null) {
            fieldValue = customFields.getFieldAsString(field);
        }
        return fieldValue;
    }

}
