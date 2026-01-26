import React, { useState, useEffect } from 'react';
import { Plus, Minus, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import axios from 'axios';
import Login from './components/Login';
import StatsCard from './components/StatsCard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import UpcomingRecurring from './components/UpcomingRecurring';
import UpcomingModal from './components/UpcomingModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import ConfirmationModal from './components/ConfirmationModal';
import MonthYearFilter from './components/MonthYearFilter';
import ThemeToggle from './components/ThemeToggle';
import { API_ENDPOINTS } from './config/api';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('inflow');
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(String(currentDate.getMonth() + 1));
    const [selectedYear, setSelectedYear] = useState(String(currentDate.getFullYear()));
    const [showUpcomingModal, setShowUpcomingModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ 
        isOpen: false, 
        title: '', 
        message: '', 
        onConfirm: null, 
        type: 'danger', 
        confirmText: '' 
    });
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUsername = localStorage.getItem('username');
        if (savedToken && savedUsername) {
            setToken(savedToken);
            setUsername(savedUsername);
            setIsAuthenticated(true);
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchTransactions();
            fetchCategories();
        }
    }, [isAuthenticated, token, selectedMonth, selectedYear, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.CATEGORIES, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const params = {};
            if (selectedMonth) params.month = selectedMonth;
            if (selectedYear) params.year = selectedYear;
            if (selectedCategory) params.category = selectedCategory;

            const res = await axios.get(API_ENDPOINTS.TRANSACTIONS, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setTransactions(res.data);
            setLoading(false);

            // Show upcoming modal if there are recurring transactions
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const hasRecurring = res.data.some(t => t.type === 'outflow' && t.isRecurring && new Date(t.date) >= today);
            if (hasRecurring) {
                setShowUpcomingModal(true);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                handleLogout();
            }
            setLoading(false);
        }
    };

    const handleLogin = (newToken, newUsername) => {
        setToken(newToken);
        setUsername(newUsername);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken('');
        setUsername('');
        setIsAuthenticated(false);
        setTransactions([]);
    };

    const addTransaction = async (transactionData) => {
        try {
            const res = await axios.post(API_ENDPOINTS.TRANSACTIONS, transactionData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Server returns an array of transactions (multiple for recurring, single otherwise)
            const newTransactions = Array.isArray(res.data) ? res.data : [res.data];
            setTransactions(prev => [...newTransactions, ...prev]);
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Failed to add transaction');
        }
    };

    const updateTransaction = async (transactionData, mode = 'single') => {
        try {
            const { _id, ...data } = transactionData;
            const res = await axios.put(`${API_ENDPOINTS.TRANSACTIONS}/${_id}`, { ...data, mode }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // If we updated all recurring instances, we must re-fetch everything
            if (mode === 'all') {
                fetchTransactions();
            } else {
                setTransactions(prev => prev.map(t => t._id === _id ? res.data : t));
            }
            setEditingTransaction(null);
        } catch (error) {
            console.error('Error updating transaction:', error);
            alert('Failed to update transaction');
        }
    };

    const deleteTransaction = async (id, mode = 'single') => {
        try {
            const transactionToDelete = transactions.find(t => t._id === id);
            await axios.delete(`${API_ENDPOINTS.TRANSACTIONS}/${id}?mode=${mode}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (mode === 'all') {
                // Remove this and all future transactions with same amount and source
                setTransactions(prev => prev.filter(t => 
                    !(t.isRecurring && t.amount === transactionToDelete.amount && t.source === transactionToDelete.source && t.date >= transactionToDelete.date)
                ));
            } else {
                setTransactions(prev => prev.filter(t => t._id !== id));
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Failed to delete transaction');
        }
    };

    const handleDeleteClick = (id) => {
        const transaction = transactions.find(t => t._id === id);
        const isRecurring = transaction?.isRecurring;
        
        if (isRecurring) {
            setConfirmModal({
                isOpen: true,
                title: 'Delete Recurring Transaction',
                message: `"${transaction.source}" is a recurring transaction. Would you like to delete only this instance or this and all future transactions?`,
                type: 'danger',
                options: [
                    { 
                        label: 'Just this one', 
                        type: 'danger', 
                        onClick: () => deleteTransaction(id, 'single') 
                    },
                    { 
                        label: 'This and future', 
                        type: 'danger', 
                        onClick: () => deleteTransaction(id, 'all') 
                    },
                    { 
                        label: 'Cancel', 
                        type: 'secondary', 
                        onClick: () => {} 
                    }
                ]
            });
        } else {
            setConfirmModal({
                isOpen: true,
                title: 'Delete Transaction?',
                message: `Are you sure you want to delete "${transaction?.source}"? This action cannot be undone.`,
                confirmText: 'Delete',
                type: 'danger',
                onConfirm: () => {
                    deleteTransaction(id);
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            });
        }
    };

    const handleSubmitTransaction = (data) => {
        if (data._id) {
            updateTransaction(data, editingTransaction?.mode || 'single');
        } else {
            addTransaction(data);
        }
    };

    const openModal = (type) => {
        setModalType(type);
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (transaction) => {
        const isRecurring = transaction.isRecurring;
        
        if (isRecurring) {
            setConfirmModal({
                isOpen: true,
                title: 'Edit Recurring Transaction',
                message: `"${transaction.source}" is a recurring transaction. Would you like to edit only this instance or apply changes to this and all future matching transactions?`,
                type: 'primary',
                options: [
                    { 
                        label: 'Just this one', 
                        type: 'primary', 
                        onClick: () => {
                            setEditingTransaction({ ...transaction, mode: 'single' });
                            setModalType(transaction.type);
                            setIsModalOpen(true);
                        } 
                    },
                    { 
                        label: 'This and future', 
                        type: 'primary', 
                        onClick: () => {
                            setEditingTransaction({ ...transaction, mode: 'all' });
                            setModalType(transaction.type);
                            setIsModalOpen(true);
                        } 
                    },
                    { 
                        label: 'Cancel', 
                        type: 'secondary', 
                        onClick: () => {} 
                    }
                ]
            });
        } else {
            setConfirmModal({
                isOpen: true,
                title: 'Edit Transaction?',
                message: `Would you like to modify the transaction details for "${transaction.source}"?`,
                confirmText: 'Edit Now',
                type: 'primary',
                onConfirm: () => {
                    setEditingTransaction(transaction);
                    setModalType(transaction.type);
                    setIsModalOpen(true);
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            });
        }
    };

    const closeFormModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    const totals = transactions.reduce((acc, curr) => {
        const amt = parseFloat(curr.amount);
        if (curr.type === 'inflow') {
            acc.inflow += amt;
            acc.balance += amt;
        } else {
            acc.outflow += amt;
            acc.balance -= amt;
        }
        return acc;
    }, { inflow: 0, outflow: 0, balance: 0 });

    const styles = {
        app: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1rem',
        },
        headerContainer: {
            marginBottom: '2rem',
        },
        header: {
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'space-between',
            alignItems: isMobile ? 'center' : 'flex-start',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: isMobile ? '1.5rem' : '1rem',
            textAlign: isMobile ? 'center' : 'left',
        },
        brand: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'center' : 'flex-start',
            gap: '0.75rem',
            fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            flexShrink: 0,
            width: isMobile ? '100%' : 'auto',
        },
        userInfo: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'center' : 'flex-end',
            gap: '0.5rem',
            flexWrap: 'wrap',
            width: isMobile ? '100%' : 'auto',
            marginTop: isMobile ? '0.5rem' : '0',
        },
        username: {
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
            whiteSpace: 'nowrap',
        },
        logoutBtn: {
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            padding: '0.5rem 0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
            whiteSpace: 'nowrap',
        },
        changePasswordBtn: {
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            padding: '0.5rem 0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
            fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
        },
        headerActions: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1rem' : '0.75rem',
            alignItems: isMobile ? 'center' : 'center',
            flexWrap: 'wrap',
            flex: '1 1 auto',
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'center' : 'flex-end',
        },
        actionButtons: {
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
        },
        iconBtn: {
            padding: '0.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        inflowBtn: {
            background: 'var(--success)',
            color: 'white',
        },
        outflowBtn: {
            background: 'var(--danger)',
            color: 'white',
        },

        btnPrimary: {
            background: 'var(--success)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
        },
        btnSecondary: {
            background: 'var(--danger)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
        },

        dashboardGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
        },
        contentGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
        },
        section: {
            marginBottom: '2rem',
        }
    };

    // Media query for desktop
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    if (mediaQuery.matches) {
        styles.app.padding = '2rem';
        styles.contentGrid.gridTemplateColumns = '1fr 2fr';
    }

    if (loading) {
        return <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div style={styles.app}>
            <div style={styles.headerContainer}>
                <header style={styles.header}>
                    {/* Brand - Always first */}
                    <div style={styles.brand}>
                        <div style={{ background: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                            <LayoutDashboard size={24} color="white" />
                        </div>
                        Finance+
                    </div>

                    {/* Main Controls and User Controls wrapper */}
                    <div style={styles.headerActions}>
                        {/* Filters and Actions Group */}
                        <div style={{ 
                            display: 'flex', 
                            gap: '0.75rem', 
                            alignItems: 'center', 
                            flexWrap: 'wrap', 
                            justifyContent: isMobile ? 'center' : 'flex-end',
                            width: isMobile ? '100%' : 'auto'
                        }}>
                            <MonthYearFilter
                                selectedMonth={selectedMonth}
                                selectedYear={selectedYear}
                                onMonthChange={setSelectedMonth}
                                onYearChange={setSelectedYear}
                            />
                            
                            {/* Grouping Category, Theme, and Actions to keep them together on mobile */}
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <div style={{ position: 'relative', minWidth: '120px' }}>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        style={{
                                            appearance: 'none',
                                            padding: '0.625rem 2.25rem 0.625rem 0.75rem',
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                            cursor: 'pointer',
                                            width: '100%',
                                            height: '42px'
                                        }}
                                    >
                                        <option value="">All Categories</option>
                                        {[...new Set(categories.map(c => c.name))].sort().map(name => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown 
                                        size={14} 
                                        style={{ 
                                            position: 'absolute', 
                                            right: '0.75rem', 
                                            top: '50%', 
                                            transform: 'translateY(-50%)', 
                                            pointerEvents: 'none', 
                                            color: 'var(--text-secondary)' 
                                        }} 
                                    />
                                </div>
                                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                                
                                <div style={styles.actionButtons}>
                                    <button
                                        style={{ ...styles.iconBtn, ...styles.inflowBtn }}
                                        onClick={() => openModal('inflow')}
                                        title="Add Inflow"
                                    >
                                        <Plus size={20} />
                                    </button>
                                    <button
                                        style={{ ...styles.iconBtn, ...styles.outflowBtn }}
                                        onClick={() => openModal('outflow')}
                                        title="Add Outflow"
                                    >
                                        <Minus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* User Controls - Group 3 */}
                        <div style={styles.userInfo}>
                            <span style={styles.username}>👋 {username}</span>
                            <button style={styles.changePasswordBtn} onClick={() => setShowChangePasswordModal(true)}>
                                Change Password
                            </button>
                            <button style={styles.logoutBtn} onClick={handleLogout}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>
                </header>
            </div>

            <div style={styles.dashboardGrid}>
                <StatsCard title="Total Balance" amount={totals.balance} type="balance" />
                <StatsCard title="Total Inflow" amount={totals.inflow} type="inflow" />
                <StatsCard title="Total Outflow" amount={totals.outflow} type="outflow" />
            </div>

            <div style={styles.section}>
                <TransactionList 
                    transactions={transactions} 
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    username={username}
                    isMobile={isMobile}
                />
            </div>

            <TransactionForm
                isOpen={isModalOpen}
                onClose={closeFormModal}
                onSubmit={handleSubmitTransaction}
                type={modalType}
                initialData={editingTransaction}
                categories={categories}
            />

            <UpcomingModal
                isOpen={showUpcomingModal}
                onClose={() => setShowUpcomingModal(false)}
                transactions={transactions}
            />

            <ChangePasswordModal
                isOpen={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
                token={token}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                type={confirmModal.type}
                options={confirmModal.options}
            />
        </div>
    );
}

export default App;
