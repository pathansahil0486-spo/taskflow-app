import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email.trim())) { setError('Invalid email address'); return; }

    setLoading(true);
    try {
      await authAPI.forgotPassword({ email: email.trim().toLowerCase() });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authBg} />
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <span className={styles.logoIcon}>SP</span>
          <span className={styles.logoText}>TaskFlow</span>
        </div>

        {sent ? (
          <>
            <h1 className={styles.authTitle}>Check your email</h1>
            <p className={styles.authSubtitle}>
              If an account exists for <strong>{email}</strong>, we've sent a link to reset your password. It expires in 30 minutes.
            </p>
            <p className={styles.authFooter} style={{ marginTop: 24 }}>
              <Link to="/login">Back to sign in</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.authTitle}>Forgot password?</h1>
            <p className={styles.authSubtitle}>
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  className={`${styles.formInput} ${error ? styles.inputError : ''}`}
                  autoComplete="email"
                />
                {error && <span className={styles.errorText}>⚠ {error}</span>}
              </div>

              <button type="submit" className={styles.authBtn} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : null}
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <p className={styles.authFooter}>
              Remembered it?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}