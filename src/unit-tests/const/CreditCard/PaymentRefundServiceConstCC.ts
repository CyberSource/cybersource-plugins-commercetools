import creditCard from '../../JSON/creditCard.json';
const payment = {
  "id": "68ffd019-1192-4659-b4cf-cb5cedd51707",
  "version": 29,
  "versionModifiedAt": "2025-03-12T12:54:28.043Z",
  "lastMessageSequenceNumber": 5,
  "createdAt": "2025-03-12T12:53:39.539Z",
  "lastModifiedAt": "2025-03-12T12:54:28.043Z",
  "lastModifiedBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false
  },
  "createdBy": {
      "clientId": "xxSiPKLouCf3CRkqu20Byd0N",
      "isPlatformClient": false,
      "anonymousId": "e918d04f-e9cb-4b33-8d67-b3971f48eeb6"
  },
  "amountPlanned": {
      "type": "centPrecision",
      "currencyCode": "USD",
      "centAmount": 504580,
      "fractionDigits": 2
  },
  "paymentMethodInfo": {
      "paymentInterface": "cybersource",
      "method": "creditCard",
      "name": {
          "en": "Credit Card"
      }
  },
  "custom": {
      "type": {
          "typeId": "type",
          "id": "28bba466-fc03-4801-a823-6c7e6e3586b0"
      },
      "fields": {
          "isv_deviceFingerprintId": "5d0f9433-f32e-48dd-9316-76ac7a29f959",
          "isv_token": "eyJraWQiOiIwOGJ0c3dlWUE3SW1kalRpVnQwRU5YTld6dXBRdnFHMiIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJGbGV4LzA3IiwiZXhwIjoxNzQxNzg0OTI5LCJ0eXBlIjoibWYtMi4xLjAiLCJpYXQiOjE3NDE3ODQwMjksImp0aSI6IjFFMVNFV1ZCMklaRjgwNDk2M1pVNDBUVzZKUUpES0syUE9FMzQzSjQwNzZaR0tWRzdGT002N0QxODc2MUM1RkUiLCJjb250ZW50Ijp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJjYXJkIjp7ImV4cGlyYXRpb25ZZWFyIjp7InZhbHVlIjoiMjAzMCJ9LCJudW1iZXIiOnsiZGV0ZWN0ZWRDYXJkVHlwZXMiOlsiMDAxIl0sIm1hc2tlZFZhbHVlIjoiWFhYWFhYWFhYWFhYMTExMSIsImJpbiI6IjQxMTExMSJ9LCJzZWN1cml0eUNvZGUiOnt9LCJleHBpcmF0aW9uTW9udGgiOnsidmFsdWUiOiIwMSJ9fX19fQ.ltPkmbAiVXm6tnFOqz_SiGpYjm3z2Yw2Rt_aXfz8zPbDST0qF9Z4Hu1a_0f-EaEF3ReIVGsowLaHeJc81HX-H_0kv8c8XGDQ85yPPFBIBsbDS-2zxs4wWuKWx9tE7L5clOFPuPivvU1rz9Tva4tpbmnoCQ61KpO8IZeWBhV4oVfLAmMviFIhUf381D4Je1DgRgSdGrZinW8NujimFydY_KJXWQMjEX3X4lmhUfXcsZcMFnT5Mq1G1dSF1f2Y_9cR48_IGizIfX0wK8gHEhgfHR1QluIQ3N6Wvsm1vTS-zebdTWDUM7kd6nDGUaQHW1iupzgqoYKyNW_Rzktn-5FVVQ",
          "isv_saleEnabled": false,
          "isv_shippingMethod": "SINGLE",
          "isv_cardType": "001",
          "isv_customerIpAddress": "192.168.1.1",
          "isv_CVVResponse": "3",
          "isv_maskedPan": "411111XXXXXXXXXXXX1111",
          "isv_AVSResponse": "1",
          "isv_metadata": "{\"1\":\"testValue1\",\"2\":\"testValue2\"}",
          "isv_responseCode": "00",
          "isv_responseDateAndTime": "2025-03-12T12:53:53Z",
          "isv_tokenVerificationContext": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiIvSk9BcUE5aE5sMmp1TkNLOE1Dd1d4QUFFT3QrZ0ZYd1Jab2RVbyswc2hwSlVGQ2J6K1h0SGIxWXFPVll0SjM4cGxGbnhUSVNkb3EwLzR2T1ZNa0FYdks1SUtNUkJmd1FFVEE2RVQzV1RZV3lPSTg4OERib2hwei9VMmNvek1QNXBybjEiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJubXVaRk0xN0xvenJXMDFYWEN6cGVBdEd2SnN6TGVMXzNZNXAxdnF6enk0VDRLRVgyczdTMWNvd0J1MUlUd1RHMnN3aVI4LXJYMXFBb095VU5Dc19kV1N5ZERXYTlkSFh5c0tGbWFfa2JHZ1hpLVFfOGY2RGdZS2gzU240NnBSRmtzQ3ozb001TXlvbjZ3LUNCVkVsWkVZMGRBYWlkb01FSnd6Y3BLRThXMFBsUzZXZ3gtWUFFQW5XcU8wa09wVkgzZjVlVzFKZDVCLVV2LWpkVVBPdlJuN2o3V3BRTm51SFRRQ2ZaNVFMZXl0REpHaVZIelNIWVdxUnhYSmphVHVPdGVqMU0xa0RkOWRqc3lzTEtnLWFTRkxNTWd5X181cnpMSEZfWXZzOThsYmZOVjMzbUlabkpBdTNTQ2pmSHJWeXpYVUl2NnBTSlhSZlJ3UkttczFITXciLCJraWQiOiIwOGJ0c3dlWUE3SW1kalRpVnQwRU5YTld6dXBRdnFHMiJ9fSwiY3R4IjpbeyJkYXRhIjp7ImNsaWVudExpYnJhcnlJbnRlZ3JpdHkiOiJzaGEyNTYtM0ZxOVJxQlVDaW1DanRNNGNpZDlia0EyVEJWRUZpWkwvbzZjRzIzVnJHbz0iLCJjbGllbnRMaWJyYXJ5IjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20vbWljcm9mb3JtL2J1bmRsZS92Mi41LjIvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwiYWxsb3dlZENhcmROZXR3b3JrcyI6WyJWSVNBIiwiTUFTVEVSQ0FSRCJdLCJ0YXJnZXRPcmlnaW5zIjpbImh0dHBzOi8vbG9jYWxob3N0OjgwODAiLCJodHRwczovL2xvY2FsaG9zdDo4MDg0IiwiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4NSJdLCJtZk9yaWdpbiI6Imh0dHBzOi8vdGVzdGZsZXguY3liZXJzb3VyY2UuY29tIiwiYWxsb3dlZFBheW1lbnRUeXBlcyI6WyJDQVJEIl19LCJ0eXBlIjoibWYtMi4xLjAifV0sImlzcyI6IkZsZXggQVBJIiwiZXhwIjoxNzQxNzg0OTE5LCJpYXQiOjE3NDE3ODQwMTksImp0aSI6IjBxUWQxYUxYeGY3WHlyR0oifQ.Zw1GC6IuAEiu0QsVmvnvkpl4OOSqVCaGxNR8QRHA9dM",
          "isv_cardExpiryYear": "2030",
          "isv_merchantId": "",
          "isv_authorizationStatus": "AUTHORIZED",
          "isv_cardExpiryMonth": "01"
      }
  },
  "paymentStatus": {},
  "transactions": [
      {
          "id": "8e48a051-32c0-40ed-ab86-fd4e6eed8329",
          "timestamp": "2025-03-12T12:53:52.473Z",
          "type": "Authorization",
          "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 504580,
              "fractionDigits": 2
          },
          "interactionId": "7417840328766834604806",
          "state": "Success"
      },
      {
          "id": "5aed596a-874e-4c07-8f26-0c998150f53c",
          "timestamp": "2025-03-12T12:54:26.906Z",
          "type": "Charge",
          "amount": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 504580,
              "fractionDigits": 2
          },
          "interactionId": "7417840677426609004807",
          "state": "Success"
      }
  ],
  "interfaceInteractions": [],
  "anonymousId": "e918d04f-e9cb-4b33-8d67-b3971f48eeb6"
};

const captureId = creditCard.captureId;

const captureID = '63972375285265242';

const updateTransaction = {
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

const orderNo = '';

const orderNumber = '10';

export default {
  payment,
  captureId,
  captureID,
  updateTransaction,
  orderNo,
  orderNumber
}