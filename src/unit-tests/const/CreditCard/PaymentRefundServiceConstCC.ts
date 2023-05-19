import creditCard from '../../JSON/creditCard.json';
export const payment = {
  id: '56d9909e-7c0e-4315-b1ef-5788f7b1d33e',
  version: 16,
  lastMessageSequenceNumber: 6,
  createdAt: '2021-10-29T10:53:36.036Z',
  lastModifiedAt: '2021-10-29T10:54:32.797Z',
  lastModifiedBy: { clientId: '4OdEsQlt0ZNkkwpineHHUy3h', isPlatformClient: false },
  createdBy: {
    clientId: '4OdEsQlt0ZNkkwpineHHUy3h',
    isPlatformClient: false,
    anonymousId: '85929ae4-3f31-448d-9e50-8bab742866b1',
  },
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 6970,
    fractionDigits: 2,
  },
  paymentMethodInfo: { paymentInterface: 'cybersource', method: 'creditCard' },
  custom: {
    type: { typeId: 'type', id: '28701886-4e26-4cab-924e-9b0da3829f88' },
    fields: {
      isv_deviceFingerprintId: '1ccd2043-4c08-4419-a629-bc32dc5f91eb',
      isv_cardExpiryYear: '2030',
      isv_token:'eyJraWQiOiIwODRsbVRWcGlGRlUwYkxHenVzS2Q2RDJyc2tXbjhnciIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjp7ImV4cGlyYXRpb25ZZWFyIjoiMjAzMCIsIm51bWJlciI6IjQxMTExMVhYWFhYWDExMTEiLCJleHBpcmF0aW9uTW9udGgiOiIwMSIsInR5cGUiOiIwMDEifSwiaXNzIjoiRmxleC8wOCIsImV4cCI6MTYzNTUwNTcyNywidHlwZSI6Im1mLTAuMTEuMCIsImlhdCI6MTYzNTUwNDgyNywianRpIjoiMUUyUUdVVVpYREZJT1E0VE5CSk9XWEszWDRMVDFISVdFVDVETjlRTkFGQk03QjBMMTk2NzYxN0JENjNGM0RGQSIsImNvbnRlbnQiOnsicGF5bWVudEluZm9ybWF0aW9uIjp7ImNhcmQiOnsiZXhwaXJhdGlvblllYXIiOnsidmFsdWUiOiIyMDMwIn0sIm51bWJlciI6eyJtYXNrZWRWYWx1ZSI6IlhYWFhYWFhYWFhYWDExMTEiLCJiaW4iOiI0MTExMTEifSwic2VjdXJpdHlDb2RlIjp7fSwiZXhwaXJhdGlvbk1vbnRoIjp7InZhbHVlIjoiMDEifSwidHlwZSI6eyJ2YWx1ZSI6IjAwMSJ9fX19fQ.ibsY5xb6S-shI8f5cFrNPAXj6Jw8Po55lpkuNp7NX8rdtUogCpwPiHBJy9IKX-nTadQd51cYzgvjihCGzVDxGFYXD6w5VKWrJaxhOjn6EGNYYZrLUNuY0lRYIG2fL6db37geMf3SBEE8wkO2N5b1IjVhtiHZ_ezekqXnUnYzOF0GKzJnNH_GMH8pAwePzYL_enE0qkm_z1CYCnHD1xszfafkcf_m_YOz9i_Q6ROfaYvcoTD9QjTQ5ugU-kped4eFVK-x1HAnjxJI5RWrBzt_imhUhLJviwW7A1rsqrwx_mDZsFTJIYYEq4WdU-VPZIsCW_JTE7naT6KTj1edn_98Wg',
      isv_customerIpAddress: '106.202.150.94',
      isv_maskedPan: '411111XXXXXX1111',
      isv_cardExpiryMonth: '01',
      isv_acceptHeader: '*/*',
      isv_cardType: '001',
      isv_userAgentHeader: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      isv_tokenVerificationContext:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJ5SnpJaGIzYkdOUzRQeEFlZjVHc2JCQUFFUGo4QTVwWlRoS3hJTjBSQXpBWDl3SitzRkdrY3hzbGhCTG8wa1NxVVF3ZFdYV3FMYTR3TXI1RnBQMVJPZjV4dGExajVOYkVBR2JnL2hoNHM5djFuQzR1RmRXdFpkZ2Q0OFIxNE1IdXZlVnciLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJwME1ZdW0yVk1xUGJwQ2ZaVVFVOXBRTE9hSEV4M2NDWDFWMjRaWVRtMGtISzczNXJxMEE2SkU4Y253R3NNbnd1cWFUQ2VBSzZVZ2dOOHJOaTZUVUgxZEl6UlFvdURrYXcwZjJseXJMa0I3ejhiUnNxMG4tU0hGT3ZDRDBBTW5JUGt4aV9OZnBOUUtGMGFLZml0TldVTmE4d0VGWWNhX0QyWm03UDZNNGpWNmRmX25NNU9iblI0Y09NT2dQUDc4UW1SeHBRTmpvX3pORFJXb1c5ZVhlOFpwY2dISm4zZTZNY2RvdVh3MHRSTDRUaXd0d1daN1V5RjJxczgwRFZJalI1ZTB3NnNmTmlWM0pmUFVjUXBZa0Jsdlg2WTlFOGdqQ1cySEtoRHBCSFhqM2U2MjhkRHFLYjJUbXJnSFR3dFoyOUpYTjhmR3kyRDY5OG8wVHdDa2MxTXciLCJraWQiOiIwODRsbVRWcGlGRlUwYkxHenVzS2Q2RDJyc2tXbjhnciJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MzU1MDU3MTUsImlhdCI6MTYzNTUwNDgxNSwianRpIjoiTkRPeXpkRThjN2NwNWh3ZCJ9.qHqVks9k-s0MRC87Ki9iUq30tBqOhDeo8LAL9rzIKKc',
    },
  },
  paymentStatus: {},
  transactions: [
    {
      id: '98c82dbc-4303-49d2-869b-2447e7e731ee',
      type: 'Authorization',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 6970,
        fractionDigits: 2,
      },
      interactionId: '6355048327036074204004',
      state: 'Success',
    },
    {
      id: '548f0235-135f-48d3-b791-ff5f92fc387c',
      type: 'Charge',
      amount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 6970,
        fractionDigits: 2,
      },
      interactionId: '6397237528526524203955',
      state: 'Success',
    },
  ],
  interfaceInteractions: [],
};

export const captureId = creditCard.captureId;

export const captureID = '63972375285265242';

export const updateTransaction = {
  id: 'c812578f-493c-4535-970e-31c210e74420',
  timestamp: '2021-12-07T09:12:49.763Z',
  type: 'Refund',
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 100,
    fractionDigits: 2,
  },
  state: 'Initial',
};

export const orderNo = null;

export const orderNumber = '10';
