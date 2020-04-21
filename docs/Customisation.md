<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

# Customisation

</div>

<div id="content" class="view">

<div id="main-content" class="wiki-content group">

## Customising payment processing

The following table documents the name of the Service, Validation Rule and Request Transformer in the library code which can be used to customise the respective Payment Event for a given Payment Method.

<div class="table-wrap">

<table>
<thead>
<tr class="header">
<th style="text-align: left;"><div class="tablesorter-header-inner">
Event
</div></th>
<th>Payment Method</th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Service
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Validation Rules
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Request Transformer
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Response Transformer
</div></th>
<th style="text-align: left;"><div class="tablesorter-header-inner">
Notes
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">Payment creation</td>
<td>creditCard, visaCheckout</td>
<td style="text-align: left;">NoOpPaymentService</td>
<td style="text-align: left;"><br />
</td>
<td style="text-align: left;"><br />
</td>
<td style="text-align: left;"><br />
</td>
<td style="text-align: left;">Immediately returns empty success response</td>
</tr>
<tr class="even">
<td style="text-align: left;">Payment creation</td>
<td>creditCardWithPayerAuth</td>
<td style="text-align: left;">PayerAuthEnrolmentCheckService</td>
<td style="text-align: left;"><pre><code>TokenValidationRule</code></pre>
<pre><code>PaymentGreaterThanZeroValidationRule</code></pre>
<pre><code>PayerAuthEnrolmentHeadersValidationRule</code></pre></td>
<td style="text-align: left;">PayerAuthEnrolmentCheckRequestTransformer</td>
<td style="text-align: left;">PayerAuthEnrolmentCheckResponseTransformer</td>
<td style="text-align: left;">Validates input and makes enrolment check call</td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Payment update</p>
<p>(Auth)</p></td>
<td>creditCard</td>
<td style="text-align: left;">PaymentAuthorizationService</td>
<td style="text-align: left;"><pre><code>TokenValidationRule</code></pre>
<pre><code>PaymentGreaterThanZeroValidationRule</code></pre>
<pre><code>ExpectNoEnrollmentDataValidationRule</code></pre></td>
<td style="text-align: left;">AuthorizationRequestTransformer</td>
<td style="text-align: left;">ReasonCodeResponseTransformer</td>
<td style="text-align: left;"><p>Validates input and makes payment authorisation call</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Payment update</p>
<p>(Auth)</p></td>
<td>creditCardWithPayerAuth</td>
<td style="text-align: left;">PaymentAuthorizationService</td>
<td style="text-align: left;"><pre><code>TokenValidationRule</code></pre>
<pre><code>PaymentGreaterThanZeroValidationRule</code></pre>
<pre><code>PayerAuthEnrolmentHeadersValidationRule</code></pre>
<pre><code>PayerAuthEnrolmentResponseDataValidationRule</code></pre>
<pre><code>AuthorizationAllowedValidationRule</code></pre></td>
<td style="text-align: left;">AuthorizationWithPayerAuthRequestTransformer</td>
<td style="text-align: left;">AuthorizationWithPayerAuthResponseTransformer</td>
<td style="text-align: left;"><p>Validates input and makes authentication validation call</p>
<p>and payment authorisation call</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Payment <br />
update</p>
<p>(Auth)</p></td>
<td>visaCheckout</td>
<td style="text-align: left;">VisaCheckoutAuthorizationService</td>
<td style="text-align: left;"><pre><code>TokenValidationRule</code></pre>
<pre><code>ExpectNoEnrollmentDataValidationRule</code></pre>
<pre><code>PaymentGreaterThanZeroValidationRule</code></pre></td>
<td style="text-align: left;"><pre><code>VisaCheckoutAuthorizationRequestTransformer</code></pre>
<pre><code>VisaCheckoutDataRequestTransformer</code></pre></td>
<td style="text-align: left;"><pre><code>ReasonCodeResponseTransformer</code></pre></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>Payment update</p>
<p>(Capture)</p></td>
<td>visaCheckout</td>
<td style="text-align: left;">PaymentCaptureService</td>
<td style="text-align: left;"><pre><code>expectTransactionValidationRule(objectMapper, TransactionState.INITIAL, TransactionType.CHARGE)</code></pre>
<pre><code>expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION)</code></pre>
<pre><code>doNotExpectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.CHARGE)</code></pre></td>
<td style="text-align: left;"><pre><code>VisaCheckoutCaptureRequestTransformer</code></pre></td>
<td style="text-align: left;"><pre><code>ReasonCodeResponseTransformer</code></pre></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p>Payment update</p>
<p>(Capture)</p></td>
<td>creditCardWithPayerAuth, creditCard</td>
<td style="text-align: left;"><pre><code>PaymentCaptureService</code></pre></td>
<td style="text-align: left;"><pre><code>expectTransactionValidationRule(objectMapper, TransactionState.INITIAL, TransactionType.CHARGE)</code></pre>
<pre><code>expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION)</code></pre>
<pre><code>doNotExpectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.CHARGE)</code></pre></td>
<td style="text-align: left;"><pre><code>CaptureRequestTransformer</code></pre></td>
<td style="text-align: left;"><pre><code>ReasonCodeResponseTransformer</code></pre></td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="even">
<td style="text-align: left;">Payment update (CancelAuthorization)</td>
<td>creditCard, creditCardWithPayerAuth</td>
<td style="text-align: left;">PaymentCancelAuthorizationService</td>
<td style="text-align: left;"><pre><code>expectTransactionValidationRule(objectMapper, TransactionState.INITIAL, TransactionType.CANCEL_AUTHORIZATION)</code></pre>
<pre><code>expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION)</code></pre>
<pre><code>doNotExpectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.CANCEL_AUTHORIZATION)</code></pre>
<pre><code>CancelAuthAmountEqualsAuthAmountValidationRule(objectMapper)</code></pre></td>
<td style="text-align: left;">AuthReversalRequestTransformer</td>
<td style="text-align: left;">ReasonCodeResponseTransformer</td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="odd">
<td style="text-align: left;">Payment update (CancelAuthorization)</td>
<td>visaCheckout</td>
<td style="text-align: left;">PaymentCancelAuthorizationService</td>
<td style="text-align: left;"><pre><code>expectTransactionValidationRule(objectMapper, TransactionState.INITIAL, TransactionType.CANCEL_AUTHORIZATION)</code></pre>
<pre><code>expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION)</code></pre>
<pre><code>doNotExpectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.CANCEL_AUTHORIZATION)</code></pre>
<pre><code>CancelAuthAmountEqualsAuthAmountValidationRule(objectMapper)</code></pre></td>
<td style="text-align: left;">VisaCheckoutAuthReversalRequestTransformer</td>
<td style="text-align: left;">ReasonCodeResponseTransformer</td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="even">
<td style="text-align: left;">Payment update (Refund)</td>
<td>creditCard, creditCardWithPayerAuth</td>
<td style="text-align: left;">PaymentRefundService</td>
<td style="text-align: left;"><pre><code>expectTransactionValidationRule(objectMapper, TransactionState.INITIAL, TransactionType.REFUND)</code></pre>
<pre><code>expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION)</code></pre>
<pre><code>expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.CHARGE)</code></pre>
<pre><code>RefundTotalNoMoreThanChargeAmountValidationRule(objectMapper)</code></pre></td>
<td style="text-align: left;">CreditRequestTransformer</td>
<td style="text-align: left;">ReasonCodeResponseTransformer</td>
<td style="text-align: left;"><br />
</td>
</tr>
<tr class="odd">
<td style="text-align: left;">Payment update (Refund)</td>
<td>visaCheckout</td>
<td style="text-align: left;">PaymentRefundService</td>
<td style="text-align: left;"><pre><code>expectTransactionValidationRule(objectMapper, TransactionState.INITIAL, TransactionType.REFUND)</code></pre>
<pre><code>expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION)</code></pre>
<pre><code>expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.CHARGE)</code></pre>
<pre><code>RefundTotalNoMoreThanChargeAmountValidationRule(objectMapper)</code></pre></td>
<td style="text-align: left;">VisaCheckoutCreditRequestTransformer</td>
<td style="text-align: left;">ReasonCodeResponseTransformer</td>
<td style="text-align: left;"><br />
</td>
</tr>
</tbody>
</table>

