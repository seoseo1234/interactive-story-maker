import React, { useEffect, useState } from 'react';
import { getSupabase } from '../services/supabaseClient';

export default function Library({ user, onBack }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();
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

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title" style={{ margin: 0 }}>내 동화 보관함 📚</h1>
        <button className="btn btn-secondary" onClick={onBack}>
          뒤로 가기
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--text-light)' }}>불러오는 중...</p>
      ) : stories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: '1.5rem', color: 'var(--text-light)', marginBottom: '1rem' }}>아직 만든 동화가 없어요!</p>
          <button className="btn btn-primary" onClick={onBack}>새 동화 만들러 가기 ✨</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {stories.map(story => (
            <div key={story.id} style={{ background: 'white', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <img src={story.pages[0]?.image} alt="Cover" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <h3 className="heading-font" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#ff922b' }}>{story.title}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                  {new Date(story.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
