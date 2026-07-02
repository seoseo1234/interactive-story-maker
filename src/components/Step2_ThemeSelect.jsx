import React, { useState } from 'react';

export default function Step2_ThemeSelect({ grade, onSelect }) {
  const [customTheme, setCustomTheme] = useState('');

  const lowGradeThemes = [
    { title: '사자 친구들의 모험 🦁', icon: '🦁' },
    { title: '신나는 우주여행 🚀', icon: '🚀' },
    { title: '마법 학교의 비밀 🏰', icon: '🏰' },
    { title: '안전한 우리 학교 🏫', icon: '🏫' }
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customTheme.trim()) {
      onSelect(customTheme);
    }
  };

  return (
    <div className="container animate-fade-in">
      <h1 className="title">어떤 이야기를 만들어 볼까요?</h1>
      
      {grade === 'low' ? (
        <>
          <p className="subtitle">마음에 드는 주제를 하나 골라주세요!</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            {lowGradeThemes.map((theme, index) => (
              <button
                key={index}
                className="btn"
                style={{ 
                  flexDirection: 'column', 
                  padding: '2rem', 
                  background: 'white',
                  border: '3px solid var(--border-color)'
                }}
                onClick={() => onSelect(theme.title)}
              >
                <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>{theme.icon}</span>
                <span style={{ color: 'var(--text-main)' }}>{theme.title}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="subtitle">상상력을 발휘해서 만들고 싶은 이야기의 주제를 직접 적어주세요!</p>
          <form onSubmit={handleCustomSubmit} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <textarea
              className="input-field"
              rows={4}
              placeholder="예: 환경 오염으로 위험에 처한 바다 거북이를 구하는 이야기..."
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
              style={{ resize: 'none' }}
              autoFocus
            />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'center' }} disabled={!customTheme.trim()}>
              이 주제로 이야기 시작하기! ✨
            </button>
          </form>
        </>
      )}
    </div>
  );
}
