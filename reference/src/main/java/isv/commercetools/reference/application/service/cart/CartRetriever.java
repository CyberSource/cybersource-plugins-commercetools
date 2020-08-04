package isv.commercetools.reference.application.service.cart;

import io.sphere.sdk.carts.Cart;
import io.sphere.sdk.carts.CartState;
import io.sphere.sdk.carts.queries.CartQuery;
import io.sphere.sdk.carts.queries.CartQueryBuilder;
import io.sphere.sdk.client.SphereClient;
import io.sphere.sdk.payments.Payment;
import isv.commercetools.mapping.model.CustomPayment;
import isv.payments.exception.PaymentException;
import java.util.concurrent.ExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class CartRetriever {

    private static final Logger LOGGER = LoggerFactory.getLogger(CartRetriever.class);

    private final SphereClient paymentSphereClient;

    public CartRetriever(SphereClient paymentSphereClient) {
        this.paymentSphereClient = paymentSphereClient;
    }

    public Cart retrieveCart(CustomPayment payment) throws PaymentException {
        try {
            var cartQuery = cartQuery(payment.getBasePayment());
            var cartQueryResult = paymentSphereClient.execute(cartQuery).toCompletableFuture().get();
            var resultCount = cartQueryResult.getCount();
            if (resultCount == 0) {
                throw new PaymentException(String.format("Could not find cart for payment %s", payment.getId()));
            } else if (resultCount > 1) {
                throw new PaymentException(String.format("Found %s carts for payment %s", resultCount, payment.getId()));
            }
            return cartQueryResult.getResults().get(0);
        } catch (InterruptedException | ExecutionException e) {
            var message = String.format("Could not retrieve cart for payment %s", payment.getId());
            LOGGER.error(message, e);
            throw new PaymentException(message, e);
        }
    }

    private CartQuery cartQuery(Payment payment) {
        CartQueryBuilder cartQueryBuilder;
        var customer = payment.getCustomer();
        if (customer == null) {
            cartQueryBuilder = CartQueryBuilder.of().plusPredicates(cart -> cart.anonymousId().is(payment.getAnonymousId()));
        } else {
            cartQueryBuilder = CartQueryBuilder.of().plusPredicates(cart -> cart.customerId().is(customer.getId()));
        }

        return cartQueryBuilder
                .plusPredicates(cart -> cart.cartState().is(CartState.ACTIVE))
                .sort(cart -> cart.lastModifiedAt().sort().desc())
                .build();
    }
}
