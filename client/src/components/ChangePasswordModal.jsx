import React, { useState } from 'react';
import { X } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const ChangePasswordModal = ({ isOpen, onClose, token }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to change password');
            }

            setSuccess('Password changed successfully!');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                onClose();
                setSuccess('');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
            maxWidth: '450px',
            boxShadow: 'var(--shadow)',
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
        },
        closeBtn: {
            background: 'transparent',
            color: 'var(--text-secondary)',
            padding: '0.5rem',
        },
        formGroup: {
            marginBottom: '1rem',
        },
        label: {
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
        },
        error: {
            background: 'rgba(244, 63, 94, 0.1)',
            color: 'var(--danger)',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            border: '1px solid rgba(244, 63, 94, 0.3)',
        },
        success: {
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success)',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            border: '1px solid rgba(16, 185, 129, 0.3)',
        },
        submitBtn: {
            width: '100%',
            padding: '0.75rem',
            background: 'var(--accent-primary)',
            color: 'white',
            marginTop: '1rem',
            fontWeight: '600',
        }
    };

    return (
        <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Change Password</h2>
                    <button style={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.success}>{success}</div>}

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Current Password</label>
                        <input
                            name="currentPassword"
                            type="password"
                            required
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Enter current password"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>New Password</label>
                        <input
                            name="newPassword"
                            type="password"
                            required
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm New Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button type="submit" style={styles.submitBtn} disabled={loading}>
                        {loading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
