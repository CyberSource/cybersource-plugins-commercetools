/* eslint-disable no-var */
import applePay from '../../JSON/applePay.json';
import creditCard from '../../JSON/creditCard.json';
export var payment = {
  id: '274232a7-6d5e-4904-88d2-97e6d2fa8798',
  version: 4,
  lastMessageSequenceNumber: 2,
  createdAt: '2022-01-25T09:48:20.135Z',
  lastModifiedAt: '2022-01-25T09:48:35.927Z',
  lastModifiedBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'de2127f2-1e51-429e-90fd-47521b95108c',
    },
  },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'de2127f2-1e51-429e-90fd-47521b95108c',
    },
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'applePay',
    name: {
      en: 'Apple Pay',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '87b9d9db-74a3-45d7-8e60-dde669866808',
    },
    fields: {
      isv_deviceFingerprintId: '5f39f56e-fb1f-4c29-80af-5168603ab5ce',
      isv_applePayValidationUrl: 'https://apple-pay-gateway-cert.apple.com/paymentservices/startSession',
      isv_acceptHeader: '*/*',
      isv_applePayDisplayName: 'Sunrise',
      isv_customerIpAddress: '49.206.8.235',
      isv_userAgentHeader: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
      isv_applePaySessionData: '{"epochTimestamp":1646040487087,"expiresAt":1646044087087,"merchantSessionIdentifier":"SSH16DCA47C8288434F8F9F1B6C252F9827_916523AAED1343F5BC5815E12BEE9250AFFDC1A17C46B0DE5A943F0F94927C24","nonce":"21432f7c","merchantIdentifier":"490BF9671420F23BAF41925E4FF7474DFD27854BD78C9DE6C0DEC26EF9567B06","domainName":"www.qa.ct.cybsplugin.com","displayName":"Sunrise","signature":"308006092a864886f70d010702a0803080020101310f300d06096086480165030402010500308006092a864886f70d0107010000a080308203e43082038ba003020102020859d8a1bcaaf4e3cd300a06082a8648ce3d040302307a312e302c06035504030c254170706c65204170706c69636174696f6e20496e746567726174696f6e204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b3009060355040613025553301e170d3231303432303139333730305a170d3236303431393139333635395a30623128302606035504030c1f6563632d736d702d62726f6b65722d7369676e5f5543342d53414e44424f5831143012060355040b0c0b694f532053797374656d7331133011060355040a0c0a4170706c6520496e632e310b30090603550406130255533059301306072a8648ce3d020106082a8648ce3d030107034200048230fdabc39cf75e202c50d99b4512e637e2a901dd6cb3e0b1cd4b526798f8cf4ebde81a25a8c21e4c33ddce8e2a96c2f6afa1930345c4e87a4426ce951b1295a38202113082020d300c0603551d130101ff04023000301f0603551d2304183016801423f249c44f93e4ef27e6c4f6286c3fa2bbfd2e4b304506082b0601050507010104393037303506082b060105050730018629687474703a2f2f6f6373702e6170706c652e636f6d2f6f63737030342d6170706c65616963613330323082011d0603551d2004820114308201103082010c06092a864886f7636405013081fe3081c306082b060105050702023081b60c81b352656c69616e6365206f6e207468697320636572746966696361746520627920616e7920706172747920617373756d657320616363657074616e6365206f6620746865207468656e206170706c696361626c65207374616e64617264207465726d7320616e6420636f6e646974696f6e73206f66207573652c20636572746966696361746520706f6c69637920616e642063657274696669636174696f6e2070726163746963652073746174656d656e74732e303606082b06010505070201162a687474703a2f2f7777772e6170706c652e636f6d2f6365727469666963617465617574686f726974792f30340603551d1f042d302b3029a027a0258623687474703a2f2f63726c2e6170706c652e636f6d2f6170706c6561696361332e63726c301d0603551d0e041604140224300b9aeeed463197a4a65a299e4271821c45300e0603551d0f0101ff040403020780300f06092a864886f76364061d04020500300a06082a8648ce3d0403020347003044022074a1b324db4249430dd3274c5074c4808d9a1f480e3a85c5c1362566325fbca3022069369053abf50b5a52f9f6004dc58aad6c50a7d608683790e0a73ad01e4ad981308202ee30820275a0030201020208496d2fbf3a98da97300a06082a8648ce3d0403023067311b301906035504030c124170706c6520526f6f74204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b3009060355040613025553301e170d3134303530363233343633305a170d3239303530363233343633305a307a312e302c06035504030c254170706c65204170706c69636174696f6e20496e746567726174696f6e204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b30090603550406130255533059301306072a8648ce3d020106082a8648ce3d03010703420004f017118419d76485d51a5e25810776e880a2efde7bae4de08dfc4b93e13356d5665b35ae22d097760d224e7bba08fd7617ce88cb76bb6670bec8e82984ff5445a381f73081f4304606082b06010505070101043a3038303606082b06010505073001862a687474703a2f2f6f6373702e6170706c652e636f6d2f6f63737030342d6170706c65726f6f7463616733301d0603551d0e0416041423f249c44f93e4ef27e6c4f6286c3fa2bbfd2e4b300f0603551d130101ff040530030101ff301f0603551d23041830168014bbb0dea15833889aa48a99debebdebafdacb24ab30370603551d1f0430302e302ca02aa0288626687474703a2f2f63726c2e6170706c652e636f6d2f6170706c65726f6f74636167332e63726c300e0603551d0f0101ff0404030201063010060a2a864886f7636406020e04020500300a06082a8648ce3d040302036700306402303acf7283511699b186fb35c356ca62bff417edd90f754da28ebef19c815e42b789f898f79b599f98d5410d8f9de9c2fe0230322dd54421b0a305776c5df3383b9067fd177c2c216d964fc6726982126f54f87a7d1b99cb9b0989216106990f09921d00003182018c30820188020101308186307a312e302c06035504030c254170706c65204170706c69636174696f6e20496e746567726174696f6e204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b3009060355040613025553020859d8a1bcaaf4e3cd300d06096086480165030402010500a08195301806092a864886f70d010903310b06092a864886f70d010701301c06092a864886f70d010905310f170d3232303232383039323830375a302a06092a864886f70d010934311d301b300d06096086480165030402010500a10a06082a8648ce3d040302302f06092a864886f70d010904312204206640919e57549701d5de630d600c5ef07f4488eee4f6c75292e3dc910254ffb5300a06082a8648ce3d04030204473045022100d8cfb2f2f14db4849b458ba21d67444fa1a8e2b7aa27de403e0959565385153d02203bee8dbd0389210ec09e512c6bee47b86ad6b7e2b2f7841f53019098754c106b000000000000","operationalAnalyticsIdentifier":"Sunrise:490BF9671420F23BAF41925E4FF7474DFD27854BD78C9DE6C0DEC26EF9567B06","retries":0}',
      isv_token: applePay.isv_token,
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
  anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be',
};

