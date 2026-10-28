import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import paymentUtils from '../../utils/PaymentUtils';
import isvApi from '../../utils/api/IsvApi';

/**
 * Product IDs that CyberSource may use for fraud/decision-manager entitlement; varies by MID.
 */
const FRAUD_PRODUCT_IDS = [Constants.PAYMENT_GATEWAY_FRAUD_PRODUCT_ID, Constants.PAYMENT_GATEWAY_FRAUD_MANAGEMENT_ESSENTIALS_PRODUCT_ID];

/**
 * Looks up the products this merchant is entitled to and resolves the fraud/decision-manager
 * product id and its supported event types, since both vary per MID.
 * Shared by webhook creation and webhook lookup so they agree on the same productId/eventTypes.
 * @param {any} apiClient - Configured CyberSource API client.
 * @param {any} configObject - The SDK configuration object.
 * @param {string} organizationId - The merchant organization ID.
 * @returns {Promise<{ productId: string; eventTypes: string[] } | null>} The resolved product, or null when not entitled.
 */
const getFraudProductSubscription = async (apiClient: any, configObject: any, organizationId: string): Promise<{ productId: string; eventTypes: string[] } | null> => {
    const resolveProductPromise = new Promise<{ productId: string; eventTypes: string[] } | null>((resolve) => {
        isvApi.getSubscribedProducts(apiClient, configObject, organizationId, (error: any, data: any, response: any) => {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_SUBSCRIBED_PRODUCTS, Constants.LOG_DEBUG, '', 'Get subscribed products response = ' + paymentUtils.maskData(JSON.stringify(response)));
            if (error || !Array.isArray(data)) {
                paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_SUBSCRIBED_PRODUCTS, Constants.LOG_WARN, '', 'Unable to retrieve subscribed products for organizationId=' + organizationId);
                resolve(null);
                return;
            }
            const fraudProduct = FRAUD_PRODUCT_IDS.map((productId) => data.find((product: any) => product?.productId === productId)).find((product) => !!product);
            const eventTypes = (fraudProduct?.eventTypes || []).map((eventType: any) => eventType?.eventName).filter((eventName: any) => !!eventName);
            if (!fraudProduct?.productId || !eventTypes.length) {
                paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_SUBSCRIBED_PRODUCTS, Constants.LOG_WARN, '', 'No fraud/decision-manager product entitlement found for organizationId=' + organizationId);
                resolve(null);
                return;
            }
            resolve({ productId: fraudProduct.productId, eventTypes });
        });
    });
    const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_SUBSCRIBED_PRODUCTS, Constants.LOG_WARN, '', 'Get subscribed products timed out after 10s');
            resolve(null);
        }, 10000);
    });
    return await Promise.race([resolveProductPromise, timeoutPromise]);
};

export default { getFraudProductSubscription };
