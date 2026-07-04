import React, { useState } from 'react';
import { getSupabase } from '../services/supabaseClient';

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = getSupabase();

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('회원가입 성공! 이제 로그인해 주세요.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#faf8f5', border: '3px solid #e8dfd5', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '400px' }}>
        <h2 className="title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          {isLogin ? '로그인' : '회원가입'}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            className="input-field"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '처리 중...' : isLogin ? '시작하기' : '가입하기'}
          </button>
          <button type="button" className="btn" style={{ background: '#f8f9fa', color: '#495057', border: '1px solid #eaeaea' }} onClick={() => onLogin({ id: 'guest', isGuest: true })}>
            회원가입 없이 둘러보기
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-light)' }}>
          {isLogin ? '계정이 없나요? ' : '이미 계정이 있나요? '}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: '#ff922b', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}
          >
            {isLogin ? '회원가입' : '로그인'}
          </button>
        </p>
      </div>
    </div>
  );
}
