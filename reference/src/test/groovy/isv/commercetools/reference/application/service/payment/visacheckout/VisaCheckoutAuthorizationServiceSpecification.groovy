package isv.commercetools.reference.application.service.payment.visacheckout

import com.neovisionaries.i18n.CountryCode
import io.sphere.sdk.carts.Cart
import io.sphere.sdk.carts.commands.updateactions.SetBillingAddress
import io.sphere.sdk.carts.commands.updateactions.SetShippingAddress
import io.sphere.sdk.client.SphereClient
import io.sphere.sdk.models.Address
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionState
import io.sphere.sdk.payments.commands.updateactions.SetCustomField
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentDetails
import isv.commercetools.mapping.transformer.RequestTransformer
import isv.commercetools.mapping.transformer.auth.visacheckout.VisaCheckoutUpdateActionCreator
import isv.commercetools.mapping.transformer.response.CybersourceResponseToFieldGroupTransformer
import isv.commercetools.mapping.transformer.response.ResponseTransformer
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory
import isv.commercetools.reference.application.validation.ResourceValidator
import isv.payments.CybersourceClient
import isv.payments.model.CybersourceRequest
import isv.payments.model.fields.BillToFieldGroup
import isv.payments.model.fields.CardFieldGroup
import isv.payments.model.fields.ShipToFieldGroup
import isv.payments.model.fields.VisaCheckoutResponseFieldGroup
import spock.lang.Specification

import java.util.concurrent.CompletionStage

class VisaCheckoutAuthorizationServiceSpecification extends Specification {

    VisaCheckoutAuthorizationService testObj

    PaymentDetailsFactory paymentDetailsFactoryMock
    ResourceValidator<CustomPayment> paymentValidatorMock
    ResourceValidator<Cart> cartValidatorMock
    RequestTransformer authorizationRequestTransformerMock
    CybersourceRequest visaCheckoutRequestMock
    ResponseTransformer responseTransformerMock
    CybersourceResponseToFieldGroupTransformer cybersourceResponseTransformerMock

    SphereClient paymentSphereClientMock
    CybersourceClient cybersourceClientMock
    VisaCheckoutQueryService queryServiceMock
    VisaCheckoutUpdateActionCreator actionCreatorMock

    CustomPayment customPaymentMock = Mock()
    Payment paymentMock = Mock()
    Cart cartMock = Mock()

    PaymentDetails paymentDetailsMock

    def failTransactionUpdate = ChangeTransactionState.of(TransactionState.FAILURE, '123')
    def successTransactionUpdate = ChangeTransactionState.of(TransactionState.SUCCESS, '123')

    def 'setup'() {
        paymentDetailsFactoryMock = Mock()
        paymentValidatorMock = Mock()
        cartValidatorMock = Mock()
        authorizationRequestTransformerMock = Mock()
        responseTransformerMock = Mock()
        cybersourceResponseTransformerMock = Mock()
        cybersourceClientMock = Mock()
        paymentSphereClientMock = Mock()
        paymentDetailsMock = Mock()
        queryServiceMock = Mock()
        actionCreatorMock = Mock()

        visaCheckoutRequestMock = Mock()
        customPaymentMock = Mock()
        paymentMock = Mock()
        cartMock = Mock()

        paymentDetailsMock.customPayment >> customPaymentMock
        customPaymentMock.basePayment >> paymentMock
        paymentDetailsMock.cart >> cartMock
        customPaymentMock.token >> 'someOrderId'

        testObj = Spy(VisaCheckoutAuthorizationService, constructorArgs:[
                paymentDetailsFactoryMock,
                paymentValidatorMock,
                cartValidatorMock,
                authorizationRequestTransformerMock,
                responseTransformerMock,
                cybersourceClientMock,
                paymentSphereClientMock,
                queryServiceMock,
                actionCreatorMock,
                cybersourceResponseTransformerMock
        ])
    }

