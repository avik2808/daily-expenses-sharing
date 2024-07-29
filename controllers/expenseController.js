const { parse } = require('json2csv');
const Expense = require('../models/expense');
const { validateExpense } = require('../utils/validation');

exports.addExpense = async (req, res) => {
    try {
        const { description, amount, splitType, participants } = req.body;

        const validationError = validateExpense(amount, splitType, participants);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        let calculatedParticipants = [];

        if (splitType === 'equal') {
            const splitAmount = amount / participants.length;
            calculatedParticipants = participants.map(participant => ({
                user: participant.user,
                amount: splitAmount,
                percentage: (splitAmount / amount) * 100
            }));
        } else if (splitType === 'exact') {
            calculatedParticipants = participants.map(participant => ({
                user: participant.user,
                amount: participant.amount,
                percentage: (participant.amount / amount) * 100
            }));
        } else if (splitType === 'percentage') {
            calculatedParticipants = participants.map(participant => ({
                user: participant.user,
                amount: (participant.percentage / 100) * amount,
                percentage: participant.percentage
            }));
        }

        const expense = new Expense({ description, amount, splitType, participants: calculatedParticipants });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ 'participants.user': req.user.id }).populate('participants.user', 'name email');
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().populate('participants.user', 'name email');
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.downloadBalanceSheet = async (req, res) => {
    try {
        const expenses = await Expense.find().populate('participants.user', 'name email');

        let balanceSheet = expenses.map(expense => {
            let splitDetails = expense.participants.map(participant => ({
                description: expense.description,
                user: participant.user.name,
                email: participant.user.email,
                amount: participant.amount,
                percentage: participant.percentage,
                createdAt: expense.createdAt
            }));
            return splitDetails;
        }).flat();

        const csv = parse(balanceSheet, { fields: ['description', 'user', 'email', 'amount', 'percentage', 'createdAt'] });
        res.header('Content-Type', 'text/csv');
        res.attachment('balance-sheet.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
