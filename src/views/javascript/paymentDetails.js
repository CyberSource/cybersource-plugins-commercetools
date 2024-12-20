import { amountConversion, roundOff, getPaymentId, formatCurrency, createTableRow, createAndSetAttributes, validatePaymentId, validateAmountValue } from './utils.js';

if (window.location.pathname.includes('paymentDetails')) {
  document.addEventListener('DOMContentLoaded', async function () {
    let authPresent = false;
    let capturePresent = false;
    let authReversalPresent = false;
    let refundPresent = false;
    const paymentsData = await fetchPaymentsInfo();
    const payments = paymentsData?.payments;
    const cart = paymentsData?.cart;
    const id = validatePaymentId(paymentsData?.id);
    const locale = paymentsData.locale;
    const orderNo = paymentsData.orderNo;
    let contentDiv = document.getElementById('message');
    if (paymentsData?.errorMessage) {
      while (contentDiv.firstChild) {
        contentDiv.removeChild(contentDiv.firstChild);
      }
      appendErrorMessage(contentDiv, paymentsData?.errorMessage);
    }
    if (paymentsData?.successMessage) {
      while (contentDiv.firstChild) {
        contentDiv.removeChild(contentDiv.firstChild);
      }
      appendSuccessMessage(contentDiv, paymentsData?.successMessage);
    }
    if (paymentsData && paymentsData?.payments && 0 < Object.keys(paymentsData.payments)?.length) {
      var fractionDigits = payments?.amountPlanned?.fractionDigits;
      if (cart && 0 < Object.keys(cart).length) {
        const discountObject = verifyDiscountPresent(cart);
        generateOrderItemsTable(cart, discountObject, locale, fractionDigits);
      } else {
        const removeElements = (ids) => {
          ids.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
              element.remove();
            }
          });
        };
        removeElements(['productDetails']);
      }
      const paymentDetailsTableBody = document.getElementById('paymentDetailsTable').getElementsByTagName('tbody')[0];

      if (payments?.paymentMethodInfo && paymentDetailsTableBody) {
        createTableRow(paymentDetailsTableBody, [
          payments.paymentMethodInfo?.name.en || '',
          payments.paymentMethodInfo?.method || '',
          payments.paymentMethodInfo?.paymentInterface || '',
          `${payments?.amountPlanned?.currencyCode} ${amountConversion(payments.amountPlanned.centAmount, fractionDigits)}`,
        ]);
      }

      const paymentTransactionBody = document.getElementById('paymentTransactions').getElementsByTagName('tbody')[0];
      if (payments?.transactions && 0 < payments?.transactions.length && paymentTransactionBody) {
        payments.transactions.forEach((transaction) => {
          createTableRow(paymentTransactionBody, [transaction.type || '', transaction.state || '', `${transaction.amount.currencyCode} ` + `${amountConversion(transaction.amount.centAmount, fractionDigits)}` || '', transaction.interactionId || 0, transaction.id || '']);
        });
      }

      const transactions = payments.transactions;
      transactions.forEach((element) => {
        if ('Authorization' === element.type && 'Success' === element.state) {
          authPresent = true;
        }
        if ('Charge' === element.type && 'Success' === element.state) {
          capturePresent = true;
        }
        if ('Refund' === element.type && 'Success' === element.state) {
          refundPresent = true;
        }
        if ('CancelAuthorization' === element.type && 'Success' === element.state) {
          authReversalPresent = true;
        }
      });
      const buttonsDiv = document.createElement('div');
      buttonsDiv.classList.add('div-padding');
      buttonsDiv.id = 'buttonsDiv';

      const authorizedAmount = validateAmountValue(paymentsData?.authorizedAmount);
      const captureAmount = validateAmountValue(paymentsData?.captureAmount);
      if (authPresent && !authReversalPresent && (!refundPresent || (refundPresent && authorizedAmount)) && ((capturePresent && authorizedAmount) || (!capturePresent && authorizedAmount))) {
        const captureMsgDiv = document.createElement('div');
        captureMsgDiv.classList.add('div-padding');
        captureMsgDiv.textContent = `You can capture amount ${authorizedAmount} `;
        const partialCaptureForm = document.createElement('form');
        partialCaptureForm.action = '/capture';
        partialCaptureForm.classList.add('div-padding');
        partialCaptureForm.id = 'partialCaptureForm';
        renderPartialCaptureForm(partialCaptureForm, encodeURIComponent(id));
        buttonsDiv.appendChild(captureMsgDiv);
        buttonsDiv.appendChild(partialCaptureForm);
      }
      if (authPresent && !capturePresent && !authReversalPresent && !refundPresent) {
        const authButton = document.createElement('a');
        authButton.classList.add('button');
        authButton.id = 'auth';
        authButton.href = `/authReversal?id=${encodeURIComponent(id)}`;
        authButton.role = 'button';
        authButton.textContent = 'Reverse';

        buttonsDiv.appendChild(authButton);
      }
      if ((capturePresent && !authReversalPresent && refundPresent && captureAmount) || (!refundPresent && capturePresent)) {
        const refundMsgDiv = document.createElement('div');
        refundMsgDiv.classList.add('div-padding');
        refundMsgDiv.textContent = `You can refund amount ${captureAmount}`;

        const refundForm = document.createElement('form');
        refundForm.action = '/refund';
        refundForm.classList.add('div-padding');
        refundForm.id = 'refundForm';
        renderRefundForm(refundForm, encodeURIComponent(id));
        buttonsDiv.appendChild(refundMsgDiv);
        buttonsDiv.appendChild(refundForm);
      }
      const captureMsg = document.createElement('div');
      captureMsg.id = 'captureMsg';
      captureMsg.textContent = paymentsData?.captureErrorMessage || '';
      const refundMsg = document.createElement('div');
      refundMsg.id = 'refundMsg';
      refundMsg.textContent = paymentsData?.refundErrorMessage || '';
      buttonsDiv.appendChild(captureMsg);
      buttonsDiv.appendChild(refundMsg);
      document.getElementById('paymentTransactions').appendChild(buttonsDiv);
      if (payments?.custom?.fields?.isv_maskedPan && payments?.custom?.fields?.isv_cardType && payments?.custom?.fields?.isv_cardExpiryMonth && payments?.custom?.fields?.isv_cardExpiryYear) {
        renderCardDetails(payments.custom.fields);
      }
      renderCustomFields(payments, orderNo);

      let captureButton = document.getElementById('captureButton');
      let refundButton = document.getElementById('refundButton');
      let captureAmountValue = document.getElementById('captureAmount');
      let refundAmount = document.getElementById('refundAmount');
      let auth = document.getElementById('auth');
      if (captureAmountValue) {
        captureAmountValue.addEventListener('input', function () {
          validateAmountWithRegex('captureAmount', 'captureButton', 'captureMsg');
        });
      }
      if (refundAmount) {
        refundAmount.addEventListener('input', function () {
          validateAmountWithRegex('refundAmount', 'refundButton', 'refundMsg');
        });
      }
      if (captureButton) {
        captureButton.addEventListener('click', function () {
          validateAmount('captureAmount');
        });
      }
      if (refundButton) {
        refundButton.addEventListener('click', function () {
          validateAmount('refundAmount');
        });
      }
      if (auth) {
        auth.addEventListener('click', showLoadingDiv);
      }
    }
  });
}

