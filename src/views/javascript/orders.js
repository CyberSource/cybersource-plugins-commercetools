window.onload = function () {
  let runScript = document.getElementById('runScript');
  let decisionSync = document.getElementById('decisionSync');
  let sync = document.getElementById('sync');
  let collection = Object.values(document.getElementsByClassName('row'));
  let auth = document.getElementById('auth');
  let captureButton = document.getElementById('captureButton');
  let refundButton = document.getElementById('refundButton');
  let captureAmount = document.getElementById('captureAmount');
  let refundAmount = document.getElementById('refundAmount');
  if (runScript) {
    runScript.addEventListener('click', showDiv);
  }
  if (decisionSync) {
    decisionSync.addEventListener('click', showDiv);
  }
  if (sync) {
    sync.addEventListener('click', showDiv);
  }
  if (auth) {
    auth.addEventListener('click', showDiv);
  }
  if (captureButton) {
    captureButton.addEventListener('click', validateCapture);
  }
  if (refundButton) {
    refundButton.addEventListener('click', validateRefund);
  }
  if (refundAmount) {
    refundAmount.addEventListener('input', validateRefundAmount)
  }
  if (captureAmount) {
    captureAmount.addEventListener('input', validateCaptureAmount)
  }
  if (collection && 0 < collection.length) {
    collection.forEach((item) => {
      item.addEventListener('click', function (e) {
        window.location = item.getAttribute('data-href');
        document.getElementById('loading').style.display = 'flex';
      });
    });
  }
};

function showDiv() {
  document.getElementById('loading').style.display = 'flex';
}

function validateRefundAmount() {
  var button = document.getElementById('refundButton');
  var amount = document.getElementById('refundAmount');
  var validAmount = new RegExp(/^\d*\.?\d*$/);
  if (null != amount.value && amount.value.length > 0) {
    if (validAmount.test(amount.value)) {
      document.getElementById('refundMsg').style.display = 'none';
      button.disabled = false;
      return true;
    } else {
      document.getElementById('refundMsg').style.display = 'flex';
      button.disabled = true;
      return false;
    }
  } else {
    document.getElementById('refundMsg').style.display = 'none';
    button.disabled = false;
    return true;
  }
}
function validateCaptureAmount() {
  var button = document.getElementById('captureButton');
  var amount = document.getElementById('captureAmount');
  var validAmount = new RegExp(/^\d*\.?\d*$/);
  if (null != amount.value && amount.value.length > 0) {
    if (validAmount.test(amount.value)) {
      document.getElementById('captureMsg').style.display = 'none';
      button.disabled = false;
      return true;
    } else {
      document.getElementById('captureMsg').style.display = 'flex';
      button.disabled = true;
      return false;
    }
  } else {
    document.getElementById('captureMsg').style.display = 'none';
    button.disabled = false;
    return true;
  }
}
function validateRefund() {
  var amount = document.getElementById('refundAmount').value;
  if (amount.length != 0) {
    document.getElementById('loading').style.display = 'flex';
    return true;
  } else {
    document.getElementById('loading').style.display = 'none';
    return false;
  }
}
function validateCapture() {
  var amount = document.getElementById('captureAmount').value;
  if (amount.length != 0) {
    document.getElementById('loading').style.display = 'flex';
    return true;
  } else {
    document.getElementById('loading').style.display = 'none';
    return false;
  }
}
