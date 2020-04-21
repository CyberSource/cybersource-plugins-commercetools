package com.cybersource.commercetools.reference.application.helper

import com.cybersource.commercetools.reference.application.model.CardInfo
import com.cybersource.commercetools.reference.application.model.CreateTokenRequest
import com.cybersource.commercetools.reference.application.model.CreateTokenResponse
import com.nimbusds.jose.jwk.JWK
import groovy.json.JsonSlurper
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.stereotype.Component

import javax.crypto.Cipher
import javax.crypto.spec.OAEPParameterSpec
import javax.crypto.spec.PSource
import java.security.interfaces.RSAPublicKey
import java.security.spec.MGF1ParameterSpec
import java.time.Year

@Component
class TokenHelper {

    def cardNameToTypeMap = [
            'Visa':'001',
            'Mastercard':'002',
            'Amex':'003',
            'Diners':'005',
            'JCB':'007',
            'MaestroUK':'024',
            'MaestroIntl':'042',
    ]

    def testRestTemplate
    def cardTypeToNameMap = [:]

    TokenHelper(TestRestTemplate testRestTemplate) {
        this.testRestTemplate = testRestTemplate
        cardNameToTypeMap.each { k, v -> cardTypeToNameMap.put(v, k) }
    }

    CreateTokenResponse tokeniseCard(String cardNumber, String cardType) {
        String flexKey = testRestTemplate.postForEntity('/keys', null, String).body

        def createToken = new CreateTokenRequest()
        createToken.keyId = new JsonSlurper().parseText(flexKey).kid
        createToken.cardInfo = new CardInfo()
        createToken.cardInfo.cardExpirationMonth = '01'
        createToken.cardInfo.cardExpirationYear = Year.now().plusYears(3).toString()
        createToken.cardInfo.cardNumber = encryptCard(cardNumber, flexKey)
        createToken.cardInfo.cardType = cardNameToTypeMap[cardType]

        testRestTemplate.postForObject('https://testflex.cybersource.com/cybersource/flex/v1/tokens', createToken, CreateTokenResponse)
    }

    def encryptCard(String cardNumber, String jwk) {
        RSAPublicKey key = JWK.parse(jwk).toRSAPublicKey()

        // these cipher settings match what the Web Crypto API uses
        Cipher cipher = Cipher.getInstance('RSA/ECB/OAEPPadding')
        OAEPParameterSpec oaepParams = new OAEPParameterSpec('SHA-256', 'MGF1', new MGF1ParameterSpec('SHA-256'), PSource.PSpecified.DEFAULT)
        cipher.init(Cipher.ENCRYPT_MODE, key, oaepParams)

        new String(Base64.encoder.encode(cipher.doFinal(cardNumber.bytes)))
    }

    def cardName(String cardType) {
        cardTypeToNameMap[cardType]
    }

}
