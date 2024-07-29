exports.validateExpense = (amount, splitType, participants) => {
    if (!amount || amount <= 0) {
        return 'Invalid amount';
    }
    if (!participants || participants.length === 0) {
        return 'Participants required';
    }

    if (splitType === 'percentage') {
        const totalPercentage = participants.reduce((total, p) => total + p.percentage, 0);
        if (totalPercentage !== 100) {
            return 'Total percentage must add up to 100%';
        }
    } else if (splitType === 'exact') {
        const totalAmount = participants.reduce((total, p) => total + p.amount, 0);
        if (totalAmount !== amount) {
            return 'Total exact amounts must equal the total expense amount';
        }
    }

    return null;
};
