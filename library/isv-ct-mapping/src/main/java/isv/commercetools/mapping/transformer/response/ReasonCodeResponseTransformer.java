package isv.commercetools.mapping.transformer.response;

import static io.sphere.sdk.payments.TransactionState.FAILURE;

import io.sphere.sdk.commands.UpdateAction;
import io.sphere.sdk.payments.Payment;
import io.sphere.sdk.payments.Transaction;
import io.sphere.sdk.payments.commands.updateactions.AddInterfaceInteraction;
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionInteractionId;
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionState;
import isv.commercetools.mapping.constants.PaymentFailureDataConstants;
import isv.commercetools.mapping.transformer.transaction.StateTransformer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Transforms Authorization responses from payment service into Commercetools API Extension UpdateActions.
 */
public class ReasonCodeResponseTransformer implements ResponseTransformer {

    @Override
    public List<UpdateAction> transform(Map<String, String> paymentServiceResponse, Transaction authTransaction) {
        var reasonCode = paymentServiceResponse.get("reasonCode");
        var interactionId = paymentServiceResponse.get("requestID");

        var result = new ArrayList<UpdateAction>();
        var stateForReasonCode = StateTransformer.mapISVReasonCodeToCTTransactionState(reasonCode);
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
