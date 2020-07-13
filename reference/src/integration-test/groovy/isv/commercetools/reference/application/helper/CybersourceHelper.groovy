package isv.commercetools.reference.application.helper

import com.github.tomakehurst.wiremock.WireMockServer
import org.springframework.stereotype.Component

import static com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo

@Component
class CybersourceHelper {

    def extractRequestFields(WireMockServer csWireMockServer) {
        def csRequests = csWireMockServer.findRequestsMatching(postRequestedFor(urlEqualTo('/commerce/1.x/transactionProcessor')).build()).requests
        assert csRequests.size() == 1
        csWireMockServer.resetRequests()
        def nvpRequestText = new XmlSlurper().parseText(csRequests.bodyAsString).depthFirst().find { node ->
            node.name() == 'nvpRequest'
        }.text()[1..-1]

        nvpRequestText.split('\n')
            .collectEntries { entry ->
                def pair = entry.split('=')
                [(pair.first()):pair.last()]
            }
    }

    def validateBillingFields(Map request) {
        ['billTo_firstName', 'billTo_lastName', 'billTo_street1', 'billTo_city', 'billTo_postalCode', 'billTo_country', 'billTo_email', 'billTo_ipAddress'].each {
            assert request.containsKey(it)
        }
        true
    }

    def validateShippingFields(Map request) {
        ['shipTo_firstName', 'shipTo_lastName', 'shipTo_street1', 'shipTo_city', 'shipTo_postalCode', 'shipTo_country'].each {
            assert request.containsKey(it)
        }
        true
    }

    def validateLineItemFields(Map request, int index) {
        [
            "item_${index}_productCode", "item_${index}_productName", "item_${index}_productSKU",
            "item_${index}_unitPrice", "item_${index}_quantity", "item_${index}_productRisk",
        ].each {
            assert request.containsKey(it.toString())
        }
        true
    }

    def validatePurchaseTotalFields(Map request, String totalAmount = '5.49') {
        assert request.containsKey('purchaseTotals_currency')
        assert request.purchaseTotals_grandTotalAmount == totalAmount
        true
    }

    def validateMerchantFields(Map request) {
        ['merchantReferenceCode', 'merchantID', 'developerID', 'partnerSolutionID'].each {
            assert request.containsKey(it)
        }
        true
    }

    def validateToken(Map request) {
        assert request.containsKey('tokenSource_transientToken')
        assert ! request.containsKey('recurringSubscriptionInfo_subscriptionID')
        true
    }

    def validateSavedToken(Map request) {
        assert request.containsKey('recurringSubscriptionInfo_subscriptionID')
        assert ! request.containsKey('tokenSource_transientToken')
        true
    }

    def validateDeviceFingerprint(Map request) {
        assert request.containsKey('deviceFingerprintID')
        true
    }

    def validateMerchantDefinedFields(Map request) {
        (1..100).each { i ->
            assert request.containsKey('merchantDefinedData_mddField_' + i)
        }
        true
    }

    def validateDecisionManagerFlag(Map request, Optional<Boolean> enabled) {
        if (enabled.isPresent()) {
            assert request.get('decisionManager_enabled') == enabled.get().toString()
        } else {
            assert ! request.containsKey('decisionManager_enabled')
        }
        true
    }

    def validateAuthServiceRun(Map request) {
        assert request.containsKey('ccAuthService_run')
        true
    }

    def validatePayerAuthEnrolmentCheckServiceRun(Map request) {
        assert request.containsKey('payerAuthEnrollService_run')
        true
    }

    def validatePayerAuthValidateServiceRun(Map request) {
        assert request.containsKey('payerAuthValidateService_run')
        true
    }

    def validateCaptureServiceRun(Map request, String authRequestId) {
        assert request.containsKey('ccCaptureService_run')
        assert request.ccCaptureService_authRequestID == authRequestId
        true
    }

    def validateCreditServiceRun(Map request, String captureRequestId) {
        assert request.containsKey('ccCreditService_run')
        assert request.ccCreditService_captureRequestID == captureRequestId
        true
    }

    def validateAuthReversalServiceRun(Map request, String authRequestId) {
        assert request.containsKey('ccAuthReversalService_run')
        assert request.ccAuthReversalService_authRequestID == authRequestId
        true
    }

    def validateSubscriptionUpdateServiceRun(Map request) {
        assert request.containsKey('paySubscriptionUpdateService_run')
        true
    }

    def validateSubscriptionCreateServiceRun(Map request) {
        assert request.containsKey('paySubscriptionCreateService_run')
        true
    }

}
