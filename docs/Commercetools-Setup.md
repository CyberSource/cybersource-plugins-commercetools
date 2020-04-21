<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

# Commercetools Setup

</div>

<div id="content" class="view">

<div id="main-content" class="wiki-content group">

<div class="toc-macro rbtoc1581891563867">

  - [API Extension Setup](#APIExtensionSetup)
      - [Payment Create](#PaymentCreate)
      - [Payment Update](#PaymentUpdate)
  - [Resource
    Customisations](#ResourceCustomisations)
      - [Payment Interactions](#PaymentInteractions)
          - [Payment authorisation
            failed](#Paymentauthorisationfailed)
          - [Payer authentication enrolment
            check](#Payerauthenticationenrolmentcheck)
          - [Payer authentication
            validation](#Payerauthenticationvalidation)
      - [Payment](#Payment)

</div>

The customisations below are required for the API Extension to work
correctly. JSON versions of these definitions can be found in the
'ct-definitions' module of the library project.

# <a name="APIExtensionSetup"></a>API Extension Setup

## <a name="PaymentCreate"></a>Payment Create

An extension triggered by payment updates is required to process any
actions on a payment.

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th><div class="tablesorter-header-inner">
Property
</div></th>
<th><div class="tablesorter-header-inner">
Value
</div></th>
<th><div class="tablesorter-header-inner">
Note
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>key</td>
<td>cybersource_payment_create_extension</td>
<td><br />
</td>
</tr>
<tr class="even">
<td>type</td>
<td>HTTP</td>
<td>The reference application only supports HTTP Destinations</td>
</tr>
<tr class="odd">
<td>url</td>
<td>{baseUrl}/api/extension/payment/create</td>
<td>The baseUrl will be defined by where you deploy the reference application. HTTPS should be used for production</td>
</tr>
<tr class="even">
<td>authentication.type</td>
<td>AuthorizationHeader</td>
<td><br />
</td>
</tr>
<tr class="odd">
<td>authentication.headerValue</td>
<td>Basic {credentials}</td>
<td><span class="inline-comment-marker" data-ref="5a63141e-1a5e-4d70-aaf4-40e74931723a">Use the Basic authorization credentials from <a href="API-Extension-Setup.md">API Extension Setup</a> → Application Configuration Properties </span></td>
</tr>
<tr class="even">
<td>timeoutInMs</td>
<td>10000</td>
<td>You will need commercetools support to increase the allowable maximum value</td>
</tr>
<tr class="odd">
<td>actions</td>
<td>Create</td>
<td><br />
</td>
</tr>
<tr class="even">
<td>resourceTypeId</td>
<td>payment</td>
<td><br />
</td>
</tr>
</tbody>
</table>

</div>

</div>

## <a name="PaymentUpdate"></a>Payment Update

An extension triggered by payment updates is required to process
authorisations

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th><div class="tablesorter-header-inner">
Property
</div></th>
<th><div class="tablesorter-header-inner">
Value
</div></th>
<th><div class="tablesorter-header-inner">
Note
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>key</td>
<td>cybersource_payment_update_extension</td>
<td><br />
</td>
</tr>
<tr class="even">
<td>type</td>
<td>HTTP</td>
<td>The reference application only supports HTTP Destinations</td>
</tr>
<tr class="odd">
<td>url</td>
<td>{baseUrl}/api/extension/payment/update</td>
<td>The baseUrl will be defined by where you deploy the reference application. HTTPS should be used for production</td>
</tr>
<tr class="even">
<td>authentication.type</td>
<td>AuthorizationHeader</td>
<td><br />
</td>
</tr>
<tr class="odd">
<td>authentication.headerValue</td>
<td>Basic {credentials}</td>
<td>Use the Basic authorization credentials from <a href="API-Extension-Setup.md">API Extension Setup</a> → Application Configuration Properties</td>
</tr>
<tr class="even">
<td>timeoutInMs</td>
<td>10000</td>
<td>You will need commercetools support to increase the allowable maximum value</td>
</tr>
<tr class="odd">
<td>actions</td>
<td>Update</td>
<td><br />
</td>
</tr>
<tr class="even">
<td>resourceTypeId</td>
<td>payment</td>
<td><br />
</td>
</tr>
</tbody>
</table>

</div>

</div>

# <a name="ResourceCustomisations"></a>Resource Customisations

## <a name="PaymentInteractions"></a>Payment Interactions

### <a name="Paymentauthorisationfailed"></a>Payment authorisation failed

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Type
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Key
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Purpose
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">payment-interface-interaction</td>
<td style="text-align: left;">cybersource_payment_failure</td>
<td style="text-align: left;">Used to save exception messages when there is a failure during payment</td>
</tr>
</tbody>
</table>

</div>

Fields

</div>

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Name
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Type
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Required
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">reason</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">true</td>
</tr>
<tr class="even">
<td style="text-align: left;">transactionId</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
</tr>
</tbody>
</table>

</div>

</div>

### <a name="Payerauthenticationenrolmentcheck"></a>Payer authentication enrolment check

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Type
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Key
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Purpose
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">payment-interface-interaction</td>
<td style="text-align: left;">cybersource_payer_authentication_enrolment_check</td>
<td style="text-align: left;">Stores values from request and response of payer authentication enrolment check. This is used in further Authorization calls.</td>
</tr>
</tbody>
</table>

</div>

</div>

Fields

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Name
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Type
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Required
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Source
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Notes
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">cardinalReferenceId</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">true</td>
<td style="text-align: left;">Cardinal JWT</td>
<td style="text-align: left;">Reference id of JWT sent to Cardinal as part of enrolment check</td>
</tr>
<tr class="even">
<td style="text-align: left;">authenticationRequired</td>
<td style="text-align: left;">Boolean</td>
<td style="text-align: left;">true</td>
<td style="text-align: left;">payerAuthEnrollReply_reasonCode</td>
<td style="text-align: left;">Indicates that the authentication window needs to be displayed. Set to true when the Cybersource reason code is 475</td>
</tr>
<tr class="odd">
<td style="text-align: left;">authorisationAllowed</td>
<td style="text-align: left;">Boolean</td>
<td style="text-align: left;">true</td>
<td style="text-align: left;">payerAuthEnrollReply_reasonCode</td>
<td style="text-align: left;">Indicates that an attempt to authorise the payment may be made. Set to true when Cybersource reason code is 100 or 475</td>
</tr>
<tr class="even">
<td style="text-align: left;">authenticationTransactionId</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;">payerAuthEnrollReply_authenticationTransactionID</td>
<td style="text-align: left;"><p>Value passed in Cardinal continue call to link back to Cybersource. Also passed back to Cybersource to validate authentication</p>
<p>Should always be present unless enrolment check times out</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;">paReq</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 69">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrollReply_paReq</span></p>
</div>
</div>
</div></td>
<td style="text-align: left;">Passed in Cardinal continue call when authentication is required</td>
</tr>
<tr class="even">
<td style="text-align: left;">acsUrl</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 69">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrollReply_acsURL</span></p>
</div>
</div>
</div></td>
<td style="text-align: left;">Passed in Cardinal continue call when authentication is required</td>
</tr>
<tr class="odd">
<td style="text-align: left;">xid</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 69">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrollReply_xid</span></p>
</div>
</div>
</div></td>
<td style="text-align: left;">Stored to verify enrolment check was made in case payment is challenged</td>
</tr>
<tr class="even">
<td style="text-align: left;">proofXml</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 26">
<section>
<div class="layoutArea">
<div class="column">
<div class="page" style="text-decoration: none;" title="Page 69">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrollReply_proofXML</span></p>
</div>
</div>
</div>
</div>
</div>
</section>
</div></td>
<td style="text-align: left;">Stored to verify enrolment check was made in case payment is challenged. 3D Secure 1.x only</td>
</tr>
<tr class="odd">
<td style="text-align: left;">specificationVersion</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 26">
<section>
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrollReply_specificationVersion</span></p>
</div>
</div>
</section>
</div></td>
<td style="text-align: left;">Stored to verify enrolment check was made in case payment is challenged</td>
</tr>
<tr class="even">
<td style="text-align: left;">directoryServerTransactionId</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 26">
<section>
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrollReply_directoryServerTransactionID</span></p>
</div>
</div>
</section>
</div></td>
<td style="text-align: left;">Stored to verify enrolment check was made in case payment is challenged. 3D Secure 2.x only</td>
</tr>
<tr class="odd">
<td style="text-align: left;">veresEnrolled</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;">payerAuthEnrollReply_veresEnrolled</td>
<td style="text-align: left;">Stored to verify enrolment check was made in case payment is challenged</td>
</tr>
<tr class="even">
<td style="text-align: left;">commerceIndicator</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;">payerAuthEnrollReply_commerceIndicator</td>
<td style="text-align: left;">Stored to verify enrolment check was made in case payment is challenged</td>
</tr>
<tr class="odd">
<td style="text-align: left;">eci</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 69">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrollReply_eci</span></p>
</div>
</div>
</div></td>
<td style="text-align: left;">Stored to verify enrolment check was made in case payment is challenged</td>
</tr>
</tbody>
</table>

</div>

</div>

### <a name="Payerauthenticationvalidation"></a>Payer authentication validation

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Type
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Key
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Purpose
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">payment-interface-interaction</td>
<td style="text-align: left;">cybersource_payer_authentication_validate_result</td>
<td style="text-align: left;">Stores values from response of payer authentication validation. These values can also be returned from the enrolment check for 3D Secure 2.x frictionless payments. These values are saved for recordkeeping purposes only.</td>
</tr>
</tbody>
</table>

</div>

</div>

Fields

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Name
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Type
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Required
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Source
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Notes
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">authenticationResult</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 69">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthValidateReply_authenticationResult or <span>payerAuthEnrolReply_authenticationResult</span></span></p>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="even">
<td style="text-align: left;">authenticationStatusMessage</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 69">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrolReply_authenticationStatusMessage or <span>payerAuthValidateReply_authenticationStatusMessage</span> </span></p>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="odd">
<td style="text-align: left;">ucafCollectionIndicator</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 29">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrolReply_ucafCollectionIndicator or <span>payerAuthValidateReply_ucafCollectionIndicator</span></span></p>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="even">
<td style="text-align: left;">ucafAuthenticationData</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 28">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrolReply_ucafAuthenticationData or <span>payerAuthValidateReply_ucafAuthenticationData</span></span></p>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="odd">
<td style="text-align: left;">cavv</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 28">
<div class="layoutArea">
<div class="column">
<p><span><span>payerAuthEnrolReply_cavv or </span>payerAuthValidateReply_cavv</span></p>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="even">
<td style="text-align: left;">cavvAlgorithm</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 171">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrolReply_cavvAlgorithm or <span>payerAuthValidateReply_cavvAlgorithm</span></span></p>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="odd">
<td style="text-align: left;">xid</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 28">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrollReply_xid<span> </span></span><span>or </span><span>payerAuthValidateReply_xid</span></p>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="even">
<td style="text-align: left;">specificationVersion</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 29">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrolReply_specificationVersion or <span>payerAuthValidateReply_specificationVersion</span></span></p>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="odd">
<td style="text-align: left;">directoryServerTransactionId</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 29">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrolReply_directoryServerTransactionID or <span>payerAuthValidateReply_directoryServerTransactionID</span></span></p>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="even">
<td style="text-align: left;">commerceIndicator</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 29">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrolReply_commerceIndicator or <span>payerAuthValidateReply_commerceIndicator</span></span></p>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="odd">
<td style="text-align: left;">eci</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 69">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrolReply_eci or <span>payerAuthValidateReply_eci</span></span></p>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="even">
<td style="text-align: left;">eciRaw</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 173">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrolReply_eciRaw or <span>payerAuthValidateReply_eciRaw</span></span></p>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="odd">
<td style="text-align: left;">paresStatus</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">false</td>
<td style="text-align: left;"><div class="page" style="text-decoration: none;" title="Page 171">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthEnrolReply_paresStatus or </span></p>
<div class="page" style="text-decoration: none;" title="Page 171">
<div class="layoutArea">
<div class="column">
<p><span>payerAuthValidateReply_paresStatus</span></p>
</div>
</div>
</div>
</div>
</div>
</div></td>
<td style="text-align: left;"><br />
</td>
</tr>
</tbody>
</table>

</div>

</div>

## <a name="Payment"></a>Payment

All fields are optional within commerce tools, but some fields are
contextually required - depending on the actions taken, the API
extension may reject a payment due to missing required fields.

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Type
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Key
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Purpose
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">payment</td>
<td style="text-align: left;">cybersource_payment_data</td>
<td style="text-align: left;">Cybersource custom payment fields</td>
</tr>
</tbody>
</table>

</div>

Fields

</div>

<div class="table-wrap">

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Field
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Type
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Required/Optional (At Auth)
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Source
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Notes
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">cs_token</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">R</td>
<td style="text-align: left;">Payment creation</td>
<td style="text-align: left;">Tokenized card details</td>
</tr>
<tr class="even">
<td style="text-align: left;">cs_cardType</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">R</td>
<td style="text-align: left;">Payment creation</td>
<td style="text-align: left;">Visa, Mastercard, etc.</td>
</tr>
<tr class="odd">
<td style="text-align: left;">cs_maskedPan</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">O</td>
<td style="text-align: left;">Payment creation</td>
<td style="text-align: left;">Recommended to be set for display purposes</td>
</tr>
<tr class="even">
<td style="text-align: left;">cs_cardExpiryMonth</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">O</td>
<td style="text-align: left;">Payment creation</td>
<td style="text-align: left;">Recommended to be set for display purposes</td>
</tr>
<tr class="odd">
<td style="text-align: left;">cs_cardExpiryYear</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">O</td>
<td style="text-align: left;">Payment creation</td>
<td style="text-align: left;">Recommended to be set for display purposes</td>
</tr>
<tr class="even">
<td style="text-align: left;">cs_requestJwt</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;"><p>Without payer auth (O)</p>
<p>With payer auth (R)</p></td>
<td style="text-align: left;">Payment creation</td>
<td style="text-align: left;">Retrieved from /jwt service. The same value is sent to Cardinal</td>
</tr>
<tr class="odd">
<td style="text-align: left;">cs_responseJwt</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;"><p>Without payer auth (O)</p>
<p>With payer auth (see notes)</p></td>
<td style="text-align: left;">Transaction addition</td>
<td style="text-align: left;">When authentication is required the value returned from Cardinal must be added to the payment</td>
</tr>
<tr class="even">
<td style="text-align: left;">cs_payerAuthenticationRequired</td>
<td style="text-align: left;">Boolean</td>
<td style="text-align: left;"><p>Without payer auth (O)</p>
<p>With payer auth (see notes)</p></td>
<td style="text-align: left;">Extension</td>
<td style="text-align: left;">Populated when processing payment creation. If true Cardinal.continue must be called to authenticate payer</td>
</tr>
<tr class="odd">
<td style="text-align: left;">cs_payerAuthenticationTransactionId</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;"><p>Without payer auth (O)</p>
<p>With payer auth (see notes)</p></td>
<td style="text-align: left;">Extension</td>
<td style="text-align: left;">Populated when processing payment creation. To be passed in Cardinal.continue call when required</td>
</tr>
<tr class="even">
<td style="text-align: left;">cs_payerAuthenticationAcsUrl</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;"><p>Without payer auth (O)</p>
<p>With payer auth (see notes)</p></td>
<td style="text-align: left;">Extension</td>
<td style="text-align: left;">Populated when processing payment creation. To be passed in Cardinal.continue call when required</td>
</tr>
<tr class="odd">
<td style="text-align: left;">cs_payerAuthenticationPaReq</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;"><p>Without payer auth (O)</p>
<p>With payer auth (see notes)</p></td>
<td style="text-align: left;">Extension</td>
<td style="text-align: left;">Populated when processing payment creation. To be passed in Cardinal.continue call when required</td>
</tr>
<tr class="even">
<td style="text-align: left;">cs_acceptHeader</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;"><p>Without payer auth (O)</p>
<p>With payer auth (R)</p></td>
<td style="text-align: left;">Payment creation</td>
<td style="text-align: left;">Value of the Accept header from the user's browser</td>
</tr>
<tr class="odd">
<td style="text-align: left;">cs_userAgentHeader</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;"><p>Without payer auth (O)</p>
<p>With payer auth (R)</p></td>
<td style="text-align: left;">Payment creation</td>
<td style="text-align: left;">Value of the UserAgent header from the user's browser</td>
</tr>
<tr class="even">
<td style="text-align: left;">cs_deviceFingerprintId</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">O</td>
<td style="text-align: left;">Payment creation</td>
<td style="text-align: left;">Value of session id used for device fingerprinting</td>
</tr>
</tbody>
</table>

</div>

</div>

</div>

</div>

</div>

</div>