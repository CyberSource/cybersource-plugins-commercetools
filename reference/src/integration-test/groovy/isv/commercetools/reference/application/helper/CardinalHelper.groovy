package isv.commercetools.reference.application.helper

import groovy.json.JsonSlurper
import groovy.text.SimpleTemplateEngine
import groovy.util.logging.Slf4j
import groovy.util.slurpersupport.NodeChild
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import isv.commercetools.reference.application.config.CardinalClientConfigurationProperties
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.*
import org.springframework.stereotype.Component
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.client.RestTemplate

import javax.crypto.spec.SecretKeySpec
import java.util.zip.DataFormatException
import java.util.zip.Inflater

@Component
@Slf4j
class CardinalHelper {

    TestRestTemplate testRestTemplate
    RestTemplate cardinalRestTemplate
    SimpleTemplateEngine templateEngine
    SecretKeySpec signingKey
    CardinalClientConfigurationProperties cardinalClientConfigurationProperties

    CardinalHelper(TestRestTemplate testRestTemplate, CardinalClientConfigurationProperties cardinalClientConfigurationProperties) {
        this.testRestTemplate = testRestTemplate
        this.cardinalClientConfigurationProperties = cardinalClientConfigurationProperties
        cardinalRestTemplate = new RestTemplate()
        templateEngine = new SimpleTemplateEngine()
        def apiKey = cardinalClientConfigurationProperties.apiKey.bytes
        signingKey = new SecretKeySpec(apiKey, SignatureAlgorithm.HS256.jcaName)
    }

    def retrieveJwt() {
        testRestTemplate.postForEntity('/jwt', null, String).body
    }

    def setupForEnrolmentCheck(String jwt, String cardNumber) {
        def cardinalReferenceId = decodeJwt(jwt).get('ReferenceId', String)

        def cardinalTid = 'Tid-' + UUID.randomUUID().toString()
        def headers = headers(cardinalTid)

        def consumerSessionId = initialiseSession(jwt, headers)

        def geoCookies = saveBrowserData(cardinalReferenceId)
        geoCookies.each { headers.add('Cookie', it.replaceAll(';.*', '')) }

        profileCard(cardNumber[0..5], headers)

        consumerSessionId
    }

    /**
     * Called first to initialise Cardinal
     */
    def initialiseSession(String requestJwt, MultiValueMap headers) {
        def binding = [
                'requestJwt':requestJwt,
        ]

        def initResponse = postTemplatedJson('init.json', binding, 'https://centinelapistag.cardinalcommerce.com/V1/Order/JWT/Init', headers)
        assert initResponse.statusCode == HttpStatus.OK
        decodeJwt(new JsonSlurper().parseText(initResponse.body).CardinalJWT).get('ConsumerSessionId', String)
    }

    /**
     * Called after initialisation to save browser data to session. Needs to be called before enrolment check
     */
    def saveBrowserData(String cardinalReferenceId) {
        def binding = [
                'orgUnitId':cardinalClientConfigurationProperties.orgUnitId,
                'cardinalReferenceId':cardinalReferenceId,
        ]

        def response = postTemplatedJson('browserData.json', binding, 'https://geostag.cardinalcommerce.com/DeviceFingerprintWeb/V2/Browser/SaveBrowserData')
        assert response.statusCode == HttpStatus.OK
        response.headers.get('Set-Cookie')
    }

    /**
     * Called after saving browser data with a card number to profile the card. Needs to be called before enrolment check
     */
    def profileCard(String cardNumber, MultiValueMap headers) {
        def binding = [
                'orgUnitId':cardinalClientConfigurationProperties.orgUnitId,
                'cardNumber':cardNumber,
        ]

        def response = postTemplatedJson('profile.json', binding, 'https://geostag.cardinalcommerce.com/DeviceFingerprintWeb/V2/Bin/Enabled', headers)
        assert response.statusCode == HttpStatus.OK
    }

    /**
     * Called after enrolment check for enrolled cards
     */
    def continueAuthentication(String requestJwt, String authenticationTransactionId, String consumerSessionId) {
        HttpHeaders headers = new HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON_UTF8
        def binding = [
                'requestJwt':requestJwt,
                'authenticationTransactionId':authenticationTransactionId,
                'consumerSessionId':consumerSessionId,
        ]

        postTemplatedJson('continue.json', binding, 'https://centinelapistag.cardinalcommerce.com/V1/Order/JWT/Continue', headers)
    }

    /**
     * Called to submit paReq to ACS and load authentication form
     */
    def loadAcsForm(String acsUrl, String paReq, String consumerSessionId) {
        def formData
        if (acsUrl.contains('creq')) {
            formData = [
                    'creq':paReq,
                    'threeDSSessionData':Base64.encoder.encodeToString(consumerSessionId.bytes),
            ]
        } else {
            formData = [
                    'PaReq':paReq,
                    'MD':consumerSessionId,
                    'TermUrl':'https://centinelapistag.cardinalcommerce.com/V1/TermURL/Overlay/CCA',
            ]
        }

        postFormData(formData, acsUrl)
    }