    def 'Should update cart and payment if payment was successful'() {
        given: 'the super authorize call will return a successful response'
        testObj.superProcess(_) >> [successTransactionUpdate]
        def billingGroup = new BillToFieldGroup()
        billingGroup.country = 'GB'
        def shippingGroup = new ShipToFieldGroup()
        shippingGroup.country = 'GB'
        def visaResponseFieldGroup = new VisaCheckoutResponseFieldGroup()
        visaResponseFieldGroup.cardType = 'VISA'
        cybersourceResponseTransformerMock.transform(_, 'billTo_', BillToFieldGroup) >> billingGroup
        cybersourceResponseTransformerMock.transform(_, 'shipTo_', ShipToFieldGroup) >> shippingGroup
        def cardFieldGroupMock = Mock(CardFieldGroup)
        cybersourceResponseTransformerMock.transform(_, 'card_', CardFieldGroup) >> cardFieldGroupMock
        cybersourceResponseTransformerMock.transform(_, 'vcReply_', VisaCheckoutResponseFieldGroup) >> visaResponseFieldGroup

        when:
        def result = testObj.process(paymentDetailsMock)

        then: 'cybersource is queried, returning a shipping address, billing address, and card information'
        1 * queryServiceMock.getVisaCheckoutData(paymentDetailsMock) >> [
                'shipTo_country':'GB',
                'billTo_country':'GB',
        ]

        and: 'the action creator should be called to build cart actions for shipping and billing, and these should be executed via ct client'
        1 * actionCreatorMock.buildShippingCartUpdateActions(_) >> [
                SetShippingAddress.of(Address.of(CountryCode.AU)),
        ]
        1 * actionCreatorMock.buildBillingCartUpdateActions(_) >> [
                SetBillingAddress.of(Address.of(CountryCode.GB)),
        ]

        1 * paymentSphereClientMock.execute(_) >> { arguments ->
            assert arguments[0].updateActions.size() == 2
            def shippingAction = (SetShippingAddress) arguments[0].updateActions.find {
                it instanceof SetShippingAddress
            }
            def billingAction = (SetBillingAddress) arguments[0].updateActions.find { it instanceof SetBillingAddress }
            assert shippingAction.address.country == CountryCode.AU
            assert billingAction.address.country == CountryCode.GB

            Mock(CompletionStage)
        }

        and: 'the action creator should be called to build payment actions, and these should be returned in the result'
        1 * actionCreatorMock.buildPaymentUpdateActions(cardFieldGroupMock, visaResponseFieldGroup) >> [
                SetCustomField.ofObject('actionCreatorActions1', 'someValue'),
                SetCustomField.ofObject('actionCreatorActions2', 'someValue'),
        ]

        result.size() == 3
        result.find { it == successTransactionUpdate }
        result.find { it instanceof SetCustomField && ((SetCustomField) it).name == 'actionCreatorActions1' }
        result.find { it instanceof SetCustomField && ((SetCustomField) it).name == 'actionCreatorActions2' }
    }

