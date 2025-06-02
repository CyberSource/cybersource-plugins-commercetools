import { Constants } from "../constants/paymentConstants";

import { PaymentMethodStrategy } from "./PaymentMethodStrategy";
import { ApplePayPaymentMethod } from "./payment-methods/ApplePayPaymentMethod";
import { ClickToPayPaymentMethod } from "./payment-methods/ClickToPayPaymentMethod";
import { CreditCardPaymentMethod } from "./payment-methods/CreditCardPaymentMethod";
import { ECheckPaymentMethod } from "./payment-methods/ECheckPaymentMethod";
import { GooglePayPaymentMethod } from "./payment-methods/GooglePayPaymentMethod";

/**
 * Factory class for creating payment method strategy instances
 */
export class PaymentMethodFactory {
  // Cache for payment method instances
  private static paymentMethodInstances: Map<string, PaymentMethodStrategy> = new Map();

  /**
   * Get a payment method strategy instance based on the payment method type
   * 
   * @param paymentMethod - The payment method type
   * @returns The appropriate payment method strategy instance
   * @throws Error if the payment method is not supported
   */
  public static getPaymentMethod(paymentMethod: string): PaymentMethodStrategy {
    // Check if we already have an instance for this payment method
    if (this.paymentMethodInstances.has(paymentMethod)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.paymentMethodInstances.get(paymentMethod)!;
    }

    // Create a new instance based on the payment method
    let paymentMethodInstance: PaymentMethodStrategy;

    switch (paymentMethod) {
      case Constants.CREDIT_CARD:
        paymentMethodInstance = new CreditCardPaymentMethod();
        break;
      case Constants.GOOGLE_PAY:
        paymentMethodInstance = new GooglePayPaymentMethod();
        break;
      case Constants.CLICK_TO_PAY:
        paymentMethodInstance = new ClickToPayPaymentMethod();
        break;
      case Constants.APPLE_PAY:
        paymentMethodInstance = new ApplePayPaymentMethod();
        break;
      case Constants.ECHECK:
        paymentMethodInstance = new ECheckPaymentMethod();
        break;
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }

    // Cache the instance for future use
    this.paymentMethodInstances.set(paymentMethod, paymentMethodInstance);

    return paymentMethodInstance;
  }
}