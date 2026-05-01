// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../components/UI';
import { toast } from '../utils/toast';
import { useFormValidation } from '../hooks/useFormValidation';

import { authAPI, authHelpers, getErrorMessage } from '../utils/api';
export default function Register() {
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);

  const { values, errors, handleChange, validate } = useFormValidation(
    { name: '', email: '', password: '', confirm: '' },
    {
      name:     { required: true },
      email:    { required: true, isEmail: true },
      password: { required: true, minLength: 6  },
      confirm:  { required: true, match: 'password' },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await api.auth.register(values.name, values.email, values.password);
        authHelpers.setToken(data.token);
        authHelpers.setUser(data.user);
      toast.success('Account created! Welcome to FindIt 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const strength = (() => {
    const p = values.password;
    if (!p) return null;
    if (p.length < 6)  return { label: 'Too short',  color: 'var(--c-red)',   width: '25%'  };
    if (p.length < 8)  return { label: 'Weak',        color: 'var(--c-amber)', width: '50%'  };
    if (p.length < 12) return { label: 'Good',        color: 'var(--c-blue)',  width: '75%'  };
    return               { label: 'Strong',      color: 'var(--c-green)', width: '100%' };
  })();

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'var(--c-bg)',
    }}>
      <div className="animate-fadeUp" style={{ width: '100%', maxWidth: 440 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🎓</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 28, letterSpacing: '-0.5px',
          }}>
            Join FindIt
          </h1>
          <p style={{ fontSize: 14, color: 'var(--c-text2)', marginTop: 6 }}>
            Create your campus lost &amp; found account
          </p>
        </div>

        <Card style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            <Input
              label="Full Name"
              type="text"
              placeholder="Riya Sharma"
              icon="👤"
              value={values.name}
              onChange={handleChange('name')}
              error={errors.name}
              autoComplete="name"
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@campus.edu"
              icon="📧"
              value={values.email}
              onChange={handleChange('email')}
              error={errors.email}
              autoComplete="email"
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Minimum 6 characters"
                icon="🔒"
                value={values.password}
                onChange={handleChange('password')}
                error={errors.password}
                autoComplete="new-password"
              />
              {/* Password strength bar */}
              {strength && (
                <div style={{ marginTop: 8 }}>
                  <div style={{
                    height: 4, background: 'var(--c-surface2)',
                    borderRadius: 999, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', width: strength.width,
                      background: strength.color,
                      transition: 'width 0.4s ease, background 0.3s ease',
                      borderRadius: 999,
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: strength.color, fontWeight: 600, marginTop: 4, display: 'block' }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              icon="🔒"
              value={values.confirm}
              onChange={handleChange('confirm')}
              error={errors.confirm}
              autoComplete="new-password"
            />

            {/* Terms */}
            <p style={{ fontSize: 12, color: 'var(--c-text3)', textAlign: 'center' }}>
              By signing up you agree to our{' '}
              <Link to="/terms" style={{ color: 'var(--c-accent)' }}>Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" style={{ color: 'var(--c-accent)' }}>Privacy Policy</Link>.
            </p>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </Card>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--c-text2)', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--c-accent)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}