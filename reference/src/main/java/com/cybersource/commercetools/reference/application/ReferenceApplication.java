package com.cybersource.commercetools.reference.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class ReferenceApplication {

  public static void main(final String[] args) {
    SpringApplication.run(ReferenceApplication.class, args);
  }

}
