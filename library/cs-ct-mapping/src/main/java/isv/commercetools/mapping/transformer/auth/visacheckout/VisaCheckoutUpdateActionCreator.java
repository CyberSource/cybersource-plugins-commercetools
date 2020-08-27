package isv.commercetools.mapping.transformer.auth.visacheckout;

import static isv.commercetools.mapping.constants.PaymentCustomFieldConstants.CARD_EXPIRY_MONTH;
import static isv.commercetools.mapping.constants.PaymentCustomFieldConstants.CARD_EXPIRY_YEAR;
import static isv.commercetools.mapping.constants.PaymentCustomFieldConstants.CARD_TYPE;
import static isv.commercetools.mapping.constants.PaymentCustomFieldConstants.MASKED_CARD_NUMBER;

import io.sphere.sdk.carts.Cart;
import io.sphere.sdk.carts.commands.updateactions.SetBillingAddress;
import io.sphere.sdk.carts.commands.updateactions.SetShippingAddress;
import io.sphere.sdk.commands.UpdateAction;
import io.sphere.sdk.payments.Payment;
import io.sphere.sdk.payments.commands.updateactions.SetCustomField;
import isv.commercetools.mapping.transformer.response.CybersourceResponseAddressMapper;
import isv.payments.model.fields.BillToFieldGroup;
import isv.payments.model.fields.CardFieldGroup;
import isv.payments.model.fields.ShipToFieldGroup;
import isv.payments.model.fields.VisaCheckoutResponseFieldGroup;
import java.util.ArrayList;
import java.util.List;

/**
 * Creates the relevant UpdateActions for Commercetools after a successful Visa Checkout authorization.
 * The field groups provided should be built from a cybersource response to the 'getVisaCheckoutDataService'
 * service in Cybersource
 */
public class VisaCheckoutUpdateActionCreator {

    private final CybersourceResponseAddressMapper addressMapper;

    public VisaCheckoutUpdateActionCreator(CybersourceResponseAddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }

    public List<UpdateAction<Payment>> buildPaymentUpdateActions(CardFieldGroup cardFieldGroup, VisaCheckoutResponseFieldGroup visaCheckoutResponseFieldGroup) {
        List<UpdateAction<Payment>> result = new ArrayList<>();
        if (cardFieldGroup != null) {
            result.add(SetCustomField.ofObject(MASKED_CARD_NUMBER, cardFieldGroup.getPrefix() + "..." + cardFieldGroup.getSuffix()));
            result.add(SetCustomField.ofObject(CARD_EXPIRY_MONTH, cardFieldGroup.getExpirationMonth()));
            result.add(SetCustomField.ofObject(CARD_EXPIRY_YEAR, cardFieldGroup.getExpirationYear()));
        }
        if (visaCheckoutResponseFieldGroup != null) {
            result.add(SetCustomField.ofObject(CARD_TYPE, visaCheckoutResponseFieldGroup.getCardType()));
        }
        return result;
    }

    public List<UpdateAction<Cart>> buildShippingCartUpdateActions(ShipToFieldGroup shipToFieldGroup) {
        var actionList = new ArrayList<UpdateAction<Cart>>();

        var optionalAddress = addressMapper.mapAddress(shipToFieldGroup);
        optionalAddress.ifPresent(address -> actionList.add(SetShippingAddress.of(address)));

        return actionList;
    }

    public List<UpdateAction<Cart>> buildBillingCartUpdateActions(BillToFieldGroup billToFieldGroup) {
        var actionList = new ArrayList<UpdateAction<Cart>>();

        var optionalAddress = addressMapper.mapAddress(billToFieldGroup);
        optionalAddress.ifPresent(address -> actionList.add(SetBillingAddress.of(address)));

        return actionList;
    }

}
