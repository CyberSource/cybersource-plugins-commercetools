package isv.commercetools.reference.application.service.extension;

import isv.commercetools.api.extension.model.ExtensionOutput;
import isv.commercetools.mapping.model.CustomPayment;

/**
 * Defines the methods that an API Extension service should implement
 */
public interface ExtensionService {

    ExtensionOutput process(CustomPayment payment);
}
