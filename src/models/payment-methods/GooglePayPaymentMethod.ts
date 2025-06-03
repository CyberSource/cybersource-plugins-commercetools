import { PtsV2PaymentsPost201Response } from "cybersource-rest-client";

import { Constants } from "../../constants/paymentConstants";
import { ActionResponseType, CardAddressGroupType } from "../../types/Types";
import paymentActions from "../../utils/PaymentActions";
import paymentValidator from "../../utils/PaymentValidator";
import { AbstractPaymentMethod } from "../AbstractPaymentMethod";

/**
 * Implementation of the Google Pay payment method
 */
export class GooglePayPaymentMethod extends AbstractPaymentMethod {
  constructor() {
    super(Constants.GOOGLE_PAY);
  }

  /**
   * @inheritdoc
   */
  protected getPaymentType(): string {
    return Constants.STRING_GOOGLE_PAY;
  }

  /**
   * @inheritdoc
   */
  public async handlePostAuthorization(
    authResponse: ActionResponseType,
    paymentResponse: PtsV2PaymentsPost201Response | any,
  ): Promise<ActionResponseType> {
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
      // Extract card details from the payment response
      const cardDetails: Partial<CardAddressGroupType> = {
        cardFieldGroup: {
          prefix: '',
          suffix: '',
          expirationMonth: '',
          expirationYear: '',
          type: '',
        },
      };

      // Get card details from tokenized card or regular card
      if (paymentResponse?.data?.paymentInformation?.tokenizedCard &&
        paymentResponse.data.paymentInformation.tokenizedCard?.expirationMonth) {
        cardDetails.cardFieldGroup = paymentResponse.data.paymentInformation.tokenizedCard;
      } else if (paymentResponse?.data?.paymentInformation?.card &&
        paymentResponse.data.paymentInformation.card?.expirationMonth) {
        cardDetails.cardFieldGroup = paymentResponse.data.paymentInformation.card;
      }

      // Create actions for card details
      const actions = paymentActions.cardDetailsActions(cardDetails);
      paymentValidator.validateActionsAndPush(actions, authResponse.actions);
    }

    return authResponse;
  }
}