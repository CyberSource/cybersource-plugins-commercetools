import test from 'ava';
import dotenv from 'dotenv';
import { Constants } from '../../../constants/paymentConstants';
import SessionServiceConst from '../../const/SessionServiceConst';
import SessionService from '../../../service/payment/SessionService';

dotenv.config();

test.serial('Get session data and check http code', async (t: any) => {
    try {
        let response: any = await SessionService.getSessionResponse(SessionServiceConst?.paymentObject as any, SessionServiceConst.cartObject as any);
        response.httpCode = response.httpCode;
        if (Constants.HTTP_SUCCESS_STATUS_CODE == response.httpCode) {
            t.is(response.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
        } else {
            t.fail(`Unexpected error: Session Response' ${response.httpCode}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            t.fail(`Caught an error during execution: ${error.message}`);
            t.log(`Stack trace: ${error.stack}`);
        } else {
            t.fail(`Caught an unknown error: ${String(error)}`);
        }
    }
});

test.serial('Check status of session response with empty cart', async (t: any) => {
    try {
        let response: any = await SessionService.getSessionResponse(SessionServiceConst.paymentObject as any, {} as any);
        response.httpCode = response.httpCode;
        if (Constants.HTTP_BAD_REQUEST_STATUS_CODE == response.httpCode) {
            t.is(response.httpCode, Constants.HTTP_BAD_REQUEST_STATUS_CODE);
        } else {
            t.fail(`Unexpected error: Session Response' ${response.httpCode}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            t.fail(`Caught an error during execution: ${error.message}`);
            t.log(`Stack trace: ${error.stack}`);
        } else {
            t.fail(`Caught an unknown error: ${String(error)}`);
        }
    }
});
