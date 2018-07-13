firebase.initializeApp({
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket:STORAGE_BUCKET,
});

const timestamp = Number(new Date());
const firestore = firebase.firestore();
let ref = firebase.storage().ref();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

const actionCodeSettings = {
  url: 'http://localhost:5004',
  handleCodeInApp: true // This must be true.
}

let userData
const name = document.getElementById("name")
const email = document.getElementById("email")
const password = document.getElementById("password")
const login = document.getElementById("login")
const fileUpload = document.getElementById("fileUpload");
const upload = document.getElementById("upload");

function getFileObj(file) { //fileUpload
  if(file){
    const fileName = `${timestamp} - ${file.name}`;
    const metadata = { contentType: file.type };

    ref.put(file, metadata)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => console.log(url))
  }
}

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
  .then(docRef => {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch(error => {
      console.error("Error adding document: ", error);
  });
}

login.addEventListener('click', () => {
  userData =  {
    name: name.value,
    email: email.value,
    password: password.value,
  }
  signIn(userData.email, userData.password)
})

fileUpload.addEventListener('click', getFileObj(fileUpload.files[0]))
