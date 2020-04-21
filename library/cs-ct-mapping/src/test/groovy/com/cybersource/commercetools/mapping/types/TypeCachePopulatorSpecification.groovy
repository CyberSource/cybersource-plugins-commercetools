package com.cybersource.commercetools.mapping.types

import io.sphere.sdk.client.SphereClient
import io.sphere.sdk.queries.PagedQueryResult
import io.sphere.sdk.types.Type
import io.sphere.sdk.types.queries.TypeQuery
import spock.lang.Specification

import java.util.concurrent.CompletableFuture
import java.util.concurrent.CompletionStage

class TypeCachePopulatorSpecification extends Specification {

    TypeCachePopulator testObj

    SphereClient sphereClientMock = Mock()
    CompletionStage<PagedQueryResult<Type>> typeQueryCompletionStageMock = Mock()
    CompletableFuture<PagedQueryResult<Type>> typeQueryCompletableFutureMock = Mock()
    PagedQueryResult<Type> typeQueryPagedResultMock = Mock()
    Type typeMock1 = Mock()
    Type typeMock2 = Mock()

    def setup() {
        testObj = new TypeCachePopulator()

        sphereClientMock.execute(TypeQuery.of()) >> typeQueryCompletionStageMock
        typeQueryCompletionStageMock.toCompletableFuture() >> typeQueryCompletableFutureMock
        typeQueryCompletableFutureMock.get() >> typeQueryPagedResultMock
        typeQueryPagedResultMock.results >> [typeMock1, typeMock2]

        typeMock1.id >> 'type 1 id'
        typeMock2.id >> 'type 2 id'
        typeMock1.key >> 'type 1 key'
        typeMock2.key >> 'type 2 key'
    }

    def "should query commercetools and populate type cache with results"() {
        when:
        testObj.populateTypeCache(sphereClientMock)

        then:
        TypeCache.idToKeyMap.size() == 2
    }

}
