const Todo = require('../models/Todo');
const { validationResult } = require('express-validator');

// @desc    Get all todos for user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const { completed, priority, category, search, sort = '-createdAt', page = 1, limit = 50 } = req.query;

    const query = { user: req.user._id };

    if (completed !== undefined) query.completed = completed === 'true';
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [todos, total] = await Promise.all([
      Todo.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      Todo.countDocuments(query),
    ]);

    // Stats
    const stats = await Todo.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          pending: { $sum: { $cond: ['$completed', 0, 1] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
        },
      },
    ]);

    res.json({
      success: true,
      count: todos.length,
      total,
      pagination: { page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
      stats: stats[0] || { total: 0, completed: 0, pending: 0, high: 0, medium: 0, low: 0 },
      todos,
    });
  } catch (error) {
    console.error('GetTodos error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, description, priority, category, dueDate } = req.body;

    const todo = await Todo.create({
      user: req.user._id,
      title,
      description,
      priority,
      category,
      dueDate: dueDate || null,
    });

    res.status(201).json({ success: true, message: 'Todo created', todo });
  } catch (error) {
    console.error('CreateTodo error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
const getTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });
    res.json({ success: true, todo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });

    const allowed = ['title', 'description', 'completed', 'priority', 'category', 'dueDate', 'order'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) todo[field] = req.body[field];
    });

    await todo.save();
    res.json({ success: true, message: 'Todo updated', todo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });
    res.json({ success: true, message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete all completed todos
// @route   DELETE /api/todos/completed/clear
// @access  Private
const clearCompleted = async (req, res) => {
  try {
    const result = await Todo.deleteMany({ user: req.user._id, completed: true });
    res.json({ success: true, message: `Cleared ${result.deletedCount} completed todos` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle complete all
// @route   PUT /api/todos/toggle-all
// @access  Private
const toggleAll = async (req, res) => {
  try {
    const { completed } = req.body;
    await Todo.updateMany({ user: req.user._id }, { completed, completedAt: completed ? new Date() : null });
    res.json({ success: true, message: `All todos marked as ${completed ? 'completed' : 'pending'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get categories
// @route   GET /api/todos/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Todo.distinct('category', { user: req.user._id });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getTodos, createTodo, getTodo, updateTodo, deleteTodo, clearCompleted, toggleAll, getCategories };
