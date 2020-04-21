package com.cybersource.commercetools.sync.commercetools

import Model.TssV2TransactionsGet200ResponseApplicationInformation
import Model.TssV2TransactionsGet200ResponseApplicationInformationApplications
import Model.TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries
import io.sphere.sdk.payments.TransactionType
import spock.lang.Specification
import spock.lang.Unroll

class TransactionTypeMapperSpecification extends Specification {

    def testObject = new TransactionTypeMapper()

    @Unroll
    def 'should map to the expected transaction type for cybersource application #application' () {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        def application = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        summary.applicationInformation = new TssV2TransactionsGet200ResponseApplicationInformation()
        summary.applicationInformation.applications = [application]
        application.name = applicationName
        application.RCode = '1'

        when:
        def result = testObject.mapTransactionType(application)

        then:
        result == expectedTransactionType

        where:
        applicationName     | expectedTransactionType
        'ics_auth'          | Optional.of(TransactionType.AUTHORIZATION)
        'ics_bill'          | Optional.of(TransactionType.CHARGE)
        'ics_auth_reversal' | Optional.of(TransactionType.CANCEL_AUTHORIZATION)
        'ics_credit'        | Optional.of(TransactionType.REFUND)
        'ics_decision'      | Optional.of(TransactionType.AUTHORIZATION)
        'invalid'           | Optional.empty()
        null                | Optional.empty()
    }

}
