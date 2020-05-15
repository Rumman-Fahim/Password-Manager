// using firebase connection
const firebase = require("./firebase").firebase;

// Get a reference to the database service
const database = firebase.database();

// getting required elements from .html file
const userAuth = document.getElementById('userAuth');
const userKey = document.getElementById('userKey');
const btn_SignOut = document.getElementById('btn_SignOut');
const passwords_div = document.getElementById('passwords');
const btn_addNewPassword = document.getElementById('btn_addNewPassword');
const passwordContainer = document.getElementById('password_Container');

// setting status to false --> user is logging out  
const status = false;

btn_SignOut.addEventListener('click', () => {
    userSignOut(userLoginStatus);
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        displayPasswords(user.uid);

        // calls function when user clicks btn_addNewPassword
        btn_addNewPassword.addEventListener('click', () => {
            window.location.replace("../views/addPassword.html");
        });
    }
});

// user signs out
function userSignOut(callback) {
    firebase.auth().signOut().then(function () {
        callback();
    }).catch(function (error) {
        console.log('An error happened');
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
            // after successfully writing into JSON file, redirect to Login Page
            document.location.href = '../views/login.html', true;
        }
    })
}

function displayPasswords(userID) {
    const db_refCurrentUser = database.ref('Users').child(userID);
    db_refCurrentUser.on('child_added', snap => {
        if (snap.key != 'name') {
            var serviceName = snap.val().Service_Name;
            var usernameEmail = snap.val().Username_Email;
            var password = snap.val().Password;
            var key = snap.key
            createPasswordBox(serviceName, usernameEmail, password, key, userID)
        }
    });
}

function createPasswordBox(serviceName, usernameEmail, password, key, userID) {
    // main box
    let mainBox = document.createElement('div');
    mainBox.className = 'password_MainBox';
    mainBox.id = key;
    passwordContainer.appendChild(mainBox);

    // credentials box
    let credentialsBox = document.createElement('div');
    credentialsBox.className = 'password_CredentialsBox';
    mainBox.appendChild(credentialsBox);

    // Service Name box
    let serviceNameBox = document.createElement('div');
    serviceNameBox.className = 'password_Credentials';
    serviceNameBox.innerHTML = 'Service Name : ';
    let serviceNameValue = document.createElement('span');
    serviceNameValue.id = 'serviceName_' + key;
    serviceNameValue.innerHTML = serviceName;

    // Username/Email box
    let usernameEmailBox = document.createElement('div');
    usernameEmailBox.className = 'password_Credentials';
    let usernameEmailValue = document.createElement('span');
    usernameEmailValue.id = 'usernameEmail_' + key;
    if (usernameEmail.search("@") > -1) {
        usernameEmailBox.innerHTML = 'Email : ';
        usernameEmailValue.innerHTML = usernameEmail;
    } else {
        usernameEmailBox.innerHTML = 'Username : ';
        usernameEmailValue.innerHTML = usernameEmail;
    }
    // Password box
    let passwordBox = document.createElement('div');
    passwordBox.className = 'password_Credentials';
    passwordBox.innerHTML = 'Password : ';
    let passwordValue = document.createElement('span');
    passwordValue.id = 'password_' + key;
    passwordValue.innerHTML = password;

    credentialsBox.appendChild(serviceNameBox);
    serviceNameBox.appendChild(serviceNameValue);
    credentialsBox.appendChild(usernameEmailBox);
    usernameEmailBox.appendChild(usernameEmailValue);
    credentialsBox.appendChild(passwordBox);
    passwordBox.appendChild(passwordValue);

    // function box
    let functionBox = document.createElement('div');
    functionBox.className = 'password_FunctionBox';
    mainBox.appendChild(functionBox);

    // fav btn
    let favBtn = document.createElement('button');
    favBtn.className = 'password_FunctionBox';
    favBtn.innerHTML = '<i class="far fa-bookmark"></i>';
    favBtn.addEventListener("click", function (event) {
        bookmarkPassword(key, userID);
    });
    functionBox.appendChild(favBtn);


    // edit btn
    let editBtn = document.createElement('button');
    editBtn.className = 'password_FunctionBox';
    editBtn.id = 'btn_edit_' + key;
    editBtn.innerHTML = '<i class="far fa-edit"></i>';
    editBtn.addEventListener("click", function (event) {
        editPassword(key, userID);
        event.stopPropagation();
    });
    functionBox.appendChild(editBtn);

    // del btn
    let delBtn = document.createElement('button');
    delBtn.className = 'password_FunctionBox';
    delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    delBtn.addEventListener("click", function () {
        deletePassword(key, userID);
    });
    functionBox.appendChild(delBtn);
}

function bookmarkPassword(key, userID) {
    console.log("Bookmark Password --> " + key);
}

function editPassword(key, userID) {
    document.getElementById("myModal").style.display = "flex";

    let serviceName = document.getElementById('modal_serviceName');
    let usernameEmail = document.getElementById('modal_usernameEmail');
    let password = document.getElementById('modal_Password');
    let btn_closeWithoutSavingEditedPassword = document.getElementsByClassName("close")[ 0 ];
    let btn_saveEditedPassword = document.getElementById('btn_saveEditedPassword');
    let btn_discard = document.getElementById('btn_discard');

    serviceName.value = document.getElementById('serviceName_' + key).innerHTML;
    usernameEmail.value = document.getElementById('usernameEmail_' + key).innerHTML;
    password.value = document.getElementById('password_' + key).innerHTML;

    // save edited password to database AND update to app AND close modal
    btn_saveEditedPassword.addEventListener('click', (event) => {
        event.preventDefault();
        saveEditedPassword(serviceName.value, usernameEmail.value, password.value, key, userID, updateEditedPasswordOnApp);
    });

    // close modal without saving and updating data 
    btn_closeWithoutSavingEditedPassword.addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById("myModal").style.display = "none";
    });

    // close modal without saving and updating data 
    btn_discard.addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById("myModal").style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == (document.getElementById("myModal"))) {
            document.getElementById("myModal").style.display = "none";
        }
    }
}
function saveEditedPassword(serviceName, usernameEmail, password, key, userID, callback) {
    const db_refCurrentUser = database.ref('Users').child(userID);
    const db_refPassword = db_refCurrentUser.child(key);
    db_refPassword.update({
        Service_Name: serviceName,
        Username_Email: usernameEmail,
        Password: password
    });
    callback(serviceName, usernameEmail, password, key);
}

function updateEditedPasswordOnApp(serviceName, usernameEmail, password, key) {
    console.log("Upadte/edit Password --> " + key);
    document.getElementById('serviceName_' + key).innerHTML = serviceName;
    document.getElementById('usernameEmail_' + key).innerHTML = usernameEmail;
    document.getElementById('password_' + key).innerHTML = password;
    document.getElementById("myModal").style.display = "none";
}

function deletePassword(key, userID) {
    const db_refCurrentUser = database.ref('Users').child(userID);
    const db_refPassword = db_refCurrentUser.child(key);
    db_refPassword.remove();
    console.log("Delete Password --> " + key);
}