function appendErrorMessage(contentDiv, errorMessage) {
  const fragment = document.createDocumentFragment();
  const errorIcon = document.createElement('em');
  errorIcon.className = 'mark error';
  fragment.appendChild(errorIcon);
  const errorMessageElement = document.createTextNode(errorMessage || '');
  fragment.appendChild(errorMessageElement);
  contentDiv.appendChild(fragment);
  contentDiv.className = 'alert alert-error alert-dismissible';
  contentDiv.id = 'paymentErrorMessage';
}

function appendSuccessMessage(contentDiv, successMessage) {
  const fragment = document.createDocumentFragment();
  const successIcon = document.createElement('em');
  successIcon.className = 'mark success';
  fragment.appendChild(successIcon);
  const successMessageElement = document.createTextNode(successMessage || '');
  fragment.appendChild(successMessageElement);
  contentDiv.appendChild(fragment);
  contentDiv.className = 'alert alert-success alert-dismissible';
  contentDiv.id = 'paymentSuccessMessage';
}

/**
 * Fetches payment information based on the payment ID.
 * @returns {Promise<Object|null>} A promise that resolves to the payment information if successful, otherwise null.
 */
async function fetchPaymentsInfo() {
  const loadingIndicator = document.getElementById('loading');
  const paymentId = validatePaymentId(getPaymentId());
  if (paymentId) {
    try {
      loadingIndicator.style.display = 'flex';
      const response = await fetch(`/paymentData?id=${encodeURIComponent(paymentId)}`, { method: 'GET' });
      const data = await response.text();
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch (error) {
      console.error('Error in fetching Payment details:', error);
      return null;
    } finally {
      loadingIndicator.style.display = 'none';
    }
  } else {
    appendErrorMessage(contentDiv, 'Invalid Payment Id');
  }
}

/**
 * Verifies if different types of discounts are present in the cart.
 * @param {Object} cart - The cart object containing line items, custom line items, shipping information, and total price discount.
 * @returns {Object} An object indicating whether cart discount, custom line item discount, shipping discount, and total price discount are present.
 */
function verifyDiscountPresent(cart) {
  /**
   * @typedef {Object} DiscountObject
   * @property {boolean} cartDiscount - Indicates if a cart discount is present.
   * @property {boolean} customLineItemDiscount - Indicates if a custom line item discount is present.
   * @property {boolean} shippingDiscount - Indicates if a shipping discount is present.
   * @property {boolean} totalPriceDiscount - Indicates if a total price discount is present.
   */

  /** @type {DiscountObject} */

  const discountObject = {
    cartDiscount: false,
    customLineItemDiscount: false,
    shippingDiscount: false,
    totalPriceDiscount: false,
  };
  cart.lineItems.forEach((lineItems) => {
    if (0 < lineItems?.discountedPricePerQuantity?.length && !discountObject.cartDiscount) {
      discountObject.cartDiscount = true;
    }
  });
  if (0 < cart?.customLineItems?.length) {
    cart.customLineItems.forEach((customLineItem) => {
      if (0 < customLineItem.discountedPricePerQuantity?.length && !discountObject.customLineItemDiscount) {
        discountObject.customLineItemDiscount = true;
      }
    });
  }
  if ((cart?.shippingInfo && cart.shippingInfo?.discountedPrice) || ('Multiple' === cart?.shippingMode && 0 < cart.shipping.length && cart.shipping[0].shippingInfo.discountedPrice)) {
    discountObject.shippingDiscount = true;
  }
  if (cart?.discountOnTotalPrice && cart.discountOnTotalPrice?.discountedAmount) {
    discountObject.totalPriceDiscount = true;
  }
  return discountObject;
}

/**
 * Creates a table row with a label and a value.
 * @param {string} label - The label for the row.
 * @param {string} value - The value for the row.
 * @returns {HTMLTableRowElement} The created table row element.
 */
function createRow(label, value) {
  if (label && value) {
    const row = document.createElement('tr');
    const labelCell = document.createElement('td');
    const labelBold = document.createElement('b');
    labelBold.textContent = label;
    labelCell.appendChild(labelBold);
    row.appendChild(labelCell);
    const valueCell = document.createElement('td');
    valueCell.textContent = value;
    row.appendChild(valueCell);
    return row;
  }
}

/**
 * Creates a custom fields table based on payment data.
 * @param {object} payments - The payment data containing custom fields.
 * @param {string} orderNo - The order number.
 * @returns {string} The HTML string representing the custom fields table.
 */
function createCustomFieldsTable(payments, orderNo) {
  if (payments?.custom?.fields) {
    const fields = payments.custom.fields;
    let tableHTML = "<table class='paymentTableBelow'>";
    if (fields.isv_token) {
      tableHTML += createRow('Token', fields.isv_token).outerHTML;
      if (fields.isv_tokenVerificationContext) {
        tableHTML += createRow('Token Verification Context', fields.isv_tokenVerificationContext).outerHTML;
      }
    } else if ('eCheck' === payments.paymentMethodInfo.method) {
      if (fields.isv_accountNumber) {
        tableHTML += createRow('Account Number', fields.isv_accountNumber).outerHTML;
      }
      if (fields.isv_routingNumber) {
        tableHTML += createRow('Routing Number', fields.isv_routingNumber).outerHTML;
      }
      if (fields.isv_accountType) {
        const accountType = fields.isv_accountType === 'C' ? 'Checking' : fields.isv_accountType === 'S' ? 'Savings' : fields.isv_accountType === 'X' ? 'Corporate Checking' : '';
        tableHTML += createRow('Account Type', accountType).outerHTML;
      }
    } else if (fields.isv_transientToken) {
      tableHTML += createRow('Transient Token', fields.isv_transientToken).outerHTML;
    } else {
      if (fields.isv_tokenAlias) {
        tableHTML += createRow('Token Alias', fields.isv_tokenAlias).outerHTML;
      }
      if (fields.isv_savedToken) {
        tableHTML += createRow('Saved Token', fields.isv_savedToken).outerHTML;
      }
    }
    if (fields?.isv_responseDateAndTime) {
      tableHTML += createRow('Response Date and Time', fields.isv_responseDateAndTime).outerHTML;
    }
    if (fields?.isv_authorizationStatus) {
      tableHTML += createRow('Initial Payment Status', fields.isv_authorizationStatus).outerHTML;
    }
    if (fields?.isv_authorizationReasonCode) {
      tableHTML += createRow('Authorization Reason Code', fields.isv_authorizationReasonCode).outerHTML;
    }
    if (fields?.isv_ECI) {
      tableHTML += createRow('Ecommerce Indicator', fields.isv_ECI).outerHTML;
    }
    if (fields?.isv_AVSResponse) {
      tableHTML += createRow('AVS Response', fields.isv_AVSResponse).outerHTML;
    }
    if (fields?.isv_CVVResponse) {
      tableHTML += createRow('CVV Response', fields.isv_CVVResponse).outerHTML;
    }
    if (fields?.isv_responseCode) {
      tableHTML += createRow('Response Code', fields.isv_responseCode).outerHTML;
    }
    if (orderNo) {
      tableHTML += createRow('Reconciliation Id', orderNo).outerHTML;
    }
    tableHTML += '</table>';
    return tableHTML;
  }
}

/**
 * Renders custom payment fields in the specified HTML element.
 * @param {object} payments - The payment data containing custom fields.
 * @param {string} orderNo - The order Number.
 */
function renderCustomFields(payments, orderNo) {
  const customFieldsDiv = document.getElementById('paymentCustomFields');
  if (payments?.custom?.fields && customFieldsDiv) {
    while (customFieldsDiv.firstChild) {
      customFieldsDiv.removeChild(customFieldsDiv.firstChild)
    }
    const customFieldsHeader = document.createElement('h2');
    customFieldsHeader.textContent = 'Payment Custom Fields';
    customFieldsDiv.appendChild(customFieldsHeader);
    const customFieldsTable = createCustomFieldsTable(payments, orderNo);
    const parser = new DOMParser();
    const customeFieldsTableContainer = parser.parseFromString(customFieldsTable, 'text/html').body;
    while (customeFieldsTableContainer.firstChild) {
      customFieldsDiv.appendChild(customeFieldsTableContainer.firstChild);
    }
  }
}
/**
 * Renders card details in the specified HTML element.
 * @param {object} cardDetails - The card details to render.
 */

function renderCardDetails(cardDetails) {
  const paymentCardDetails = document.getElementById('paymentCardDetails');
  if (paymentCardDetails) {
    paymentCardDetails.classList.add('panel', 'card4', 'padding16');
    while (paymentCardDetails.firstChild) {
      paymentCardDetails.removeChild(paymentCardDetails.firstChild);
    }
    const heading = document.createElement('h2');
    heading.textContent = 'Payment Card Details';
    paymentCardDetails.appendChild(heading);
    const hr = document.createElement('hr');

    paymentCardDetails.appendChild(hr);
    const table = document.createElement('table');
    table.className = 'paymentTableAbove';
    const headerRow = document.createElement('tr');

    const thMaskedPan = document.createElement('th');
    thMaskedPan.textContent = 'Masked Card Number';
    headerRow.appendChild(thMaskedPan);

    if (cardDetails?.isv_cardType) {
      const thCardType = document.createElement('th');
      thCardType.textContent = 'Card Type';
      headerRow.appendChild(thCardType);
    }

    if (cardDetails?.isv_cardExpiryMonth) {
      const thCardExpiryMonth = document.createElement('th');
      thCardExpiryMonth.textContent = 'Card Expiry Month';
      headerRow.appendChild(thCardExpiryMonth);
    }

    if (cardDetails?.isv_cardExpiryYear) {
      const thCardExpiryYear = document.createElement('th');
      thCardExpiryYear.textContent = 'Card Expiry Year';
      headerRow.appendChild(thCardExpiryYear);
    }

    table.appendChild(headerRow);

    const dataRow = document.createElement('tr');

    const tdMaskedPan = document.createElement('td');
    tdMaskedPan.textContent = cardDetails.isv_maskedPan;
    dataRow.appendChild(tdMaskedPan);

    if (cardDetails?.isv_cardType) {
      const tdCardType = document.createElement('td');
      tdCardType.textContent = cardDetails.isv_cardType;
      dataRow.appendChild(tdCardType);
    }

    if (cardDetails?.isv_cardExpiryMonth) {
      const tdCardExpiryMonth = document.createElement('td');
      tdCardExpiryMonth.textContent = cardDetails.isv_cardExpiryMonth;
      dataRow.appendChild(tdCardExpiryMonth);
    }

    if (cardDetails?.isv_cardExpiryYear) {
      const tdCardExpiryYear = document.createElement('td');
      tdCardExpiryYear.textContent = cardDetails.isv_cardExpiryYear;
      dataRow.appendChild(tdCardExpiryYear);
    }

    table.appendChild(dataRow);
    paymentCardDetails.appendChild(table);
  }
}

function renderPartialCaptureForm(partialCaptureForm, id) {
  if (partialCaptureForm) {
    partialCaptureForm.textContent = '';
    const captureIdInput = createAndSetAttributes('input', {
      type: 'hidden',
      name: 'captureId',
      id: 'captureId',
      value: id
    });
    partialCaptureForm.appendChild(captureIdInput);
    const captureAmountLabel = document.createTextNode('Capture amount: ');
    partialCaptureForm.appendChild(captureAmountLabel);
    const captureAmountInput = createAndSetAttributes('input', {
      type: 'text',
      name: 'captureAmount',
      id: 'captureAmount',
      size: '6',
      value: '',
      autocomplete: 'off',
      required: true
    });
    partialCaptureForm.appendChild(captureAmountInput);
    const captureButton = createAndSetAttributes('button', {
      type: 'submit',
      id: 'captureButton',
      className: 'button'
    }, 'Capture');
    partialCaptureForm.appendChild(captureButton);
  }
}

function renderRefundForm(refundForm, id) {
  if (refundForm) {
    refundForm.textContent = '';
    const refundIdInput = createAndSetAttributes('input', {
      type: 'hidden',
      name: 'refundId',
      id: 'refundId',
      value: id
    });
    refundForm.appendChild(refundIdInput);
    const refundAmountText = document.createTextNode('Refund amount: ');
    refundForm.appendChild(refundAmountText);
    const refundAmountInput = createAndSetAttributes('input', {
      type: 'text',
      name: 'refundAmount',
      id: 'refundAmount',
      size: '6',
      value: '',
      autocomplete: 'off',
      required: true
    });
    refundForm.appendChild(refundAmountInput);
    const refundButton = createAndSetAttributes('button', {
      type: 'submit',
      id: 'refundButton',
      className: 'button'
    }, 'Refund');
    refundForm.appendChild(refundButton);
  }
}

/**
 * Validates the amount entered in the input field.
 * @param {string} inputId - The ID of the input field containing the amount.
 * @returns {boolean} - Indicates whether the amount is valid or not.
 */
function validateAmount(inputId) {
  var amountElement = document.getElementById(inputId);
  if (amountElement) {
    var amountValue = amountElement.value;
    if ('string' === typeof amountValue && 0 !== amountValue.length) {
      document.getElementById('loading').style.display = 'flex';
      return true;
    } else {
      document.getElementById('loading').style.display = 'none';
      return false;
    }
  }
}

/**
 * Shows the loading indicator.
 */
function showLoadingDiv() {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) {
    loadingDiv.style.display = 'flex';
  }
}
/**
 * Generates the order items table based on the cart data and discount information.
 * @param {Object} cart - The cart object containing order details.
 * @param {Object} discountObject - The discount object indicating discount types.
 * @param {string} locale - The locale used for formatting.
 * @param {number} fractionDigits - The number of fraction digits to display.
 */
