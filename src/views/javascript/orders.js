window.onload = function () {
  let runScript = document.getElementById('runScript');
  let decisionSync = document.getElementById('decisionSync');
  let sync = document.getElementById('sync');
  let collection = Object.values(document.getElementsByClassName('row'));
  let auth = document.getElementById('auth');
  let captureButton = document.getElementById('captureButton');
  let refundButton = document.getElementById('refundButton');
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
    captureButton.addEventListener('click', validate);
  }
  if (refundButton) {
    refundButton.addEventListener('click', validate);
  }
  if (collection && 0 < collection.length) {
    collection.forEach((item) => {
      item.addEventListener('click', function (e) {
        window.location = item.getAttribute('data-href');
      });
    });
  }
};

function showDiv() {
  document.getElementById('loading').style.display = 'flex';
}

function validateAmount(amount) {
  var button = document.getElementById('refundbutton');
  var validAmount = new RegExp(/^\d*\.?\d*$/);
  if (amount.value.length > 0) {
    if (validAmount.test(amount.value)) {
      document.getElementById('msg').style.display = 'none';
      button.disabled = false;
      return true;
    } else {
      document.getElementById('msg').style.display = 'flex';
      button.disabled = true;
      return false;
    }
  } else {
    document.getElementById('msg').style.display = 'none';
    button.disabled = false;
    return true;
  }
}

function validate() {
  var amount = document.getElementById('refundAmount').value;
  if (amount.length != 0) {
    document.getElementById('loading').style.display = 'flex';
    return true;
  } else {
    document.getElementById('loading').style.display = 'none';
    return false;
  }
}
