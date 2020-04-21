package com.cybersource.commercetools.sync.commercetools;

import Model.Ptsv2paymentsidreversalsReversalInformationAmountDetails;
import Model.TssV2TransactionsGet200ResponseApplicationInformationApplications;
import Model.TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries;
import com.cybersource.commercetools.mapping.transformer.transaction.StateTransformer;
import io.sphere.sdk.payments.TransactionDraftBuilder;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;
import io.sphere.sdk.payments.commands.updateactions.AddTransaction;
import org.javamoney.moneta.Money;

import javax.money.Monetary;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Optional;

/**
 * Handles the mapping from a Cybersource transaction to a Commercetools AddTransaction action. If the Cybersource transaction cannot be mapped
 * to a Commercetools transaction, an empty Optional will be returned.
 */
public class AddTransactionMapper {

  public Optional<AddTransaction> createAction(
    TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries summary,
    TssV2TransactionsGet200ResponseApplicationInformationApplications application,
    TransactionType transactionType
  ) {
    var transactionDraft = TransactionDraftBuilder.of(
      transactionType,
      mapTotalAmount(summary));

    return Optional.of(AddTransaction.of(transactionDraft
      .interactionId(summary.getId())
      .state(mapState(application))
      .timestamp(mapTimestamp(summary))
      .build()
    ));
  }

  private ZonedDateTime mapTimestamp(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries summary) {
    return ZonedDateTime.parse(summary.getSubmitTimeUtc());
  }

  private Money mapTotalAmount(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries summary) {
    final Ptsv2paymentsidreversalsReversalInformationAmountDetails amountDetails = summary.getOrderInformation().getAmountDetails();
    return Money.of(new BigDecimal(amountDetails.getTotalAmount()), Monetary.getCurrency(amountDetails.getCurrency()));
  }

  private TransactionState mapState(TssV2TransactionsGet200ResponseApplicationInformationApplications application) {
    return StateTransformer.mapCSReasonCodeToCTTransactionState(application.getReasonCode());
  }
}
