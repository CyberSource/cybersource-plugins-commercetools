import test from 'ava';
import dotenv from 'dotenv';

import { FunctionConstant } from '../../../constants/functionConstant';
import { LineItem } from '../../../requestBuilder/LineItemMapper';
import CaptureContextServiceConst from '../../const/CaptureContextServiceConst';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import LineItemMapperConst from '../../const/LineItemMapperConst';

dotenv.config();

const lineItemMapper = new LineItem(PaymentAuthorizationServiceConstCC.shippingCart.lineItems[0], LineItemMapperConst.unitPrice, FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, CaptureContextServiceConst.locale, LineItemMapperConst.discountedCart.lineItems, PaymentAuthorizationServiceConstCC.payments, LineItemMapperConst.isShipping, LineItemMapperConst.discountedCart, LineItemMapperConst.isCustomLineItem, LineItemMapperConst.isTotalPriceDiscount, LineItemMapperConst.lineItemTotalAmount);

test.serial('Map line item values ', async (t) => {
    const result = lineItemMapper.getLineItemDetails();
    t.is(result.totalAmount, LineItemMapperConst.lineItemTotalAmount);
    t.is(result.unitPrice, LineItemMapperConst.unitPrice);
    t.is(result.discountAmount, 0);
})