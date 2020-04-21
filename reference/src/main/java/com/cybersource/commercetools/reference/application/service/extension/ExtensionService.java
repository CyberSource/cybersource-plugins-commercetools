package com.cybersource.commercetools.reference.application.service.extension;

import com.cybersource.commercetools.api.extension.model.ExtensionOutput;
import com.cybersource.commercetools.mapping.model.CustomPayment;

/**
 * Defines the methods that an API Extension service should implement
 */
public interface ExtensionService {

    ExtensionOutput process(CustomPayment payment);
}