    def 'Should not update billing address if it doesnt exist'() {
        given: 'the super authorize call will return a successful response'
        testObj.superProcess(_) >> [successTransactionUpdate]

        def shippingGroup = new ShipToFieldGroup()
        shippingGroup.country = 'GB'

        cybersourceResponseTransformerMock.transform(_, 'shipTo_', ShipToFieldGroup) >> shippingGroup
        def cardFieldGroupMock = Mock(CardFieldGroup)
        def visaResponseFieldGroupMock = Mock(VisaCheckoutResponseFieldGroup)
        cybersourceResponseTransformerMock.transform(_, 'card_', CardFieldGroup) >> cardFieldGroupMock
        cybersourceResponseTransformerMock.transform(_, 'vcReply_', VisaCheckoutResponseFieldGroup) >> visaResponseFieldGroupMock

        when:
        def result = testObj.process(paymentDetailsMock)

        then: 'cybersource is queried, returning a shipping address and card information'
        1 * queryServiceMock.getVisaCheckoutData(paymentDetailsMock) >> [
                'shipTo_country':'GB',
        ]

        and: 'the action creator should be called to build cart actions for shipping only, and these should be executed via ct client'
        1 * actionCreatorMock.buildShippingCartUpdateActions(_) >> [
                SetShippingAddress.of(Address.of(CountryCode.GB)),
        ]
        0 * actionCreatorMock.buildBillingCartUpdateActions(_)

        1 * paymentSphereClientMock.execute(_) >> { arguments ->
            assert arguments[0].updateActions.size() == 1
            def shippingAction = (SetShippingAddress) arguments[0].updateActions.find {
                it instanceof SetShippingAddress
            }
            assert shippingAction.address.country == CountryCode.GB

            Mock(CompletionStage)
        }

        and: 'the action creator should be called to build payment actions, and these should be returned in the result'
        1 * actionCreatorMock.buildPaymentUpdateActions(cardFieldGroupMock, visaResponseFieldGroupMock) >> [
                SetCustomField.ofObject('actionCreatorActions', 'someValue'),
        ]

        result.size() == 2
        result.find { it == successTransactionUpdate }
        result.find { it instanceof SetCustomField && ((SetCustomField) it).name == 'actionCreatorActions' }
    }

    def 'Should not update shipping address if it doesnt exist'() {
        given: 'the super authorize call will return a successful response'
        testObj.superProcess(_) >> [successTransactionUpdate]

        def billingGroup = new BillToFieldGroup()
        billingGroup.country = 'GB'
        cybersourceResponseTransformerMock.transform(_, 'billTo_', BillToFieldGroup) >> billingGroup
        def cardFieldGroupMock = Mock(CardFieldGroup)
        cybersourceResponseTransformerMock.transform(_, 'card_', CardFieldGroup) >> cardFieldGroupMock
        def visaResponseFieldGroup = Mock(VisaCheckoutResponseFieldGroup)
        cybersourceResponseTransformerMock.transform(_, 'vcReply_', VisaCheckoutResponseFieldGroup) >> visaResponseFieldGroup

        when:
        def result = testObj.process(paymentDetailsMock)

        then: 'cybersource is queried, returning a shipping address, billing address, and card information'
        1 * queryServiceMock.getVisaCheckoutData(paymentDetailsMock) >> [
                'billTo_country':'GB',
        ]

        and: 'the action creator should be called to build cart actions for shipping only, and these should be executed via ct client'
        1 * actionCreatorMock.buildBillingCartUpdateActions(_) >> [
                SetBillingAddress.of(Address.of(CountryCode.GB)),
        ]
        0 * actionCreatorMock.buildShippingCartUpdateActions(_)

        1 * paymentSphereClientMock.execute(_) >> { arguments ->
            assert arguments[0].updateActions.size() == 1
            def billingAction = (SetBillingAddress) arguments[0].updateActions.find { it instanceof SetBillingAddress }
            assert billingAction.address.country == CountryCode.GB

            Mock(CompletionStage)
        }

        and: 'the action creator should be called to build payment actions, and these should be returned in the result'
        1 * actionCreatorMock.buildPaymentUpdateActions(cardFieldGroupMock, visaResponseFieldGroup) >> [
                SetCustomField.ofObject('actionCreatorActions', 'someValue'),
        ]

        result.size() == 2
        result.find { it == successTransactionUpdate }
        result.find { it instanceof SetCustomField && ((SetCustomField) it).name == 'actionCreatorActions' }
    }

    def 'should populate payment and cart on PaymentDetails'() {
        when:
        def result = testObj.populatePaymentDetails(customPaymentMock)

        then:
        1 * paymentDetailsFactoryMock.paymentDetailsWithCart(customPaymentMock) >> paymentDetailsMock

        and:
        result == paymentDetailsMock
    }

}
