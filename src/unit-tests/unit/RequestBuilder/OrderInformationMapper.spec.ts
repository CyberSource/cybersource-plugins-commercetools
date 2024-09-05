import test from 'ava';
import dotenv from 'dotenv';

import { FunctionConstant } from '../../../constants/functionConstant';
import { OrderInformationMapper } from '../../../requestBuilder/OrderInformationMapper';
import AddTokenServiceConst from '../../const/AddTokenServiceConst';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import LineItemMapperConst from '../../const/LineItemMapperConst';
import PaymentHandlerConst from '../../const/PaymentHandlerConst';

dotenv.config();

const orderInformationForAuth = new OrderInformationMapper(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, PaymentAuthorizationServiceConstCC.payment, PaymentHandlerConst.authorizationHandlerUpdateTransactions, LineItemMapperConst.discountedCart, AddTokenServiceConst.addTokenResponseCustomerObj, AddTokenServiceConst.addTokenAddress, 'Payments', 'USD');
const orderInformationForCharge = new OrderInformationMapper(FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, PaymentAuthorizationServiceConstCC.payment, PaymentHandlerConst.authorizationHandlerUpdateTransactions, LineItemMapperConst.discountedCart, AddTokenServiceConst.addTokenResponseCustomerObj, AddTokenServiceConst.addTokenAddress, 'Payments', 'USD')
const orderInformationForRefund = new OrderInformationMapper(FunctionConstant.FUNC_GET_REFUND_RESPONSE, PaymentAuthorizationServiceConstCC.payment, PaymentHandlerConst.authorizationHandlerUpdateTransactions, LineItemMapperConst.discountedCart, AddTokenServiceConst.addTokenResponseCustomerObj, AddTokenServiceConst.addTokenAddress, 'Payments', 'USD')
const orderInformationForAuthReversal = new OrderInformationMapper(FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, PaymentAuthorizationServiceConstCC.payment, PaymentHandlerConst.authorizationHandlerUpdateTransactions, LineItemMapperConst.discountedCart, AddTokenServiceConst.addTokenResponseCustomerObj, AddTokenServiceConst.addTokenAddress, 'Payments', 'USD')
const orderInformationForCaptureContext = new OrderInformationMapper(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, PaymentAuthorizationServiceConstCC.payment, PaymentHandlerConst.authorizationHandlerUpdateTransactions, LineItemMapperConst.discountedCart, AddTokenServiceConst.addTokenResponseCustomerObj, AddTokenServiceConst.addTokenAddress, 'Payments', 'USD')
const orderInformationForAddToken = new OrderInformationMapper(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, PaymentAuthorizationServiceConstCC.payment, PaymentHandlerConst.authorizationHandlerUpdateTransactions, LineItemMapperConst.discountedCart, AddTokenServiceConst.addTokenResponseCustomerObj, AddTokenServiceConst.addTokenAddress, 'Payments', 'USD')

test.serial('Get order information for auth', (t) => {
    const result = orderInformationForAuth.getOrderInformation();
    let i=0;
    if('billTo' in result && 'shipTo' in result && 'lineItems' in result && 'amountDetails' in result) {
        i++;
    }
    t.is(i, 1);
})

test.serial('Get order information for charge', (t) => {
    const result : any = orderInformationForCharge.getOrderInformation();
    t.is(result.amountDetails.totalAmount, 69.7);
    t.is(result.amountDetails.currency, 'USD');
})

test.serial('Get order information for refund', (t) => {
    const result : any = orderInformationForRefund.getOrderInformation();
    t.deepEqual(result, {});
})

test.serial('Get order information for auth reversal', (t) => {
    const result : any = orderInformationForAuthReversal.getOrderInformation();
    t.truthy(result.lineItems[0].productCode);
    t.truthy(result.lineItems[0].productName);
    t.truthy(result.lineItems[0].productSku);
    t.truthy(result.lineItems[0].quantity);
    t.truthy(result.lineItems[0].totalAmount);
    t.truthy(result.lineItems[0].unitPrice);
})

test.serial('Get order information for capture context', (t) => {
    const result : any = orderInformationForCaptureContext.getOrderInformation();
    t.is(result.amountDetails.totalAmount, '636.1');
    t.is(result.amountDetails.currency, 'USD');
})

test.serial('Get order information for add token', (t) => {
    const result : any = orderInformationForAddToken.getOrderInformation();
    t.truthy(result.billTo.firstName);
    t.truthy(result.billTo.lastName);
    t.truthy(result.billTo.address1);
    t.truthy(result.billTo.address2);
    t.truthy(result.billTo.locality);
    t.truthy(result.billTo.administrativeArea);
    t.truthy(result.billTo.postalCode);
    t.truthy(result.billTo.country);
    t.truthy(result.billTo.email);
    t.truthy(result.billTo.phoneNumber);
    t.is(result.amountDetails.totalAmount, 0);
    t.is(result.amountDetails.currency, 'USD');
})