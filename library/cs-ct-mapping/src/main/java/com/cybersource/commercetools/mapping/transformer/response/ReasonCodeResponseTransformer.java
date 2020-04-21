package com.cybersource.commercetools.mapping.transformer.response;

import com.cybersource.commercetools.mapping.constants.PaymentFailureDataConstants;
import com.cybersource.commercetools.mapping.transformer.transaction.StateTransformer;
import io.sphere.sdk.commands.UpdateAction;
import io.sphere.sdk.payments.Payment;
import io.sphere.sdk.payments.Transaction;
import io.sphere.sdk.payments.commands.updateactions.AddInterfaceInteraction;
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionInteractionId;
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionState;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static io.sphere.sdk.payments.TransactionState.*;

/**
 * Transforms Authorization responses from Cybersource into Commercetools API Extension UpdateActions.
 */
public class ReasonCodeResponseTransformer implements ResponseTransformer {

    @Override
    public List<UpdateAction> transform(Map<String, String> cybersourceResponse, Transaction authTransaction) {
        var reasonCode = cybersourceResponse.get("reasonCode");
        var interactionId = cybersourceResponse.get("requestID");

        var result = new ArrayList<UpdateAction>();
        var stateForReasonCode = StateTransformer.mapCSReasonCodeToCTTransactionState(reasonCode);
        Collections.addAll(
                result,
                ChangeTransactionInteractionId.of(interactionId, authTransaction.getId()),
                ChangeTransactionState.of(stateForReasonCode, authTransaction.getId())
        );
        if (FAILURE.equals(stateForReasonCode)) {
            result.add(createFailureInteraction(authTransaction.getId(), reasonCode));
        }
        return result;
    }

    private UpdateAction<Payment> createFailureInteraction(String transactionId, String reasonCode) {
        return AddInterfaceInteraction.ofTypeKeyAndObjects(
                PaymentFailureDataConstants.TYPE_KEY,
                Map.of(
                        PaymentFailureDataConstants.REASON_CODE, reasonCode,
                        PaymentFailureDataConstants.TRANSACTION_ID, transactionId
                )
        );
    }

}
