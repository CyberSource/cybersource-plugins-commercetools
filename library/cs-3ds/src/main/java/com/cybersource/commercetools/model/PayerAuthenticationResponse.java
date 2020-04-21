package com.cybersource.commercetools.model;

public class PayerAuthenticationResponse {

    private String requestReferenceId;
    private boolean authenticationRequired;
    private boolean authorizationAllowed;
    private String acsUrl;
    private String paReq;
    private String authenticationTransactionId;
    private String specificationVersion;
    private String proofXml;
    private String xid;
    private String veresEnrolled;
    private String commerceIndicator;
    private String eci;

    public String getRequestReferenceId() {
        return requestReferenceId;
    }

    public void setRequestReferenceId(String requestReferenceId) {
        this.requestReferenceId = requestReferenceId;
    }

    public boolean isAuthenticationRequired() {
        return authenticationRequired;
    }

    public void setAuthenticationRequired(boolean authenticationRequired) {
        this.authenticationRequired = authenticationRequired;
    }

    public boolean isAuthorizationAllowed() {
        return authorizationAllowed;
    }

    public void setAuthorizationAllowed(boolean authorizationAllowed) {
        this.authorizationAllowed = authorizationAllowed;
    }

    public String getAcsUrl() {
        return acsUrl;
    }

    public void setAcsUrl(String acsUrl) {
        this.acsUrl = acsUrl;
    }

    public String getPaReq() {
        return paReq;
    }

    public void setPaReq(String paReq) {
        this.paReq = paReq;
    }

    public String getAuthenticationTransactionId() {
        return authenticationTransactionId;
    }

    public void setAuthenticationTransactionId(String authenticationTransactionId) {
        this.authenticationTransactionId = authenticationTransactionId;
    }

    public String getSpecificationVersion() {
        return specificationVersion;
    }

    public void setSpecificationVersion(String specificationVersion) {
        this.specificationVersion = specificationVersion;
    }

    public String getProofXml() {
        return proofXml;
    }

    public void setProofXml(String proofXml) {
        this.proofXml = proofXml;
    }

    public String getXid() {
        return xid;
    }

    public void setXid(String xid) {
        this.xid = xid;
    }

    public String getVeresEnrolled() {
        return veresEnrolled;
    }

    public void setVeresEnrolled(String veresEnrolled) {
        this.veresEnrolled = veresEnrolled;
    }

    public String getCommerceIndicator() {
        return commerceIndicator;
    }

    public void setCommerceIndicator(String commerceIndicator) {
        this.commerceIndicator = commerceIndicator;
    }

    public String getEci() {
        return eci;
    }

    public void setEci(String eci) {
        this.eci = eci;
    }

}
