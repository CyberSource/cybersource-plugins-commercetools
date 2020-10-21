package isv.commercetools.mapping.transformer;

import isv.commercetools.mapping.model.PaymentDetails;
import isv.commercetools.mapping.transformer.fieldgroup.FieldGroupTransformer;
import isv.payments.model.PaymentServiceRequest;
import isv.payments.model.fields.RequestServiceFieldGroup;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Base class for transforming commercetools payments to payment service requests
 */
public class RequestTransformer {

    protected final List<FieldGroupTransformer> fieldGroupTransformers;

    public RequestTransformer(List<FieldGroupTransformer> fieldGroupTransformers) {
        this.fieldGroupTransformers = fieldGroupTransformers;
    }

    public PaymentServiceRequest transform(PaymentDetails paymentDetails) {
        return new PaymentServiceRequest(configureFieldGroups(paymentDetails));
    }

    protected List<RequestServiceFieldGroup> configureFieldGroups(PaymentDetails paymentDetails) {
        return fieldGroupTransformers.stream()
                .flatMap(t -> (Stream<RequestServiceFieldGroup>) t.configure(paymentDetails).stream())
                .collect(Collectors.toList());
    }

}
