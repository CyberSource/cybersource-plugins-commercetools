import creditCard from '../../JSON/creditCard.json';
import eCheck from '../../JSON/eCheck.json';
export let payment = {
  id: 'f3215a29-1f08-4775-9006-22b84b55bae5',
  version: 2,
  lastMessageSequenceNumber: 2,
  createdAt: '2022-06-09T07:51:42.330Z',
  lastModifiedAt: '2022-06-09T07:51:42.330Z',
  lastModifiedBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: '42c377ec-14f5-4509-8e7f-75738970c8c8',
    },
  },
  createdBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: '42c377ec-14f5-4509-8e7f-75738970c8c8',
    },
  },
  customer: {
    typeId: 'customer',
    id: '42c377ec-14f5-4509-8e7f-75738970c8c8',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 1490,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'eCheck',
    name: {
      en: 'eCheck',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '87b9d9db-74a3-45d7-8e60-dde669866808',
    },
    fields: {
      isv_deviceFingerprintId: '992569fb-9d45-4e13-87d5-5d0696db459e',
      isv_accountNumber: eCheck.accountNumber,
      isv_acceptHeader: '*/*',
      isv_accountType: 'C',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
      isv_customerIpAddress: '223.178.233.243',
      isv_routingNumber: eCheck.routingNumber,
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};

export let paymentGuest = {
  id: 'b793821e-c364-4166-b47f-da3f181664ed',
  version: 2,
  lastMessageSequenceNumber: 2,
  createdAt: '2022-06-09T08:56:19.561Z',
  lastModifiedAt: '2022-06-09T08:56:19.561Z',
  lastModifiedBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    anonymousId: '137e1f96-4328-4fda-85f5-b039bb640fec',
  },
  createdBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    anonymousId: '137e1f96-4328-4fda-85f5-b039bb640fec',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 2490,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'eCheck',
    name: {
      en: 'eCheck',
    },
  },
  custom: {
    type: {
      typeId: 'type',
      id: '87b9d9db-74a3-45d7-8e60-dde669866808',
    },
    fields: {
      isv_deviceFingerprintId: '8a031d45-3893-4ba3-9b8f-7f406c3e085f',
      isv_accountNumber: eCheck.accountNumber,
      isv_acceptHeader: '*/*',
      isv_accountType: 'C',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
      isv_customerIpAddress: '223.178.233.243',
      isv_routingNumber: eCheck.routingNumber,
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
  anonymousId: '137e1f96-4328-4fda-85f5-b039bb640fec',
};

export let cart = {
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
export const cardTokens = {
  customerTokenId: creditCard.savedToken,
  paymentInstrumentId: '',
};

export const service = 'card';

export const notSaveToken = false;

export const payerAuthMandateFlag = false;

export const orderNo = '';

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
      name: {
        en: 'sandalen Aubrey Michael Kors brown',
        de: 'sandalen Aubrey Michael Kors brown',
        'en-US': 'sandalen Aubrey Michael Kors brown',
        'de-DE': 'sandalen Aubrey Michael Kors brown',
      },
      productType: {
        typeId: 'product-type',
        id: '404a5e8f-70a7-41a3-9b39-0b02b1b90b83',
        version: 1,
      },
      productSlug: {
        en: 'a5',
        de: 'a5',
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
