/* eslint-disable functional/immutable-data */
/* eslint-disable no-var */
import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import deleteToken from '../../service/payment/DeleteTokenService';
import { customerTokenObj, customerTokenObject} from '../const/DeleteTokenServiceConst';

var result = {
    httpCode:null,
    deletedToken:null,
    message:null
}

var resultObject = {
    httpCode:null,
    deletedToken:null,
    message:null
}

test.serial('Deleting a token and check http code', async (t)=>{
    const response:any = await deleteToken.deleteCustomerToken(customerTokenObj);
    result.httpCode=response.httpCode;
    result.deletedToken=response.deletedToken;
    result.message=response.message;
    t.is(result.httpCode, 204);
})

test.serial('Check returned message after token deletion', async(t)=>{
   
    t.is(result.message, '');

 })

 test.serial('Deleting an invalid token and check http code', async (t)=>{
    const response:any = await deleteToken.deleteCustomerToken(customerTokenObject);
    resultObject.httpCode=response.httpCode;
    resultObject.deletedToken = response.deletedToken;
    resultObject.message=response.message;
    t.not(resultObject.httpCode, 204);
})

test.serial('Check status for deleting invalid token', async(t)=>{
    
    t.is(resultObject.deletedToken, '');
 })