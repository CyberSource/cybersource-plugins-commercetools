package isv.commercetools.reference.application.helper

import groovy.text.SimpleTemplateEngine

import javax.servlet.ServletException
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.time.LocalDate

class TokenHelperServlet extends HttpServlet {

    String captureContext
    String cardType

    TokenHelperServlet(String captureContext, String cardType) {
        this.cardType = cardType
        this.captureContext = captureContext
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        def contentTemplate = getClass().getResource('/flex/tokenHelperStub.html').text
        def bindMap = [cardType:cardType, captureContext:captureContext, expiryYear:LocalDate.now().year + 3]
        def content = new SimpleTemplateEngine().createTemplate(contentTemplate).make(bindMap)

        response.status = HttpServletResponse.SC_OK
        response.writer.println(content.toString())
    }
}
