export const generateStoryPage = async (pageNumber, theme, previousInput = '', grade = 'low') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const totalTurns = grade === 'low' ? 10 : 15;
  let text = '';
  let options = [];
  let image = null;

  // 이미지는 스토리의 시작, 중간, 끝에만 보여줌 (용량 제한)
  if (pageNumber === 1) {
    image = 'https://images.unsplash.com/photo-1514068574489-503a8eb91592?auto=format&fit=crop&w=800&q=80';
    text = `"${theme}" 세계로 모험을 시작합니다! 어느 날 주인공은 우연히 이상한 빛을 뿜는 문을 발견했어요. 문 너머에서는 누군가 도움을 청하는 목소리가 들립니다.`;
    options = ['용기를 내어 문을 열어본다.', '친구를 먼저 부르러 간다.'];
  } else if (pageNumber === Math.floor(totalTurns / 2)) {
    image = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';
    text = `[${previousInput}] 행동을 했더니, 거대한 숲 한가운데 도착했어요. 해가 지고 주변이 어두워지기 시작합니다. 멀리서 바스락거리는 소리가 들리네요!`;
    options = ['소리가 나는 곳으로 조심스럽게 다가간다.', '가방에서 손전등을 꺼내 비춰본다.'];
  } else if (pageNumber === totalTurns) {
    image = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80';
    text = `마침내 주인공은 [${previousInput}]의 결정 덕분에 무사히 목적지에 도착했어요! 어려운 순간도 있었지만, 스스로의 힘으로 멋지게 문제를 해결했답니다. 이 모험은 오랫동안 주인공의 마음속에 행복한 기억으로 남을 거예요.`;
    options = [];
  } else {
    // 일반 턴 (짧은 지문)
    const fillerTexts = [
      `[${previousInput}] 정말 좋은 생각이에요! 그 덕분에 눈앞에 막혀있던 장애물이 사라졌어요. 다음에는 무엇을 해볼까요?`,
      `[${previousInput}](을)를 선택했군요. 그러자 숨어있던 요정이 나타나 힌트를 주었습니다. "오른쪽 길과 왼쪽 길 중 하나를 골라!"`,
      `[${previousInput}]의 행동에 동물 친구들이 기뻐하며 박수를 칩니다! 이제 산을 넘어야 하는데, 어떻게 올라갈까요?`,
      `[${previousInput}]! 아주 용감한 행동이었어요. 갑자기 비가 쏟아지기 시작하는데, 어디로 피하는 게 좋을까요?`,
      `[${previousInput}](이)가 통했어요! 상자가 열리고 반짝이는 열쇠가 나왔습니다. 이 열쇠로 무엇을 열어볼까요?`
    ];
    
    // 무작위 짧은 지문 선택 (결과를 다양하게)
    text = fillerTexts[(pageNumber + previousInput.length) % fillerTexts.length];
    
    // 무작위 선택지 생성
    const defaultOptions = [
      ['오른쪽 길로 간다.', '왼쪽 길로 간다.'],
      ['빠르게 뛰어간다.', '천천히 주위를 살피며 간다.'],
      ['열쇠를 사용해본다.', '주머니에 소중히 보관한다.'],
      ['도와달라고 큰 소리로 외친다.', '주변에 쓸만한 도구가 있는지 찾는다.'],
      ['요정에게 선물을 준다.', '요정의 길 안내를 따른다.']
    ];
    options = defaultOptions[pageNumber % 5];
  }

  return { text, options, image, isLastPage: pageNumber === totalTurns };
};
