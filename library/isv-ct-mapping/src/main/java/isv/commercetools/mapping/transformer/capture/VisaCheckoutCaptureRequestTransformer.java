package isv.commercetools.mapping.transformer.capture;

import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.CaptureServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer;
import java.util.Arrays;

public class VisaCheckoutCaptureRequestTransformer extends RequestTransformer {

  public VisaCheckoutCaptureRequestTransformer(PaymentServiceIds paymentServiceIds) {
    super(Arrays.asList(
      new BaseFieldGroupTransformer(paymentServiceIds),
      new CaptureServiceFieldGroupTransformer(),
      new VisaCheckoutFieldGroupTransformer(),
      new PurchaseTotalsFieldGroupTransformer()
    ));
  }

}