export const guestPayment = {
  id: '274232a7-6d5e-4904-88d2-97e6d2fa8798',
  version: 4,
  lastMessageSequenceNumber: 2,
  createdAt: '2022-01-25T09:48:20.135Z',
  lastModifiedAt: '2022-01-25T09:48:35.927Z',
  lastModifiedBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be',
  },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'applePay',
    name: {
      en: 'Apple Pay',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '87b9d9db-74a3-45d7-8e60-dde669866808',
    },
    fields: {
      isv_deviceFingerprintId: '5f39f56e-fb1f-4c29-80af-5168603ab5ce',
      isv_applePayValidationUrl: 'https://apple-pay-gateway-cert.apple.com/paymentservices/startSession',
      isv_acceptHeader: '*/*',
      isv_applePayDisplayName: 'Sunrise',
      isv_customerIpAddress: '171.76.13.221',
      isv_userAgentHeader: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
      isv_applePaySessionData: '{"epochTimestamp":1646040487087,"expiresAt":1646044087087,"merchantSessionIdentifier":"SSH16DCA47C8288434F8F9F1B6C252F9827_916523AAED1343F5BC5815E12BEE9250AFFDC1A17C46B0DE5A943F0F94927C24","nonce":"21432f7c","merchantIdentifier":"490BF9671420F23BAF41925E4FF7474DFD27854BD78C9DE6C0DEC26EF9567B06","domainName":"www.qa.ct.cybsplugin.com","displayName":"Sunrise","signature":"308006092a864886f70d010702a0803080020101310f300d06096086480165030402010500308006092a864886f70d0107010000a080308203e43082038ba003020102020859d8a1bcaaf4e3cd300a06082a8648ce3d040302307a312e302c06035504030c254170706c65204170706c69636174696f6e20496e746567726174696f6e204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b3009060355040613025553301e170d3231303432303139333730305a170d3236303431393139333635395a30623128302606035504030c1f6563632d736d702d62726f6b65722d7369676e5f5543342d53414e44424f5831143012060355040b0c0b694f532053797374656d7331133011060355040a0c0a4170706c6520496e632e310b30090603550406130255533059301306072a8648ce3d020106082a8648ce3d030107034200048230fdabc39cf75e202c50d99b4512e637e2a901dd6cb3e0b1cd4b526798f8cf4ebde81a25a8c21e4c33ddce8e2a96c2f6afa1930345c4e87a4426ce951b1295a38202113082020d300c0603551d130101ff04023000301f0603551d2304183016801423f249c44f93e4ef27e6c4f6286c3fa2bbfd2e4b304506082b0601050507010104393037303506082b060105050730018629687474703a2f2f6f6373702e6170706c652e636f6d2f6f63737030342d6170706c65616963613330323082011d0603551d2004820114308201103082010c06092a864886f7636405013081fe3081c306082b060105050702023081b60c81b352656c69616e6365206f6e207468697320636572746966696361746520627920616e7920706172747920617373756d657320616363657074616e6365206f6620746865207468656e206170706c696361626c65207374616e64617264207465726d7320616e6420636f6e646974696f6e73206f66207573652c20636572746966696361746520706f6c69637920616e642063657274696669636174696f6e2070726163746963652073746174656d656e74732e303606082b06010505070201162a687474703a2f2f7777772e6170706c652e636f6d2f6365727469666963617465617574686f726974792f30340603551d1f042d302b3029a027a0258623687474703a2f2f63726c2e6170706c652e636f6d2f6170706c6561696361332e63726c301d0603551d0e041604140224300b9aeeed463197a4a65a299e4271821c45300e0603551d0f0101ff040403020780300f06092a864886f76364061d04020500300a06082a8648ce3d0403020347003044022074a1b324db4249430dd3274c5074c4808d9a1f480e3a85c5c1362566325fbca3022069369053abf50b5a52f9f6004dc58aad6c50a7d608683790e0a73ad01e4ad981308202ee30820275a0030201020208496d2fbf3a98da97300a06082a8648ce3d0403023067311b301906035504030c124170706c6520526f6f74204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b3009060355040613025553301e170d3134303530363233343633305a170d3239303530363233343633305a307a312e302c06035504030c254170706c65204170706c69636174696f6e20496e746567726174696f6e204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b30090603550406130255533059301306072a8648ce3d020106082a8648ce3d03010703420004f017118419d76485d51a5e25810776e880a2efde7bae4de08dfc4b93e13356d5665b35ae22d097760d224e7bba08fd7617ce88cb76bb6670bec8e82984ff5445a381f73081f4304606082b06010505070101043a3038303606082b06010505073001862a687474703a2f2f6f6373702e6170706c652e636f6d2f6f63737030342d6170706c65726f6f7463616733301d0603551d0e0416041423f249c44f93e4ef27e6c4f6286c3fa2bbfd2e4b300f0603551d130101ff040530030101ff301f0603551d23041830168014bbb0dea15833889aa48a99debebdebafdacb24ab30370603551d1f0430302e302ca02aa0288626687474703a2f2f63726c2e6170706c652e636f6d2f6170706c65726f6f74636167332e63726c300e0603551d0f0101ff0404030201063010060a2a864886f7636406020e04020500300a06082a8648ce3d040302036700306402303acf7283511699b186fb35c356ca62bff417edd90f754da28ebef19c815e42b789f898f79b599f98d5410d8f9de9c2fe0230322dd54421b0a305776c5df3383b9067fd177c2c216d964fc6726982126f54f87a7d1b99cb9b0989216106990f09921d00003182018c30820188020101308186307a312e302c06035504030c254170706c65204170706c69636174696f6e20496e746567726174696f6e204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b3009060355040613025553020859d8a1bcaaf4e3cd300d06096086480165030402010500a08195301806092a864886f70d010903310b06092a864886f70d010701301c06092a864886f70d010905310f170d3232303232383039323830375a302a06092a864886f70d010934311d301b300d06096086480165030402010500a10a06082a8648ce3d040302302f06092a864886f70d010904312204206640919e57549701d5de630d600c5ef07f4488eee4f6c75292e3dc910254ffb5300a06082a8648ce3d04030204473045022100d8cfb2f2f14db4849b458ba21d67444fa1a8e2b7aa27de403e0959565385153d02203bee8dbd0389210ec09e512c6bee47b86ad6b7e2b2f7841f53019098754c106b000000000000","operationalAnalyticsIdentifier":"Sunrise:490BF9671420F23BAF41925E4FF7474DFD27854BD78C9DE6C0DEC26EF9567B06","retries":0}',
      isv_token: applePay.isv_token,
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
  anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be',
};