function generateOrderItemsTable(cart, discountObject, locale, fractionDigits) {
  const orderItemsTable = document.getElementById('orderItemsTable');
  if (cart && orderItemsTable) {
    const orderItemsTableBody = orderItemsTable.getElementsByTagName('tbody')[0];
    if (!orderItemsTableBody) {
      return;
    }
    if (discountObject.customLineItemDiscount || discountObject.cartDiscount || discountObject.shippingDiscount || discountObject.totalPriceDiscount) {
      const tableHead = document.querySelector('#orderItemsTable thead');
      const discountAmountTh = document.createElement('th');
      discountAmountTh.textContent = 'Discount Amount';
      const totalHeader = tableHead.querySelector('th:last-child');
      const parent = totalHeader.parentNode;
      parent.insertBefore(discountAmountTh, totalHeader);
    }
    generateLineItems(cart.lineItems, orderItemsTableBody, discountObject, locale, fractionDigits);
    generateCustomLineItems(cart.customLineItems, orderItemsTableBody, discountObject, locale, fractionDigits);
    generateShipping(cart, orderItemsTableBody, discountObject, locale, fractionDigits);
    const totalPriceDiscountedAmount = cart.discountOnTotalPrice ? cart.discountOnTotalPrice.discountedAmount.centAmount : 0;
    const totalDiscountAmount =
      discountObject.customLineItemDiscount || discountObject.cartDiscount || discountObject.shippingDiscount || discountObject.totalPriceDiscount ? formatCurrency(amountConversion(totalPriceDiscountedAmount, fractionDigits), cart.totalPrice.currencyCode) : '';
    const totalAmount = formatCurrency(amountConversion(cart.totalPrice.centAmount, fractionDigits), cart.totalPrice.currencyCode);
    totalDiscountAmount ? createTableRow(orderItemsTableBody, ['', '', '<b>Total</b>', totalDiscountAmount, `<b>${totalAmount}</b>`]) : createTableRow(orderItemsTableBody, ['', '', '<b>Total</b>', `<b>${totalAmount}</b>`]);
  }
}

