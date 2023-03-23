// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    getRedirectResult, 
    createUserWithEmailAndPassword, 
    sendEmailVerification,
    signInWithEmailAndPassword, 
    signInWithRedirect, 
    signOut, 
    updateProfile,
    GoogleAuthProvider, 
    onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SNDR_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const provider = new GoogleAuthProvider();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const registerEmailPassword = async (email, password, displayName, phoneNumber) => {
    console.log(firebaseConfig);
    try {
        const userCreds = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);
        await updateProfile(auth.currentUser, { displayName: displayName, phoneNumber: phoneNumber });
        return userCreds.user;
    } catch (error) {
        console.log(`${error.code}:${error.message}`);
    }
};

const signInEmailPw = async (email, password) => {
    try {
        const userCreds = await signInWithEmailAndPassword(auth, email, password);
        let userFirebaseSession = await userCreds.user.getIdToken();
        return {user: userCreds.user, firebaseToken: userFirebaseSession}
    } catch (error) {
        console.log(`${error.code}:${error.message}`);
    }
}

const signInWithGoogle = async () => {
    provider.addScope("https://www.googleapis.com/auth/user.phonenumbers.read");
    return await signInWithRedirect(auth, provider);
}
const processSignInWithGoogle = async () => {
    await getRedirectResult(auth)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
            let userFirebaseSession = await user.getIdToken();
            return {user: user, firebaseToken: userFirebaseSession}
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.error(`${errorCode}: ${errorMessage}: ${email}: ${credential}`);
  });
}

const isLoggedIn = async () => {
    return await onAuthStateChanged(auth, async (user) => {
        if (user) {
            let userFirebaseSession = await user.getIdToken();
            return {user: user, firebaseToken: userFirebaseSession};
        } else {
            return {user: null, firebaseToken: null};
        }
    })
}

const logout = () => {
    signOut(auth).then(() => {}).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

export {
    auth,
    isLoggedIn,
    registerEmailPassword,
    signInEmailPw,
    signInWithGoogle,
    processSignInWithGoogle,
    logout
}