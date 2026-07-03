import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateStoryTurn = async (pageNumber, theme, protagonist, previousInput = '', grade = 'low', historyContext = '') => {
  const TOTAL_TURNS = grade === 'low' ? 10 : 15;
  const isMock = !genAI || !apiKey || apiKey === 'your_gemini_api_key_here';

  // Fallback to mock if API key is missing
  if (isMock) {
    console.warn("Gemini API Key가 없습니다. Mock 데이터를 반환합니다.");
    return generateMockTurn(pageNumber, theme, protagonist, previousInput, grade, TOTAL_TURNS);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    // 기승전결 흐름 계산
    let narrativePhase = '';
    if (pageNumber <= (grade === 'low' ? 2 : 3)) {
      narrativePhase = '발단(기): 이야기의 배경과 주인공의 현재 상황을 소개하며 이야기를 흥미롭게 시작해.';
    } else if (pageNumber <= (grade === 'low' ? 6 : 9)) {
      narrativePhase = '전개(승): 평화로운 일상에 갑자기 예상치 못한 문제나 뚜렷한 위기(Crisis)가 발생해. 주인공이 곤경에 처하거나 갈등이 고조되는 사건을 만들어줘.';
    } else if (pageNumber <= (grade === 'low' ? 8 : 13)) {
      narrativePhase = '절정(전): 위기와 갈등이 최고조에 달하는 가장 긴장감 넘치는 순간이야! 주인공이 용기를 내어 문제를 정면으로 마주하고 해결책을 시도하게 만들어.';
    } else {
      narrativePhase = '결말(결): 문제를 완전히 해결하고, 큰 깨달음이나 감동을 얻으며 따뜻하고 여운이 남는 결말을 지어.';
    }

    const prompt = `
    너는 ${grade === 'low' ? '초등학교 1~3학년' : '초등학교 4~6학년'} 수준에 맞는 감성적이고 현실적인 동화 작가야.
    주제: ${theme}
    주인공 이름: ${protagonist.name} (캐릭터 특징: ${protagonist.type})
    현재 진행 단계: ${pageNumber} / ${TOTAL_TURNS}
    현재 소설 흐름: ${narrativePhase}
    
    [이전 이야기 진행 상황]
    ${historyContext || '이야기 첫 시작'}

    위 상황과 '현재 소설 흐름', 그리고 '이전 이야기 진행 상황'에 완벽히 맞춰 앞선 맥락과 이어지도록 이야기를 전개해줘. 특히 마지막 사용자의 행동에 대한 자연스러운 결과가 이어져야 해. 갑자기 맥락에 맞지 않는 뜬금없는 사건을 발생시키지 마.
    단순한 일기장이나 평범한 나열식 이야기가 되지 않도록, 소설처럼 위기, 갈등, 해결이 명확한 기승전결 구조를 확실하게 보여줘.
    판타지나 무리한 모험보다는, 아이들이 실제로 겪을 만한 일상이나 동물이 겪을 만한 생활 이야기를 중심으로 공감할 수 있는 스토리를 만들어.
    
    [중요 규칙]
    1. ${grade === 'low' ? '**[글자수 및 어휘 엄격 제한]** 반드시 딱 1~2문장(최대 50자 이내)으로 아주 짧고 단순하게 핵심만 말해. **8~10살(초등학교 1~3학년)이 쉽게 이해할 수 있는 아주 쉬운 일상 단어만 사용해.** (예: 관제탑, 설상가상, 고조되는 등 어려운 한자어 절대 금지). 불필요한 묘사는 모두 생략해.' : '어린이가 읽기 쉽게 2~3문장 정도로 간결하게 작성해.'}
    2. 이전 단계들과 비슷한 유형의 질문을 반복하지 마. (예: 맨날 장소만 묻지 말고, 감정을 묻거나, 도구 사용 방법을 묻거나, 친구에게 할 대사를 고르게 하는 등 매번 다른 유형의 질문을 던져)
    3. ${pageNumber === TOTAL_TURNS ? '마지막 15단계이므로 감동적인 결말을 완성하고, 선택지(options)와 질문(question)은 빈칸으로 반환해.' : '주인공이 다음으로 할 수 있는 행동 선택지 2개를 만들어줘.'}
    4. **절대 사용자의 선택을 직접 언급하지 마세요.** (예: "네가 ~를 선택했구나", "주인공이 ~하기로 결정했어" 금지) 마치 원래 한 권의 책이었던 것처럼, 이전 선택 행동을 매우 자연스럽게 다음 문장으로 이어서 묘사하세요. 챗봇이나 게임이라는 흔적을 절대 남기지 마세요.
    
    반드시 아래 JSON 형식으로만 응답해:
    {
      "storyText": "순수하게 동화책에 들어갈 이야기 본문 (선택했다는 언급 절대 금지, 자연스러운 소설 문장)",
      "question": "${pageNumber === TOTAL_TURNS ? '' : '아이에게 물어보는 1문장짜리 질문 (예: 이제 어떻게 할까?, 너라면 무슨 말을 할래?)'}",
      "options": ${pageNumber === TOTAL_TURNS ? '[]' : '["선택지1", "선택지2"]'},
      "imagePromptEn": "A short English phrase describing the current scene visually for AI image generation, simple cute cartoon style (e.g. 'cute rabbit running in forest')",
      "isLastPage": ${pageNumber === TOTAL_TURNS}
    }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON 추출
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON 파싱 실패");
    
    const parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    
    // 첫 페이지에 한해 고품질 삽화 생성 (영문 프롬프트 활용)
    if (pageNumber === 1 && parsedData.imagePromptEn) {
      parsedData.image = `https://image.pollinations.ai/prompt/${encodeURIComponent(parsedData.imagePromptEn + ' cute kawaii children book illustration, 2d flat vector, simple pastel colors')}?width=800&height=500&nologo=true`;
    }

    return parsedData;

  } catch (err) {
    console.error("Gemini API 호출 에러:", err);
    if (!isMock) {
       return {
          storyText: `(앗, AI 작가님이 잠시 멈췄어요. 상세 에러: ${err.message.substring(0, 50)}...) 잠시 후 다시 진행해주세요!`,
          question: `다시 시도해볼까요?`,
          options: [previousInput || '다시 시도'],
          isLastPage: false
       };
    }
    return generateMockTurn(pageNumber, theme, protagonist, previousInput, grade, TOTAL_TURNS);
  }
};

