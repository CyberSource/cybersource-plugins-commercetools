/* eslint-disable functional/immutable-data */
/* eslint-disable no-var */
import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import deleteToken from '../../service/payment/DeleteTokenService';
import { customerTokenObj} from '../const/DeleteTokenServiceConst';

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
    if(result.httpCode == 204)
    {
        t.is(result.httpCode, 204);
    }
    else
    {
        t.not(resultObject.httpCode, 204);
    }
})

