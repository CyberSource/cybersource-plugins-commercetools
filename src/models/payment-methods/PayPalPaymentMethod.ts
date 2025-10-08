import { Payment } from "@commercetools/platform-sdk";
import { PtsV2PaymentsPost201Response } from "cybersource-rest-client";

import { CustomMessages } from "../../constants/customMessages";
import { FunctionConstant } from "../../constants/functionConstant";
import { Constants } from "../../constants/paymentConstants";
import { ActionResponseType } from "../../types/Types";
import { errorHandler, PaymentProcessingError } from "../../utils/ErrorHandler";
import paymentUtils from "../../utils/PaymentUtils";
import cartHelper from "../../utils/helpers/CartHelper";
import { AbstractPaymentMethod } from "../AbstractPaymentMethod";

/**
 * Implementation of the PayPal payment method
 */
export class PayPalPaymentMethod extends AbstractPaymentMethod {
  constructor() {
    super(Constants.PAYPAL);
  }

  /**
   * @inheritdoc
   */
  protected getPaymentType(): string {
    return Constants.PAYPAL;
  }

  /**
   * @inheritdoc
   */
  public async handlePostAuthorization(
    authResponse: ActionResponseType,
    paymentResponse: PtsV2PaymentsPost201Response | any,
    updatePaymentObj: Payment
  ): Promise<ActionResponseType> {
    const paymentId = updatePaymentObj?.id || '';

    try {
      // Handle PayPal-specific post-authorization logic
      if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
        // Update cart with PayPal address details if available
        if (paymentResponse?.data?.orderInformation?.billTo) {
          try {
            const cartObj = await paymentUtils.getCartObject(updatePaymentObj);
            if (cartObj && cartObj.results && cartObj.results.length > 0) {
              await cartHelper.updateCartWithPayPalAddress(updatePaymentObj, cartObj.results[0], paymentResponse.data);
            }
          } catch (error) {
            errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_PAYPAL_ADDRESS_DETAILS, Constants.LOG_ERROR, FunctionConstant.FUNC_HANDLE_POST_AUTHORIZATION), __filename, 'PaymentId : ' + paymentId);
          }
        }
        // Clear PayPal session data after successful authorization
        if (updatePaymentObj?.custom?.fields?.isv_payPalUrl) {
          const isv_payPalUrl = '';
          authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_payPalUrl }));
        }
        if (updatePaymentObj?.custom?.fields?.isv_payPalRequestId) {
          const isv_payPalRequestId = '';
          authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_payPalRequestId }));
        }
      }
    } catch (error) {
      errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_MSG_PROCESSING_REQUEST, Constants.LOG_ERROR, FunctionConstant.FUNC_HANDLE_POST_AUTHORIZATION), __filename, 'PaymentId : ' + paymentId);
    }

    return authResponse;
  }
}
