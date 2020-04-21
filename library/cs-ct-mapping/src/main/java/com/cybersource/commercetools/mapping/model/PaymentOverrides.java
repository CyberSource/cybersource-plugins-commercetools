package com.cybersource.commercetools.mapping.model;

import java.util.Optional;

public class PaymentOverrides {

    private Optional<Boolean> enableDecisionManager = Optional.empty();

    public void setEnableDecisionManager(Optional<Boolean> enableDecisionManager) {
        this.enableDecisionManager = enableDecisionManager;
    }

    public Optional<Boolean> getEnableDecisionManager() {
        return enableDecisionManager;
    }
}