const generateMockTurn = async (pageNumber, theme, protagonist, previousInput, grade, TOTAL_TURNS) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let result = {};

  if (pageNumber === 1) {
    result = {
      storyText: `따사로운 어느 날, 평범하지만 특별한 ${protagonist.type} ${protagonist.name}(이)가 동네를 산책하고 있었어. 오늘따라 "${theme}"에 대한 생각이 머릿속을 맴돌았지.`,
      question: `어떻게 시작할까?`,
      options: ['주변을 두리번거리며 걷는다.', '콧노래를 부르며 신나게 뛰어간다.'],
      isLastPage: false,
      image: `https://image.pollinations.ai/prompt/${encodeURIComponent(theme + ' ' + protagonist.type + ' fairy tale illustration cute colorful flat vector')}?width=800&height=500&nologo=true`
    };
  } else if (pageNumber === TOTAL_TURNS) {
    result = {
      storyText: `네가 [${previousInput}]라고 해준 덕분에, ${protagonist.name}(은)는 오늘 하루 큰 깨달음을 얻었어! 서로 돕고 이해하는 마음이 중요하다는 걸 배웠지. 내일은 또 어떤 따뜻한 일이 펼쳐질까?`,
      question: ``,
      options: [],
      isLastPage: true
    };
  } else {
    const fillerTexts = [
      `[${previousInput}]! 참 따뜻한 선택이야. ${protagonist.name}(은)는 그렇게 행동했어. 그런데 저기서 친구가 시무룩한 표정으로 벤치에 앉아 있네.`,
      `지나가던 이웃 아주머니가 빙그레 웃으시며 칭찬해 주셨어. 마음이 포근해졌지.`,
      `바닥에 누군가 잃어버린 예쁜 수첩이 떨어져 있는 걸 발견했어. 꽤 소중해 보이네.`,
      `와, 정말 용기 있는 선택이었어. 덕분에 친구와 사소한 오해를 풀 수 있었지. 친구가 미안하고 고맙다며 간식을 내밀어.`,
      `그런데 갑자기 하늘이 어두워지더니 비가 주룩주룩 내리기 시작해. 우산이 없네.`
    ];
    
    const questions = [
      `무슨 일일까?`,
      `이제 어떻게 할까?`,
      `이 수첩을 어떻게 할까?`,
      `간식을 어떻게 할까?`,
      `이 비를 어떻게 피하는 게 좋을까?`
    ];

    const defaultOptions = [
      ['친구 곁으로 다가가 무슨 일인지 물어본다.', '방해될까 봐 조용히 지나간다.'],
      ['아주머니께 씩씩하게 배꼽 인사를 한다.', '쑥스러워서 얼굴을 붉히며 도망친다.'],
      ['주인을 찾아주기 위해 경찰서(파출소)에 가져간다.', '그냥 그 자리에 그대로 둔다.'],
      ['간식을 기쁘게 받아들고 나눠 먹는다.', '마음만 받겠다며 정중히 거절한다.'],
      ['가방으로 머리를 가리고 처마 밑으로 뛰어간다.', '근처의 큰 나무 밑으로 잠시 비를 피한다.']
    ];

    const idx = (pageNumber + (previousInput ? previousInput.length : 0)) % fillerTexts.length;

    result = {
      storyText: fillerTexts[idx],
      question: questions[idx],
      options: defaultOptions[idx],
      isLastPage: false
    };
  }
  return result;
};
