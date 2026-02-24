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
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUser({ ...user, ...userDoc.data() });
          } else {
            // If profile doesn't exist, create it automatically (for social logins)
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              name: user.displayName || '',
              phone: user.phoneNumber || '',
              createdAt: new Date(),
              isVerified: true,
              authProvider: user.providerData?.[0]?.providerId || 'email'
            }, { merge: true });
            // Set user with the created profile
            setUser({ 
              ...user,
              email: user.email,
              name: user.displayName || '',
              phone: user.phoneNumber || '',
              isVerified: true
            });
          }
        } catch (error) {
          console.error('Error syncing user profile:', error);
          // Still set user even if profile sync fails
          setUser(user);
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

  // OTP-related functions removed per project settings (email/OTP flows disabled)

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
      toast.success('Signed in with Google!');
      return result.user;
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        return null;
      }
      console.error('Google sign-in error:', error);
      toast.error('Google sign-in failed: ' + error.message);
      throw error;
    }
  };

  // Sign in with Apple
  const signInWithApple = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      toast.success('Signed in with Apple!');
      return result.user;
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        return null;
      }
      console.error('Apple sign-in error:', error);
      toast.error('Apple sign-in failed: ' + error.message);
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
    // OTP functions removed
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};