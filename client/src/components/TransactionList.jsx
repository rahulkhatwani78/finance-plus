import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Repeat, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '../config/utilities';

const TransactionList = ({ transactions, onEdit, onDelete, username, isMobile }) => {
    const [sortOrder, setSortOrder] = useState(username === 'dad' ? 'latest' : 'oldest'); // 'latest' or 'oldest'

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
            ...(isMobile ? {
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
                lineHeight: '1.4',
            } : {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }),
        },
        meta: {
            fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
        },
        right: {
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.75rem, 2vw, 1.25rem)',
            flexShrink: 0,
        },
        amount: (type) => ({
            fontWeight: '600',
            fontSize: 'clamp(0.9rem, 3vw, 1rem)',
            color: type === 'inflow' ? 'var(--success)' : 'var(--text-primary)',
            whiteSpace: 'nowrap',
        }),
        actions: {
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
        },
        actionBtn: {
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        empty: {
            padding: 'clamp(2rem, 5vw, 3rem)',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
        },
        dueTodayPill: {
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '600',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
        }
    };

    const isToday = (dateStr) => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
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
                                {t.type === 'inflow' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div style={styles.info}>
                                <span style={styles.source}>{t.source}</span>
                                <span style={styles.meta}>
                                    {formatDate(t.date)}
                                    {isToday(t.date) && t.isRecurring && (
                                        <span style={styles.dueTodayPill}>Due Today</span>
                                    )}
                                    {t.category && (
                                        <span style={{ 
                                            background: 'var(--bg-primary)', 
                                            padding: '2px 8px', 
                                            borderRadius: '4px', 
                                            fontSize: '0.75rem',
                                            border: '1px solid var(--border)',
                                            color: 'var(--text-primary)'
                                        }}>
                                            {t.category}
                                        </span>
                                    )}
                                    {t.isRecurring && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)' }}>
                                            <Repeat size={12} /> Monthly
                                        </span>
                                    )}
                                    {t.bankName && ` • ${t.bankName}`}
                                </span>
                            </div>
                        </div>
                        <div style={styles.right}>
                            <span style={styles.amount(t.type)}>
                                {t.type === 'inflow' ? '+' : '-'}₹{Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            {username !== 'dad' && (
                                <div style={styles.actions}>
                                    <button 
                                        style={styles.actionBtn} 
                                        onClick={() => onEdit(t)}
                                        title="Edit Transaction"
                                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button 
                                        style={styles.actionBtn} 
                                        onClick={() => onDelete(t._id)}
                                        title="Delete Transaction"
                                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;
