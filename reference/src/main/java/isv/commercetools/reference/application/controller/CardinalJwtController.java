package isv.commercetools.reference.application.controller;

import isv.cardinal.service.CardinalService;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/***
 * A REST Controller which produces JSON Web Tokens for integration with Cardinal
 */
@RestController
@RequestMapping("/jwt")
@CrossOrigin(origins = "*")
@Validated
@Slf4j
public class CardinalJwtController {

    private final CardinalService cardinalService;

    public CardinalJwtController(CardinalService cardinalService) {
        this.cardinalService = cardinalService;
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<String> createJwt() {
        var referenceId = UUID.randomUUID().toString();
        return new ResponseEntity<>(cardinalService.createJWT(referenceId), HttpStatus.OK);
    }

}
