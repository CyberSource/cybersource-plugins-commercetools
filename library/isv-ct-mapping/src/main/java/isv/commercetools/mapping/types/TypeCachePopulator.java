package isv.commercetools.mapping.types;

import io.sphere.sdk.client.SphereClient;
import io.sphere.sdk.types.queries.TypeQuery;
import java.util.concurrent.ExecutionException;

public class TypeCachePopulator {

    public void populateTypeCache(SphereClient sphereClient) throws ExecutionException, InterruptedException {
        var typePagedQueryResult = sphereClient.execute(TypeQuery.of()).toCompletableFuture().get();
        TypeCache.populate(typePagedQueryResult.getResults());
    }

}
