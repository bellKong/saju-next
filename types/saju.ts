export interface Pillar {
  gan: string;
  ji: string;
  ganKr: string;
  jiKr: string;
  ohangGan: string;
  ohangJi: string;
}

export interface SajuResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  timePillar: Pillar | null;
  ohang: Record<string, number>;
  solarDate: string;
  lunarDate: string;
  sajuYear: number;
}

export interface LatestReading {
  id: string;
  result: { content: string } | null;
  summary: string | null;
  input: Record<string, string>;
  createdAt: string;
}

export interface Person {
  id: string;
  name: string;
  relationship: string;
  birthDate: string;
  birthTime: string | null;
  calendarType: string;
  gender: string;
  manseryeok: SajuResult | null;
  latestReading: LatestReading | null;
}
