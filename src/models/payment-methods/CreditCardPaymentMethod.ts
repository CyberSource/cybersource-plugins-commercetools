import { Customer, Payment } from "@commercetools/platform-sdk";
import { PtsV2PaymentsPost201Response } from "cybersource-rest-client";

import { FunctionConstant } from "../../constants/functionConstant";
import { Constants } from "../../constants/paymentConstants";
import { ActionResponseType } from "../../types/Types";
import paymentUtils from "../../utils/PaymentUtils";
import commercetoolsApi from '../../utils/api/CommercetoolsApi';
import tokenHelper from "../../utils/helpers/TokenHelper";
import { AbstractPaymentMethod } from "../AbstractPaymentMethod";


/**
 * Implementation of the Credit Card payment method
 */
export class CreditCardPaymentMethod extends AbstractPaymentMethod {
  constructor() {
    super(Constants.CREDIT_CARD);
  }

  /**
   * @inheritdoc
   */
  protected getPaymentType(): string {
    return Constants.STRING_CARD;
  }

  /**
   * @inheritdoc
   */
  protected async shouldSaveToken(updatePaymentObj: Payment, customerInfo: Customer | null): Promise<boolean> {
    // Evaluate if token should be saved for this payment
    const tokenCreationResponse: any = await tokenHelper.evaluateTokenCreation(
      customerInfo,
      updatePaymentObj,
      FunctionConstant.FUNC_GET_PAYMENT_RESPONSE
    );
    return tokenCreationResponse.isSaveToken;
  }

  /**
   * @inheritdoc
   */
  public async handlePostAuthorization(
    authResponse: ActionResponseType,
    paymentResponse: PtsV2PaymentsPost201Response | any,
    updatePaymentObj: Payment
  ): Promise<ActionResponseType> {
    // For credit cards, we need to handle customer token data
    const cartObj = await this.getCartObject(updatePaymentObj);
    if (cartObj && cartObj.results && cartObj.results.length > 0) {
      const customerInfo = updatePaymentObj.customer?.id ?
        await this.getCustomerInfo(updatePaymentObj.customer.id) : null;

      if (customerInfo) {
        const cardTokens = await tokenHelper.getCardTokens(
          customerInfo,
          updatePaymentObj.custom?.fields.isv_savedToken || ''
        );

        authResponse = await tokenHelper.setCustomerTokenData(
          cardTokens,
          paymentResponse,
          authResponse,
          false,
          updatePaymentObj,
          cartObj.results[0]
        );
      }
    }

    return authResponse;
  }

  /**
   * Get cart object for the payment
   * @param updatePaymentObj - The payment object
   * @returns Cart object
   */
  private async getCartObject(updatePaymentObj: Payment): Promise<any> {
    return await paymentUtils.getCartObject(updatePaymentObj);
  }

  /**
   * Get customer information
   * @param customerId - Customer ID
   * @returns Customer information
   */
  private async getCustomerInfo(customerId: string): Promise<Customer | null> {
    return await commercetoolsApi.getCustomer(customerId);
  }
}