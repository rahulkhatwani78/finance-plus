import React from 'react';
import { ChevronDown } from 'lucide-react';

const MonthYearFilter = ({ selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear + 1) - i);
    const months = [
        { value: '', label: 'All Months' },
        { value: '1', label: 'Jan' },
        { value: '2', label: 'Feb' },
        { value: '3', label: 'Mar' },
        { value: '4', label: 'Apr' },
        { value: '5', label: 'May' },
        { value: '6', label: 'Jun' },
        { value: '7', label: 'Jul' },
        { value: '8', label: 'Aug' },
        { value: '9', label: 'Sep' },
        { value: '10', label: 'Oct' },
        { value: '11', label: 'Nov' },
        { value: '12', label: 'Dec' },
    ];

    const styles = {
        container: {
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        selectWrapper: {
            position: 'relative',
            minWidth: 'min(110px, 100%)',
            flex: '1 1 auto',
        },
        select: {
            appearance: 'none',
            padding: '0.625rem 2.5rem 0.625rem 1rem',
            cursor: 'pointer',
            fontSize: 'var(--text-size-sm, 0.875rem)',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            height: '42px', // Explicit height for perfect alignment
            minWidth: '110px',
        },
        icon: {
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--text-secondary)',
        }
    };

    return (
        <>
            <div style={styles.selectWrapper}>
                <select
                    style={styles.select}
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(e.target.value)}
                >
                    {months.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
                <ChevronDown size={16} style={styles.icon} />
            </div>

            <div style={styles.selectWrapper}>
                <select
                    style={styles.select}
                    value={selectedYear}
                    onChange={(e) => onYearChange(e.target.value)}
                >
                    <option value="">All Years</option>
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <ChevronDown size={16} style={styles.icon} />
            </div>
        </>
    );
};

export default MonthYearFilter;
