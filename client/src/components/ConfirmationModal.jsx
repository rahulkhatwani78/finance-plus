import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, type = 'danger', options }) => {
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
            maxWidth: '450px',
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
            gap: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
        },
        btn: (btnType, isFullWidth) => ({
            flex: isFullWidth ? '1 1 100%' : '1 1 auto',
            minWidth: '120px',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: btnType === 'secondary' ? '1px solid var(--border)' : 'none',
            background: btnType === 'danger' ? 'var(--danger)' : 
                        btnType === 'primary' ? 'var(--accent-primary)' : 
                        btnType === 'success' ? 'var(--success)' : 'transparent',
            color: btnType === 'secondary' ? 'var(--text-secondary)' : 'white',
            fontSize: '0.9rem',
        }),
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
                    {options ? (
                        options.map((opt, idx) => (
                            <button 
                                key={idx} 
                                style={styles.btn(opt.type || 'secondary', opt.fullWidth)} 
                                onClick={() => {
                                    opt.onClick();
                                    if (!opt.keepOpen) onClose();
                                }}
                            >
                                {opt.label}
                            </button>
                        ))
                    ) : (
                        <>
                            <button style={styles.btn('secondary')} onClick={onClose}>
                                Cancel
                            </button>
                            <button style={styles.btn(type)} onClick={onConfirm}>
                                {confirmText || 'Confirm'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
