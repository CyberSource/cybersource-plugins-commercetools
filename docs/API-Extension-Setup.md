# API Extension Setup

  - [Configuration](#Configuration)
      - [Environment Properties](#EnvironmentProperties)
      - [Secret Properties](#SecretProperties)
      - [Application Configuration Properties](#ApplicationConfigurationProperties)
  - [Deployment](#Deployment)

# <a name="Configuration"></a>Configuration

There are a number of configuration variables that need to be defined
before running the application. These can be set either as environment
variables or by providing an environment-specific yaml using Spring
Boot's profile feature. 

For multiple environments you should use unique values per environment
where possible

## <a name="EnvironmentProperties"></a>Environment Properties

Properties that begin with the 'env' prefix are environment-specific,
non-secret properties.

| Property                                        | Environment variable                                | Value | Notes |
| ----------------------------------------------- |---------------------------------------------------- | ----- | ----- |
| env.cybersource.merchantID                      | env\_cybersource\_merchantID                        | Your Cybersource merchant id | Provided by Cybersource |
| env.cybersource.sharedSecret.id                 | env\_cybersource\_sharedSecret\_id                  | Id of a Cybersource shared secret key to be used for Flex token generation | Created in <a href="Key-Creation.md">Key Creation</a> |
| env.cybersource.keysDirectory                   | env\_cybersource\_keysDirectory|Directory where .p12 API key resides | Created in <a href="Key-Creation.md">Key Creation</a> |
| env.commercetools.projectKey                    | env\_commercetools\_projectKey                      | Project key for your Commercetools project | |
| env.commercetools.clientConfig.payment.clientId | env\_commercetools\_clientConfig\_payment\_clientId | Client ID of your Commercetools Payment API key | Created in <a href="Key-Creation.md">Key Creation</a> |
| env.cybersource.service.keyGenerationUrl        | env\_cybersource\_service\_keygenerationurl         | Base URL of your Key Generation service (e.g. http://example.com) | See the 'Endpoints' section in <a href="Overview.md">Overview</a> |
| env.cybersource.service.jwtCreationUrl          | env\_cybersource\_service\_jwtcreationurl           | Base URL of your JWT Creation service (e.g. http://example.com) | See the 'Endpoints' section in <a href="Overview.md">Overview</a> |
| env.cybersource.flex.targetOrigins              | env\_cybersource\_flex\_targetOrigins               | Base URL where your frontend will be accessible | Multiple values can be seprated by spaces |
| env.cybersource.flex.verificationKey            | env\_cybersource\_flex\_verificationKey             | Used to check Flex tokens for tampering | Generate with `openssl rand -base64 32` |

## <a name="SecretProperties"></a>Secret Properties

Properties that begin with the 'secrets' prefix are
environment-specific, **secret**<span> </span>properties. These should
not be checked in to version control, and ideally not set as environment
variables.

| Property                                          | Environment variable                    | Value | Notes |
| ------------------------------------------------- | --------------------------------------- | ----- | ----- |
| secrets.cybersource.sharedSecret.value            | secrets\_cybersource\_sharedSecret\_value  | Value of a Cybersource shared secret key to be used for Flex token generation | Created in <a href="Key-Creation.md">Key Creation</a> |
| secrets.cybersource.keyPassword                   | secrets\_cybersource\_keyPassword         | Password for the .p12 key (Your Cybersource merchant ID) | Created in <a href="Key-Creation.md">Key Creation</a> |
| secrets.cybersource.visaCheckout.apiKey           | secrets\_cybersource\_visaCheckout\_apiKey | API key used for Visa Checkout | Created in <a href="Key-Creation.md">Key Creation</a> |
| secrets.commercetools.clientConfig.payment.secret | secrets\_commercetools\_clientConfig\_payment\_secret | Client secret of your Commercetools Payment API key | Created in <a href="Key-Creation.md">Key Creation</a> |
| secrets.cardinal.apiKey                           | secrets\_cardinal\_apiKey                 | Cardinal API key available from Cybersource|Created in <a href="Key-Creation.md">Key Creation</a> |
| secrets.cardinal.apiIdentifier                    | secrets\_cardinal\_apiIdentifier          | Cardinal API identifier available from Cybersource | Created in <a href="Key-Creation.md">Key Creation</a> |
| secrets.cardinal.orgUnitId                        | secrets\_cardinal\_orgUnitId              | Cardinal org unit id available from Cybersource | Created in <a href="Key-Creation.md">Key Creation</a> |

## <a name="ApplicationConfigurationProperties"></a>Application Configuration Properties

You may wish to override the following properties in your own before
running/deploying the reference application:

| Property                                  | Description                                        |
| ----------------------------------------- | -------------------------------------------------- |
| server.port                               | Port to listen on for HTTP requests                |
| commercetoools.authUrl                    | Commercetools auth server URL                      |
| commercetools.apiUrl                      | Commercetools API server URL                       |
| commercetools.extension.security.user     | Username for basic authorisation on API extensions |
| commercetools.extension.security.password | Password for basic authorisation on API extensions |

# <a name="Deployment"></a>Deployment

The reference application is a Spring Boot application built using
Gradle, and can be built and run the same manner as any Spring Boot
application. See <https://spring.io/guides/gs/spring-boot/>
