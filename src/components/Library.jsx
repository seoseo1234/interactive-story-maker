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

const MOCK_STORIES = [
  {
    id: 'mock1',
    title: '바나나 먹고 배탈 난 원숭이',
    created_at: new Date().toISOString(),
    pages: [
      { storyText: '옛날 옛적에 숲속 마을에 먹보 원숭이가 살았어요.', image: 'https://image.pollinations.ai/prompt/cute%20monkey%20eating%20banana%20fairy%20tale%20illustration?width=400&height=300&nologo=true' },
      { storyText: '원숭이는 길을 가다가 엄청나게 큰 바나나 나무를 발견했어요. 너무 배가 고팠던 원숭이는 껍질째 와구와구 먹어버렸답니다.', image: 'https://image.pollinations.ai/prompt/giant%20banana%20tree%20fairy%20tale?width=400&height=300&nologo=true' },
      { storyText: '결국 배탈이 나서 병원에 가야 했어요. 앞으로는 씻어서 꼭꼭 씹어 먹기로 다짐했답니다!', image: 'https://image.pollinations.ai/prompt/sick%20monkey%20in%20bed%20fairy%20tale?width=400&height=300&nologo=true' }
    ]
  },
  {
    id: 'mock2',
    title: '비오는 날에 비행기 모는 이야기',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    pages: [
      { storyText: '비가 주룩주룩 내리는 날이었어요. 꼬마 비행기 윙윙이는 첫 비행을 앞두고 무서웠죠.', image: 'https://image.pollinations.ai/prompt/cute%20airplane%20in%20rain%20fairy%20tale?width=400&height=300&nologo=true' },
      { storyText: '천둥 번개가 쳐서 겁이 났지만, 관제탑 아저씨의 따뜻한 응원을 듣고 용기를 냈어요.', image: 'https://image.pollinations.ai/prompt/airport%20control%20tower%20fairy%20tale?width=400&height=300&nologo=true' },
      { storyText: '구름을 뚫고 올라가니 맑은 하늘과 예쁜 무지개가 윙윙이를 반겨주었답니다!', image: 'https://image.pollinations.ai/prompt/airplane%20over%20clouds%20with%20rainbow?width=400&height=300&nologo=true' }
    ]
  },
  {
    id: 'mock3',
    title: '달나라 토끼의 특별한 우주선',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    pages: [
      { storyText: '달나라에는 떡을 아주 잘 찧는 토끼가 살고 있었어요.', image: 'https://image.pollinations.ai/prompt/moon%20rabbit%20pounding%20mochi%20fairy%20tale?width=400&height=300&nologo=true' },
      { storyText: '어느 날 우주선이 고장 나 달에 불시착한 우주인 아저씨를 만났어요.', image: 'https://image.pollinations.ai/prompt/astronaut%20meeting%20rabbit%20on%20moon?width=400&height=300&nologo=true' },
      { storyText: '토끼는 절구통으로 마법의 우주떡을 만들어 우주선의 연료통에 채워주었고, 아저씨는 무사히 지구로 돌아갔어요.', image: 'https://image.pollinations.ai/prompt/spaceship%20flying%20away%20from%20moon?width=400&height=300&nologo=true' }
    ]
  }
];

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
      if (user?.isGuest) {
        setStories(MOCK_STORIES);
        return;
      }
      
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

      const { data, error } = await supabase.from('stories').delete().eq('id', id).select();
      if (error) throw error;
      
      if (!data || data.length === 0) {
        alert('삭제 권한이 없거나 설정이 필요합니다. (Supabase RLS 설정 확인)');
        return;
      }
      
      setStories(prev => prev.filter(s => s.id !== id));
      if (selectedStory?.id === id) setSelectedStory(null);
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <>
      {/* 동화 읽기 모달 */}
      {selectedStory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setSelectedStory(null)}>
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

      <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.9)', padding: '2rem 3rem', borderRadius: '24px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="title" style={{ margin: 0, textAlign: 'left', color: 'var(--primary-color)' }}>{user?.isGuest ? '예시 작품 갤러리 📚' : '내 보관함 📚'}</h1>
          <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>{user?.isGuest ? '다른 친구들이 만든 멋진 동화를 감상해보세요!' : '내가 만든 멋진 이야기들이 모여있어요!'}</p>
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
                    {!user?.isGuest && (
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
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </>
  );
}
