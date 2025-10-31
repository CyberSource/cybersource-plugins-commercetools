import { Cart, Payment } from '@commercetools/platform-sdk';
import restApi, { CreatePaymentRequest, Ptsv2paymentsOrderInformation, Ptsv2paymentsProcessingInformation } from 'cybersource-rest-client';

import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { PaymentTransactionType, ResponseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';


const getCreateOrderResponse = async (payment: Payment, requestId: string, accountId: string, cart: Cart): Promise<any> => {
  let createOrderResponse: any;

  if (requestId) {
    const apiClient = new restApi.ApiClient();
    const configObject = prepareFields.getConfigObject(FunctionConstant.FUNC_CREATE_ORDER_RESPONSE, null, payment, null);
    const clientReferenceInformation = prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_CREATE_ORDER_RESPONSE, payment.id, payment);
    const orderInformation = prepareFields.getOrderInformation(FunctionConstant.FUNC_CREATE_ORDER_RESPONSE, payment, payment.transactions[0] as Partial<PaymentTransactionType>, cart, null, null, '', '') as Ptsv2paymentsOrderInformation;
    const paymentInformation = prepareFields.getPaymentInformation(FunctionConstant.FUNC_CREATE_ORDER_RESPONSE, payment, null, accountId);
    const processingInformation = prepareFields.getProcessingInformation(FunctionConstant.FUNC_CREATE_ORDER_RESPONSE, null, '', Constants.STRING_ORDER, null, null) as Ptsv2paymentsProcessingInformation;
    const requestObj: CreatePaymentRequest = {
      clientReferenceInformation: clientReferenceInformation,
      paymentInformation: paymentInformation,
      processingInformation: processingInformation,
      orderInformation: orderInformation
    };
    if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_CREATE_ORDER_RESPONSE, Constants.LOG_DEBUG, 'RequestId : ' + requestId, 'Create Order Request = ' + JSON.stringify(requestObj));
    }
    const paymentApiInstance = configObject && new restApi.PaymentsApi(await configObject, apiClient);
    const startTime = new Date().getTime();
    return await new Promise<Partial<ResponseType>>(function (resolve, reject) {
      if (paymentApiInstance) {
        paymentApiInstance.createOrderRequest(requestObj, requestId, (_error: any, data: any, response: any) => {
          const endTime = new Date().getTime();
          paymentUtils.logData(__filename, FunctionConstant.FUNC_CREATE_ORDER_RESPONSE, Constants.LOG_DEBUG, 'RequestId : ' + requestId, 'Create Order Response = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
          if (data) {
            createOrderResponse = data;
            resolve(createOrderResponse);
          } else {
            reject(createOrderResponse);
          }
        });
      }
    }).catch((error) => {
      return error;
    });
  } else {
    return createOrderResponse;
  }
};

export default { getCreateOrderResponse };
