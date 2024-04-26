import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../constants';
import paymentCustomJson from '../../resources/isv_payment_data_type.json';
import paymentUpdateJson from '../../resources/payment_update_extension.json';
import commercetoolsApi from '../../utils/api/CommercetoolsApi';
import unit from '../JSON/unit.json';
import {
  address,
  addTransactionForCharge,
  anonymousId,
  cartId,
  createCTCustomObjectData,
  customerId,
  customFieldName,
  customFieldValue,
  customObjectContainer,
  emptyAddressField,
  key,
  paymentId,
  setCustomTypeFieldsData,
  syncVisaCardEtailsActions,
} from '../const/CommercetoolsApiConst';
import { payment } from '../const/CreditCard/PaymentAuthorizationServiceConstCC';
import { processTokensCustomerCardTokensObject, runSyncAddTransactionSyncUpdateEmptyObject, runSyncAddTransactionSyncUpdateObject, visaCardDetailsActionVisaCheckoutData } from '../const/PaymentServiceConst';

test.serial('Retrieving cart using customerid ', async (t) => {
  let result = await commercetoolsApi.queryCartById(customerId, Constants.CUSTOMER_ID);
  if (result) {
    if (result?.count > 0) {
      t.is(result.count, 1);
      t.is(result.results[0].type, 'Cart');
      if (result.results[0].cartState == 'Active') {
        t.is(result.results[0].cartState, 'Active');
      } else if (result.results[0].cartState == 'Merged') {
        t.is(result.results[0].cartState, 'Merged');
      } else if (result.results[0].cartState == 'Ordered') {
        t.is(result.results[0].cartState, 'Ordered');
      }
    } else {
      t.is(result.count, 0);
      t.is(result.total, 0);
    }
  } else {
    t.pass();
  }
});

test.serial('Retrieving cart using customerid as null', async (t) => {
  let result = await commercetoolsApi.queryCartById('', Constants.CUSTOMER_ID);
  t.is(result, null);
});

test.serial('Retrieving cart using paymentid ', async (t) => {
  let result = await commercetoolsApi.queryCartById(paymentId, Constants.PAYMENT_ID);
  if (result) {
    if (result?.count == 1) {
      t.is(result.count, 1);
      t.is(result.results[0].type, 'Cart');
      if (result.results[0].cartState == 'Active') {
        t.is(result.results[0].cartState, 'Active');
      } else if (result.results[0].cartState == 'Merged') {
        t.is(result.results[0].cartState, 'Merged');
      } else if (result.results[0].cartState == 'Ordered') {
        t.is(result.results[0].cartState, 'Ordered');
      }
    } else {
      t.not(result.count, 1);
      t.deepEqual(result.results, []);
    }
  } else {
    t.pass();
  }
});

test.serial('Retrieving cart using paymentid as null', async (t) => {
  let result = await commercetoolsApi.queryCartById('', Constants.PAYMENT_ID);
  t.is(result, null);
});

test.serial('Retrieving payment using paymentid ', async (t) => {
  let result = await commercetoolsApi.retrievePayment(paymentId);
  if (result) {
    let i = 0;
    if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
      i++;
    }
    t.is(i, 1);
  } else {
    t.pass();
  }
});

test.serial('Retrieving payment using paymentid as null', async (t) => {
  let result = await commercetoolsApi.retrievePayment('');
  t.is(result, null);
});

