import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import createSearchRequest from '../../service/payment/CreateTransactionSearchRequest';
import {Constants} from '../../constants';
 

test('Run sync ', async(t)=>{
    const result:any  = await createSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, Constants.STRING_SYNC_SORT);
    t.is(result.httpCode, 201);
})