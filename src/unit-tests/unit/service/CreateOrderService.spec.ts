import test from 'ava';
import dotenv from 'dotenv';
import { Constants } from '../../../constants/paymentConstants';
import CreateOrderConst from '../../const/CreateOrderServiceConst';
import CreateOrder from '../../../service/payment/CreateOrderService';

dotenv.config();

test.serial('Get create order response and check http code', async (t: any) => {
    try {
        let response: any = await CreateOrder.getCreateOrderResponse(CreateOrderConst?.payment as any, CreateOrderConst.requestId, CreateOrderConst.accountId, CreateOrderConst.cartObject as any);
        if (Constants.HTTP_SUCCESS_STATUS_CODE == response.httpCode) {
            t.is(response.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
        } else {
            t.fail(`Unexpected error: Create Order Response' ${response.httpCode}`);
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

test.serial('Get create order response with empty cart and check http code', async (t: any) => {
    try {
        let response: any = await CreateOrder.getCreateOrderResponse(CreateOrderConst?.payment as any, CreateOrderConst.invalidRequestId, CreateOrderConst.invalidAccountId, {} as any);
        if (Constants.HTTP_BAD_REQUEST_STATUS_CODE == response.httpCode) {
            t.is(response.httpCode, Constants.HTTP_BAD_REQUEST_STATUS_CODE);
        } else {
            t.fail(`Unexpected error: Create Order Response' ${response.httpCode}`);
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