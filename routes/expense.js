const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, expenseController.addExpense);
router.get('/user', authMiddleware, expenseController.getUserExpenses);
router.get('/', authMiddleware, expenseController.getAllExpenses);
router.get('/download', authMiddleware, expenseController.downloadBalanceSheet);

module.exports = router;
