import { Cart, Customer, Payment } from "@commercetools/platform-sdk";
import { PtsV2PaymentsPost201Response } from "cybersource-rest-client";

import { ActionResponseType, CustomTokenType, PaymentTransactionType } from "../types/Types";

/**
 * Interface defining the contract for all payment method strategies
 */
export interface PaymentMethodStrategy {
  /**
   * Process authorization for a payment method
   * 
   * @param updatePaymentObj - The payment object to process
   * @param customerInfo - Customer information (optional)
   * @param cartInfo - Cart information
   * @param updateTransactions - Transaction details
   * @param cardTokens - Card tokens
   * @param orderNo - Order number
   * @returns Response containing error status, payment response, and authorization response
   */
  processAuthorization(
    updatePaymentObj: Payment,
    customerInfo: Customer | null,
    cartInfo: Cart,
    updateTransactions: Partial<PaymentTransactionType>,
    cardTokens: CustomTokenType,
    orderNo: string
  ): Promise<PaymentMethodResponse>;

  /**
   * Handle post-authorization tasks specific to the payment method
   * 
   * @param authResponse - The authorization response
   * @param paymentResponse - The payment response
   * @param updatePaymentObj - The payment object
   * @returns Updated authorization response
   */
  handlePostAuthorization(
    authResponse: ActionResponseType,
    paymentResponse: PtsV2PaymentsPost201Response | any,
    updatePaymentObj: Payment
  ): Promise<ActionResponseType>;
}

/**
 * Standard response format for payment method operations
 */
export interface PaymentMethodResponse {
  isError: boolean;
  paymentResponse: PtsV2PaymentsPost201Response | any;
  authResponse: ActionResponseType;
}