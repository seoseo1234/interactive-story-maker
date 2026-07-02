import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';

export default function Step2_ThemeSelect({ grade, onSelect }) {
  const [theme, setTheme] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const handleStart = (e) => {
    e.preventDefault();
    if (theme.trim() && name.trim() && type.trim()) {
      onSelect({ theme, protagonist: { name, type } });
    }
  };

  const presetThemes = grade === 'low' 
    ? ['처음 심부름 가는 날 🍎', '길고양이 친구 만들기 🐱', '내 동생 돌보기 👶', '비 오는 날의 놀이터 ☔']
    : ['새로운 학교로 전학 온 날 🏫', '유기견 보호소 봉사활동 🐕', '친구와의 다툼 그리고 화해 🤝', '나만의 비밀 아지트 만들기 🏕️'];

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ background: 'rgba(255,255,255,0.9)', padding: '3rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <h1 className="title" style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>모험을 준비해볼까요?</h1>
        <p className="subtitle" style={{ marginBottom: '3rem' }}>주인공과 이야기 주제를 정해주세요!</p>

        <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '16px', border: '1px solid #eaeaea' }}>
            <h3 className="heading-font" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#333' }}>1. 주인공은 누구인가요?</h3>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-light)' }}>이름</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="예: 몽글이" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  required 
                />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-light)' }}>종류 (동물, 직업 등)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="예: 용감한 강아지, 마법사" 
                  value={type} 
                  onChange={e => setType(e.target.value)}
                  required 
                />
              </div>
            </div>
          </div>

          <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '16px', border: '1px solid #eaeaea' }}>
            <h3 className="heading-font" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#333' }}>2. 어떤 이야기인가요? (주제)</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.5rem' }}>
              {presetThemes.map(t => (
                <button 
                  key={t}
                  type="button"
                  className="btn"
                  style={{ background: theme === t ? 'var(--primary-color)' : 'white', color: theme === t ? 'white' : 'var(--text-main)', fontSize: '1rem', padding: '0.6rem 1.2rem', borderRadius: '30px' }}
                  onClick={() => setTheme(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <input
              type="text"
              className="input-field"
              placeholder="직접 입력할 수도 있어요!"
              value={theme}
              onChange={e => setTheme(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1.2rem', fontSize: '1.5rem', borderRadius: 'var(--radius-full)' }} disabled={!theme || !name || !type}>
            <PlayCircle size={24} /> 이야기 시작하기!
          </button>
        </form>
      </div>
    </div>
  );
}
