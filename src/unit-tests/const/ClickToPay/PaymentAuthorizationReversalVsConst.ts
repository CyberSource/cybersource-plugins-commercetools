import clickToPay from '../../JSON/clickToPay.json';
export const payment = {
  id: 'efee6eb7-2400-4731-89ad-9ef1e5361ea4',
  version: 9,
  lastMessageSequenceNumber: 4,
  createdAt: '2021-11-10T11:28:43.582Z',
  lastModifiedAt: '2021-11-10T11:28:53.502Z',
  lastModifiedBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc',
  },
  createdBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: clickToPay.centAmount,
    fractionDigits: 2,
  },
  paymentMethodInfo: { paymentInterface: 'cybersource', method: 'clickToPay' },
  custom: {
    type: { typeId: 'type', id: '28701886-4e26-4cab-924e-9b0da3829f88' },
    fields: {
      isv_deviceFingerprintId: '8a22fb00-dc63-496b-b0de-9f1d1fd36a50',
      isv_cardExpiryYear: '25  ',
      isv_token: clickToPay.isv_token,
      isv_customerIpAddress: '106.202.150.94',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '05',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      isv_cardType: '001',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '1b3c1147-7ceb-43ec-96cf-af12f2b7e828',
      type: 'Authorization',
      amount: [Object],
      interactionId: clickToPay.authReversalId,
      state: 'Success',
    },
  ],
  interfaceInteractions: [],
};

export const payments = {
  id: 'efee6eb7-2400-4731-89ad-9ef1e5361ea4',
  version: 9,
  lastMessageSequenceNumber: 4,
  createdAt: '2021-11-10T11:28:43.582Z',
  lastModifiedAt: '2021-11-10T11:28:53.502Z',
  lastModifiedBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc',
  },
  createdBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: clickToPay.centAmountValue,
    fractionDigits: 2,
  },
  paymentMethodInfo: { paymentInterface: 'cybersource', method: 'clickToPay' },
  custom: {
    type: { typeId: 'type', id: '28701886-4e26-4cab-924e-9b0da3829f88' },
    fields: {
      isv_deviceFingerprintId: '8a22fb00-dc63-496b-b0de-9f1d1fd36a50',
      isv_cardExpiryYear: '25  ',
      isv_token: clickToPay.isv_token,
      isv_customerIpAddress: '106.202.150.94',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '05',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      isv_cardType: '001',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '1b3c1147-7ceb-43ec-96cf-af12f2b7e828',
      type: 'Authorization',
      amount: [Object],
      interactionId: clickToPay.authReversalId,
      state: 'Success',
    },
  ],
  interfaceInteractions: [],
  anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc',
};

export const cart = {
  type: 'Cart',
  id: '96b7346c-8790-4b91-bf9e-471fa1d468fa',
  version: 16,
  lastMessageSequenceNumber: 1,
  createdAt: '2021-11-10T11:25:20.039Z',
  lastModifiedAt: '2021-11-10T11:28:54.487Z',
  lastModifiedBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc',
  },
  createdBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc',
  },
  anonymousId: '9f9da50d-abc8-416b-a31d-ea319abf31fc',
  lineItems: [
    {
      id: 'f2cf2106-78cc-49db-8e8d-999093c0cbd4',
      productId: '2add8864-32c9-489b-9548-e3d68eb2ab2a',
      name: {
        en: 'Red Hat',
      },
      productType: {
        typeId: 'product-type',
        id: '75930739-3f43-4c60-a5c9-0f3759259a5b',
        version: 1,
      },
      productSlug: {
        en: 'W1',
      },
      variant: {
        id: 1,
        sku: 'SKU-W1',
        prices: [
          {
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 6970,
              fractionDigits: 2,
            },
            id: '9c117381-db1c-404e-b6d9-5043b511cdba',
            country: 'DE',
          },
          {
            value: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 6970,
              fractionDigits: 2,
            },
            id: '3885ca18-9ab5-4f85-98bf-df83db18ea61',
            country: 'US',
          },
        ],
        images: [
          {
            url: 'https://9201c2297b43c7bc2776-8cadb5e9564431db770c575c7afdaf66.ssl.cf1.rackcdn.com/red_hat-hIuVXCjq.jpg',
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
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 6970,
          fractionDigits: 2,
        },
        id: '3885ca18-9ab5-4f85-98bf-df83db18ea61',
        country: 'US',
      },
      quantity: 1,
      discountedPricePerQuantity: [],
      taxRate: {
        name: 'test-tax-category',
        amount: 0.2,
        includedInPrice: true,
        country: 'US',
        id: 'aelaXUTz',
        subRates: [],
      },
      addedAt: '2021-10-11T05:15:55.391Z',
      lastModifiedAt: '2021-10-11T05:15:55.391Z',
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: '772b6f85-d6e6-463b-b881-c74930b01a72',
          },
        },
      ],
      priceMode: 'Platform',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 6970,
        fractionDigits: 2,
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 6970,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 6970,
          fractionDigits: 2,
        },
      },
      lineItemMode: 'Standard',
    },
  ],
  cartState: 'Ordered',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 6970,
    fractionDigits: 2,
  },
  taxedPrice: {
    totalNet: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 5808,
      fractionDigits: 2,
    },
    totalGross: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 6970,
      fractionDigits: 2,
    },
    taxPortions: [[Object]],
  },
  country: 'US',
  shippingInfo: {
    shippingMethodName: 'DHL',
    price: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 990,
      fractionDigits: 2,
    },
    shippingRate: { price: [Object], tiers: [] },
    taxRate: {
      name: 'test-tax-category',
      amount: 0.2,
      includedInPrice: true,
      country: 'US',
      id: 'aelaXUTz',
      subRates: [],
    },
    taxCategory: {
      typeId: 'tax-category',
      id: '6c643b8d-d95f-47b7-8cae-4f31493e9a79',
    },
    deliveries: [],
    shippingMethod: {
      typeId: 'shipping-method',
      id: 'd9ff8d60-20d3-46f7-b9d5-8f707833f4cf',
    },
    taxedPrice: { totalNet: [Object], totalGross: [Object] },
    shippingMethodState: 'MatchesCart',
  },
  customLineItems: [],
  discountCodes: [],
  paymentInfo: { payments: [[Object]] },
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
    additionalStreetInfo: '5th lane',
    postalCode: '94043',
    city: 'Mountain View',
    region: 'CA',
    country: 'US',
    phone: '08808906634',
    email: 'shakshi.poddar@wipro.com',
  },
  billingAddress: {
    firstName: 'SHAKSHI',
    lastName: 'PODDAR',
    streetName: '1295 Charleston Road',
    streetNumber: '5th lane',
    postalCode: '94043',
    city: 'Mountain View',
    region: 'CA',
    country: 'US',
    phone: '08808906634',
    email: 'shakshi.poddar@wipro.com',
  },
  itemShippingAddresses: [],
};

export const authReversalId = clickToPay.authReversalId;

export const authReversalID = '639721595636641210';
