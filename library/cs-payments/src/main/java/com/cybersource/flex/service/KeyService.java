package com.cybersource.flex.service;

import com.cybersource.flex.sdk.FlexService;
import com.cybersource.flex.sdk.exception.FlexException;
import com.cybersource.flex.sdk.model.EncryptionType;
import com.cybersource.flex.sdk.model.KeysRequestParameters;
import com.cybersource.flex.sdk.repackaged.JSONObject;

@SuppressWarnings("PMD.BeanMembersShouldSerialize")
public class KeyService {

    private final FlexService flexService;

    public KeyService(FlexService flexService) {
        this.flexService = flexService;
    }

    public String generateKey() throws FlexException {
        var parameters = new KeysRequestParameters(EncryptionType.RsaOaep256);
        var flexPublicKey = flexService.createKey(parameters);

        return new JSONObject(flexPublicKey.getJwk()).toString();
    }

}
