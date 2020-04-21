package com.cybersource.commercetools.mapping.transformer.auth.visacheckout;

import com.cybersource.commercetools.mapping.transformer.response.CybersourceResponseAddressMapper;
import com.cybersource.payments.model.fields.BillToFieldGroup;
import com.cybersource.payments.model.fields.CardFieldGroup;
import com.cybersource.payments.model.fields.ShipToFieldGroup;
import com.cybersource.payments.model.fields.VisaCheckoutResponseFieldGroup;
import io.sphere.sdk.carts.Cart;
import io.sphere.sdk.carts.commands.updateactions.SetBillingAddress;
import io.sphere.sdk.carts.commands.updateactions.SetShippingAddress;
import io.sphere.sdk.commands.UpdateAction;
import io.sphere.sdk.payments.Payment;
import io.sphere.sdk.payments.commands.updateactions.SetCustomField;

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
            result.add(SetCustomField.ofObject("cs_maskedPan", cardFieldGroup.getPrefix() + "..." + cardFieldGroup.getSuffix()));
            result.add(SetCustomField.ofObject("cs_cardExpiryMonth", cardFieldGroup.getExpirationMonth()));
            result.add(SetCustomField.ofObject("cs_cardExpiryYear", cardFieldGroup.getExpirationYear()));
        }
        if (visaCheckoutResponseFieldGroup != null) {
            result.add(SetCustomField.ofObject("cs_cardType", visaCheckoutResponseFieldGroup.getCardType()));
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
