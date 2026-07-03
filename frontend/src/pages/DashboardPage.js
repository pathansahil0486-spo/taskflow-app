import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTodos } from '../context/TodoContext';
import Navbar from '../components/Navbar';
import StatsBar from '../components/StatsBar';
import FilterBar from '../components/FilterBar';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const { todos, loading, fetchTodos, fetchCategories, clearCompleted, toggleAll, stats } = useTodos();
  const [showForm, setShowForm] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (todo) => {
    setEditTodo(todo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTodo(null);
    fetchTodos();
    fetchCategories();
  };

  const allCompleted = stats.total > 0 && stats.completed === stats.total;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerText}>
              <h1 className={styles.greeting}>
                {getGreeting()}, <span className={styles.name}>{firstName}</span> 👋
              </h1>
              <p className={styles.subtitle}>
                {stats.pending > 0
                  ? `You have ${stats.pending} task${stats.pending !== 1 ? 's' : ''} to complete`
                  : stats.total > 0 ? '🎉 All tasks completed!' : 'Add a task to get started'}
              </p>
            </div>
            <button
              type="button"
              className={`btn btn-primary ${styles.newTaskBtn}`}
              onClick={() => setShowForm(true)}
            >
              + New Task
            </button>
          </div>

          {/* Stats */}
          {stats.total > 0 && <StatsBar />}

          {/* Filters */}
          <FilterBar />

          {/* Bulk actions */}
          {stats.total > 0 && (
            <div className={styles.bulkActions}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => toggleAll(!allCompleted)}
              >
                {allCompleted ? '↩ Mark all pending' : '✓ Complete all'}
              </button>
              {stats.completed > 0 && (
                <button type="button" className="btn btn-danger btn-sm" onClick={clearCompleted}>
                  🗑 Clear completed ({stats.completed})
                </button>
              )}
              <span className={styles.todoCount}>
                {todos.length} task{todos.length !== 1 ? 's' : ''} shown
              </span>
            </div>
          )}

          {/* Todo list */}
          <div className={styles.todoList}>
            {loading ? (
              <div className={styles.loadingWrapper}>
                <LoadingSpinner size={28} />
                <p className={styles.loadingText}>Loading tasks...</p>
              </div>
            ) : todos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <p className="empty-state-title">No tasks found</p>
                <p className="empty-state-desc">
                  Create a new task or adjust your filters to see tasks here.
                </p>
                <button
                  type="button"
                  className={`btn btn-primary ${styles.emptyStateBtn}`}
                  onClick={() => setShowForm(true)}
                >
                  + Create your first task
                </button>
              </div>
            ) : (
              todos.map((todo, i) => (
                <div key={todo._id} style={{ animationDelay: `${i * 30}ms` }}>
                  <TodoItem todo={todo} onEdit={handleEdit} />
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {showForm && (
        <TodoForm onClose={handleCloseForm} editTodo={editTodo} />
      )}
    </div>
  );
}