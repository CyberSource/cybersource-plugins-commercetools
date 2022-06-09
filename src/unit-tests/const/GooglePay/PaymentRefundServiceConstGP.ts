
import googlePay from '../../JSON/googlePay.json';
export const payment = 
{
    "id":"33e68f3d-8143-4d07-ac13-2314c7039251",
    "version":8,
    "lastMessageSequenceNumber":6,
    "createdAt":"2021-12-21T10:19:02.132Z",
    "lastModifiedAt":"2021-12-21T12:43:55.994Z",
    "lastModifiedBy":
    {
        "clientId":"iFOAd29Lew5ADrpakIhQkz_N",
        "isPlatformClient":false
    },
    "createdBy":
    {
        "clientId":"iFOAd29Lew5ADrpakIhQkz_N",
        "isPlatformClient":false,
        "anonymousId":"ad175f34-543f-4a33-956a-39c30cd0aa61"
    },
    "amountPlanned":
    {
        "type":"centPrecision",
        "currencyCode":"USD",
        "centAmount":5980,
        "fractionDigits":2
    },
    "paymentMethodInfo":
    {
        "paymentInterface":"cybersource",
        "method":"googlePay",
        "name":
        {
            "en":"Google Pay"
        }},
        "custom":
        {
            "type":
            {
                "typeId":"type",
                "id":"87b9d9db-74a3-45d7-8e60-dde669866808"
            },
            "fields":
            {
                "isv_deviceFingerprintId":"8a22fb00-dc63-496b-b0de-9f1d1fd36a50",
                "isv_cardExpiryYear":"2027",
                "isv_token":"eyJzaWduYXR1cmUiOiJNRVFDSUQ0RmI3YTJNUndKMjJGL3BCRVBZaFA2ZHdtN2R6VWt4bVQ2MGVKMEpPOHRBaUJyOFNvZVd5TTRxTmt5N3ltbDZOektqMjlFSzNoZlk2SGs4bURTbm1YRmF3XHUwMDNkXHUwMDNkIiwicHJvdG9jb2xWZXJzaW9uIjoiRUN2MSIsInNpZ25lZE1lc3NhZ2UiOiJ7XCJlbmNyeXB0ZWRNZXNzYWdlXCI6XCJYNFluRmpqeFMzRk92Z2NxYkh5OGFpdC93N2UvMmZJcG5kWlVXZ3pmR2FiUE9kbHhKRWFKK3JnL2xCWWU4dVh6RkZEb2loQWU1bnJlSFN0RUVVR2dBcEVZMW1uWkxmWkplZTB0WXNLOWVZeTVBYVkvNEdQR2s3ZVZ3TlllTWhCY01ZeWUwMjN5bUZOL1VzMmtNeUFqRFlGNkFPQkRRK0tUNTQrbzMwNGptdFkzdzV0R1NYOWtPZnFuU3V0aFFYMFlXVVVHUU0wSmdQL2duMW5WSDFJeFNyTmpmbHFtY1k5MWlWSk5ZTXB1a1E1WmFieEhlaTQvcDFYVXppNUcyVEZSN1RhaEM3UTJGRWpqeGs2d3o3cWJkMUhBNlg0RUE3TnEzMjFHTm1LaFAyQVZPVmtqRy9ZVW5VSWNJQlNMb3BmZVhPYWxMVFVsdnR2ZDN1QkUzTDhRcTFyVHIxSnE2UCtVaFJSY1doRXlsVVNvbkxURGlqM0cxVFNCSTJ1UVZUd2U4RXVjbThaNDYzZnJUOVNpQjlCc0NGeVZzM25mNC9aa0pIckNmemVvSFVzdTVkYklrNFMzNDRqRG1iZVhSM3hVSjVlNVwiLFwiZXBoZW1lcmFsUHVibGljS2V5XCI6XCJCQ3hCRk5LV3NBZUwyQ0NGR2hVRWptOFBVbmxVZWdmYlFYNWRQdy9KSGIvUGVPL3QxZ3FuYlpoYlRrU2tlOE93akU5UUwraFBiNzNEN0llQlNKMDNkN0FcXHUwMDNkXCIsXCJ0YWdcIjpcIkYvMzJpb2o4blNtdU5ZU3JIYUdTeEkzYWR5a3pSSVNQUmMvQVlHSldoREVcXHUwMDNkXCJ9In0=",
                "isv_customerIpAddress":"106.202.150.94",
                "isv_maskedPan":"411111XXXXXX1111",
                "isv_cardExpiryMonth":"12",
                "isv_userAgentHeader":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
                "isv_acceptHeader":"*/*",
                "isv_cardType":"001"
            }
        },
        "paymentStatus":{},
        "transactions":
        [
            {
                "id":"35d5cf3c-fe39-4940-87b0-64e3fe849edb",
                "timestamp":"2021-12-21T10:19:06.683Z",
                "type":"Authorization",
                "amount":
                {
                    "type":"centPrecision",
                    "currencyCode":"USD",
                    "centAmount":5980,
                    "fractionDigits":2
                },
                "interactionId":"6400819464486462703955",
                "state":"Success"
            },
            {
                "id":"2cf6a334-5091-422a-8fa8-87724aa53e86",
                "timestamp":"2021-12-21T12:43:54.748Z",
                "type":"Charge",
                "amount":
                {
                    "type":"centPrecision",
                    "currencyCode":"USD",
                    "centAmount":5980,
                    "fractionDigits":2
                },
                "interactionId":googlePay.captureId,
                "state":"Success"
            }
        ],
        "interfaceInteractions":[],
    }

export const captureId  = googlePay.captureId;

export const captureID = '64009063539269775034'

export const  updateTransaction = {
    id: '05d19a9b-fcb7-4c0a-bef7-5ddf0e3afc8e',
    timestamp: '2021-12-22T05:34:24.008Z',
    type: 'Refund',
    amount: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 100,
      fractionDigits: 2
    },
    state: 'Initial'
  }

  export const orderNo  = null;