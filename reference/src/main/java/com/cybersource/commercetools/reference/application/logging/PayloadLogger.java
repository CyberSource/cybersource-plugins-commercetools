package com.cybersource.commercetools.reference.application.logging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;

public class PayloadLogger {

    private final ObjectMapper objectMapper;
    private final Logger logger;

    public PayloadLogger(final ObjectMapper objectMapper, Logger logger) {
        this.objectMapper = objectMapper;
        this.logger = logger;
    }

    public void log(final String message, final Object payload) {
        try {
            logger.debug(String.format("%s:\n%s", message, objectMapper.writeValueAsString(payload)));
        } catch (JsonProcessingException e) {
            logger.error("Could not convert input to JSON for logging", e);
        }
    }

}
