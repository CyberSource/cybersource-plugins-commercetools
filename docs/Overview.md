# Overview

  - [Modules](#Modules)
  - [Architecture](#Architecture)
  - [Endpoints](#Endpoints)
  - [Validation](#Validation)
  - [Error handling](#Errorhandling)
      - [Communications failure on Payment Create](#CommunicationsfailureonPaymentCreate)
      - [Payment service request failures](#requestfailures)
      - [API Extension errors](#APIExtensionerrors)

The ISV Commercetools integration is a set of libraries and a
reference implementation that allows processing payments registered in
Commercetools through the Cybersource payment gateway. It is realised by
the usage of a Spring Boot app configured as a Payment Create and
Payment Update API extension for a Commercetools project, and interacts
with Cybersource to carry out various actions depending on the payment
state, making further updates to the Commercetools payment as
appropriate when Cybersource has processed the request.

It is intended that when using the reference application the developer would consider how the application should be secured, ran and scaled before it is exposed to the outside world. The reference application provides a reference for functional integration only.

# <a name="Modules"></a>Modules

The project consists of the following modules:

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Module
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Description
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">library</td>
<td style="text-align: left;">Various libraries for interacting with Commercetools and Cybersource</td>
</tr>
<tr class="even">
<td style="text-align: left;">reference</td>
<td style="text-align: left;">Spring Boot reference application that uses the libraries above to provide a functional commercetools API Extension.<br />
Also provides service for creation of Cybersource one-time keys and JWT tokens for Cardinal, although this can be extracted to its own service if needed.</td>
</tr>
<tr class="odd">
<td style="text-align: left;">sync</td>
<td style="text-align: left;">Example application demoing synchronisation of payments between Commercetools and Cybersource</td>
</tr>
</tbody>
</table>

# <a name="Architecture"></a>Architecture

The architecture of the implementation looks as follows - the dotted
lines show optional features of the implementation:

![High Level Architecture](images/High-Level-Architecture.svg)  

# <a name="Endpoints"></a>Endpoints

The reference application exposes the following endpoints

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
URL
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Method
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Input
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Output
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Description
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">http://{host}:{port}/keys</td>
<td style="text-align: left;">POST</td>
<td style="text-align: left;">None</td>
<td style="text-align: left;">JSON Web Key</td>
<td style="text-align: left;">Provides a one-time key to be used to tokenise credit card details.</td>
</tr>
<tr class="even">
<td style="text-align: left;">http://{host}:{port}/jwt</td>
<td style="text-align: left;">POST</td>
<td style="text-align: left;">None</td>
<td style="text-align: left;">JSON Web Token</td>
<td style="text-align: left;">JWT to be sent to Cardinal when initialising payer authentication</td>
</tr>
<tr class="odd">
<td style="text-align: left;">http://{host}:{port}/api/extension/payment/create</td>
<td style="text-align: left;">POST</td>
<td style="text-align: left;">Message containing payment</td>
<td style="text-align: left;">Updates to be made to payment</td>
<td style="text-align: left;">Receives and processes payment create messages.<br />
This endpoint should be defined in Commercetools as the Payment Create API Extension</td>
</tr>
<tr class="even">
<td style="text-align: left;">http://{host}:{port}/api/extension/payment/update</td>
<td style="text-align: left;">POST</td>
<td style="text-align: left;">Message containing payment</td>
<td style="text-align: left;">Updates to be made to payment</td>
<td style="text-align: left;">Receives and processes payment update messages.<br />
This endpoint should be defined in Commercetools as the Payment Update API Extension</td>
</tr>
</tbody>
</table>

<span style="font-size: 1.714em;">Requirements and Design Decisions</span>

The ISV plugin assumes full control of the management of Payment
resources. Due to this, there should be no manual modifications to
payments, and also no other payments API Extensions that affect payments
should be running in parallel.

For this integration, a Payment is a representation of a single charge
to a customer. Due to this, you can not authorize a payment multiple
times. If you are attempting to use split payments for an order, you
will need to create multiple payments for the order. 

# <a name="Validation"></a>Validation

If required data is missing or the operation is invalid (such as trying
to capture a payment without authorizing the payment beforehand), when
you try to create or update a payment you will receive a response
containing an array of one or more errors as per the [commercetools
documentation](https://docs.commercetools.com/http-api-errors.html#errors-from-an-api-extension).

While Commercetools handles some validations (in terms of required
fields), the reference application implements further validations to
ensure that payments are in the correct state before proceeding. These
validations vary per action, and can be found in more detail on the
relevant Checkout Steps pages.

# <a name="Errorhandling"></a>Error handling

When an attempt at processing a payment there can be varying responses
depending on the reason for failure.

## <a name="CommunicationsfailureonPaymentCreate"></a>Communications failure on Payment Create

If on a payment create the API extension cannot communicate with
Cybersource, the API Extension will return
an `InvalidOperation` error.

## <a name="requestfailures"></a>Payment service request failures

When Cybersource returns an unsuccessful response code, the relevant
transaction's state will be updated to **Failure**, and the transaction
will be updated to contain an interactionId containing the request ID of
the Cybersource request. This can be used to search for the transaction
in Cybersource Merchant Center to diagnose the issue.

## <a name="APIExtensionerrors"></a>API Extension errors

When there is an error in the API Extension itself, the payment will be
updated to contain a new interfaceInteraction of type
'isv\_payment\_failure', containing a message from the exception
that was thrown.

