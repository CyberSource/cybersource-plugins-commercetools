export const constants = {
  HTTP_OK_STATUS_CODE: 200,
  STRING_ACTIVE: 'ACTIVE',
  SUCCESS_MSG_UPDATED_CUSTOMER_TOKEN: 'Successfully updated customer token through webhooks API',
};

export const notification = {
  notificationId: 'b47c82ac-0eea-XXXX-e053-8f588d0afdc90',
  retryNumber: 0,
  eventType: 'tms.networktoken.updated',
  eventDate: '2021-07-11T04:07:52.157-07:00',
  webhookId: '10d7cab0-65d5-8022-e063-9c588e0aeb9f',
  payload: [
    {
      data: {
        _links: {
          paymentInstruments: [
            {
              href: '/tms/v1/paymentinstruments/11E005EC5EC93BE7E063AF598E0A92CC',
            },
          ],
          instrumentIdentifiers: [
            {
              href: '/tms/v1/instrumentidentifiers/7036349999987050572',
            },
          ],
          customers: [
            {
              href: '/tms/v2/customers/11E005EC5EC93BE7E063AF598E0A92CC',
            },
          ],
        },
        id: 'P47C5DF0BD0079A8E053XXXXXX0A5CDH',
        type: 'tokenizedCardUpdates',
        version: '1.0',
      },
      organizationId: 'visa_isv_commercetools_pmt',
    },
  ],
};
export const paymentObject = {
  id: '118887cc-bf41-46d4-a605-c5d4e6d0b117',
  version: 1,
  lastMessageSequenceNumber: 1,
  createdAt: '1970-01-01T00:00:00.000Z',
  lastModifiedAt: '1970-01-01T00:00:00.000Z',
  lastModifiedBy: {
    clientId: 'yTC2bJhPbEWRzVD6jKKhGzFt',
    isPlatformClient: false,
    customer: { typeId: 'customer', id: 'e7f4fd40-1f78-43d5-a537-665356aaf401' },
  },
  createdBy: {
    clientId: 'yTC2bJhPbEWRzVD6jKKhGzFt',
    isPlatformClient: false,
    customer: { typeId: 'customer', id: 'e7f4fd40-1f78-43d5-a537-665356aaf401' },
  },
  customer: { typeId: 'customer', id: 'e7f4fd40-1f78-43d5-a537-665356aaf401' },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 251540,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'creditCard',
    name: { en: 'Credit Card' },
  },
  custom: {
    type: { typeId: 'type', id: '45092eea-2b70-455a-950a-f96ae8e83a8f' },
    fields: { isv_merchantId: '' },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};
