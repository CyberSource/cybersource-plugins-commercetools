package isv.commercetools.sync.payment;

import isv.commercetools.sync.DecisionManagerDecisionSynchronizer;
import isv.commercetools.sync.SynchronizationRunner;
import isv.commercetools.sync.cybersource.request.CsTransactionSearch;
import isv.commercetools.sync.cybersource.request.CsTransactionSearchImpl;
import org.joda.time.DateTime;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SyncSpringBootApplication implements CommandLineRunner {

  private final DecisionManagerDecisionSynchronizer decisionManagerDecisionSynchronizer;

  private final SynchronizationRunner runner;

  public SyncSpringBootApplication(DecisionManagerDecisionSynchronizer decisionManagerDecisionSynchronizer, SynchronizationRunner runner) {
    this.decisionManagerDecisionSynchronizer = decisionManagerDecisionSynchronizer;
    this.runner = runner;
  }

  public static void main(String[] args) {
    SpringApplication.run(SyncSpringBootApplication.class, args);
  }

  @Override
  public void run(String... args) {
    synchronizeTransactions();
    synchronizeDecisions();
  }

  private void synchronizeDecisions() {
    decisionManagerDecisionSynchronizer.synchronizeTransactions(
      DateTime.now().minusHours(23).minusMinutes(59), DateTime.now());
  }

  private void synchronizeTransactions() {
    CsTransactionSearch transactionSearch = new CsTransactionSearchImpl("submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}", "submitTimeUtc:desc", 50);
    runner.synchronize(transactionSearch);
  }
}
