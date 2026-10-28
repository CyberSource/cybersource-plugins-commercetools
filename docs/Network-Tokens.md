# Network token refresh

Network token refresh keeps a customer's saved cards up to date. When a card's network token changes in Visa Acceptance Solutions (for example, the card is reissued with a new expiry date, or closed), the extension updates or removes the matching saved card in Commercetools.

If network tokenisation is enabled for your merchant account, you can call this endpoint ({baseUrl}/refreshSavedTokens) to update the card so customers can always see their latest card details. You can control this functionality using an environment variable, for example ENABLE_NETWORK_TOKEN_REFRESH; when the variable is set to true, call the endpoint to update the card details, and when it is false, skip the endpoint call.

### Step 1: Refresh saved cards when the checkout page loads

When a logged-in customer opens the checkout page, call the refresh endpoint before showing their saved cards.

```text
POST {baseUrl}/refreshSavedTokens
Content-Type: application/json
Authorization: Bearer <header value>

{
  "customerId": "<Commercetools customer ID>"
}
```

- `{baseUrl}` is the URL where the extension is hosted.
- `<header value>` is the value returned by `GET {baseUrl}/generateHeader`, the same header used for `{baseUrl}/captureContext`.
- Skip this call for guest customers, because they have no saved cards.
- Call it once per checkout session to avoid repeated calls on page reloads.

Example response:

```json
{
  "success": true,
  "processedCount": 3,
  "removedCount": 1,
  "updatedCount": 0,
  "errorMessage": "",
  "successMessage": "Network token refresh completed. Processed 3 tokens, removed 1 invalid tokens, 2 tokens remain valid."
}
```

If `customerId` is missing, the endpoint returns HTTP `400` with an `errorMessage`.

### Step 2: Show the customer's saved cards

After the refresh call completes, read the customer's saved cards from the `isv_tokens` custom field on the Commercetools customer. The list now contains the latest card details, and invalid cards have been removed.