    /**
     * Called to submit ACS form
     */
    def submitAcsForm(String acsUrl, NodeChild formResponse) {
        def formData
        if (acsUrl.contains('creq')) {
            def acsTransId = formResponse.'**'.find { it.@name == 'acsTransId' }.attributes().value
            def threeDSSessionData = formResponse.'**'.find { it.@name == 'threeDSSessionData' }.attributes().value
            formData = [
                    'challengeDataEntry':'1234',
                    'acsTransId':acsTransId,
                    'threeDSSessionData':threeDSSessionData,
            ]
        } else {
            def paReq = formResponse.'**'.find { it.@name == 'PaReq' }.attributes().value
            def md = formResponse.'**'.find { it.@name == 'MD' }.attributes().value
            def termUrl = formResponse.'**'.find { it.@name == 'TermUrl' }.attributes().value
            formData = [
                    'PaReq':paReq,
                    'MD':md,
                    'TermUrl':termUrl,
                    'screensubmit':'true',
                    'external.field.username':'test1',
                    'external.field.password':'1234',
                    'external.field.password.encoding':'SHA1',
            ]
        }

        postFormData(formData, acsUrl)
    }

    /**
     * Called to submit paRes. Parses response to return the response JWT
     */
    def submitPaRes(NodeChild formResponse) {
        def action
        def formData
        if (formResponse.'**'.find { it.@name == 'cResForm' }) {
            action = formResponse.'**'.find { it.@name == 'cResForm' }.attributes().action
            def cres = formResponse.'**'.find { it.@name == 'cres' }.attributes().value
            def threeDSSessionData = formResponse.'**'.find { it.@name == 'threeDSSessionData' }.attributes().value

            log.info 'Submit cres:\n' + decodePayload(cres)

            formData = [
                    'cres':cres,
                    'threeDSSessionData':threeDSSessionData,
            ]
        } else {
            action = formResponse.'**'.find { it.@name == 'acsform' }.attributes().action
            def paRes = formResponse.'**'.find { it.@name == 'PaRes' }.attributes().value
            def md = formResponse.'**'.find { it.@name == 'MD' }.attributes().value

            log.info 'Submit paRes:\n' + decodePayload(paRes)

            formData = [
                    'PaRes':paRes,
                    'MD':md,
            ]
        }

        def response = postFormData(formData, action)
        assert response.status == 200
        def responseJwt = response.body.toString().replaceAll('(?s).*parent\\.postMessage\\("', '').replaceAll('(?s)".*', '')

        log.info 'Response JWT:\n' + decodeJwt(responseJwt)

        responseJwt
    }

    /**
     * Loads ACS form and checks for paRes. If it is not already present the form is submitted to obtain it
     */
    def processAcsForm(String acsUrl, String paReq, String consumerSessionId) {
        def formResponse = loadAcsForm(acsUrl, paReq, consumerSessionId)
        assert formResponse.status == 200

        if (formResponse.body.'**'.find { it.@name == 'PaRes' }) {
            formResponse
        } else {
            submitAcsForm(acsUrl, formResponse.body)
        }
    }

    def headers(String cardinalTid) {
        def headers = new LinkedMultiValueMap<String, String>()
        headers.add('X-Cardinal-Tid', cardinalTid)
        headers
    }

    def postTemplatedJson(String template, Map binding, String url, MultiValueMap headers = new LinkedMultiValueMap()) {
        def payloadTemplate = getClass().getResource("/output/cardinal/${template}").text
        def payload = templateEngine.createTemplate(payloadTemplate).make(binding).toString()
        def request = new HttpEntity<String>(payload, headers)

        cardinalRestTemplate.exchange(url, HttpMethod.POST, request, String)
    }

    def postFormData(Map formData, String url) {
        // use HttpBuilder rather than RestTemplate as RestTemplate returns empty bodies for V2 forms for some reason
        def http = new HTTPBuilder(url)
        http.post([body:formData, requestContentType:ContentType.URLENC]) { resp, other ->
            [status:resp.status, body:other]
        }
    }

    def decodePayload(String payload) {
        def payloadBytes = Base64.decoder.decode(payload)
        def decoded
        try {
            Inflater inflater = new Inflater()
            inflater.input = payloadBytes
            byte[] result = new byte[10000]
            int resultLength = inflater.inflate(result)
            inflater.end()

            decoded = new String(result, 0, resultLength, 'UTF-8')
        } catch (DataFormatException e) {
            // assume its a V2 payload
            decoded = new String(payloadBytes)
        }

        decoded
    }

    def decodeJwt(String jwt) {
        Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parse(jwt)
                .body
    }

}
