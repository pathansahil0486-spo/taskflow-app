import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleProfileChange = (e) => {
    setProfileForm({ name: e.target.value });
    if (profileErrors.name) setProfileErrors({});
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profileForm.name.trim()) errs.name = 'Name is required';
    else if (profileForm.name.trim().length > 50) errs.name = 'Name too long';
    if (Object.keys(errs).length) { setProfileErrors(errs); return; }

    setProfileLoading(true);
    try {
      const { data } = await authAPI.updateProfile({ name: profileForm.name.trim() });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordFieldChange = (field) => (e) => {
    setPasswordForm((p) => ({ ...p, [field]: e.target.value }));
    setPasswordErrors((p) => ({ ...p, [field]: '' }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.currentPassword) errs.currentPassword = 'Required';
    if (!passwordForm.newPassword) errs.newPassword = 'Required';
    else if (passwordForm.newPassword.length < 6) errs.newPassword = 'Min 6 characters';
    if (!passwordForm.confirmPassword) errs.confirmPassword = 'Required';
    else if (passwordForm.newPassword !== passwordForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setPasswordErrors(errs); return; }

    setPasswordLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Account Settings</h1>
            <p className={styles.subtitle}>Manage your profile and security</p>
          </div>

          {/* Avatar + info */}
          <div className={`card ${styles.profileCard}`}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>{initials}</div>
              <div className={styles.userInfo}>
                <p className={styles.userName}>{user?.name}</p>
                <p className={styles.userEmail}>{user?.email}</p>
                <p className={styles.userSince}>
                  Member since{' '}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Edit profile */}
          <div className="card">
            <h2 className={styles.sectionTitle}>Edit Profile</h2>
            <form onSubmit={handleProfileSubmit} className={styles.form} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="profileName">Full Name</label>
                <input
                  id="profileName"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className={`form-input ${profileErrors.name ? 'error' : ''}`}
                  placeholder="Your name"
                />
                {profileErrors.name && <span className="form-error">⚠ {profileErrors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profileEmail">Email Address</label>
                <input
                  id="profileEmail"
                  value={user?.email || ''}
                  className={`form-input ${styles.disabledInput}`}
                  disabled
                />
                <span className={styles.hintText}>Email cannot be changed</span>
              </div>
              <div className={styles.formFooter}>
                <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                  {profileLoading ? <span className={`spinner ${styles.btnSpinner}`} /> : null}
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Change password */}
          <div className="card">
            <h2 className={styles.sectionTitle}>Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className={styles.form} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordFieldChange('currentPassword')}
                  className={`form-input ${passwordErrors.currentPassword ? 'error' : ''}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                {passwordErrors.currentPassword && <span className="form-error">⚠ {passwordErrors.currentPassword}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordFieldChange('newPassword')}
                  className={`form-input ${passwordErrors.newPassword ? 'error' : ''}`}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                {passwordErrors.newPassword && <span className="form-error">⚠ {passwordErrors.newPassword}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordFieldChange('confirmPassword')}
                  className={`form-input ${passwordErrors.confirmPassword ? 'error' : ''}`}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                />
                {passwordErrors.confirmPassword && <span className="form-error">⚠ {passwordErrors.confirmPassword}</span>}
              </div>
              <div className={styles.formFooter}>
                <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                  {passwordLoading ? <span className={`spinner ${styles.btnSpinner}`} /> : null}
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}