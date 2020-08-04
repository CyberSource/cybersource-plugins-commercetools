package isv.commercetools.reference.application.config.model;

import org.springframework.context.annotation.Configuration;

@Configuration
public class CtClientDefinition {

    private String clientId;
    private String secret;

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getClientId() {
        return clientId;
    }

    public String getSecret() {
        return secret;
    }
}
