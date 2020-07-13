package isv.commercetools.mapping.transformer.capture;

import isv.commercetools.mapping.model.CybersourceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.CaptureServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import java.util.Arrays;

public class CaptureRequestTransformer extends RequestTransformer {

  public CaptureRequestTransformer(CybersourceIds cybersourceIds) {
    super(Arrays.asList(
      new BaseFieldGroupTransformer(cybersourceIds),
      new CaptureServiceFieldGroupTransformer(),
      new PurchaseTotalsFieldGroupTransformer()
    ));
  }

}
