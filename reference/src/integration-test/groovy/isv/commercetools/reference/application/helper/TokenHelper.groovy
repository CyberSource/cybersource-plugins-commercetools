package isv.commercetools.reference.application.helper

import com.nimbusds.jose.jwk.JWK
import groovy.json.JsonSlurper
import io.jsonwebtoken.Jwts
import isv.commercetools.reference.application.model.CreateTokenResponse
import org.eclipse.jetty.server.Connector
import org.eclipse.jetty.server.Server
import org.eclipse.jetty.server.ServerConnector
import org.eclipse.jetty.servlet.ServletContextHandler
import org.eclipse.jetty.servlet.ServletHolder
import org.openqa.selenium.By
import org.openqa.selenium.WebDriver
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions
import org.openqa.selenium.support.ui.ExpectedConditions
import org.openqa.selenium.support.ui.WebDriverWait
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.stereotype.Component

@Component
class TokenHelper {

    static final String CARD_NUMBER_INPUT_XPATH = '//input[@name="number"]'
    static final String CVV_INPUT_XPATH = '//input[@name="securityCode"]'
    static final String TOKEN_INPUT_XPATH = '//input[@name="token"]'

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

    def jettyServer

    TokenHelper(TestRestTemplate testRestTemplate) {
        this.testRestTemplate = testRestTemplate
        cardNameToTypeMap.each { k, v -> cardTypeToNameMap.put(v, k) }
    }

    def startJetty(String cardType, String captureContext) {
        jettyServer = new Server()
        def jettyServerConnector = new ServerConnector(jettyServer)
        jettyServerConnector.port = 8090
        jettyServer.connectors = [jettyServerConnector] as Connector[]
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS)
        context.contextPath = '/'
        jettyServer.handler = context
        context.addServlet(new ServletHolder(new TokenHelperServlet(captureContext, cardNameToTypeMap[cardType])), '/token_helper')
        jettyServer.start()
    }

    def stopJetty() {
        if (jettyServer) {
            jettyServer.stop()
        }
    }

    CreateTokenResponse tokeniseCard(String cardNumber, String cardType) {
        try {
            def flexKeys = new JsonSlurper().parseText(testRestTemplate.postForEntity('/keys', null, String).body)
            def captureContext = flexKeys.captureContext
            def verificationContext = flexKeys.verificationContext

            startJetty(cardType, captureContext)

            def tokenJwt = tokeniseCardInBrowser(cardNumber, cardType)

            def captureContextJwt = Jwts.parserBuilder().build().parse(captureContext[0 .. captureContext.lastIndexOf('.')])
            def jwk = JWK.parse(groovy.json.JsonOutput.toJson(captureContextJwt.body.flx.jwk))
            def parsedToken = Jwts.parserBuilder().setSigningKey(jwk.toRSAPublicKey()).build().parse(tokenJwt)

            new CreateTokenResponse(token:tokenJwt, maskedPan:parsedToken.body.data.number, cardType:parsedToken.body.data.type, verificationContext:verificationContext)
        } finally {
            stopJetty()
        }
    }

    def tokeniseCardInBrowser(String cardNumber, String cardType) {
        WebDriver driver
        try {
            ChromeOptions options = new ChromeOptions()
            options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disable-first-run')
            driver = new ChromeDriver(options)

            driver.get('http://localhost:8090/token_helper')

            WebDriverWait wait = new WebDriverWait(driver, 10)

            wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(0))

            wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(CARD_NUMBER_INPUT_XPATH))).sendKeys(cardNumber)

            driver.switchTo().parentFrame()
            wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(1))

            wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(CVV_INPUT_XPATH))).sendKeys(cardType == 'Amex' ? '1234' : '123')

            driver.switchTo().parentFrame()

            driver.executeScript('tokeniseCard()')

            def tokenElement = driver.findElement(By.xpath(TOKEN_INPUT_XPATH))
            wait.until(ExpectedConditions.attributeToBeNotEmpty(tokenElement, 'value'))
            tokenElement.getAttribute('value')
        } finally {
            driver.quit()
        }
    }

    def cardName(String cardType) {
        cardTypeToNameMap[cardType]
    }

}
