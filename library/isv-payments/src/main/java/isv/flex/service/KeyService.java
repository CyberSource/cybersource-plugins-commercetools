package isv.flex.service;

import Api.KeyGenerationApi;
import Invokers.ApiClient;
import Invokers.ApiException;
import Model.GeneratePublicKeyRequest;
import com.cybersource.authsdk.core.ConfigException;
import com.cybersource.authsdk.core.MerchantConfig;
import isv.payments.exception.PaymentException;

import java.util.Properties;

@SuppressWarnings("PMD.BeanMembersShouldSerialize")
public class KeyService {

    private static final String FLEX_ENCRYPTION_TYPE = "RsaOaep256";
    private static final String TOKEN_FORMAT = "JWT";

    private final Properties paymentServiceProperties;
    private final String targetOrigins;
    private final int connectTimeout;

    public KeyService(Properties paymentServiceProperties, String targetOrigins, int connectTimeout) {
        this.paymentServiceProperties = paymentServiceProperties;
        this.targetOrigins = targetOrigins;
        this.connectTimeout = connectTimeout;
    }

    public String generateKey() throws PaymentException {
        try {
            var keyGenerationApi = keyGenerationApi();

            var request = new GeneratePublicKeyRequest();
            request.encryptionType(FLEX_ENCRYPTION_TYPE);
            request.targetOrigin (targetOrigins);

            var response = keyGenerationApi.generatePublicKey(request, TOKEN_FORMAT);

            return response.getKeyId();
        } catch (ConfigException | ApiException e) {
            throw new PaymentException(e);
        }
    }

    protected KeyGenerationApi keyGenerationApi() throws ConfigException {
        return new KeyGenerationApi(apiClient());
    }

    protected ApiClient apiClient() throws ConfigException {
        ApiClient apiClient = new ApiClient(new MerchantConfig(paymentServiceProperties));
        apiClient.setConnectTimeout(connectTimeout);
        return apiClient;
    }

}
