package com.cybersource.commercetools.api.extension.model;

public class ExtensionInput<T> {

    private Action action;
    private Resource<T> resource;

    public Action getAction() {
        return this.action;
    }

    public Resource<T> getResource() {
        return this.resource;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    public void setResource(Resource<T> resource) {
        this.resource = resource;
    }

}
