// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, getRedirectResult, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect, signOut, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
  projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_FIREBASE_MSG_SNDR_ID}`,
  appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`
};

const provider = new GoogleAuthProvider();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const registerEmailPassword = async (email, password) => {
    try {
        const userCreds = await createUserWithEmailAndPassword(auth, email, password);
        return userCreds.user;
    } catch (error) {
        console.log(`${error.code}:${error.message}`);
    }
};

const signInEmailPw = async (email, password) => {
    try {
        const userCreds = await signInWithEmailAndPassword(auth, email, password);
        let userFirebaseSession = await userCreds.user.getIdToken();
        localStorage.setItem('firebaseSession', userFirebaseSession)
        return userCreds.user;
    } catch (error) {
        console.log(`${error.code}:${error.message}`);
    }
}

// const signInWithGoogleRedirect = signInWithRedirect(auth, provider)
const processGoogleRedirect = () => {
    getRedirectResult(auth)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
  });
}

const logout = () =>{
    signOut(auth).then(() => {}).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

export {
    auth,
    registerEmailPassword,
    signInEmailPw,
    processGoogleRedirect,
    logout
}