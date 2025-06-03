import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import { PaymentMethodFactory } from '../../../models/PaymentMethodFactory';
import PaymentMethodFactoryConst from '../../const/PaymentMethodFactoryConst';
dotenv.config();

test.serial('Get payment process authorization for credit card', async (t: any) => {
    try {
        const paymentMethodStrategy = PaymentMethodFactory.getPaymentMethod(Constants.CREDIT_CARD);
        let result: any = await paymentMethodStrategy.processAuthorization(PaymentMethodFactoryConst.getCreditCardResponseUpdatePaymentObj, PaymentMethodFactoryConst.tokenCreateFlagCustomerInfo as any, PaymentMethodFactoryConst.getCreditCardResponseCartObj as any, PaymentMethodFactoryConst.getCreditCardResponseUpdateTransactions, PaymentMethodFactoryConst.customerCardTokens, '');

        if (201 == result.paymentResponse.httpCode) {
            t.is(result.paymentResponse.httpCode, 201);
            if (Constants.API_STATUS_AUTHORIZED == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
            } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
            } else if (Constants.API_STATUS_DECLINED == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_DECLINED);
            } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
            } else if (Constants.API_STATUS_INVALID_REQUEST == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
            } else {
                t.fail(`Unexpected Status: ${result.paymentResponse.status}`);
            }
        } else {
            t.fail(`Unexpected response: HTTP ${result.paymentResponse.httpCode}, Status: ${result.paymentResponse.status}`);
        }
    } catch (exception) {
        if (exception instanceof Error) {
            t.fail(`Caught an error during execution: ${exception.message}`);
            t.log(`Stack trace: ${exception.stack}`);
        } else {
            t.fail(`Caught an unknown error: ${String(exception)}`);
        }
    }
});

test.serial('Get payment process authorization for Google Pay', async (t: any) => {
    try {
        const paymentMethodStrategy = PaymentMethodFactory.getPaymentMethod(Constants.GOOGLE_PAY);
        let result: any = await paymentMethodStrategy.processAuthorization(PaymentMethodFactoryConst.getGooglePayResponseUpdatePaymentObj as any, PaymentMethodFactoryConst.tokenCreateFlagCustomerInfo as any, PaymentMethodFactoryConst.getCreditCardResponseCartObj as any, PaymentMethodFactoryConst.getCreditCardResponseUpdateTransactions, PaymentMethodFactoryConst.customerCardTokens, '');

        if (201 == result.paymentResponse.httpCode) {
            t.is(result.paymentResponse.httpCode, 201);
            if (Constants.API_STATUS_AUTHORIZED == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
            } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
            } else if (Constants.API_STATUS_DECLINED == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_DECLINED);
            } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
            } else if (Constants.API_STATUS_INVALID_REQUEST == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
            } else {
                t.fail(`Unexpected Status: ${result.paymentResponse.status}`);
            }
        } else {
            t.fail(`Unexpected response: HTTP ${result.paymentResponse.httpCode}, Status: ${result.paymentResponse.status}`);
        }
    } catch (exception) {
        if (exception instanceof Error) {
            t.fail(`Caught an error during execution: ${exception.message}`);
            t.log(`Stack trace: ${exception.stack}`);
        } else {
            t.fail(`Caught an unknown error: ${String(exception)}`);
        }
    }
});

test.serial('Get payment process authorization for eCheck', async (t: any) => {
    try {
        const paymentMethodStrategy = PaymentMethodFactory.getPaymentMethod(Constants.ECHECK);
        let result: any = await paymentMethodStrategy.processAuthorization(PaymentMethodFactoryConst.getApplePayResponseUpdatePaymentObj as any, PaymentMethodFactoryConst.tokenCreateFlagCustomerInfo as any, PaymentMethodFactoryConst.getCreditCardResponseCartObj as any, PaymentMethodFactoryConst.getCreditCardResponseUpdateTransactions, PaymentMethodFactoryConst.customerCardTokens, '');

        if (201 == result.paymentResponse.httpCode) {
            t.is(result.paymentResponse.httpCode, 201);
            if (Constants.API_STATUS_AUTHORIZED == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
            } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
            } else if (Constants.API_STATUS_DECLINED == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_DECLINED);
            } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
            } else if (Constants.API_STATUS_INVALID_REQUEST == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
            } else {
                t.fail(`Unexpected Status: ${result.paymentResponse.status}`);
            }
        } else {
            t.fail(`Unexpected response: HTTP ${result.paymentResponse.httpCode}, Status: ${result.paymentResponse.status}`);
        }
    } catch (exception) {
        if (exception instanceof Error) {
            t.fail(`Caught an error during execution: ${exception.message}`);
            t.log(`Stack trace: ${exception.stack}`);
        } else {
            t.fail(`Caught an unknown error: ${String(exception)}`);
        }
    }
});

