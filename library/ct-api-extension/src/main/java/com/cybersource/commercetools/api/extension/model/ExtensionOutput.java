package com.cybersource.commercetools.api.extension.model;

import io.sphere.sdk.commands.UpdateAction;

import java.util.ArrayList;
import java.util.List;

public class ExtensionOutput {

    private List<UpdateAction> actions;
    private List<ExtensionError> errors;

    public ExtensionOutput() {
        actions = new ArrayList<>();
        errors = new ArrayList<>();
    }

    public ExtensionOutput withActions(List<UpdateAction> actions) {
        this.actions = actions;
        return this;
    }

    public ExtensionOutput withErrors(List<ExtensionError> errors) {
        this.errors = errors;
        return this;
    }

    public ExtensionOutput withAction(UpdateAction action) {
        this.actions.add(action);
        return this;
    }

    public ExtensionOutput withError(ExtensionError error) {
        this.errors.add(error);
        return this;
    }

    public List<UpdateAction> getActions() {
        return this.actions;
    }

    public List<ExtensionError> getErrors() {
        return this.errors;
    }

    @Override
    public String toString() {
        return "ExtensionOutput(actions=" + this.getActions() + ", errors=" + this.getErrors() + ")";
    }

}
