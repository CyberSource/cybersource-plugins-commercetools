import creditCard from '../JSON/creditCard.json';
 const payments = {
  id: 'd3bfe799-0869-476c-b745-5f5baa4b410f',
  version: 16,
  lastMessageSequenceNumber: 1,
  createdAt: '2022-06-23T06:00:09.514Z',
  lastModifiedAt: '2022-06-23T06:01:56.613Z',
  lastModifiedBy: {
    clientId: 'mSpmJgXkt_CadneUb0otjt98',
    isPlatformClient: false,
    anonymousId: 'b7037191-ed8f-4518-a66a-5b1efda2a2de',
  },
  createdBy: {
    clientId: 'mSpmJgXkt_CadneUb0otjt98',
    isPlatformClient: false,
    anonymousId: 'b7037191-ed8f-4518-a66a-5b1efda2a2de',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 3500,
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
      id: 'e2288aa6-6a13-49eb-8f79-f9cc73fd4dd0',
    },
    fields: {
      isv_deviceFingerprintId: 'e161b9f0-f093-4708-9805-e2639ef586e7',
      isv_cardExpiryYear: '2025',
      isv_token: creditCard.isv_token,
      isv_saleEnabled: false,
      isv_customerIpAddress: '122.163.190.43',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_deviceDataCollectionUrl: 'https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect',
      isv_cardinalReferenceId: '46af75ea-2abd-4fc0-b170-21dd52d78376',
      isv_requestJwt:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YWIzMDg1NC1lNWI2LTQyMjItYjQ1ZS04Yjc3NzFiZGVhMGIiLCJpYXQiOjE2NTU5NjQxMTYsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTY1NTk2NzcxNiwiT3JnVW5pdElkIjoiNWEzZDAxZmU2ZmUzZDExMjdjZGJjOTFlIiwiUmVmZXJlbmNlSWQiOiI0NmFmNzVlYS0yYWJkLTRmYzAtYjE3MC0yMWRkNTJkNzgzNzYifQ.njV3O3JaQlQxlRyP3YzssaWS3Sr8Cqaj6fpP8NVab3g',
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJ3eURUZEQ5U3loSFNOV3UxOGNhRUhoQUFFTVhWNzgvZU55ZnFPTzNCdHA2RXhpRy81MmZQUkpHSjZUSUx1anZidDZuZzFNMmlxUEpTS0prczVCZHRnYUxUZjcxM3BzdHMxeGZ6ZEdhR3NxdE80b0NPSjhEaHVnOEJoaTh2NDlONU0rVEIiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJndW9jeV9NOF90aEFSWGtzRXY3RWgyTUw4MEVsbmRrMlhZbUxVcTh2ZkZKUi1mLXhqZFM2N1JhdkFqSmhTdGRWN01mNGlZZUkxeW5ZQXRrYmxOTWFXazJCakNXQ0xJYU4tUzFQeTVoci1OMHcxX29yck01RFRxYVRYbHpGSElYa0RDRjY4SGFrWnBNeXNFbTFMN3phZkdRWjB4S3VxRUU3T3NvWjRoNFhDYmZLdjlYY1JxY1hZbi1OeE5MeW1PNVBzcmd4TFA1ZjJjVU9iQkZub2FYdkhRYXNkS0ZBX1dEbk9YVS12cWUxMjE0Z3lFM1NzLUJDaVJhbzZBUVpWeTBwVm1nYXJRbWR1aUZHT0I0TG95dGJMV2h3cW9GSkFEcTEzQldKSFJBV05oMThzUHAydGVXYTRGNkFuNEtaY3kwMjVxaHhNM0F2OE1TZHk0LVluVmZQSnciLCJraWQiOiIwODR1UFZVRjl6bFo3a29rU21JNGtpeVpmV01Vd1VUNSJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NTU5NjQ5MDksImlhdCI6MTY1NTk2NDAwOSwianRpIjoiY2FGeFc2RktweW8ySE50eiJ9.ajsk1aDvTiurHdOVRuvRcZ57BCHw-Q_MV68kG-44-GIxLPW8LSfzZ_-UAKL_758fLGHonD2cQUE2KydYVadJ8wesST6SAf9lb2lnLfjniyaqB-rimbyJR4HVncbeAkA1oLcc9aaWLvExaxZI8T1LQZzr-aI91SF9hn58LfCAo3rLiy9TCmUh5oBM0q7_TL3Gy1JJ7MmIrdLAxQNXKnM6xiTYVFkNAe47Fh853yLLrJYjcxqp-hKv2sZnQzKl8JnzCdan3FZVTIvlYLt0q3h5Bsot6hX6HuFGFmWJh2fmzsuKTmATuqYHh6ebgM5DUdBHQRm5kaihDgXP5qsSeAxGKA',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJ3eURUZEQ5U3loSFNOV3UxOGNhRUhoQUFFTVhWNzgvZU55ZnFPTzNCdHA2RXhpRy81MmZQUkpHSjZUSUx1anZidDZuZzFNMmlxUEpTS0prczVCZHRnYUxUZjcxM3BzdHMxeGZ6ZEdhR3NxdE80b0NPSjhEaHVnOEJoaTh2NDlONU0rVEIiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJndW9jeV9NOF90aEFSWGtzRXY3RWgyTUw4MEVsbmRrMlhZbUxVcTh2ZkZKUi1mLXhqZFM2N1JhdkFqSmhTdGRWN01mNGlZZUkxeW5ZQXRrYmxOTWFXazJCakNXQ0xJYU4tUzFQeTVoci1OMHcxX29yck01RFRxYVRYbHpGSElYa0RDRjY4SGFrWnBNeXNFbTFMN3phZkdRWjB4S3VxRUU3T3NvWjRoNFhDYmZLdjlYY1JxY1hZbi1OeE5MeW1PNVBzcmd4TFA1ZjJjVU9iQkZub2FYdkhRYXNkS0ZBX1dEbk9YVS12cWUxMjE0Z3lFM1NzLUJDaVJhbzZBUVpWeTBwVm1nYXJRbWR1aUZHT0I0TG95dGJMV2h3cW9GSkFEcTEzQldKSFJBV05oMThzUHAydGVXYTRGNkFuNEtaY3kwMjVxaHhNM0F2OE1TZHk0LVluVmZQSnciLCJraWQiOiIwODR1UFZVRjl6bFo3a29rU21JNGtpeVpmV01Vd1VUNSJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NTU5NjQ5MDksImlhdCI6MTY1NTk2NDAwOSwianRpIjoiY2FGeFc2RktweW8ySE50eiJ9.0xdplY0zfOhiv2njbq3HSoEmsEBkJybIw91X6N6Nz1M',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
  anonymousId: 'b7037191-ed8f-4518-a66a-5b1efda2a2de',
};

 const cardTokensObject = {
  customerTokenId: creditCard.savedTokenId,
  paymentInstrumentId: creditCard.savedToken,
};

 const cardTokensInvalidCustomerObject = {
  customerTokenId: 'D605360941117CECE053AF598E0A6E',
  paymentInstrumentId: creditCard.savedToken,
};

 const cardTokenInvalidObject = {
  customerTokenId: creditCard.savedTokenId,
  paymentInstrumentId: 'D76C84878E06B607E053A2598D0AAC',
};
 const paymentObject = {
  id: 'f421e2ca-de6a-4a5d-b2c0-1c9ccbd3cdc1',
  version: 14,
  lastMessageSequenceNumber: 1,
  createdAt: '2021-11-18T11:16:18.831Z',
  lastModifiedAt: '2021-11-18T11:16:36.439Z',
  lastModifiedBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: '3e8d96e4-2ebb-4c72-b554-7669efcb5d5a',
  },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: '3e8d96e4-2ebb-4c72-b554-7669efcb5d5a',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'creditCardWithPayerAuthentication',
    name: { en: 'Credit Card Payer Authentication' },
  },
  custom: {
    type: { typeId: 'type', id: '87b9d9db-74a3-45d7-8e60-dde669866808' },
    fields: {
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJxUC9kSU5ZcFozTmIzcjhnNlgzckpSQUFFTHY4VHRrTC9xdzE1RC9jcktJOWIzdERGbnpnZ01yMEk5OTJrUVdnSWFRU0VKTzRpQ0JiZERBN1RNMmd2VHZnUGgwdW80Q2dETG5xU25qQmYxTzh5cVltQXI2VGFTR2VxR1NickdHRXpaZ0IiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJnNmZyWlZSTHJ2bnNsdm9SX2ktM2FadThkWGM1UEhZZU5iN3J0aC1UQW11d2pLVWl4cnBfdkloSGs2VTRGREpWY0xIc2k2ZlNYT1VQeno5SzY1WnRqWGlnd3hDeTVQelBBRVFKNzRxZllKeG1qalhWUXVWdmthZUpiRDdVSU0xWXc5OGl2Y3Y0c09KRnpvS2Zvc00ySFdJVjJjbkVpaGJVbmVtekJwSDNsRXh1UFU1S0R5LXVyZzJzeWpLRjQ4aExXcGpxYnRHemVkV1VfWnp1QW9EU3pqcUtaTHoxb2RUdnoyNFVWcW1NMVZjLWhBcEIyWXdUam1vVE9MdnVPVkdrelY0cXRIUi1ULXFOLVRwRVRKLTJJbDJoU1Y0OHJkSjRiM1FWU0VHTzJzUm5nLWpHQmtlX2dMbmVNNjAxR1ZHVHZYc2lJZnN2V2xXZ1piUFowSnRZT3ciLCJraWQiOiIwODhlczJHVVpRN1I4WkU0WlBESDJoZnRCMFQwekM0UyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzcyMzUwNzgsImlhdCI6MTYzNzIzNDE3OCwianRpIjoiOGRVbk1lNTNndUVlZXRPMSJ9.SHGohwgLRbk3AiRLSKQz0-NOLBwheay1Y9nSc7K-IctK6AHbTbTSG1d0yFa_PNUo_bLawyvwpvnJgFlccI1rgJR9VoBJhL8BZmwK2nBIrQyoKJyuAuIet0BZjzJ_0PWu9fr7mDdAJ5OAqtvw6AW4pFIri_1mV4AhAwBYSThlQOFFcGuRAsSFdK29TRMsqa31lkQ9tTUsXEteEHhHFGATXgTHqv3_wwWYoPx1IF--BpiCFE_tbkEldaQt6shemv69Y2mdGjskdm_KR1zKk0B7pwchZlzl4y5DhgVHxHcd1W1ej8flFuVvEI8EhVQ8zuOVE4zabUXGS6mdTv_8Pwp0gA',
      isv_deviceFingerprintId: 'ecdce16c-7eee-45bc-8809-978623fb1272',
      isv_cardExpiryYear: '2030',
      isv_token:
        'eyJraWQiOiIwODhVbk9LMjZoUEthQXFFMDZ2WmNnMXNmbXF5dHRrMyIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7I4cGlyYXRpb25ZZWFyIjoiMjAyMyIsIm51bWJlciI6IjQxMTExMVhYWFhYWDExMTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wNyIsImV4cCI6MTY0MDI2MzQyNCwidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTY0MDI2MjUyNCwianRpIjoiMUU0WUo1V1pUVUJDR0RFUkY4MkZEOU45TVlJVkIwMENZWUVNTkZSQTRGRTZEOVhCTjhXTDYxQzQ2RjAwNjkxNiIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDIzIn0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDExMTEiLCJiaW4iOiI0MTExMTEifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.Fm_Tq22J_TMBNQOY8E57_u-vD_P-GA-bwX7QGTTdpJVyfOb-wtF-nPp9pXdRyOND4FS6OrqTGALp6hYicvrXB24MMVTIHal8u0EGnGsGgoFGeS81vYZJJVjxq_gxyZN2tBxWAZRgSJiHHC4IStWjUks49TSAOo2UTieW5_GLT30LzuH1X1aFo-VK4V5zlpKRHY1hby0ZpLqbStouWPJlknM1P6vuYprMgCUq6E69I9RlHhixNpqmS7Q9ITW_u9CD5XAymDSOH2qkz0K_a-bbjz7MN_rBCmFdA_H6tmzRie6p0h2SBi_969t6-fBbHYE--dOKjGPgOmOToMJRfW3nDw',
      isv_customerIpAddress: '171.76.13.221',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJxUC9kSU5ZcFozTmIzcjhnNlgzckpSQUFFTHY4VHRrTC9xdzE1RC9jcktJOWIzdERGbnpnZ01yMEk5OTJrUVdnSWFRU0VKTzRpQ0JiZERBN1RNMmd2VHZnUGgwdW80Q2dETG5xU25qQmYxTzh5cVltQXI2VGFTR2VxR1NickdHRXpaZ0IiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJnNmZyWlZSTHJ2bnNsdm9SX2ktM2FadThkWGM1UEhZZU5iN3J0aC1UQW11d2pLVWl4cnBfdkloSGs2VTRGREpWY0xIc2k2ZlNYT1VQeno5SzY1WnRqWGlnd3hDeTVQelBBRVFKNzRxZllKeG1qalhWUXVWdmthZUpiRDdVSU0xWXc5OGl2Y3Y0c09KRnpvS2Zvc00ySFdJVjJjbkVpaGJVbmVtekJwSDNsRXh1UFU1S0R5LXVyZzJzeWpLRjQ4aExXcGpxYnRHemVkV1VfWnp1QW9EU3pqcUtaTHoxb2RUdnoyNFVWcW1NMVZjLWhBcEIyWXdUam1vVE9MdnVPVkdrelY0cXRIUi1ULXFOLVRwRVRKLTJJbDJoU1Y0OHJkSjRiM1FWU0VHTzJzUm5nLWpHQmtlX2dMbmVNNjAxR1ZHVHZYc2lJZnN2V2xXZ1piUFowSnRZT3ciLCJraWQiOiIwODhlczJHVVpRN1I4WkU0WlBESDJoZnRCMFQwekM0UyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzcyMzUwNzgsImlhdCI6MTYzNzIzNDE3OCwianRpIjoiOGRVbk1lNTNndUVlZXRPMSJ9.ldSihdIQRJf7ukEacugVNiNWdOvV4o17MPU8S26J0A8',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};
 let paymentSavedTokens : any = {
  id: 'f421e2ca-de6a-4a5d-b2c0-1c9ccbd3cdc1',
  version: 14,
  lastMessageSequenceNumber: 1,
  createdAt: '2021-11-18T11:16:18.831Z',
  lastModifiedAt: '2021-11-18T11:16:36.439Z',
  lastModifiedBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: '3e8d96e4-2ebb-4c72-b554-7669efcb5d5a',
  },
  createdBy: {
    clientId: 'iFOAd29Lew5ADrpakIhQkz_N',
    isPlatformClient: false,
    anonymousId: '3e8d96e4-2ebb-4c72-b554-7669efcb5d5a',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 5980,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'creditCardWithPayerAuthentication',
    name: { en: 'Credit Card Payer Authentication' },
  },
  custom: {
    type: { typeId: 'type', id: '87b9d9db-74a3-45d7-8e60-dde669866808' },
    fields: {
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJxUC9kSU5ZcFozTmIzcjhnNlgzckpSQUFFTHY4VHRrTC9xdzE1RC9jcktJOWIzdERGbnpnZ01yMEk5OTJrUVdnSWFRU0VKTzRpQ0JiZERBN1RNMmd2VHZnUGgwdW80Q2dETG5xU25qQmYxTzh5cVltQXI2VGFTR2VxR1NickdHRXpaZ0IiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJnNmZyWlZSTHJ2bnNsdm9SX2ktM2FadThkWGM1UEhZZU5iN3J0aC1UQW11d2pLVWl4cnBfdkloSGs2VTRGREpWY0xIc2k2ZlNYT1VQeno5SzY1WnRqWGlnd3hDeTVQelBBRVFKNzRxZllKeG1qalhWUXVWdmthZUpiRDdVSU0xWXc5OGl2Y3Y0c09KRnpvS2Zvc00ySFdJVjJjbkVpaGJVbmVtekJwSDNsRXh1UFU1S0R5LXVyZzJzeWpLRjQ4aExXcGpxYnRHemVkV1VfWnp1QW9EU3pqcUtaTHoxb2RUdnoyNFVWcW1NMVZjLWhBcEIyWXdUam1vVE9MdnVPVkdrelY0cXRIUi1ULXFOLVRwRVRKLTJJbDJoU1Y0OHJkSjRiM1FWU0VHTzJzUm5nLWpHQmtlX2dMbmVNNjAxR1ZHVHZYc2lJZnN2V2xXZ1piUFowSnRZT3ciLCJraWQiOiIwODhlczJHVVpRN1I4WkU0WlBESDJoZnRCMFQwekM0UyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzcyMzUwNzgsImlhdCI6MTYzNzIzNDE3OCwianRpIjoiOGRVbk1lNTNndUVlZXRPMSJ9.SHGohwgLRbk3AiRLSKQz0-NOLBwheay1Y9nSc7K-IctK6AHbTbTSG1d0yFa_PNUo_bLawyvwpvnJgFlccI1rgJR9VoBJhL8BZmwK2nBIrQyoKJyuAuIet0BZjzJ_0PWu9fr7mDdAJ5OAqtvw6AW4pFIri_1mV4AhAwBYSThlQOFFcGuRAsSFdK29TRMsqa31lkQ9tTUsXEteEHhHFGATXgTHqv3_wwWYoPx1IF--BpiCFE_tbkEldaQt6shemv69Y2mdGjskdm_KR1zKk0B7pwchZlzl4y5DhgVHxHcd1W1ej8flFuVvEI8EhVQ8zuOVE4zabUXGS6mdTv_8Pwp0gA',
      isv_deviceFingerprintId: 'ecdce16c-7eee-45bc-8809-978623fb1272',
      isv_cardExpiryYear: '2030',
      isv_tokenAlias: creditCard.tokenAlias,
      isv_maskedPan: '411111XXXXXX1111',
      isv_savedToken: creditCard.savedToken,
      isv_cardExpiryMonth: '01',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJxUC9kSU5ZcFozTmIzcjhnNlgzckpSQUFFTHY4VHRrTC9xdzE1RC9jcktJOWIzdERGbnpnZ01yMEk5OTJrUVdnSWFRU0VKTzRpQ0JiZERBN1RNMmd2VHZnUGgwdW80Q2dETG5xU25qQmYxTzh5cVltQXI2VGFTR2VxR1NickdHRXpaZ0IiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJnNmZyWlZSTHJ2bnNsdm9SX2ktM2FadThkWGM1UEhZZU5iN3J0aC1UQW11d2pLVWl4cnBfdkloSGs2VTRGREpWY0xIc2k2ZlNYT1VQeno5SzY1WnRqWGlnd3hDeTVQelBBRVFKNzRxZllKeG1qalhWUXVWdmthZUpiRDdVSU0xWXc5OGl2Y3Y0c09KRnpvS2Zvc00ySFdJVjJjbkVpaGJVbmVtekJwSDNsRXh1UFU1S0R5LXVyZzJzeWpLRjQ4aExXcGpxYnRHemVkV1VfWnp1QW9EU3pqcUtaTHoxb2RUdnoyNFVWcW1NMVZjLWhBcEIyWXdUam1vVE9MdnVPVkdrelY0cXRIUi1ULXFOLVRwRVRKLTJJbDJoU1Y0OHJkSjRiM1FWU0VHTzJzUm5nLWpHQmtlX2dMbmVNNjAxR1ZHVHZYc2lJZnN2V2xXZ1piUFowSnRZT3ciLCJraWQiOiIwODhlczJHVVpRN1I4WkU0WlBESDJoZnRCMFQwekM0UyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzcyMzUwNzgsImlhdCI6MTYzNzIzNDE3OCwianRpIjoiOGRVbk1lNTNndUVlZXRPMSJ9.ldSihdIQRJf7ukEacugVNiNWdOvV4o17MPU8S26J0A8',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};
 const cardTokensObjects = {
  customerTokenId: creditCard.savedTokenId,
  paymentInstrumentId: '',
};

 const cardTokensInvalidCustomerObjects = {
  customerTokenId: 'D605360941117CECE053AF598E0A6E',
  paymentInstrumentId: creditCard.savedToken,
};

export default {
  payments,
  cardTokensObject,
  cardTokensInvalidCustomerObject,
  cardTokenInvalidObject,
  paymentObject,
  paymentSavedTokens,
  cardTokensObjects,
  cardTokensInvalidCustomerObjects
}