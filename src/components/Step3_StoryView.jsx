import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { generateStoryTurn } from '../services/geminiService';
import { Send, Sparkles, BookOpen, Star, User, Info } from 'lucide-react';

const ImageWithLoading = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px', marginTop: '1rem', overflow: 'hidden', borderRadius: '12px', minHeight: '200px', background: '#f0f0f0' }}>
      {!loaded && !error && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>🎨 AI가 그림을 그리는 중...</span>
        </div>
      )}
      {error && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>앗, 그림을 불러오지 못했어요 😢</span>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(true); setError(true); }}
        style={{ width: '100%', display: error ? 'none' : 'block', opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }} 
      />
    </div>
  );
};

const AvatarWithLoading = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {!loaded && !error && (
        <span className="animate-pulse" style={{ fontSize: '1.5rem', color: '#94a3b8' }}>✨</span>
      )}
      {error && (
        <User size={32} color="#94a3b8" />
      )}
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(true); setError(true); }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: error ? 'none' : 'block', opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out', position: 'absolute', top: 0, left: 0 }} 
      />
    </div>
  );
};

export default function Step3_StoryView({ grade, theme, protagonist, onFinish, onSave }) {
  const TOTAL_TURNS = grade === 'low' ? 10 : 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customInput, setCustomInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [storyData, setStoryData] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [unlockCode, setUnlockCode] = useState('');
  
  const BAD_WORDS = ['바보', '멍청이', '씨발', '개새끼', '나쁜말', '병신', '지랄', '존나', '새끼', '미친', '죽어'];

  const chatEndRef = useRef(null);
  const chatHistoryRef = useRef(null);

  // 주인공 데이터 방어코드
  const heroName = protagonist?.name || '주인공';
  const heroType = protagonist?.type || '모험가';
  
  // 주인공 종류를 기반으로 맞춤형 귀여운 캐릭터 이미지를 실시간으로 생성해주는 무료 AI 이미지 생성기 사용
  const avatarUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent('A cute kawaii ' + heroType + ' character, pastel colors, 2d flat vector art, white background')}?width=200&height=200&nologo=true`;

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const loadTurn = async (page, input = '') => {
    setLoading(true);
    setCurrentOptions([]);
    
    const historyContext = [...messages, { sender: 'user', text: input }]
      .filter(m => m.text)
      .map(m => `${m.sender === 'ai' ? '동화 내용' : '주인공 행동'}: ${m.text}`)
      .join('\n');
      
    const data = await generateStoryTurn(page, theme, protagonist, input, grade, historyContext);
    
    const turnData = {
        storyText: data.storyText,
        question: data.question,
        options: data.options || [],
        image: data.image || null,
        isLastPage: data.isLastPage
      };

      setStoryData(prev => [...prev, turnData]);
      
      // options가 배열인지 확인
      const currentOptions = Array.isArray(data.options) ? data.options : [];
      
      const botMessage = {
        sender: 'ai',
        text: `${data.storyText || ''} ${data.question || ''}`.trim(),
        options: currentOptions,
        image: data.image || null
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      setCurrentOptions(currentOptions);
      setLoading(false);

      if (data.isLastPage) {
        setTimeout(() => {
          setIsCompleted(true);
          fireConfetti();
        }, 2000);
      }
  };

  const hasLoaded = useRef(false);
  useEffect(() => {
    if (!hasLoaded.current) {
      loadTurn(1);
      hasLoaded.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleUserResponse = (text) => {
    if (!text.trim()) return;

    if (BAD_WORDS.some(word => text.includes(word))) {
      setIsLocked(true);
      return;
    }

    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: text
    }]);

    setCurrentOptions([]);
    setCustomInput('');
    setCurrentPage(prev => prev + 1);
    
    loadTurn(currentPage + 1, text);
  };

  if (isLocked) {
    return (
      <div className="container animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', maxWidth: '800px', minHeight: '85vh' }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '4rem 2rem', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '100%' }}>
          <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ff6b6b' }}>🚨 잠깐만요! 🚨</h1>
          <p className="subtitle" style={{ fontSize: '1.5rem', marginBottom: '3rem', color: '#333' }}>
            나쁜 말이 감지되어 대화창이 잠겼습니다.<br/>
            고운 말을 사용해주세요. 선생님이나 부모님의 확인이 필요합니다.
          </p>
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <input 
              type="password" 
              className="input-field" 
              placeholder="관리자 코드" 
              value={unlockCode} 
              onChange={(e) => setUnlockCode(e.target.value)} 
              style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}
            />
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}
              onClick={() => {
                if (unlockCode === '1357') {
                  setIsLocked(false);
                  setUnlockCode('');
                  setCustomInput('');
                } else {
                  alert('코드가 틀렸습니다.');
                }
              }}
            >
              잠금 해제
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const finalImage = storyData.find(d => d.isLastPage)?.image || storyData[0]?.image;
    
    return (
      <div className="container animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', maxWidth: '800px' }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '4rem 2rem', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '100%' }}>
          <Sparkles size={64} color="#f5a623" className="animate-fade-in" style={{ marginBottom: '1rem', animationDuration: '2s', animationIterationCount: 'infinite' }} />
          <h1 className="title" style={{ fontSize: '4rem', marginBottom: '1rem', color: '#f5a623', textShadow: '2px 2px 0px rgba(255,255,255,1)' }}>🎉 완성 축하! 🎉</h1>
          <p className="subtitle" style={{ fontSize: '1.6rem', marginBottom: '3rem', color: '#333' }}>
            짝짝짝! 드디어 15단계의 기나긴 모험을 마쳤어요!<br/>나만의 멋진 '{theme}' 동화가 탄생했습니다.
          </p>
          
          {finalImage && (
            <div style={{ padding: '10px', background: 'white', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '3rem', display: 'inline-block' }}>
              <img src={finalImage} alt="결말 이미지" style={{ width: '100%', maxWidth: '500px', borderRadius: '16px' }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.2rem 3rem', fontSize: '1.5rem', borderRadius: '30px', whiteSpace: 'nowrap' }} onClick={() => onSave({ theme, pages: storyData })}>
              <BookOpen size={24} />
              보관함에 자랑하기 💾
            </button>
            <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.2rem 3rem', fontSize: '1.5rem', borderRadius: '30px', border: '2px solid #eaeaea', whiteSpace: 'nowrap' }} onClick={onFinish}>
              새로운 모험 떠나기 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '1rem', maxWidth: '1400px' }}>
      
      <div style={{ display: 'flex', gap: '2rem', height: '85vh' }}>
        
        {/* Left Side: Chatbot UI */}
        <div style={{ flex: 2.5, display: 'flex', flexDirection: 'column' }}>
          <div className="chat-container" style={{ flex: 1, maxWidth: '100%', height: 'auto' }}>
            <div className="chat-history" ref={chatHistoryRef}>
              {messages.map(msg => (
                <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
                  <div className="chat-avatar" style={{ overflow: 'hidden' }}>
                    {msg.sender === 'ai' ? '🤖' : <AvatarWithLoading src={avatarUrl} alt="주인공" />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={`chat-bubble ${msg.sender}`} style={{ fontSize: grade === 'low' ? 'var(--text-size-low)' : 'var(--text-size-high)' }}>
                      {msg.text}
                    </div>
                    {msg.image && (
                      <ImageWithLoading src={msg.image} alt="Story illustration" />
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="chat-bubble-wrapper ai">
                  <div className="chat-avatar">🤖</div>
                  <div className="chat-bubble ai" style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '1.5rem' }}>
                    <span className="animate-pulse" style={{ width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%' }}></span>
                    <span className="animate-pulse" style={{ width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%', animationDelay: '0.2s' }}></span>
                    <span className="animate-pulse" style={{ width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%', animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {!loading && !isCompleted && currentOptions.length > 0 && (
              <div className="chat-input-area">
                <div className="chat-options">
                  {currentOptions.map((opt, idx) => (
                    <button 
                      key={idx} 
                      className="chat-option-btn"
                      onClick={() => handleUserResponse(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); handleUserResponse(customInput); }} style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="또는 원하는 행동을 직접 적어주세요!"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    style={{ background: '#f8f9fa' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0 1.5rem' }} disabled={!customInput.trim()}>
                    <Send size={20} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Dashboard Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Progress Card */}
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-light)', fontSize: '1.2rem' }}>진행도</span>
              <span style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '1.5rem' }}>{currentPage} / {TOTAL_TURNS}</span>
            </div>
            <div className="progress-bar-container" style={{ margin: 0, height: '12px' }}>
              <div className="progress-bar-fill" style={{ width: `${(currentPage / TOTAL_TURNS) * 100}%` }} />
            </div>
          </div>

          {/* Character Card */}
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 className="heading-font" style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1.5rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User color="var(--primary-color)" /> 내 캐릭터
            </h3>
            
            <div style={{ width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', border: '4px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
              <AvatarWithLoading src={avatarUrl} alt="주인공 프로필" />
            </div>

            <div style={{ textAlign: 'center', width: '100%' }}>
              <h2 className="heading-font" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', margin: 0 }}>{heroName}</h2>
              <p style={{ fontSize: '1.3rem', color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: 'bold' }}>{heroType}</p>
            </div>

            <div style={{ marginTop: 'auto', width: '100%', background: '#f8f9fa', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eaeaea' }}>
              <h4 className="heading-font" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem', color: '#555', marginBottom: '0.8rem' }}>
                <Star color="#f5a623" size={20} /> 이번 이야기 주제
              </h4>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.4 }}>{theme}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
