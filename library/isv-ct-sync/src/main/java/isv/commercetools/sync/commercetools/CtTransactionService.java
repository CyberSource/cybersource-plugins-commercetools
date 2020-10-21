package isv.commercetools.sync.commercetools;

import static isv.commercetools.sync.constants.IsvTransactionApplicationConstants.APPLICATION_NAME_DECISION;
import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toSet;

import Model.TssV2TransactionsGet200ResponseApplicationInformationApplications;
import Model.TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries;
import io.sphere.sdk.client.SphereClient;
import io.sphere.sdk.payments.Payment;
import io.sphere.sdk.payments.TransactionType;
import io.sphere.sdk.payments.commands.PaymentUpdateCommand;
import isv.commercetools.sync.constants.IsvTransactionApplicationConstants;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This service will add a reference to a payment service transaction onto a Commercetools payment by
 * creating a new transaction on the payment.
 */
public class CtTransactionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(CtTransactionService.class);

    private final AddTransactionMapper addTransactionMapper;
    private final SphereClient ctClient;
    private final TransactionTypeMapper transactionTypeMapper;
    private final List<String> mutableSynchronizableApplications;

    public CtTransactionService(AddTransactionMapper addTransactionMapper,
                                SphereClient ctClient,
                                TransactionTypeMapper transactionTypeMapper,
                                List<String> synchronizableApplications) {
        this.addTransactionMapper = addTransactionMapper;
        this.ctClient = ctClient;
        this.transactionTypeMapper = transactionTypeMapper;
        this.mutableSynchronizableApplications = new ArrayList<>();
        this.mutableSynchronizableApplications.addAll(synchronizableApplications);

        addDMSyncAppIfAuthExists(mutableSynchronizableApplications);
    }

    public void addCtTransactionFromIsvTransaction(
        TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries isvTransaction,
        Payment ctPayment,
        TssV2TransactionsGet200ResponseApplicationInformationApplications application
    ) {
        Optional<TransactionType> optionalTransactionType = transactionTypeMapper.mapTransactionType(application);
        if (optionalTransactionType.isEmpty()) {
            LOGGER.warn(String.format("Transaction type cannot be mapped for the application %s", application.getName() + "on the transaction %s", isvTransaction.getId()));
        } else {
            executeUpdate(isvTransaction, ctPayment, application, optionalTransactionType);
        }
    }

    private void executeUpdate(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries isvTransaction, Payment ctPayment, TssV2TransactionsGet200ResponseApplicationInformationApplications application, Optional<TransactionType> optionalTransactionType) {
        var addTransactionAction = addTransactionMapper.createAction(isvTransaction, application, optionalTransactionType.get());
        if (addTransactionAction.isEmpty()) {
            LOGGER.warn(String.format("Attempted to create an AddTransaction for CT Payment %s but mapper returned no action", ctPayment.getId()));
        } else {
            try {
                ctClient.execute(PaymentUpdateCommand.of(ctPayment, List.of(addTransactionAction.get()))).toCompletableFuture().get();
            } catch (InterruptedException | ExecutionException e) {
                LOGGER.error(String.format("Could not add transaction to payment with ID: %s", ctPayment.getId()), e);
            }
        }
    }

    public boolean canCreateCtTransaction(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries summary) {
        var applications = Optional.ofNullable(summary.getApplicationInformation().getApplications()).orElse(emptyList());
        Set<String> applicationNamesOnSummary = applications
                .stream()
                .map(TssV2TransactionsGet200ResponseApplicationInformationApplications::getName)
                .collect(toSet());

        return applicationNamesOnSummary.stream().anyMatch(mutableSynchronizableApplications::contains);
    }

    public boolean isvApplicationExistsOnPayment(
            Payment ctPayment,
            TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries isvTransaction,
            TssV2TransactionsGet200ResponseApplicationInformationApplications application
    ) {
        return ctPayment.getTransactions()
                .stream()
                .filter(it -> transactionTypeMapper.mapTransactionType(application).get().equals(it.getType()))
                .anyMatch(it -> isvTransaction.getId().equals(it.getInteractionId()));
    }

    public List<TssV2TransactionsGet200ResponseApplicationInformationApplications> retrieveSynchronizableApplicationsForTransaction(
            TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries summary) {
        List<TssV2TransactionsGet200ResponseApplicationInformationApplications> applications = summary
            .getApplicationInformation().getApplications().stream()
            .filter(application -> mutableSynchronizableApplications.stream().anyMatch(name -> name.equals(application.getName())))
            .collect(Collectors.toList());

        removeAuthIfCompletedDMAppExists(applications);

        return applications;
    }

    private void removeAuthIfCompletedDMAppExists(List<TssV2TransactionsGet200ResponseApplicationInformationApplications> applications) {
        Optional<TssV2TransactionsGet200ResponseApplicationInformationApplications> dmApp = applications
                .stream()
                .filter(application -> APPLICATION_NAME_DECISION.equals(application.getName()))
                .findFirst();

        if (dmApp.isPresent()) {
            if (dmApp.get().getReasonCode() == null) {
                applications.remove(dmApp.get());
            } else {
                applications.removeIf(application -> application.getName().equals(
                    IsvTransactionApplicationConstants.APPLICATION_NAME_AUTH));
            }
        }
    }

    private void addDMSyncAppIfAuthExists(List<String> synchronizableApplications) {
        if(synchronizableApplications.stream().noneMatch(
            APPLICATION_NAME_DECISION::equals)) {
            synchronizableApplications.add(
                APPLICATION_NAME_DECISION);
        }
    }
}