export var cart = {
  type: 'Cart',
  id: '3d09ed42-1b1b-450a-b670-269437683939',
  version: 10,
  lastMessageSequenceNumber: 1,
  createdAt: '2022-04-11T09:08:17.675Z',
  lastModifiedAt: '2022-04-11T09:10:51.071Z',
  lastModifiedBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'def6c669-eed5-4c57-ba2e-5fb04bfed1fa',
    },
  },
  createdBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'def6c669-eed5-4c57-ba2e-5fb04bfed1fa',
    },
  },
  customerId: 'def6c669-eed5-4c57-ba2e-5fb04bfed1fa',
  locale: 'en-US',
  lineItems: [
    {
      id: '321ea068-968a-431c-a7a5-98615b74cda3',
      productId: '7e3ccfc6-36ee-4995-ab1d-bb5095b08bbe',
      name: {
        en: 'Sherwani',
      },
      productType: {
        typeId: 'product-type',
        id: '31d56c4e-d578-4dab-a313-780b5f1e7556',
        version: 1,
      },
      productSlug: {
        en: 'a1',
      },
      variant: {
        id: 1,
        sku: 'SKU-1',
        prices: [
          {
            id: '1fbaed84-99cc-4922-9776-c1ea3cd553e6',
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 15845,
              fractionDigits: 2,
            },
            country: 'US',
          },
          {
            id: '68018b50-2c8a-4304-b67a-ae15389be32d',
            value: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 5980,
              fractionDigits: 2,
            },
            country: 'US',
          },
        ],
        images: [
          {
            url: 'https://ik.imagekit.io/ldqsn9vvwgg/images/505833.jpg',
            dimensions: {
              w: 300,
              h: 375,
            },
          },
        ],
        attributes: [],
        assets: [],
      },
      price: {
        id: '68018b50-2c8a-4304-b67a-ae15389be32d',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 5980,
          fractionDigits: 2,
        },
        country: 'US',
      },
      quantity: 1,
      discountedPricePerQuantity: [],
      taxRate: {
        name: 'test-tax-category',
        amount: 0.2,
        includedInPrice: true,
        country: 'US',
        id: 'HxMyojUT',
        subRates: [],
      },
      addedAt: '2022-04-11T09:08:17.982Z',
      lastModifiedAt: '2022-04-11T09:08:17.982Z',
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: '438c0901-36c4-41ec-9a86-2853d6c73d0d',
          },
        },
      ],
      priceMode: 'Platform',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 5980,
        fractionDigits: 2,
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 4983,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 5980,
          fractionDigits: 2,
        },
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 997,
          fractionDigits: 2,
        },
      },
      lineItemMode: 'Standard',
    },
  ],
  cartState: 'Active',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
    fractionDigits: 2,
  },
  taxedPrice: {
    totalNet: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 4983,
      fractionDigits: 2,
    },
    totalGross: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 5980,
      fractionDigits: 2,
    },
    taxPortions: [
      {
        rate: 0.2,
        amount: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 997,
          fractionDigits: 2,
        },
        name: 'test-tax-category',
      },
    ],
    totalTax: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 997,
      fractionDigits: 2,
    },
  },
  country: 'US',
  customLineItems: [],
  discountCodes: [],
  directDiscounts: [],
  inventoryMode: 'None',
  taxMode: 'Platform',
  taxRoundingMode: 'HalfEven',
  taxCalculationMode: 'LineItemLevel',
  deleteDaysAfterLastModification: 90,
  refusedGifts: [],
  origin: 'Customer',
  shippingAddress: {
    firstName: 'shakshi',
    lastName: 'poddar',
    streetName: '1295 Charleston Road',
    postalCode: '94043',
    city: 'Mountain View',
    region: 'CA',
    country: 'US',
    phone: '9876543210',
    email: 'shakshi.poddar@wipro.com',
  },
  billingAddress: {
    firstName: 'shakshi',
    lastName: 'poddar',
    streetName: '1295 Charleston Road',
    postalCode: '94043',
    city: 'Mountain View',
    region: 'CA',
    country: 'US',
    phone: '9876543210',
    email: 'shakshi.poddar@wipro.com',
  },
  itemShippingAddresses: [],
  totalLineItemQuantity: 1,
};

