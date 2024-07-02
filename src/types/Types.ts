export type PaymentType = {
  id: string;
  version: number;
  amountPlanned: AmountPlannedType;
  paymentMethodInfo: {
    method: string;
  };
  custom?: {
    fields: PaymentCustomFieldsType;
  };
  transactions: PaymentTransactionType[];
  customer?: {
    id: string;
  };
  anonymousId?: string;
};

export type AmountPlannedType = {
  type: string;
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
};

export type TransactionObjectType = {
  version?: number;
  amount: AmountPlannedType;
  type?: string;
  state: string;
  interactionId?: string;
  timestamp?: string;
};

export type PaymentCustomFieldsType = {
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
  isv_screenHeight?: number,
  isv_screenWidth?: number,
  isv_responseDateAndTime?: string,
  isv_authorizationStatus?: string,
  isv_authorizationReasonCode?: string,
  isv_ECI?: string,
  isv_AVSResponse?: string,
  isv_CVVResponse?: string,
  isv_responseCode?: string,
  isv_dmpaFlag?: boolean;
  isv_shippingMethod?: string
};

export type PaymentTransactionType = {
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
export type OrderResultType = {
  body: {
    limit: number;
    offset: number;
    count: number;
    total: number;
    results: PaymentType[];
  };
  statusCode: number;
};

//Ct response type
export type ActionResponseType = {
  actions: ActionType[];
  errors: ErrorType[];
};

export type ActionType = {
  action?: string;
  name?: string;
  value?: string | boolean | number | string[] | null;
  type?: {
    key?: string;
    typeId?: string;
  };
  fields?: ConsumerAuthenticationInformationType;
  address?: AddressType;
  state?: string;
  interactionId?: string;
  transactionId?: string;
};

export type ErrorType = {
  code: string;
  message: string;
};

//Cutsomer Object
export type CustomerType = {
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
  addresses?: AddressType[];
  shippingAddressIds?: string[];
  billingAddressIds?: string[];
  isEmailVerified?: boolean;
  custom?: {
    fields?: CustomerCustomType;
    type?: {
      typeId: string;
      id: string;
    };
  };
  authenticationMode?: string;
};

export type AddressType = {
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
  mobile?: string;
};

export type CustomerCustomType = {
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

export type CustomerTokensType = {
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
  address?: AddressType;
};

//Mid credentials object
export type MidCredentialsType = {
  merchantId: string | undefined;
  merchantKeyId: string | undefined;
  merchantSecretKey: string | undefined;
};

export type CustomTokenType = {
  customerTokenId: string;
  paymentInstrumentId: string;
};

export type CardAddressGroupType = {
  httpCode?: number;
  billToFieldGroup?: AddressType;
  shipToFieldGroup?: AddressType;
  billTo?: AddressType;
  shipTo?: AddressType;
  cardFieldGroup?: CardFieldGroupType;
};

export type CardFieldGroupType = {
  prefix: string;
  suffix: string;
  expirationMonth: string;
  expirationYear: string;
  type: string;
};

export type ReportResponseType = {
  message: string;
  error: string;
};

export type SecurityCodeType = {
  securityCodePresent: boolean;
  transactionId: string;
  amountPlanned: {
    currencyCode: string;
    centAmount: number;
  };
};

export type ReportSyncType = SecurityCodeType & PaymentTransactionType;

export type VisaUpdateType = {
  id: string;
  version: number;
  actions: ActionType[];
};

export type ConsumerAuthenticationInformationType = {
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

export type AddTransActionType = {
  action: string;
  transaction: {
    type: string;
    timestamp: string;
    amount: AmountPlannedType;
    state: string;
    interactionId: string;
  };
};

export type ApplicationsType = {
  [x: string]: any;
  name?: string;
  reasonCode?: string;
  rCode?: string;
  rFlag?: string;
  reconciliationId?: string;
  rMessage?: string;
  returnCode?: number;
};

export type CertificateResponseType = {
  data: null;
  status: number;
};

export type OrderInformationType = {
  lineItems?: OrderInformationLineItemsType[];
  amountDetails?: {
    totalAmount: number;
    currency: string;
  };
  billTo?: CybsAddressType;
  shipTo?: CybsAddressType;
};

export type CybsAddressType = {
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

export type OrderInformationLineItemsType = {
  productName?: string;
  quantity?: number;
  productSku?: string;
  productCode?: string;
  discountAmount?: number;
  unitPrice?: number;
};

export type ResponseType = {
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

export type PaymentResponse = {
  httpCode?: number;
  status?: string;
};

export type InstrumentIdResponse = {
  httpCode: number;
  instrumentIdentifier: string;
  state: string;
  cardPrefix: string;
  cardSuffix: string;
  expirationMonth: string;
  expirationYear: string;
};

export type SubscriptionInformationType = {
  merchantId: string;
  key: string;
  keyId: string;
  keyExpiration: string;
  subscriptionId: string;
};

export type TokenCreateFlagType = {
  notSaveToken: boolean;
  isError: boolean;
};

export interface CommercetoolsError {
  statusCode: number;
  message: string;
  errors: { code: string; message: string }[];
}

export type CommercetoolsErrorResponse = {
  statusCode: number;
  message: string;
  body: { errors: { code: string; message: string }[] };
}