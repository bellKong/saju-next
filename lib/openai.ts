import Anthropic from "@anthropic-ai/sdk";
import type { SajuResult } from "./saju-calculator";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function formatPillar(p: SajuResult["yearPillar"]) {
  return `${p.ganKr}${p.jiKr}(${p.gan}${p.ji}) [${p.ohangGan}/${p.ohangJi}]`;
}

function formatSajuData(sajuResult: SajuResult): string {
  const { yearPillar, monthPillar, dayPillar, timePillar, ohang, solarDate, lunarDate, sajuYear } = sajuResult;
  let text = `[만세력 기반 사주팔자 데이터]
- 양력: ${solarDate}
- 음력: ${lunarDate}
- 사주 연도(입춘 기준): ${sajuYear}년

■ 사주팔자:
  연주(年柱): ${formatPillar(yearPillar)}
  월주(月柱): ${formatPillar(monthPillar)}
  일주(日柱): ${formatPillar(dayPillar)}`;

  if (timePillar) {
    text += `\n  시주(時柱): ${formatPillar(timePillar)}`;
  } else {
    text += `\n  시주(時柱): 출생시간 미상`;
  }

  text += `\n\n■ 오행 분포:
  木(목): ${ohang["木"]}개, 火(화): ${ohang["火"]}개, 土(토): ${ohang["土"]}개, 金(금): ${ohang["金"]}개, 水(수): ${ohang["水"]}개`;

  return text;
}

export async function generateSaju(input: {
  birthDate: string;
  birthTime: string;
  gender: string;
  sajuResult?: SajuResult;
}) {
  let systemContent: string;
  let prompt: string;

  if (input.sajuResult) {
    systemContent = "당신은 전문 사주명리학자입니다. 만세력 데이터를 기반으로 정확하고 상세한 사주 분석을 제공합니다. 제공된 사주팔자 데이터는 천문연구원 만세력으로 정확히 계산된 것이므로, 이 데이터를 그대로 사용하여 해석만 해주세요. 사주팔자를 다시 계산하지 마세요.";
    prompt = `${formatSajuData(input.sajuResult)}

- 성별: ${input.gender === "male" ? "남성" : "여성"}

위 만세력 데이터를 기반으로 사주 분석을 제공해주세요. 다음 항목을 포함해주세요:
1. 사주팔자 요약 (위 데이터 기반)
2. 오행 분석 (과다/부족 해석)
3. 성격 및 특성
4. 직업 운
5. 재물 운
6. 건강 운
7. 애정 운
8. 총평

전문적이고 진지한 톤으로 작성해주세요.`;
  } else {
    systemContent = "당신은 전문 사주명리학자입니다. 정확하고 상세한 사주 분석을 제공합니다.";
    prompt = `다음 정보를 바탕으로 사주팔자를 분석해주세요:
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
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: systemContent,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : null;
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

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: "당신은 전문 사주명리학자이자 관계 상담가입니다.",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : null;
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

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: "당신은 전문 사주명리학자입니다. 오늘의 운세를 봐줍니다.",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : null;
}
