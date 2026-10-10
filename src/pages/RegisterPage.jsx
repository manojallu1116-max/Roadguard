import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertOctagon, UserPlus, User, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState(''); const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async event => {
    event.preventDefault(); setError(''); setIsSubmitting(true);
    try { await register(form); navigate('/login', { replace: true, state: { message: 'Registration complete. Please sign in.' } }); }
    catch (authError) { setError(authError.message); } finally { setIsSubmitting(false); }
  };
  const update = event => setForm({ ...form, [event.target.name]: event.target.value });
  return <main className="auth-page"><section className="auth-card">
    <div className="auth-brand"><div className="brand-icon"><AlertOctagon size={22} /></div><div><h1>RoadGuard</h1><p>Safer roads, together.</p></div></div>
    <div className="auth-heading"><h2>Create your account</h2><p>Citizen accounts are ready to report immediately.</p></div>
    <form onSubmit={submit} className="auth-form">
      <label>Full name <span className="auth-input"><User size={18}/><input name="name" autoComplete="name" required value={form.name} onChange={update}/></span></label>
      <label>Email address <span className="auth-input"><Mail size={18}/><input name="email" type="email" autoComplete="email" required value={form.email} onChange={update}/></span></label>
      <label>Phone number <span className="auth-input"><Phone size={18}/><input name="phone" type="tel" autoComplete="tel" required value={form.phone} onChange={update}/></span></label>
      <label>Password <span className="auth-input"><Lock size={18}/><input name="password" type="password" autoComplete="new-password" minLength="8" required value={form.password} onChange={update}/></span></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : <><UserPlus size={18}/> Create account</>}</button>
    </form>
    <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
  </section></main>;
}