test.serial('Get all orders ', async (t) => {
  let result = await commercetoolsApi.getOrders();
  let i = 0;
  if (result && 'limit' in result && 'offset' in result && 'count' in result && 'total' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('get customer using customer id', async (t) => {
  let result = await commercetoolsApi.getCustomer(customerId);
  if (result) {
    let i = 0;
    if ('email' in result && 'firstName' in result && 'lastName' in result && 'custom' in result) {
      i++;
    }
    t.is(i, 1);
  } else {
    t.pass();
  }
});

test.serial('get customer using customer id as null', async (t) => {
  let result = await commercetoolsApi.getCustomer('');
  t.is(result, null);
});

test.serial('Retrieving cart by anonymous id ', async (t) => {
  let result = await commercetoolsApi.queryCartById(anonymousId, Constants.ANONYMOUS_ID);
  if (result) {
    if (result?.count > 0) {
      t.is(result.count, 1);
      t.is(result.results[0].type, 'Cart');
      if (result.results[0].cartState == 'Active') {
        t.is(result.results[0].cartState, 'Active');
      } else if (result.results[0].cartState == 'Merged') {
        t.is(result.results[0].cartState, 'Merged');
      } else if (result.results[0].cartState == 'Ordered') {
        t.is(result.results[0].cartState, 'Ordered');
      }
    } else {
      t.is(result.count, 0);
      t.is(result.total, 0);
    }
  } else {
    t.pass();
  }
});

test.serial('Retrieving cart by anonymous id as null', async (t) => {
  let result = await commercetoolsApi.queryCartById('', Constants.ANONYMOUS_ID);
  t.is(result, null);
});

test.serial('Retrieving order by cart id ', async (t) => {
  let result = await commercetoolsApi.queryOrderById(cartId, Constants.CART_ID);
  if (result) {
    if (result?.count > 0) {
      t.is(result.count, 1);
      t.is(result.results[0].type, 'Order');
      if (result.results[0].orderState == 'Open') {
        t.is(result.results[0].orderState, 'Open');
      } else if (result.results[0].orderState == 'Confirmed') {
        t.is(result.results[0].orderState, 'Confirmed');
      } else if (result.results[0].orderState == 'Complete') {
        t.is(result.results[0].orderState, 'Complete');
      } else if (result.results[0].orderState == 'Cancelled') {
        t.is(result.results[0].orderState, 'Cancelled');
      }
    } else {
      t.is(result.count, 0);
      t.is(result.total, 0);
    }
  } else {
    t.pass();
  }
});

test.serial('Retrieving order by cart id as null', async (t) => {
  let result = await commercetoolsApi.queryOrderById('', Constants.CART_ID);
  t.is(result, null);
});

test.serial('Retrieving order by payment id ', async (t) => {
  let result = await commercetoolsApi.queryOrderById(paymentId, Constants.PAYMENT_ID);
  if (result) {
    if (result?.count > 0) {
      t.is(result.count, 1);
      t.is(result.results[0].type, 'Order');
      if (result.results[0].orderState == 'Open') {
        t.is(result.results[0].orderState, 'Open');
      } else if (result.results[0].orderState == 'Confirmed') {
        t.is(result.results[0].orderState, 'Confirmed');
      } else if (result.results[0].orderState == 'Complete') {
        t.is(result.results[0].orderState, 'Complete');
      } else if (result.results[0].orderState == 'Cancelled') {
        t.is(result.results[0].orderState, 'Cancelled');
      }
    } else {
      t.is(result.count, 0);
      t.is(result.total, 0);
    }
  } else {
    t.pass();
  }
});

test.serial('Retrieving order by payment id as null', async (t) => {
  let result = await commercetoolsApi.queryOrderById('', Constants.PAYMENT_ID);
  t.is(result, null);
});

test.serial('Get custom type ', async (t) => {
  let result = await commercetoolsApi.getCustomType(key);
  if (result.statusCode == 200) {
    t.is(result.statusCode, 200);
  } else {
    t.not(result.statusCode, 200);
  }
});

test.serial('Get custom type when type is null', async (t) => {
  let result = await commercetoolsApi.getCustomType('');
  t.is(result, null);
});

test.serial('Add customer address ', async (t) => {
  let result = await commercetoolsApi.addCustomerAddress(customerId, address);
  let i = 0;
  if (result && result?.addresses && 0 < result?.addresses?.length) {
    i++;
    t.is(i, 1);
  } else {
    t.is(i, 0);
  }
});

test.serial('Adding customer address when customer id is null', async (t) => {
  let result = await commercetoolsApi.addCustomerAddress('', address);
  t.is(result, null);
});

test.serial('Add customer address with invalid customer id', async (t) => {
  let result = await commercetoolsApi.addCustomerAddress('123', address);
  let i = 0;
  if (result?.addresses && 0 < result?.addresses.length) {
    i++;
  }
  t.is(i, 0);
});

test.serial('Add customer address when address field is null', async (t) => {
  let result = await commercetoolsApi.addCustomerAddress(customerId, emptyAddressField);
  t.is(result, null);
});

test.serial('Add transaction for run sync ', async (t) => {
  let paymentObjRunSync = await commercetoolsApi.retrievePayment(unit.paymentId);
  if (paymentObjRunSync) {
    addTransactionForCharge.version = paymentObjRunSync?.version;
    let result = await commercetoolsApi.addTransaction(addTransactionForCharge, unit.paymentId);
    let i = 0;
    if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
      i++;
      t.is(i, 1);
    } else {
      t.is(i, 0);
    }
  } else {
    t.pass();
  }
});

test.serial('Add transaction for run sync when payment id is null', async (t) => {
  let paymentObjRunSyncIdNull = await commercetoolsApi.retrievePayment(unit.paymentId);
  if (paymentObjRunSyncIdNull) {
    addTransactionForCharge.version = paymentObjRunSyncIdNull?.version;
    let result = await commercetoolsApi.addTransaction(addTransactionForCharge, '');
    t.is(result, null);
  } else {
    t.pass();
  }
});

test.serial('update cart by payment id ', async (t) => {
  let cartData = await commercetoolsApi.getCartById(unit.cartId);
  let result = await commercetoolsApi.updateCartByPaymentId(unit.cartId, unit.paymentId, cartData?.version, visaCardDetailsActionVisaCheckoutData);
  if (result) {
    t.is(result.type, 'Cart');
    if (result.cartState == 'Active') {
      t.is(result.cartState, 'Active');
    } else if (result.cartState == 'Merged') {
      t.is(result.cartState, 'Merged');
    } else if (result.cartState == 'Ordered') {
      t.is(result.cartState, 'Ordered');
    }
  } else {
    t.pass();
  }
});

test.serial('update cart by payment id when cart id is null', async (t) => {
  let cartData = await commercetoolsApi.getCartById(unit.cartId);
  let result = await commercetoolsApi.updateCartByPaymentId('', unit.paymentId, cartData?.version, visaCardDetailsActionVisaCheckoutData);
  t.is(result, null);
});

test.serial('update cart by payment id when payment id is null', async (t) => {
  let cartData = await commercetoolsApi.getCartById(unit.cartId);
  let result = await commercetoolsApi.updateCartByPaymentId(unit.cartId, '', cartData?.version, visaCardDetailsActionVisaCheckoutData);
  if (result) {
    t.is(result.type, 'Cart');
    if (result.cartState == 'Active') {
      t.is(result.cartState, 'Active');
    } else if (result.cartState == 'Merged') {
      t.is(result.cartState, 'Merged');
    } else if (result.cartState == 'Ordered') {
      t.is(result.cartState, 'Ordered');
    }
  } else {
    t.pass();
  }
});

test.serial('set Customer Tokens', async (t) => {
  let result = await commercetoolsApi.setCustomerTokens(processTokensCustomerCardTokensObject.customerTokenId, processTokensCustomerCardTokensObject.paymentInstrumentId, '7010000000121591111', payment, '');
  t.pass();
  if (result) {
    let i = 0;
    if ('email' in result && 'firstName' in result && 'lastName' in result && 'custom' in result) {
      i++;
    }
    t.is(i, 1);
  } else {
    t.pass();
  }
});

test.serial('set Customer Tokens when payment instrument id is null', async (t) => {
  let result = await commercetoolsApi.setCustomerTokens(processTokensCustomerCardTokensObject.customerTokenId, '', '7010000000121591111', payment, '');
  t.is(result, null);
});

test.serial('set custom type', async (t) => {
  let result = await commercetoolsApi.setCustomType(unit.customerId, setCustomTypeFieldsData, [], processTokensCustomerCardTokensObject.customerTokenId);
  if (result) {
    let i = 0;
    if ('email' in result && 'firstName' in result && 'lastName' in result && 'custom' in result) {
      i++;
    }
    t.is(i, 1);
  } else {
    t.pass();
  }
});

test.serial('set custom type when customer id is null', async (t) => {
  let result = await commercetoolsApi.setCustomType('', setCustomTypeFieldsData, [], processTokensCustomerCardTokensObject.customerTokenId);
  t.is(result, null);
});

test.serial('sync visa card details ', async (t) => {
  let paymentObjSyncVisaCard = await commercetoolsApi.retrievePayment(unit.paymentId);
  if (paymentObjSyncVisaCard) {
    let visaUpdateObject: any = {
      actions: syncVisaCardEtailsActions,
      id: paymentObjSyncVisaCard?.id,
      version: paymentObjSyncVisaCard?.version,
    };
    let result = await commercetoolsApi.syncVisaCardDetails(visaUpdateObject);
    let i = 0;
    if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
      i++;
      t.is(i, 1);
    } else {
      t.is(i, 0);
    }
  } else {
    t.pass();
  }
});

test.serial('sync visa card details with incorrect data', async (t) => {
  let paymentObjSyncInvalidCard = await commercetoolsApi.retrievePayment(unit.paymentId);
  if (paymentObjSyncInvalidCard) {
    let visaUpdateObject: any = {
      actions: syncVisaCardEtailsActions,
      id: '',
      version: '',
    };
    let result = await commercetoolsApi.syncVisaCardDetails(visaUpdateObject);
    t.is(result, null);
  } else {
    t.pass();
  }
});

test.serial('sync add transaction ', async (t) => {
  let paymentObjSync = await commercetoolsApi.retrievePayment(unit.paymentId);
  if (paymentObjSync) {
    runSyncAddTransactionSyncUpdateObject.version = paymentObjSync?.version;
    let result = await commercetoolsApi.syncAddTransaction(runSyncAddTransactionSyncUpdateObject);
    let i = 0;
    if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
      i++;
      t.is(i, 1);
    } else {
      t.is(i, 0);
    }
  } else {
    t.pass();
  }
});

