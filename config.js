import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyAn7DM2Ak1XfdnQF9pvHaqdurj6rft4i9s",
  authDomain: "booksanta-945e9.firebaseapp.com",
  projectId: "booksanta-945e9",
  storageBucket: "booksanta-945e9.appspot.com",
  messagingSenderId: "576640516520",
  appId: "1:576640516520:web:c04628054046b2e3541d9d"
};
  // Initialize Firebase
  
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
