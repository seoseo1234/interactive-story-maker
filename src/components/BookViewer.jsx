import React, { useState, useEffect, useRef } from 'react';
import { VolumeX, Volume2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const playFlipSound = (isMuted) => {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const bufferSize = audioCtx.sampleRate * 0.15; // 150ms
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1200;
    bandpass.Q.value = 0.5;
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    
    noise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    noise.start();
  } catch (e) {
    console.error(e);
  }
};

const ImageWithLoading = ({ src, alt, isCover }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: isCover ? '250px' : '200px',
      background: '#f0f0f0', 
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '1rem',
      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
    }}>
      {!loaded && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#aaa', fontSize: '0.9rem', fontFamily: "'Gowun Dodum', sans-serif" }}>그림 불러오는 중...</span>
        </div>
      )}
      <img 
        src={src ? src.replace('&model=flux-schnell', '') : src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }} 
      />
    </div>
  );
};

export default function BookViewer({ story, onClose }) {
  const [currentSheet, setCurrentSheet] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  // 1. Prepare book pages
  const bookPages = [];
  
  // Page 0: Cover
  bookPages.push({ type: 'cover', title: story.title, image: story.pages[0]?.image });
  
  // Page 1 ~ N: Content
  story.pages.forEach((p) => {
    const text = p.storyText || p.text;
    if (text) {
      bookPages.push({ type: 'content', text, image: p.image });
    }
  });
  
  // Last Page: Back cover
  bookPages.push({ type: 'end' });
  
  // Make even
  if (bookPages.length % 2 !== 0) {
    bookPages.push({ type: 'blank' });
  }

  const numSheets = Math.ceil(bookPages.length / 2);

  // Responsive scaling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setScale(window.innerWidth / 900 * 0.95);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const flipNext = () => {
    if (currentSheet < numSheets) {
      playFlipSound(isMuted);
      setCurrentSheet(prev => prev + 1);
    }
  };

  const flipPrev = () => {
    if (currentSheet > 0) {
      playFlipSound(isMuted);
      setCurrentSheet(prev => prev - 1);
    }
  };

  const renderPageContent = (page) => {
    if (!page) return <div className="page-content blank" />;
    
    switch (page.type) {
      case 'cover':
        return (
          <div className="page-content cover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', background: '#faf8f5', border: '12px solid #e8dfd5', boxSizing: 'border-box' }}>
            <h1 style={{ fontFamily: "'Jua', sans-serif", fontSize: '2.8rem', color: '#ff6b6b', textAlign: 'center', marginBottom: '2rem', lineHeight: 1.3, textShadow: '2px 2px 0px #fff, 4px 4px 0px rgba(0,0,0,0.1)', wordBreak: 'keep-all' }}>
              {page.title}
            </h1>
            {page.image && <ImageWithLoading src={page.image} alt="표지 삽화" isCover={true} />}
          </div>
        );
      case 'content':
        return (
          <div className="page-content story" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem', background: '#fffdf9', boxSizing: 'border-box' }}>
            {page.image && <ImageWithLoading src={page.image} alt="동화 삽화" />}
            <div style={{ flex: 1, overflowY: 'auto', fontFamily: "'Jua', sans-serif", fontSize: '1.4rem', lineHeight: 1.8, color: '#444', wordBreak: 'keep-all', paddingTop: '1rem' }}>
              {page.text}
            </div>
          </div>
        );
      case 'end':
        return (
          <div className="page-content end" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', background: '#faf8f5', boxSizing: 'border-box' }}>
            <h1 style={{ fontFamily: "'Jua', sans-serif", fontSize: '4rem', color: '#ccc', letterSpacing: '0.5rem' }}>-끝-</h1>
          </div>
        );
      default:
        return <div className="page-content blank" style={{ background: '#fffdf9', height: '100%', boxSizing: 'border-box' }} />;
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Top Controls */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '1rem', zIndex: 10010 }}>
        <button onClick={() => setIsMuted(!isMuted)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <button onClick={onClose} style={{ background: '#ff6b6b', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
          <X size={28} />
        </button>
      </div>

      {/* Book Container */}
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          width: '800px', 
          height: '550px', 
          perspective: '2000px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.3s'
        }}
      >
        {/* Book Spine Shadow */}
        <div style={{ position: 'absolute', top: '-10px', bottom: '-10px', left: 'calc(50% - 20px)', width: '40px', background: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)', zIndex: 0, borderRadius: '50%' }} />

        {/* Sheets */}
        {Array.from({ length: numSheets }).map((_, i) => {
          const isFlipped = currentSheet > i;
          const frontPage = bookPages[i * 2];
          const backPage = bookPages[i * 2 + 1];

          // Calculate Z-Index
          let zIndex = numSheets - i;
          if (isFlipped) {
            zIndex = i + 1;
          }

          return (
            <div 
              key={i}
              className={`book-sheet ${isFlipped ? 'flipped' : ''}`}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
                transition: 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)',
                zIndex,
                transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                cursor: 'pointer',
                boxShadow: isFlipped ? '5px 5px 20px rgba(0,0,0,0.1)' : '-5px 5px 20px rgba(0,0,0,0.1)'
              }}
              onClick={() => {
                if (isFlipped) flipPrev();
                else flipNext();
              }}
            >
              {/* Front Side */}
              <div 
                className="sheet-face sheet-front"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  background: '#fff',
                  borderTopRightRadius: '16px',
                  borderBottomRightRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                  borderLeft: '1px solid #ccc',
                  boxSizing: 'border-box'
                }}
              >
                {/* Lighting gradient for front */}
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '40px', background: 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)', zIndex: 10, pointerEvents: 'none' }} />
                {renderPageContent(frontPage)}
                {/* Page Number */}
                <div style={{ position: 'absolute', bottom: '15px', right: '25px', fontFamily: "'Jua', sans-serif", color: '#888', fontSize: '1.2rem' }}>
                  {i * 2 === 0 ? '' : i * 2}
                </div>
              </div>

              {/* Back Side */}
              <div 
                className="sheet-face sheet-back"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  background: '#fff',
                  transform: 'rotateY(180deg)',
                  borderTopLeftRadius: '16px',
                  borderBottomLeftRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                  borderRight: '1px solid #ccc',
                  boxSizing: 'border-box'
                }}
              >
                {/* Lighting gradient for back */}
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40px', background: 'linear-gradient(to left, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)', zIndex: 10, pointerEvents: 'none' }} />
                {renderPageContent(backPage)}
                {/* Page Number */}
                <div style={{ position: 'absolute', bottom: '15px', left: '25px', fontFamily: "'Jua', sans-serif", color: '#888', fontSize: '1.2rem' }}>
                  {i * 2 + 1 >= bookPages.length - 1 ? '' : i * 2 + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Hint */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '2rem', zIndex: 10010 }}>
        <button onClick={flipPrev} disabled={currentSheet === 0} style={{ background: 'transparent', border: 'none', color: currentSheet === 0 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: currentSheet === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontFamily: "'Jua', sans-serif" }}>
          <ChevronLeft size={32} /> 이전 페이지
        </button>
        <button onClick={flipNext} disabled={currentSheet === numSheets} style={{ background: 'transparent', border: 'none', color: currentSheet === numSheets ? 'rgba(255,255,255,0.2)' : '#fff', cursor: currentSheet === numSheets ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontFamily: "'Jua', sans-serif" }}>
          다음 페이지 <ChevronRight size={32} />
        </button>
      </div>

    </div>
  );
}
