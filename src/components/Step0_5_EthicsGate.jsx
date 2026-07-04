import React, { useState } from 'react';
import { ShieldCheck, Target, Lightbulb, Search, Maximize2, Lock, Eye } from 'lucide-react';

const guides = [
  {
    icon: <Target size={32} color="#f5a623" />,
    title: "1. 활용 목적",
    subtitle: "생성형 AI를 쓰기 전, '왜' 쓰는지 말할 수 있어야 해요.",
    desc: "생성형 AI를 사용하기 전에 '지금 내가 왜 쓰려고 하지?'라고 스스로 물어보세요. 생성형 AI는 내 생각을 대신해주는 게 아니라, 내 생각을 도와주는 도구임을 기억하세요. 모든 공부에 생성형 AI가 필요한 것은 아니므로, 지금 하는 활동에 생성형 AI를 사용하는 것이 나의 학습에 정말 도움이 될지 먼저 고민해요."
  },
  {
    icon: <Lightbulb size={32} color="#f5a623" />,
    title: "2. 주도적 학습",
    subtitle: "생성형 AI에게 물어보기 전, 내 생각을 먼저 말해요.",
    desc: "막막할 때 바로 생성형 AI에게 묻고 싶은 마음이 들 수 있지만, 먼저 스스로 시도해 보아야 나의 성장에 도움이 돼요. 주제에 대해 내가 아는 것과 내 아이디어를 먼저 공책에 적거나 정리한 뒤에 생성형 AI를 활용하세요."
  },
  {
    icon: <Search size={32} color="#f5a623" />,
    title: "3. 비판적 검증",
    subtitle: "생성형 AI가 틀릴 수 있다는 점을 알아요.",
    desc: "생성형 AI는 틀린 정보를 마치 사실인 것처럼 제시하기도 하므로, 알려준 내용은 항상 '정말 맞을까?' 하고 한 번 더 확인하는 습관을 가져요. 중요한 내용일수록 책을 찾아보거나 선생님께 여쭤보는 등 다른 방법으로도 꼭 다시 확인하세요."
  },
  {
    icon: <Maximize2 size={32} color="#50e3c2" />,
    title: "4. 사고의 확장",
    subtitle: "생성형 AI와 함께 상상하며 내 생각을 더 크게 키워요.",
    desc: "생성형 AI를 내 생각의 범위를 넓혀주는 도구로 사용해보세요. 생성형 AI의 결과물을 그대로 사용하지 않고, 나의 경험과 생각을 더하여 나만의 색깔을 담은 최종 결과물을 만들어요."
  },
  {
    icon: <Lock size={32} color="#4a90e2" />,
    title: "5. 안전과 관계",
    subtitle: "나의 정보와 비밀을 말하지 않아요.",
    desc: "내가 입력한 정보는 어디에서 어떻게 사용될지 모르기 때문에 이름, 주소, 학교, 전화번호 같은 개인정보는 생성형 AI에게 알려주면 안돼요. 생성형 AI는 계산된 답변을 내놓는 프로그램이라 감정이 없어요. 나의 고민을 털어놓으며 지나치게 의지하기보다, 친구나 부모님, 선생님과의 실제 대화를 통해 마음을 나누어요."
  },
  {
    icon: <Eye size={32} color="#f5a623" />,
    title: "6. 투명성·윤리",
    subtitle: "생성형 AI의 도움을 받았다면 숨기지 않고 정직하게 이야기해요.",
    desc: "어느 부분이 생성형 AI의 것이고 어느 부분이 나의 것인지 명확히 밝히는 것은 나 자신을 속이지 않는 정직한 태도예요. 생성형 AI를 쓴 사실을 정직하게 밝힐 때 나의 노력이 더 빛나고 가치 있게 인정받을 수 있어요."
  }
];

export default function Step0_5_EthicsGate({ onAgree }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1100px', padding: '1rem' }}>
      <div style={{ background: 'rgba(250, 248, 245, 0.95)', border: '3px solid #e8dfd5', padding: '2rem', borderRadius: '32px', boxShadow: 'var(--shadow-lg)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <ShieldCheck size={48} color="var(--primary-color)" style={{ marginBottom: '0.5rem' }} />
          <h1 className="title" style={{ fontSize: '2.2rem', color: 'var(--primary-color)', margin: '0 0 0.5rem 0' }}>AI 동화 메이커 윤리 핵심 가이드</h1>
          <p className="subtitle" style={{ fontSize: '1.1rem', color: '#555', margin: 0 }}>
            우리가 AI와 함께 멋진 동화를 만들기 위해 꼭 지켜야 할 약속들이에요.<br/>
            시작하기 전에 아래 6가지 가이드를 꼼꼼히 읽어주세요!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {guides.map((guide, idx) => (
            <div key={idx} style={{ background: '#fffcf0', padding: '1.2rem', borderRadius: '20px', border: '2px solid #ffec99', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 4px 10px rgba(255,236,153,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ background: '#faf8f5', border: '3px solid #e8dfd5', padding: '0.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                  {React.cloneElement(guide.icon, { size: 24 })}
                </div>
                <h2 className="heading-font" style={{ fontSize: '1.3rem', color: '#333', margin: 0 }}>{guide.title}</h2>
              </div>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary-color)', lineHeight: 1.3, margin: '0.2rem 0' }}>{guide.subtitle}</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.4, margin: 0 }}>{guide.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#f0f7ff', padding: '1.5rem', borderRadius: '20px', border: '2px solid #cce4ff', textAlign: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
            <input 
              type="checkbox" 
              checked={isChecked} 
              onChange={(e) => setIsChecked(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            나는 윤리 핵심가이드를 빠짐없이 읽고 이를 실천하겠습니다.
          </label>
          
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '1.5rem', fontSize: '1.3rem', padding: '1rem 2.5rem', borderRadius: '30px', opacity: isChecked ? 1 : 0.5, cursor: isChecked ? 'pointer' : 'not-allowed' }}
            disabled={!isChecked}
            onClick={onAgree}
          >
            동의하고 활동 시작하기 🚀
          </button>
        </div>

      </div>
    </div>
  );
}
