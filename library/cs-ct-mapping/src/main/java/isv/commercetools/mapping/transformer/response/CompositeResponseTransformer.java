package isv.commercetools.mapping.transformer.response;

import static java.util.Arrays.asList;

import io.sphere.sdk.commands.UpdateAction;
import io.sphere.sdk.payments.Transaction;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CompositeResponseTransformer implements ResponseTransformer {

  private final List<ResponseTransformer> responseTransformers;

  public CompositeResponseTransformer(ResponseTransformer... responseTransformers) {
    this.responseTransformers = asList(responseTransformers);
  }

  @Override
  public List<UpdateAction> transform(Map<String, String> cybersourceResponse, Transaction authTransaction) {
    return responseTransformers.stream()
        .flatMap(rt -> rt.transform(cybersourceResponse, authTransaction).stream())
        .collect(Collectors.toList());
  }
}
