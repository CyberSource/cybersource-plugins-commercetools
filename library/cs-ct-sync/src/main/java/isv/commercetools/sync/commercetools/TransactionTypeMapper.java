package isv.commercetools.sync.commercetools;

import Model.TssV2TransactionsGet200ResponseApplicationInformationApplications;
import io.sphere.sdk.payments.TransactionType;
import isv.commercetools.sync.constants.CsTransactionApplicationConstants;
import java.util.Optional;

public class TransactionTypeMapper {

    public Optional<TransactionType> mapTransactionType(TssV2TransactionsGet200ResponseApplicationInformationApplications application) {
        String applicationName = application.getName() == null ? "UNKNOWN" : application.getName();
        Optional<TransactionType> result;
        switch (applicationName) {
            case CsTransactionApplicationConstants.APPLICATION_NAME_AUTH:
            case CsTransactionApplicationConstants.APPLICATION_NAME_DECISION:
                result = Optional.of(TransactionType.AUTHORIZATION);
                break;
            case CsTransactionApplicationConstants.APPLICATION_NAME_CAPTURE:
                result = Optional.of(TransactionType.CHARGE);
                break;
            case CsTransactionApplicationConstants.APPLICATION_NAME_AUTH_REVERSAL:
                result = Optional.of(TransactionType.CANCEL_AUTHORIZATION);
                break;
            case CsTransactionApplicationConstants.APPLICATION_NAME_CREDIT:
                result = Optional.of(TransactionType.REFUND);
                break;
            default:
                result = Optional.empty();
                break;
        }
        return result;
    }
}

