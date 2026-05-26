/* START GENAI */
 const configObject = {
  authenticationType: 'http_signature',
  runEnvironment: process.env.PAYMENT_GATEWAY_TEST_ENVIRONMENT || 'apitest.cybersource.com',
  merchantID: process.env.PAYMENT_GATEWAY_MERCHANT_ID || '',
  merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID || '',
  merchantsecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY || '',
/* END GENAI */
  logConfiguration: {
    enableLog: false,
  },
};
 const requestObject = {
  organizationId: 'visa_isv_commercetools_pmt',
  productId: 'ctNetworkTokenSubscription',
  eventType: 'tms.networktoken.updated',
  offset: 0,
  limit: 10,
  status: 'active',
};

export default {
  configObject,
  requestObject
}