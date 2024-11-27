 const captureContext =
  'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiIvbU1QV3JGNlZvQUt6azZmOTdIamVoQUFFSldaTjl2NTJ6ZitYV1c0V0V4WWZrVEpSRXRxVW1rUHYxTXlXS0Z2NXNXdlJtbWNXVHdubW5DNHhmZ1A1WUxZRW12KytMd1dMWVdpbmJKc3pVa3E3cFZsTnNsUHVRYnIyUmxoN1V2RUJ5YmwiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiItTWRnYVk0UmxnaVRLUXRfT3NmWWhXN1puS2p3Zk9EQjVRVGVmMndrSzlkMTdMNFVKOUpuY3lud0g2R3poNTZpWTRCcmJwLU9ZblAwYThZX2IwcXRSb1BESU4yalMxXzVRQ3hHUk5GMndDc0hjVEtseVZycXR1MERIaDhEcUt1NFl0NUJSNjVCekVfNEhoY0FCNGNaQzRTNkZMb2ZwZ1lQbFN1aW5QYmZuMm9pWUtOakdvQ2R1anktQU5lRTA2N3NNSDhkSERkXy0wUFg1X1NKZ09wbGF6eHVXUURqM2hZT2dNZzV0eW1tZ1lIWVhXUGZ5NG5ial93YllINDkybklsT1pGWVBQSkVwYTRDdDVhU0RKQ21CbnFBaDQ5ZC1aZGVlT0VhRGh4dXVhNXRjNG9oV1FhZGFxWFFITks2d2ZzcWFGa2tTWV8yZlktdU4wVmxrR010c3ciLCJraWQiOiIwOHZlalBGSHVZNnpwMHZrVW1XN25HSm91NklveWNMWiJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiLCJNQUVTVFJPIiwiQ0FSVEVTQkFOQ0FJUkVTIiwiQ1VQIiwiSkNCIiwiRElORVJTQ0xVQiIsIkRJU0NPVkVSIl0sInRhcmdldE9yaWdpbnMiOlsiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MiJdLCJtZk9yaWdpbiI6Imh0dHBzOi8vdGVzdGZsZXguY3liZXJzb3VyY2UuY29tIn0sInR5cGUiOiJtZi0yLjAuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2OTU3MTMzNjksImlhdCI6MTY5NTcxMjQ2OSwianRpIjoieUZyd2YxWXFvbUpzVmVsRiJ9.bsP7hd4Vx8Vc_Xlg-OI3EI_2lJaw6uw1AKFoRNU0pV4dMKlIPWLj9Yj7yPe2NjEHSDX0EgqznlA0r4Z2R2I4oKySunK7HUeIKQNtrAdGl8DWv1lOsRytLCp9mspKuKA6SCrG4NlK0UkxaCos77JCzs8mQDW3hAB3X1c-jI2LW7X5p7Pah9S5A3Kzd4wciDNT7k3AbsIhTi5otYYBvYqfQsuijGXzPCg5toPF9hX64Oif2ME0GRl8cfT8NzRv4hgn9XzN3pCyQJ767n5PGkdWP-rUeLDnJotWM-XZ3cf1dfUeA-951Rf-VxJaXMin3-qlLAEuoet_XirMJiY1OjpNDw';

 const paymentObj = {
  id: '23d03db7-fa36-4da5-bb3b-de4c59fb5302',

  version: 1,

  lastMessageSequenceNumber: 1,

  createdAt: '1970-01-01T00:00:00.000Z',

  lastModifiedAt: '1970-01-01T00:00:00.000Z',

  lastModifiedBy: {
    clientId: 'JCxOSxUcayN987nomiFwlOpR',

    isPlatformClient: false,

    anonymousId: 'f38b2bbc-34d3-43df-a7ee-11ae6ba64dd5',
  },

  createdBy: {
    clientId: 'JCxOSxUcayN987nomiFwlOpR',

    isPlatformClient: false,

    anonymousId: 'f38b2bbc-34d3-43df-a7ee-11ae6ba64dd5',
  },

  amountPlanned: {
    type: 'centPrecision',

    currencyCode: 'USD',

    centAmount: 102600,

    fractionDigits: 2,
  },

  paymentMethodInfo: {
    paymentInterface: 'cybersource',

    method: 'creditCardWithPayerAuthentication',

    name: {
      en: 'Credit Card Payer Authentication',
    },
  },

  custom: {
    type: {
      typeId: 'type',

      id: '1a27d965-23ea-4665-a515-c1ac23a35fac',
    },

    fields: {
      isv_merchantId: '',
    },
  },

  paymentStatus: {},

  transactions: [],

  interfaceInteractions: [],

  anonymousId: 'f38b2bbc-34d3-43df-a7ee-11ae6ba64dd5',
};

 const invalidCaptureContext = 'jenebdhbhcbhdbchfd';

 export default {
  captureContext,
  paymentObj,
  invalidCaptureContext
 }