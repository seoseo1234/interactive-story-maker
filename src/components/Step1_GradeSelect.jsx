import React from 'react';
import { Baby, GraduationCap } from 'lucide-react';

export default function Step1_GradeSelect({ onSelect }) {
  return (
    <div className="container animate-fade-in">
      <h1 className="title">어떤 친구가 동화를 만들까요?</h1>
      <p className="subtitle">학년에 맞는 난이도로 동화를 만들 수 있어요!</p>
      
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
        <button 
          onClick={() => onSelect('low')}
          style={{
            background: 'white',
            border: '4px solid var(--primary-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            width: '300px',
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
        >
          <div style={{ background: '#fff4e6', padding: '1.5rem', borderRadius: '50%' }}>
            <Baby size={64} color="#ff922b" />
          </div>
          <h2 className="heading-font" style={{ fontSize: '2rem', color: '#d9480f', margin: 0 }}>병아리 친구</h2>
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>1~3학년 저학년용</p>
        </button>

        <button 
          onClick={() => onSelect('high')}
          style={{
            background: 'white',
            border: '4px solid var(--secondary-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            width: '300px',
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
        >
          <div style={{ background: '#ebfbee', padding: '1.5rem', borderRadius: '50%' }}>
            <GraduationCap size={64} color="#2b8a3e" />
          </div>
          <h2 className="heading-font" style={{ fontSize: '2rem', color: '#2b8a3e', margin: 0 }}>올빼미 친구</h2>
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>4~6학년 고학년용</p>
        </button>
      </div>
    </div>
  );
}
