package isv.commercetools.mapping.transformer.fieldgroup;

import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.MerchantDefinedDataFieldGroup;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Populates merchant defined data fields if custom fields present
 */
public class MerchantDefinedDataFieldGroupTransformer implements FieldGroupTransformer<MerchantDefinedDataFieldGroup> {

    private static final String CUSTOM_FIELD_PREFIX = "isv_merchantDefinedData_";

    @Override
    public List<MerchantDefinedDataFieldGroup> configure(PaymentDetails paymentDetails) {
        List<MerchantDefinedDataFieldGroup> fieldGroups;

        var customFields = paymentDetails.getCustomPayment().getBasePayment().getCustom();
        var extraFields = customFields.getFieldsJsonMap().keySet().stream()
                .filter(name -> name.startsWith(CUSTOM_FIELD_PREFIX))
                .collect(Collectors.toMap(
                        name -> name.replaceAll(CUSTOM_FIELD_PREFIX, ""),
                        name -> customFields.getFieldAsString(name)
                ));

        if (extraFields.isEmpty()) {
            fieldGroups = Collections.emptyList();
        } else {
            var fieldGroup = new MerchantDefinedDataFieldGroup();
            fieldGroup.setExtraFields(extraFields);
            fieldGroups = List.of(fieldGroup);
        }

        return fieldGroups;
    }

}
