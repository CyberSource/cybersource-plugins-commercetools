package isv.commercetools.sync.commercetools;

import io.sphere.sdk.client.SphereClient;
import io.sphere.sdk.payments.Payment;
import io.sphere.sdk.payments.queries.PaymentByIdGet;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Service which simplifies searches of Commercetools payments using the Commercetools SDK.
 */
public class CtPaymentSearchService {

  private static final Logger LOGGER = LoggerFactory.getLogger(CtPaymentSearchService.class);

  private final SphereClient client;

  public CtPaymentSearchService(SphereClient client) {
    this.client = client;
  }

  public Optional<Payment> findPaymentByPaymentId(String paymentId) {
    Payment result = null;
    try {
      var queryCompletion = client.execute(PaymentByIdGet.of(paymentId));
      result = queryCompletion.toCompletableFuture().get();
    } catch (InterruptedException | ExecutionException e) {
      LOGGER.warn(String.format("Could not find payment with ID %s due to exception", paymentId), e);
    }
    return Optional.ofNullable(result);
  }
}
