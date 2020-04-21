<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

# API Extension Setup

</div>

<div id="content" class="view">

<div id="main-content" class="wiki-content group">

<div class="toc-macro rbtoc1581891563920">

  - [Configuration](#Configuration)
      - [Environment Properties](#EnvironmentProperties)
      - [Secret Properties](#SecretProperties)
      - [Application Configuration Properties](#ApplicationConfigurationProperties)
  - [Deployment](#Deployment)

</div>

# <a name="Configuration"></a>Configuration

There are a number of configuration variables that need to be defined
before running the application. These can be set either as environment
variables or by providing an environment-specific yaml using Spring
Boot's profile feature. 

<div class="confluence-information-macro confluence-information-macro-note conf-macro output-block">

<div class="confluence-information-macro-body">

For multiple environments you should use unique values per environment
where possible

</div>

</div>

## <a name="EnvironmentProperties"></a>Environment Properties

Properties that begin with the 'env' prefix are environment-specific,
non-secret properties.

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Property
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Environment variable
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Value
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Notes
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">env.cybersource.merchantID</td>
<td style="text-align: left;"><p><span>env_cybersource_merchantID</span></p></td>
<td style="text-align: left;">Your Cybersource merchant id</td>
<td style="text-align: left;">Provided by Cybersource</td>
</tr>
<tr class="even">
<td style="text-align: left;">env.cybersource.<span>sharedSecret.id</span></td>
<td style="text-align: left;"><p><span>env_cybersource_sharedSecret_id</span></p></td>
<td style="text-align: left;">Id of a Cybersource shared secret key to be used for Flex token generation</td>
<td style="text-align: left;">Created in <a href="Key-Creation.md">Key Creation</a></td>
</tr>
<tr class="odd">
<td style="text-align: left;">env.cybersource.<span>keysDirectory</span></td>
<td style="text-align: left;"><p><span>env_cybersource_keysDirectory</span></p></td>
<td style="text-align: left;">Directory where .p12 API key resides</td>
<td style="text-align: left;">Created in <a href="Key-Creation.md">Key Creation</a></td>
</tr>
<tr class="even">
<td style="text-align: left;">env.commercetools.projectKey</td>
<td style="text-align: left;">env_commercetools_projectKey</td>
<td style="text-align: left;">Project key for your Commercetools project</td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="odd">
<td style="text-align: left;">env.commercetools.clientConfig.payment.clientId</td>
<td style="text-align: left;">env_commercetools_clientConfig_payment_clientId</td>
<td style="text-align: left;">Client ID of your Commercetools Payment API key</td>
<td style="text-align: left;">Created in <a href="Key-Creation.md">Key Creation</a></td>
</tr>
<tr class="even">
<td style="text-align: left;"><span class="inline-comment-marker" data-ref="8e50df34-8ef1-45e2-9de6-53b9ff5d95aa"><span style="color: rgb(9,30,66);text-decoration: none;">env.cybersource.service</span>.keyGenerationUrl</span></td>
<td style="text-align: left;"><span style="color: rgb(9,30,66);text-decoration: none;">env_cybersource_service</span>_keygenerationurl</td>
<td style="text-align: left;">Base URL of your Key Generation service (e.g. http://example.com)</td>
<td style="text-align: left;">See the 'Endpoints' section in <a href="Overview.md">Overview</a></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><span style="color: rgb(9,30,66);text-decoration: none;">env.cybersource.service</span>.jwtCreationUrl</td>
<td style="text-align: left;"><span style="color: rgb(9,30,66);text-decoration: none;">env_cybersource_service</span>_jwtcreationurl</td>
<td style="text-align: left;">Base URL of your JWT Creation service (e.g. <a href="http://example.com" class="external-link">http://example.com</a>)</td>
<td style="text-align: left;">See the 'Endpoints' section in <a href="Overview.md">Overview</a></td>
</tr>
</tbody>
</table>

</div>

</div>

## <a name="SecretProperties"></a>Secret Properties

Properties that begin with the 'secrets' prefix are
environment-specific, **secret**<span> </span>properties. These should
not be checked in to version control, and ideally not set as environment
variables.

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Property
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Environment variable
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Value
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Notes
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><span>secrets.cybersource.sharedSecret.value</span></td>
<td style="text-align: left;"><p><span>secrets_cybersource_sharedSecret_value</span></p></td>
<td style="text-align: left;">Value of a Cybersource shared secret key to be used for Flex token generation</td>
<td style="text-align: left;"><p>Created in <a href="Key-Creation.md">Key Creation</a></p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><span>secrets.cybersource.keyPassword</span></td>
<td style="text-align: left;"><p><span>secrets_cybersource_keyPassword</span></p></td>
<td style="text-align: left;">Password for the .p12 key (Your Cybersource merchant ID)</td>
<td style="text-align: left;">Created in <a href="Key-Creation.md">Key Creation</a></td>
</tr>
<tr class="odd">
<td style="text-align: left;">secrets.cybersource.visaCheckout.apiKey</td>
<td style="text-align: left;">secrets_cybersource_visaCheckout_apiKey</td>
<td style="text-align: left;">API key used for Visa Checkout</td>
<td style="text-align: left;">Created in <a href="Key-Creation.md">Key Creation</a></td>
</tr>
<tr class="even">
<td style="text-align: left;">secrets.commercetools.clientConfig.payment.secret</td>
<td style="text-align: left;">secrets_commercetools_clientConfig_payment_secret</td>
<td style="text-align: left;">Client secret of your Commercetools Payment API key</td>
<td style="text-align: left;">Created in <a href="Key-Creation.md">Key Creation</a></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><span>secrets.cardinal.apiKey</span></td>
<td style="text-align: left;"><p><span>secrets_cardinal_apiKey</span></p></td>
<td style="text-align: left;">Cardinal API key available from Cybersource</td>
<td style="text-align: left;">Created in <a href="Key-Creation.md">Key Creation</a></td>
</tr>
<tr class="even">
<td style="text-align: left;"><span>secrets.cardinal.apiIdentifier</span></td>
<td style="text-align: left;"><p><span>secrets_cardinal_apiIdentifier</span></p></td>
<td style="text-align: left;">Cardinal API identifier available from Cybersource</td>
<td style="text-align: left;">Created in <a href="Key-Creation.md">Key Creation</a></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><span>secrets.cardinal.orgUnitId</span></td>
<td style="text-align: left;"><p><span>secrets_cardinal_orgUnitId</span></p></td>
<td style="text-align: left;">Cardinal org unit id available from Cybersource</td>
<td style="text-align: left;">Created in <a href="Key-Creation.md">Key Creation</a></td>
</tr>
</tbody>
</table>

</div>

</div>

## <a name="ApplicationConfigurationProperties"></a>Application Configuration Properties

You may wish to override the following properties in your own before
running/deploying the reference application:

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Property
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Description
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">server.port</td>
<td style="text-align: left;">Port to listen on for HTTP requests</td>
</tr>
<tr class="even">
<td style="text-align: left;">commercetoools.authUrl</td>
<td style="text-align: left;">Commercetools auth server URL</td>
</tr>
<tr class="odd">
<td style="text-align: left;">commercetools.apiUrl</td>
<td style="text-align: left;">Commercetools API server URL</td>
</tr>
<tr class="even">
<td style="text-align: left;"><span class="inline-comment-marker" data-ref="0983d6e0-fb07-4fbc-bde3-b00c206af2f3"><span style="color: rgb(9,30,66);text-decoration: none;">commercetools.extension.security</span>.user</span></td>
<td style="text-align: left;">Username for basic authorisation on API extensions</td>
</tr>
<tr class="odd">
<td style="text-align: left;"><span style="color: rgb(9,30,66);text-decoration: none;">commercetools.extension.security</span>.password</td>
<td style="text-align: left;">Password for basic authorisation on API extensions</td>
</tr>
</tbody>
</table>

</div>

</div>

# <a name="Deployment"></a>Deployment

The reference application is a Spring Boot application built using
Gradle, and can be built and run the same manner as any Spring Boot
application. See <https://spring.io/guides/gs/spring-boot/>

</div>

</div>

</div>

</div>