/* eslint-disable functional/immutable-data */
/* eslint-disable no-var */
import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import deleteToken from '../../service/payment/DeleteTokenService';
import { customerTokenObj, customerTokenObject} from '../const/DeleteTokenServiceConst';

var result = {
    httpCode:null,
    
    message:null
}

test.serial('calling delete function ', async (t)=>{
    const response:any = await deleteToken.deleteCustomerToken(customerTokenObj);
    result.httpCode=response.httpCode;
    result.message=response.message;
    t.pass()
})


test.serial('calling delete function for http code', async(t)=>{
    
    t.is(result.httpCode, 204);

})

test.serial('check for default value', async(t)=>{
   
    t.is(result.message, '');

 })

 test.serial('Deleting an invalid token', async (t)=>{
    const response:any = await deleteToken.deleteCustomerToken(customerTokenObject);
    result.httpCode=response.httpCode;
     result.message=response.message;
    t.pass()
})


test.serial('Check http code for deleting invalid token', async(t)=>{
    
    t.not(result.httpCode, 204);

})

test.serial('check status for deleting invalid token', async(t)=>{
    
    t.not(result.message, '');
    
 })