import { Constants } from "../../constants/paymentConstants";
import { AbstractPaymentMethod } from "../AbstractPaymentMethod";

/**
 * Implementation of the eCheck payment method
 */
export class ECheckPaymentMethod extends AbstractPaymentMethod {
  constructor() {
    super(Constants.ECHECK);
  }

  /**
   * @inheritdoc
   */
  protected getPaymentType(): string {
    return Constants.STRING_CARD;
  }
}