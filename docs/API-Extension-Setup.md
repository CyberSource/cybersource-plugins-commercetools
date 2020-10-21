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
| env.isv.payments.merchantID                      | env\_isv\_payments\_merchantID                        | Your Cybersource merchant id | Provided by Cybersource |
| env.isv.payments.sharedSecret.id                 | env\_isv\_payments\_sharedSecret\_id                  | Id of a Cybersource shared secret key to be used for Flex token generation | Created in <a href="Key-Creation.md">Key Creation</a> |
| env.isv.payments.keysDirectory                   | env\_isv\_payments\_keysDirectory|Directory where .p12 API key resides | Created in <a href="Key-Creation.md">Key Creation</a> |
| env.commercetools.projectKey                    | env\_commercetools\_projectKey                      | Project key for your Commercetools project | |
| env.commercetools.clientConfig.payment.clientId | env\_commercetools\_clientConfig\_payment\_clientId | Client ID of your Commercetools Payment API key | Created in <a href="Key-Creation.md">Key Creation</a> |
| env.isv.payments.service.keyGenerationUrl        | env\_isv\_payments\_service\_keygenerationurl         | Base URL of your Key Generation service (e.g. http://example.com) | See the 'Endpoints' section in <a href="Overview.md">Overview</a> |
| env.isv.payments.service.jwtCreationUrl          | env\_isv\_payments\_service\_jwtcreationurl           | Base URL of your JWT Creation service (e.g. http://example.com) | See the 'Endpoints' section in <a href="Overview.md">Overview</a> |
| env.isv.payments.flex.targetOrigins              | env\_isv\_payments\_flex\_targetOrigins               | Base URL where your frontend will be accessible | Multiple values can be seprated by spaces |
| env.isv.payments.flex.verificationKey            | env\_isv\_payments\_flex\_verificationKey             | Used to check Flex tokens for tampering | Generate with `openssl rand -base64 32` |

## <a name="SecretProperties"></a>Secret Properties

Properties that begin with the 'secrets' prefix are
environment-specific, **secret**<span> </span>properties. These should
not be checked in to version control, and ideally not set as environment
variables.

| Property                                          | Environment variable                    | Value | Notes |
| ------------------------------------------------- | --------------------------------------- | ----- | ----- |
| secrets.isv.payments.sharedSecret.value            | secrets\_isv\_payments\_sharedSecret\_value  | Value of a Cybersource shared secret key to be used for Flex token generation | Created in <a href="Key-Creation.md">Key Creation</a> |
| secrets.isv.payments.keyPassword                   | secrets\_isv\_payments\_keyPassword         | Password for the .p12 key (Your Cybersource merchant ID) | Created in <a href="Key-Creation.md">Key Creation</a> |
| secrets.isv.payments.visaCheckout.apiKey           | secrets\_isv\_payments\_visaCheckout\_apiKey | API key used for Visa Checkout | Created in <a href="Key-Creation.md">Key Creation</a> |
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

## Example deployment steps
The steps involved in deploying the reference app will depend on many factors including your choice of platform and method of handling environment/secret values, so it is impossible to give a definitive guide. However, for the simple case of running it locally in a development environment the following steps are one possibility

- Make a copy of the environment/secrets yaml template. Here we use **sample** as the profile name but you may choose anything providing you use the same value when running the application

		cd reference
		cp src/main/resources/env-secrets-template.yaml src/main/resources/application-sample.yaml
		
- Edit application-sample.yaml and replace the placeholders with actual values as documented above
- Build the library modules
> **_NOTE:_**  this is not necessary if the modules are not already available in an accessible repository 

		cd ../library
		./gradlew publishToMavenLocal
		
- Run the application specifying the profile name

		cd 	../reference
		./gradlew bootRun -I init-maven-local.gradle -PspringProfile=sample
	
	> **_NOTE:_**  when the library modules are available in an accessible repository then `-I init-maven-local.gradle` can be omitted
