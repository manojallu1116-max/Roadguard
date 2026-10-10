import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AlertOctagon, LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (user) return <Navigate to={(user.role === 'admin' || user.role === 'authority') && user.isApproved ? '/admin' : '/citizen'} replace />;

  const submit = async event => {
    event.preventDefault(); setError(''); setIsSubmitting(true);
    try {
      const signedInUser = await login(form);
      navigate((signedInUser.role === 'admin' || signedInUser.role === 'authority') && signedInUser.isApproved ? '/admin' : '/citizen', { replace: true });
    } catch (authError) { setError(authError.message); } finally { setIsSubmitting(false); }
  };

  return <main className="auth-page"><section className="auth-card">
    <div className="auth-brand"><div className="brand-icon"><AlertOctagon size={22} /></div><div><h1>RoadGuard</h1><p>Safer roads, together.</p></div></div>
    <div className="auth-heading"><h2>Welcome back</h2><p>Sign in to report and track road damage.</p></div>
    <form onSubmit={submit} className="auth-form">
      <label>Email address <span className="auth-input"><Mail size={18}/><input type="email" autoComplete="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></span></label>
      <label>Password <span className="auth-input"><Lock size={18}/><input type="password" autoComplete="current-password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></span></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : <><LogIn size={18}/> Sign in</>}</button>
    </form>
    <p className="auth-footer">New to RoadGuard? <Link to="/register">Create a citizen account</Link></p>
  </section></main>;
}