/**
 * Generates rows for line items in the order items table.
 * @param {Array} lineItems - Array of line items.
 * @param {HTMLElement} orderItemsTableBody - Table body element of the order items table.
 * @param {Object} discountObject - Object indicating if discounts are present.
 * @param {string} locale - The locale used for formatting.
 * @param {number} fractionDigits - The number of fraction digits to display.
 */
function generateLineItems(lineItems, orderItemsTableBody, discountObject, locale, fractionDigits) {
  if (!lineItems || 0 === lineItems.length) {
    return;
  }
  lineItems.forEach((item) => {
    if (item.discountedPricePerQuantity && 0 === item.discountedPricePerQuantity.length) {
      generateLineItemRow(item, orderItemsTableBody, discountObject, locale, fractionDigits);
    } else if (item.discountedPricePerQuantity && item.discountedPricePerQuantity.length > 0) {
      item.discountedPricePerQuantity.forEach((discountObjectPerQty) => {
        generateDiscountedLineItemRow(item, discountObjectPerQty, orderItemsTableBody, discountObject, locale, fractionDigits);
      });
    }
  });
}

/**
 * Generates rows for custom line items in the order items table.
 * @param {Array} customLineItems - Array of custom line items.
 * @param {HTMLElement} orderItemsTableBody - Table body element of the order items table.
 * @param {Object} discountObject - Object indicating if discounts are present.
 * @param {string} locale - The locale used for formatting.
 * @param {number} fractionDigits - The number of fraction digits to display.
 */
