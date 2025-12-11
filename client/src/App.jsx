import React, { useState, useEffect } from 'react';
import { Plus, Minus, LayoutDashboard, LogOut } from 'lucide-react';
import axios from 'axios';
import Login from './components/Login';
import StatsCard from './components/StatsCard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import UpcomingRecurring from './components/UpcomingRecurring';
import UpcomingModal from './components/UpcomingModal';
import ChangePasswordModal from './components/ChangePasswordModal';
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
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });



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
        }
    }, [isAuthenticated, token, selectedMonth, selectedYear]);

    const fetchTransactions = async () => {
        try {
            const params = {};
            if (selectedMonth) params.month = selectedMonth;
            if (selectedYear) params.year = selectedYear;

            const res = await axios.get(API_ENDPOINTS.TRANSACTIONS, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setTransactions(res.data);
            setLoading(false);

            // Show upcoming modal if there are recurring transactions
            const hasRecurring = res.data.some(t => t.type === 'outflow' && t.isRecurring);
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

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
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
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '1rem',
        },
        brand: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            flexShrink: 0,
        },
        userInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
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
            gap: '0.75rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            flex: '1 1 auto',
            justifyContent: 'flex-end',
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

                    {/* Main Controls - Wraps nicely on mobile */}
                    <div style={styles.headerActions}>
                        {/* Filters and Theme - Group 1 */}
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <MonthYearFilter
                                selectedMonth={selectedMonth}
                                selectedYear={selectedYear}
                                onMonthChange={setSelectedMonth}
                                onYearChange={setSelectedYear}
                            />
                            <ThemeToggle theme={theme} onToggle={toggleTheme} />
                        </div>

                        {/* Action Buttons - Group 2 */}
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
                <TransactionList transactions={transactions} />
            </div>

            <TransactionForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={addTransaction}
                type={modalType}
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
        </div>
    );
}

export default App;
