package isv.commercetools.mapping.transformer.response;

import io.sphere.sdk.commands.UpdateAction;
import io.sphere.sdk.payments.Transaction;
import io.sphere.sdk.payments.commands.updateactions.SetCustomField;
import isv.commercetools.mapping.constants.PaymentCustomFieldConstants;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Transforms subscription creation responses from Cybersource into Commercetools API Extension UpdateActions.
 */
public class SubscriptionCreateResponseTransformer implements ResponseTransformer {

    @Override
    public List<UpdateAction> transform(Map<String, String> cybersourceResponse, Transaction authTransaction) {
        var result = new ArrayList<UpdateAction>();

        var savedToken = cybersourceResponse.get("paySubscriptionCreateReply_subscriptionID");
        if (savedToken != null) {
            result.add(SetCustomField.ofObject(PaymentCustomFieldConstants.SAVED_TOKEN, savedToken));
        }

        return result;
    }

}
