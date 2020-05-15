// using firebase connection
const firebase = require("./firebase").firebase;

// Get a reference to the database service
const database = firebase.database();

// getting elements from respective .html file
const btn_signUp = document.getElementById('fm_btn_signUp');
const email = document.getElementById('fm_email');
const password = document.getElementById('fm_password');

// setting status to true --> user is signing up 
const status = true;

// if user clicks sign-up button
btn_signUp.addEventListener('click', () => {
    // start loader effect
    btn_signUp.classList.add("rotate");
    // (1) --> user signs up 
    // (2) --> user is added to database
    // (3) --> user's login status is changed to TRUE
    // (4) --> redirect user to Home Page (code written inside userLoginStatus())
    signInUser(email.value, password.value, addUserToDatabase, userLoginStatus);
});

// user is created(sign-up) using firebase function 
function signInUser(email, password, firstCallback, secondCallback) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((response) => {
            // upon successfull sign-up, callback next function
            firstCallback(secondCallback);
        })
        .catch((error) => {
            // in case of error 
            // (1) --> stop loader effect
            // (2) --> display error
            btn_signUp.classList.remove("rotate");
            console.log(error);
        });
}

// adds user to database if user has successfully signed up 
function addUserToDatabase(callback) {
    // after signing up, user is automatically logged in
    // to confirm that state, we use this function ...
    firebase.auth().onAuthStateChanged(function (user) {
        // ... if user has successfully signed up and logged in  ...
        if (user) {
            // ... then we add user to the database
            // 1). creating reference to the parent node
            const db_refParentNode_Users = database.ref('Users');
            // 2). adding new child node with unique key (given by push())
            db_refParentNode_Users.child(user.uid).set({
                name: document.getElementById('fm_name').value
            });
            // afterwards callback the next function
            callback();
        }
        // if user is not logged in --> user not added successfull
        // therefore, no addition in database
        else {
            // in case of error 
            // (1) --> stop loader effect
            // (2) --> display error
            btn_signUp.classList.remove("rotate");
            console.log('no user');
        }
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





