package isv.commercetools.reference.application.service.payment.visacheckout;

import io.sphere.sdk.carts.Cart;
import io.sphere.sdk.carts.commands.CartUpdateCommand;
import io.sphere.sdk.client.SphereClient;
import io.sphere.sdk.commands.UpdateAction;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.model.PaymentDetails;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.auth.visacheckout.VisaCheckoutUpdateActionCreator;
import isv.commercetools.mapping.transformer.response.CybersourceResponseToFieldGroupTransformer;
import isv.commercetools.mapping.transformer.response.ResponseTransformer;
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import isv.commercetools.reference.application.service.payment.PaymentAuthorizationService;
import isv.commercetools.reference.application.validation.ResourceValidator;
import isv.payments.CybersourceClient;
import isv.payments.exception.PaymentException;
import isv.payments.model.fields.BillToFieldGroup;
import isv.payments.model.fields.CardFieldGroup;
import isv.payments.model.fields.ShipToFieldGroup;
import isv.payments.model.fields.VisaCheckoutResponseFieldGroup;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

/**
 * Processes authorizations for Visa Checkout and synchronizes the cart and payment information with the data from
 * Visa Checkout after a successful authorization.
 */
@Slf4j
public class VisaCheckoutAuthorizationService extends PaymentAuthorizationService {

    private final SphereClient paymentSphereClient;
    private final VisaCheckoutQueryService visaCheckoutQueryService;
    private final VisaCheckoutUpdateActionCreator updateActionCreator;
    private final CybersourceResponseToFieldGroupTransformer responseFieldGroupTransformer;

    public VisaCheckoutAuthorizationService(
            PaymentDetailsFactory paymentDetailsFactory,
            ResourceValidator<CustomPayment> paymentValidator,
            ResourceValidator<Cart> cartValidator,
            RequestTransformer authorizationRequestTransformer,
            ResponseTransformer responseTransformer,
            CybersourceClient cybersourceClient,
            SphereClient paymentSphereClient,
            VisaCheckoutQueryService visaCheckoutQueryService,
            VisaCheckoutUpdateActionCreator updateActionCreator,
            CybersourceResponseToFieldGroupTransformer responseFieldGroupTransformer
    ) {
        super(paymentDetailsFactory, paymentValidator, cartValidator, authorizationRequestTransformer, responseTransformer, cybersourceClient);
        this.paymentSphereClient = paymentSphereClient;
        this.visaCheckoutQueryService = visaCheckoutQueryService;
        this.updateActionCreator = updateActionCreator;
        this.responseFieldGroupTransformer = responseFieldGroupTransformer;
    }

    protected List<UpdateAction> superProcess(PaymentDetails paymentDetails) {
        return super.process(paymentDetails);
    }

    @Override
    public List<UpdateAction> process(PaymentDetails paymentDetails) {
        var result = this.superProcess(paymentDetails);
            try {
                var visaCheckoutInfo = visaCheckoutQueryService.getVisaCheckoutData(paymentDetails);

                var billToFieldGroup = (BillToFieldGroup) responseFieldGroupTransformer.transform(visaCheckoutInfo, "billTo_", BillToFieldGroup.class);
                var shipToFieldGroup = (ShipToFieldGroup) responseFieldGroupTransformer.transform(visaCheckoutInfo, "shipTo_", ShipToFieldGroup.class);
                var cardFieldGroup =  (CardFieldGroup) responseFieldGroupTransformer.transform(visaCheckoutInfo, "card_", CardFieldGroup.class);
                var visaCheckoutFieldGroup =  (VisaCheckoutResponseFieldGroup) responseFieldGroupTransformer.transform(visaCheckoutInfo, "vcReply_", VisaCheckoutResponseFieldGroup.class);

                updateCart(paymentDetails.getCart(), shipToFieldGroup, billToFieldGroup);
                result.addAll(updateActionCreator.buildPaymentUpdateActions(cardFieldGroup, visaCheckoutFieldGroup));
            } catch (PaymentException e) {
                log.error("Could not process Visa Checkout address and card information after authorization", e);
            }
        return result;
    }

    private void updateCart(Cart cart, ShipToFieldGroup shipToFieldGroup, BillToFieldGroup billToFieldGroup) {
        var updateActions = new ArrayList<UpdateAction<Cart>>();
        if (shipToFieldGroup != null) {
            log.debug("Updating shipping address on cart");
            updateActions.addAll(updateActionCreator.buildShippingCartUpdateActions(shipToFieldGroup));
        }
        if (billToFieldGroup != null) {
            log.debug("Updating billing address on cart");
            updateActions.addAll(updateActionCreator.buildBillingCartUpdateActions(billToFieldGroup));
        }

        paymentSphereClient.execute(CartUpdateCommand.of(cart, updateActions))
                .whenCompleteAsync((updatedCart, ex) -> logCartUpdateResult(cart, updateActions, ex));
    }

    private void logCartUpdateResult(Cart cart, List<UpdateAction<Cart>> updateActions, Throwable thrownException) {
        if (thrownException == null) {
            if (log.isDebugEnabled()) {
                String actionList = updateActions.stream().map(UpdateAction::getAction).collect(Collectors.joining(","));
                log.debug(String.format("Cart %s updated with actions: %s", cart.getId(), actionList));
            }
        } else {
            log.error(String.format("Could not update cart %s with address information", cart.getId()), thrownException);
        }
    }
}
