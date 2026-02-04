import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('Пользователь с таким email уже существует');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Неверный формат email');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Пароль слишком слабый (минимум 6 символов)');
      } else {
        setAuthError('Ошибка регистрации. Попробуйте позже.');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (err) {
      if (err.code === 'auth/invalid-credential') {
        setAuthError('Неверный email или пароль');
      } else {
        setAuthError('Ошибка входа. Попробуйте позже.' + err.code);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return {
    user,
    authLoading,
    authMode,
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    authError,
    handleLogin,
    handleRegister,
    handleLogout,
  };
}