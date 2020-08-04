package isv.commercetools.reference.application.validation;

import com.google.gson.Gson;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.RSAKey;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import isv.commercetools.mapping.model.CustomPayment;
import java.security.Key;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FlexTokenVerifier {

    private static final Logger LOGGER = LoggerFactory.getLogger(FlexTokenVerifier.class);

    private final Key verificationKey;

    public FlexTokenVerifier(@Value("${cybersource.flex.verificationKey}") byte[] verificationKey) {
        this.verificationKey = Keys.hmacShaKeyFor(verificationKey);
    }

    @SuppressWarnings("PMD.AvoidCatchingGenericException")
    public boolean verifyToken(CustomPayment payment) {
        boolean valid = false;
        try {
            var parsedVerificationContext = Jwts.parserBuilder().setSigningKey(verificationKey).build().parse(payment.getTokenVerificationContext());
            var verificationClaims = (Claims) parsedVerificationContext.getBody();
            var flexClaims = (Map) verificationClaims.get("flx");
            var jwk = (RSAKey) JWK.parse(new Gson().toJson(flexClaims.get("jwk")));
            var parsedToken = Jwts.parserBuilder().setSigningKey(jwk.toRSAPublicKey()).build().parse(payment.getToken());
            valid = ((Map) parsedToken.getBody()).get("jti") != null;
        } catch (Exception e) {
            LOGGER.warn("Verification of token failed.", e);
        }
        return valid;
    }

    public String createVerificationContext(String captureContext){
        var contextWithoutSignature = captureContext.substring(0, captureContext.lastIndexOf('.') + 1);
        var parsedContext = Jwts.parserBuilder().build().parse(contextWithoutSignature);
        var claims = (Claims) parsedContext.getBody();

        return Jwts.builder().setClaims(claims).signWith(verificationKey).compact();

    }
}
