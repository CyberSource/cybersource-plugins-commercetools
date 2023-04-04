import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import {anonymousId, cartId,customerId, paymentId, key} from '../const/CommercetoolsApiConst';
import commercetoolsApi  from '../../utils/api/CommercetoolsApi';


test.serial('Retrieving cart using customerid ', async(t)=>{
    const result = await commercetoolsApi.retrieveCartByCustomerId(customerId);
        if(result.count>0)
        {
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
        }
        else
        {
            t.is(result.count, 0);
            t.is(result.total, 0);
        }     
})

test.serial('Retrieving cart using paymentid ', async(t)=>{
    const result = await commercetoolsApi.retrieveCartByPaymentId(paymentId);
    if(result.count==1)
    {
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
    }
    else
    {
        t.not(result.count, 1);
        t.deepEqual(result.results, []);
    }
})

test.serial('Retrieving payment using paymentid ', async(t)=>{
    const result = await commercetoolsApi.retrievePayment(paymentId);
    if(result)
    {
        var i =0;
        if('amountPlanned' in result  && 'paymentMethodInfo' in result && 'paymentStatus' in result)
        {
            i++;
        }
        t.is(i,1);
    }
    else
    {
        t.pass();
    }
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
    if(result)
    {
        var i=0;
        if('email' in result && 'firstName' in result && 'lastName' in result && 'custom' in result)
        {
            i++;
        }
        t.is(i,1);
    }
    else
    {
        t.pass();
    }
})

test.serial('Retrieving cart by anonymous id ', async(t)=>{
    const result  =await commercetoolsApi.retrieveCartByAnonymousId(anonymousId);
    if(result.count>0)
    {
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
    }
    else
    {
        t.is(result.count, 0);
        t.is(result.total, 0);
    }
})

test.serial('Retrieving order by cart id ', async(t)=>{
    const result  =await commercetoolsApi.retrieveOrderByCartId(cartId);
    if(result.count>0)
    {
        t.is(result.count, 1);
        t.is(result.results[0].type, 'Order');
        if(result.results[0].orderState=='Open')
        {
            t.is(result.results[0].orderState, 'Open');
        }
        else if(result.results[0].orderState=='Confirmed')
        {
            t.is(result.results[0].orderState, 'Confirmed');
        }
        else if(result.results[0].orderState=='Complete')
        {
            t.is(result.results[0].orderState, 'Complete');
        }
        else if(result.results[0].orderState=='Cancelled')
        {
            t.is(result.results[0].orderState, 'Cancelled');
        }
    }
    else
    {
        t.is(result.count, 0);
        t.is(result.total, 0);
    }
})

test.serial('Retrieving order by payment id ', async(t)=>{
    const result  =await commercetoolsApi.retrieveOrderByPaymentId(paymentId);
    if(result.count>0)
    {
        t.is(result.count, 1);
        t.is(result.results[0].type, 'Order');
        if(result.results[0].orderState=='Open')
        {
            t.is(result.results[0].orderState, 'Open');
        }
        else if(result.results[0].orderState=='Confirmed')
        {
            t.is(result.results[0].orderState, 'Confirmed');
        }
        else if(result.results[0].orderState=='Complete')
        {
            t.is(result.results[0].orderState, 'Complete');
        }
        else if(result.results[0].orderState=='Cancelled')
        {
            t.is(result.results[0].orderState, 'Cancelled');
        }
    }
    else
    {
        t.is(result.count, 0);
        t.is(result.total, 0);
    }
})

test.serial('Get custom type ', async(t)=>{
    const result = await commercetoolsApi.getCustomType(key);
    t.is(result.statusCode, 200);
})




