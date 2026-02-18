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

  // Login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Ensure Firestore profile still exists
      const profile = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!profile.exists()) {
        await signOut(auth);
        toast.error('Account has been removed. Please contact support.');
        throw new Error('Account removed');
      }
      toast.success('Login successful!');
      return userCredential.user;
    } catch (error) {
      toast.error('Invalid email or password');
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
    signInWithGoogle,
    signInWithApple,
    sendPhoneOTP,
    verifyPhoneOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};