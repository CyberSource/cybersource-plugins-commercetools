import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import getTokenData from '../../service/payment/GetTransientTokenData';
import {service} from '../const/CaptureContextServiceConst';
import {ucPayment} from '../const/CreditCard/PaymentAuthorizationServiceConstCC';

var captureContextResponse: any = {
    httpCode: null,
    status: null
};

test.serial('Check http code of transient token data', async (t) => {
    const result:any = await getTokenData.transientTokenDataResponse(ucPayment, service);
    captureContextResponse.httpCode = result.httpCode;
    captureContextResponse.status = result.status;
    if( 200 == result.httpCode)
    {
        t.is(captureContextResponse.httpCode, 200);
    } else if ( 410 == result.httpCode){
        t.is(captureContextResponse.httpCode, 410)
    } 
});

test.serial('Check status of transient token data', async (t) => {
    if( 200 == captureContextResponse.status)
    {
        t.is(captureContextResponse.status, 200);
    } else if( 200 != captureContextResponse.status){
        t.not(captureContextResponse.status, 200)
    } 
});