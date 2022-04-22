import test from 'ava';
import dotenv from  'dotenv';

dotenv.config();

import sync from '../../service/payment/DecisionSyncService'

test('Check http code for decisiom sync', async (t)=>{
    const result:any = await sync.conversionDetails();
   let i=0;
   if(result.httpCode==200   || result.httpCode==404)
   {
       i++;
   }
    t.is(i, 1);
})