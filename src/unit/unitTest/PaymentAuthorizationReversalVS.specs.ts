import test from 'ava';

import { authReversalId, cart, payment } from '../../const/PaymentAuthorizationReversalVsConst';
import reverse from '../../service/payment/PaymentAuthorizationReversal';

test('execution of auth reversal for  vs', async (t)=>{
    const result = await reverse.authReversalResponse(payment, cart, authReversalId);
    console.log("result for auth reversal for vs",result);
    t.pass();
})