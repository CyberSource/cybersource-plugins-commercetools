function showDiv() {
    document.getElementById('loading').style.display = "flex";
}

function validateamount(amount) {

    var msg = document.getElementById('msg');

    var button = document.getElementById('refundbutton');

    var validamount = new RegExp(/^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$/);

    if (amount.value.length > 0) {
        if (validamount.test(amount.value)) {
            msg.innerHTML = "";
            button.disabled = false;
            return true;
        } else {
            msg.innerHTML = "Refund amount must be a number and should greater than Zero!!!!";
            button.disabled = true;
            return false;
        }

    } else {
        msg.innerHTML = "";
        button.disabled = false;
        return true;

    }

}