export const applePayPaymentObject = {
  id: '118887cc-bf41-46d4-a605-c5d4e6d0b117',
  version: 1,
  lastMessageSequenceNumber: 1,
  createdAt: '1970-01-01T00:00:00.000Z',
  lastModifiedAt: '1970-01-01T00:00:00.000Z',
  lastModifiedBy: {
    clientId: 'yTC2bJhPbEWRzVD6jKKhGzFt',
    isPlatformClient: false,
    customer: { typeId: 'customer', id: 'e7f4fd40-1f78-43d5-a537-665356aaf401' },
  },
  createdBy: {
    clientId: 'yTC2bJhPbEWRzVD6jKKhGzFt',
    isPlatformClient: false,
    customer: { typeId: 'customer', id: 'e7f4fd40-1f78-43d5-a537-665356aaf401' },
  },
  customer: { typeId: 'customer', id: 'e7f4fd40-1f78-43d5-a537-665356aaf401' },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 251540,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'applePay',
    name: { en: 'Apple Pay' },
  },
  custom: {
    type: { typeId: 'type', id: '45092eea-2b70-455a-950a-f96ae8e83a8f' },
    fields: {
      isv_merchantId: '',
      isv_deviceFingerprintId: '2cd0221d-e31e-42d3-9d6b-aaeedd0eb62c',
      isv_applePayValidationUrl: 'https://apple-pay-gateway-cert.apple.com/paymentservices/startSession',
      isv_acceptHeader: '*/*',
      isv_applePayDisplayName: 'Sunrise',
      isv_userAgentHeader: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};

export const payerAuthenticationPaymentObj = {
  id: '22578389-5add-40e4-8a05-f9b2959218bf',
  version: 11,
  versionModifiedAt: '2024-02-27T10:43:20.718Z',
  lastMessageSequenceNumber: 1,
  createdAt: '2024-02-27T10:43:20.718Z',
  lastModifiedAt: '2024-02-27T10:43:20.718Z',
  lastModifiedBy: {
    clientId: 'yTC2bJhPbEWRzVD6jKKhGzFt',
    isPlatformClient: false,
    customer: { typeId: 'customer', id: 'e7f4fd40-1f78-43d5-a537-665356aaf401' },
  },
  createdBy: {
    clientId: 'yTC2bJhPbEWRzVD6jKKhGzFt',
    isPlatformClient: false,
    customer: { typeId: 'customer', id: 'e7f4fd40-1f78-43d5-a537-665356aaf401' },
  },
  customer: { typeId: 'customer', id: 'e7f4fd40-1f78-43d5-a537-665356aaf401' },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 251540,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'creditCardWithPayerAuthentication',
    name: { en: 'Credit Card Payer Authentication' },
  },
  custom: {
    type: { typeId: 'type', id: '45092eea-2b70-455a-950a-f96ae8e83a8f' },
    fields: {
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJGTUhmVm9WZzlBb2dYZWtQZWQyaGxoQUFFSUVnQ2JyK1lodm1raGs4d3o4WmJUbTRKNzhjZllvK3ZMaGJmVmh3Zk9QRUpwQU5QUTlTT2ZRTnltSlpVcVRhdUlyYTBlK2Y1VmFObGNwZkJUYWh4N3NCckxTTE42OEdrdUZTV29TWmFwUW1BWTd2NThLYkhMYlB4V1lndUl1SktnXHUwMDNkXHUwMDNkIiwib3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20iLCJqd2siOnsia3R5IjoiUlNBIiwiZSI6IkFRQUIiLCJ1c2UiOiJlbmMiLCJuIjoia29GOGw5bm9GVEl0LXlEaWJIUDhuRGJDMnVjOVplZk9CeFZ0ZEFhUXRPS3FlM2YwOGJEUlZ6VnVkTkhTWVEzWm5tS0hVVmJ3aWlKYmFJNnlBRE9vMTlzTGdMLWRtY1VNSGlmQzN0Y1hUOFYyUlh1dmN3dmx4aEp2dWdsNXZweXMyQXI1Qm1hbkF5dlllNDJHUXBHWWZzQTBHTm1sYUJ2RzVoNDRiYTk5TEYxM25Fa2tlWXFZWXFvb0ZqUGl4OW84TTh0cU01b1ZPYUd1NjRtQ09CZUpnMGVybEtwbGRFZ1ZzQlRGUFU4UDZydlNXX1lwSW1uWmdZVktqT2t6YndhbmJjMlBsbGVkMFJpWFg2eTBnTEEzcGpsbW1EVlYtQV9HeXo3YkxUc0FsY0NuNzdKbklEMS11N0M4NXF1OVdjWjdLd1hhWGFxTmtJM1pwejNlZWNCSnB3Iiwia2lkIjoiMDhvQ2xZNWFGaWxwb1RFQXNlbnk3MmlRZEZHa2tRbGgifX0sImN0eCI6W3siZGF0YSI6eyJjbGllbnRMaWJyYXJ5IjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20vbWljcm9mb3JtL2J1bmRsZS92Mi4wL2ZsZXgtbWljcm9mb3JtLm1pbi5qcyIsImFsbG93ZWRDYXJkTmV0d29ya3MiOlsiVklTQSIsIk1BU1RFUkNBUkQiLCJBTUVYIiwiTUFFU1RSTyIsIkNBUlRFU0JBTkNBSVJFUyIsIkNVUCIsIkpDQiIsIkRJTkVSU0NMVUIiLCJESVNDT1ZFUiJdLCJ0YXJnZXRPcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJdLCJtZk9yaWdpbiI6Imh0dHBzOi8vdGVzdGZsZXguY3liZXJzb3VyY2UuY29tIn0sInR5cGUiOiJtZi0yLjAuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE3MDkwMzE1MDAsImlhdCI6MTcwOTAzMDYwMCwianRpIjoiNWlRa2pYN1RaWDRDRUxnaCJ9.nOkFIVEZeT3oiifEQIHnMoH7s3ROuXd5tUmgsoQUxdBW74lEsh6vrqjFOr57FMApWMSRv_kGNV4msOJIzcJwVAo12KF1Ac10geQicnKE-0DV8O9qVXPB6w06IFnYm9gBDJe5Nszs8N8ju32qq2Qw-FgEDLqbsdkVsD9vjed5zPLXm7bXlAli_2iEoAq-YaBec6Ge0GLlBBp13PL3MbaZC5TbMi5K5pwX66C7lhPKQEMDgq9mZXjqjCKA79UwaVP_Ext_zwR3Jo_N-X9OIVVQwMbRu80O6pRhLxvXO5wbsgQQTXy_RHbrbUAwFJH1T1FZyWFlGO8zagZld5f3LZi-KQ',
      isv_deviceFingerprintId: 'ca2b920e-3a92-4d3b-8876-1b23e93e6628',
      isv_token:
        'eyJraWQiOiIwOG9DbFk1YUZpbHBvVEVBc2VueTcyaVFkRkdra1FsaCIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA3IiwiZXhwIjoxNzA5MDMxNTE5LCJ0eXBlIjoibWYtMi4wLjAiLCJpYXQiOjE3MDkwMzA2MTksImp0aSI6IjFFM0taTlo4Mjc3RkdVU09aTExNU1JNTlBYSEQ2VzZWOEtQNFVUOTdYSUVMT1JXT041T0c2NUREQzA1RjY5RDQiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAyOCJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTA5MSIsImJpbiI6IjQwMDAwMCJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwNiJ9fX19fQ.c4TeJKgOHCrGhyc6bY0Zl7JBMPlJFzB-SxKj3I_xkpFRIPPUcud7YnblMjFEyceapnsy-gugpl1bqgo_UzDDRs-Q11wnJ01wU3HFzvEorT5iGxKdgHqiR1w1zbew5FVKvKrvmF0NrddvWXeXx_qgcdTGINcx5lIvNqlYDM60mjH18X7b3z6r6Yaaki5ctemtdEm5K_uff1VCcnvxxHfONovsHLtnA7NxYIzSHAaq1SNWdnevXGo1hfLl6whHB2U88hYDHO50s30sIVRXQULPCbhmFuHGByvPFSz4-M9Q56nUjYmdL-uf6MgF2lcs3uiB3qAD2QPtDNaxNT-NufOuyA',
      isv_saleEnabled: false,
      isv_cardType: '001',
      isv_customerIpAddress: '106.206.31.11',
      isv_maskedPan: '400000XXXXXXXXXXXX1091',
      isv_cardExpiryMonth: '06',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJGTUhmVm9WZzlBb2dYZWtQZWQyaGxoQUFFSUVnQ2JyK1lodm1raGs4d3o4WmJUbTRKNzhjZllvK3ZMaGJmVmh3Zk9QRUpwQU5QUTlTT2ZRTnltSlpVcVRhdUlyYTBlK2Y1VmFObGNwZkJUYWh4N3NCckxTTE42OEdrdUZTV29TWmFwUW1BWTd2NThLYkhMYlB4V1lndUl1SktnPT0iLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJrb0Y4bDlub0ZUSXQteURpYkhQOG5EYkMydWM5WmVmT0J4VnRkQWFRdE9LcWUzZjA4YkRSVnpWdWROSFNZUTNabm1LSFVWYndpaUpiYUk2eUFET28xOXNMZ0wtZG1jVU1IaWZDM3RjWFQ4VjJSWHV2Y3d2bHhoSnZ1Z2w1dnB5czJBcjVCbWFuQXl2WWU0MkdRcEdZZnNBMEdObWxhQnZHNWg0NGJhOTlMRjEzbkVra2VZcVlZcW9vRmpQaXg5bzhNOHRxTTVvVk9hR3U2NG1DT0JlSmcwZXJsS3BsZEVnVnNCVEZQVThQNnJ2U1dfWXBJbW5aZ1lWS2pPa3pid2FuYmMyUGxsZWQwUmlYWDZ5MGdMQTNwamxtbURWVi1BX0d5ejdiTFRzQWxjQ243N0puSUQxLXU3Qzg1cXU5V2NaN0t3WGFYYXFOa0kzWnB6M2VlY0JKcHciLCJraWQiOiIwOG9DbFk1YUZpbHBvVEVBc2VueTcyaVFkRkdra1FsaCJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiLCJNQUVTVFJPIiwiQ0FSVEVTQkFOQ0FJUkVTIiwiQ1VQIiwiSkNCIiwiRElORVJTQ0xVQiIsIkRJU0NPVkVSIl0sInRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTIuMC4wIn1dLCJpc3MiOiJGbGV4IEFQSSIsImV4cCI6MTcwOTAzMTUwMCwiaWF0IjoxNzA5MDMwNjAwLCJqdGkiOiI1aVFralg3VFpYNENFTGdoIn0.2OUaUGbtjPv6LT9p4gNBaBKYrEll2ktfvXJshyWtISo',
      isv_cardExpiryYear: '2028',
      isv_merchantId: '',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};

export const payerAuthEnrollPaymentObj = {
  id: '22578389-5add-40e4-8a05-f9b2959218bf',
  version: 16,
  versionModifiedAt: '2024-02-27T10:43:40.506Z',
  lastMessageSequenceNumber: 1,
  createdAt: '2024-02-27T10:43:20.718Z',
  lastModifiedAt: '2024-02-27T10:43:40.506Z',
  lastModifiedBy: {
    clientId: 'yTC2bJhPbEWRzVD6jKKhGzFt',
    isPlatformClient: false,
    customer: { typeId: 'customer', id: 'e7f4fd40-1f78-43d5-a537-665356aaf401' },
  },
  createdBy: {
    clientId: 'yTC2bJhPbEWRzVD6jKKhGzFt',
    isPlatformClient: false,
    customer: { typeId: 'customer', id: 'e7f4fd40-1f78-43d5-a537-665356aaf401' },
  },
  customer: { typeId: 'customer', id: 'e7f4fd40-1f78-43d5-a537-665356aaf401' },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 251540,
    fractionDigits: 2,
  },
  paymentMethodInfo: {
    paymentInterface: 'cybersource',
    method: 'creditCardWithPayerAuthentication',
    name: { en: 'Credit Card Payer Authentication' },
  },
  custom: {
    type: { typeId: 'type', id: '45092eea-2b70-455a-950a-f96ae8e83a8f' },
    fields: {
      isv_deviceFingerprintId: 'ca2b920e-3a92-4d3b-8876-1b23e93e6628',
      isv_token:
        'eyJraWQiOiIwOG9DbFk1YUZpbHBvVEVBc2VueTcyaVFkRkdra1FsaCIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA3IiwiZXhwIjoxNzA5MDMxNTE5LCJ0eXBlIjoibWYtMi4wLjAiLCJpYXQiOjE3MDkwMzA2MTksImp0aSI6IjFFM0taTlo4Mjc3RkdVU09aTExNU1JNTlBYSEQ2VzZWOEtQNFVUOTdYSUVMT1JXT041T0c2NUREQzA1RjY5RDQiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAyOCJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTA5MSIsImJpbiI6IjQwMDAwMCJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwNiJ9fX19fQ.c4TeJKgOHCrGhyc6bY0Zl7JBMPlJFzB-SxKj3I_xkpFRIPPUcud7YnblMjFEyceapnsy-gugpl1bqgo_UzDDRs-Q11wnJ01wU3HFzvEorT5iGxKdgHqiR1w1zbew5FVKvKrvmF0NrddvWXeXx_qgcdTGINcx5lIvNqlYDM60mjH18X7b3z6r6Yaaki5ctemtdEm5K_uff1VCcnvxxHfONovsHLtnA7NxYIzSHAaq1SNWdnevXGo1hfLl6whHB2U88hYDHO50s30sIVRXQULPCbhmFuHGByvPFSz4-M9Q56nUjYmdL-uf6MgF2lcs3uiB3qAD2QPtDNaxNT-NufOuyA',
      isv_saleEnabled: false,
      isv_customerIpAddress: '106.206.31.11',
      isv_maskedPan: '400000XXXXXXXXXXXX1091',
      isv_cardExpiryMonth: '06',
      isv_deviceDataCollectionUrl: 'https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect',
      isv_cardinalReferenceId: '8a48e0e4-4208-4a51-98aa-a1ecb224383b',
      isv_requestJwt:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZDQwOTkzZC0wOTFhLTRhOWYtOThkOC0zZWVjYjEzMzU5M2MiLCJpYXQiOjE3MDkwMzA2MjAsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTcwOTAzNDIyMCwiT3JnVW5pdElkIjoiNjU4NDEyNDUzZmJiNWUxZDg5NjYyZmUwIiwiUmVmZXJlbmNlSWQiOiI4YTQ4ZTBlNC00MjA4LTRhNTEtOThhYS1hMWVjYjIyNDM4M2IifQ.iBcNIbL9m_OK8CJ_db55dTjEXXRWKDdgtCdu1RWPyD8',
      isv_tokenCaptureContextSignature:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJGTUhmVm9WZzlBb2dYZWtQZWQyaGxoQUFFSUVnQ2JyK1lodm1raGs4d3o4WmJUbTRKNzhjZllvK3ZMaGJmVmh3Zk9QRUpwQU5QUTlTT2ZRTnltSlpVcVRhdUlyYTBlK2Y1VmFObGNwZkJUYWh4N3NCckxTTE42OEdrdUZTV29TWmFwUW1BWTd2NThLYkhMYlB4V1lndUl1SktnXHUwMDNkXHUwMDNkIiwib3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20iLCJqd2siOnsia3R5IjoiUlNBIiwiZSI6IkFRQUIiLCJ1c2UiOiJlbmMiLCJuIjoia29GOGw5bm9GVEl0LXlEaWJIUDhuRGJDMnVjOVplZk9CeFZ0ZEFhUXRPS3FlM2YwOGJEUlZ6VnVkTkhTWVEzWm5tS0hVVmJ3aWlKYmFJNnlBRE9vMTlzTGdMLWRtY1VNSGlmQzN0Y1hUOFYyUlh1dmN3dmx4aEp2dWdsNXZweXMyQXI1Qm1hbkF5dlllNDJHUXBHWWZzQTBHTm1sYUJ2RzVoNDRiYTk5TEYxM25Fa2tlWXFZWXFvb0ZqUGl4OW84TTh0cU01b1ZPYUd1NjRtQ09CZUpnMGVybEtwbGRFZ1ZzQlRGUFU4UDZydlNXX1lwSW1uWmdZVktqT2t6YndhbmJjMlBsbGVkMFJpWFg2eTBnTEEzcGpsbW1EVlYtQV9HeXo3YkxUc0FsY0NuNzdKbklEMS11N0M4NXF1OVdjWjdLd1hhWGFxTmtJM1pwejNlZWNCSnB3Iiwia2lkIjoiMDhvQ2xZNWFGaWxwb1RFQXNlbnk3MmlRZEZHa2tRbGgifX0sImN0eCI6W3siZGF0YSI6eyJjbGllbnRMaWJyYXJ5IjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20vbWljcm9mb3JtL2J1bmRsZS92Mi4wL2ZsZXgtbWljcm9mb3JtLm1pbi5qcyIsImFsbG93ZWRDYXJkTmV0d29ya3MiOlsiVklTQSIsIk1BU1RFUkNBUkQiLCJBTUVYIiwiTUFFU1RSTyIsIkNBUlRFU0JBTkNBSVJFUyIsIkNVUCIsIkpDQiIsIkRJTkVSU0NMVUIiLCJESVNDT1ZFUiJdLCJ0YXJnZXRPcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJdLCJtZk9yaWdpbiI6Imh0dHBzOi8vdGVzdGZsZXguY3liZXJzb3VyY2UuY29tIn0sInR5cGUiOiJtZi0yLjAuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE3MDkwMzE1MDAsImlhdCI6MTcwOTAzMDYwMCwianRpIjoiNWlRa2pYN1RaWDRDRUxnaCJ9.nOkFIVEZeT3oiifEQIHnMoH7s3ROuXd5tUmgsoQUxdBW74lEsh6vrqjFOr57FMApWMSRv_kGNV4msOJIzcJwVAo12KF1Ac10geQicnKE-0DV8O9qVXPB6w06IFnYm9gBDJe5Nszs8N8ju32qq2Qw-FgEDLqbsdkVsD9vjed5zPLXm7bXlAli_2iEoAq-YaBec6Ge0GLlBBp13PL3MbaZC5TbMi5K5pwX66C7lhPKQEMDgq9mZXjqjCKA79UwaVP_Ext_zwR3Jo_N-X9OIVVQwMbRu80O6pRhLxvXO5wbsgQQTXy_RHbrbUAwFJH1T1FZyWFlGO8zagZld5f3LZi-KQ',
      isv_cardExpiryYear: '2028',
      isv_merchantId: '',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJGTUhmVm9WZzlBb2dYZWtQZWQyaGxoQUFFSUVnQ2JyK1lodm1raGs4d3o4WmJUbTRKNzhjZllvK3ZMaGJmVmh3Zk9QRUpwQU5QUTlTT2ZRTnltSlpVcVRhdUlyYTBlK2Y1VmFObGNwZkJUYWh4N3NCckxTTE42OEdrdUZTV29TWmFwUW1BWTd2NThLYkhMYlB4V1lndUl1SktnPT0iLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJrb0Y4bDlub0ZUSXQteURpYkhQOG5EYkMydWM5WmVmT0J4VnRkQWFRdE9LcWUzZjA4YkRSVnpWdWROSFNZUTNabm1LSFVWYndpaUpiYUk2eUFET28xOXNMZ0wtZG1jVU1IaWZDM3RjWFQ4VjJSWHV2Y3d2bHhoSnZ1Z2w1dnB5czJBcjVCbWFuQXl2WWU0MkdRcEdZZnNBMEdObWxhQnZHNWg0NGJhOTlMRjEzbkVra2VZcVlZcW9vRmpQaXg5bzhNOHRxTTVvVk9hR3U2NG1DT0JlSmcwZXJsS3BsZEVnVnNCVEZQVThQNnJ2U1dfWXBJbW5aZ1lWS2pPa3pid2FuYmMyUGxsZWQwUmlYWDZ5MGdMQTNwamxtbURWVi1BX0d5ejdiTFRzQWxjQ243N0puSUQxLXU3Qzg1cXU5V2NaN0t3WGFYYXFOa0kzWnB6M2VlY0JKcHciLCJraWQiOiIwOG9DbFk1YUZpbHBvVEVBc2VueTcyaVFkRkdra1FsaCJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiLCJNQUVTVFJPIiwiQ0FSVEVTQkFOQ0FJUkVTIiwiQ1VQIiwiSkNCIiwiRElORVJTQ0xVQiIsIkRJU0NPVkVSIl0sInRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTIuMC4wIn1dLCJpc3MiOiJGbGV4IEFQSSIsImV4cCI6MTcwOTAzMTUwMCwiaWF0IjoxNzA5MDMwNjAwLCJqdGkiOiI1aVFralg3VFpYNENFTGdoIn0.2OUaUGbtjPv6LT9p4gNBaBKYrEll2ktfvXJshyWtISo',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [],
};

export const payerAuthSetupResponsePaymentObject = {
  id: '4f829ba4-e487-4ad9-a6e5-4d81e0793213',
  version: 28,
  versionModifiedAt: '2024-02-27T12:34:58.665Z',
  lastMessageSequenceNumber: 2,
  createdAt: '2024-02-27T12:34:25.722Z',
  lastModifiedAt: '2024-02-27T12:34:58.665Z',
  lastModifiedBy: {
    clientId: 'yTC2bJhPbEWRzVD6jKKhGzFt',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'e7f4fd40-1f78-43d5-a537-665356aaf401',
    },
  },
  createdBy: {
    clientId: 'yTC2bJhPbEWRzVD6jKKhGzFt',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'e7f4fd40-1f78-43d5-a537-665356aaf401',
    },
  },
  customer: {
    typeId: 'customer',
    id: 'e7f4fd40-1f78-43d5-a537-665356aaf401',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 251540,
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
      id: '45092eea-2b70-455a-950a-f96ae8e83a8f',
    },
    fields: {
      isv_requestJwt:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NThkZGMzNC01YzczLTQwMDAtOGYxOS1hZTU3YmM2M2YxNGYiLCJpYXQiOjE3MDkwMzcyOTAsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTcwOTA0MDg5MCwiT3JnVW5pdElkIjoiNjU4NDEyNDUzZmJiNWUxZDg5NjYyZmUwIiwiUmVmZXJlbmNlSWQiOiJhNjVmOTNlZS1lM2EwLTQ0OWEtYWIxYS1hNmEyMmFmMWQ0OTEifQ.5rah2fMBCTjvLOOXGuNBhQSW0_dowM5r0swR5NLvwWc',
      isv_deviceFingerprintId: '3a5c2f33-f044-4ce1-9c25-7df47cf968b6',
      isv_payerEnrollTransactionId: '7090372982186380604951',
      isv_token:
        'eyJraWQiOiIwOEpxMDdLNzBEYkpGbEJMeEtoWXJKem5iUWM0dDBXcSIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA3IiwiZXhwIjoxNzA5MDM4MTg4LCJ0eXBlIjoibWYtMi4wLjAiLCJpYXQiOjE3MDkwMzcyODksImp0aSI6IjFFMzVIQjNGNEM3QlJOSklMNFk2R0Q0OFk3TjRDRzQzWk1CWVFZTkhGUVJISDEzVTA2SFo2NUREREE2Q0M1QzIiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAyNiJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTA5MSIsImJpbiI6IjQwMDAwMCJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwNSJ9fX19fQ.Qtu2ZQO4qWhK4sfzfRErhpXeM4qq7faZiVoBlt4ZwGRpL0lSAt8t7xLZ-GRTEFfy55chzQeduWQv-pZf-9j37oT9t4KxXsoLdseWkF6nxSB7re-L_uOmRG-niqv1bxoWd5uwzwJuRFQ6yzJ3FeLPxybd_dxwNLktUmtz-8aZcoEIvPvUJS-u3BdJqn3UF8awe2luELuceCvBHkMiZlo69gxGV7kur8yuXDMR8ySqspybD9WDAT8u4cVJVmKVz6YRUTEehuW5StYJgdhouT_ykQADrQReJVZ4JAVIoYC1GtfFHUTWSUbJb3DnjAcZHxelDekbaVQKUlaQFtBXwVce9A',
      isv_saleEnabled: false,
      isv_payerEnrollHttpCode: 201,
      isv_payerAuthenticationPaReq:
        'eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiI4Njg4NjZlNy1kOTAwLTQ2M2UtYjFjNS1mMjdkN2Q5NzY0ODEiLCJhY3NUcmFuc0lEIjoiNWI2ZTFlMWYtYzcwOC00YzBiLTk1YjMtNDMxZDIzYzE1NTRkIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAxIn0',
      isv_stepUpUrl: 'https://centinelapistag.cardinalcommerce.com/V2/Cruise/StepUp',
      isv_maskedPan: '400000XXXXXXXXXXXX1091',
      isv_payerAuthenticationTransactionId: 'cBKTIj6j0BhGbo25bWx0',
      isv_payerAuthenticationRequired: true,
      isv_deviceDataCollectionUrl: 'https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect',
      isv_cardinalReferenceId: 'a65f93ee-e3a0-449a-ab1a-a6a22af1d491',
      isv_cardExpiryYear: '2026',
      isv_merchantId: '',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_payerEnrollStatus: 'PENDING_AUTHENTICATION',
      isv_customerIpAddress: '106.206.31.11',
      isv_cardExpiryMonth: '05',
      isv_payerAuthenticationAcsUrl: 'https://0merchantacsstag.cardinalcommerce.com/MerchantACSWeb/creq.jsp',
      isv_responseJwt:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YzljMDQzOS00MWNiLTRmMjctYmJjMi1kN2E4NDk5NjgxNmUiLCJpYXQiOjE3MDkwMzcyOTgsImlzcyI6IjVkZDgzYmYwMGU0MjNkMTQ5OGRjYmFjYSIsImV4cCI6MTcwOTA0MDg5OCwiT3JnVW5pdElkIjoiNjU4NDEyNDUzZmJiNWUxZDg5NjYyZmUwIiwiUGF5bG9hZCI6eyJBQ1NVcmwiOiJodHRwczovLzBtZXJjaGFudGFjc3N0YWcuY2FyZGluYWxjb21tZXJjZS5jb20vTWVyY2hhbnRBQ1NXZWIvY3JlcS5qc3AiLCJQYXlsb2FkIjoiZXlKdFpYTnpZV2RsVkhsd1pTSTZJa05TWlhFaUxDSnRaWE56WVdkbFZtVnljMmx2YmlJNklqSXVNUzR3SWl3aWRHaHlaV1ZFVTFObGNuWmxjbFJ5WVc1elNVUWlPaUk0TmpnNE5qWmxOeTFrT1RBd0xUUTJNMlV0WWpGak5TMW1NamRrTjJRNU56WTBPREVpTENKaFkzTlVjbUZ1YzBsRUlqb2lOV0kyWlRGbE1XWXRZemN3T0MwMFl6QmlMVGsxWWpNdE5ETXhaREl6WXpFMU5UUmtJaXdpWTJoaGJHeGxibWRsVjJsdVpHOTNVMmw2WlNJNklqQXhJbjAiLCJUcmFuc2FjdGlvbklkIjoiY0JLVElqNmowQmhHYm8yNWJXeDAifSwiT2JqZWN0aWZ5UGF5bG9hZCI6dHJ1ZSwiUmV0dXJuVXJsIjoiaHR0cHM6Ly9peWk2cnlsdmM4LmV4ZWN1dGUtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3BheWVyQXV0aFJldHVyblVybCJ9.m0aH2eWH8CMbTc8FiBmw98VWI7CsQJBvw0fXkZBpVe4',
      isv_userAgentHeader: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      isv_tokenVerificationContext:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJDd3NwZVFFMWZkWFFzY2RpV0dZMEVoQUFFRzZlR2paWjdYR1VzU0ljaEdmYWpvN3Y2cUV6UVpaUkkyVHRPNkhVSGdNWlNrNVBicWZ3azd3dTZtaDFvKzE2cnlJNE5oZEV4bVAzT2pFcmJGeXYva3BvMU5kd2QrZGIyT1gzaHlvbjAvTGdpVlNXOEt1aWo0ZUhHQzZiUFhqWkpnPT0iLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJ2U05uWjlqWHM0b3NXY1hHOVBCVUdDczVtWXhnSHJPd09GZnhJbjFnS2xwTC1GUTNpUnhodWRxenBEQV9VbXhJNmUxZFNXa0NlQXRUbEpwMU9Oa0Nyb0xVRW9EalJnVXY3MGxpQzBXQlBSVzB6aHdfRzU4Y2Vld3A0WjB1ZGhvYzVEdVJyVXVDbjJYNDB6UUJJQ2VWcHp2X0ZKdkMxYUk1TGxrUC1KNmFZSm15dVZ5LUpZcl94cldCY25Cd3l3bFlGX3FjdWZWZjgtRG1GaWpHVG9VeV9ONnZIX3JzSWtEOGJtRWdSa0JDdW8yLVRpcU13Vk13OGoxZ0JJMnFlZkxYdWFMaVZfdDBjRW1BUGJPZGhPVVpNdXFPR0I1dFJtZFI3T1A2cXpUbDQzaEdEd1ItdFVLLTNOU2dGM0c5MV9HS1g0OGxmTVgtUTMwNUlLdGFwTVBQQVEiLCJraWQiOiIwOEpxMDdLNzBEYkpGbEJMeEtoWXJKem5iUWM0dDBXcSJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnkiOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbS9taWNyb2Zvcm0vYnVuZGxlL3YyLjAvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCIsIkFNRVgiLCJNQUVTVFJPIiwiQ0FSVEVTQkFOQ0FJUkVTIiwiQ1VQIiwiSkNCIiwiRElORVJTQ0xVQiIsIkRJU0NPVkVSIl0sInRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTIuMC4wIn1dLCJpc3MiOiJGbGV4IEFQSSIsImV4cCI6MTcwOTAzODE2NSwiaWF0IjoxNzA5MDM3MjY1LCJqdGkiOiJxUzFyUzc5Nk15RklFck9aIn0.YYSK9P3zD4cYXT1fWd8fcMYCT4wQpYvNop1ht6E3F5g',
    },
  },
  paymentStatus: {},
  transactions: [],
  interfaceInteractions: [
    {
      type: {
        typeId: 'type',
        id: '4330e829-10b4-483d-8ae9-8b7265411e87',
      },
      fields: {
        specificationVersion: '2.1.0',
        authorizationAllowed: true,
        cardinalReferenceId: 'a65f93ee-e3a0-449a-ab1a-a6a22af1d491',
        acsUrl: 'https://0merchantacsstag.cardinalcommerce.com/MerchantACSWeb/creq.jsp',
        veresEnrolled: 'Y',
        authenticationRequired: true,
        directoryServerTransactionId: '4a788b96-0bbe-4d56-ba6e-7c0ccffa7704',
        paReq: 'eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiI4Njg4NjZlNy1kOTAwLTQ2M2UtYjFjNS1mMjdkN2Q5NzY0ODEiLCJhY3NUcmFuc0lEIjoiNWI2ZTFlMWYtYzcwOC00YzBiLTk1YjMtNDMxZDIzYzE1NTRkIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAxIn0',
        authenticationTransactionId: 'cBKTIj6j0BhGbo25bWx0',
      },
    },
  ],
};

