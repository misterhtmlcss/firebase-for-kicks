firebase.initializeApp({
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
});
const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

const actionCodeSettings = {
  url: 'http://localhost:5004',
  handleCodeInApp: true // This must be true.
}

let userData;
const name = document.getElementById("name")
const email = document.getElementById("email")
const password = document.getElementById("password")
const login = document.getElementById("login")




login.addEventListener('click', () => {
  userData =  {
    name: name.value,
    email: email.value,
    password: password.value,
  }

  //console.log(e, userData)
  //writeUserData(name.value, email.value)
  signIn(userData.email, userData.password)

})

function signIn(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('sign in', errorCode, errorMessage);
    });

  firebase
    .auth()
    .onAuthStateChanged(function(user) {
      if (user) {
        writeUserData(userData.name, userData.email)
        console.log('user' , user)
      } else {
      console.log(`user not signed in: ${user}`)
      }
    });
}

function writeUserData(name, email) {
  firestore.collection("users").add({name, email})
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });

}