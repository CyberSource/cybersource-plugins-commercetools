/* eslint-disable @typescript-eslint/no-unused-vars */
import { Cart, Customer, Payment } from "@commercetools/platform-sdk";
import { PtsV2PaymentsPost201Response } from "cybersource-rest-client";

import { CustomMessages } from "../constants/customMessages";
import { FunctionConstant } from "../constants/functionConstant";
import { Constants } from "../constants/paymentConstants";
import CheckTransactionStatus from "../service/payment/CheckTransactionStatus";
import CreateOrderService from "../service/payment/CreateOrderService";
import paymentAuthorization from '../service/payment/PaymentAuthorizationService';
import { ActionResponseType, CustomTokenType, PaymentTransactionType } from "../types/Types";
import { errorHandler, PaymentProcessingError } from "../utils/ErrorHandler";
import paymentUtils from "../utils/PaymentUtils";
import cartHelper from "../utils/helpers/CartHelper";
import paymentHelper from "../utils/helpers/PaymentHelper";

import { PaymentMethodResponse, PaymentMethodStrategy } from "./PaymentMethodStrategy";

/**
 * Abstract base class implementing common functionality for all payment methods
 */
export abstract class AbstractPaymentMethod implements PaymentMethodStrategy {
  /**
   * The payment method identifier
   */
  protected paymentMethodId: string;

  /**
   * Constructor
   * @param paymentMethodId - The payment method identifier
   */
  constructor(paymentMethodId: string) {
    this.paymentMethodId = paymentMethodId;
  }

  /**
   * Process authorization for a payment method
   * 
   * @param updatePaymentObj - The payment object to process
   * @param _customerInfo - Customer information (optional)
   * @param cartInfo - Cart information
   * @param updateTransactions - Transaction details
   * @param cardTokens - Card tokens
   * @param orderNo - Order number
   * @returns Response containing error status, payment response, and authorization response
   */
  public async processAuthorization(
    updatePaymentObj: Payment,
    customerInfo: Customer | null,
    cartInfo: Cart,
    updateTransactions: Partial<PaymentTransactionType>,
    cardTokens: CustomTokenType,
    orderNo: string
  ): Promise<PaymentMethodResponse> {
    let isError = false;
    let authResponse: ActionResponseType = paymentUtils.getEmptyResponse();
    let paymentResponse;
    let createOrder;
    let intentsId;
    try {
      if (updatePaymentObj?.custom?.fields?.isv_transientToken &&
        (Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE ||
          paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING))) {
        cartInfo = await cartHelper.updateCartWithUCAddress(updatePaymentObj, cartInfo);
      }
      if (updatePaymentObj?.custom?.fields?.isv_payPalUrl && updatePaymentObj.custom.fields.isv_payPalRequestId) {
        let transactionStatus = await CheckTransactionStatus.getTransactionStatusResponse(updatePaymentObj, updatePaymentObj.custom.fields.isv_payPalRequestId);
        if (Constants.STRING_CREATED === transactionStatus.status && transactionStatus?.paymentInformation?.eWallet?.accountId) {
          createOrder = await CreateOrderService.getCreateOrderResponse(updatePaymentObj, updatePaymentObj?.custom?.fields?.isv_payPalRequestId, transactionStatus?.paymentInformation?.eWallet?.accountId, cartInfo);
          if (Constants.STRING_CREATED === createOrder.status && createOrder.id) {
            cartInfo = await cartHelper.updateCartWithPayPalAddress(updatePaymentObj, cartInfo, transactionStatus);
            intentsId = createOrder.id;
          } else {
            isError = true;
          }
        }
      }
      paymentResponse = await this.getAuthorizationResponse(
        updatePaymentObj,
        cartInfo,
        cardTokens,
        orderNo,
        customerInfo,
        intentsId
      );
      if (paymentResponse && paymentResponse.httpCode) {
        authResponse = await this.getAuthResponse(paymentResponse, updateTransactions);
        if (authResponse && authResponse.actions && authResponse.actions.length) {
          authResponse = await this.handlePostAuthorization(authResponse, paymentResponse, updatePaymentObj);
        } else {
          isError = true;
        }
      } else {
        isError = true;
      }
    } catch (error) {
      errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_MSG_PROCESSING_REQUEST, error, FunctionConstant.FUNC_PROCESS_AUTHORIZATION), __filename, 'PaymentId : ' + updatePaymentObj.id);
      isError = true;
    }

    return { isError, paymentResponse, authResponse };
  }

  /**
   * Get authorization response from payment service
   * This method can be overridden by specific payment methods if needed
   * 
   * @param updatePaymentObj - The payment object
   * @param cartInfo - Cart information
   * @param cardTokens - Card tokens
   * @param orderNo - Order number
   * @returns Payment service response
   */
  protected async getAuthorizationResponse(
    updatePaymentObj: Payment,
    cartInfo: Cart,
    cardTokens: CustomTokenType,
    orderNo: string,
    customerInfo: Customer | null,
    intentsId?: string
  ): Promise<PtsV2PaymentsPost201Response | any> {
    // Default implementation uses the payment authorization service
    const isSaveToken = await this.shouldSaveToken(updatePaymentObj, customerInfo);
    return await paymentAuthorization.getAuthorizationResponse(
      updatePaymentObj,
      cartInfo,
      this.getPaymentType(),
      cardTokens,
      isSaveToken,
      false,
      orderNo,
      intentsId
    );
  }

  /**
   * Get the payment type string for the authorization service
   * Must be implemented by concrete classes
   */
  protected abstract getPaymentType(): string;

  /**
   * Determine if token should be saved
   * Can be overridden by concrete classes
   */
  protected async shouldSaveToken(_updatePaymentObj: Payment, _customerInfo: Customer | null): Promise<boolean> {
    return false;
  }

  /**
   * Process the authorization response
   * This is shared functionality for all payment methods
   * 
   * @param paymentResponse - The response from payment service
   * @param transactionDetail - Transaction details
   * @returns Processed action response
   */
  protected async getAuthResponse(
    paymentResponse: PtsV2PaymentsPost201Response | any,
    transactionDetail: Partial<PaymentTransactionType> | null
  ): Promise<ActionResponseType> {
    return paymentHelper.getAuthResponse(paymentResponse, transactionDetail);
  }

  /**
   * Handle post-authorization tasks
   * Default implementation does nothing, should be overridden by concrete classes if needed
   */
  public async handlePostAuthorization(
    authResponse: ActionResponseType,
    _paymentResponse: PtsV2PaymentsPost201Response | any,
    _updatePaymentObj: Payment
  ): Promise<ActionResponseType> {
    return authResponse;
  }
}