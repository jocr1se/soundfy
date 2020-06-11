import firebase from 'firebase/app'
const firebaseConfig = {
    apiKey: "AIzaSyB9zgrA9BRjo3MxDrIlm2LtQMSoJgx0x0U",
    authDomain: "soundfy-136b1.firebaseapp.com",
    databaseURL: "https://soundfy-136b1.firebaseio.com",
    projectId: "soundfy-136b1",
    storageBucket: "soundfy-136b1.appspot.com",
    messagingSenderId: "294034593417",
    appId: "1:294034593417:web:73b69fa347eea667aa5858"
  };
  export default firebase.initializeApp(firebaseConfig);