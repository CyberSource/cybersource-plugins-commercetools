package isv.commercetools.reference.application

import io.jsonwebtoken.Jwts
import isv.commercetools.reference.application.model.FlexKeys
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpStatus

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class KeyGenerationSpecification extends BaseSpecification {

    @Autowired
    TestRestTemplate noAuthTestRestTemplate

    def "should retrieve one time key"() {
        when:
        def response = noAuthTestRestTemplate.postForEntity('/keys', null, FlexKeys)

        then:
        response.statusCode == HttpStatus.OK
        validateContext(response.body.captureContext)
        validateContext(response.body.verificationContext)
    }

    def validateContext(String context) {
        assert context != null
        def parsed = Jwts.parserBuilder().build().parse(context[0 .. context.lastIndexOf('.')])

        assert parsed.body.flx.data != null
        assert parsed.body.flx.jwk.n != null
        assert parsed.body.flx.jwk.kty != null
        assert parsed.body.flx.jwk.use != null
        assert parsed.body.flx.jwk.kid != null
        assert parsed.body.flx.jwk.e != null

        true
    }

    def "should retrieve Cardinal JWT"() {
        when:
        def response = noAuthTestRestTemplate.postForEntity('/jwt', null, String)

        then:
        response.statusCode == HttpStatus.OK
        response.body != null
    }

}
