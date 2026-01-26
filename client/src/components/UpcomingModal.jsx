import React from 'react';
import { X, Calendar, Repeat } from 'lucide-react';
import { formatDate } from '../config/utilities';

const UpcomingModal = ({ isOpen, onClose, transactions }) => {
    if (!isOpen) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const recurringTransactions = transactions.filter(t => t.type === 'outflow' && t.isRecurring && new Date(t.date) >= today);
    const sortedRecurringTransactions = recurringTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem',
        },
        modal: {
            background: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            width: '100%',
            maxWidth: '500px',
            boxShadow: 'var(--shadow)',
            maxHeight: '80vh',
            overflowY: 'auto',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
        },
        title: {
            fontSize: '1.25rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        closeBtn: {
            background: 'transparent',
            color: 'var(--text-secondary)',
            padding: '0.5rem',
        },
        list: {
            listStyle: 'none',
        },
        item: {
            padding: '1rem',
            background: 'var(--bg-primary)',
            borderRadius: '8px',
            marginBottom: '0.75rem',
            border: '1px solid var(--border)',
        },
        itemHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
        },
        source: {
            fontWeight: '600',
            color: 'var(--text-primary)',
        },
        amount: {
            fontWeight: '600',
            color: 'var(--danger)',
        },
        details: {
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
        },
        badge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.25rem 0.5rem',
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--accent-primary)',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '500',
        },
        dueTodayPill: {
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            padding: '0.25rem 0.625rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '700',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            textTransform: 'uppercase',
            marginLeft: '0.5rem'
        }
    };

    const isToday = (dateStr) => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
    };

    return (
        <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>
                        <Calendar size={24} />
                        Upcoming Recurring Payments
                    </h2>
                    <button style={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>

                {sortedRecurringTransactions.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                        No recurring payments found
                    </p>
                ) : (
                    <ul style={styles.list}>
                        {sortedRecurringTransactions.map(t => (
                            <li key={t._id || t.id} style={styles.item}>
                                <div style={styles.itemHeader}>
                                    <span style={styles.source}>{t.source}</span>
                                    <span style={styles.amount}>₹{Number(t.amount).toLocaleString()}</span>
                                </div>
                                <div style={styles.details}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <span style={styles.badge}>
                                            <Repeat size={12} />
                                            Monthly Payment
                                        </span>
                                        {isToday(t.date) && t.type === 'outflow' && <span style={styles.dueTodayPill}>Due Today</span>}
                                    </div>
                                    {t.bankName && <span>Bank: {t.bankName}</span>}
                                    {t.date && <span>Date: {formatDate(t.date)}</span>}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UpcomingModal;
