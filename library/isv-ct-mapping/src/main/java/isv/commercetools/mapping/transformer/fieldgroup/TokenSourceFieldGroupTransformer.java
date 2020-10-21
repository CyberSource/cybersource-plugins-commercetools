package isv.commercetools.mapping.transformer.fieldgroup;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.TokenSourceFieldGroup;
import java.util.ArrayList;
import java.util.List;

/**
 * Configures TokenSourceFieldGroup for payment
 */
public class TokenSourceFieldGroupTransformer implements FieldGroupTransformer<TokenSourceFieldGroup> {

    @Override
    public List<TokenSourceFieldGroup> configure(PaymentDetails paymentDetails) {
        var fieldGroups = new ArrayList<TokenSourceFieldGroup>();
        var tokenJwt = paymentDetails.getCustomPayment().getToken();
        if (isNotBlank(tokenJwt)) {
            var fieldGroup = new TokenSourceFieldGroup();
            var tokenClaims = (Claims) Jwts.parser().parse(tokenJwt.substring(0, tokenJwt.lastIndexOf(".") + 1)).getBody();
            var token = (String) tokenClaims.get("jti");
            fieldGroup.setTransientToken(token);
            fieldGroups.add(fieldGroup);
        }
        return fieldGroups;
    }

}
