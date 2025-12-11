import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Repeat, ArrowUpDown } from 'lucide-react';
import { formatDate } from '../config/utilities';

const TransactionList = ({ transactions }) => {
    const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'

    const toggleSort = () => {
        setSortOrder(prev => prev === 'latest' ? 'oldest' : 'latest');
    };

    const sortedTransactions = [...transactions].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

    const styles = {
        container: {
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
        },
        header: {
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
        },
        title: {
            fontSize: 'clamp(1rem, 3.5vw, 1.25rem)',
            fontWeight: '600',
        },
        sortButton: {
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            padding: '0.5rem 0.875rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
        },
        list: {
            listStyle: 'none',
        },
        item: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'clamp(0.875rem, 2.5vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
            borderBottom: '1px solid var(--border)',
            transition: 'background 0.2s',
            gap: '0.75rem',
        },
        left: {
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.75rem, 2vw, 1rem)',
            flex: 1,
            minWidth: 0,
        },
        icon: (type) => ({
            background: type === 'inflow' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            color: type === 'inflow' ? 'var(--success)' : 'var(--danger)',
            padding: 'clamp(0.4rem, 1.5vw, 0.5rem)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }),
        info: {
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            flex: 1,
        },
        source: {
            fontWeight: '500',
            color: 'var(--text-primary)',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        meta: {
            fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
        },
        amount: (type) => ({
            fontWeight: '600',
            fontSize: 'clamp(0.9rem, 3vw, 1rem)',
            color: type === 'inflow' ? 'var(--success)' : 'var(--text-primary)',
            flexShrink: 0,
            whiteSpace: 'nowrap',
        }),
        empty: {
            padding: 'clamp(2rem, 5vw, 3rem)',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
        }
    };

    if (!transactions.length) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h3 style={styles.title}>Recent Transactions</h3>
                </div>
                <div style={styles.empty}>
                    No transactions yet. Add some to get started!
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>Recent Transactions</h3>
                <button style={styles.sortButton} onClick={toggleSort}>
                    <ArrowUpDown size={16} />
                    {sortOrder === 'latest' ? 'Latest First' : 'Oldest First'}
                </button>
            </div>
            <ul style={styles.list}>
                {sortedTransactions.map(t => (
                    <li key={t._id || t.id} style={styles.item}>
                        <div style={styles.left}>
                            <div style={styles.icon(t.type)}>
                                {t.type === 'inflow' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                            </div>
                            <div style={styles.info}>
                                <span style={styles.source}>{t.source}</span>
                                <span style={styles.meta}>
                                    {formatDate(t.date)}
                                    {t.isRecurring && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)' }}>
                                            <Repeat size={12} /> Monthly
                                        </span>
                                    )}
                                    {t.bankName && ` • ${t.bankName}`}
                                </span>
                            </div>
                        </div>
                        <span style={styles.amount(t.type)}>
                            {t.type === 'inflow' ? '+' : '-'}₹{Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;
