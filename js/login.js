// using firebase connection
const firebase = require("./firebase").firebase;

// getting elements from login.html file
const btn_login = document.getElementById('btn_login');
const email = document.getElementById('email');
const password = document.getElementById('password');

// setting status to true --> user is logging in 
const status = true;

// if user clicks the login button
btn_login.addEventListener('click', () => {
    // start loader effect
    btn_login.classList.add("rotate");
    // (1) --> login user
    // (2) --> change user login status to TRUE
    // (3) --> redirect user to Home Page (code written inside userLoginStatus())
    loginUser(email.value, password.value, userLoginStatus);
});

// logs user in 
function loginUser(email, password, callback) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((success) => {
            // upon successfull login, callbacks the next function
            callback();
        })
        .catch((error) => {
            // in case of error 
            // (1) --> stop loader effect
            // (2) --> display error
            btn_login.classList.remove("rotate");
            console.log(error);
        });
}

// changes user's login status in JSON file to TRUE
function userLoginStatus() {
    const fs = require('fs')
    const customer = {
        isUserLoggedIn: status
    }
    const jsonString = JSON.stringify(customer)
    fs.writeFile('./userLoginStatus.json', jsonString, err => {
        if (err) {
            // in case of error 
            // (1) --> stop loader effect
            // (2) --> display error
            btn_login.classList.remove("rotate");
            console.log('Error writing file', err)
        } else {
            // after successfully writing into JSON file, redirect to Home Page
            document.location.href = '../views/home.html', true;
        }
    })
}