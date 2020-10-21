package isv.commercetools.mapping.transformer.capture;

import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.CaptureServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import java.util.Arrays;

public class CaptureRequestTransformer extends RequestTransformer {

  public CaptureRequestTransformer(PaymentServiceIds paymentServiceIds) {
    super(Arrays.asList(
      new BaseFieldGroupTransformer(paymentServiceIds),
      new CaptureServiceFieldGroupTransformer(),
      new PurchaseTotalsFieldGroupTransformer()
    ));
  }

}