</div>

## Customising billing address mapping

By default the reference app uses the AuthorizationRequestTransformer to handle field mapping from commercetools to Cybersource. It is configured with a BillToFieldGroupTransformer which maps the cart billing address to Cybersource fields. If you require different commercetools address fields to be mapped, or indeed if you store your address elsewhere

  - Create a class implementing FieldGroupTransformer\<BillToFieldGroup\>
    - In the configure method you have access to a PaymentDetails object which contains the commercetools payment and cart resources relating to the authorize request
    - The configure method returns a list of BillToFieldGroup. In this case you should return a list with a single element
  - Create a customised RequestTransformer to replace the AuthorizationRequestTransformer. e.g.
```java
public class CustomAuthorizationRequestTransformer extends RequestTransformer {
  public AuthorizationRequestTransformer(String merchantId) {
    super(Arrays.asList(
        ...
        new CustomBillToFieldGroupTransformer()
    ));
  }
}
```
Remember to include the other default field group transformers in your class
  - Reconfigure the reference app to use the customised transformer
```java
var authorizationRequestTransformer = new CustomAuthorizationRequestTransformer(merchantId(cybersourceProperties));
var authorizationResponseTransformer = new ReasonCodeResponseTransformer();

return new PaymentAuthorizationService(validator, authorizationRequestTransformer, authorizationResponseTransformer, cybersourceClient, cartRetriever);
```

## Customising shipping address mapping

The process for customising the shipping address mapping is much the same as for billing addresses, with the following differences
  - The classes involved are ShipToFieldGroupTransformer and ShipToFieldGroup
  - It may be the case that not all payments have a shipping address. In this case you can return an empty list from your FieldGroupTransformer

</div>

</div>

</div>

</div>