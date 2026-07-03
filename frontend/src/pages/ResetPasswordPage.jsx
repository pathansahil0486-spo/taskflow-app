import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { loadUser } = useAuth(); // used below to refresh auth state after auto-login

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, { password: form.password });
      toast.success('Password reset! Logging you in...');
      if (loadUser) await loadUser();
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authBg} />
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <span className={styles.logoIcon}>SP</span>
          <span className={styles.logoText}>TaskFlow</span>
        </div>
        <h1 className={styles.authTitle}>Set a new password</h1>
        <p className={styles.authSubtitle}>Choose a strong password you haven't used before.</p>

        <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">New password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className={`${styles.formInput} ${errors.password ? styles.inputError : ''}`}
              autoComplete="new-password"
            />
            {errors.password && <span className={styles.errorText}>⚠ {errors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="confirmPassword">Confirm new password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ''}`}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className={styles.errorText}>⚠ {errors.confirmPassword}</span>}
          </div>

          <button type="submit" className={styles.authBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : null}
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <p className={styles.authFooter}>
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}