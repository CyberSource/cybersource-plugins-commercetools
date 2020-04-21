package com.cybersource.commercetools.mapping.transformer.payerauth;

import com.cybersource.commercetools.mapping.constants.EnrolmentValidateDataConstants;
import com.cybersource.commercetools.mapping.util.MapUtil;
import io.sphere.sdk.commands.UpdateAction;
import io.sphere.sdk.payments.commands.updateactions.AddInterfaceInteraction;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Transforms Payer Authentication Validation responses from Cybersource into Commercetools API Extension UpdateActions.
 */
public class PayerAuthValidateResponseTransformer {

    private final String prefix;
    private final boolean includeInteractionWhenAuthResultMissing;

    public PayerAuthValidateResponseTransformer(String prefix, boolean includeInteractionWhenAuthResultMissing) {
        this.prefix = prefix;
        this.includeInteractionWhenAuthResultMissing = includeInteractionWhenAuthResultMissing;
    }

    public List<UpdateAction> transform(Map<String, String> cybersourceResponse) {
        var actions = new ArrayList<UpdateAction>();

        var responseValuesMatchingPrefix = findMatchesAndStripPrefix(cybersourceResponse);
        var interactionFieldValues = extractInteractionFieldValues(responseValuesMatchingPrefix);

        if (! interactionFieldValues.isEmpty()) {
            actions.add(AddInterfaceInteraction.ofTypeKeyAndObjects(EnrolmentValidateDataConstants.TYPE_KEY, interactionFieldValues));
        }

        return actions;
    }

    private Map<String, Object> extractInteractionFieldValues(Map<String,String> responseValuesMatchingPrefix) {
        Map<String,Object> interactionFieldValues = new HashMap<>();
        if (
                includeInteractionWhenAuthResultMissing ||
                        StringUtils.isNotBlank(responseValuesMatchingPrefix.get(EnrolmentValidateDataConstants.AUTHENTICATION_RESULT))
        ) {
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.AUTHENTICATION_RESULT, responseValuesMatchingPrefix.get("authenticationResult"));
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.AUTHENTICATION_STATUS_MESSAGE, responseValuesMatchingPrefix.get("authenticationStatusMessage"));
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.DIRECTORY_SERVER_TRANSACTION_ID, responseValuesMatchingPrefix.get("directoryServerTransactionID"));
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.CAVV, responseValuesMatchingPrefix.get("cavv"));
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.CAVV_ALGORITHM, responseValuesMatchingPrefix.get("cavvAlgorithm"));
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.UCAF_AUTHENTICATION_DATA, responseValuesMatchingPrefix.get("ucafAuthenticationData"));
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.UCAF_COLLECTION_INDICATOR, responseValuesMatchingPrefix.get("ucafCollectionIndicator"));
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.XID, responseValuesMatchingPrefix.get("xid"));
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.SPECIFICATION_VERSION, responseValuesMatchingPrefix.get("specificationVersion"));
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.ECI, responseValuesMatchingPrefix.get("eci"));
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.ECI_RAW, responseValuesMatchingPrefix.get("eciRaw"));
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.PARES_STATUS, responseValuesMatchingPrefix.get("paresStatus"));
            MapUtil.putIfNotNull(interactionFieldValues, EnrolmentValidateDataConstants.COMMERCE_INDICATOR, responseValuesMatchingPrefix.get("commerceIndicator"));
        }
        return interactionFieldValues;
    }

    private Map<String, String> findMatchesAndStripPrefix(Map<String, String> cybersourceResponse) {
        return cybersourceResponse.entrySet().stream()
                .filter(e -> e.getKey().startsWith(prefix))
                .collect(Collectors.toMap(e -> e.getKey().replace(prefix, ""), e -> e.getValue()));
    }

}
