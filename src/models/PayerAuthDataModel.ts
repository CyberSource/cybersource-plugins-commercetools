import { PtsV2PaymentsPost201ResponseConsumerAuthenticationInformation } from "cybersource-rest-client";

import { Constants } from "../constants/constants";
import paymentValidator from "../utils/PaymentValidator";

export class PayerAuthData {
    isv_payerAuthenticationPaReq?: string;
    isv_payerAuthenticationTransactionId?: string;
    stepUpUrl?: string;
    isv_responseJwt?: string;
    isv_payerAuthenticationRequired?: boolean;
    xid?: string;
    pareq?: string;
    cardinalId?: string;
    proofXml?: string;
    veresEnrolled?: string;
    specificationVersion?: string;
    acsurl?: string;
    authenticationTransactionId?: string;
    directoryServerTransactionId?: string;

    /**
     * Constructor for the PayerAuthData class.
     * Maps values from the `consumerAuthenticationInformation` and `paymentResponse` objects to internal properties.
     * The mapping uses `paymentValidator.setObjectValue` to ensure the correct mapping of data types and field values.
     * 
     * @param {PtsV2PaymentsPost201ResponseConsumerAuthenticationInformation} consumerAuthenticationInformation - 
     * Consumer authentication information object returned in the response.
     * @param {any} paymentResponse - The payment response object containing additional payer authentication information.
     */
    constructor(consumerAuthenticationInformation: PtsV2PaymentsPost201ResponseConsumerAuthenticationInformation, paymentResponse: any) {
        const payerAuthenticationInformation = [
            { source: consumerAuthenticationInformation, srcKey: 'pareq', type: Constants.STR_STRING, targetKey: 'isv_payerAuthenticationPaReq' },
            { source: consumerAuthenticationInformation, srcKey: 'authenticationTransactionId', type: Constants.STR_STRING, targetKey: 'isv_payerAuthenticationTransactionId' },
            { source: consumerAuthenticationInformation, srcKey: 'stepUpUrl', type: Constants.STR_STRING, targetKey: 'stepUpUrl' },
            { source: consumerAuthenticationInformation, srcKey: 'accessToken', type: Constants.STR_STRING, targetKey: 'isv_responseJwt' },
            { source: consumerAuthenticationInformation, srcKey: 'xid', type: Constants.STR_STRING, targetKey: 'xid' },
            { source: consumerAuthenticationInformation, srcKey: 'pareq', type: Constants.STR_STRING, targetKey: 'pareq' },
            { source: paymentResponse, srcKey: 'cardinalReferenceId', type: Constants.STR_STRING, targetKey: 'cardinalId' },
            { source: consumerAuthenticationInformation, srcKey: 'proofXml', type: Constants.STR_STRING, targetKey: 'proofXml' },
            { source: consumerAuthenticationInformation, srcKey: 'veresEnrolled', type: Constants.STR_STRING, targetKey: 'veresEnrolled' },
            { source: consumerAuthenticationInformation, srcKey: 'specificationVersion', type: Constants.STR_STRING, targetKey: 'specificationVersion' },
            { source: consumerAuthenticationInformation, srcKey: 'acsUrl', type: Constants.STR_STRING, targetKey: 'acsUrl' },
            { source: consumerAuthenticationInformation, srcKey: 'authenticationTransactionId', type: Constants.STR_STRING, targetKey: 'authenticationTransactionId' },
            { source: consumerAuthenticationInformation, srcKey: 'directoryServerTransactionId', type: Constants.STR_STRING, targetKey: 'directoryServerTransactionId' }
        ];
        payerAuthenticationInformation.forEach(information => {
            paymentValidator.setObjectValue(this, information.targetKey, information.source, information.srcKey, information.type, false);
        });
        this.isv_payerAuthenticationRequired = true;
    }
}