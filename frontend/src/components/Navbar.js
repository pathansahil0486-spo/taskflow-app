import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click — important on mobile where there's
  // no natural "click elsewhere" affordance otherwise
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setConfirmingLogout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset the confirmation state whenever the dropdown is closed/reopened,
  // so it never opens back up already sitting on the confirm step
  const toggleMenu = () => {
    setMenuOpen((v) => !v);
    setConfirmingLogout(false);
  };

  const handleLogoutClick = () => {
    setConfirmingLogout(true);
  };

  const handleLogoutCancel = () => {
    setConfirmingLogout(false);
  };

  const handleLogoutConfirm = async () => {
    setMenuOpen(false);
    setConfirmingLogout(false);
    await logout(); // must await — logout() calls the backend to clear the httpOnly cookie
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/dashboard" className={styles.brand}>
          <span className={styles.brandIcon}>SP</span>
          <span className={styles.brandText}>TaskFlow</span>
        </Link>

        <div className={styles.navLinks}>
          <Link
            to="/dashboard"
            className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.active : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className={`${styles.navLink} ${location.pathname === '/profile' ? styles.active : ''}`}
          >
            Profile
          </Link>
        </div>

        <div className={styles.navRight}>
          <div className={styles.userMenu} ref={menuRef}>
            <button
              type="button"
              className={styles.avatar}
              onClick={toggleMenu}
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              {initials}
            </button>
            {menuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownUser}>
                  <span className={styles.dropdownName}>{user?.name}</span>
                  <span className={styles.dropdownEmail}>{user?.email}</span>
                </div>
                <div className="divider" />
                <Link to="/profile" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                  ⚙ Settings
                </Link>

                {!confirmingLogout ? (
                  <button
                    type="button"
                    className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                    onClick={handleLogoutClick}
                  >
                    ↩ Sign out
                  </button>
                ) : (
                  <div className={styles.logoutConfirm}>
                    <span className={styles.logoutConfirmText}>Sign out?</span>
                    <div className={styles.logoutConfirmActions}>
                      <button
                        type="button"
                        className={styles.logoutCancelBtn}
                        onClick={handleLogoutCancel}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={styles.logoutConfirmBtn}
                        onClick={handleLogoutConfirm}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}