test.serial('Get payment process authorization for apple pay', async (t: any) => {
    try {
        const paymentMethodStrategy = PaymentMethodFactory.getPaymentMethod(Constants.APPLE_PAY);
        let result: any = await paymentMethodStrategy.processAuthorization(PaymentMethodFactoryConst.getApplePayResponseUpdatePaymentObj as any, PaymentMethodFactoryConst.tokenCreateFlagCustomerInfo as any, PaymentMethodFactoryConst.getCreditCardResponseCartObj as any, PaymentMethodFactoryConst.getCreditCardResponseUpdateTransactions, PaymentMethodFactoryConst.customerCardTokens, '');

        if (201 == result.paymentResponse.httpCode) {
            t.is(result.paymentResponse.httpCode, 201);
            if (Constants.API_STATUS_AUTHORIZED == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
            } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
            } else if (Constants.API_STATUS_DECLINED == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_DECLINED);
            } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
            } else if (Constants.API_STATUS_INVALID_REQUEST == result.paymentResponse.status) {
                t.is(result.paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
            } else {
                t.fail(`Unexpected Status: ${result.paymentResponse.status}`);
            }
        } else {
            t.fail(`Unexpected response: HTTP ${result.paymentResponse.httpCode}, Status: ${result.paymentResponse.status}`);
        }
    } catch (exception) {
        if (exception instanceof Error) {
            t.fail(`Caught an error during execution: ${exception.message}`);
            t.log(`Stack trace: ${exception.stack}`);
        } else {
            t.fail(`Caught an unknown error: ${String(exception)}`);
        }
    }
});

test.serial('Get click to pay response', async (t: any) => {
    try {
        const paymentMethodStrategy = PaymentMethodFactory.getPaymentMethod(Constants.CLICK_TO_PAY);
        let result: any = await paymentMethodStrategy.processAuthorization(PaymentMethodFactoryConst.getClickToPayResponseUpdatePaymentObj as any, PaymentMethodFactoryConst.tokenCreateFlagCustomerInfo as any, PaymentMethodFactoryConst.getCreditCardResponseCartObj as any, PaymentMethodFactoryConst.getCreditCardResponseUpdateTransactions, PaymentMethodFactoryConst.customerCardTokens, '');
        if (201 == result.paymentResponse.httpCode) {
            t.is(result.paymentResponse.httpCode, 201);
            if (201 == result.paymentResponse.httpCode) {
                t.is(result.paymentResponse.httpCode, 201);
                if (Constants.API_STATUS_AUTHORIZED == result.paymentResponse.status) {
                    t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
                } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == result.paymentResponse.status) {
                    t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
                } else if (Constants.API_STATUS_DECLINED == result.paymentResponse.status) {
                    t.is(result.paymentResponse.status, Constants.API_STATUS_DECLINED);
                } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == result.paymentResponse.status) {
                    t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
                } else if (Constants.API_STATUS_INVALID_REQUEST == result.paymentResponse.status) {
                    t.is(result.paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
                } else {
                    t.fail(`Unexpected Status: ${result.paymentResponse.status}`);
                }
            }
        } else {
            t.fail(`Unexpected response: HTTP ${result.paymentResponse.httpCode}, Status: ${result.paymentResponse.status}`);
        }
    } catch (exception) {
        if (exception instanceof Error) {
            t.fail(`Caught an error during execution: ${exception.message}`);
            t.log(`Stack trace: ${exception.stack}`);
        } else {
            t.fail(`Caught an unknown error: ${String(exception)}`);
        }
    }
});