import { AddressType, CustomerType } from '../../types/Types';
import creditCard from '../JSON/creditCard.json';
 const addTokenResponseCustomerId = '88c278f9-82d9-427c-96df-f98a4f23e543';

 let addTokenResponseCustomerObj : CustomerType= {
  id: '88c278f9-82d9-427c-96df-f98a4f23e543',
  version: 350,
  lastMessageSequenceNumber: 4,
  createdAt: '2021-12-16T06:27:21.680Z',
  lastModifiedAt: '2022-05-24T07:07:39.342Z',
  lastModifiedBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: '88c278f9-82d9-427c-96df-f98a4f23e543',
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
  email: 'john.doe@gmail.com',
  firstName: 'john',
  lastName: 'p',
  addresses: [
    {
      id: 'Gu_fd8_a',
      firstName: 'john',
      lastName: 'doe',
      streetName: '1295 Charleston Road',
      additionalStreetInfo: '5th lane',
      postalCode: '94043',
      city: 'Mountain View',
      region: 'CA',
      country: 'US',
      phone: '+19876543210',
      email: 'john.doe@wipro.com',
      address1: '',
      address2: '',
      buildingNumber: '',
      streetNumber: '',
      locality: '',
      administrativeArea: '',
      phoneNumber: '',
      mobile: ''
    },
  ],
  shippingAddressIds: [],
  billingAddressIds: [],
  isEmailVerified: false,
  custom: {
    type: {
      typeId: 'type',
      id: '03554714-1432-43ab-9f63-8c31dc396982',
    },
    fields: {
      isv_tokenCaptureContextSignature: 'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJmajJKN1N0YWV4V1NNbXREeTFlZzBoQUFFQjZET1hCdm1IMUhINmZGblU5RWdMd3AyV280c2EwQ3dxRVRXWkY1NC8yOUtMWFVZYVJUK0NrOTNVSlQwTWxkbnZKcVFHZUVNZldiRVdBdDVtdHgwbkNEaEZZMzBnZy9LT2tFUGhteHE4b1EiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJyelJHbVlfQUVpSHRoWGozTG9oV2g5RDRMeUJ0OGpVZjQtUTVUV0MzVmU0c0hubUpuXzlNalpDb2RfbXBBV3daVGdCOUpJc1k2OXFaZkpKX29La0RZUHo0aFVvWW5kaUhiZjJ5Q3BzYmhwSWMxZlZkWWZxSUNGQVhDYUVjSVJ2Nk1MTXB0aVlhd1V2RGFjaW01dU56SUFKZFNVNEFwd0IxemJERkFOOGhSaDlwQzY0MWdsMGpCTmhIck9GOWZsazVOWlpId1J6ZkZuNm1TNzRWaWkxdVJHRWhqdGhRbjR5NkdJazBDaG1GQjlQU3ByUzFnZTlYS21TcEhsanh1WllWWG0tWVRWWW9jX3FldEZCT0VkMWRjZXZFMjg4RkwydDNHQUNvTUhyc3pYU2J0WVFCX3lXSDhpSlJGTm5rY1dnM2pGS0E3VGpFdXNGWVVKYnFZanAxTHciLCJraWQiOiIwOFhUQWRjaU1yd0Z4VEZIa0dUckpldlp4enZIZE1aVyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NTMzNzY5NTksImlhdCI6MTY1MzM3NjA1OSwianRpIjoibnRNcmtZbldvQVQzV0VLdyJ9.fKn0V9uUWu90ov9UqnylxzEJPtxrLWipoEEr4-m1TLEWv7gz2wTnoDP-6xDRLtOFcklC1kVwDgpSWdX56xNlWbEZx4h7_tIow5twfQZ2KbWbApeH6O6plKSNMN2cC9hTY4McMrTn5cIpJ0AlSPXhaVmiE4Pn9JM44MQS4kBYDCsFLbtnVrKeZUR8E2yT5loYpd_v_R0uaZzkXgBmkPaf7KT9aVW_0RWBoD5xQ1LocwW806JqT0ds6qCv8jaKYWZJmd2blhKJ2mdNRAsWiYbvJinvx1U0IiUbaG3xjSj_laZjOaMRtBkaLiO36WuXFZwqHe-Y4vwW3HWQNSwc0OwwSQ',
      isv_deviceFingerprintId: 'e5a44e48-7717-47e3-aaac-bc9c0dcf08b9',
      isv_cardExpiryYear: '2025',
      isv_token: creditCard.isv_token,
      isv_tokenAlias: 'card4',
      isv_cardType: '001',
      isv_cardExpiryMonth: '01',
      isv_tokens: [
        '{"alias":"card2","value":"D605360941117CECE053AF598E0A6EEC","cardType":"001","cardName":"001","cardNumber":"411111XXXXXX1111","cardExpiryMonth":"12","cardExpiryYear":"2031","paymentToken":"D605418402B2E488E053AF598E0A99B5"}',
        '{"alias":"card1","value":"D605360941117CECE053AF598E0A6EEC","paymentToken":"DFBC5695E4C42A65E053A2598D0A6494","instrumentIdentifier":"7020000000005531091","cardType":"001","cardName":"001","cardNumber":"400000XXXXXX1091","cardExpiryMonth":"01","cardExpiryYear":"2026","addressId":"Gu_fd8_a"}',
        '{"alias":"card3","value":"D605360941117CECE053AF598E0A6EEC","paymentToken":"DFBC9A9AFB8CE8BFE053A2598D0A9121","instrumentIdentifier":"7030000000026601088","cardType":"001","cardName":"001","cardNumber":"445653XXXXXX1088","cardExpiryMonth":"01","cardExpiryYear":"2031","addressId":"Gu_fd8_a"}',
      ],
      isv_tokenVerificationContext: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJmajJKN1N0YWV4V1NNbXREeTFlZzBoQUFFQjZET1hCdm1IMUhINmZGblU5RWdMd3AyV280c2EwQ3dxRVRXWkY1NC8yOUtMWFVZYVJUK0NrOTNVSlQwTWxkbnZKcVFHZUVNZldiRVdBdDVtdHgwbkNEaEZZMzBnZy9LT2tFUGhteHE4b1EiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJyelJHbVlfQUVpSHRoWGozTG9oV2g5RDRMeUJ0OGpVZjQtUTVUV0MzVmU0c0hubUpuXzlNalpDb2RfbXBBV3daVGdCOUpJc1k2OXFaZkpKX29La0RZUHo0aFVvWW5kaUhiZjJ5Q3BzYmhwSWMxZlZkWWZxSUNGQVhDYUVjSVJ2Nk1MTXB0aVlhd1V2RGFjaW01dU56SUFKZFNVNEFwd0IxemJERkFOOGhSaDlwQzY0MWdsMGpCTmhIck9GOWZsazVOWlpId1J6ZkZuNm1TNzRWaWkxdVJHRWhqdGhRbjR5NkdJazBDaG1GQjlQU3ByUzFnZTlYS21TcEhsanh1WllWWG0tWVRWWW9jX3FldEZCT0VkMWRjZXZFMjg4RkwydDNHQUNvTUhyc3pYU2J0WVFCX3lXSDhpSlJGTm5rY1dnM2pGS0E3VGpFdXNGWVVKYnFZanAxTHciLCJraWQiOiIwOFhUQWRjaU1yd0Z4VEZIa0dUckpldlp4enZIZE1aVyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NTMzNzY5NTksImlhdCI6MTY1MzM3NjA1OSwianRpIjoibnRNcmtZbldvQVQzV0VLdyJ9.J5uwR2sQNZTKy0qkwYGir8DvUhmhUKbPPXR_HVdskAQ',
      isv_tokenUpdated: false,
      isv_addressId: 'Gu_fd8_a',
      isv_maskedPan: '445653XXXXXX1104',
    },
  }
};

 const addInvalidTokenResponseCustomerObj = {
  id: '88c278f9-82d9-427c-96df-f98a4f23e543',
  version: 350,
  lastMessageSequenceNumber: 4,
  createdAt: '2021-12-16T06:27:21.680Z',
  lastModifiedAt: '2022-05-24T07:07:39.342Z',
  lastModifiedBy: {
    clientId: '0GrQ8c2D9t1iSjzJF8E3Ygu3',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: '88c278f9-82d9-427c-96df-f98a4f23e543',
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
  email: 'spjohn54@gmail.com',
  firstName: 'john',
  lastName: 'p',
  addresses: [
    {
      id: 'Gu_fd8_a',
      firstName: 'john',
      lastName: 'doe',
      streetName: '1295 Charleston Road',
      additionalStreetInfo: '5th lane',
      postalCode: '94043',
      city: 'Mountain View',
      region: 'CA',
      country: 'US',
      phone: '+19876543210',
      email: 'john.doe@wipro.com',
    },
  ],
  shippingAddressIds: [],
  billingAddressIds: [],
  isEmailVerified: false,
  custom: {
    type: {
      typeId: 'type',
      id: '03554714-1432-43ab-9f63-8c31dc396982',
    },
    fields: {
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJmajJKN1N0YWV4V1NNbXREeTFlZzBoQUFFQjZET1hCdm1IMUhINmZGblU5RWdMd3AyV280c2EwQ3dxRVRXWkY1NC8yOUtMWFVZYVJUK0NrOTNVSlQwTWxkbnZKcVFHZUVNZldiRVdBdDVtdHgwbkNEaEZZMzBnZy9LT2tFUGhteHE4b1EiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJyelJHbVlfQUVpSHRoWGozTG9oV2g5RDRMeUJ0OGpVZjQtUTVUV0MzVmU0c0hubUpuXzlNalpDb2RfbXBBV3daVGdCOUpJc1k2OXFaZkpKX29La0RZUHo0aFVvWW5kaUhiZjJ5Q3BzYmhwSWMxZlZkWWZxSUNGQVhDYUVjSVJ2Nk1MTXB0aVlhd1V2RGFjaW01dU56SUFKZFNVNEFwd0IxemJERkFOOGhSaDlwQzY0MWdsMGpCTmhIck9GOWZsazVOWlpId1J6ZkZuNm1TNzRWaWkxdVJHRWhqdGhRbjR5NkdJazBDaG1GQjlQU3ByUzFnZTlYS21TcEhsanh1WllWWG0tWVRWWW9jX3FldEZCT0VkMWRjZXZFMjg4RkwydDNHQUNvTUhyc3pYU2J0WVFCX3lXSDhpSlJGTm5rY1dnM2pGS0E3VGpFdXNGWVVKYnFZanAxTHciLCJraWQiOiIwOFhUQWRjaU1yd0Z4VEZIa0dUckpldlp4enZIZE1aVyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NTMzNzY5NTksImlhdCI6MTY1MzM3NjA1OSwianRpIjoibnRNcmtZbldvQVQzV0VLdyJ9.fKn0V9uUWu90ov9UqnylxzEJPtxrLWipoEEr4-m1TLEWv7gz2wTnoDP-6xDRLtOFcklC1kVwDgpSWdX56xNlWbEZx4h7_tIow5twfQZ2KbWbApeH6O6plKSNMN2cC9hTY4McMrTn5cIpJ0AlSPXhaVmiE4Pn9JM44MQS4kBYDCsFLbtnVrKeZUR8E2yT5loYpd_v_R0uaZzkXgBmkPaf7KT9aVW_0RWBoD5xQ1LocwW806JqT0ds6qCv8jaKYWZJmd2blhKJ2mdNRAsWiYbvJinvx1U0IiUbaG3xjSj_laZjOaMRtBkaLiO36WuXFZwqHe-Y4vwW3HWQNSwc0OwwSQ',
      isv_deviceFingerprintId: 'e5a44e48-7717-47e3-aaac-bc9c0dcf08b9',
      isv_cardExpiryYear: '2025',
      isv_token: 'abc',
      isv_tokenAlias: 'card4',
      isv_cardType: '001',
      isv_cardExpiryMonth: '01',
      isv_tokens: [
        '{"alias":"card2","value":"D605360941117CECE053AF598E0A6EEC","cardType":"001","cardName":"001","cardNumber":"411111XXXXXX1111","cardExpiryMonth":"12","cardExpiryYear":"2031","paymentToken":"D605418402B2E488E053AF598E0A99B5"}',
        '{"alias":"card1","value":"D605360941117CECE053AF598E0A6EEC","paymentToken":"DFBC5695E4C42A65E053A2598D0A6494","instrumentIdentifier":"7020000000005531091","cardType":"001","cardName":"001","cardNumber":"400000XXXXXX1091","cardExpiryMonth":"01","cardExpiryYear":"2026","addressId":"Gu_fd8_a"}',
        '{"alias":"card3","value":"D605360941117CECE053AF598E0A6EEC","paymentToken":"DFBC9A9AFB8CE8BFE053A2598D0A9121","instrumentIdentifier":"7030000000026601088","cardType":"001","cardName":"001","cardNumber":"445653XXXXXX1088","cardExpiryMonth":"01","cardExpiryYear":"2031","addressId":"Gu_fd8_a"}',
      ],
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJmajJKN1N0YWV4V1NNbXREeTFlZzBoQUFFQjZET1hCdm1IMUhINmZGblU5RWdMd3AyV280c2EwQ3dxRVRXWkY1NC8yOUtMWFVZYVJUK0NrOTNVSlQwTWxkbnZKcVFHZUVNZldiRVdBdDVtdHgwbkNEaEZZMzBnZy9LT2tFUGhteHE4b1EiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJyelJHbVlfQUVpSHRoWGozTG9oV2g5RDRMeUJ0OGpVZjQtUTVUV0MzVmU0c0hubUpuXzlNalpDb2RfbXBBV3daVGdCOUpJc1k2OXFaZkpKX29La0RZUHo0aFVvWW5kaUhiZjJ5Q3BzYmhwSWMxZlZkWWZxSUNGQVhDYUVjSVJ2Nk1MTXB0aVlhd1V2RGFjaW01dU56SUFKZFNVNEFwd0IxemJERkFOOGhSaDlwQzY0MWdsMGpCTmhIck9GOWZsazVOWlpId1J6ZkZuNm1TNzRWaWkxdVJHRWhqdGhRbjR5NkdJazBDaG1GQjlQU3ByUzFnZTlYS21TcEhsanh1WllWWG0tWVRWWW9jX3FldEZCT0VkMWRjZXZFMjg4RkwydDNHQUNvTUhyc3pYU2J0WVFCX3lXSDhpSlJGTm5rY1dnM2pGS0E3VGpFdXNGWVVKYnFZanAxTHciLCJraWQiOiIwOFhUQWRjaU1yd0Z4VEZIa0dUckpldlp4enZIZE1aVyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NTMzNzY5NTksImlhdCI6MTY1MzM3NjA1OSwianRpIjoibnRNcmtZbldvQVQzV0VLdyJ9.J5uwR2sQNZTKy0qkwYGir8DvUhmhUKbPPXR_HVdskAQ',
      isv_tokenUpdated: false,
      isv_addressId: 'Gu_fd8_a',
      isv_maskedPan: '445653XXXXXX1104',
    },
  },
  stores: []
};
 const addTokenResponseAddress: readonly AddressType[] = [
  {
    id: 'Gu_fd8_a',
    firstName: 'john',
    lastName: 'doe',
    streetName: '1295 Charleston Road',
    additionalStreetInfo: '5th lane',
    postalCode: '94043',
    city: 'Mountain View',
    region: 'CA',
    country: 'US',
    phone: '+19876543210',
    email: 'john.doe@wipro.com',
    address1: '',
    address2: '',
    buildingNumber: '',
    streetNumber: '',
    locality: '',
    administrativeArea: '',
    phoneNumber: '',
    mobile: ''
  },
];

 const addTokenAddress: AddressType = {
  id: 'Gu_fd8_a',
  firstName: 'john',
  lastName: 'doe',
  streetName: '1295 Charleston Road',
  additionalStreetInfo: '5th lane',
  postalCode: '94043',
  city: 'Mountain View',
  region: 'CA',
  country: 'US',
  phone: '+19876543210',
  email: 'john.doe@wipro.com',
  address1: '',
  address2: '',
  buildingNumber: '',
  streetNumber: '',
  locality: '',
  administrativeArea: '',
  phoneNumber: '',
  mobile: ''
};

 const addTokenResponseCardTokens = {
  customerTokenId: 'D605360941117CECE053AF598E0A6EEC',
  paymentInstrumentId: '',
};

export default {
  addTokenResponseCustomerId,
  addTokenResponseCustomerObj,
  addInvalidTokenResponseCustomerObj,
  addTokenResponseAddress,
  addTokenAddress,
  addTokenResponseCardTokens
}