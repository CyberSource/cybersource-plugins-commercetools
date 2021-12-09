import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { authId, cart, payment } from '../../const/PaymentCaptureServiceConst';
import cap from '../../service/payment/PaymentCaptureService';




test('check payment capture httpcode', async (t) => {
    const result: any = await cap.captureResponse(payment, cart, authId);
    console.log("capture ", result);
    t.is(result.httpCode, 201);
})

test('check payment capture status', async (t) => {
    const result: any = await cap.captureResponse(payment, cart, authId);
    console.log("capture ", result);
    t.is(result.status, 'PENDING');
})


