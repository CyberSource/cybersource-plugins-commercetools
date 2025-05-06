const unitPrice = 20;

const isShipping = false;

const isCustomLineItem = false;

const isTotalPriceDiscount = false;

const lineItemTotalAmount = 40.05;

const discountedCart = {
  type: 'Cart',
  id: '740bfc91-4214-46c4-abac-e3f272f7fbb3',
  version: 14,
  versionModifiedAt: '2024-08-08T13:15:33.234Z',
  lastMessageSequenceNumber: 1,
  createdAt: '2024-08-08T13:15:25.649Z',
  lastModifiedAt: '2024-08-08T13:15:33.234Z',
  lastModifiedBy: {
    clientId: 'BsI4_V0dn_H5HQB3js8xawFv',
    isPlatformClient: false,
    anonymousId: 'f48b84c5-138f-4cfa-9d81-a46875d55211',
  },
  createdBy: {
    clientId: 'BsI4_V0dn_H5HQB3js8xawFv',
    isPlatformClient: false,
    anonymousId: 'f48b84c5-138f-4cfa-9d81-a46875d55211',
  },
  anonymousId: 'f48b84c5-138f-4cfa-9d81-a46875d55211',
  locale: 'en',
  lineItems: [
    {
      id: '9f7adf8a-592d-4376-9b89-a10be1bd7c42',
      productId: 'cea7f284-497d-4434-a33d-66e65f7223e0',
      name: {
        'de-DE': 'Sony Earbuds(DE-DE)',
        ja: 'Sony Earbuds(JA)',
        fr: 'Sony Earbuds(FR)',
        'en-GB': 'Sony Earbuds(EN-GB)',
        en: 'Sony Earbuds',
        de: 'Sony Earbuds(DE)',
        'en-US': 'Sony Earbuds',
        ar: 'Sony Earbuds(AR)',
        es: 'Sony Earbuds(ES)',
        hi: 'Sony Earbuds(HI)',
      },
      productType: {
        typeId: 'product-type',
        id: '4c8dd9fe-026e-40f7-aa43-90f3280db45f',
        version: 1,
      },
      productSlug: {
        'de-DE': 'SKU-W5',
        ja: 'SKU-W5',
        fr: 'SKU-W5',
        'en-GB': 'SKU-W5',
        en: 'SKU-W5',
        'en-US': 'SKU-W5',
        ar: 'SKU-W5',
        es: 'SKU-W5',
        hi: 'SKU-W5',
      },
      variant: {
        id: 1,
        sku: 'SKU-W5',
        prices: [
          {
            id: 'ac8249de-5676-4b68-bbb0-1bdea2bf60f5',
            value: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 60080,
              fractionDigits: 2,
            },
            country: 'US',
          },
          {
            id: 'bc4e13ea-13ee-4ad1-9933-e697fa03b5e8',
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 40000,
              fractionDigits: 2,
            },
            country: 'DE',
          },
          {
            id: '0de9cf60-d24b-46e1-8098-244c4dd6a9f4',
            value: {
              type: 'centPrecision',
              currencyCode: 'IQD',
              centAmount: 700000,
              fractionDigits: 3,
            },
          },
          {
            id: 'd43efc33-2b72-48ff-8431-b91d234d15e4',
            value: {
              type: 'centPrecision',
              currencyCode: 'CLP',
              centAmount: 550,
              fractionDigits: 0,
            },
          },
          {
            id: '902d5a67-b353-4c61-96ee-cdc5e3ad3a65',
            value: {
              type: 'centPrecision',
              currencyCode: 'JPY',
              centAmount: 600,
              fractionDigits: 0,
            },
          },
          {
            id: 'e10b8554-6a3d-4168-ae7b-c4f3e4e137aa',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 283210,
              fractionDigits: 2,
            },
          },
        ],
        images: [
          {
            url: 'https://static2.nordic.pictures/33089719-thickbox_default/sony-wireless-earbuds-wf-c500d-pink.jpg',
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
        id: 'ac8249de-5676-4b68-bbb0-1bdea2bf60f5',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 60080,
          fractionDigits: 2,
        },
        country: 'US',
      },
      quantity: 1,
      discountedPrice: {
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 60080,
          fractionDigits: 2,
        },
        includedDiscounts: [
          {
            discount: {
              typeId: 'cart-discount',
              id: '9280bdb9-5cbc-4fce-a2fb-b6fd3143d0df',
            },
            discountedAmount: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 0,
              fractionDigits: 2,
            },
          },
        ],
      },
      discountedPricePerQuantity: [
        {
          quantity: 1,
          discountedPrice: {
            value: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 60080,
              fractionDigits: 2,
            },
            includedDiscounts: [
              {
                discount: {
                  typeId: 'cart-discount',
                  id: '9280bdb9-5cbc-4fce-a2fb-b6fd3143d0df',
                },
                discountedAmount: {
                  type: 'centPrecision',
                  currencyCode: 'USD',
                  centAmount: 0,
                  fractionDigits: 2,
                },
              },
            ],
          },
        },
      ],
      taxRate: {
        name: 'test-tax-category',
        amount: 0.2,
        includedInPrice: true,
        country: 'US',
        id: 'HZIq01bI',
        subRates: [],
      },
      perMethodTaxRate: [],
      addedAt: '2024-08-08T13:15:25.983Z',
      lastModifiedAt: '2024-08-08T13:15:25.983Z',
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: 'd5097392-dd2d-45b4-a550-f7ea49700a3a',
          },
        },
      ],
      priceMode: 'Platform',
      lineItemMode: 'Standard',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 60080,
        fractionDigits: 2,
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 50067,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 60080,
          fractionDigits: 2,
        },
        taxPortions: [
          {
            rate: 0.2,
            amount: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 10013,
              fractionDigits: 2,
            },
            name: 'test-tax-category',
          },
        ],
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 10013,
          fractionDigits: 2,
        },
      },
      taxedPricePortions: [],
    },
    {
      id: 'a42766c8-2a3d-4ef3-b579-8ad691fb144d',
      productId: 'f235846d-40b7-4005-9292-aa0f2cc1eb39',
      name: {
        'de-DE': 'Airpods(DE-DE)',
        ja: 'Airpods(JA)',
        fr: 'Airpods(FR)',
        'en-GB': 'Airpods(EN-GB)',
        en: 'Airpods(EN)',
        de: 'Airpods(DE)',
        'en-US': 'Airpods(EN-US)',
        ar: 'Airpods(AR)',
        es: 'Airpods(ES)',
        hi: 'Airpods(HI)',
      },
      productType: {
        typeId: 'product-type',
        id: '4c8dd9fe-026e-40f7-aa43-90f3280db45f',
        version: 1,
      },
      productSlug: {
        'de-DE': 'SKU-W2',
        ja: 'SKU-W2',
        fr: 'SKU-W2',
        'en-GB': 'SKU-W2',
        en: 'SKU-W2',
        'en-US': 'SKU-W2',
        ar: 'SKU-W2',
        es: 'SKU-W2',
        hi: 'SKU-W2',
      },
      variant: {
        id: 1,
        sku: 'SKU-W2',
        prices: [
          {
            id: 'a78cb404-16a6-4042-8c70-501b1faae21e',
            value: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 5080,
              fractionDigits: 2,
            },
            country: 'US',
          },
          {
            id: 'd4d84feb-5404-4c7d-b39d-f06e0edf1dc4',
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 3000,
              fractionDigits: 2,
            },
            country: 'DE',
          },
          {
            id: '6dd63a7f-ef34-4cf6-b62a-7c904dad24ec',
            value: {
              type: 'centPrecision',
              currencyCode: 'IQD',
              centAmount: 40600,
              fractionDigits: 3,
            },
          },
          {
            id: '6079531f-e1f3-4138-85d2-4daec3807943',
            value: {
              type: 'highPrecision',
              currencyCode: 'CLP',
              centAmount: 46,
              preciseAmount: 4567,
              fractionDigits: 2,
            },
          },
          {
            id: '804a147f-f10d-4453-a51f-22886a1a6d1d',
            value: {
              type: 'highPrecision',
              currencyCode: 'JPY',
              centAmount: 35,
              preciseAmount: 3478,
              fractionDigits: 2,
            },
          },
          {
            id: 'f9001cc3-6e94-4776-a6f1-748bc59c6ce8',
            value: {
              type: 'centPrecision',
              currencyCode: 'GBP',
              centAmount: 147510,
              fractionDigits: 2,
            },
          },
        ],
        images: [
          {
            url: 'https://m.media-amazon.com/images/I/71zny7BTRlL._AC_UF1000,1000_QL80_.jpg',
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
        id: 'a78cb404-16a6-4042-8c70-501b1faae21e',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 5080,
          fractionDigits: 2,
        },
        country: 'US',
      },
      quantity: 1,
      discountedPrice: {
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 2540,
          fractionDigits: 2,
        },
        includedDiscounts: [
          {
            discount: {
              typeId: 'cart-discount',
              id: '9280bdb9-5cbc-4fce-a2fb-b6fd3143d0df',
            },
            discountedAmount: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 2540,
              fractionDigits: 2,
            },
          },
        ],
      },
      discountedPricePerQuantity: [
        {
          quantity: 1,
          discountedPrice: {
            value: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 2540,
              fractionDigits: 2,
            },
            includedDiscounts: [
              {
                discount: {
                  typeId: 'cart-discount',
                  id: '9280bdb9-5cbc-4fce-a2fb-b6fd3143d0df',
                },
                discountedAmount: {
                  type: 'centPrecision',
                  currencyCode: 'USD',
                  centAmount: 2540,
                  fractionDigits: 2,
                },
              },
            ],
          },
        },
      ],
      taxRate: {
        name: 'test-tax-category',
        amount: 0.2,
        includedInPrice: true,
        country: 'US',
        id: 'HZIq01bI',
        subRates: [],
      },
      perMethodTaxRate: [],
      addedAt: '2024-08-08T13:15:30.028Z',
      lastModifiedAt: '2024-08-08T13:15:30.028Z',
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: 'd5097392-dd2d-45b4-a550-f7ea49700a3a',
          },
        },
      ],
      priceMode: 'Platform',
      lineItemMode: 'Standard',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 2540,
        fractionDigits: 2,
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 2117,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 2540,
          fractionDigits: 2,
        },
        taxPortions: [
          {
            rate: 0.2,
            amount: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 423,
              fractionDigits: 2,
            },
            name: 'test-tax-category',
          },
        ],
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 423,
          fractionDigits: 2,
        },
      },
      taxedPricePortions: [],
    },
  ],
  cartState: 'Active',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 63610,
    fractionDigits: 2,
  },
  taxedPrice: {
    totalNet: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 53009,
      fractionDigits: 2,
    },
    totalGross: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 63610,
      fractionDigits: 2,
    },
    taxPortions: [
      {
        rate: 0.2,
        amount: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 10601,
          fractionDigits: 2,
        },
        name: 'test-tax-category',
      },
    ],
    totalTax: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 10601,
      fractionDigits: 2,
    },
  },
  country: 'US',
  taxedShippingPrice: {
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
    taxPortions: [
      {
        rate: 0.2,
        amount: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 165,
          fractionDigits: 2,
        },
        name: 'test-tax-category',
      },
    ],
    totalTax: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 165,
      fractionDigits: 2,
    },
  },
  shippingMode: 'Single',
  shippingInfo: {
    shippingMethodName: 'Standard Delivery',
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
      name: 'test-tax-category',
      amount: 0.2,
      includedInPrice: true,
      country: 'US',
      id: 'HZIq01bI',
      subRates: [],
    },
    taxCategory: {
      typeId: 'tax-category',
      id: 'c04efa03-8e49-4511-8572-315f40a7cbb2',
    },
    deliveries: [],
    shippingMethod: {
      typeId: 'shipping-method',
      id: '8ede0c25-0082-4147-8c25-106c38110a14',
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
      taxPortions: [
        {
          rate: 0.2,
          amount: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 165,
            fractionDigits: 2,
          },
          name: 'test-tax-category',
        },
      ],
      totalTax: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 165,
        fractionDigits: 2,
      },
    },
    shippingMethodState: 'MatchesCart',
  },
  shipping: [],
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
    firstName: 'vignesh',
    lastName: 'S',
    streetName: '1295 Charleston Road',
    postalCode: '94043',
    city: 'Mountain View',
    region: 'CA',
    country: 'US',
    phone: '9876543210',
    email: 'vignesh@wipro.com',
  },
  billingAddress: {
    firstName: 'vignesh',
    lastName: 'S',
    streetName: '1295 Charleston Road',
    postalCode: '94043',
    city: 'Mountain View',
    region: 'CA',
    country: 'US',
    phone: '9876543210',
    email: 'vignesh@wipro.com',
  },
  itemShippingAddresses: [],
  totalLineItemQuantity: 2,
};

export default {
  unitPrice,
  isShipping,
  isCustomLineItem,
  isTotalPriceDiscount,
  lineItemTotalAmount,
  discountedCart,
};
