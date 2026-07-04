import React, { useState, useEffect } from 'react';
import { getSupabase } from './services/supabaseClient';
import Auth from './components/Auth';
import Step0_5_EthicsGate from './components/Step0_5_EthicsGate';
import Step1_GradeSelect from './components/Step1_GradeSelect';
import Step2_ThemeSelect from './components/Step2_ThemeSelect';
import Step3_StoryView from './components/Step3_StoryView';
import Library from './components/Library';
import MarkdownModal from './components/MarkdownModal';
import { BookOpen } from 'lucide-react';
import './index.css';

import termsText from './assets/이용약관.md?raw';
import privacyText from './assets/개인정보처리방침.md?raw';

function App() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0); // 0: Auth, 1: Ethics, 2: Grade, 3: Theme, 4: Story, 5: Library
  const [grade, setGrade] = useState('');
  const [theme, setTheme] = useState('');
  const [protagonist, setProtagonist] = useState(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [guestStories, setGuestStories] = useState([]);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setStep(1);
      } else {
        setStep(0);
      }
    };
    checkSession();
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setStep(1);
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setStep(0);
  };

  const saveStoryToSupabase = async (storyData) => {
    const supabase = getSupabase();
    if (!supabase || user?.isGuest) {
      const newStory = {
        id: `guest-${Date.now()}`,
        user_id: 'guest',
        title: storyData.theme,
        pages: storyData.pages,
        created_at: new Date().toISOString()
      };
      setGuestStories(prev => [newStory, ...prev]);
      alert('둘러보기 모드이므로 브라우저에 임시로 저장되었습니다! (새로고침 시 사라집니다)');
      setStep(5);
      return;
    }
    try {
      const { error } = await supabase.from('stories').insert({
        user_id: user.id,
        title: storyData.theme,
        pages: storyData.pages
      });
      if (error) throw error;
      setStep(5); // Go to library
    } catch (err) {
      console.error('Error saving story:', err);
      alert('저장에 실패했어요. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <header style={{ background: '#faf8f5', border: '3px solid #e8dfd5', padding: '1rem 2rem', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => user ? (step > 1 ? setStep(2) : setStep(1)) : setStep(0)}>
          <img src="/icon.png" alt="App Icon" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <h1 className="heading-font" style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)' }}>인터렉티브 스토리 제작소</h1>
        </div>
        {user && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ fontSize: '1rem', padding: '0.5rem 1rem', background: '#e9ecef', color: '#495057' }} onClick={() => setStep(5)}>
              {user.isGuest ? '예시 작품 보기 📚' : '내 보관함 📚'}
            </button>
            <button className="btn" style={{ fontSize: '1rem', padding: '0.5rem 1rem', background: '#fff0f6', color: '#a61e4d' }} onClick={handleLogout}>
              {user.isGuest ? '둘러보기 종료' : '로그아웃'}
            </button>
          </div>
        )}
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {step === 0 && <Auth onLogin={handleLogin} />}
        {step === 1 && <Step0_5_EthicsGate onAgree={() => setStep(2)} />}
        {step === 2 && <Step1_GradeSelect onSelect={(selectedGrade) => { setGrade(selectedGrade); setStep(3); }} onBack={() => setStep(1)} />}
        {step === 3 && (
          <Step2_ThemeSelect grade={grade} onSelect={(data) => { 
            if(typeof data === 'string') {
              // Fallback for previous code
              setTheme(data); 
              setProtagonist({ name: '주인공', type: '어린이' });
            } else {
              setTheme(data.theme); 
              setProtagonist(data.protagonist);
            }
            setStep(4); 
          }} onBack={() => setStep(2)} />
        )}
        
        {step === 4 && (
          <Step3_StoryView 
            grade={grade} 
            theme={theme} 
            protagonist={protagonist}
            onFinish={() => setStep(2)} 
            onSave={saveStoryToSupabase}
          />
        )}
        {step === 5 && <Library user={user} onBack={() => setStep(2)} guestStories={guestStories} setGuestStories={setGuestStories} />}
      </main>

      <footer style={{ background: '#fcf4fb', padding: '2rem', borderTop: '1px solid #f6e6f5', textAlign: 'center', color: '#6a5a6a', fontSize: '0.95rem', marginTop: 'auto' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button style={{ background: 'none', border: 'none', color: '#a05c9a', cursor: 'pointer', textDecoration: 'underline', padding: 0 }} onClick={() => setIsTermsOpen(true)}>이용약관</button>
          <span style={{ color: '#d8c8d8' }}>|</span>
          <button style={{ background: 'none', border: 'none', color: '#a05c9a', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontWeight: 'bold' }} onClick={() => setIsPrivacyOpen(true)}>개인정보처리방침</button>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          정보관리책임자: 윤서희 교사 (서울잠동초등학교)
        </div>
        <div>
          &copy; 2026 인터렉티브 스토리 제작소. All rights reserved.
        </div>
      </footer>

      {isTermsOpen && (
        <MarkdownModal title="이용약관" content={termsText} onClose={() => setIsTermsOpen(false)} />
      )}
      {isPrivacyOpen && (
        <MarkdownModal title="개인정보처리방침" content={privacyText} onClose={() => setIsPrivacyOpen(false)} />
      )}
    </>
  );
}

export default App;
