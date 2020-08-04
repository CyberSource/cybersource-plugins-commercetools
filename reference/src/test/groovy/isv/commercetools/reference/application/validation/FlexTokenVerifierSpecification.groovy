package isv.commercetools.reference.application.validation

import com.nimbusds.jose.jwk.JWK
import com.nimbusds.jose.jwk.KeyUse
import com.nimbusds.jose.jwk.RSAKey
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import isv.commercetools.mapping.model.CustomPayment
import spock.lang.Specification

import java.security.Key
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import java.time.LocalDateTime

class FlexTokenVerifierSpecification extends Specification {

    FlexTokenVerifier testObj

    CustomPayment paymentMock = Mock()

    def tokenSigningKeys
    def verificationKey

    def setup() {
        Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256)
        verificationKey = Base64.encoder.encode(key.encoded)
        testObj = new FlexTokenVerifier(verificationKey)

        tokenSigningKeys = Keys.keyPairFor(SignatureAlgorithm.RS256)
    }

    def 'should verify token'() {
        given:
        paymentMock.tokenVerificationContext >> verificationContext()
        paymentMock.token >> tokenJwt((RSAPrivateKey)tokenSigningKeys.private, 'token value')

        when:
        def result = testObj.verifyToken(paymentMock)

        then:
        result == true
    }

    def 'should fail token verification when token value missing'() {
        given:
        paymentMock.tokenVerificationContext >> verificationContext()
        paymentMock.token >> tokenJwt((RSAPrivateKey)tokenSigningKeys.private, null)

        when:
        def result = testObj.verifyToken(paymentMock)

        then:
        result == false
    }

    def 'should fail token verification when token tampered with'() {
        given:
        def dodgyKeys = Keys.keyPairFor(SignatureAlgorithm.RS256)
        paymentMock.tokenVerificationContext >> verificationContext()
        paymentMock.token >> tokenJwt((RSAPrivateKey)dodgyKeys.private, 'token value')

        when:
        def result = testObj.verifyToken(paymentMock)

        then:
        result == false
    }

    def 'should fail token verification when verification context tampered with'() {
        given:
        paymentMock.tokenVerificationContext >> verificationContext()
        paymentMock.token >> tokenJwt((RSAPrivateKey)tokenSigningKeys.private, 'token value')

        Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256)
        def encodedKey = Base64.encoder.encode(key.encoded)
        testObj = new FlexTokenVerifier(encodedKey)

        when:
        def result = testObj.verifyToken(paymentMock)

        then:
        result == false
    }

    def 'should fail token verification when token expired'() {
        given:
        paymentMock.tokenVerificationContext >> verificationContext()
        paymentMock.token >> tokenJwt((RSAPrivateKey)tokenSigningKeys.private, 'token value', LocalDateTime.now().minusMinutes(1).toDate())

        when:
        def result = testObj.verifyToken(paymentMock)

        then:
        result == false
    }

    def 'should create verification context'() {
        given:
        def verificationContext = verificationContext()

        when:
        def parsed = Jwts.parserBuilder().setSigningKey(verificationKey).build().parse(verificationContext)

        then:
        parsed.body.flx.jwk != null
    }

    def 'should require signing key to parse verification context'() {
        given:
        def verificationContext = verificationContext()

        when:
        Jwts.parserBuilder().build().parse(verificationContext)

        then:
        thrown(IllegalArgumentException)
    }

    def verificationContext() {
        JWK jwk = new RSAKey.Builder((RSAPublicKey)tokenSigningKeys.public)
                .privateKey((RSAPrivateKey)tokenSigningKeys.private)
                .keyUse(KeyUse.SIGNATURE)
                .keyID(UUID.randomUUID().toString())
                .build()
        def flexClaim = ['jwk':jwk.toJSONObject()]
        def captureContext = Jwts.builder().claim('flx', flexClaim).compact()
        testObj.createVerificationContext(captureContext)
    }

    def tokenJwt(Key key, String tokenValue, Date expiryDate = LocalDateTime.now().plusMinutes(1).toDate()) {
        Jwts.builder()
                .claim('jti', tokenValue)
                .claim('other', 'other value')
                .setExpiration(expiryDate)
                .signWith(key)
                .compact()
    }

}
