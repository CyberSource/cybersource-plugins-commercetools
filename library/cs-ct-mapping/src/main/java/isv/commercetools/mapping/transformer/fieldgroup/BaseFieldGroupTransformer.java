package isv.commercetools.mapping.transformer.fieldgroup;

import isv.commercetools.mapping.constants.PaymentMethodConstants;
import isv.commercetools.mapping.model.CybersourceIds;
import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.BaseFieldGroup;
import java.util.List;

/**
 * Populates BaseFieldGroup for payment and merchantId
 */
public class BaseFieldGroupTransformer implements FieldGroupTransformer<BaseFieldGroup> {

    private final CybersourceIds cybersourceIds;

    public BaseFieldGroupTransformer(CybersourceIds cybersourceIds) {
        super();
        this.cybersourceIds = cybersourceIds;
    }

    @Override
    public List<BaseFieldGroup> configure(PaymentDetails paymentDetails) {
        var baseFields = new BaseFieldGroup();
        baseFields.setMerchantID(cybersourceIds.getMerchantId());
        baseFields.setDeveloperID(cybersourceIds.getDeveloperId());
        baseFields.setPartnerSolutionID(cybersourceIds.getPartnerSolutionId());
        if (PaymentMethodConstants.PAYMENT_METHOD_VISA_CHECKOUT.equals(paymentDetails.getCustomPayment().getPaymentMethod())) {
            baseFields.setPaymentSolution("visacheckout");
        }
        baseFields.setMerchantReferenceCode(paymentDetails.getCustomPayment().getBasePayment().getId());
        baseFields.setDeviceFingerprintID(paymentDetails.getCustomPayment().getDeviceFingerprintId());
        return List.of(baseFields);
    }

}
