import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import styles from './TodoItem.module.css';

const PRIORITY_ICONS = { high: '🔴', medium: '🟡', low: '🟢' };

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const date = parseISO(dateStr);
  if (isToday(date)) return { label: 'Today', overdue: false };
  if (isTomorrow(date)) return { label: 'Tomorrow', overdue: false };
  if (isPast(date)) return { label: format(date, 'MMM d'), overdue: true };
  return { label: format(date, 'MMM d'), overdue: false };
}

export default function TodoItem({ todo, onEdit }) {
  const { updateTodo, deleteTodo } = useTodos();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    try { await updateTodo(todo._id, { completed: !todo.completed }); }
    finally { setToggling(false); }
  };

  const handleDeleteClick = () => setConfirmOpen(true);

  const handleConfirmDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteTodo(todo._id);
      setConfirmOpen(false);
    } catch {
      setDeleting(false);
    }
  };

  const due = formatDueDate(todo.dueDate);

  return (
    <div className={`${styles.item} ${todo.completed ? styles.completed : ''} fade-in`}>
      <button
        type="button"
        className={`${styles.checkbox} ${todo.completed ? styles.checked : ''}`}
        onClick={handleToggle}
        disabled={toggling}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && <span className={styles.checkmark}>✓</span>}
      </button>

      <div className={styles.content} onClick={() => !todo.completed && onEdit(todo)}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{todo.title}</span>
          <span className={`priority-badge ${todo.priority} ${styles.priorityBadge}`}>
            {PRIORITY_ICONS[todo.priority]} {todo.priority}
          </span>
        </div>

        {todo.description && (
          <p className={styles.description}>{todo.description}</p>
        )}

        <div className={styles.meta}>
          {todo.category && todo.category !== 'General' && (
            <span className={styles.category}>📁 {todo.category}</span>
          )}
          {due && (
            <span className={`${styles.dueDate} ${due.overdue ? styles.overdue : ''}`}>
              📅 {due.label}{due.overdue ? ' — Overdue' : ''}
            </span>
          )}
          {todo.completed && todo.completedAt && (
            <span className={styles.completedAt}>
              ✓ Done {format(parseISO(todo.completedAt), 'MMM d')}
            </span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        {!todo.completed && (
          <button
            type="button"
            className={`btn btn-icon btn-ghost ${styles.editBtn}`}
            onClick={() => onEdit(todo)}
            title="Edit task"
          >
            ✎
          </button>
        )}
       <button
  type="button"
  className={`btn btn-icon ${styles.deleteBtn}`}
  onClick={handleDeleteClick}
  title="Delete task"
  aria-label="Delete task"
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 6H5H21M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
</button>
      </div>

      {confirmOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget && !deleting) setConfirmOpen(false); }}
        >
          <div className={`modal ${styles.confirmModal}`}>
            <div className="modal-header">
              <h2 className="modal-title">Delete task?</h2>
              <button
                type="button"
                className="btn btn-icon btn-ghost"
                onClick={() => setConfirmOpen(false)}
                aria-label="Close"
                disabled={deleting}
              >
                ✕
              </button>
            </div>

            <p className={styles.confirmText}>
              This will permanently delete <strong>"{todo.title}"</strong>. This can't be undone.
            </p>

            <div className={styles.confirmActions}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? <span className={`spinner ${styles.smallSpinner}`} /> : null}
                {deleting ? 'Deleting...' : 'Delete task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}