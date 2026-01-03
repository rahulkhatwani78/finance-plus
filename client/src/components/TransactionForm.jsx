import React, { useState } from 'react';
import { X } from 'lucide-react';

const TransactionForm = ({ isOpen, onClose, onSubmit, type, initialData, categories }) => {
    const [formData, setFormData] = useState({
        amount: '',
        source: '',
        date: new Date().toISOString().split('T')[0],
        isRecurring: false,
        bankName: '',
        endDate: '',
        category: 'Other',
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                amount: initialData.amount,
                source: initialData.source,
                date: initialData.date.split('T')[0],
                isRecurring: initialData.isRecurring || false,
                bankName: initialData.bankName || '',
                endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
                category: initialData.category || 'Other',
            });
        } else {
            setFormData({
                amount: '',
                source: '',
                date: new Date().toISOString().split('T')[0],
                isRecurring: false,
                bankName: '',
                endDate: '',
                category: 'Other',
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, type, _id: initialData?._id });
        onClose();
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
            padding: 'clamp(0.5rem, 2vw, 1rem)',
        },
        modal: {
            background: 'var(--bg-secondary)',
            padding: 'clamp(1.25rem, 3vw, 1.5rem)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            width: '100%',
            maxWidth: '500px',
            boxShadow: 'var(--shadow)',
            position: 'relative',
            animation: 'slideUp 0.3s ease-out',
            maxHeight: '90vh',
            overflowY: 'auto',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'clamp(1.25rem, 3vw, 1.5rem)',
        },
        title: {
            fontSize: 'clamp(1.1rem, 3.5vw, 1.25rem)',
            fontWeight: '600',
        },
        closeBtn: {
            background: 'transparent',
            color: 'var(--text-secondary)',
            padding: '0.5rem',
            minWidth: '40px',
            minHeight: '40px',
        },
        formGroup: {
            marginBottom: 'clamp(0.875rem, 2.5vw, 1rem)',
        },
        label: {
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
            color: 'var(--text-secondary)',
        },
        submitBtn: {
            width: '100%',
            padding: 'clamp(0.625rem, 2vw, 0.75rem)',
            background: type === 'inflow' ? 'var(--success)' : 'var(--danger)',
            color: 'white',
            marginTop: 'clamp(0.875rem, 2.5vw, 1rem)',
            fontWeight: '600',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
        }
    };

    return (
        <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>{initialData ? 'Edit' : 'Add'} {type === 'inflow' ? 'Inflow' : 'Outflow'}</h2>
                    <button style={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Amount (₹)</label>
                        <input
                            name="amount"
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>{type === 'inflow' ? 'Source' : 'Recipient/Description'}</label>
                        <input
                            name="source"
                            type="text"
                            required
                            value={formData.source}
                            onChange={handleChange}
                            placeholder={type === 'inflow' ? 'e.g. Salary, Freelance' : 'e.g. Rent, Groceries'}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                appearance: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="Other">Other</option>
                            {categories
                                .filter(c => c.type === type)
                                .map(cat => (
                                    <option key={cat._id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Start Date</label>
                        <input
                            name="date"
                            type="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    {type === 'outflow' && (
                        <div style={styles.formGroup}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                <input
                                    name="isRecurring"
                                    type="checkbox"
                                    checked={formData.isRecurring}
                                    onChange={handleChange}
                                    disabled={!!initialData && initialData.isRecurring}
                                />
                                Recurring Payment (Monthly)
                            </label>
                            {initialData && initialData.isRecurring && (
                                <p style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '0.25rem' }}>
                                    {initialData.mode === 'all' 
                                        ? 'Note: Changes will be reflected for this and all matching future transactions.' 
                                        : 'Note: Changes will be applied ONLY to this instance.'}
                                </p>
                            )}
                        </div>
                    )}

                    {formData.isRecurring && type === 'outflow' && (
                        <>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Bank Name</label>
                                <input
                                    name="bankName"
                                    type="text"
                                    required
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    placeholder="e.g. HDFC, ICICI, SBI"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>End Date</label>
                                <input
                                    name="endDate"
                                    type="date"
                                    required
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    min={formData.date}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                    Payments will be created monthly until this date
                                </p>
                            </div>
                        </>
                    )}

                    <button type="submit" style={styles.submitBtn}>
                        {initialData ? 'Update' : 'Add'} Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
