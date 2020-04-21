package com.cybersource.commercetools.reference.application.validation.rules.service;

import com.cybersource.cardinal.service.CardinalService;
import com.cybersource.commercetools.api.extension.model.ExtensionError;
import com.cybersource.commercetools.api.extension.validation.InputValidator;
import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.cybersource.commercetools.mapping.model.interactions.EnrolmentData;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;

import java.util.ArrayList;
import java.util.List;

/**
 * Ensures that the required data to validate a Payer Auth Enrollment response exists and is correct.
 */
public class PayerAuthEnrolmentResponseDataValidationRule extends InputValidator<CustomPayment> {

    private final CardinalService cardinalService;

    public PayerAuthEnrolmentResponseDataValidationRule(ObjectMapper objectMapper, CardinalService cardinalService) {
        super(objectMapper);
        this.cardinalService = cardinalService;
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        var errors = new ArrayList<ExtensionError>();
        validateRequiredField(errors, payment.getEnrolmentData(), "enrolment data");

        if (errors.isEmpty()) {
            var authenticationRequired = payment.getEnrolmentData().getAuthenticationRequired();
            if (payment.getEnrolmentData().getAuthenticationRequired().isEmpty()) {
                errors.add(invalidOperationError("Payer authentication enrolment flag missing"));
            }

            if (authenticationRequired.isPresent() && authenticationRequired.get()) {
                validateRequiredField(errors, payment.getPayerAuthenticationResponseJwt(), "Payer authentication response JWT");
            }

            validateEnrolmentData(payment, errors);
            validateJWTs(payment, errors);
        }

        return errors;
    }

    private void validateEnrolmentData(CustomPayment payment, List<ExtensionError> errors) {
        var enrolmentData = payment.getEnrolmentData();
        if (enrolmentData.getRequestReferenceId().isEmpty()) {
            errors.add(invalidOperationError("Payer authentication enrolment request reference id missing"));
        }
        if (enrolmentData.getAuthenticationTransactionId().isEmpty() && !enrolmentTimedOut(enrolmentData)) {
            errors.add(invalidOperationError("Payer authentication enrolment authentication transaction id missing"));
        }
    }

    private boolean enrolmentTimedOut(EnrolmentData enrolmentData) {
        return
            enrolmentData.getAuthenticationTransactionId().isEmpty() &&
            enrolmentData.getProofXml().isPresent() &&
            enrolmentData.getCommerceIndicator().isPresent() &&
            (enrolmentData.getCommerceIndicator().get().equals("vbv_failure") || enrolmentData.getCommerceIndicator().get().equals("internet"));
    }

    private void validateJWTs(CustomPayment payment, List<ExtensionError> errors) {
        var requestReferenceIdOptional = payment.getEnrolmentData().getRequestReferenceId();

        var responseJwt = payment.getPayerAuthenticationResponseJwt();
        if (responseJwt != null && requestReferenceIdOptional.isPresent()) {
            try {
                var requestReferenceId = payment.getEnrolmentData().getRequestReferenceId().get();
                var responseReferenceId = cardinalService.validateJWTAndExtractReferenceId(responseJwt);

                if (!requestReferenceId.equals(responseReferenceId)) {
                    errors.add(invalidInputError("Reference id mismatch detected"));
                }
            } catch (ExpiredJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e) {
                errors.add(invalidInputError("Invalid response JWT"));
            }
        }
    }

}
