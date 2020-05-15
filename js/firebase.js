var firebaseConfig = {
    apiKey: "AIzaSyC_qqbu3DOveTxrdsBd8Z6NvccVD567mws",
    authDomain: "password-manager-e0da8.firebaseapp.com",
    databaseURL: "https://password-manager-e0da8.firebaseio.com",
    projectId: "password-manager-e0da8",
    storageBucket: "password-manager-e0da8.appspot.com",
    messagingSenderId: "1036688380251",
    appId: "1:1036688380251:web:e6085b0da6a1c4f05d4a7e",
};
var databaseConfig = {
    apiKey: "apiKey",
    authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://password-manager-e0da8.firebaseio.com",
    storageBucket: "bucket.appspot.com"
};
firebase.initializeApp(firebaseConfig, databaseConfig);

module.exports = {
    firebase
};