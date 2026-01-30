import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSaju(input: {
  birthDate: string;
  birthTime: string;
  gender: string;
}) {
  const prompt = `다음 정보를 바탕으로 사주팔자를 분석해주세요:
- 생년월일: ${input.birthDate}
- 출생시간: ${input.birthTime}
- 성별: ${input.gender === "male" ? "남성" : "여성"}

상세한 사주 분석을 제공해주세요. 다음 항목을 포함해주세요:
1. 사주팔자 (천간, 지지)
2. 오행 분석
3. 성격 및 특성
4. 직업 운
5. 재물 운
6. 건강 운
7. 애정 운
8. 총평

전문적이고 진지한 톤으로 작성해주세요.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "당신은 전문 사주명리학자입니다. 정확하고 상세한 사주 분석을 제공합니다.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

export async function generateCompatibility(input: {
  person1: { birthDate: string; gender: string };
  person2: { birthDate: string; gender: string };
}) {
  const prompt = `다음 두 사람의 궁합을 분석해주세요:

첫 번째 사람:
- 생년월일: ${input.person1.birthDate}
- 성별: ${input.person1.gender === "male" ? "남성" : "여성"}

두 번째 사람:
- 생년월일: ${input.person2.birthDate}
- 성별: ${input.person2.gender === "male" ? "남성" : "여성"}

다음 항목을 포함한 궁합 분석을 제공해주세요:
1. 전반적인 궁합 점수 (100점 만점)
2. 성격 궁합
3. 가치관 궁합
4. 소통 방식
5. 갈등 해결 방식
6. 장기적 관계 전망
7. 주의할 점
8. 조언

전문적이고 건설적인 조언을 제공해주세요.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "당신은 전문 사주명리학자이자 관계 상담가입니다.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

export async function generateFortune(input: {
  birthDate: string;
  gender: string;
}) {
  const today = new Date().toLocaleDateString("ko-KR");

  const prompt = `다음 정보를 바탕으로 오늘(${today})의 운세를 봐주세요:
- 생년월일: ${input.birthDate}
- 성별: ${input.gender === "male" ? "남성" : "여성"}

다음 항목을 포함해주세요:
1. 오늘의 총운
2. 애정운
3. 금전운
4. 직장운/학업운
5. 건강운
6. 행운의 색깔
7. 행운의 숫자
8. 오늘의 조언

긍정적이면서도 현실적인 조언을 제공해주세요.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "당신은 전문 사주명리학자입니다. 오늘의 운세를 봐줍니다.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8,
  });

  return completion.choices[0].message.content;
}
