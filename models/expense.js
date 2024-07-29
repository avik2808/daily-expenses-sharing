const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    percentage: Number
});

const expenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    splitType: { type: String, enum: ['equal', 'exact', 'percentage'], required: true },
    participants: [participantSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
