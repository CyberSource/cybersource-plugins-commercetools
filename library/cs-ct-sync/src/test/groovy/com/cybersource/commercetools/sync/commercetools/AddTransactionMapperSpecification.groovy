package com.cybersource.commercetools.sync.commercetools

import Model.*
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.payments.TransactionType
import org.javamoney.moneta.Money
import spock.lang.Specification
import spock.lang.Unroll

import javax.money.Monetary

class AddTransactionMapperSpecification extends Specification {

    def testObj = new AddTransactionMapper()

    def 'Should create a correct action for a successful auth'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        summary.applicationInformation = new TssV2TransactionsGet200ResponseApplicationInformation()
        summary.applicationInformation.applications = [new TssV2TransactionsGet200ResponseApplicationInformationApplications()]
        summary.applicationInformation.applications[0].name = 'ics_auth'
        summary.applicationInformation.applications[0].reasonCode = '100'

        summary.orderInformation = new TssV2TransactionsPost201ResponseEmbeddedOrderInformation()
        summary.orderInformation.amountDetails = new Ptsv2paymentsidreversalsReversalInformationAmountDetails()
        summary.orderInformation.amountDetails.totalAmount = '12.34'
        summary.orderInformation.amountDetails.currency = 'GBP'

        summary.submitTimeUtc = '2019-09-25T10:53:28Z'
        summary.id = 'id'

        when:
        def result = testObj.createAction(summary, summary.applicationInformation.applications[0], TransactionType.AUTHORIZATION).get()

        then:
        result.transaction.interactionId == 'id'
        result.transaction.state == TransactionState.SUCCESS
        result.transaction.timestamp.dateTimeString == '2019-09-25T10:53:28Z'
        result.transaction.type == TransactionType.AUTHORIZATION
        result.transaction.amount.isEqualTo(Money.of(12.34G, Monetary.getCurrency('GBP')))
    }

    def 'Should create a correct action for a pending auth'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        summary.applicationInformation = new TssV2TransactionsGet200ResponseApplicationInformation()
        summary.applicationInformation.applications = [new TssV2TransactionsGet200ResponseApplicationInformationApplications()]
        summary.applicationInformation.applications[0].name = 'ics_decision'
        summary.applicationInformation.applications[0].reasonCode = '480'

        summary.orderInformation = new TssV2TransactionsPost201ResponseEmbeddedOrderInformation()
        summary.orderInformation.amountDetails = new Ptsv2paymentsidreversalsReversalInformationAmountDetails()
        summary.orderInformation.amountDetails.totalAmount = '12.34'
        summary.orderInformation.amountDetails.currency = 'GBP'

        summary.submitTimeUtc = '2019-09-25T10:53:28Z'
        summary.id = 'id'

        when:
        def result = testObj.createAction(summary, summary.applicationInformation.applications[0], TransactionType.AUTHORIZATION).get()

        then:
        result.transaction.interactionId == 'id'
        result.transaction.state == TransactionState.PENDING
        result.transaction.timestamp.dateTimeString == '2019-09-25T10:53:28Z'
        result.transaction.type == TransactionType.AUTHORIZATION
        result.transaction.amount.isEqualTo(Money.of(12.34G, Monetary.getCurrency('GBP')))
    }

    @Unroll
    def 'Should create a correct action for a failed auth (reasonCode #reasonCode)'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        summary.applicationInformation = new TssV2TransactionsGet200ResponseApplicationInformation()
        summary.applicationInformation.applications = [new TssV2TransactionsGet200ResponseApplicationInformationApplications()]
        summary.applicationInformation.applications[0].name = 'ics_auth'
        summary.applicationInformation.applications[0].reasonCode = reasonCode

        summary.orderInformation = new TssV2TransactionsPost201ResponseEmbeddedOrderInformation()
        summary.orderInformation.amountDetails = new Ptsv2paymentsidreversalsReversalInformationAmountDetails()
        summary.orderInformation.amountDetails.totalAmount = '12.34'
        summary.orderInformation.amountDetails.currency = 'GBP'

        summary.submitTimeUtc = '2019-09-25T10:53:28Z'
        summary.id = 'id'

        when:
        def result = testObj.createAction(summary, summary.applicationInformation.applications[0], TransactionType.AUTHORIZATION).get()

        then:
        result.transaction.interactionId == 'id'
        result.transaction.state == TransactionState.FAILURE
        result.transaction.timestamp.dateTimeString == '2019-09-25T10:53:28Z'
        result.transaction.type == TransactionType.AUTHORIZATION
        result.transaction.amount.isEqualTo(Money.of(12.34G, Monetary.getCurrency('GBP')))

        where:
        reasonCode << ['0', '-1']
    }

}
