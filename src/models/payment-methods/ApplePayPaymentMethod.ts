import { Payment } from "@commercetools/platform-sdk";
import { PtsV2PaymentsPost201Response } from "cybersource-rest-client";

import { Constants } from "../../constants/paymentConstants";
import { ActionResponseType } from "../../types/Types";
import paymentActions from "../../utils/PaymentActions";
import paymentUtils from "../../utils/PaymentUtils";
import paymentValidator from "../../utils/PaymentValidator";
import cartHelper from "../../utils/helpers/CartHelper";
import { AbstractPaymentMethod } from "../AbstractPaymentMethod";

/**
 * Implementation of the Apple Pay payment method
 */
export class ApplePayPaymentMethod extends AbstractPaymentMethod {
  constructor() {
    super(Constants.APPLE_PAY);
  }

  protected getPaymentType(): string {
    return Constants.STRING_CARD;
  }

  public async handlePostAuthorization(
    authResponse: ActionResponseType,
    paymentResponse: PtsV2PaymentsPost201Response | any,
    updatePaymentObj: Payment
  ): Promise<ActionResponseType> {
    const cardDetails = await cartHelper.getPaymentData(paymentResponse, updatePaymentObj);
    if (cardDetails) {
      const actions = paymentActions.cardDetailsActions(cardDetails);
      paymentValidator.validateActionsAndPush(actions, authResponse.actions);
    }
    if (updatePaymentObj?.custom?.fields?.isv_applePaySessionData) {
      const isv_applePaySessionData = '';
      authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_applePaySessionData }));
    }

    return authResponse;
  }
}