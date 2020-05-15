// using firebase connection
const firebase = require("./firebase").firebase;

// Get a reference to the database service
const database = firebase.database();

// getting required elements from .html file
const btn_generatePassword = document.getElementById('btn_generatePassword');
const btn_uploadPassword = document.getElementById('btn_uploadPassword');
const passwordLenghtSlider = document.getElementById('passwordLenghtSlider');
const passwordLenghtValue = document.getElementById('passwordLenghtValue');

// only performing functions if user is logged in
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // Display the default slider value
        passwordLenghtValue.innerHTML = passwordLenghtSlider.value;
        // Update the current slider value (each time you drag the slider handle)
        passwordLenghtSlider.oninput = function () {
            passwordLenghtValue.innerHTML = this.value;
        }

        // clicked to display a random password 
        btn_generatePassword.addEventListener('click', (event) => {
            event.preventDefault()
            document.getElementById('f_Password').value = generatePassword(passwordLenghtSlider.value);
        });

        // clicked to upload the current random password
        btn_uploadPassword.addEventListener('click', (event) => {
            event.preventDefault();
            uploadPassword(user.uid);
        });
    }
    else {
        alert("Error in auth in add password");
    }
});

function uploadPassword(userID) {
    let f_serviceName = document.getElementById('f_serviceName');
    let f_usernameEmail = document.getElementById('f_usernameEmail');
    let f_Password = document.getElementById('f_Password');
    var isEmpty = false;

    if (f_serviceName.value == "") {
        isEmpty = true;
    }
    if (f_usernameEmail.value == "") {
        isEmpty = true;
    }
    if (f_Password.value == "") {
        isEmpty = true;
    }

    if (isEmpty) {
        console.log("Must Fill All input Fields !")
    }
    else {
        // creating reference to parent node (Users)
        const db_refCurrentUser = database.ref('Users').child(userID);
        db_refCurrentUser.push({
            Service_Name: f_serviceName.value,
            Username_Email: f_usernameEmail.value,
            Password: f_Password.value
        });

        console.log("Password Added Successfully");
    }
}


// --------------------------------------------------------------  generatePassword()
function generatePassword(passwordLenght) {
    var passwordCriteria = "", password = "", count = 0;
    // getting form elements from form 
    var criteria = document.forms[ 0 ];

    // going through elements from the form
    for (var i = 0; i < criteria.length; i++) {
        // selecting only checked box input
        if (criteria[ i ].checked) {
            // concatenate their value to passwordCriteria
            passwordCriteria = passwordCriteria + criteria[ i ].value;
            /* 
                it can happen that the required character would get miss 
                even when generating random passwords/strings.
                therefore at time of finding the criteria,we add 1 character 
                from the selected criteria to the password.
                Furthermore, we will keep count of how many times we do this
                in order to subtract that from the lenght we pass to getRandomString() method
                this way when we concatenate password and getRandomString()'s returned string
                our required lenght of password is the same as what the user specified.
            */
            count++;
            var x = Math.floor(Math.random() * (criteria[ i ].value).length + 1);
            password = password + (criteria[ i ].value).charAt(x);
        }
    }

    // if no criteria is set, then all characters will be included in creating password 
    if (passwordCriteria == "") {
        passwordCriteria = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&()*,-./:;=?@[\]^_{|}~";
    }

    // getting the other part of password (random string based on the criteria)
    // and concatenating it with the main password variable
    password = password + getRandomString(passwordCriteria, (passwordLenght - count));

    /* 
        since we inserted 1 character from each selected criteria 
        one by one using the for-loop
        their order of insertion is uniform 
        something we do not want 
        so thats why after we get the full password 
        we shuffle it to get a truly random password
    */
    password = shuffleString(password);

    /* 
        since we are defining randomString/password as '' and 
        '' is empty space which is defined as a character
        so it could also be included when generating string
        and thus reducing the lenght of password
        Therefore we need to keep a check of lenght
        and add random characters (with respect to the criteria)
        until the lenght of password is as specified by the user.
    */
    while ((password.length) < passwordLenght) {
        var x = Math.floor(Math.random() * passwordCriteria.length + 1);
        password = password + passwordCriteria.charAt(x);
    }

    // we return the final version of the password
    return password;
}
// --------------------------------------------------------------  getRandomString()
function getRandomString(stringCriteria, stringLenght) {
    var randomString = "";
    // creating string based on criteria
    for (var i = 0; i < stringLenght; i++) {
        /*
            Math.random() gives a random number btw the range thats ...
            ... btw stringCriteria.length <--> 1
            floor() rounds off this numeric value to interger
        */
        var position = Math.floor(Math.random() * stringCriteria.length + 1);

        // charAt( x ) will give the letter at x poition 
        randomString = randomString + stringCriteria.charAt(position);
    }
    return randomString;
}
// --------------------------------------------------------------  shuffleString()
function shuffleString(string) {
    var a = string.split(""),
        n = a.length;

    for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[ i ];
        a[ i ] = a[ j ];
        a[ j ] = tmp;
    }
    return a.join("")
}
