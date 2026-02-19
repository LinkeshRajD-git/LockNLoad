import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import toast from 'react-hot-toast';

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingPhone, setPendingPhone] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUser({ ...user, ...userDoc.data() });
        } else {
          // If the auth account exists but the profile is deleted, force logout
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign Up with Email
  const signUp = async (email, password, name, phone) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        phone,
        name,
        createdAt: new Date(),
        isVerified: false
      });

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Send OTP to Phone + Email
  const sendPhoneOTP = async (phoneNumber, email) => {
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, email: email || null })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to send OTP');
      }

      const data = await res.json();
      setPendingPhone(formattedPhone);
      toast.success(data.emailSent ? 'OTP sent to your phone & email!' : 'OTP sent to your phone!');
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
      throw error;
    }
  };

  // Verify Phone OTP
  const verifyPhoneOTP = async (otp) => {
    try {
      if (!pendingPhone) {
        throw new Error('No pending phone number');
      }

      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: pendingPhone, code: otp })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Invalid OTP');
      }

      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          isVerified: true,
          phone: pendingPhone
        }, { merge: true });

        setUser((current) => current ? { ...current, isVerified: true, phone: pendingPhone } : current);
      }

      setPendingPhone(null);
      toast.success('Phone verified successfully!');
      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
      throw error;
    }
  };

  // Send OTP to Email (primary method used in checkout)
  const sendEmailOTP = async (email) => {
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to send OTP');
      }

      setPendingEmail(email);
      toast.success('OTP sent to your email!');
      return true;
    } catch (error) {
      console.error('Error sending email OTP:', error);
      toast.error(error.message || 'Failed to send OTP. Please try again.');
      throw error;
    }
  };

  // Verify Email OTP
  const verifyEmailOTP = async (otp) => {
    try {
      const emailToVerify = pendingEmail;
      if (!emailToVerify) throw new Error('No pending email for OTP verification');

      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToVerify, code: otp })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Invalid OTP');
      }

      setPendingEmail(null);
      toast.success('Verified successfully!');
      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || 'Invalid OTP. Please try again.');
      throw error;
    }
  };

  // Reset Password
  const resetPassword = async (email) => {
    const { sendPasswordResetEmail } = await import('firebase/auth');
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
      return true;
    } catch (error) {
      const msgs = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/invalid-email': 'Invalid email address.',
      };
      toast.error(msgs[error.code] || 'Failed to send reset email.');
      throw error;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Ensure Firestore profile still exists
      const profile = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!profile.exists()) {
        await signOut(auth);
        toast.error('No account profile found. Please sign up first.');
        throw new Error('Account removed');
      }
      toast.success('Welcome back! 🔥');
      return userCredential.user;
    } catch (error) {
      if (error.message === 'Account removed') throw error;
      const errorMessages = {
        'auth/user-not-found': 'No account found with this email. Please sign up first.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-disabled': 'This account has been disabled. Contact support.',
        'auth/too-many-requests': 'Too many failed attempts. Please wait a few minutes and try again.',
        'auth/network-request-failed': 'Network error. Please check your internet connection.',
      };
      toast.error(errorMessages[error.code] || 'Login failed. Please try again.');
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName || '',
          phone: user.phoneNumber || '',
          createdAt: new Date(),
          isVerified: true,
          authProvider: 'google'
        });
      }
      
      toast.success('Signed in with Google!');
      return user;
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        return null;
      }
      console.error('Google sign-in error:', error);
      toast.error('Google sign-in failed');
      throw error;
    }
  };

  // Sign in with Apple
  const signInWithApple = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;
      
      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName || '',
          phone: user.phoneNumber || '',
          createdAt: new Date(),
          isVerified: true,
          authProvider: 'apple'
        });
      }
      
      toast.success('Signed in with Apple!');
      return user;
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        return null;
      }
      console.error('Apple sign-in error:', error);
      toast.error('Apple sign-in failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    signInWithApple,
    sendPhoneOTP,
    verifyPhoneOTP,
    sendEmailOTP,
    verifyEmailOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};