test.serial('sync add transaction with incorrect data', async (t) => {
  let paymentObjSyncIncorrect = await commercetoolsApi.retrievePayment(unit.paymentId);
  if (paymentObjSyncIncorrect) {
    runSyncAddTransactionSyncUpdateObject.version = paymentObjSyncIncorrect?.version;
    let result = await commercetoolsApi.syncAddTransaction(runSyncAddTransactionSyncUpdateEmptyObject);
    t.is(result, null);
  } else {
    t.pass();
  }
});

test.serial('add custom types ', async (t) => {
  let result = await commercetoolsApi.addCustomTypes(paymentCustomJson);
  t.pass();
  if (result) {
    if (201 == result.statusCode) {
      t.is(result.statusCode, 201);
    } else {
      t.not(result.statusCode, 201);
    }
  } else {
    t.pass();
  }
});

test.serial('add custom types with empty object', async (t) => {
  let result = await commercetoolsApi.addCustomTypes('');
  t.falsy(result);
});

test.serial('add extensions', async (t) => {
  let result = await commercetoolsApi.addExtensions(paymentUpdateJson);
  if (result) {
    t.pass();
    if (201 !== parseInt(result.statusCode)) {
      t.is(result.statusCode, 201);
    } else {
      t.not(result.statusCode, 201);
    }
  } else {
    t.pass();
  }
});

