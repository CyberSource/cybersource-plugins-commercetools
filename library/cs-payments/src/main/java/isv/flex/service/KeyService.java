package isv.flex.service;

import Api.KeyGenerationApi;
import Invokers.ApiClient;
import Invokers.ApiException;
import Model.GeneratePublicKeyRequest;

@SuppressWarnings("PMD.BeanMembersShouldSerialize")
public class KeyService {

    private static final String FLEX_ENCRYPTION_TYPE = "RsaOaep256";
    private static final String TOKEN_FORMAT = "JWT";

    private final ApiClient apiClient;
    private final String targetOrigins;

    public KeyService(ApiClient apiClient, String targetOrigins) {
        this.apiClient = apiClient;
        this.targetOrigins = targetOrigins;
    }

    public String generateKey() throws ApiException {
        var keyGenerationApi = keyGenerationApi(apiClient);

        var request = new GeneratePublicKeyRequest();
        request.encryptionType(FLEX_ENCRYPTION_TYPE);
        request.targetOrigin (targetOrigins);

        var response = keyGenerationApi.generatePublicKey(request, TOKEN_FORMAT);

        return response.getKeyId();
    }

    protected KeyGenerationApi keyGenerationApi(ApiClient apiClient) {
        return new KeyGenerationApi(apiClient);
    }

}
