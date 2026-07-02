import React from 'react';

export default function Step1_GradeSelect({ onSelect }) {
  return (
    <div className="container animate-fade-in" style={{ alignItems: 'center' }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem', 
        background: 'rgba(255, 255, 255, 0.85)', 
        padding: '2rem 3rem', 
        borderRadius: '24px', 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        display: 'inline-block'
      }}>
        <h1 className="title" style={{ color: 'var(--primary-color)', margin: 0, fontSize: '3rem', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>어떤 친구가 동화를 만들까요?</h1>
        <p className="subtitle" style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginTop: '0.5rem', marginBottom: 0 }}>학년에 딱 맞는 재밌는 이야기를 만들어 줄게요!</p>
      </div>
      
      <div style={{ display: 'flex', gap: '4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div 
          onClick={() => onSelect('low')}
          style={{
            background: 'rgba(255,255,255,0.95)',
            border: '4px solid #ffb8b8',
            borderRadius: '32px',
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '380px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)' }}
        >
          <img src="/chick.png" alt="저학년 병아리" style={{ width: '220px', height: '220px', objectFit: 'contain' }} />
          <h2 className="heading-font" style={{ fontSize: '2.5rem', color: '#ff7675', margin: 0 }}>병아리 친구</h2>
          <span style={{ background: '#ffb8b8', color: 'white', padding: '0.6rem 1.8rem', borderRadius: '30px', fontSize: '1.3rem', fontWeight: 'bold' }}>1~3학년용</span>
        </div>

        <div 
          onClick={() => onSelect('high')}
          style={{
            background: 'rgba(255,255,255,0.95)',
            border: '4px solid #74b9ff',
            borderRadius: '32px',
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '380px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)' }}
        >
          <img src="/owl.png" alt="고학년 올빼미" style={{ width: '220px', height: '220px', objectFit: 'contain' }} />
          <h2 className="heading-font" style={{ fontSize: '2.5rem', color: '#0984e3', margin: 0 }}>올빼미 친구</h2>
          <span style={{ background: '#74b9ff', color: 'white', padding: '0.6rem 1.8rem', borderRadius: '30px', fontSize: '1.3rem', fontWeight: 'bold' }}>4~6학년용</span>
        </div>
      </div>
    </div>
  );
}
