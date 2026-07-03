import React from 'react';
import { useTodos } from '../context/TodoContext';
import styles from './FilterBar.module.css';

const STATUS_TABS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'false' },
  { label: 'Completed', value: 'true' },
];

const PRIORITY_OPTIONS = [
  { label: 'All priorities', value: '' },
  { label: '🔴 High', value: 'high' },
  { label: '🟡 Medium', value: 'medium' },
  { label: '🟢 Low', value: 'low' },
];

export default function FilterBar() {
  const { filters, setFilters, fetchTodos, categories } = useTodos();

  const handleFilter = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    fetchTodos(updated);
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="search"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleFilter('search', e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`${styles.tab} ${filters.completed === tab.value ? styles.activeTab : ''}`}
            onClick={() => handleFilter('completed', tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.selects}>
        <select
          value={filters.priority}
          onChange={(e) => handleFilter('priority', e.target.value)}
          className={styles.select}
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => handleFilter('category', e.target.value)}
          className={styles.select}
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
}