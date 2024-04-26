import test from 'ava';
import restApi from 'cybersource-rest-client';
import dotenv from 'dotenv';
dotenv.config();

import cybersourceApi from '../../utils/api/CybersourceApi';
import { configObject, requestObject } from '../const/CybersourceApiConst';

test.serial('Test get subscription details api function', async (t) => {
  let apiClient = new restApi.ApiClient();
  let result: any = {
    status: 0,
    webhookId: '',
    webhookUrl: '',
  };

  let callbackPromise = await new Promise((resolve, reject) => {
    cybersourceApi.getSubscriptionDetails(apiClient, configObject, requestObject, (_error: any, data: any, response: any) => {
      if (data) {
        result.status = response.status;
        result.webhookId = data.webhookId;
        result.webhookUrl = data.webhookUrl;
        resolve(result);
      } else {
        reject(result);
      }
    });
  });

  result = callbackPromise;
  if (200 === result.status) {
    t.is(result.status, 200);
  } else {
    t.not(result.status, 200);
  }
});