export const paymentId = '26d5cd67-1db2-4907-b631-486b44fc0c3a';

export const customerUpdateFlexKeysPaymentObj = {
  id: '17004ac5-d72f-49a3-991b-b64aee0b9387',
  version: 2,
  versionModifiedAt: '2024-02-27T19:46:35.418Z',
  lastMessageSequenceNumber: 2,
  createdAt: '2024-02-27T19:46:26.433Z',
  lastModifiedAt: '2024-02-27T19:46:35.418Z',
  lastModifiedBy: {
    clientId: 'yTC2bJhPbEWRzVD6jKKhGzFt',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: '17004ac5-d72f-49a3-991b-b64aee0b9387',
    },
  },
  createdBy: {
    clientId: 'yTC2bJhPbEWRzVD6jKKhGzFt',
    isPlatformClient: false,
    customer: {
      typeId: 'customer',
      id: 'e7f4fd40-1f78-43d5-a537-665356aaf401',
    },
  },
  email: 'test@aswin.com',
  firstName: 'aswin',
  lastName: 's',
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  isEmailVerified: false,
  custom: {
    type: {
      typeId: 'type',
      id: 'ff71e435-8285-4eaa-b473-2e85ec32118e',
    },
    fields: {
      isv_tokenCaptureContextSignature: '',
    },
  },
  stores: [],
  authenticationMode: 'Password',
};

