package com.cybersource.commercetools.mapping.transformer.transaction;

import static io.sphere.sdk.payments.TransactionState.FAILURE;
import static io.sphere.sdk.payments.TransactionState.PENDING;
import static io.sphere.sdk.payments.TransactionState.SUCCESS;

import io.sphere.sdk.payments.TransactionState;

public class StateTransformer {

  private static final String ACCEPTED_REASON_CODE = "100";
  private static final String REVIEW_REASON_CODE = "480";

  public static TransactionState mapCSReasonCodeToCTTransactionState(String reasonCode) {
    TransactionState state;

    switch (reasonCode) {
      case ACCEPTED_REASON_CODE:
        state = SUCCESS;
        break;
      case REVIEW_REASON_CODE:
        state = PENDING;
        break;
      default:
        state = FAILURE;
        break;
    }

    return state;
  }

}
