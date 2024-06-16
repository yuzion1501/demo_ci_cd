import {
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithPopup,
    updatePassword,
    confirmPasswordReset,
    applyActionCode,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if the user already exists in Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
            // If the user does not exist, set the role in Firestore
            await setDoc(doc(db, "users", user.uid), {
                role: "user",
                email: user.email,
                photoURL: user.photoURL,
                displayName: user.displayName,
                googleAuth: true,
                state: "enable",
            });
        }
        return user;
    } catch (error) {
        console.error("Error signing in with Google: ", error);
        throw error;
    }
};

export const doSignOut = () => {
    return auth.signOut();
};

// Accept verify code
export const doApplyActionCode = (oobCode) => {
    return applyActionCode(auth, oobCode);
};

// Gửi email ResetPassWord
export const doSendEmailPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email, {
        url: "https://fitviec-gpc3dcbsewfcffav.southeastasia-01.azurewebsites.net/sign_in",
    });
};
// You can't access this page without coming from a password reset email. If you do come from a password reset email, please make sure you used the full URL provided.
export const doResetPassword = (oobCode, newPassword) => {
    return confirmPasswordReset(auth, oobCode, newPassword);
};

// export const doPasswordChange = (password) => {
//     return updatePassword(auth.currentUser, password);
// }
