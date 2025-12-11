import React from 'react';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle({ theme, onToggle }) {
    const styles = {
        button: {
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            padding: '0.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '40px',
            height: '40px',
        },
    };

    return (
        <button
            style={styles.button}
            onClick={onToggle}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun size={20} style={{ transition: 'transform 0.3s ease' }} />
            ) : (
                <Moon size={20} style={{ transition: 'transform 0.3s ease' }} />
            )}
        </button>
    );
}

export default ThemeToggle;
