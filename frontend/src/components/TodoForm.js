import React, { useState, useEffect } from 'react';
import { useTodos } from '../context/TodoContext';
import styles from './TodoForm.module.css';

const PRIORITIES = ['low', 'medium', 'high'];

export default function TodoForm({ onClose, editTodo = null }) {
  const { createTodo, updateTodo, categories } = useTodos();
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium', category: 'General', dueDate: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTodo) {
      setForm({
        title: editTodo.title || '',
        description: editTodo.description || '',
        priority: editTodo.priority || 'medium',
        category: editTodo.category || 'General',
        dueDate: editTodo.dueDate ? editTodo.dueDate.substring(0, 10) : '',
      });
    }
  }, [editTodo]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.trim().length > 200) e.title = 'Title too long';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = { ...form, title: form.title.trim(), dueDate: form.dueDate || null };
      if (editTodo) {
        await updateTodo(editTodo._id, payload);
      } else {
        await createTodo(payload);
      }
      onClose();
    } catch {
      // error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal ${styles.modal}`}>
        <div className="modal-header">
          <h2 className="modal-title">{editTodo ? 'Edit Task' : 'New Task'}</h2>
          <button type="button" className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="todoTitle">Title *</label>
            <input
              id="todoTitle"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={`form-input ${errors.title ? 'error' : ''}`}
              autoFocus
            />
            {errors.title && <span className="form-error">⚠ {errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="todoDescription">Description</label>
            <textarea
              id="todoDescription"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add details (optional)"
              className={`form-input ${styles.textarea}`}
              rows={3}
            />
          </div>

          <div className={styles.row}>
            <div className="form-group">
              <label className="form-label" htmlFor="todoPriority">Priority</label>
              <select id="todoPriority" name="priority" value={form.priority} onChange={handleChange} className="form-input">
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="todoCategory">Category</label>
              <input
                id="todoCategory"
                name="category"
                value={form.category}
                onChange={handleChange}
                list="category-list"
                placeholder="e.g. Work, Personal"
                className="form-input"
              />
              <datalist id="category-list">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="todoDueDate">Due Date</label>
            <input
              id="todoDueDate"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="form-input"
              min={new Date().toISOString().substring(0, 10)}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className={`spinner ${styles.btnSpinner}`} /> : null}
              {loading ? 'Saving...' : editTodo ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}