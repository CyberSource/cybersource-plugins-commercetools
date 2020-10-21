package isv.commercetools.mapping.transformer.fieldgroup;

import isv.commercetools.mapping.constants.PaymentMethodConstants;
import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.BaseFieldGroup;
import java.util.List;

/**
 * Populates BaseFieldGroup for payment and merchantId
 */
public class BaseFieldGroupTransformer implements FieldGroupTransformer<BaseFieldGroup> {

    private final PaymentServiceIds paymentServiceIds;

    public BaseFieldGroupTransformer(PaymentServiceIds paymentServiceIds) {
        super();
        this.paymentServiceIds = paymentServiceIds;
    }

    @Override
    public List<BaseFieldGroup> configure(PaymentDetails paymentDetails) {
        var baseFields = new BaseFieldGroup();
        baseFields.setMerchantID(paymentServiceIds.getMerchantId());
        baseFields.setDeveloperID(paymentServiceIds.getDeveloperId());
        baseFields.setPartnerSolutionID(paymentServiceIds.getPartnerSolutionId());
        if (PaymentMethodConstants.PAYMENT_METHOD_VISA_CHECKOUT.equals(paymentDetails.getCustomPayment().getPaymentMethod())) {
            baseFields.setPaymentSolution("visacheckout");
        }
        baseFields.setMerchantReferenceCode(paymentDetails.getCustomPayment().getBasePayment().getId());
        baseFields.setDeviceFingerprintID(paymentDetails.getCustomPayment().getDeviceFingerprintId());
        return List.of(baseFields);
    }

}
