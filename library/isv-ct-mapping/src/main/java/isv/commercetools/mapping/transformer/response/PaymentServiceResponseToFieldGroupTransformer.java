package isv.commercetools.mapping.transformer.response;

import static java.util.stream.Collectors.toMap;

import com.fasterxml.jackson.databind.ObjectMapper;
import isv.commercetools.mapping.exception.MappingException;
import isv.payments.model.fields.RequestServiceFieldGroup;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;

/**
 * Used to transform payment service map-based responses into FieldGroup objects
 */
public class PaymentServiceResponseToFieldGroupTransformer {

    private final ObjectMapper objectMapper;

    public PaymentServiceResponseToFieldGroupTransformer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Transforms a payment service response into a FieldGroup specified by the 'type' parameter. Optionally filters fields
     * based on prefix before attempting to map the fields to a FieldGroup object.
     * @param response A map response from payment service
     * @param prefix The prefix to filter on. If provided, only fields that start with this will be mapped onto the resulting object.
     * @param type A specific type of RequestServiceFieldGroup. Must be a subclass of RequestServiceFieldGroup or a MappingException will be thrown.
     * @return The requested type of FieldGroup
     */
    public RequestServiceFieldGroup transform(Map<String, Object> response, String prefix, Class type) {
        if (RequestServiceFieldGroup.class.isAssignableFrom(type)) {

            var prefixStrippedResponseValues = response.entrySet().stream()
                    .filter(entry -> entry.getKey().startsWith(prefix))
                    .collect(toMap(
                            entry -> entry.getKey().replaceFirst(prefix, StringUtils.EMPTY),
                            Map.Entry::getValue
                            ));

            return (RequestServiceFieldGroup) objectMapper.convertValue(prefixStrippedResponseValues, type);
        } else {
            throw new MappingException("PaymentServiceResponseToFieldGroupTransformer attempted to transform " +
                    "to a class which does not implement RequestServiceFieldGroup");
        }
    }

}
