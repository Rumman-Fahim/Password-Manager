// using firebase connection
const firebase = require("./firebase").firebase;

// getting elements from respective .html file
let btn_resetPassword = document.getElementById('fm_btn_resetPassword');
var email = document.getElementById('fm_email')

// when user clicks btn_resetPassword, inputfield value are passed onto resetPassword()
btn_resetPassword.addEventListener('click', () => {
    resetPassword(email.value);
});

function resetPassword(email) {
    var auth = firebase.auth();
    var emailAddress = email;

    auth.sendPasswordResetEmail(emailAddress).then(function () {
        alert("Email is Sent !");
    }).catch(function (error) {
        alert("ERROR !");
    });
}
