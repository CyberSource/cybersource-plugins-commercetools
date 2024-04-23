import { amountConversion, roundOff, getPaymentId, createElement, formatCurrency, createTableRow } from './utils.js';

if (window.location.pathname.includes('paymentDetails')) {
  document.addEventListener('DOMContentLoaded', async function () {
    let authPresent = false;
    let capturePresent = false;
    let authReversalPresent = false;
    let refundPresent = false;
    const paymentsData = await fetchPaymentsInfo();
    const payments = paymentsData?.payments;
    const cart = paymentsData?.cart;
    const id = paymentsData?.id;
    const locale = paymentsData.locale;
    let contentDiv = document.getElementById('message');
    if (paymentsData?.errorMessage) {
      contentDiv.innerHTML += '<div class="alert alert-error alert-dismissible" id="paymentErrorMessage">' + '<em class="mark error"></em>' + paymentsData?.errorMessage + '</div>';
    }
    if (paymentsData?.successMessage) {
      contentDiv.innerHTML += '<div id="message" class="alert alert-success alert-dismissible" id="paymentSuccessMessage">' + '<em class="mark check"></em>' + paymentsData?.successMessage + '</div>';
    }
    if (paymentsData && paymentsData?.payments && 0 < Object.keys(paymentsData.payments)?.length) {
      var fractionDigits = payments?.amountPlanned?.fractionDigits;
      if (cart && 0 < Object.keys(cart).length) {
        const discountObject = verifyDiscountPresent(cart);
        var customerDetailsContainer = document.createElement('div');

        if (cart.shippingMode && 'Multiple' === cart.shippingMode && cart.shipping && cart.shipping.length > 0) {
          customerDetailsContainer.appendChild(createAddressElement(cart.shipping[0].shippingAddress, 'shipping'));
        } else if (cart?.shippingAddress) {
          customerDetailsContainer.appendChild(createAddressElement(cart.shippingAddress, 'shipping'));
        }
        if (cart?.billingAddress) {
          customerDetailsContainer.appendChild(createAddressElement(cart.billingAddress, 'billing'));
        }
        const customerDetails = document.getElementById('customerDetails');
        if (customerDetails) {
          customerDetails.appendChild(customerDetailsContainer);
        }
        generateOrderItemsTable(cart, discountObject, locale, fractionDigits);
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

      const authorizedAmount = paymentsData?.authorizedAmount;
      const captureAmount = paymentsData?.captureAmount;
      if (authPresent && !authReversalPresent && (!refundPresent || (refundPresent && authorizedAmount)) && ((capturePresent && authorizedAmount) || (!capturePresent && authorizedAmount))) {
        const captureMsgDiv = document.createElement('div');
        captureMsgDiv.classList.add('div-padding');
        captureMsgDiv.textContent = `You can capture amount ${authorizedAmount} `;
        const partialCaptureForm = document.createElement('form');
        partialCaptureForm.action = '/capture';
        partialCaptureForm.classList.add('div-padding');
        partialCaptureForm.id = 'partialCaptureForm';
        partialCaptureForm.innerHTML = `
               <input type = "hidden" name ="captureId" id ="captureId" value ="${id}">
                Capture amount: <input type="text" name="captureAmount" id="captureAmount" size="6" value="" autocomplete="off" required>
                    <button type="submit" id="captureButton" class="button">Capture</button>`;
        buttonsDiv.appendChild(captureMsgDiv);
        buttonsDiv.appendChild(partialCaptureForm);
      }
      if (authPresent && !capturePresent && !authReversalPresent && !refundPresent) {
        const authButton = document.createElement('a');
        authButton.classList.add('button');
        authButton.id = 'auth';
        authButton.href = `/authReversal?id=${id}`;
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
        refundForm.innerHTML = `<input type="hidden" name="refundId" id="refundId" value=${id}>
                          Refund amount: <input type="text" name="refundAmount" id="refundAmount" size="6" value="" autocomplete="off" required>
                            <button type="submit" id="refundButton" class="button">Refund</button>`;

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
      renderCustomFields(payments);

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

async function fetchPaymentsInfo() {
  const loadingIndicator = document.getElementById('loading');
  const paymentId = getPaymentId();
  try {
    loadingIndicator.style.display = 'flex';
    const response = await fetch(`/paymentData?id=${paymentId}`, { method: 'GET' });
    const data = await response.text();
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.error('Error in fetching Payment details:', error);
    return null;
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

function verifyDiscountPresent(cart) {
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

function createRow(label, value) {
  if (label && value) {
    const row = document.createElement('tr');
    const labelCell = document.createElement('td');
    labelCell.innerHTML = `<b>${label}</b>`;
    row.appendChild(labelCell);
    const valueCell = document.createElement('td');
    valueCell.textContent = value;
    row.appendChild(valueCell);
    return row;
  }
}

function createCustomFieldsTable(payments) {
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
    tableHTML += '</table>';
    return tableHTML;
  }
}

function renderCustomFields(payments) {
  const customFieldsDiv = document.getElementById('paymentCustomFields');
  if (payments?.custom?.fields && customFieldsDiv) {
    customFieldsDiv.innerHTML = `
        <h2>ISV Payment Service Custom Payment Fields</h2>
        ${createCustomFieldsTable(payments)}`;
  }
}

function renderCardDetails(cardDetails) {
  const paymentCardDetails = document.getElementById('paymentCardDetails');
  if (paymentCardDetails) {
    paymentCardDetails.classList.add('panel', 'card4', 'padding16');
    const { isv_maskedPan, isv_cardType, isv_cardExpiryMonth, isv_cardExpiryYear } = cardDetails;
    paymentCardDetails.innerHTML = `
        <h2>Payment Card Details</h2>
        <hr/>
        <table class="paymentTableAbove">
        <tr>
          <th>Masked Card Number </th>
           ${isv_cardType !== null ? '<th>Card Type</th>' : ''}
           ${isv_cardExpiryMonth !== null ? '<th>Card Expiry Month</th>' : ''}
           ${isv_cardExpiryYear !== null ? '<th>Card Expiry Year</th>' : ''}
        </tr>
        <tr>
           <td>${isv_maskedPan}</td>
           ${isv_cardType !== null ? '<td>' + isv_cardType + '</td>' : ''}
           ${isv_cardExpiryMonth !== null ? '<td>' + isv_cardExpiryMonth + '</td>' : ''}
           ${isv_cardExpiryYear !== null ? '<td>' + isv_cardExpiryYear + '</td>' : ''}
        </tr>
        </table>`;
  }
}

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

function showLoadingDiv() {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) {
    loadingDiv.style.display = 'flex';
  }
}

function createAddressElement(address, type) {
  const div = createElement('div', '', 'leftDiv');
  if (div) {
    const header = createElement('div', `<img src="${type}Image.png" /><b>${type} Address</b>`, 'div-font div-padding');
    div.appendChild(header);
    div.appendChild(createElement('br'));
    const addressContainer = createElement('div', '', 'div-padding');
    addressContainer.appendChild(createElement('div', `<b>Name: </b>${address.firstName || ''} ${address.lastName || ''}`));
    addressContainer.appendChild(createElement('div', `<b>Address: </b>${address.streetName || ''}`));
    if (address.additionalStreetInfo) {
      addressContainer.appendChild(createElement('div', `<b>Additional Street Info: </b>${address.additionalStreetInfo || ''}`));
    }
    addressContainer.appendChild(createElement('div', `<b>PostalCode: </b>${address.postalCode || ''}`));
    addressContainer.appendChild(createElement('div', `<b>City: </b>${address.city || ''}`));
    addressContainer.appendChild(createElement('div', `<b>Region: </b>${address.region || ''}`));
    addressContainer.appendChild(createElement('div', `<b>Country: </b>${address.country || ''}`));
    addressContainer.appendChild(createElement('div', `<b>Phone: </b>${address.phone || ''}`));
    addressContainer.appendChild(createElement('div', `<b>Email: </b>${address.email || ''}`));
    div.appendChild(addressContainer);
    return div;
  }
}

function generateOrderItemsTable(cart, discountObject, locale, fractionDigits) {
  const orderItemsTable = document.getElementById('orderItemsTable');
  if (cart && orderItemsTable) {
    const orderItemsTableBody = orderItemsTable.getElementsByTagName('tbody')[0];
    if (!orderItemsTableBody) return;
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

function generateLineItems(lineItems, orderItemsTableBody, discountObject, locale, fractionDigits) {
  if (!lineItems || lineItems.length === 0) return;
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

function generateCustomLineItems(customLineItems, orderItemsTableBody, discountObject, locale, fractionDigits) {
  if (!customLineItems || customLineItems.length === 0 || !orderItemsTableBody) return;
  customLineItems.forEach((item) => {
    generateCustomLineItemRow(item, orderItemsTableBody, discountObject, locale, fractionDigits);
  });
}

function generateShipping(cart, orderItemsTableBody, discountObject, locale, fractionDigits) {
  if (!cart || !orderItemsTableBody) return;
  if (cart?.shipping && 0 < cart.shipping?.length && 'Multiple' === cart.shippingMode) {
    cart.shipping.forEach((shippingDetail) => {
      generateShippingRow(shippingDetail, orderItemsTableBody, discountObject, fractionDigits);
    });
  } else if (cart.shippingInfo) {
    generateShippingRow({ shippingInfo: cart.shippingInfo }, orderItemsTableBody, discountObject, fractionDigits);
  }
}

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
          discountAmountForCustomLineItems += amountConversion(includedDiscount?.discountedAmount?.centAmount, fractionDigits);
        });
      }
      discountAmount = discountObject.customLineItemDiscount || discountObject.cartDiscount || discountObject.shippingDiscount || discountObject.totalPriceDiscount ? `${item?.totalPrice?.currencyCode} ${roundOff(discountAmountForCustomLineItems, fractionDigits)}` : '';
      if (itemName && 'string' === typeof unitPriceWithCurrencyCode && 'string' === typeof totalAmount && quantity) {
        createTableRow(orderItemsTableBody, [itemName, unitPriceWithCurrencyCode, quantity, discountAmount, totalAmount]);
      }
    });
  }
}

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
