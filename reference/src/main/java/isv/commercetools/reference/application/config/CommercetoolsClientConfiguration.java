package isv.commercetools.reference.application.config;

import io.sphere.sdk.client.SphereClient;
import io.sphere.sdk.client.SphereClientConfig;
import io.sphere.sdk.client.SphereClientConfigBuilder;
import io.sphere.sdk.client.SphereClientFactory;
import isv.commercetools.mapping.types.TypeCachePopulator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CommercetoolsClientConfiguration {

    private final CtClientConfigurationProperties clientConfigurationProperties;

    public CommercetoolsClientConfiguration(CtClientConfigurationProperties clientConfigurationProperties) {
        this.clientConfigurationProperties = clientConfigurationProperties;
    }

    @Bean
    public SphereClient paymentSphereClient() {
        Optional<SphereClientConfig> sphereClientConfigOptional = clientConfigurationProperties.configBuilder("payment");

        if (sphereClientConfigOptional.isEmpty()) {
            throw new BeanCreationException("Payment client configuration is missing");
        }

        var newClientConfig = SphereClientConfigBuilder.ofClientConfig(sphereClientConfigOptional.get())
                .scopeStrings(List.of("view_types", "manage_orders"))
                .build();

        return SphereClientFactory.of().createClient(newClientConfig);
    }

    /**
     * The type cache caches the custom types that exist in commercetools, allowing us to do key-based lookups on custom types
     * like payment interface interactions. This process will run on bean creation.
     * @param paymentSphereClient The client to use to query types - must have the view_types scope
     * @return The TypeCachePopulator bean
     * @throws ExecutionException
     * @throws InterruptedException
     */
    @Bean
    public TypeCachePopulator typeCachePopulator(SphereClient paymentSphereClient) throws ExecutionException, InterruptedException {
        var typeCachePopulator = new TypeCachePopulator();
        typeCachePopulator.populateTypeCache(paymentSphereClient);
        return typeCachePopulator;

    }
}
