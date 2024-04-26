export type paymentType = {
  id: string;
  version: number;
  amountPlanned: amountPlannedType;
  paymentMethodInfo: {
    method: string;
  };
  custom?: {
    fields: paymentCustomFieldsType;
  };
  transactions: paymentTransactionType[];
  customer?: {
    id: string;
  };
  anonymousId?: string;
};

export type amountPlannedType = {
  type: string;
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
};

export type transactionObjectType = {
  version?: number;
  amount: amountPlannedType;
  type?: string;
  state: string;
  interactionId?: string;
  timestamp?: string;
};

export type paymentCustomFieldsType = {
  isv_token?: string;
  isv_tokenAlias?: string;
  isv_savedToken?: string;
  isv_tokenVerificationContext?: string;
  isv_tokenCaptureContextSignature?: string;
  isv_cardType?: string;
  isv_maskedPan?: string;
  isv_cardExpiryMonth?: string;
  isv_cardExpiryYear?: string;
  isv_requestJwt?: string;
  isv_responseJwt?: string;
  isv_payerAuthenticationRequired?: boolean;
  isv_payerAuthenticationTransactionId?: string;
  isv_payerAuthenticationAcsUrl?: string;
  isv_payerAuthenticationPaReq?: string;
  isv_cardinalReferenceId?: string;
  isv_deviceDataCollectionUrl?: string;
  isv_stepUpUrl?: string;
  isv_payerEnrollTransactionId?: string;
  isv_payerEnrollStatus?: string;
  isv_payerEnrollHttpCode?: number;
  isv_acceptHeader?: string;
  isv_userAgentHeader?: string;
  isv_deviceFingerprintId?: string;
  isv_customerIpAddress?: string;
  isv_applePayValidationUrl?: string;
  isv_applePayDisplayName?: string;
  isv_applePaySessionData?: string;
  isv_saleEnabled?: boolean;
  isv_enabledMoto?: string;
  isv_walletType?: string;
  isv_accountNumber?: string;
  isv_accountType?: string;
  isv_routingNumber?: string;
  isv_merchantId?: string;
  isv_securityCode?: number;
  isv_transientToken?: string;
  isv_customerId?: string;
};

export type paymentTransactionType = {
  id?: string;
  timestamp?: string;
  type?: string;
  amount?: {
    type?: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits?: number;
  };
  interactionId?: string;
  state?: string;
  custom?: {
    fields: {
      isv_availableCaptureAmount: number;
    };
  };
  version?: number;
};

//Order results Type
export type orderResultType = {
  body: {
    limit: number;
    offset: number;
    count: number;
    total: number;
    results: paymentType[];
  };
  statusCode: number;
};

//Ct response type
export type actionResponseType = {
  actions: actionType[];
  errors: errorType[];
};

export type actionType = {
  action?: string;
  name?: string;
  value?: string | boolean | number | string[] | null;
  type?: {
    key?: string;
    typeId?: string;
  };
  fields?: consumerAuthenticationInformationType;
  address?: addressType;
  state?: string;
  interactionId?: string;
  transactionId?: string;
};

export type errorType = {
  code: string;
  message: string;
};

//Cutsomer Object
export type customerType = {
  id: string;
  version: number;
  lastMessageSequenceNumber?: number;
  createdAt?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: {
    clientId: string;
    isPlatformClient: boolean;
    customer: {
      typeId: string;
      id: string;
    };
  };
  createdBy?: {
    clientId: string;
    isPlatformClient: boolean;
    customer: {
      typeId: string;
      id: string;
    };
  };
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  addresses?: addressType[];
  shippingAddressIds?: string[];
  billingAddressIds?: string[];
  isEmailVerified?: boolean;
  custom?: {
    fields?: customerCustomType;
    type?: {
      typeId: string;
      id: string;
    };
  };
  authenticationMode?: string;
};

export type addressType = {
  id?: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  buildingNumber?: string;
  streetName?: string;
  streetNumber?: string;
  locality?: string;
  administrativeArea?: string;
  postalCode?: string;
  city?: string;
  region?: string;
  country?: string;
  phone?: string;
  phoneNumber?: string;
  email?: string;
  additionalStreetInfo?: string;
};

export type customerCustomType = {
  isv_tokens?: string[];
  isv_token?: string;
  isv_tokenAlias?: string;
  isv_savedToken?: string;
  isv_tokenVerificationContext?: string;
  isv_tokenCaptureContextSignature?: string;
  isv_cardType?: string;
  isv_maskedPan?: string;
  isv_cardExpiryMonth?: string;
  isv_cardExpiryYear?: string;
  isv_addressId?: string;
  isv_currencyCode?: string;
  isv_deviceFingerprintId?: string;
  isv_cardNewExpiryMonth?: string;
  isv_cardNewExpiryYear?: string;
  isv_tokenUpdated?: boolean;
  isv_tokenAction?: string | null;
  isv_failedTokens?: string[];
};

