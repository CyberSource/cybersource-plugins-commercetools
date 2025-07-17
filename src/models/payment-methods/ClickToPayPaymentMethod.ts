import { Payment } from "@commercetools/platform-sdk";
import { PtsV2PaymentsPost201Response } from "cybersource-rest-client";

import { CustomMessages } from "../../constants/customMessages";
import { FunctionConstant } from "../../constants/functionConstant";
import { Constants } from "../../constants/paymentConstants";
import { ActionResponseType, ActionType } from "../../types/Types";
import { errorHandler, PaymentProcessingError } from "../../utils/ErrorHandler";
import paymentActions from "../../utils/PaymentActions";
import paymentValidator from "../../utils/PaymentValidator";
import cartHelper from "../../utils/helpers/CartHelper";
import { AbstractPaymentMethod } from "../AbstractPaymentMethod";

/**
 * Implementation of the Click to Pay payment method
 */
export class ClickToPayPaymentMethod extends AbstractPaymentMethod {
  constructor() {
    super(Constants.CLICK_TO_PAY);
  }

  /**
   * @inheritdoc
   */
  protected getPaymentType(): string {
    return Constants.STRING_VISA;
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
      // Get Visa Checkout data from payment response
      const visaCheckoutData = await cartHelper.getPaymentData(paymentResponse, updatePaymentObj);

      if (visaCheckoutData) {
        // Create actions for card details
        const actions: Partial<ActionType>[] = paymentActions.cardDetailsActions(visaCheckoutData);
        paymentValidator.validateActionsAndPush(actions, authResponse.actions);
      } else {
        errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_MSG_PROCESSING_REQUEST, '', FunctionConstant.FUNC_HANDLE_POST_AUTHORIZATION), __filename, 'PaymentId : ' + paymentId);
      }
    } catch (error) {
      errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_MSG_PROCESSING_REQUEST, error, FunctionConstant.FUNC_HANDLE_POST_AUTHORIZATION), __filename, 'PaymentId : ' + paymentId);
    }

    return authResponse;
  }
}