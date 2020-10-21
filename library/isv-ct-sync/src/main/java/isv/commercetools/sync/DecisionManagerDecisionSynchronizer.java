package isv.commercetools.sync;

import static io.sphere.sdk.payments.TransactionState.PENDING;
import static io.sphere.sdk.payments.TransactionType.AUTHORIZATION;

import Model.ReportingV3ConversionDetailsGet200Response;
import Model.ReportingV3ConversionDetailsGet200ResponseConversionDetails;
import io.sphere.sdk.client.SphereClient;
import io.sphere.sdk.payments.Payment;
import io.sphere.sdk.payments.Transaction;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.commands.PaymentUpdateCommand;
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionState;
import isv.commercetools.sync.commercetools.CtPaymentSearchService;
import isv.commercetools.sync.isv.IsvTransactionSearchService;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DecisionManagerDecisionSynchronizer {

  private static final Logger LOGGER = LoggerFactory.getLogger(DecisionManagerDecisionSynchronizer.class);
  private final IsvTransactionSearchService isvTransactionSearchService;
  private final SphereClient ctClient;
  private final CtPaymentSearchService ctPaymentSearchService;
  private final String merchantId;

  public DecisionManagerDecisionSynchronizer(
    IsvTransactionSearchService isvTransactionSearchService,
    SphereClient ctClient,
    CtPaymentSearchService ctPaymentSearchService,
    String merchantId
  ) {
    this.isvTransactionSearchService = isvTransactionSearchService;
    this.ctClient = ctClient;
    this.ctPaymentSearchService = ctPaymentSearchService;
    this.merchantId = merchantId;
  }

  public void synchronizeTransactions(DateTime startTime, DateTime endTime) {
    ReportingV3ConversionDetailsGet200Response getReportingV3ConversionDetailsResponse = isvTransactionSearchService.conversionDetailsGet200Response(startTime, endTime, merchantId);
    if (getReportingV3ConversionDetailsResponse != null && getReportingV3ConversionDetailsResponse.getConversionDetails() != null) {
      getReportingV3ConversionDetailsResponse.getConversionDetails().forEach(this::synchronizeConversion);
    }
  }

  private void synchronizeConversion(ReportingV3ConversionDetailsGet200ResponseConversionDetails conversion) {
    Optional<Payment> optionalPayment = getPaymentForConversion(conversion);

    if (optionalPayment.isPresent()) {
      var payment = optionalPayment.get();
      if (conversion.getNewDecision().equals("ACCEPT")) {
        updatePayment(payment, TransactionState.SUCCESS);
      } else if (conversion.getNewDecision().equals("REJECT")) {
        updatePayment(payment, TransactionState.FAILURE);
      }
    }
  }

  private Optional<Transaction> getPendingAuth(Payment payment) {
    return payment.getTransactions().stream().filter(t ->
      PENDING.equals(t.getState()) &&
        AUTHORIZATION.equals(t.getType())
    ).findFirst();
  }

  private Optional<Payment> getPaymentForConversion(ReportingV3ConversionDetailsGet200ResponseConversionDetails conversion) {
    var merchantRefNumber = conversion.getMerchantReferenceNumber();
    return ctPaymentSearchService.findPaymentByPaymentId(merchantRefNumber);
  }

  private void updatePayment(Payment payment, TransactionState transactionState) {
    Optional<Transaction> optionalPendingTransaction = getPendingAuth(payment);
    if (optionalPendingTransaction.isPresent()) {
      try {
        ctClient.execute(PaymentUpdateCommand.of(payment, ChangeTransactionState.of(
          transactionState, optionalPendingTransaction.get().getId()))).toCompletableFuture().get();
      } catch (InterruptedException | ExecutionException e) {
        LOGGER.warn(String.format("Could not update payment with ID %s due to exception", payment.getId()), e);
      }
    }
  }
}
