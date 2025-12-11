import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

const StatsCard = ({ title, amount, type }) => {
    let Icon = Wallet;
    let colorVar = 'var(--accent-primary)';
    let bgClass = 'bg-primary';

    if (type === 'inflow') {
        Icon = ArrowUpRight;
        colorVar = 'var(--success)';
    } else if (type === 'outflow') {
        Icon = ArrowDownRight;
        colorVar = 'var(--danger)';
    }

    const styles = {
        card: {
            background: 'var(--bg-secondary)',
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow)',
        },
        iconWrapper: {
            background: `color-mix(in srgb, ${colorVar}, transparent 85%)`,
            color: colorVar,
            padding: 'clamp(0.5rem, 2vw, 0.75rem)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
        },
        title: {
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
            fontWeight: '500',
        },
        amount: {
            color: 'var(--text-primary)',
            fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
            fontWeight: '700',
            marginTop: '0.25rem',
            wordBreak: 'break-word',
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.iconWrapper}>
                <Icon size={24} />
            </div>
            <div style={styles.content}>
                <span style={styles.title}>{title}</span>
                <span style={styles.amount}>
                    {type === 'outflow' ? '-' : type === 'inflow' ? '+' : ''}₹{amount.toLocaleString()}
                </span>
            </div>
        </div>
    );
};

export default StatsCard;
