package isv.commercetools.reference.application.helper

import io.sphere.sdk.client.SphereClient
import io.sphere.sdk.types.Type
import io.sphere.sdk.types.queries.TypeQuery
import org.springframework.stereotype.Component

@Component
class CommerceToolsHelper {

    List<Type> types

    CommerceToolsHelper(SphereClient paymentSphereClient) {
        types = paymentSphereClient.execute(TypeQuery.of()).toCompletableFuture().get().results
    }

    def typeIdForKey(String key) {
        types.find { it.key == key }.id
    }

    def getCustomFieldValue(Map responseBody, String name) {
        responseBody.actions.find { it.action == 'setCustomField' && it.name == name }.value
    }

}
