package com.cybersource.commercetools.reference.application.controller;

import com.cybersource.flex.sdk.exception.FlexException;
import com.cybersource.flex.service.KeyService;
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

    public KeyGenerationController(KeyService keyService) {
        this.keyService = keyService;
    }

    @RequestMapping(method = RequestMethod.POST)
    @SuppressWarnings("PMD.OnlyOneReturn")
    public ResponseEntity<String> generateKey() {
        try {
            return new ResponseEntity<>(keyService.generateKey(), HttpStatus.OK);
        } catch (FlexException e) {
            log.error("Failed to generate one time key for Flex token", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