function generateCustomLineItems(customLineItems, orderItemsTableBody, discountObject, locale, fractionDigits) {
  if (!customLineItems || customLineItems.length === 0 || !orderItemsTableBody) return;
  customLineItems.forEach((item) => {
    generateCustomLineItemRow(item, orderItemsTableBody, discountObject, locale, fractionDigits);
  });
}

/**
 * Generates rows for shipping details in the order items table.
 * @param {Object} cart - The cart object containing shipping details.
 * @param {HTMLElement} orderItemsTableBody - Table body element of the order items table.
 * @param {Object} discountObject - Object indicating if discounts are present.
 * @param {string} locale - The locale used for formatting.
 * @param {number} fractionDigits - The number of fraction digits to display.
 */
function generateShipping(cart, orderItemsTableBody, discountObject, _locale, fractionDigits) {
  if (!cart || !orderItemsTableBody) return;
  if (cart?.shipping && 0 < cart.shipping?.length && 'Multiple' === cart.shippingMode) {
    cart.shipping.forEach((shippingDetail) => {
      generateShippingRow(shippingDetail, orderItemsTableBody, discountObject, fractionDigits);
    });
  } else if (cart.shippingInfo) {
    generateShippingRow({ shippingInfo: cart.shippingInfo }, orderItemsTableBody, discountObject, fractionDigits);
  }
}