export const service = 'card';

export const cardTokens = {
  customerTokenId: creditCard.savedTokenId,
  paymentInstrumentId: creditCard.savedToken,
};

export const guestCardTokens = null;

export var payments = {
  id: '274232a7-6d5e-4904-88d2-97e6d2fa8798',
  version: 4,
  lastMessageSequenceNumber: 2,
  createdAt: '2022-01-25T09:48:20.135Z',
  lastModifiedAt: '2022-01-25T09:48:35.927Z',
  lastModifiedBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be',
  },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'applePay',
    name: {
      en: 'Apple Pay',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '87b9d9db-74a3-45d7-8e60-dde669866808',
    },
    fields: {
      isv_deviceFingerprintId: '5f39f56e-fb1f-4c29-80af-5168603ab5ce',
      isv_applePayValidationUrl: 'https://apple-pay-gateway-cert.apple.com/paymentservices/startSession',
      isv_acceptHeader: '*/*',
      isv_applePayDisplayName: 'Sunrise',
      isv_customerIpAddress: '171.76.13.221',
      isv_userAgentHeader: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
      isv_applePaySessionData: '{"epochTimestamp":1646040487087,"expiresAt":1646044087087,"merchantSessionIdentifier":"SSH16DCA47C8288434F8F9F1B6C252F9827_916523AAED1343F5BC5815E12BEE9250AFFDC1A17C46B0DE5A943F0F94927C24","nonce":"21432f7c","merchantIdentifier":"490BF9671420F23BAF41925E4FF7474DFD27854BD78C9DE6C0DEC26EF9567B06","domainName":"www.qa.ct.cybsplugin.com","displayName":"Sunrise","signature":"308006092a864886f70d010702a0803080020101310f300d06096086480165030402010500308006092a864886f70d0107010000a080308203e43082038ba003020102020859d8a1bcaaf4e3cd300a06082a8648ce3d040302307a312e302c06035504030c254170706c65204170706c69636174696f6e20496e746567726174696f6e204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b3009060355040613025553301e170d3231303432303139333730305a170d3236303431393139333635395a30623128302606035504030c1f6563632d736d702d62726f6b65722d7369676e5f5543342d53414e44424f5831143012060355040b0c0b694f532053797374656d7331133011060355040a0c0a4170706c6520496e632e310b30090603550406130255533059301306072a8648ce3d020106082a8648ce3d030107034200048230fdabc39cf75e202c50d99b4512e637e2a901dd6cb3e0b1cd4b526798f8cf4ebde81a25a8c21e4c33ddce8e2a96c2f6afa1930345c4e87a4426ce951b1295a38202113082020d300c0603551d130101ff04023000301f0603551d2304183016801423f249c44f93e4ef27e6c4f6286c3fa2bbfd2e4b304506082b0601050507010104393037303506082b060105050730018629687474703a2f2f6f6373702e6170706c652e636f6d2f6f63737030342d6170706c65616963613330323082011d0603551d2004820114308201103082010c06092a864886f7636405013081fe3081c306082b060105050702023081b60c81b352656c69616e6365206f6e207468697320636572746966696361746520627920616e7920706172747920617373756d657320616363657074616e6365206f6620746865207468656e206170706c696361626c65207374616e64617264207465726d7320616e6420636f6e646974696f6e73206f66207573652c20636572746966696361746520706f6c69637920616e642063657274696669636174696f6e2070726163746963652073746174656d656e74732e303606082b06010505070201162a687474703a2f2f7777772e6170706c652e636f6d2f6365727469666963617465617574686f726974792f30340603551d1f042d302b3029a027a0258623687474703a2f2f63726c2e6170706c652e636f6d2f6170706c6561696361332e63726c301d0603551d0e041604140224300b9aeeed463197a4a65a299e4271821c45300e0603551d0f0101ff040403020780300f06092a864886f76364061d04020500300a06082a8648ce3d0403020347003044022074a1b324db4249430dd3274c5074c4808d9a1f480e3a85c5c1362566325fbca3022069369053abf50b5a52f9f6004dc58aad6c50a7d608683790e0a73ad01e4ad981308202ee30820275a0030201020208496d2fbf3a98da97300a06082a8648ce3d0403023067311b301906035504030c124170706c6520526f6f74204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b3009060355040613025553301e170d3134303530363233343633305a170d3239303530363233343633305a307a312e302c06035504030c254170706c65204170706c69636174696f6e20496e746567726174696f6e204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b30090603550406130255533059301306072a8648ce3d020106082a8648ce3d03010703420004f017118419d76485d51a5e25810776e880a2efde7bae4de08dfc4b93e13356d5665b35ae22d097760d224e7bba08fd7617ce88cb76bb6670bec8e82984ff5445a381f73081f4304606082b06010505070101043a3038303606082b06010505073001862a687474703a2f2f6f6373702e6170706c652e636f6d2f6f63737030342d6170706c65726f6f7463616733301d0603551d0e0416041423f249c44f93e4ef27e6c4f6286c3fa2bbfd2e4b300f0603551d130101ff040530030101ff301f0603551d23041830168014bbb0dea15833889aa48a99debebdebafdacb24ab30370603551d1f0430302e302ca02aa0288626687474703a2f2f63726c2e6170706c652e636f6d2f6170706c65726f6f74636167332e63726c300e0603551d0f0101ff0404030201063010060a2a864886f7636406020e04020500300a06082a8648ce3d040302036700306402303acf7283511699b186fb35c356ca62bff417edd90f754da28ebef19c815e42b789f898f79b599f98d5410d8f9de9c2fe0230322dd54421b0a305776c5df3383b9067fd177c2c216d964fc6726982126f54f87a7d1b99cb9b0989216106990f09921d00003182018c30820188020101308186307a312e302c06035504030c254170706c65204170706c69636174696f6e20496e746567726174696f6e204341202d20473331263024060355040b0c1d4170706c652043657274696669636174696f6e20417574686f7269747931133011060355040a0c0a4170706c6520496e632e310b3009060355040613025553020859d8a1bcaaf4e3cd300d06096086480165030402010500a08195301806092a864886f70d010903310b06092a864886f70d010701301c06092a864886f70d010905310f170d3232303232383039323830375a302a06092a864886f70d010934311d301b300d06096086480165030402010500a10a06082a8648ce3d040302302f06092a864886f70d010904312204206640919e57549701d5de630d600c5ef07f4488eee4f6c75292e3dc910254ffb5300a06082a8648ce3d04030204473045022100d8cfb2f2f14db4849b458ba21d67444fa1a8e2b7aa27de403e0959565385153d02203bee8dbd0389210ec09e512c6bee47b86ad6b7e2b2f7841f53019098754c106b000000000000","operationalAnalyticsIdentifier":"Sunrise:490BF9671420F23BAF41925E4FF7474DFD27854BD78C9DE6C0DEC26EF9567B06","retries":0}',
      isv_token: 'eyJkYXRhIjoiTmlPNHZjOGJ1RXljS05xNXRlV2VSRWtaWmFTUWlCazRUNytsK0RLMmVDZ3RkQko5bUNnRmlnL1lJWmVzT0o4b3F0MEJnUUZaOUVtY2ZwYW1YQlkyMjZhWlZhbDlhLzM5Umx3c25CRWdLblZYdFhINENnVktqb1lkckVlaVdKeUJmek8rZUdvNDR1N3JwWVdDK3VTSkd4U0FWY1ppOXZGUHRYU3BIcml1Um9LeGlPNzhVcUdvTlJlbFhraCtxb255dmFOR1RFY3hNUStpS0VzRTJvY25iTG9oTGdrdHBJekxWK0lxZFc1aEt2Z3JGRWtxdFFLZHlsbzEzeWtKNTJkdkZTa3U3SEQxZ0o5VjgzSGxCajRGVGYvZTA5dGpKY2xwUFkwYm5wNmV6NGpOM1lqSzc3UGlhY3U5VTFyalBQaFEyQ1VPdkFYSXZxSGFIMVgvQ1R2MHR1bGFscytnL1pxQ1ozVHA3ZXFQMStSTzFkNzFXVzRybmhTblU3eUN5eTdpODdFdkVvRDBpMXNFVmdheElQYUhIZkQvbWJ0WFY5SVZyWFVSaDU0dk1CUT0iLCJzaWduYXR1cmUiOiJNSUFHQ1NxR1NJYjNEUUVIQXFDQU1JQUNBUUV4RHpBTkJnbGdoa2dCWlFNRUFnRUZBRENBQmdrcWhraUc5dzBCQndFQUFLQ0FNSUlENURDQ0E0dWdBd0lCQWdJSVdkaWh2S3IwNDgwd0NnWUlLb1pJemowRUF3SXdlakV1TUN3R0ExVUVBd3dsUVhCd2JHVWdRWEJ3YkdsallYUnBiMjRnU1c1MFpXZHlZWFJwYjI0Z1EwRWdMU0JITXpFbU1DUUdBMVVFQ3d3ZFFYQndiR1VnUTJWeWRHbG1hV05oZEdsdmJpQkJkWFJvYjNKcGRIa3hFekFSQmdOVkJBb01Da0Z3Y0d4bElFbHVZeTR4Q3pBSkJnTlZCQVlUQWxWVE1CNFhEVEl4TURReU1ERTVNemN3TUZvWERUSTJNRFF4T1RFNU16WTFPVm93WWpFb01DWUdBMVVFQXd3ZlpXTmpMWE50Y0MxaWNtOXJaWEl0YzJsbmJsOVZRelF0VTBGT1JFSlBXREVVTUJJR0ExVUVDd3dMYVU5VElGTjVjM1JsYlhNeEV6QVJCZ05WQkFvTUNrRndjR3hsSUVsdVl5NHhDekFKQmdOVkJBWVRBbFZUTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFZ2pEOXE4T2M5MTRnTEZEWm0wVVM1amZpcVFIZGJMUGdzYzFMVW1lWStNOU92ZWdhSmFqQ0hrd3ozYzZPS3BiQzlxK2hrd05GeE9oNlJDYk9sUnNTbGFPQ0FoRXdnZ0lOTUF3R0ExVWRFd0VCL3dRQ01BQXdId1lEVlIwakJCZ3dGb0FVSS9KSnhFK1Q1TzhuNXNUMktHdy9vcnY5TGtzd1JRWUlLd1lCQlFVSEFRRUVPVEEzTURVR0NDc0dBUVVGQnpBQmhpbG9kSFJ3T2k4dmIyTnpjQzVoY0hCc1pTNWpiMjB2YjJOemNEQTBMV0Z3Y0d4bFlXbGpZVE13TWpDQ0FSMEdBMVVkSUFTQ0FSUXdnZ0VRTUlJQkRBWUpLb1pJaHZkalpBVUJNSUgrTUlIREJnZ3JCZ0VGQlFjQ0FqQ0J0Z3lCczFKbGJHbGhibU5sSUc5dUlIUm9hWE1nWTJWeWRHbG1hV05oZEdVZ1lua2dZVzU1SUhCaGNuUjVJR0Z6YzNWdFpYTWdZV05qWlhCMFlXNWpaU0J2WmlCMGFHVWdkR2hsYmlCaGNIQnNhV05oWW14bElITjBZVzVrWVhKa0lIUmxjbTF6SUdGdVpDQmpiMjVrYVhScGIyNXpJRzltSUhWelpTd2dZMlZ5ZEdsbWFXTmhkR1VnY0c5c2FXTjVJR0Z1WkNCalpYSjBhV1pwWTJGMGFXOXVJSEJ5WVdOMGFXTmxJSE4wWVhSbGJXVnVkSE11TURZR0NDc0dBUVVGQndJQkZpcG9kSFJ3T2k4dmQzZDNMbUZ3Y0d4bExtTnZiUzlqWlhKMGFXWnBZMkYwWldGMWRHaHZjbWwwZVM4d05BWURWUjBmQkMwd0t6QXBvQ2VnSllZamFIUjBjRG92TDJOeWJDNWhjSEJzWlM1amIyMHZZWEJ3YkdWaGFXTmhNeTVqY213d0hRWURWUjBPQkJZRUZBSWtNQXVhN3UxR01aZWtwbG9wbmtKeGdoeEZNQTRHQTFVZER3RUIvd1FFQXdJSGdEQVBCZ2txaGtpRzkyTmtCaDBFQWdVQU1Bb0dDQ3FHU000OUJBTUNBMGNBTUVRQ0lIU2hzeVRiUWtsRERkTW5URkIweElDTm1oOUlEanFGeGNFMkpXWXlYN3lqQWlCcE5wQlRxL1VMV2xMNTlnQk54WXF0YkZDbjFnaG9ONURncHpyUUhrclpnVENDQXU0d2dnSjFvQU1DQVFJQ0NFbHRMNzg2bU5xWE1Bb0dDQ3FHU000OUJBTUNNR2N4R3pBWkJnTlZCQU1NRWtGd2NHeGxJRkp2YjNRZ1EwRWdMU0JITXpFbU1DUUdBMVVFQ3d3ZFFYQndiR1VnUTJWeWRHbG1hV05oZEdsdmJpQkJkWFJvYjNKcGRIa3hFekFSQmdOVkJBb01Da0Z3Y0d4bElFbHVZeTR4Q3pBSkJnTlZCQVlUQWxWVE1CNFhEVEUwTURVd05qSXpORFl6TUZvWERUSTVNRFV3TmpJek5EWXpNRm93ZWpFdU1Dd0dBMVVFQXd3bFFYQndiR1VnUVhCd2JHbGpZWFJwYjI0Z1NXNTBaV2R5WVhScGIyNGdRMEVnTFNCSE16RW1NQ1FHQTFVRUN3d2RRWEJ3YkdVZ1EyVnlkR2xtYVdOaGRHbHZiaUJCZFhSb2IzSnBkSGt4RXpBUkJnTlZCQW9NQ2tGd2NHeGxJRWx1WXk0eEN6QUpCZ05WQkFZVEFsVlRNRmt3RXdZSEtvWkl6ajBDQVFZSUtvWkl6ajBEQVFjRFFnQUU4QmNSaEJuWFpJWFZHbDRsZ1FkMjZJQ2k3OTU3cmszZ2pmeExrK0V6VnRWbVd6V3VJdENYZGcwaVRudTZDUDEyRjg2SXkzYTdabkMreU9ncGhQOVVSYU9COXpDQjlEQkdCZ2dyQmdFRkJRY0JBUVE2TURnd05nWUlLd1lCQlFVSE1BR0dLbWgwZEhBNkx5OXZZM053TG1Gd2NHeGxMbU52YlM5dlkzTndNRFF0WVhCd2JHVnliMjkwWTJGbk16QWRCZ05WSFE0RUZnUVVJL0pKeEUrVDVPOG41c1QyS0d3L29ydjlMa3N3RHdZRFZSMFRBUUgvQkFVd0F3RUIvekFmQmdOVkhTTUVHREFXZ0JTN3NONmhXRE9JbXFTS21kNit2ZXV2MnNza3F6QTNCZ05WSFI4RU1EQXVNQ3lnS3FBb2hpWm9kSFJ3T2k4dlkzSnNMbUZ3Y0d4bExtTnZiUzloY0hCc1pYSnZiM1JqWVdjekxtTnliREFPQmdOVkhROEJBZjhFQkFNQ0FRWXdFQVlLS29aSWh2ZGpaQVlDRGdRQ0JRQXdDZ1lJS29aSXpqMEVBd0lEWndBd1pBSXdPczl5ZzFFV21iR0crelhEVnNwaXYvUVg3ZGtQZFUyaWpyN3huSUZlUXJlSitKajNtMW1mbU5WQkRZK2Q2Y0wrQWpBeUxkVkVJYkNqQlhkc1hmTTRPNUJuL1JkOExDRnRsay9HY21tQ0VtOVUrSHA5RzVuTG13bUpJV0VHbVE4SmtoMEFBREdDQVkwd2dnR0pBZ0VCTUlHR01Ib3hMakFzQmdOVkJBTU1KVUZ3Y0d4bElFRndjR3hwWTJGMGFXOXVJRWx1ZEdWbmNtRjBhVzl1SUVOQklDMGdSek14SmpBa0JnTlZCQXNNSFVGd2NHeGxJRU5sY25ScFptbGpZWFJwYjI0Z1FYVjBhRzl5YVhSNU1STXdFUVlEVlFRS0RBcEJjSEJzWlNCSmJtTXVNUXN3Q1FZRFZRUUdFd0pWVXdJSVdkaWh2S3IwNDgwd0RRWUpZSVpJQVdVREJBSUJCUUNnZ1pVd0dBWUpLb1pJaHZjTkFRa0RNUXNHQ1NxR1NJYjNEUUVIQVRBY0Jna3Foa2lHOXcwQkNRVXhEeGNOTWpJd01USTFNRGswT0RNeldqQXFCZ2txaGtpRzl3MEJDVFF4SFRBYk1BMEdDV0NHU0FGbEF3UUNBUVVBb1FvR0NDcUdTTTQ5QkFNQ01DOEdDU3FHU0liM0RRRUpCREVpQkNEeXczUmJDY250MXBnVEk4ZXlNRkYwRnlMNStyWStvMWtPaTVmZ1c0SzkwakFLQmdncWhrak9QUVFEQWdSSU1FWUNJUUNsZCt1c0NrNk1jSDN1M0pqVi9tQ3R6dUM1dTE2ZU52bXdpQjRRTHVxSnpBSWhBTE9US0VGVFdmdUFMQlZCalVhSDVCTzVuendEZkZGMUZnT3FoRUZ5T2tSbUFBQUFBQUFBIiwiaGVhZGVyIjp7InB1YmxpY0tleUhhc2giOiJ6Y2ZxbjRUU3lPdG9mV1AvVnRiL21icmxPaE10NGh3N2xHTVhNVmxKOWhRPSIsImVwaGVtZXJhbFB1YmxpY0tleSI6Ik1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMERBUWNEUWdBRWVwcEJCdzNYRlRMdC9zU1BxbnIxSm1lOWxpRXVjRHBXNkJtN2FaTGNYcGRHZEtkNkRzc1ZrL0pyQVd1MElZdGxjKzAvaDBUa3g5R3p6UmFDZXdyZ2pRPT0iLCJ0cmFuc2FjdGlvbklkIjoiYTY2ODRhMWFiM2I0OWRkNTM1N2MzNGJlNGQwMTY1ZDc0ZjdjODQ4Yzg4NGZiMjkxYTZjYzFiNmZmODVjZmNlZCJ9LCJ2ZXJzaW9uIjoiRUNfdjEif',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
  anonymousId: '033cd1c3-801d-4d2b-9729-fef0064dd3be',
};

