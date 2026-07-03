import React from 'react';
import { useTodos } from '../context/TodoContext';
import styles from './StatsBar.module.css';

export default function StatsBar() {
  const { stats } = useTodos();
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className={styles.statsBar}>
      <div className={styles.stat}>
        <span className={styles.statValue}>{stats.total}</span>
        <span className={styles.statLabel}>Total</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={`${styles.statValue} ${styles.pending}`}>{stats.pending}</span>
        <span className={styles.statLabel}>Pending</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={`${styles.statValue} ${styles.completed}`}>{stats.completed}</span>
        <span className={styles.statLabel}>Done</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={`${styles.statValue} ${styles.high}`}>{stats.high || 0}</span>
        <span className={styles.statLabel}>High Priority</span>
      </div>
      <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <span className={styles.progressLabel}>{completionRate}% complete</span>
      </div>
    </div>
  );
}