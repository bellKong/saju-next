import {
  getSolarToLunar,
  getLunarToSolar,
  get24Divisions,
  type JeolgiInfo,
} from "./kasi";

// 천간 (10 Heavenly Stems)
const CHEONGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const CHEONGAN_KR = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"] as const;

// 지지 (12 Earthly Branches)
const JIJI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
const JIJI_KR = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"] as const;

// 오행 매핑
const CHEONGAN_OHANG: Record<string, string> = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
};
const JIJI_OHANG: Record<string, string> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土",
  巳: "火", 午: "火", 未: "土", 申: "金", 酉: "金",
  戌: "土", 亥: "水",
};

// 12절기 이름 (월 경계용 절기만, 순서: 1월~12월)
const JEOLGI_MONTHS = [
  "입춘", "경칩", "청명", "입하", "망종", "소서",
  "입추", "백로", "한로", "입동", "대설", "소한",
] as const;

// 시간 → 지지 매핑
function hourToJiji(hour: number): number {
  // 23-01=子(0), 01-03=丑(1), 03-05=寅(2), ...
  if (hour >= 23 || hour < 1) return 0; // 子
  return Math.floor((hour + 1) / 2);
}

// 일간 기준 시간 천간 시작 인덱스
// 甲/己일 → 甲子시(0), 乙/庚일 → 丙子시(2), 丙/辛일 → 戊子시(4), 丁/壬일 → 庚子시(6), 戊/癸일 → 壬子시(8)
function getShiganBase(ilganIndex: number): number {
  return (ilganIndex % 5) * 2;
}

// 한자 간지 문자열에서 천간/지지 추출 (예: "갑자(甲子)" → { gan: "甲", ji: "子" })
function parseGanji(str: string): { gan: string; ji: string } | null {
  // 괄호 안의 한자 추출
  const match = str.match(/\(([^)]+)\)/);
  if (match && match[1].length >= 2) {
    return { gan: match[1][0], ji: match[1][1] };
  }
  // 한자가 직접 나온 경우
  for (let i = 0; i < str.length - 1; i++) {
    if (CHEONGAN.includes(str[i] as any) && JIJI.includes(str[i + 1] as any)) {
      return { gan: str[i], ji: str[i + 1] };
    }
  }
  return null;
}

export interface SajuInput {
  birthDate: string; // "YYYY-MM-DD"
  birthTime?: string; // "HH:MM" or "모름"
  calendarType?: string; // "양력" | "음력"
  gender: string; // "male" | "female"
}

export interface Pillar {
  gan: string; // 천간 한자
  ji: string; // 지지 한자
  ganKr: string; // 천간 한글
  jiKr: string; // 지지 한글
  ohangGan: string; // 천간 오행
  ohangJi: string; // 지지 오행
}

export interface SajuResult {
  yearPillar: Pillar; // 연주
  monthPillar: Pillar; // 월주
  dayPillar: Pillar; // 일주
  timePillar: Pillar | null; // 시주 (시간 모를 때 null)
  ohang: Record<string, number>; // 오행 집계
  solarDate: string; // 양력 생년월일
  lunarDate: string; // 음력 생년월일
  sajuYear: number; // 사주 계산에 사용된 연도 (입춘 기준)
}

function makePillar(ganIndex: number, jiIndex: number): Pillar {
  const gan = CHEONGAN[ganIndex % 10];
  const ji = JIJI[jiIndex % 12];
  return {
    gan,
    ji,
    ganKr: CHEONGAN_KR[ganIndex % 10],
    jiKr: JIJI_KR[jiIndex % 12],
    ohangGan: CHEONGAN_OHANG[gan],
    ohangJi: JIJI_OHANG[ji],
  };
}

function countOhang(pillars: (Pillar | null)[]): Record<string, number> {
  const count: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const p of pillars) {
    if (!p) continue;
    count[p.ohangGan]++;
    count[p.ohangJi]++;
  }
  return count;
}

// 절기 데이터에서 특정 절기의 Date 객체 생성
function jeolgiToDate(jeolgi: JeolgiInfo): Date {
  const dateStr = String(jeolgi.locdate);
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));
  const [hour, minute] = (jeolgi.kst || "00:00").split(":").map(Number);
  return new Date(year, month, day, hour, minute);
}

