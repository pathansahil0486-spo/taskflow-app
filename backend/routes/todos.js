const express = require('express');
const { body } = require('express-validator');
const {
  getTodos, createTodo, getTodo, updateTodo, deleteTodo,
  clearCompleted, toggleAll, getCategories,
} = require('../controllers/todoController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const todoValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
];

// All routes protected
router.use(protect);

router.get('/categories', getCategories);
router.delete('/completed/clear', clearCompleted);
router.put('/toggle-all', toggleAll);

router.route('/').get(getTodos).post(todoValidation, createTodo);
router.route('/:id').get(getTodo).put(updateTodo).delete(deleteTodo);

module.exports = router;
