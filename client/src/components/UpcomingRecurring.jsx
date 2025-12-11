import React from 'react';

const UpcomingRecurring = ({ transactions }) => {
    const recurringTransactions = transactions.filter(t => t.isRecurring && t.type === 'outflow');

    if (recurringTransactions.length === 0) return null;

    return (
        <div>
            <h3>Upcoming Recurring Payments</h3>
            {/* This component can be expanded as needed */}
        </div>
    );
};

export default UpcomingRecurring;
