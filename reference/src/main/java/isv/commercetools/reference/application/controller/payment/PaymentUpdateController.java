package isv.commercetools.reference.application.controller.payment;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.payments.Payment;
import isv.commercetools.api.extension.model.ExtensionInput;
import isv.commercetools.api.extension.model.ExtensionOutput;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.reference.application.controller.response.ResponseBuilder;
import isv.commercetools.reference.application.logging.PayloadLogger;
import isv.commercetools.reference.application.service.extension.ExtensionService;
import isv.commercetools.reference.application.validation.ResourceValidator;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/***
 * A REST Controller which handles Payment Update API extension requests and responses.
 */
@RestController
@RequestMapping("/api")
@Validated
@Slf4j
@SuppressWarnings("unchecked")
public class PaymentUpdateController extends AbstractPaymentController {

  @Autowired
  public PaymentUpdateController(
    ExtensionService paymentUpdateExtensionService,
    ResponseBuilder responseBuilder,
    ResourceValidator<CustomPayment> paymentUpdateValidator,
    ObjectMapper objectMapper
  ) {
    super(
            paymentUpdateExtensionService,
            new PayloadLogger(objectMapper, LoggerFactory.getLogger(PaymentUpdateController.class)),
            paymentUpdateValidator,
            responseBuilder
    );
  }

  protected PaymentUpdateController(
          ExtensionService paymentUpdateExtensionService,
          ResponseBuilder responseBuilder,
          ResourceValidator<CustomPayment> paymentUpdateValidator,
          PayloadLogger payloadLogger
  ) {
    super(
            paymentUpdateExtensionService,
            payloadLogger,
            paymentUpdateValidator,
            responseBuilder
    );
  }

  @Override
  @RequestMapping(value = "/extension/payment/update", method = RequestMethod.POST)
  public ResponseEntity<ExtensionOutput> handle(@RequestBody final ExtensionInput<Payment> input) {
    payloadLogger.log("Received payment update", input);
    var payment = new CustomPayment(input.getResource().getObj());
    var extensionOutputResponseEntity = validateAndProcess(payment);
    payloadLogger.log("Returning response", extensionOutputResponseEntity.getBody());
    return extensionOutputResponseEntity;
  }
}