export async function calculateSaju(input: SajuInput): Promise<SajuResult> {
  const { birthDate, birthTime, calendarType, gender } = input;

  // 1. Parse birth date
  const [bYear, bMonth, bDay] = birthDate.split("-").map(Number);
  let solYear = bYear;
  let solMonth = bMonth;
  let solDay = bDay;

  // 2. 음력→양력 변환
  let lunarDateStr = "";
  if (calendarType === "음력") {
    const sol = await getLunarToSolar(bYear, bMonth, bDay);
    solYear = sol.solYear;
    solMonth = sol.solMonth;
    solDay = sol.solDay;
    lunarDateStr = `${bYear}-${String(bMonth).padStart(2, "0")}-${String(bDay).padStart(2, "0")}`;
  }

  // 3. Parse birth time
  let birthHour: number | null = null;
  if (birthTime && birthTime !== "모름") {
    const timeParts = birthTime.split(":");
    if (timeParts.length >= 2) {
      birthHour = parseInt(timeParts[0]);
    }
  }

  // 4. 야자시 처리: 23시 이후 → 일주용 날짜 +1
  let ilDate = new Date(solYear, solMonth - 1, solDay);
  if (birthHour !== null && birthHour >= 23) {
    ilDate = new Date(solYear, solMonth - 1, solDay + 1);
  }

  // 5. 출생 시각 Date 객체
  const birthDateTime = new Date(
    solYear,
    solMonth - 1,
    solDay,
    birthHour ?? 12,
    0
  );

  // 6. KASI 데이터 병렬 fetch
  const [lunarInfo, lunarInfoIl, jeolgiData, jeolgiPrevYear] = await Promise.all([
    getSolarToLunar(solYear, solMonth, solDay),
    // 야자시로 날짜가 바뀐 경우 일주용 별도 조회
    birthHour !== null && birthHour >= 23
      ? getSolarToLunar(ilDate.getFullYear(), ilDate.getMonth() + 1, ilDate.getDate())
      : Promise.resolve(null),
    get24Divisions(solYear),
    // 1~2월생은 전년 절기도 필요 (입춘 비교)
    solMonth <= 2 ? get24Divisions(solYear - 1) : Promise.resolve([]),
  ]);

  // 음력 날짜 문자열
  if (!lunarDateStr) {
    lunarDateStr = `${lunarInfo.lunYear}-${String(lunarInfo.lunMonth).padStart(2, "0")}-${String(lunarInfo.lunDay).padStart(2, "0")}`;
  }
  const solarDateStr = `${solYear}-${String(solMonth).padStart(2, "0")}-${String(solDay).padStart(2, "0")}`;

  // 7. 일주 (日柱): KASI lunIljin에서 파싱
  const ilGanji = parseGanji((lunarInfoIl || lunarInfo).lunIljin);
  if (!ilGanji) {
    throw new Error(`Failed to parse ilju from KASI: ${lunarInfo.lunIljin}`);
  }
  const ilGanIndex = CHEONGAN.indexOf(ilGanji.gan as any);
  const ilJiIndex = JIJI.indexOf(ilGanji.ji as any);
  const dayPillar = makePillar(ilGanIndex, ilJiIndex);

  // 8. 연주 (年柱): 입춘 기준
  // 올해 + 전년도 절기에서 입춘 찾기
  const allJeolgi = [...jeolgiPrevYear, ...jeolgiData];
  const ipchunList = allJeolgi.filter((j) => j.dateName === "입춘");

  // 가장 가까운 이전/이후 입춘 찾기
  let sajuYear = solYear;
  if (ipchunList.length > 0) {
    // 해당 연도의 입춘
    const thisYearIpchun = ipchunList.find((j) => {
      const d = String(j.locdate);
      return parseInt(d.substring(0, 4)) === solYear;
    });
    if (thisYearIpchun) {
      const ipchunDate = jeolgiToDate(thisYearIpchun);
      if (birthDateTime < ipchunDate) {
        sajuYear = solYear - 1;
      }
    }
  }

  // 연주: (사주연도 - 4) % 60 → 60갑자 인덱스
  const yearGapjaIndex = ((sajuYear - 4) % 60 + 60) % 60;
  const yearGanIndex = yearGapjaIndex % 10;
  const yearJiIndex = yearGapjaIndex % 12;
  const yearPillar = makePillar(yearGanIndex, yearJiIndex);

  // 9. 월주 (月柱): 12절기 경계 기준
  // 절기월 판별: 각 절기 시작 시각과 비교
  let jeolgiMonth = 1; // 기본값: 인월(1)
  for (let m = 0; m < JEOLGI_MONTHS.length; m++) {
    const jeolgiName = JEOLGI_MONTHS[m];
    const found = allJeolgi.find((j) => {
      const d = String(j.locdate);
      const jYear = parseInt(d.substring(0, 4));
      // 소한은 다음해 1월에 올 수 있음
      if (jeolgiName === "소한") {
        return j.dateName === jeolgiName && (jYear === solYear || jYear === solYear + 1);
      }
      return j.dateName === jeolgiName && jYear === sajuYear + (m < 11 ? 0 : 1);
    });
    if (found) {
      const jeolgiDate = jeolgiToDate(found);
      if (birthDateTime >= jeolgiDate) {
        jeolgiMonth = m + 1; // 1=인월, 2=묘월, ...
      }
    }
  }

  // 월주 지지: 인월(1)=寅(2), 묘월(2)=卯(3), ..., 축월(12)=丑(1)
  const monthJiIndex = (jeolgiMonth + 1) % 12;

  // 월주 천간: 연간 기준 공식
  const monthGanIndex = (yearGanIndex * 2 + 2 + (jeolgiMonth - 1)) % 10;
  const monthPillar = makePillar(monthGanIndex, monthJiIndex);

  // 10. 시주 (時柱)
  let timePillar: Pillar | null = null;
  if (birthHour !== null) {
    const shiJiIndex = hourToJiji(birthHour);
    const shiGanBase = getShiganBase(ilGanIndex);
    const shiGanIndex = (shiGanBase + shiJiIndex) % 10;
    timePillar = makePillar(shiGanIndex, shiJiIndex);
  }

  // 11. 오행 집계
  const ohang = countOhang([yearPillar, monthPillar, dayPillar, timePillar]);

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    timePillar,
    ohang,
    solarDate: solarDateStr,
    lunarDate: lunarDateStr,
    sajuYear,
  };
}
