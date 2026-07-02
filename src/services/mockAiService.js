export const generateStoryPage = async (pageNumber, theme, previousInput = '', grade = 'low') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const pageContents = {
    1: {
      image: 'https://images.unsplash.com/photo-1514068574489-503a8eb91592?auto=format&fit=crop&w=800&q=80',
      text: `${theme}의 세계로 모험을 떠납니다! 눈앞에 거대한 문이 나타났어요. 문 너머에서는 신비로운 소리가 들려옵니다. 주인공은 용기를 내어 한 걸음 앞으로 다가갔어요. 주변에는 반짝이는 요정들이 날아다니고, 멀리서는 처음 보는 신기한 동물들이 뛰어놀고 있습니다. 과연 이 문을 열면 어떤 일이 벌어질까요? 주인공의 심장이 두근거리기 시작했습니다.`,
      options: [
        '문을 활짝 열고 들어간다.',
        '문틈으로 살짝 엿본다.'
      ]
    },
    2: {
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      text: `[${previousInput}]을(를) 선택했군요! 안으로 들어가자 놀라운 광경이 펼쳐졌어요. 하지만 기쁨도 잠시, 깊은 숲 속에서 길을 잃고 말았습니다. 설상가상으로 앞에는 깊고 빠른 강물이 흐르고 있어요. 다리는 끊어져 있고, 해는 뉘엿뉘엿 지고 있습니다. 안전하게 강을 건너려면 어떻게 해야 할까요? ${grade === 'high' ? '조금 더 지혜롭고 신중한 선택이 필요합니다. 주변의 도구를 잘 활용해 보세요.' : '친구들의 도움이 필요할지도 몰라요!'}`,
      options: [
        '주변의 튼튼한 덩굴을 엮어 뗏목을 만든다.',
        '강물을 얼려버릴 마법 주문을 외운다.'
      ]
    },
    3: {
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      text: `[${previousInput}]의 결정 덕분에 무사히 위기를 넘길 수 있었어요! 드디어 목적지에 도착한 주인공은 잃어버렸던 소중한 보물을 찾았습니다. 이번 모험을 통해 용기와 지혜, 그리고 친구들과 돕는 마음이 얼마나 중요한지 깨달았어요. 앞으로 어떤 어려움이 닥쳐도 씩씩하게 이겨낼 수 있을 거예요. 참 잘했어요! 정말 멋진 모험이었습니다.`,
      options: []
    }
  };

  return pageContents[pageNumber] || pageContents[1];
};
