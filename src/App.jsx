import React, { useState, useEffect } from 'react';
import { getSupabase } from './services/supabaseClient';
import Auth from './components/Auth';
import Step1_GradeSelect from './components/Step1_GradeSelect';
import Step2_ThemeSelect from './components/Step2_ThemeSelect';
import Step3_StoryView from './components/Step3_StoryView';
import Library from './components/Library';
import { BookOpen } from 'lucide-react';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0); // 0: Auth, 1: Grade, 2: Theme, 3: Story, 4: Library
  const [grade, setGrade] = useState('');
  const [theme, setTheme] = useState('');
  const [protagonist, setProtagonist] = useState(null);

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
    if (!supabase) {
      alert('MOCK 모드입니다. 브라우저에 임시로 저장했다고 가정합니다!');
      setStep(4);
      return;
    }
    try {
      const { error } = await supabase.from('stories').insert({
        user_id: user.id,
        title: storyData.theme,
        pages: storyData.pages
      });
      if (error) throw error;
      setStep(4); // Go to library
    } catch (err) {
      console.error('Error saving story:', err);
      alert('저장에 실패했어요. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <header style={{ background: 'white', padding: '1rem 2rem', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => user ? setStep(1) : setStep(0)}>
          <img src="/icon.png" alt="App Icon" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <h1 className="heading-font" style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)' }}>AI 동화 메이커</h1>
        </div>
        {user && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ fontSize: '1rem', padding: '0.5rem 1rem', background: '#e9ecef', color: '#495057' }} onClick={() => setStep(4)}>
              내 보관함 📚
            </button>
            <button className="btn" style={{ fontSize: '1rem', padding: '0.5rem 1rem', background: '#fff0f6', color: '#a61e4d' }} onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        )}
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {step === 0 && <Auth onLogin={handleLogin} />}
        {step === 1 && <Step1_GradeSelect onSelect={(selectedGrade) => { setGrade(selectedGrade); setStep(2); }} />}
        {step === 2 && (
          <Step2_ThemeSelect grade={grade} onSelect={(data) => { 
            if(typeof data === 'string') {
              // Fallback for previous code
              setTheme(data); 
              setProtagonist({ name: '주인공', type: '어린이' });
            } else {
              setTheme(data.theme); 
              setProtagonist(data.protagonist);
            }
            setStep(3); 
          }} />
        )}
        
        {step === 3 && (
          <Step3_StoryView 
            grade={grade} 
            theme={theme} 
            protagonist={protagonist}
            onFinish={() => setStep(1)} 
            onSave={saveStoryToSupabase}
          />
        )}
        {step === 4 && <Library user={user} onBack={() => setStep(1)} />}
      </main>
    </>
  );
}

export default App;
