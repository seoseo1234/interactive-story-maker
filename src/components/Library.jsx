import React, { useEffect, useState } from 'react';
import { getSupabase } from '../services/supabaseClient';
import { Trash2, PlayCircle, Edit3 } from 'lucide-react';

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
        src={src ? src.replace('&model=flux-schnell', '') : src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', display: 'block', opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }} 
      />
    </div>
  );
};

const CardImageWithLoading = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%', height: '200px', background: '#f8f9fa', overflow: 'hidden' }}>
      {!loaded && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
          <div style={{ width: '30px', height: '30px', border: '3px solid #ffe3e3', borderTop: '3px solid #ff6b6b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ color: '#888', fontSize: '0.9rem', fontWeight: 'bold' }}>🎨 이미지 생성중...</span>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }} 
      />
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const MOCK_STORIES = [
  {
    id: 'mock1',
    title: '비오는 날에 비행기 모는 이야기',
    created_at: new Date(Date.now() - 100000).toISOString(),
    pages: [
      { storyText: '비가 주룩주룩 내리는 날이었어요. 꼬마 비행기 윙윙이는 첫 비행을 앞두고 활주로에 서 있었죠.', image: 'https://image.pollinations.ai/prompt/cute%20airplane%20in%20rain%20fairy%20tale?width=400&height=300&nologo=true' },
      { storyText: '관제탑 아저씨가 "윙윙아, 앞이 잘 안 보일 텐데 헤드라이트를 켤래?" 하고 물으셨어요. 윙윙이는 씩씩하게 헤드라이트를 켰어요.' },
      { storyText: '번쩍! 불빛을 켜니 앞이 조금 보였어요. 엔진에 힘을 주고 부릉부릉 달려가기 시작했어요.' },
      { storyText: '윙윙이가 서서히 하늘로 떠올랐을 때, 갑자기 센 바람이 불어서 몸이 크게 휘청거렸어요!' },
      { storyText: '윙윙이는 당황하지 않고 날개를 꽉 잡으며 침착하게 중심을 잡았어요.' },
      { storyText: '구름 속으로 들어가자 솜사탕처럼 부드럽고 차가운 구름이 윙윙이의 몸을 감쌌어요.' },
      { storyText: '그런데 저 멀리서 까만 먹구름이 번개를 뿜으며 다가오고 있었어요. 윙윙이는 먹구름 위로 올라가기로 결정했어요.' },
      { storyText: '영차영차 위로 올라가자 먹구름을 뚫고 환한 햇살이 비치는 파란 하늘이 나타났어요!' },
      { storyText: '아래를 내려다보니 먹구름 위로 예쁜 일곱 빛깔 무지개가 둥글게 피어나 있었어요.' },
      { storyText: '첫 비행을 무사히 마친 윙윙이는 빗속에서도 용기를 내면 아름다운 무지개를 볼 수 있다는 걸 배웠답니다.' }
    ]
  },
  {
    id: 'mock2',
    title: '바나나 먹고 배탈 난 원숭이',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    pages: [
      { storyText: '옛날 옛적에 숲속 마을에 덜렁대는 원숭이 몽이가 살았어요. 몽이는 달콤한 과일 냄새를 따라 걷고 있었죠.', image: 'https://image.pollinations.ai/prompt/cute%20monkey%20eating%20banana%20fairy%20tale%20illustration?width=400&height=300&nologo=true' },
      { storyText: '냄새를 따라가 보니 엄청나게 커다란 바나나 나무에 노란 바나나가 주렁주렁 매달려 있었어요!' },
      { storyText: '몽이는 신이 나서 가장 크고 맛있어 보이는 바나나를 덥석 땄어요.' },
      { storyText: '너무 배가 고팠던 몽이는 씻지도 않고 껍질을 대충 벗겨서 와구와구 한입에 삼켜버렸어요.' },
      { storyText: '"와, 달콤해!" 하고 좋아하던 것도 잠시, 갑자기 몽이의 배에서 꾸르륵 소리가 나기 시작했어요.' },
      { storyText: '배가 점점 아파지자 몽이는 바닥에 데굴데굴 구르며 엉엉 울음을 터뜨렸어요.' },
      { storyText: '그때 지나가던 토끼 의사 선생님이 몽이를 발견하고 다급하게 달려와 쓴 약초를 건네주셨어요.' },
      { storyText: '너무 썼지만 몽이는 눈을 꼭 감고 꿀꺽 삼켰어요. 잠시 후 신기하게도 배 아픈 게 싹 사라졌어요.' },
      { storyText: '토끼 선생님은 "몽이야, 아무리 배가 고파도 손을 꼭 씻고 먹어야 해"라고 말씀하셨어요.' },
      { storyText: '몽이는 선생님의 말씀을 명심하고, 앞으로는 절대 허겁지겁 더러운 손으로 먹지 않기로 굳게 다짐했답니다!' }
    ]
  },
  {
    id: 'mock3',
    title: '달나라 토끼의 특별한 우주선',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    pages: [
      { storyText: '달나라에는 절구통을 무척 아끼는 토끼 달콩이가 살고 있었어요.', image: 'https://image.pollinations.ai/prompt/moon%20rabbit%20pounding%20mochi%20fairy%20tale?width=400&height=300&nologo=true' },
      { storyText: '어느 날, 쿵! 하는 소리에 밖으로 나가보니 지구에서 온 꼬마 우주선이 고장 나 있었어요.' },
      { storyText: '우주선 안에는 길을 잃은 꼬마 우주인이 훌쩍이고 있었어요. 달콩이는 우주인에게 다가가 따뜻하게 안아주었어요.' },
      { storyText: '달콩이는 고장 난 우주선을 고쳐주기 위해 튼튼한 별 조각들을 모으기로 했어요.' },
      { storyText: '반짝이는 별 조각을 주워서 우주선의 부서진 날개에 꼼꼼하게 붙여주었어요.' },
      { storyText: '하지만 우주선이 다시 날아가려면 특별한 마법 연료가 필요했어요. 달콩이는 절구통을 꺼냈어요.' },
      { storyText: '달콩이는 은하수 물과 달빛 가루를 절구통에 넣고 영차영차 찧기 시작했어요.' },
      { storyText: '콩콩 찧을 때마다 절구통에서 반짝반짝 빛나는 신비한 연료가 퐁퐁 솟아났어요.' },
      { storyText: '우주선의 연료통에 마법의 연료를 가득 채워주자, 우주선이 다시 윙~ 하고 힘차게 움직였어요!' },
      { storyText: '우주인은 달콩이에게 고맙다고 손을 흔들며 지구로 돌아갔고, 달콩이의 절구통은 세상에서 제일 멋진 도구가 되었답니다.' }
    ]
  }
];

export default function Library({ user, onBack, guestStories = [], setGuestStories }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStory, setSelectedStory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      if (user?.isGuest) {
        setStories([...guestStories, ...MOCK_STORIES]);
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
      if (!supabase || user?.isGuest) {
        setStories(prev => prev.filter(s => s.id !== id));
        if (setGuestStories) setGuestStories(prev => prev.filter(s => s.id !== id));
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

  const handleEditClick = (e, story) => {
    e.stopPropagation();
    setSelectedStory(story);
    setIsEditing(true);
    setEditFormData({
      title: story.title,
      pages: story.pages ? JSON.parse(JSON.stringify(story.pages)) : []
    });
  };

  const handleSaveEdit = async () => {
    try {
      const supabase = getSupabase();
      if (!supabase || user?.isGuest) {
        setStories(prev => prev.map(s => s.id === selectedStory.id ? { ...s, title: editFormData.title, pages: editFormData.pages } : s));
        if (setGuestStories) setGuestStories(prev => prev.map(s => s.id === selectedStory.id ? { ...s, title: editFormData.title, pages: editFormData.pages } : s));
        setIsEditing(false);
        setSelectedStory(null);
        alert('임시 저장되었습니다!');
        return;
      }
      
      const { error } = await supabase
        .from('stories')
        .update({ title: editFormData.title, pages: editFormData.pages })
        .eq('id', selectedStory.id);
        
      if (error) throw error;
      
      setStories(prev => prev.map(s => s.id === selectedStory.id ? { ...s, title: editFormData.title, pages: editFormData.pages } : s));
      setIsEditing(false);
      setSelectedStory(null);
      alert('수정 내용이 저장되었습니다!');
    } catch (err) {
      console.error('수정 오류:', err);
      alert('수정에 실패했습니다.');
    }
  };

  return (
    <>
      {/* 동화 읽기 모달 */}
      {selectedStory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => { if(!isEditing) setSelectedStory(null) }}>
          <div style={{ background: '#faf8f5', border: '3px solid #e8dfd5', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '3rem', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => { setSelectedStory(null); setIsEditing(false); }} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#eaeaea', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
            >
              ✕
            </button>
            
            {isEditing ? (
              <input 
                value={editFormData.title} 
                onChange={e => setEditFormData({...editFormData, title: e.target.value})}
                style={{ fontSize: '2rem', width: '100%', border: '2px solid #74b9ff', borderRadius: '12px', padding: '0.8rem', marginBottom: '1rem', textAlign: 'center', fontFamily: 'inherit', fontWeight: 'bold', color: 'var(--primary-color)' }}
              />
            ) : (
              <h1 className="heading-font" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem', textAlign: 'center' }}>{selectedStory.title}</h1>
            )}

            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '3rem' }}>{new Date(selectedStory.created_at).toLocaleDateString()} 생성됨</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '0 2rem' }}>
              {(isEditing ? editFormData.pages : selectedStory.pages)?.map((page, idx) => {
                const paragraphText = page.storyText || page.text;
                if (!paragraphText && !isEditing) return null;
                
                return (
                  <div key={idx} style={{ 
                    fontSize: '1.25rem', 
                    lineHeight: 1.8, 
                    color: 'var(--text-main)', 
                    fontFamily: "'Gowun Dodum', sans-serif",
                    letterSpacing: '0.02em',
                    textIndent: '1rem'
                  }}>
                    {page.image && !isEditing && (
                      <ImageWithLoading src={page.image} alt="삽화" />
                    )}
                    {page.image && isEditing && (
                      <img src={page.image} alt="삽화 썸네일" style={{ width: '150px', borderRadius: '8px', marginBottom: '1rem', opacity: 0.8 }} />
                    )}
                    
                    {isEditing ? (
                      <textarea 
                        value={paragraphText}
                        onChange={(e) => {
                          const newPages = [...editFormData.pages];
                          newPages[idx] = { ...newPages[idx], storyText: e.target.value, text: e.target.value };
                          setEditFormData({ ...editFormData, pages: newPages });
                        }}
                        style={{ width: '100%', minHeight: '120px', fontSize: '1.2rem', padding: '1.2rem', borderRadius: '12px', border: '2px solid #ffe3e3', fontFamily: 'inherit', lineHeight: 1.8, background: '#fff0f6', resize: 'vertical' }}
                      />
                    ) : (
                      <p style={{ margin: 0, wordBreak: 'keep-all' }}>{paragraphText}</p>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              {isEditing ? (
                <>
                  <button className="btn" onClick={() => setIsEditing(false)} style={{ borderRadius: '30px', padding: '1rem 2.5rem', fontSize: '1.2rem', background: '#eaeaea' }}>
                    수정 취소
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveEdit} style={{ borderRadius: '30px', padding: '1rem 3.5rem', fontSize: '1.2rem' }}>
                    저장하기
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={() => setSelectedStory(null)} style={{ borderRadius: '30px', padding: '1rem 3rem', fontSize: '1.2rem' }}>
                  다 읽었어요!
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
        <div style={{ background: 'rgba(250, 248, 245, 0.9)', border: '3px solid #e8dfd5', padding: '2rem 3rem', borderRadius: '24px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="title" style={{ margin: 0, textAlign: 'left', color: 'var(--primary-color)' }}>{user?.isGuest ? '예시 작품 갤러리 📚' : '내 보관함 📚'}</h1>
          <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>{user?.isGuest ? '다른 친구들이 만든 멋진 동화를 감상해보세요!' : '내가 만든 멋진 이야기들이 모여있어요!'}</p>
        </div>
        <button className="btn" onClick={onBack} style={{ borderRadius: '30px', padding: '0.8rem 2rem' }}>
          돌아가기
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', background: '#faf8f5', border: '3px solid #e8dfd5', borderRadius: '24px' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>보관함을 여는 중입니다...</p>
        </div>
      ) : stories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(250, 248, 245, 0.9)', border: '3px solid #e8dfd5', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
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
                background: '#faf8f5', border: '3px solid #e8dfd5', 
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
                  <CardImageWithLoading src={coverImage} alt="Cover" />
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={(e) => handleEditClick(e, story)}
                        style={{ 
                          background: '#e0f2fe', 
                          color: '#0284c7', 
                          border: 'none', 
                          padding: '0.6rem', 
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#bae6fd'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#e0f2fe'}
                        title="수정하기"
                      >
                        <Edit3 size={18} />
                      </button>
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
              </div>
            );
          })}
        </div>
      )}
      </div>
    </>
  );
}
