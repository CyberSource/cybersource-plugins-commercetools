import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import {captureId,payment, updateTransactions} from '../../const/PaymentRefundServiceVsConst';
import refund from '../../service/payment/PaymentRefundService';


test('execution of refund for success http code', async (t)=>{
    const result: any = await refund.refundResponse(payment, captureId, updateTransactions);
    console.log("result ", result);
    t.is(result.httpCode, 201);
})

test('execution of refund for success status', async (t)=>{
    const result: any = await refund.refundResponse(payment, captureId, updateTransactions);
    console.log("result ", result);
    t.is(result.status, 'PENDING');
})