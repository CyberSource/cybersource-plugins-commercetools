package com.cybersource.cardinal.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

/**
 * Creates and validates JSON Web Tokens for use with Cardinal
 */
public class CardinalService {

    private final Key signingKey;
    private final String apiIdentifier;
    private final String orgUnitId;
    private final long ttlMillis;

    public CardinalService(byte[] apiKey, String apiIdentifier, String orgUnitId, long ttlMillis) {
        this.apiIdentifier = apiIdentifier;
        this.orgUnitId = orgUnitId;
        this.ttlMillis = ttlMillis;

        signingKey = new SecretKeySpec(apiKey, SignatureAlgorithm.HS256.getJcaName());
    }

    public String createJWT(String referenceId) {
        return createJWT(referenceId, null);
    }

    public String createJWT(String referenceId, Object payload) {
        var jwtId = UUID.randomUUID().toString();

        JwtBuilder builder = Jwts.builder()
                .setId(jwtId)
                .setIssuedAt(new Date())
                .setExpiration(Date.from(ZonedDateTime.now().plus(ttlMillis, ChronoUnit.MILLIS).toInstant()))
                .setIssuer(apiIdentifier)
                .claim("OrgUnitId", orgUnitId)
                .claim("ReferenceId", referenceId)
                .signWith(SignatureAlgorithm.HS256, signingKey);

        if (payload != null) {
            builder.claim("Payload", payload).claim("ObjectifyPayload", true);
        }

        return builder.compact();
    }

    public String validateJWTAndExtractReferenceId(String jwt) {
        Claims claims = (Claims) Jwts.parser()
                .setSigningKey(signingKey)
                .parse(jwt)
                .getBody();

        return (String) claims.get("ReferenceId");
    };

}

