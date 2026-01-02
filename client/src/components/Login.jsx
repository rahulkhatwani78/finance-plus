import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const Login = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setFormData({ username: '', password: '', confirmPassword: '' });
        setError('');
    };

    const performLogin = async (username, password) => {
        setLoading(true);
        setError('');

        try {
            const endpoint = API_ENDPOINTS.LOGIN;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            onLogin(data.token, data.username);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate confirm password for registration
        if (isRegister && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (isRegister) {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(API_ENDPOINTS.REGISTER, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Authentication failed');
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                onLogin(data.token, data.username);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            await performLogin(formData.username, formData.password);
        }
    };

    React.useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const urlUsername = queryParams.get('username');
        const urlPassword = queryParams.get('password');

        if (urlUsername && urlPassword) {
            setFormData(prev => ({
                ...prev,
                username: urlUsername,
                password: urlPassword
            }));
            performLogin(urlUsername, urlPassword);
            
            // Clear URL parameters to avoid showing password in address bar after login
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        } else if (urlUsername) {
            setFormData(prev => ({
                ...prev,
                username: urlUsername
            }));
        }
    }, []);

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--bg-primary) 0%, #1a1f35 100%)',
            padding: 'clamp(1rem, 3vw, 2rem)',
        },
        card: {
            background: 'var(--bg-secondary)',
            padding: 'clamp(1.5rem, 4vw, 2rem)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            width: '100%',
            maxWidth: '450px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
        },
        header: {
            textAlign: 'center',
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        },
        title: {
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: '700',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            alignItems: 'center',
        },
        subtitle: {
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
            transition: 'opacity 0.3s ease',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(1rem, 3vw, 1.25rem)',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            opacity: 1,
            transition: 'opacity 0.3s ease',
        },
        label: {
            fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
            fontWeight: '500',
            color: 'var(--text-secondary)',
        },
        error: {
            background: 'rgba(244, 63, 94, 0.1)',
            color: 'var(--danger)',
            padding: 'clamp(0.625rem, 2vw, 0.75rem)',
            borderRadius: '8px',
            fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
        },
        submitBtn: {
            background: 'var(--accent-primary)',
            color: 'white',
            padding: 'clamp(0.75rem, 2.5vw, 0.875rem)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
            transition: 'all 0.2s ease',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
        },
        toggleText: {
            textAlign: 'center',
            marginTop: 'clamp(1.25rem, 3vw, 1.5rem)',
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)',
        },
        toggleLink: {
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            fontWeight: '600',
            marginLeft: '0.25rem',
            transition: 'color 0.2s ease',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}><img style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} src="finance_plus.jpg" alt="Finance+" />Finance+</h1>
                    <p style={styles.subtitle}>
                        {isRegister ? 'Create your household account' : 'Sign in to your household'}
                    </p>
                </div>

                <form style={styles.form} onSubmit={handleSubmit}>
                    {error && <div style={styles.error}>{error}</div>}

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Household Name</label>
                        <input
                            name="username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="e.g., House1, Smith Family"
                            autoComplete="username"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            autoComplete={isRegister ? 'new-password' : 'current-password'}
                        />
                    </div>

                    {isRegister && (
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                            />
                        </div>
                    )}

                    <button type="submit" style={styles.submitBtn} disabled={loading}>
                        {loading ? (
                            'Please wait...'
                        ) : isRegister ? (
                            <><UserPlus size={18} /> Create Account</>
                        ) : (
                            <><LogIn size={18} /> Sign In</>
                        )}
                    </button>
                </form>

                <div style={styles.toggleText}>
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <span style={styles.toggleLink} onClick={toggleMode}>
                        {isRegister ? 'Sign In' : 'Create One'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
