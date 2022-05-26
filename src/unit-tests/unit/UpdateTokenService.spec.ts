/* eslint-disable functional/immutable-data */
/* eslint-disable no-var */

import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

/* import updateToken from '../../service/payment/UpdateTokenService';
import { tokenObject, tokens } from '../const/UpdateTokenServiceConst'; */

var result = {
  httpCode: null,
  default: null,
};

/* test.serial('Check http code for token updation', async (t)=>{
    const response:any = await updateToken.updateTokenResponse(tokens);
    result.httpCode=response.httpCode;
    result.default=response.default;
    t.is(result.httpCode, 200);
}) */

test.serial('Check value of default after token updation', async (t) => {
  t.is(result.default, true);
});

/* test.serial('Check http code for updating invalid token', async (t) => {
  const response: any = await updateToken.updateTokenResponse(tokenObject);
  result.httpCode = response.httpCode;
  result.default = response.default;
  t.not(result.httpCode, 200);
}); */

test.serial('Check value of default for updating  invalid token', async (t) => {
  t.not(result.default, true);
});