/**
 * Generates a row for a custom line item in the order items table.
 * @param {Object} item - The custom line item object.
 * @param {HTMLElement} orderItemsTableBody - Table body element of the order items table.
 * @param {Object} discountObject - Object indicating if discounts are present.
 * @param {string} locale - The locale used for formatting.
 * @param {number} fractionDigits - The number of fraction digits to display.
 */
function generateCustomLineItemRow(item, orderItemsTableBody, discountObject, locale, fractionDigits) {
  let itemName = '';
  let discountAmountForCustomLineItems = 0;
  let unitPrice = '';
  let quantity = '';
  let totalAmount = '';
  let unitPriceWithCurrencyCode = '';
  let discountAmount = 0;
  if (!orderItemsTableBody) return;
  itemName = item?.name[locale] || 'default';
  if (item?.discountedPricePerQuantity && 0 === item.discountedPricePerQuantity.length) {
    unitPrice = amountConversion(item?.money?.centAmount, fractionDigits);
    quantity = item.quantity;
    discountAmountForCustomLineItems = roundOff(discountAmount, fractionDigits);
    unitPriceWithCurrencyCode = `${item?.money?.currencyCode} ${unitPrice}`;
    totalAmount = `${item?.totalPrice?.currencyCode} ${amountConversion(item?.totalPrice?.centAmount, fractionDigits)}`;
    discountAmount = discountObject.customLineItemDiscount || discountObject.cartDiscount || discountObject.shippingDiscount || discountObject.totalPriceDiscount ? `${item?.totalPrice?.currencyCode} ${roundOff(discountAmountForCustomLineItems, fractionDigits)}` : '';
    if (itemName && 'string' === typeof unitPriceWithCurrencyCode && 'string' === typeof totalAmount && quantity) {
      if (discountObject.customLineItemDiscount || discountObject.cartDiscount || discountObject.shippingDiscount || discountObject.totalPriceDiscount) {
        createTableRow(orderItemsTableBody, [itemName, unitPriceWithCurrencyCode, quantity, discountAmount, totalAmount]);
      } else {
        createTableRow(orderItemsTableBody, [itemName, unitPriceWithCurrencyCode, quantity, totalAmount]);
      }
    }
  } else if (item?.discountedPricePerQuantity && item.discountedPricePerQuantity.length > 0) {
    item.discountedPricePerQuantity.forEach((discountObjectPerQty) => {
      totalAmount = '';
      unitPrice = 0;
      quantity = 0;
      unitPriceWithCurrencyCode = '';
      discountAmount = 0;
      discountAmountForCustomLineItems = 0;
      unitPrice = amountConversion(discountObjectPerQty?.discountedPrice?.value.centAmount, fractionDigits);
      quantity = discountObjectPerQty?.quantity;
      let subTotal = unitPrice * quantity;
      totalAmount = `${item?.totalPrice?.currencyCode} ${roundOff(subTotal, fractionDigits)}`;
      unitPriceWithCurrencyCode = `${item.money.currencyCode} ${unitPrice}`;
      if (discountObject.customLineItemDiscount || discountObject.cartDiscount || discountObject.shippingDiscount || discountObject.totalPriceDiscount) {
        discountAmount = `${item?.totalPrice?.currencyCode} ${roundOff(discountAmountForCustomLineItems, fractionDigits)}`;
      }
      if (0 < discountObjectPerQty?.discountedPrice?.includedDiscounts?.length) {
        discountObjectPerQty.discountedPrice.includedDiscounts.forEach((includedDiscount) => {
          discountAmountForCustomLineItems += amountConversion(includedDiscount?.discountedAmount?.centAmount, fractionDigits) * discountObjectPerQty.quantity;
        });
      }
      discountAmount = discountObject.customLineItemDiscount || discountObject.cartDiscount || discountObject.shippingDiscount || discountObject.totalPriceDiscount ? `${item?.totalPrice?.currencyCode} ${roundOff(discountAmountForCustomLineItems, fractionDigits)}` : '';
      if (itemName && 'string' === typeof unitPriceWithCurrencyCode && 'string' === typeof totalAmount && quantity) {
        createTableRow(orderItemsTableBody, [itemName, unitPriceWithCurrencyCode, quantity, discountAmount, totalAmount]);
      }
    });
  }
}

