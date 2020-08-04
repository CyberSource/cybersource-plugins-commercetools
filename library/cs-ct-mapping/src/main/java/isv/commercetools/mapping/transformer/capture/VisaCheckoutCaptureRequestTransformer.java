package isv.commercetools.mapping.transformer.capture;

import isv.commercetools.mapping.model.CybersourceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.CaptureServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer;
import java.util.Arrays;

public class VisaCheckoutCaptureRequestTransformer extends RequestTransformer {

  public VisaCheckoutCaptureRequestTransformer(CybersourceIds cybersourceIds) {
    super(Arrays.asList(
      new BaseFieldGroupTransformer(cybersourceIds),
      new CaptureServiceFieldGroupTransformer(),
      new VisaCheckoutFieldGroupTransformer(),
      new PurchaseTotalsFieldGroupTransformer()
    ));
  }

}