export const customerUpdateAddCardPaymentObject = {
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
  email: 'test@email.com',
  firstName: 'Aswin',
  lastName: 'S',
  addresses: [
    {
      id: 'Gu_fd8_a',
      firstName: 'Aswin',
      lastName: 's',
      streetName: '1295 Charleston Road',
      additionalStreetInfo: '5th lane',
      postalCode: '94043',
      city: 'Mountain View',
      region: 'CA',
      country: 'US',
      phone: '9999999999',
      email: 'aswin@test.com',
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
      isv_token:
        'eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJmajJKN1N0YWV4V1NNbXREeTFlZzBoQUFFQjZET1hCdm1IMUhINmZGblU5RWdMd3AyV280c2EwQ3dxRVRXWkY1NC8yOUtMWFVZYVJUK0NrOTNVSlQwTWxkbnZKcVFHZUVNZldiRVdBdDVtdHgwbkNEaEZZMzBnZy9LT2tFUGhteHE4b1EiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJyelJHbVlfQUVpSHRoWGozTG9oV2g5RDRMeUJ0OGpVZjQtUTVUV0MzVmU0c0hubUpuXzlNalpDb2RfbXBBV3daVGdCOUpJc1k2OXFaZkpKX29La0RZUHo0aFVvWW5kaUhiZjJ5Q3BzYmhwSWMxZlZkWWZxSUNGQVhDYUVjSVJ2Nk1MTXB0aVlhd1V2RGFjaW01dU56SUFKZFNVNEFwd0IxemJERkFOOGhSaDlwQzY0MWdsMGpCTmhIck9GOWZsazVOWlpId1J6ZkZuNm1TNzRWaWkxdVJHRWhqdGhRbjR5NkdJazBDaG1GQjlQU3ByUzFnZTlYS21TcEhsanh1WllWWG0tWVRWWW9jX3FldEZCT0VkMWRjZXZFMjg4RkwydDNHQUNvTUhyc3pYU2J0WVFCX3lXSDhpSlJGTm5rY1dnM2pGS0E3VGpFdXNGWVVKYnFZanAxTHciLCJraWQiOiIwOFhUQWRjaU1yd0Z4VEZIa0dUckpldlp4enZIZE1aVyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2NTMzNzY5NTksImlhdCI6MTY1MzM3NjA1OSwianRpIjoibnRNcmtZbldvQVQzV0VLdyJ9.fKn0V9uUWu90ov9UqnylxzEJPtxrLWipoEEr4-m1TLEWv7gz2wTnoDP-6xDRLtOFcklC1kVwDgpSWdX56xNlWbEZx4h7_tIow5twfQZ2KbWbApeH6O6plKSNMN2cC9hTY4McMrTn5cIpJ0AlSPXhaVmiE4Pn9JM44MQS4kBYDCsFLbtnVrKeZUR8E2yT5loYpd_v_R0uaZzkXgBmkPaf7KT9aVW_0RWBoD5xQ1LocwW806JqT0ds6qCv8jaKYWZJmd2blhKJ2mdNRAsWiYbvJinvx1U0IiUbaG3xjSj_laZjOaMRtBkaLiO36WuXFZwqHe-Y4vwW3HWQNSwc0OwwSQ',
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
  stores: [],
  authenticationMode: 'Password',
};

export const cart = {
  cartId: 'ef780f0c-b19b-4b5b-bd62-69ab726aac3d',
  merchantId: 'visa_isv_opencart_pmt_101',
};

export const captureId = 'd4d1ab02-141c-42f6-bbe6-13180920623d';
export const captureAmount = 45;

export const refundAmount = 12;
export const refundId = 'd4d1ab02-141c-42f6-bbe6-13180920623d';

export const authereversalId = '651f2dfe-c6c5-44f4-8321-c21b461175e5';
