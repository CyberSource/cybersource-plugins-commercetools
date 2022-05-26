/* eslint-disable no-var */
/* eslint-disable sort-imports */
/* eslint-disable import/order */
import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import {anonymousId, customerId, paymentId} from '../const/CommercetoolsApiConst';
import commercetoolsApi  from '../../utils/api/CommercetoolsApi';


test.serial('Retrieving cart using customerid ', async(t)=>{
    const result = await commercetoolsApi.retrieveCartByCustomerId(customerId);
    if(result.count>0)
    {
        t.is(result.count, 1);
        t.is(result.results[0].type, 'Cart');
        t.is(result.results[0].cartState, 'Active');
    }
    else
    {
        t.is(result.count, 0);
        t.is(result.total, 0);
    }
})

test.serial('Retrieving cart using paymentid ', async(t)=>{
    const result = await commercetoolsApi.retrieveCartByPaymentId(paymentId);
    t.is(result.count, 1);
    t.is(result.results[0].type, 'Cart');
    if(result.results[0].cartState=='Active')
    {
        t.is(result.results[0].cartState, 'Active');
    }
    else if(result.results[0].cartState=='Merged')
    {
        t.is(result.results[0].cartState, 'Merged');
    }
    else if(result.results[0].cartState=='Ordered')
    {
        t.is(result.results[0].cartState, 'Ordered');
    }
})

test.serial('Retrieving payment using paymentid ', async(t)=>{
    const result = await commercetoolsApi.retrievePayment(paymentId);
    var i =0;
    if('amountPlanned' in result  && 'paymentMethodInfo' in result && 'paymentStatus' in result)
    {
        i++;
    }
    t.is(i,1);
})

test.serial('Get all orders ', async(t)=>{
    const result = await commercetoolsApi.getOrders();
    var i=0;
    if('limit' in result && 'offset' in result && 'count' in result && 'total' in result)
    {
        i++;
    }
    t.is(i,1);
})

test.serial('get customer using customer id', async(t)=>{
    const result = await commercetoolsApi.getCustomer(customerId);
    var i=0;
    if('email' in result && 'firstName' in result && 'lastName' in result && 'custom' in result)
    {
        i++;
    }
    t.is(i,1);
})

test.serial('Retrieving cart by anonymous id ', async(t)=>{
    const result  =await commercetoolsApi.retrieveCartByAnonymousId(anonymousId);
    if(result.count>0)
    {
        t.is(result.count, 1);
        t.is(result.results[0].type, 'Cart');
        t.is(result.results[0].cartState, 'Active');
    }
    else
    {
        t.is(result.count, 0);
        t.is(result.total, 0);
    }
})


