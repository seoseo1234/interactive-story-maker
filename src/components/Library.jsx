import React, { useEffect, useState } from 'react';
import { getSupabase } from '../services/supabaseClient';
import { Trash2, PlayCircle } from 'lucide-react';

const ImageWithLoading = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto 2rem auto', overflow: 'hidden', borderRadius: '16px', minHeight: '300px', background: '#f0f0f0', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
      {!loaded && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#888', fontSize: '1rem' }}>🎨 AI가 그림을 그리는 중...</span>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', display: 'block', opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }} 
      />
    </div>
  );
};

export default function Library({ user, onBack }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();
      if (!supabase) {
        setStories([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setStories(data || []);
    } catch (err) {
      console.error('보관함 불러오기 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // 카드 클릭 이벤트 버블링 방지
    if (!window.confirm('정말 이 동화를 삭제할까요?')) return;
    
    try {
      const supabase = getSupabase();
      if (!supabase) {
        setStories(prev => prev.filter(s => s.id !== id));
        return;
      }

      const { error } = await supabase.from('stories').delete().eq('id', id);
      if (error) throw error;
      
      setStories(prev => prev.filter(s => s.id !== id));
      if (selectedStory?.id === id) setSelectedStory(null);
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      
      {/* 동화 읽기 모달 */}
      {selectedStory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setSelectedStory(null)}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '3rem', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedStory(null)} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#eaeaea', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
            >
              ✕
            </button>
            <h1 className="heading-font" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem', textAlign: 'center' }}>{selectedStory.title}</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '3rem' }}>{new Date(selectedStory.created_at).toLocaleDateString()} 생성됨</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '0 2rem' }}>
              {selectedStory.pages?.map((page, idx) => {
                // 이전 데이터 호환성을 위해 text 속성 폴백 지원
                const paragraphText = page.storyText || page.text;
                if (!paragraphText) return null;
                
                return (
                  <div key={idx} style={{ 
                    fontSize: '1.25rem', 
                    lineHeight: 1.8, 
                    color: 'var(--text-main)', 
                    fontFamily: "'Gowun Dodum', sans-serif",
                    letterSpacing: '0.02em',
                    textIndent: '1rem'
                  }}>
                    {page.image && (
                      <ImageWithLoading src={page.image} alt="삽화" />
                    )}
                    <p style={{ margin: 0, wordBreak: 'keep-all' }}>{paragraphText}</p>
                  </div>
                );
              })}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="btn btn-primary" onClick={() => setSelectedStory(null)} style={{ borderRadius: '30px', padding: '1rem 3rem', fontSize: '1.2rem' }}>
                다 읽었어요!
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.9)', padding: '2rem 3rem', borderRadius: '24px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="title" style={{ margin: 0, textAlign: 'left', color: 'var(--primary-color)' }}>내 보관함 📚</h1>
          <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>내가 만든 멋진 이야기들이 모여있어요!</p>
        </div>
        <button className="btn" onClick={onBack} style={{ borderRadius: '30px', padding: '0.8rem 2rem' }}>
          돌아가기
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.8)', borderRadius: '24px' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>보관함을 여는 중입니다...</p>
        </div>
      ) : stories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.9)', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '2rem' }}>아직 만든 동화가 없어요!</p>
          <button className="btn btn-primary" onClick={onBack} style={{ fontSize: '1.2rem', padding: '1rem 2.5rem', borderRadius: '30px' }}>
            새 동화 만들러 가기
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {stories.map(story => {
            const coverImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(story.title + ' fairy tale illustration cute colorful flat vector')}?width=400&height=300&nologo=true`;
            
            return (
              <div key={story.id} className="animate-fade-in" 
                onClick={() => setSelectedStory(story)}
                style={{ 
                background: 'white', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.06)' }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={coverImage} alt="Cover" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                  >
                    <PlayCircle color="white" size={64} style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 className="heading-font" style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{story.title}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    {new Date(story.created_at).toLocaleDateString()} 생성됨
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eaeaea', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>{story.pages?.length || 15} Turns</span>
                    <button 
                      onClick={(e) => handleDelete(e, story.id)}
                      style={{ 
                        background: '#fee2e2', 
                        color: '#ef4444', 
                        border: 'none', 
                        padding: '0.6rem', 
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                      title="삭제"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
