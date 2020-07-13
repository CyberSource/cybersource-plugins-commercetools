package isv.commercetools.reference.application.controller;

import Invokers.ApiException;
import isv.commercetools.reference.application.model.FlexKeys;
import isv.commercetools.reference.application.validation.FlexTokenVerifier;
import isv.flex.service.KeyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/***
 * A REST Controller which produces one-time keys for Flex tokenisation
 */
@RestController
@RequestMapping("/keys")
@CrossOrigin(origins = "*")
@Validated
@Slf4j
public class KeyGenerationController {

    private final KeyService keyService;
    private final FlexTokenVerifier tokenVerifier;

    public KeyGenerationController(KeyService keyService, FlexTokenVerifier tokenVerifier) {
        this.keyService = keyService;
        this.tokenVerifier = tokenVerifier;
    }

    @RequestMapping(method = RequestMethod.POST)
    @SuppressWarnings("PMD.OnlyOneReturn")
    public ResponseEntity<FlexKeys> generateKey() {
        try {
            var captureContext = keyService.generateKey();
            var verificationContext = tokenVerifier.createVerificationContext(captureContext);
            return new ResponseEntity<>(new FlexKeys(captureContext, verificationContext), HttpStatus.OK);
        } catch (ApiException e) {
            log.error("Failed to generate one time key for Flex token", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
