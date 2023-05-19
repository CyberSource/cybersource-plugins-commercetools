import resourceHandler from '././utils/config/ResourceHandler';
import paymentService from '././utils/PaymentService';
import path from 'path';
import { Constants } from '././constants';
import dotenv from 'dotenv';
dotenv.config();
const setupExtensionResources = async () => {
  let exceptionData: any;
  try {
    if (process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL && process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE && process.env.CT_PROJECT_KEY && process.env.CT_CLIENT_ID && process.env.CT_CLIENT_SECRET && process.env.CT_AUTH_HOST && process.env.CT_API_HOST) {
      await resourceHandler.ensureExtension();
      await resourceHandler.ensureCustomTypes();
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SETUP_RESOURCES, Constants.LOG_ERROR, null, Constants.ERROR_MSG_SETUP_RESOURCES);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SETUP_RESOURCES, Constants.LOG_ERROR, null, Constants.EXCEPTION_MSG_SETUP_RESOURCES + exceptionData);
  }
};

export { setupExtensionResources };
