package com.cybersource.commercetools.mapping.fieldgroup;

import com.cybersource.payments.model.fields.PayerAuthEnrollServiceFieldGroup;
import com.cybersource.cardinal.service.CardinalService;
import com.cybersource.commercetools.mapping.model.PaymentDetails;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.FieldGroupTransformer;

import java.util.List;

/**
 * Populates PayerAuthEnrollServiceFieldGroup from payment for transaction mode
 */
public final class PayerAuthEnrollServiceFieldGroupTransformer implements FieldGroupTransformer<PayerAuthEnrollServiceFieldGroup> {

    private static final String TRANSACTION_MODE_MAIL_OR_PHONE = "M";
    private static final String TRANSACTION_MODE_RETAIL = "R";
    private static final String TRANSACTION_MODE_ECOMMERCE = "S";
    private static final String TRANSACTION_MODE_MOBILE = "P";
    private static final String TRANSACTION_MODE_TABLET = "T";

    private final CardinalService cardinalService;
    private final String transactionMode;

    private PayerAuthEnrollServiceFieldGroupTransformer(CardinalService cardinalService, String transactionMode) {
        super();
        this.cardinalService = cardinalService;
        this.transactionMode = transactionMode;
    }

    public static PayerAuthEnrollServiceFieldGroupTransformer forMotoOrder(CardinalService cardinalService) {
        return new PayerAuthEnrollServiceFieldGroupTransformer(cardinalService, TRANSACTION_MODE_MAIL_OR_PHONE);
    }

    public static PayerAuthEnrollServiceFieldGroupTransformer forRetailOrder(CardinalService cardinalService) {
        return new PayerAuthEnrollServiceFieldGroupTransformer(cardinalService, TRANSACTION_MODE_RETAIL);
    }

    public static PayerAuthEnrollServiceFieldGroupTransformer forECommerceOrder(CardinalService cardinalService) {
        return new PayerAuthEnrollServiceFieldGroupTransformer(cardinalService, TRANSACTION_MODE_ECOMMERCE);
    }

    public static PayerAuthEnrollServiceFieldGroupTransformer forMobileOrder(CardinalService cardinalService) {
        return new PayerAuthEnrollServiceFieldGroupTransformer(cardinalService, TRANSACTION_MODE_MOBILE);
    }

    public static PayerAuthEnrollServiceFieldGroupTransformer forTabletOrder(CardinalService cardinalService) {
        return new PayerAuthEnrollServiceFieldGroupTransformer(cardinalService, TRANSACTION_MODE_TABLET);
    }

    @Override
    public List<PayerAuthEnrollServiceFieldGroup> configure(PaymentDetails paymentDetails) {
        var payment = paymentDetails.getCustomPayment();
        var enrollServiceFieldGroup = new PayerAuthEnrollServiceFieldGroup();
        enrollServiceFieldGroup.setRun(true);
        var referenceId = cardinalService.validateJWTAndExtractReferenceId(payment.getPayerAuthenticationRequestJwt());
        enrollServiceFieldGroup.setReferenceID(referenceId);
        enrollServiceFieldGroup.setHttpAccept(payment.getPayerAuthenticationAcceptHeader());
        enrollServiceFieldGroup.setHttpUserAgent(payment.getPayerAuthenticationUserAgentHeader());
        enrollServiceFieldGroup.setTransactionMode(transactionMode);
        return List.of(enrollServiceFieldGroup);
    }

}
