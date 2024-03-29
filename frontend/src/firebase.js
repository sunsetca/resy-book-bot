import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore";
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
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SNDR_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const provider = new GoogleAuthProvider();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const registerEmailPassword = async (email, password, displayName, phoneNumber) => {
    try {
        const userCreds = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);
        await updateProfile(auth.currentUser, { displayName: displayName, phoneNumber: phoneNumber });
        return {user: userCreds.user, firebaseUID: userCreds.user.uid};
    } catch (error) {
        console.log(`${error.code}:${error.message}`);
    }
};

const signInEmailPw = async (email, password) => {
    try {
        const userCreds = await signInWithEmailAndPassword(auth, email, password);
        return userCreds.user
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
            return {user: user, firebaseUID: user.uid}
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
            return {user: user, firebaseUID: user.uid};
        } else {
            return {user: null, firebaseUID: null};
        }
    })
}

const logout = async () => {
    return await signOut(auth).then(() => {}).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email).then(() => {}).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

const getResyToken = async (firebaseUID) => {
    const docRef = doc(firestore, "resy_tokens", firebaseUID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()){
        return docSnap.data();
    } else {
        return null;
    }
}

export {
    auth,
    getResyToken,
    isLoggedIn,
    registerEmailPassword,
    resetPassword,
    signInEmailPw,
    signInWithGoogle,
    processSignInWithGoogle,
    logout
}