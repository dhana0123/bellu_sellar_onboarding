import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, sendEmailVerification, createUserWithEmailAndPassword } from "firebase/auth";

// Validate Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase credentials are properly configured
const isFirebaseConfigured = firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.appId &&
  firebaseConfig.apiKey !== 'undefined' &&
  firebaseConfig.projectId !== 'undefined' &&
  firebaseConfig.appId !== 'undefined';

let app: any = null;
let auth: any = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { auth };

export class FirebaseService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  initializeRecaptcha(elementId: string = 'recaptcha-container') {
    if (!auth || !isFirebaseConfigured) {
      throw new Error('Firebase not configured properly');
    }
    
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          // Response expired
        }
      });
    }
    return this.recaptchaVerifier;
  }

  async sendEmailVerification(email: string) {
    if (!auth || !isFirebaseConfigured) {
      return { success: false, error: 'Firebase not configured. Please check your API credentials.' };
    }

    try {
      // Create a temporary user for email verification
      const userCredential = await createUserWithEmailAndPassword(auth, email, Math.random().toString(36));
      await sendEmailVerification(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Email verification error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPhoneVerification(phoneNumber: string) {
    if (!auth || !isFirebaseConfigured) {
      return { success: false, error: 'Firebase not configured. Please check your API credentials.' };
    }

    try {
      const appVerifier = this.initializeRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return { success: true, confirmationResult };
    } catch (error: any) {
      console.error('Phone verification error:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyPhoneOTP(confirmationResult: any, otp: string) {
    try {
      const result = await confirmationResult.confirm(otp);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('OTP verification error:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyEmailOTP(user: any) {
    try {
      await user.reload();
      return { success: true, verified: user.emailVerified };
    } catch (error: any) {
      console.error('Email verification check error:', error);
      return { success: false, error: error.message };
    }
  }

  isConfigured() {
    return isFirebaseConfigured;
  }
}

export const firebaseService = new FirebaseService();
