package isv.commercetools.sync.payment.config;

import Invokers.ApiClient;
import com.cybersource.authsdk.core.ConfigException;
import com.cybersource.authsdk.core.MerchantConfig;
import io.sphere.sdk.client.SphereClient;
import io.sphere.sdk.client.SphereClientConfigBuilder;
import io.sphere.sdk.client.SphereClientFactory;
import isv.commercetools.sync.DecisionManagerDecisionSynchronizer;
import isv.commercetools.sync.SynchronizationRunner;
import isv.commercetools.sync.TransactionSynchronizer;
import isv.commercetools.sync.commercetools.AddTransactionMapper;
import isv.commercetools.sync.commercetools.CtPaymentSearchService;
import isv.commercetools.sync.commercetools.CtTransactionService;
import isv.commercetools.sync.commercetools.TransactionTypeMapper;
import isv.commercetools.sync.cybersource.CsTransactionSearchService;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import org.springframework.beans.BeanInstantiationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfiguration {

  @Value("${cybersource.client.merchantID}")
  private String merchantId;

  @Bean
  public SynchronizationRunner syncRunner(
      SphereClient sphereClient, ApiClient cybersourceTransactionClient,
      ApiClient cybersourceConversionClient) throws ConfigException {
    var addTransactionMapper = new AddTransactionMapper();
    var transactionTypeMapper = new TransactionTypeMapper();
    var synchronizableApplications = Arrays
        .asList("ics_auth", "ics_bill", "ics_auth_reversal", "ics_credit");
    var ctAddTransactionService = new CtTransactionService(addTransactionMapper, sphereClient,
        transactionTypeMapper, synchronizableApplications);
    var ctPaymentSearchService = new CtPaymentSearchService(sphereClient);
    var csTransactionSearchService = new CsTransactionSearchService(cybersourceTransactionClient,
        cybersourceConversionClient);
    var transactionSynchronizer = new TransactionSynchronizer(ctPaymentSearchService,
        ctAddTransactionService);
    return new SynchronizationRunner(csTransactionSearchService, transactionSynchronizer);
  }

  @Bean
  public DecisionManagerDecisionSynchronizer decisionManagerDecisionSynchronizer(
      SphereClient sphereClient, ApiClient cybersourceTransactionClient,
      ApiClient cybersourceConversionClient) throws ConfigException {
    var ctPaymentSearchService = new CtPaymentSearchService(sphereClient);
    var csTransactionSearchService = new CsTransactionSearchService(cybersourceTransactionClient,
        cybersourceConversionClient);
    return new DecisionManagerDecisionSynchronizer(csTransactionSearchService, sphereClient,
        ctPaymentSearchService, merchantId);
  }

  @Bean
  public SphereClient paymentSphereClient(CtClientConfigurationProperties clientProperties) {
    var clientConfig = SphereClientConfigBuilder.ofClientConfig(clientProperties.configBuilder())
        .scopeStrings(List.of("manage_payments"))
        .build();
    return SphereClientFactory.of().createClient(clientConfig);
  }

  @Bean
  public ApiClient cybersourceClient(CsClientConfigurationProperties appConfig)
      throws ConfigException {
    Map csConfig = appConfig.getClient();
    if (csConfig.isEmpty()) {
      throw new BeanInstantiationException(Properties.class,
          "No Cybersource client configuration provided");
    }
    Properties properties = new Properties();
    properties.putAll(csConfig);

    return new ApiClient(new MerchantConfig(properties));
  }
}