export const dontSaveTokenFlag = false;

export const payerAuthMandateFlag = false;

export const orderNo = null;

export const orderNumber = '10';

export const shippingCart = {
  type: 'Cart',
  id: '26e44ca8-794f-4bc5-84db-4b476eb4fed1',
  version: 16,
  versionModifiedAt: '2023-04-21T07:15:39.775Z',
  lastMessageSequenceNumber: 1,
  createdAt: '2023-04-21T07:13:31.827Z',
  lastModifiedAt: '2023-04-21T07:15:39.775Z',
  lastModifiedBy: {
    clientId: 'C0f71msxpiTpAB0OiOaItOs8',
    isPlatformClient: false,
    anonymousId: '475f215e-9a1e-49f1-8756-8fadac9a5623',
  },
  createdBy: {
    clientId: 'C0f71msxpiTpAB0OiOaItOs8',
    isPlatformClient: false,
    anonymousId: '475f215e-9a1e-49f1-8756-8fadac9a5623',
  },
  anonymousId: '475f215e-9a1e-49f1-8756-8fadac9a5623',
  locale: 'en-US',
  lineItems: [
    {
      id: '77197bf1-a747-499b-88e4-df16ff235f9f',
      productId: 'c28cfa09-801e-4309-8e2e-edf39f85ddf2',
      "name": {
        "en": "sandalen “Aubrey” Michael Kors brown",
        "de": "sandalen “Aubrey” Michael Kors brown",
        "en-US": "sandalen “Aubrey” Michael Kors brown",
        "de-DE": "sandalen “Aubrey” Michael Kors brown"
      },
      productType: {
        typeId: 'product-type',
        id: '404a5e8f-70a7-41a3-9b39-0b02b1b90b83',
        version: 1,
      },
      productSlug: {
        'en': 'a5',
        'de': 'a5',
        'en-US': 'a5',
        'de-DE': 'a5',
      },
      variant: {
        id: 1,
        sku: 'sku-5',
        prices: [
          {
            id: '4306d10f-8582-44f5-9cce-201be3066555',
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 8000,
              fractionDigits: 2,
            },
            country: 'DE',
          },
          {
            id: '99663748-061c-46f1-b6ad-13cd7872b817',
            value: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 8000,
              fractionDigits: 2,
            },
            country: 'US',
          },
        ],
        images: [
          {
            url: 'https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/082405_1_medium.jpg',
            dimensions: {
              w: 300,
              h: 375,
            },
          },
        ],
        attributes: [],
        assets: [],
      },
      price: {
        id: '99663748-061c-46f1-b6ad-13cd7872b817',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 8000,
          fractionDigits: 2,
        },
        country: 'US',
      },
      quantity: 1,
      discountedPricePerQuantity: [],
      perMethodTaxRate: [],
      addedAt: '2023-04-21T07:13:32.176Z',
      lastModifiedAt: '2023-04-21T07:13:32.176Z',
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: '8e52f9e7-5650-4d0f-a4bf-7d6ba7c2f98f',
          },
        },
      ],
      priceMode: 'Platform',
      lineItemMode: 'Standard',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 8000,
        fractionDigits: 2,
      },
      taxedPricePortions: [],
    },
  ],
  cartState: 'Active',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 10180,
    fractionDigits: 2,
  },
  country: 'US',
  shippingMode: 'Multiple',
  shipping: [
    {
      shippingKey: 'shippingKey123',
      shippingInfo: {
        shippingMethodName: 'UHL',
        price: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 990,
          fractionDigits: 2,
        },
        shippingRate: {
          price: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 990,
            fractionDigits: 2,
          },
          tiers: [],
        },
        taxRate: {
          name: 'test-taxes-category',
          amount: 0.2,
          includedInPrice: true,
          country: 'US',
          id: 'yo5l4O7M',
          subRates: [],
        },
        taxCategory: {
          typeId: 'tax-category',
          id: '9ed4dda8-d050-4f6b-90a8-34901c33b6f8',
        },
        deliveries: [],
        shippingMethod: {
          typeId: 'shipping-method',
          id: '793cc3e5-20fa-4931-a22d-0bb7c9db8be3',
        },
        taxedPrice: {
          totalNet: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 825,
            fractionDigits: 2,
          },
          totalGross: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 990,
            fractionDigits: 2,
          },
          totalTax: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 165,
            fractionDigits: 2,
          },
        },
        shippingMethodState: 'MatchesCart',
      },
      shippingAddress: {
        streetName: 'ABC Street',
        streetNumber: '1234',
        postalCode: '94043',
        city: 'Mountain Views',
        region: 'CA',
        country: 'US',
        key: 'addressKeyOne',
      },
    },
    {
      shippingKey: 'myUniqueKey23455',
      shippingInfo: {
        shippingMethodName: 'DHL',
        price: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1190,
          fractionDigits: 2,
        },
        shippingRate: {
          price: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 1190,
            fractionDigits: 2,
          },
          tiers: [],
        },
        taxRate: {
          name: 'test-taxes-category',
          amount: 0.2,
          includedInPrice: true,
          country: 'US',
          id: 'yo5l4O7M',
          subRates: [],
        },
        taxCategory: {
          typeId: 'tax-category',
          id: '9ed4dda8-d050-4f6b-90a8-34901c33b6f8',
        },
        deliveries: [],
        shippingMethod: {
          typeId: 'shipping-method',
          id: 'c80f6822-8b9d-476e-b4ac-3125fa789af2',
        },
        taxedPrice: {
          totalNet: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 992,
            fractionDigits: 2,
          },
          totalGross: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 1190,
            fractionDigits: 2,
          },
          totalTax: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 198,
            fractionDigits: 2,
          },
        },
        shippingMethodState: 'MatchesCart',
      },
      shippingAddress: {
        streetName: 'PRB Nagar',
        streetNumber: '1234',
        postalCode: '94043',
        city: 'Mountain Views',
        region: 'CA',
        country: 'US',
        key: 'addressKeyTwo',
      },
    },
  ],
  customLineItems: [],
  discountCodes: [],
  directDiscounts: [],
  paymentInfo: {
    payments: [
      {
        typeId: 'payment',
        id: '8bac631c-8d54-4c80-95fb-aac3f7b294cf',
      },
    ],
  },
  inventoryMode: 'None',
  taxMode: 'Platform',
  taxRoundingMode: 'HalfEven',
  taxCalculationMode: 'LineItemLevel',
  deleteDaysAfterLastModification: 90,
  refusedGifts: [],
  origin: 'Customer',
  billingAddress: {
    firstName: 'Shakshi',
    lastName: 'Poddar',
    streetName: '1295 Charleston Road',
    postalCode: '94043',
    city: 'Mountain View',
    region: 'CA',
    country: 'US',
    phone: '9876543210',
    email: 'shakshi.poddar@wipro.com',
  },
  itemShippingAddresses: [],
  totalLineItemQuantity: 1,
};
