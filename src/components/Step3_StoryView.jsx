import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateStoryPage } from '../services/mockAiService';

export default function Step3_StoryView({ grade, theme, onFinish, onSave }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [storyData, setStoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentInput, setCurrentInput] = useState('');
  const [customInput, setCustomInput] = useState('');

  const loadPage = async (page, input = '') => {
    setLoading(true);
    const data = await generateStoryPage(page, theme, input, grade);
    setStoryData(prev => {
      const newData = [...prev];
      newData[page - 1] = data;
      return newData;
    });
    setLoading(false);

    if (page === 3) {
      fireConfetti();
    }
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff922b', '#b2f2bb', '#ffc9c9']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff922b', '#b2f2bb', '#ffc9c9']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleNextPage = (selectedOption) => {
    setCurrentInput(selectedOption);
    setCurrentPage(prev => prev + 1);
    loadPage(currentPage + 1, selectedOption);
  };

  const handleCustomInputSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleNextPage(customInput);
      setCustomInput('');
    }
  };

  if (loading && !storyData[currentPage - 1]) {
    return (
      <div className="container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2 className="title animate-pulse-soft">AI가 이야기를 만들고 있어요... ✨</h2>
      </div>
    );
  }

  const currentContent = storyData[currentPage - 1];

  return (
    <div className="container animate-fade-in" style={{ padding: '1rem' }}>
      <div className="book-container">
        <div className="book-page book-left">
          {loading ? (
            <div className="animate-pulse-soft" style={{ width: '100%', height: '300px', backgroundColor: '#e9ecef', borderRadius: '16px' }} />
          ) : (
            <img src={currentContent.image} alt="Story illustration" className="story-image animate-fade-in" />
          )}
        </div>
        
        <div className="book-page book-right">
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 className="heading-font" style={{ fontSize: '1.5rem', color: '#adb5bd', marginBottom: '1rem' }}>
              - {currentPage} 페이지 -
            </h3>
            
            {loading ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="animate-pulse-soft" style={{ width: '100%', height: '20px', backgroundColor: '#e9ecef', borderRadius: '4px' }} />
                <div className="animate-pulse-soft" style={{ width: '90%', height: '20px', backgroundColor: '#e9ecef', borderRadius: '4px' }} />
                <div className="animate-pulse-soft" style={{ width: '95%', height: '20px', backgroundColor: '#e9ecef', borderRadius: '4px' }} />
              </div>
            ) : (
              <p className="story-text animate-fade-in" style={{ fontSize: grade === 'low' ? 'var(--text-size-low)' : 'var(--text-size-high)' }}>
                {currentContent.text}
              </p>
            )}

            {!loading && currentPage < 3 && (
              <div style={{ marginTop: 'auto', borderTop: '2px dashed #f1f3f5', paddingTop: '1.5rem' }}>
                <p className="heading-font" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ff922b' }}>
                  주인공은 다음으로 무엇을 할까요?
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
                  {currentContent.options.map((opt, idx) => (
                    <button 
                      key={idx} 
                      className="btn" 
                      style={{ background: '#f8f9fa', border: '2px solid #dee2e6', textAlign: 'left', padding: '1rem', fontSize: '1.2rem', justifyContent: 'flex-start' }}
                      onClick={() => handleNextPage(opt)}
                    >
                      {idx + 1}. {opt}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleCustomInputSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="직접 행동을 적어주세요!"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    style={{ flex: 1, fontSize: '1rem', padding: '0.8rem' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 1.5rem' }} disabled={!customInput.trim()}>
                    확인
                  </button>
                </form>
              </div>
            )}

            {!loading && currentPage === 3 && (
              <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '2rem' }}>
                <h2 className="title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>참 잘했어요! 🎉</h2>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={() => onSave({ theme, pages: storyData })}>
                    보관함에 저장하기
                  </button>
                  <button className="btn btn-secondary" onClick={onFinish}>
                    처음으로 돌아가기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
