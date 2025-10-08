import test from 'ava';
import dotenv from 'dotenv';
import { Constants } from '../../../constants/paymentConstants';
import SessionServiceConst from '../../const/SessionServiceConst';
import CheckTransactionStatusConst from '../../const/CheckTransactionStatusConst';
import CheckTransactionStatus from '../../../service/payment/CheckTransactionStatus';

dotenv.config();

test.serial('Get transaction status data and check http code', async (t: any) => {
    try {
        let response: any = await CheckTransactionStatus.getTransactionStatusResponse(SessionServiceConst?.paymentObject as any, CheckTransactionStatusConst.transactionId);
        if (Constants.HTTP_SUCCESS_STATUS_CODE == response.httpCode) {
            t.is(response.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
        } else {
            t.fail(`Unexpected error: transaction Response' ${response.httpCode}`);
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

test.serial('Check status of get transaction response with invalid transactionId', async (t: any) => {
    try {
        let response: any = await CheckTransactionStatus.getTransactionStatusResponse(SessionServiceConst.paymentObject as any, CheckTransactionStatusConst.invalidTransactionId);
        response.httpCode = response.httpCode;
        if (Constants.HTTP_BAD_REQUEST_STATUS_CODE == response.httpCode) {
            t.is(response.httpCode, Constants.HTTP_BAD_REQUEST_STATUS_CODE);
        } else {
            t.fail(`Unexpected error: transaction Response' ${response.httpCode}`);
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