export type customerTokensType = {
  alias: string;
  value?: string;
  paymentToken?: string;
  instrumentIdentifier?: string;
  cardType: string;
  cardName: string;
  cardNumber: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  addressId?: string;
  timeStamp?: string;
  address?: addressType;
};

//Mid credentials object
export type midCredentialsType = {
  merchantId: string | undefined;
  merchantKeyId: string | undefined;
  merchantSecretKey: string | undefined;
};

export type customTokenType = {
  customerTokenId: string;
  paymentInstrumentId: string;
};

export type pgAddressGroupType = {
  httpCode?: number;
  billToFieldGroup?: addressType;
  shipToFieldGroup?: addressType;
  billTo?: addressType;
  shipTo?: addressType;
  cardFieldGroup?: cardFieldGroupType;
};

export type cardFieldGroupType = {
  prefix: string;
  suffix: string;
  expirationMonth: string;
  expirationYear: string;
  type: string;
};

export type reportResponseType = {
  message: string;
  error: string;
};

export type securityCodeType = {
  securityCodePresent: boolean;
  transactionId: string;
  amountPlanned: {
    currencyCode: string;
    centAmount: number;
  };
};

export type reportSyncType = securityCodeType & paymentTransactionType;

export type visaUpdateType = {
  id: string;
  version: number;
  actions: actionType[];
};

export type consumerAuthenticationInformationType = {
  cavv?: string;
  eciRaw?: string;
  paresStatus?: string;
  indicator?: string | number;
  commerceIndicator?: string;
  authenticationResult?: string;
  xid?: string;
  cavvAlgorithm?: string;
  authenticationStatusMessage?: string;
  eci?: string;
  specificationVersion?: string;
  pareq?: string;
  paReq?: string;
  acsurl?: string;
  acsUrl?: string;
  authenticationTransactionId?: string;
  veresEnrolled?: string;
  cardinalId?: string;
  cardinalReferenceId?: string;
  proofXml?: string;
  directoryServerTransactionId?: string;
  isv_payerAuthenticationRequired?: boolean;
  isv_payerAuthenticationTransactionId?: string;
  isv_payerAuthenticationPaReq?: string;
  stepUpUrl?: string;
  isv_responseJwt?: string;
  reasonCode?: string;
  transactionId?: string;
  isv_availableCaptureAmount?: number;
  authorizationAllowed?: boolean;
  authenticationRequired?: boolean;
  isv_tokens?: string[];
  isv_tokenUpdated?: boolean;
  isv_failedTokens?: string[];
};

export type addTransactionType = {
  action: string;
  transaction: {
    type: string;
    timestamp: string;
    amount: amountPlannedType;
    state: string;
    interactionId: string;
  };
};

export type applicationsType = {
  [x: string]: any;
  name?: string;
  reasonCode?: string;
  rCode?: string;
  rFlag?: string;
  reconciliationId?: string;
  rMessage?: string;
  returnCode?: number;
};

export type certificateResponseType = {
  data: null;
  status: number;
};

export type orderInformationType = {
  lineItems?: orderInformationLineItemsType[];
  amountDetails?: {
    totalAmount: number;
    currency: string;
  };
  billTo?: cybsAddressType;
  shipTo?: cybsAddressType;
};

export type cybsAddressType = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  locality: string;
  administrativeArea: string;
  postalCode: string;
  country: string;
  email: string;
  phoneNumber: string;
};

export type orderInformationLineItemsType = {
  productName?: string;
  quantity?: number;
  productSku?: string;
  productCode?: string;
  discountAmount?: number;
  unitPrice?: number;
};

export type responseType = {
  httpCode?: number;
  transactionId?: string;
  status?: string;
  data?: any;
  deletedToken?: string;
  billToFieldGroup?: any;
  shipToFieldGroup?: any;
  cardFieldGroup?: any;
  isv_tokenCaptureContextSignature?: string;
  isv_tokenVerificationContext?: string;
  accessToken?: string;
  referenceId?: string;
  deviceDataCollectionUrl?: string;
};

export type paymentResponse = {
  httpCode?: number;
  status?: string;
};

export type instrumentIdResponse = {
  httpCode: number;
  instrumentIdentifier: string;
  state: string;
  cardPrefix: string;
  cardSuffix: string;
  expirationMonth: string;
  expirationYear: string;
};

export type subscriptionInformationType = {
  merchantId: string;
  key: string;
  keyId: string;
  keyExpiration: string;
  subscriptionId: string;
};

export type tokenCreateFlagType = {
  notSaveToken: boolean;
  isError: boolean;
};
