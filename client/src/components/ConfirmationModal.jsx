import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, type = 'danger' }) => {
    if (!isOpen) return null;

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
            zIndex: 100,
            padding: '1rem',
        },
        modal: {
            background: 'var(--bg-secondary)',
            padding: '2rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            width: '100%',
            maxWidth: '400px',
            boxShadow: 'var(--shadow)',
            position: 'relative',
            animation: 'slideUp 0.3s ease-out',
            textAlign: 'center',
        },
        iconContainer: {
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: type === 'danger' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(139, 92, 246, 0.1)',
            color: type === 'danger' ? 'var(--danger)' : 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
        },
        title: {
            fontSize: '1.25rem',
            fontWeight: '700',
            marginBottom: '0.75rem',
            color: 'var(--text-primary)',
        },
        message: {
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            marginBottom: '2rem',
        },
        actions: {
            display: 'flex',
            gap: '1rem',
        },
        cancelBtn: {
            flex: 1,
            padding: '0.75rem',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        confirmBtn: {
            flex: 1,
            padding: '0.75rem',
            background: type === 'danger' ? 'var(--danger)' : 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        closeBtn: {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.25rem',
        }
    };

    return (
        <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={styles.modal}>
                <button style={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                <div style={styles.iconContainer}>
                    <AlertCircle size={32} />
                </div>
                <h2 style={styles.title}>{title}</h2>
                <p style={styles.message}>{message}</p>
                <div style={styles.actions}>
                    <button style={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button style={styles.confirmBtn} onClick={onConfirm}>
                        {confirmText || 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
