package isv.commercetools.mapping.transformer.response;

import io.sphere.sdk.commands.UpdateAction;
import io.sphere.sdk.payments.Transaction;
import java.util.List;
import java.util.Map;

public interface ResponseTransformer {

  List<UpdateAction> transform(Map<String, String> cybersourceResponse, Transaction authTransaction);

}