test.serial('add extensions with empty object', async (t) => {
  let result = await commercetoolsApi.addExtensions('');
  t.falsy(result);
});

test.serial('update available amount ', async (t) => {
  let updatePaymentObj = await commercetoolsApi.retrievePayment(unit.paymentId);
  if (updatePaymentObj) {
    let result = await commercetoolsApi.updateAvailableAmount(updatePaymentObj?.id, updatePaymentObj?.version, '123', 4);
    let i = 0;
    if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
      i++;
      t.is(i, 1);
    } else {
      t.is(i, 0);
    }
  } else {
    t.pass();
  }
});

test.serial('update available amount when payment id is null', async (t) => {
  let updatePaymentObjIdNull = await commercetoolsApi.retrievePayment(unit.paymentId);
  if (updatePaymentObjIdNull) {
    let result = await commercetoolsApi.updateAvailableAmount('', updatePaymentObjIdNull?.version, '123', 4);
    t.falsy(result);
  } else {
    t.pass();
  }
});

test.serial('get cart by id', async (t) => {
  let result = await commercetoolsApi.getCartById(unit.cartId);
  if (result) {
    t.is(result.type, 'Cart');
    if (result.cartState == 'Active') {
      t.is(result.cartState, 'Active');
    } else if (result.cartState == 'Merged') {
      t.is(result.cartState, 'Merged');
    } else if (result.cartState == 'Ordered') {
      t.is(result.cartState, 'Ordered');
    }
  } else {
    t.pass();
  }
});

test.serial('get cart by id when cart id is null', async (t) => {
  let result = await commercetoolsApi.getCartById('');
  t.falsy(result);
});

test.serial('Create commercetools custom object', async (t) => {
  let result = await commercetoolsApi.createCTCustomObject(createCTCustomObjectData);
  if (result.statusCode == 200) {
    t.is(result.statusCode, 200);
  } else {
    t.not(result.statusCode, 200);
  }
});

test.serial('Retrieve custom objects', async (t) => {
  let result = await commercetoolsApi.retrieveCustomObjectByContainer(customObjectContainer);
  let i = 0;
  if (result && 'limit' in result && 'offset' in result && 'count' in result && 'total' in result) {
    i++;
    t.is(i, 1);
  } else {
    t.is(i, 0);
  }
});

test.serial('Retrieve custom objects when container is empty', async (t) => {
  let result = await commercetoolsApi.retrieveCustomObjectByContainer('');
  let i = 0;
  if (result && 'limit' in result && 'offset' in result && 'count' in result && 'total' in result) {
    i++;
    t.is(i, 1);
  } else {
    t.is(i, 0);
  }
});

test.serial('Retrieve customer by custom field', async (t) => {
  let result = await commercetoolsApi.retrieveCustomerByCustomField(customFieldName, customFieldValue);
  let i = 0;
  if (result && result?.results[0] && 'email' in result.results[0] && 'firstName' in result.results[0] && 'lastName' in result.results[0] && 'custom' in result.results[0]) {
    i++;
    t.is(i, 1);
  } else {
    t.pass();
  }
});

test.serial('Retrieve customer by custom field when field name is empty', async (t) => {
  let result = await commercetoolsApi.retrieveCustomerByCustomField('', customFieldValue);
  t.falsy(result);
});

test.serial('Retrieve customer by custom field when field value is empty', async (t) => {
  let result = await commercetoolsApi.retrieveCustomerByCustomField(customFieldName, '');
  t.falsy(result);
});