/**
 * Generates a row for a line item in the order items table.
 * @param {Object} item - The line item object.
 * @param {HTMLElement} orderItemsTableBody - Table body element of the order items table.
 * @param {Object} discountObject - Object indicating if discounts are present.
 * @param {string} locale - The locale used for formatting.
 * @param {number} fractionDigits - The number of fraction digits to display.
 */
function generateLineItemRow(item, orderItemsTableBody, discountObject, locale, fractionDigits) {
  let unitPrice = 0;
  let discountAmountForLineItems = 0;
  if (item?.price?.discounted) {
    unitPrice = amountConversion(item.price.discounted.value.centAmount, fractionDigits);
  } else {
    unitPrice = amountConversion(item.price.value.centAmount, fractionDigits);
  }
  const currencyCodeLineItems = item.totalPrice.currencyCode;
  const lineItemName = item?.name[locale] || 'default';
  const lineItemQuantity = item.quantity;
  let lineItemDiscount = '';
  let lineItemTotalPrice = `${item?.totalPrice?.currencyCode} ${amountConversion(item.totalPrice.centAmount, fractionDigits)}`;
  if (currencyCodeLineItems && lineItemName && lineItemQuantity && 'number' === typeof unitPrice && 'string' === typeof lineItemTotalPrice) {
    if (discountObject.customLineItemDiscount || discountObject.cartDiscount || discountObject.shippingDiscount || discountObject.totalPriceDiscount) {
      lineItemDiscount = `${currencyCodeLineItems} ${roundOff(discountAmountForLineItems, fractionDigits)}`;
      if ('string' === typeof lineItemDiscount) {
        createTableRow(orderItemsTableBody, [lineItemName, `${currencyCodeLineItems} ${unitPrice}`, lineItemQuantity, lineItemDiscount, lineItemTotalPrice]);
      }
    } else {
      lineItemDiscount = `${item?.totalPrice?.currencyCode} ${amountConversion(item.totalPrice.centAmount, fractionDigits)}`;
      if ('string' === typeof lineItemDiscount) {
        createTableRow(orderItemsTableBody, [lineItemName, `${currencyCodeLineItems} ${unitPrice}`, lineItemQuantity, lineItemTotalPrice]);
      }
    }
  }
}

/**
 * Generates a row for a discounted line item in the order items table.
 * @param {Object} item - The line item object.
 * @param {Object} discountObjectPerQty - Discount object for the specific quantity of the item.
 * @param {HTMLElement} orderItemsTableBody - Table body element of the order items table.
 * @param {Object} discountObject - Object indicating if discounts are present.
 * @param {string} locale - The locale used for formatting.
 * @param {number} fractionDigits - The number of fraction digits to display.
 */
