import test from 'ava';
import dotenv from 'dotenv';

import { FunctionConstant } from '../../../constants/functionConstant';
import { OrderInformationMapper } from '../../../requestBuilder/OrderInformationMapper';
import AddTokenServiceConst from '../../const/AddTokenServiceConst';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import LineItemMapperConst from '../../const/LineItemMapperConst';
import PaymentHandlerConst from '../../const/PaymentHandlerConst';

dotenv.config();

const orderInformationForAuth = new OrderInformationMapper(
  FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE,
  PaymentAuthorizationServiceConstCC.payment as any,
  PaymentHandlerConst.authorizationHandlerUpdateTransactions,
  LineItemMapperConst.discountedCart as any,
  AddTokenServiceConst.addTokenResponseCustomerObj,
  AddTokenServiceConst.addTokenAddress,
  'Payments',
  'USD',
);
const orderInformationForCharge = new OrderInformationMapper(
  FunctionConstant.FUNC_GET_CAPTURE_RESPONSE,
  PaymentAuthorizationServiceConstCC.payment as any,
  PaymentHandlerConst.authorizationHandlerUpdateTransactions,
  LineItemMapperConst.discountedCart as any,
  AddTokenServiceConst.addTokenResponseCustomerObj,
  AddTokenServiceConst.addTokenAddress,
  'Payments',
  'USD',
);
const orderInformationForRefund = new OrderInformationMapper(
  FunctionConstant.FUNC_GET_REFUND_DATA,
  PaymentAuthorizationServiceConstCC.payment as any,
  PaymentHandlerConst.authorizationHandlerUpdateTransactions,
  LineItemMapperConst.discountedCart as any,
  AddTokenServiceConst.addTokenResponseCustomerObj,
  AddTokenServiceConst.addTokenAddress,
  'Payments',
  'USD',
);
const orderInformationForAuthReversal = new OrderInformationMapper(
  FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE,
  PaymentAuthorizationServiceConstCC.payment as any,
  PaymentHandlerConst.authorizationHandlerUpdateTransactions,
  LineItemMapperConst.discountedCart as any,
  AddTokenServiceConst.addTokenResponseCustomerObj,
  AddTokenServiceConst.addTokenAddress,
  'Payments',
  'USD',
);
const orderInformationForCaptureContext = new OrderInformationMapper(
  FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT,
  PaymentAuthorizationServiceConstCC.payment as any,
  PaymentHandlerConst.authorizationHandlerUpdateTransactions,
  LineItemMapperConst.discountedCart as any,
  AddTokenServiceConst.addTokenResponseCustomerObj,
  AddTokenServiceConst.addTokenAddress,
  'Payments',
  'USD',
);
const orderInformationForAddToken = new OrderInformationMapper(
  FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE,
  PaymentAuthorizationServiceConstCC.payment as any,
  PaymentHandlerConst.authorizationHandlerUpdateTransactions,
  LineItemMapperConst.discountedCart as any,
  AddTokenServiceConst.addTokenResponseCustomerObj,
  AddTokenServiceConst.addTokenAddress,
  'Payments',
  'USD',
);

test.serial('Get order information for auth', (t) => {
  try {
    const result = orderInformationForAuth.getOrderInformation();
    if ('billTo' in result && 'shipTo' in result && 'lineItems' in result && 'amountDetails' in result) {
      t.true(true, 'result contains all required fields');
    } else {
      t.fail(`Unexpected error: order information for auth' ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get order information for charge', (t) => {
  try {
    const result: any = orderInformationForCharge.getOrderInformation();
    if (Object.keys(result).length) {
      t.is(result.amountDetails.totalAmount, 69.7);
      t.is(result.amountDetails.currency, 'USD');
    } else {
      t.fail(`Unexpected error: information for charge' ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get order information for refund', (t) => {
  try {
    const result: any = orderInformationForRefund.getOrderInformation();
    if (Object.keys(result).length) {
      t.is(result.amountDetails.totalAmount, 69.7);
      t.is(result.amountDetails.currency, 'USD');
    } else {
      t.fail(`Unexpected error: information for refund' ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get order information for auth reversal', (t) => {
  try {
    const result: any = orderInformationForAuthReversal.getOrderInformation();
    if (Object.keys(result).length) {
      t.truthy(result.lineItems[0].productCode);
      t.truthy(result.lineItems[0].productName);
      t.truthy(result.lineItems[0].productSku);
      t.truthy(result.lineItems[0].quantity);
      t.truthy(result.lineItems[0].totalAmount);
      t.truthy(result.lineItems[0].unitPrice);
    } else {
      t.fail(`Unexpected error: information for auth reversal' ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get order information for capture context', (t) => {
  try {
    const result: any = orderInformationForCaptureContext.getOrderInformation();
    if (Object.keys(result).length) {
      t.is(result.amountDetails.totalAmount, '636.1');
      t.is(result.amountDetails.currency, 'USD');
    } else {
      t.fail(`Unexpected error: information for capture context' ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get order information for add token', (t) => {
  try {
    const result: any = orderInformationForAddToken.getOrderInformation();
    if (Object.keys(result).length) {
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
    } else {
      t.fail(`Unexpected error: information for add token' ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});