function generateDiscountedLineItemRow(item, discountObjectPerQty, orderItemsTableBody, discountObject, locale, fractionDigits) {
  let discountAmount = 0;
  const unitPrice = amountConversion(discountObjectPerQty.discountedPrice.value.centAmount, fractionDigits);
  const subTotal = unitPrice * discountObjectPerQty.quantity;
  if (0 < discountObjectPerQty.discountedPrice.includedDiscounts.length) {
    discountObjectPerQty.discountedPrice.includedDiscounts.forEach((includedDiscount) => {
      discountAmount += amountConversion(includedDiscount.discountedAmount.centAmount, fractionDigits) * discountObjectPerQty.quantity;
    });
  }
  const currencyCode = item.totalPrice.currencyCode || '';
  if ('number' === typeof discountAmount && 'number' === typeof subTotal && 'number' === typeof unitPrice && item && currencyCode) {
    if (discountObject.customLineItemDiscount || discountObject.cartDiscount || discountObject.shippingDiscount || (discountObject.totalPriceDiscount && discountObjectPerQty?.quantity)) {
      createTableRow(orderItemsTableBody, [item.name[locale] || 'default', `${currencyCode} ${unitPrice}`, discountObjectPerQty?.quantity, `${currencyCode} ${roundOff(discountAmount, fractionDigits)}`, `${currencyCode} ${roundOff(subTotal, fractionDigits)}`]);
    } else {
      createTableRow(orderItemsTableBody, [item.name[locale] || 'default', `${currencyCode} ${unitPrice}`, discountObjectPerQty?.quantity, `${currencyCode} ${roundOff(subTotal, fractionDigits)}`]);
    }
  }
}

/**
 * Generates a row for shipping details in the order items table.
 * @param {Object} shippingDetail - The shipping detail object.
 * @param {HTMLElement} orderItemsTableBody - Table body element of the order items table.
 * @param {Object} discountObject - Object indicating if discounts are present.
 * @param {number} fractionDigits - The number of fraction digits to display.
 */
function generateShippingRow(shippingDetail, orderItemsTableBody, discountObject, fractionDigits) {
  let shippingCost = 0;
  let discountAmount = 0;
  let shippingMethodName = shippingDetail.shippingInfo.shippingMethodName;
  if (shippingDetail?.shippingInfo?.discountedPrice) {
    shippingCost = amountConversion(shippingDetail.shippingInfo.discountedPrice.value.centAmount, fractionDigits);
  } else {
    shippingCost = amountConversion(shippingDetail.shippingInfo.price.centAmount, fractionDigits);
  }
  if (0 < shippingDetail?.shippingInfo?.discountedPrice?.includedDiscounts.length) {
    shippingDetail.shippingInfo.discountedPrice.includedDiscounts.forEach((shippingDiscount) => {
      discountAmount += amountConversion(shippingDiscount.discountedAmount.centAmount, fractionDigits);
    });
  }
  discountAmount = discountObject.customLineItemDiscount || discountObject.cartDiscount || discountObject.shippingDiscount || discountObject.totalPriceDiscount ? discountAmount : '';
  let totalCost = `${shippingDetail.shippingInfo.price.currencyCode} ${shippingCost}`;
  if (discountObject.customLineItemDiscount || discountObject.cartDiscount || discountObject.shippingDiscount || discountObject.totalPriceDiscount) {
    createTableRow(orderItemsTableBody, [`<b>Shipping Cost (${shippingMethodName})</b>`, totalCost, '1', `${shippingDetail.shippingInfo.price.currencyCode} ${discountAmount}`, totalCost]);
  } else {
    createTableRow(orderItemsTableBody, [`<b>Shipping Cost (${shippingMethodName})</b>`, totalCost, '1', totalCost]);
  }
}

/**
 * Validates the input amount using regex.
 * @param {string} inputId - The ID of the input element.
 * @param {string} buttonId - The ID of the button element.
 * @param {string} messageElementId - The ID of the message element to display error.
 * @returns {boolean} - True if the input is valid, otherwise false.
 */
function validateAmountWithRegex(inputId, buttonId, messageElementId) {
  var button = document.getElementById(buttonId);
  var amount = document.getElementById(inputId);
  var validAmountRegex = /^\d*\.?\d*$/;
  if (amount?.value && 'string' === typeof amount.value && amount.value.length > 0) {
    if (validAmountRegex.test(amount.value)) {
      document.getElementById(messageElementId).style.display = 'none';
      button.disabled = false;
      return true;
    } else {
      document.getElementById(messageElementId).style.display = 'flex';
      button.disabled = true;
      return false;
    }
  } else {
    document.getElementById(messageElementId).style.display = 'none';
    button.disabled = false;
    return true;
  }
}
